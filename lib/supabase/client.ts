"use client";

import { createBrowserClient } from "@supabase/ssr";

import { requireSupabaseConfig } from "./env";
import type { Database } from "./types";

let cached: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createSupabaseBrowserClient() {
  if (!cached) {
    const { url, anonKey } = requireSupabaseConfig();
    cached = createBrowserClient<Database>(url, anonKey);
  }
  return cached;
}
