"use client";

import { useState } from "react";

import type { Checklist } from "@/lib/checklist";
import styles from "./checklist.module.css";

/**
 * The family warning-signs list. The ticks stay in this component's state
 * only: nothing is saved or sent, which matters for a page about a relative's
 * possible drug use.
 */
export default function FamilyChecklist({
  list,
  callHref,
  whatsappHref,
}: {
  list: Checklist;
  callHref: string;
  whatsappHref: string;
}) {
  const [ticked, setTicked] = useState<Set<string>>(new Set());
  const n = ticked.size;
  const reached = n >= list.threshold;

  function toggle(sign: string) {
    setTicked((current) => {
      const next = new Set(current);
      if (next.has(sign)) next.delete(sign);
      else next.add(sign);
      return next;
    });
  }

  return (
    <>
      <div className={styles.groups}>
        {list.groups.map((group) => (
          <fieldset className={styles.group} key={group.heading}>
            <legend className={styles.groupHeading}>{group.heading}</legend>
            <div className={styles.signs}>
              {group.signs.map((sign) => {
                const on = ticked.has(sign);
                return (
                  <label className={on ? styles.signOn : styles.sign} key={sign}>
                    <input type="checkbox" checked={on} onChange={() => toggle(sign)} />
                    <span>{sign}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <section
        className={reached ? styles.resultReached : styles.result}
        aria-live="polite"
      >
        <p className={styles.count}>
          {list.count} <strong dir="ltr">{n}</strong>
        </p>
        <h2 className={styles.resultHeading}>{list.whenTitle}</h2>
        <p>{reached ? list.whenBody : list.belowBody}</p>

        <div className={styles.actions}>
          <a className={styles.primary} href={callHref}>
            {list.call}
          </a>
          <a className={styles.secondary} href={whatsappHref} target="_blank" rel="noopener noreferrer">
            {list.whatsapp}
          </a>
          {n > 0 && (
            <button className={styles.reset} type="button" onClick={() => setTicked(new Set())}>
              {list.reset}
            </button>
          )}
        </div>
      </section>

      <p className={styles.important}>{list.important}</p>
    </>
  );
}
