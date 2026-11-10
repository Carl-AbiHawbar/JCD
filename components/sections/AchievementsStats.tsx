"use client";

import { useId, useState } from "react";

import styles from "./sections.module.css";

/** The achievements band's figures, kept behind a button as the brief asks. */
export default function AchievementsStats({
  reveal,
  conceal,
  stats,
}: {
  reveal: string;
  conceal: string;
  stats: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <>
      <button
        className={styles.teaserCta}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? conceal : reveal}
      </button>

      <dl className={styles.figures} id={panelId} hidden={!open}>
        {stats.map((stat) => (
          <div className={styles.figure} key={stat.label}>
            <dt className={styles.figureLabel}>{stat.label}</dt>
            <dd className={styles.figureValue} dir="ltr">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
