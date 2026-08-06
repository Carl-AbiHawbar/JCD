import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

import { requireServiceRoleKey, requireSupabaseConfig } from "./env";
import type { Database } from "./types";

/**
 * Request-scoped client that carries the signed-in user's session.
 * Every query it runs is subject to row level security.
 */
export async function createSupabaseServerClient() {
  const { url, anonKey } = requireSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // middleware.ts refreshes the session, so this is safe to ignore.
        }
      },
    },
  });
}

/**
 * Service-role client. Bypasses row level security entirely, so it must only
 * ever be used in server code that has already established the caller is
 * allowed to do what it is about to do.
 */
export function createSupabaseAdminClient() {
  const { url } = requireSupabaseConfig();
  return createClient<Database>(url, requireServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
