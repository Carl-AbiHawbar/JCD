"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/lib/i18n";
import {
  APP_STORE,
  PLAY_STORE,
  type Platform,
  paymentUi,
  whish,
  whishConfigured,
  whishOpenUrl,
} from "@/lib/payments";
import styles from "./WhishPayment.module.css";

/**
 * The Whish hand-off.
 *
 * Whish transfers are made on its "Whish to Whish" screen, which asks for
 * exactly three things: the receiver's phone number, the amount in USD, and an
 * optional note. There is no URL scheme to pre-fill them — Whish's FAQ says a
 * payment link is generated inside the app by the recipient — so the next best
 * thing is to lay the three values out in the same order as that screen and
 * make each one copyable on its own.
 *
 * With nothing configured it refuses to invent a number and points at the
 * helpline instead.
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
  const [copied, setCopied] = useState<string | null>(null);

  // Which link opens the app depends on the phone, and the server cannot know
  // that, so it is resolved after mount. Until then the link is the download
  // page, which is right for a desktop anyway.
  const [platform, setPlatform] = useState<Platform>("other");
  useEffect(() => {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) setPlatform("android");
    else if (/iphone|ipad|ipod/i.test(ua)) setPlatform("ios");
  }, []);

  async function copy(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      /* clipboard blocked — every value is on screen to read */
    }
  }

  if (!whishConfigured) {
    return (
      <div className={styles.panel}>
        <p className={styles.warn}>{t.notConfigured}</p>
      </div>
    );
  }

  // A payment link, when JCD has generated one, skips all of this.
  if (whish.paymentLink) {
    return (
      <div className={styles.panel}>
        <p className={styles.numberLabel}>{t.amount}</p>
        <p className={styles.number} dir="ltr">
          {amountLabel}
        </p>
        <a className={styles.primary} href={whish.paymentLink}>
          {t.payWithWhish}
        </a>
      </div>
    );
  }

  // Digits only: this is pasted into a phone-number field.
  const phone = whish.number.replace(/[^\d+]/g, "");
  const amount = amountLabel.replace(/[^0-9.]/g, "");
  const note = [reference, donorName].filter(Boolean).join(" — ");

  const fields: { key: string; label: string; value: string }[] = [
    { key: "phone", label: t.receiverPhone, value: phone },
    { key: "amount", label: t.amountUsd, value: amount },
    ...(note ? [{ key: "note", label: t.noteField, value: note }] : []),
  ];

  const openUrl = whishOpenUrl(whish.number, platform);

  return (
    <div className={styles.panel}>
      {/* Opens the app where it is installed; the copyable fields below are
          how the transfer is actually filled in, on every platform. */}
      {openUrl && (
        <>
          {/* Deliberately a same-tab navigation with no target="_blank": iOS
              and Android hand a universal link to the app on a top-level
              navigation, but a script-opened tab is often left in the browser
              instead, which is exactly the case we need to work. */}
          <a className={styles.primary} href={openUrl}>
            {t.openWhish}
          </a>
          <p className={styles.steps}>{t.openHint}</p>
        </>
      )}

      <p className={styles.steps}>{t.steps}</p>

      <ul className={styles.fields}>
        {fields.map((field) => (
          <li className={styles.field} key={field.key}>
            <div className={styles.fieldText}>
              <span className={styles.fieldLabel}>{field.label}</span>
              <span className={styles.fieldValue} dir="ltr">
                {field.value}
              </span>
            </div>
            <button
              className={styles.copyBtn}
              type="button"
              onClick={() => copy(field.key, field.value)}
            >
              {copied === field.key ? t.copied : t.copyField}
            </button>
          </li>
        ))}
      </ul>

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
