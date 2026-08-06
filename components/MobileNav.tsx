"use client";

import { useEffect, useId, useState } from "react";

import { nav } from "@/lib/content";
import styles from "./MobileNav.module.css";

export default function MobileNav() {
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
        aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
      >
        <span className={open ? styles.barTop : styles.bar} />
        <span className={open ? styles.barHidden : styles.bar} />
        <span className={open ? styles.barBottom : styles.bar} />
      </button>

      {open && (
        <div className={styles.panel} id={panelId}>
          <ul className={styles.list}>
            {nav.map((item) => (
              <li key={item.label}>
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
