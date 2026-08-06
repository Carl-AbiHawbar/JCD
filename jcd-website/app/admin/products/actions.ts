"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionState } from "../actions";
import type { ProductStatus } from "@/lib/supabase/types";

const STATUSES = ["draft", "published", "archived"] as const;

function isProductStatus(value: string): value is ProductStatus {
  return (STATUSES as readonly string[]).includes(value);
}

export async function saveProduct(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = String(formData.get("__id") ?? "");
  const title = String(formData.get("title_ar") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const status = String(formData.get("status") ?? "draft");

  if (!title) return { error: 'الحقل "الاسم" مطلوب.' };
  if (!slug) return { error: 'الحقل "المعرّف" مطلوب.' };
  if (!isProductStatus(status)) return { error: "حالة غير صالحة." };

  // Prices are entered in whole currency units and stored as minor units.
  const price = Number(formData.get("price") ?? 0);
  const stock = Number(formData.get("stock") ?? 0);
  if (!Number.isFinite(price) || price < 0) return { error: "السعر غير صالح." };
  if (!Number.isInteger(stock) || stock < 0) return { error: "الكمية غير صالحة." };

  const collectionId = String(formData.get("collection_id") ?? "");

  const payload = {
    title_ar: title,
    slug,
    description_ar: String(formData.get("description_ar") ?? "").trim() || null,
    price_cents: Math.round(price * 100),
    stock,
    status,
    collection_id: collectionId || null,
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  };

  const supabase = await createSupabaseServerClient();
  const { error } = id
    ? await supabase.from("products").update(payload).eq("id", id)
    : await supabase.from("products").insert(payload);

  if (error) {
    return {
      error: error.code === "23505" ? "المعرّف مستخدم بالفعل." : error.message,
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("__id") ?? "");
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from("products").delete().eq("id", id);

  revalidatePath("/admin/products");
  redirect("/admin/products");
}
