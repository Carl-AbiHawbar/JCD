"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { saveResource, type ActionState } from "@/app/admin/actions";
import type { Field, ResourceConfig } from "@/lib/admin/resources";
import styles from "@/app/admin/admin.module.css";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className={styles.btnPrimary} type="submit" disabled={pending}>
      {pending ? "جارٍ الحفظ…" : "حفظ"}
    </button>
  );
}

/** `datetime-local` needs `YYYY-MM-DDTHH:mm`, not a full ISO string. */
function toLocalInput(value: unknown) {
  if (typeof value !== "string" || !value) return "";
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

function FieldInput({
  field,
  defaultValue,
}: {
  field: Field;
  defaultValue: unknown;
}) {
  const id = `f_${field.name}`;
  const common = { id, name: field.name, required: field.required };
  const str = defaultValue == null ? "" : String(defaultValue);

  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel} htmlFor={id}>
        {field.label}
        {field.required ? " *" : ""}
      </label>

      {field.type === "textarea" && (
        <textarea className={styles.textarea} defaultValue={str} {...common} />
      )}

      {field.type === "status" && (
        <select className={styles.select} defaultValue={str || "draft"} {...common}>
          <option value="draft">مسودة</option>
          <option value="published">منشور</option>
        </select>
      )}

      {field.type === "datetime" && (
        <input
          className={styles.input}
          type="datetime-local"
          defaultValue={toLocalInput(defaultValue)}
          {...common}
        />
      )}

      {field.type === "number" && (
        <input
          className={styles.input}
          type="number"
          defaultValue={str || "0"}
          {...common}
        />
      )}

      {(field.type === "text" || field.type === "slug" || field.type === "image") && (
        <input
          className={styles.input}
          type="text"
          defaultValue={str}
          dir={field.type === "text" ? "rtl" : "ltr"}
          {...common}
        />
      )}

      {field.help && <span className={styles.fieldHelp}>{field.help}</span>}
    </div>
  );
}

export default function ResourceForm({
  resource,
  config,
  record,
}: {
  resource: string;
  config: ResourceConfig;
  record: Record<string, unknown> | null;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    saveResource,
    undefined,
  );

  return (
    <form className={styles.form} action={formAction}>
      <input type="hidden" name="__resource" value={resource} />
      {record?.id ? (
        <input type="hidden" name="__id" value={String(record.id)} />
      ) : null}

      {state?.error && <p className={styles.error}>{state.error}</p>}

      {config.fields.map((field) => (
        <FieldInput
          key={field.name}
          field={field}
          defaultValue={record?.[field.name]}
        />
      ))}

      <div className={styles.formActions}>
        <SubmitButton />
        <Link className={styles.btn} href={`/admin/${resource}`}>
          إلغاء
        </Link>
      </div>
    </form>
  );
}
