import "server-only";

import { cookies } from "next/headers";

export type Locale = "ar" | "en";

export const LOCALE_COOKIE = "lang";
export const DEFAULT_LOCALE: Locale = "ar";

export function isLocale(value: unknown): value is Locale {
  return value === "ar" || value === "en";
}

export function dir(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

/** Locale for this request, from the cookie the header toggle sets. */
export async function currentLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
