"use client";

import { useEffect, useId, useState } from "react";

import type { Locale } from "@/lib/i18n";
import styles from "./MobileNav.module.css";

type Item = { label: string; href: string };

export default function MobileNav({
  items,
  locale,
}: {
  items: readonly Item[];
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  // Close on Escape, and don't let the page scroll behind the open panel.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button
        className={styles.toggle}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={
          locale === "ar"
            ? open
              ? "إغلاق القائمة"
              : "فتح القائمة"
            : open
              ? "Close menu"
              : "Open menu"
        }
      >
        <span className={open ? styles.barTop : styles.bar} />
        <span className={open ? styles.barHidden : styles.bar} />
        <span className={open ? styles.barBottom : styles.bar} />
      </button>

      {open && (
        <div className={styles.panel} id={panelId}>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.href}>
                <a
                  className={styles.link}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
