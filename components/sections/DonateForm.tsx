"use client";

import { useState } from "react";

import { pledgeDonation } from "@/lib/firebase/public-writes";
import type { Locale } from "@/lib/i18n";
import { paymentUi } from "@/lib/payments";
import WhishPayment from "../WhishPayment";
import styles from "./sections.module.css";

type State = { kind: "idle" | "sending" | "sent" | "error"; message: string };

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

  const [selected, setSelected] = useState(amounts[0] ?? "$0");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [state, setState] = useState<State>({ kind: "idle", message: "" });

  const amountCents = Math.round(Number(selected.replace(/[^0-9.]/g, "")) * 100);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState({ kind: "sending", message: t.method });

    const isEmail = contact.includes("@");
    try {
      await pledgeDonation({
        amountCents,
        name,
        email: isEmail ? contact : "",
        phone: isEmail ? "" : contact,
      });
      // The pledge is recorded first, so the donation is tracked even if the
      // donor never completes the transfer in Whish.
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

  // Once the pledge is stored, hand the donor over to Whish.
  if (state.kind === "sent") {
    return (
      <>
        <p className={styles.donateNote}>{t.thanksTitle}</p>
        <WhishPayment locale={locale} amountLabel={selected} />
        <p className={styles.donateNote}>{t.thanksNote}</p>
      </>
    );
  }

  return (
    <>
      <div className={styles.amounts}>
        {amounts.map((amount) => (
          <button
            className={amount === selected ? styles.amountOn : styles.amount}
            type="button"
            key={amount}
            dir="ltr"
            aria-pressed={amount === selected}
            onClick={() => setSelected(amount)}
          >
            {amount}
          </button>
        ))}
      </div>

      {!open && (
        <button
          className={styles.donateCta}
          type="button"
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
            disabled={state.kind === "sending"}
          >
            {state.kind === "sending" ? "…" : t.payWithWhish}
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
