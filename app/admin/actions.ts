"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getResource, type Field } from "@/lib/admin/resources";

export type ActionState = { error?: string } | undefined;

/** Minimal surface used by the runtime-dispatched CRUD below. */
type UntypedResult = Promise<{ error: { message: string } | null }>;
type UntypedClient = {
  from(table: string): {
    update(payload: Record<string, unknown>): { eq(col: string, val: string): UntypedResult };
    insert(payload: Record<string, unknown>): UntypedResult;
    delete(): { eq(col: string, val: string): UntypedResult };
  };
};

/* ------------------------------------------------------------------ auth */

export async function signIn(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "البريد الإلكتروني وكلمة المرور مطلوبان." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "بيانات الدخول غير صحيحة." };

  // Authenticating is not enough — the account must be an admin.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: admin } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user?.id ?? "")
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    return { error: "هذا الحساب لا يملك صلاحية الدخول إلى لوحة التحكم." };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* -------------------------------------------------------------- helpers */

/** Turns submitted strings into the types the column expects. */
function coerce(field: Field, raw: FormDataEntryValue | null) {
  const value = typeof raw === "string" ? raw.trim() : "";

  switch (field.type) {
    case "number":
      return value === "" ? 0 : Number(value);
    case "datetime":
      return value === "" ? null : new Date(value).toISOString();
    default:
      return value === "" ? null : value;
  }
}

function buildPayload(fields: Field[], formData: FormData) {
  const payload: Record<string, unknown> = {};
  for (const field of fields) {
    payload[field.name] = coerce(field, formData.get(field.name));
  }
  return payload;
}

function validate(fields: Field[], payload: Record<string, unknown>) {
  for (const field of fields) {
    if (field.required && (payload[field.name] === null || payload[field.name] === "")) {
      return `الحقل "${field.label}" مطلوب.`;
    }
  }
  return null;
}

/* ----------------------------------------------------------- generic CRUD */

export async function saveResource(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const name = String(formData.get("__resource") ?? "");
  const id = String(formData.get("__id") ?? "");
  const config = getResource(name);
  if (!config) return { error: "نوع المحتوى غير معروف." };

  const payload = buildPayload(config.fields, formData);
  const invalid = validate(config.fields, payload);
  if (invalid) return { error: invalid };

  // This path writes to a table chosen at runtime, which the typed client
  // cannot express — across a union of tables the accepted payload type
  // collapses to `never`. The table name is validated against the registry
  // above and the payload is built from that same registry, so the untyped
  // handle is confined to these two calls.
  const supabase = await createSupabaseServerClient();
  const db = supabase as unknown as UntypedClient;

  const { error } = id
    ? await db.from(config.table).update(payload).eq("id", id)
    : await db.from(config.table).insert(payload);

  if (error) return { error: error.message };

  revalidatePath(`/admin/${name}`);
  revalidatePath("/");
  redirect(`/admin/${name}`);
}

export async function deleteResource(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get("__resource") ?? "");
  const id = String(formData.get("__id") ?? "");
  const config = getResource(name);
  if (!config || !id) return;

  const supabase = await createSupabaseServerClient();
  const db = supabase as unknown as UntypedClient;
  await db.from(config.table).delete().eq("id", id);

  revalidatePath(`/admin/${name}`);
  revalidatePath("/");
  redirect(`/admin/${name}`);
}
