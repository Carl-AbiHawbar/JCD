"use client";

import { useState } from "react";

import { ChevronDownIcon } from "./icons";
import styles from "./sections.module.css";

type Item = { question: string; answer: string };

/**
 * The mockup shows every answer visible at once, so rows start expanded and
 * more than one may be open.
 */
export default function Accordion({ items }: { items: Item[] }) {
  const [closed, setClosed] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setClosed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className={styles.accordion}>
      {items.map((item, i) => {
        const isOpen = !closed.has(i);
        const panelId = `faq-panel-${i}`;

        return (
          <div className={styles.row} key={`${i}-${item.question}`}>
            <button
              className={styles.rowButton}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(i)}
            >
              <span>{item.question}</span>
              <span className={isOpen ? styles.chevronOpen : styles.chevron}>
                <ChevronDownIcon />
              </span>
            </button>

            {isOpen && (
              <div className={styles.answer} id={panelId}>
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
