"use client";

import { useState } from "react";

import {
  APP_STORE,
  PLAY_STORE,
  paymentUi,
  whish,
  whishConfigured,
} from "@/lib/payments";
import type { Locale } from "@/lib/i18n";
import styles from "./WhishPayment.module.css";

/**
 * The Whish hand-off.
 *
 * When JCD has generated a payment link in the Whish app, this opens it.
 * Otherwise it shows the number to send to, with the reference to quote, and
 * links to install the app — because Whish has no public deep-link scheme to
 * build a payment from. With neither configured it refuses to invent a number
 * and points at the helpline instead.
 */
export default function WhishPayment({
  locale,
  amountLabel,
  reference,
}: {
  locale: Locale;
  amountLabel: string;
  reference?: string;
}) {
  const t = paymentUi[locale];
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(whish.number);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the number is on screen to read */
    }
  }

  if (!whishConfigured) {
    return (
      <div className={styles.panel}>
        <p className={styles.warn}>{t.notConfigured}</p>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <dl className={styles.summary}>
        <div>
          <dt>{t.amount}</dt>
          <dd dir="ltr">{amountLabel}</dd>
        </div>
        {reference && (
          <div>
            <dt>{t.reference}</dt>
            <dd dir="ltr">{reference}</dd>
          </div>
        )}
      </dl>

      {whish.paymentLink ? (
        <a
          className={styles.primary}
          href={whish.paymentLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.payWithWhish}
        </a>
      ) : (
        <>
          <p className={styles.numberLabel}>{t.numberLabel}</p>
          <p className={styles.number} dir="ltr">
            {whish.number}
          </p>
          <button className={styles.primary} type="button" onClick={copy}>
            {copied ? t.copied : t.copy}
          </button>
          <p className={styles.steps}>{t.steps}</p>
        </>
      )}

      <p className={styles.apps}>
        {t.getApp}:{" "}
        <a href={APP_STORE} target="_blank" rel="noopener noreferrer">
          iOS
        </a>
        {" · "}
        <a href={PLAY_STORE} target="_blank" rel="noopener noreferrer">
          Android
        </a>
      </p>
    </div>
  );
}
