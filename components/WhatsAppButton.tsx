"use client";

import { usePathname } from "next/navigation";

import { jcdPhone } from "@/lib/content";
import { whatsappHref } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import styles from "./WhatsAppButton.module.css";

/**
 * Floating WhatsApp link, present on every page.
 *
 * It sits above the page rather than inside a section so it stays reachable
 * from anywhere, and opens in a new tab because WhatsApp is a separate app.
 * The label only appears on hover, so at rest it is just the icon.
 *
 * The dashboard is staff-facing, so the public contact button is left off it.
 */
export default function WhatsAppButton({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  const label = locale === "ar" ? "تواصل عبر واتساب" : "Chat on WhatsApp";

  return (
    <a
      className={styles.button}
      href={whatsappHref(jcdPhone)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23a8.2 8.2 0 0 1 8.24 8.24c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28Z" />
      </svg>
      <span className={styles.label}>{label}</span>
    </a>
  );
}
