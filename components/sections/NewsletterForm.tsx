"use client";

import { useState } from "react";

import styles from "./sections.module.css";

type State = { kind: "idle" | "sending" | "sent" | "error"; message: string };

export default function NewsletterForm({
  placeholder,
  cta,
}: {
  placeholder: string;
  cta: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>({ kind: "idle", message: "" });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState({ kind: "sending", message: "" });

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(body.error);

      setState({ kind: "sent", message: "تم اشتراكك بنجاح. شكراً لك!" });
      setEmail("");
    } catch (cause) {
      setState({
        kind: "error",
        message:
          cause instanceof Error && cause.message
            ? cause.message
            : "تعذّر إتمام الاشتراك.",
      });
    }
  }

  return (
    <>
      <form className={styles.newsletterForm} onSubmit={submit}>
        <input
          className={styles.newsletterInput}
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
        />
        <button
          className={styles.newsletterButton}
          type="submit"
          disabled={state.kind === "sending"}
        >
          {state.kind === "sending" ? "..." : cta}
        </button>
      </form>

      {state.message && (
        <p
          className={
            state.kind === "error" ? styles.donateError : styles.newsletterNote
          }
          aria-live="polite"
        >
          {state.message}
        </p>
      )}
    </>
  );
}
