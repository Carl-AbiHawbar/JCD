import type { Locale } from "@/lib/i18n";
import styles from "./TalkToNour.module.css";

/**
 * Floating link to the Nour companion app.
 *
 * It sits above the page rather than inside a section so it stays reachable
 * from anywhere, and opens in a new tab because it is a separate application.
 */
export default function TalkToNour({ locale }: { locale: Locale }) {
  const label = locale === "ar" ? "تحدّث مع نور" : "Talk to Nour";

  return (
    <a
      className={styles.button}
      href="https://jcd-nour.vercel.app/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
      </svg>
      <span className={styles.label}>{label}</span>
    </a>
  );
}
