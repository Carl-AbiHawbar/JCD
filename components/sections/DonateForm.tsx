"use client";

import { useState } from "react";

import { pledgeDonation } from "@/lib/firebase/public-writes";
import type { Locale } from "@/lib/i18n";
import { paymentUi } from "@/lib/payments";
import WhishPayment from "../WhishPayment";
import styles from "./sections.module.css";

type State = { kind: "idle" | "sending" | "sent" | "error"; message: string };

/** Smallest pledge worth recording, matching the Firestore rule. */
const MIN_CENTS = 100;

export default function DonateForm({
  amounts,
  cta,
  locale,
}: {
  amounts: string[];
  cta: string;
  locale: Locale;
}) {
  const t = paymentUi[locale];

  const [selected, setSelected] = useState(amounts[0] ?? "$50");
  const [custom, setCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [state, setState] = useState<State>({ kind: "idle", message: "" });

  // The amount actually pledged: a preset, or whatever was typed.
  const amountCents = custom
    ? Math.round((Number(customValue.replace(/[^0-9.]/g, "")) || 0) * 100)
    : Math.round(Number(selected.replace(/[^0-9.]/g, "")) * 100);

  const amountLabel = custom
    ? `$${(amountCents / 100).toLocaleString("en-US")}`
    : selected;

  const valid = amountCents >= MIN_CENTS;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!valid) {
      setState({ kind: "error", message: t.tooSmall });
      return;
    }
    setState({ kind: "sending", message: "" });

    const isEmail = contact.includes("@");
    try {
      await pledgeDonation({
        amountCents,
        name,
        email: isEmail ? contact : "",
        phone: isEmail ? "" : contact,
      });
      // Recorded first, so the donation is tracked even if the donor never
      // completes the transfer in Whish.
      setState({ kind: "sent", message: "" });
      setOpen(false);
    } catch {
      setState({
        kind: "error",
        message:
          locale === "ar"
            ? "تعذّر تسجيل التبرع. يرجى المحاولة لاحقاً."
            : "We could not record the donation. Please try again later.",
      });
    }
  }

  // Once the pledge is stored, hand the donor over to Whish with the amount
  // and their details already resolved.
  if (state.kind === "sent") {
    return (
      <>
        <p className={styles.donateNote}>{t.thanksTitle}</p>
        <WhishPayment
          locale={locale}
          amountLabel={amountLabel}
          donorName={name}
        />
        <p className={styles.donateNote}>{t.thanksNote}</p>
      </>
    );
  }

  return (
    <>
      <div className={styles.amounts}>
        {amounts.map((amount) => (
          <button
            className={
              !custom && amount === selected ? styles.amountOn : styles.amount
            }
            type="button"
            key={amount}
            dir="ltr"
            aria-pressed={!custom && amount === selected}
            onClick={() => {
              setCustom(false);
              setSelected(amount);
            }}
          >
            {amount}
          </button>
        ))}

        <button
          className={custom ? styles.amountOn : styles.amount}
          type="button"
          aria-pressed={custom}
          onClick={() => setCustom(true)}
        >
          {t.custom}
        </button>
      </div>

      {custom && (
        <div className={styles.customRow}>
          <input
            className={styles.customInput}
            type="number"
            min={1}
            step={1}
            inputMode="decimal"
            dir="ltr"
            autoFocus
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder={t.customPlaceholder}
            aria-label={t.customPlaceholder}
          />
        </div>
      )}

      {!open && (
        <button
          className={styles.donateCta}
          type="button"
          disabled={!valid}
          onClick={() => setOpen(true)}
        >
          {cta}
        </button>
      )}

      {open && (
        <form className={styles.donateForm} onSubmit={submit}>
          <input
            className={styles.donateInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={locale === "ar" ? "الاسم" : "Name"}
            aria-label={locale === "ar" ? "الاسم" : "Name"}
          />
          <input
            className={styles.donateInput}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
            placeholder={
              locale === "ar" ? "بريد إلكتروني أو رقم هاتف" : "Email or phone number"
            }
            aria-label={
              locale === "ar" ? "بريد إلكتروني أو رقم هاتف" : "Email or phone number"
            }
          />
          <button
            className={styles.donateCta}
            type="submit"
            disabled={state.kind === "sending" || !valid}
          >
            {state.kind === "sending" ? "…" : `${t.payWithWhish} · ${amountLabel}`}
          </button>
        </form>
      )}

      {state.kind === "error" && (
        <p className={styles.donateError} aria-live="polite">
          {state.message}
        </p>
      )}
    </>
  );
}
