"use client";

import { useState } from "react";

import styles from "./sections.module.css";

type State = { kind: "idle" | "sending" | "sent" | "error"; message: string };

export default function DonateForm({
  amounts,
  cta,
}: {
  amounts: string[];
  cta: string;
}) {
  const [selected, setSelected] = useState(amounts[0] ?? "$0");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [state, setState] = useState<State>({ kind: "idle", message: "" });

  const amountCents = Math.round(Number(selected.replace(/[^0-9.]/g, "")) * 100);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState({ kind: "sending", message: "جارٍ التسجيل..." });

    const isEmail = contact.includes("@");
    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountCents,
          name,
          email: isEmail ? contact : "",
          phone: isEmail ? "" : contact,
        }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(body.error);

      setState({
        kind: "sent",
        message: "شكراً لك. تم تسجيل تبرعك وسنتواصل معك قريباً.",
      });
      setOpen(false);
    } catch (cause) {
      setState({
        kind: "error",
        message: cause instanceof Error && cause.message
          ? cause.message
          : "تعذّر تسجيل التبرع.",
      });
    }
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

      {!open && state.kind !== "sent" && (
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
            placeholder="الاسم"
            aria-label="الاسم"
          />
          <input
            className={styles.donateInput}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
            placeholder="بريد إلكتروني أو رقم هاتف"
            aria-label="بريد إلكتروني أو رقم هاتف"
          />
          <button
            className={styles.donateCta}
            type="submit"
            disabled={state.kind === "sending"}
          >
            {state.kind === "sending" ? "جارٍ التسجيل..." : cta}
          </button>
        </form>
      )}

      {state.message && (
        <p
          className={
            state.kind === "error" ? styles.donateError : styles.donateNote
          }
          aria-live="polite"
        >
          {state.message}
        </p>
      )}
    </>
  );
}
