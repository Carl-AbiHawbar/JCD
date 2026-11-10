"use client";

import { useState } from "react";

import { submitVolunteerApplication } from "@/lib/firebase/public-writes";
import type { Answers, Field, FormSchema } from "@/lib/forms";
import styles from "./forms.module.css";

type State = "idle" | "sending" | "sent" | "error";

/** The longest answer we keep for a free-text field. */
const MAX_TEXT = 200;

/** Renders one of the volunteer forms in lib/forms.ts and stores the answers. */
export default function VolunteerForm({
  schema,
  locale,
}: {
  schema: FormSchema;
  locale: "ar" | "en";
}) {
  const [values, setValues] = useState<Answers>({});
  const [details, setDetails] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [missing, setMissing] = useState<string[]>([]);

  const fields = schema.sections.flatMap((s) => s.fields);

  const text = (id: string) => (typeof values[id] === "string" ? (values[id] as string) : "");
  const list = (id: string) => (Array.isArray(values[id]) ? (values[id] as string[]) : []);

  function set(id: string, value: string | string[]) {
    setValues((v) => ({ ...v, [id]: value }));
    setMissing((m) => m.filter((x) => x !== id));
  }

  function toggle(id: string, value: string) {
    const current = list(id);
    set(id, current.includes(value) ? current.filter((x) => x !== value) : [...current, value]);
  }

  /** The option whose "please specify" box is showing for a field, if any. */
  function specifying(field: Field) {
    if (field.kind === "text") return null;
    const chosen = field.kind === "multi" ? list(field.id) : [text(field.id)];
    return field.options.find((o) => o.specify && chosen.includes(o.value)) ?? null;
  }

  function validate() {
    const gaps: string[] = [];
    for (const field of fields) {
      if (field.kind !== "multi" && field.required && !text(field.id).trim()) gaps.push(field.id);
      // A "please specify" box is only asked for when it matters, so it is required.
      if (specifying(field) && !details[field.id]?.trim()) gaps.push(field.id);
    }
    return gaps;
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (state === "sending") return;

    const gaps = validate();
    setMissing(gaps);
    if (gaps.length > 0 || !consent) {
      setState("idle");
      document.getElementById(`field-${gaps[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // Everything but name and phone goes under `answers`, trimmed, with the
    // "please specify" text stored beside the choice it explains.
    const answers: Answers = {};
    for (const field of fields) {
      if (field.id === "fullName" || field.id === "phone") continue;
      const value = values[field.id];
      if (Array.isArray(value) ? value.length === 0 : !value?.trim()) continue;
      answers[field.id] = Array.isArray(value) ? value : value.trim().slice(0, MAX_TEXT);
      if (specifying(field)) answers[`${field.id}Detail`] = details[field.id].trim().slice(0, MAX_TEXT);
    }

    setState("sending");
    try {
      await submitVolunteerApplication({
        form: schema.id,
        fullName: text("fullName").slice(0, 120),
        phone: text("phone").slice(0, 32),
        answers,
        locale,
      });
      setState("sent");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className={styles.card}>
        <div className={styles.sent} role="status">
          <h2 className={styles.sentTitle}>{schema.sentTitle}</h2>
          <p>{schema.sentBody}</p>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.card} onSubmit={submit} noValidate>
      {schema.sections.map((section) => (
        <fieldset className={styles.section} key={section.heading}>
          <legend className={styles.sectionHeading}>{section.heading}</legend>

          <div className={styles.fields}>
            {section.fields.map((field) => {
              const flagged = missing.includes(field.id);
              const other = specifying(field);

              if (field.kind === "text") {
                return (
                  <label
                    className={field.half ? styles.half : styles.full}
                    id={`field-${field.id}`}
                    key={field.id}
                  >
                    <span className={styles.label}>
                      {field.label}
                      {field.required && <span className={styles.required}> *</span>}
                    </span>
                    <input
                      className={flagged ? styles.inputMissing : styles.input}
                      type={field.input ?? "text"}
                      dir={field.input === "tel" ? "ltr" : undefined}
                      autoComplete={field.autoComplete}
                      required={field.required}
                      aria-invalid={flagged || undefined}
                      maxLength={field.id === "phone" ? 32 : 120}
                      value={text(field.id)}
                      onChange={(e) => set(field.id, e.target.value)}
                    />
                  </label>
                );
              }

              const multi = field.kind === "multi";
              return (
                <div
                  className={styles.full}
                  id={`field-${field.id}`}
                  key={field.id}
                  role={multi ? "group" : "radiogroup"}
                  aria-labelledby={`label-${field.id}`}
                  aria-invalid={flagged || undefined}
                >
                  <p className={styles.question} id={`label-${field.id}`}>
                    {field.label}
                    {field.kind === "single" && field.required && (
                      <span className={styles.required}> *</span>
                    )}
                  </p>
                  {field.kind === "multi" && field.note && (
                    <p className={styles.note}>{field.note}</p>
                  )}

                  <div className={styles.options}>
                    {field.options.map((option) => {
                      const on = multi
                        ? list(field.id).includes(option.value)
                        : text(field.id) === option.value;
                      return (
                        <label
                          className={on ? styles.optionOn : styles.option}
                          key={option.value}
                        >
                          <input
                            type={multi ? "checkbox" : "radio"}
                            name={field.id}
                            value={option.value}
                            checked={on}
                            onChange={() =>
                              multi ? toggle(field.id, option.value) : set(field.id, option.value)
                            }
                          />
                          <span>{option.label}</span>
                        </label>
                      );
                    })}
                  </div>

                  {other && (
                    <input
                      className={
                        flagged && !details[field.id]?.trim() ? styles.inputMissing : styles.input
                      }
                      aria-label={other.specify}
                      placeholder={other.specify}
                      maxLength={MAX_TEXT}
                      value={details[field.id] ?? ""}
                      onChange={(e) => {
                        const next = e.target.value;
                        setDetails((d) => ({ ...d, [field.id]: next }));
                        setMissing((m) => m.filter((x) => x !== field.id));
                      }}
                    />
                  )}

                  {flagged && (
                    <p className={styles.fieldError}>{schema.missing}</p>
                  )}
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}

      <label className={styles.consent}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>{schema.consent}</span>
      </label>

      {missing.length > 0 && (
        <p className={styles.error} role="alert">
          {schema.missing}
        </p>
      )}
      {state === "error" && (
        <p className={styles.error} role="alert">
          {schema.failed}
        </p>
      )}

      <button
        className={styles.submit}
        type="submit"
        disabled={state === "sending" || !consent}
      >
        {state === "sending" ? schema.sending : schema.submit}
      </button>
    </form>
  );
}
