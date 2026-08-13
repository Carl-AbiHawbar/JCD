"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import styles from "./SiteHeader.module.css";

/**
 * Switches the site language.
 *
 * The locale is a cookie rather than client state so the server renders the
 * right language on the first paint — the page bands, the footer and the
 * document's `lang`/`dir` all come from it. `router.refresh()` re-runs the
 * server render in place, so the toggle does not lose scroll position.
 */
export default function LanguageToggle({
  label,
  next,
}: {
  label: string;
  next: "ar" | "en";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo() {
    // One year, site-wide, and readable by the server on the next request.
    document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <button
      className={styles.langToggle}
      type="button"
      onClick={switchTo}
      disabled={pending}
      lang={next}
      aria-label={next === "en" ? "Switch to English" : "التبديل إلى العربية"}
    >
      {label}
    </button>
  );
}
