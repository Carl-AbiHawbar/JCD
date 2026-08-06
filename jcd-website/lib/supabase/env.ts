/**
 * Reads Supabase configuration without throwing at import time.
 *
 * The site must still build and render before anyone has filled in
 * .env.local, so callers check `isSupabaseConfigured` and fall back rather
 * than crashing the page.
 */

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function requireServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is missing. Add it to .env.local — see .env.local.example.",
    );
  }
  return key;
}

export function requireSupabaseConfig() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Copy .env.local.example to .env.local and fill it in.",
    );
  }
  return { url: supabaseUrl, anonKey: supabaseAnonKey };
}
