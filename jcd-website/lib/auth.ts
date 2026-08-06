import "server-only";

import { redirect } from "next/navigation";

import { isSupabaseConfigured } from "./supabase/env";
import { createSupabaseServerClient } from "./supabase/server";
import type { Admin } from "./supabase/types";

/**
 * Resolves the signed-in admin, or null. Membership of public.admins — not
 * merely being authenticated — is what grants access.
 */
export async function getCurrentAdmin(): Promise<Admin | null> {
  // A layout returning early does not stop its page from rendering, so this
  // has to fail soft rather than throw when .env.local has not been set up.
  if (!isSupabaseConfigured) return null;

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("admins")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return data ?? null;
}

/** Guard for admin pages and server actions. Redirects when not permitted. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
