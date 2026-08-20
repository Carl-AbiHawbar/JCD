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
  donorName,
}: {
  locale: Locale;
  amountLabel: string;
  reference?: string;
  donorName?: string;
}) {
  const t = paymentUi[locale];
  const [copied, setCopied] = useState<"number" | "amount" | null>(null);

  async function copy(what: "number" | "amount", value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(what);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      /* clipboard blocked — both values are on screen to read */
    }
  }

  // Whish has no URL scheme to pre-fill a transfer, so the next best thing is
  // to carry every value the payer has to type and make each one copyable.
  const digitsOnly = whish.number.replace(/[^\d+]/g, "");
  const bareAmount = amountLabel.replace(/[^0-9.]/g, "");
  const note = [reference, donorName].filter(Boolean).join(" · ");

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
        {donorName && (
          <div>
            <dt>{t.donor}</dt>
            <dd>{donorName}</dd>
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
          <div className={styles.actions}>
            <button
              className={styles.primary}
              type="button"
              onClick={() => copy("number", digitsOnly)}
            >
              {copied === "number" ? t.copied : t.copy}
            </button>
            <button
              className={styles.secondary}
              type="button"
              onClick={() => copy("amount", bareAmount)}
            >
              {copied === "amount" ? t.copied : t.copyAmount}
            </button>
          </div>
          <p className={styles.steps}>{t.steps}</p>
          {note && (
            <p className={styles.steps} dir="ltr">
              {note}
            </p>
          )}
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
