"use client";

import { listVolunteerApplications } from "@/lib/firebase/admin-db";
import type { VolunteerApplication } from "@/lib/firebase/types";
import { formFields } from "@/lib/forms";
import RecordList from "../RecordList";
import { formatDate } from "../format";
import styles from "../admin.module.css";

const FORMS: Record<VolunteerApplication["form"], { label: string; badge: string }> = {
  jcd: { label: "JCD Club", badge: styles.badgeInfo },
  mcd: { label: "MCD", badge: styles.badgeWarn },
};

/**
 * Every answer in a submission, labelled in Arabic from the form's own
 * definition. Values are stable ids, so this works for forms filled in either
 * language.
 */
function Answers({ row }: { row: VolunteerApplication }) {
  const items = formFields(row.form).flatMap((field) => {
    const value = row.answers?.[field.id];
    if (value === undefined || field.id === "fullName" || field.id === "phone") return [];

    const shown =
      field.kind === "text"
        ? String(value)
        : (Array.isArray(value) ? value : [value])
            .map((v) => field.options.find((o) => o.value === v)?.label ?? v)
            .join("، ");
    const detail = row.answers?.[`${field.id}Detail`];

    return [
      <div key={field.id}>
        <dt>{field.label}</dt>
        <dd>
          {shown}
          {detail ? ` — ${detail}` : ""}
        </dd>
      </div>,
    ];
  });

  return (
    <details>
      <summary>عرض الإجابات</summary>
      <dl className={styles.answers}>{items}</dl>
    </details>
  );
}

export default function VolunteersPage() {
  return (
    <RecordList<VolunteerApplication>
      title="طلبات التطوع"
      load={listVolunteerApplications}
      emptyText="لا توجد طلبات بعد."
      summary={(rows) => (
        <span className={styles.muted}>
          JCD Club: {rows.filter((r) => r.form === "jcd").length} · MCD:{" "}
          {rows.filter((r) => r.form === "mcd").length}
        </span>
      )}
      columns={[
        { header: "التاريخ", cell: (r) => formatDate(r.createdAt) },
        {
          header: "الاستمارة",
          cell: (r) => (
            <span className={FORMS[r.form]?.badge ?? styles.badgeDraft}>
              {FORMS[r.form]?.label ?? r.form}
            </span>
          ),
        },
        { header: "الاسم", cell: (r) => r.fullName },
        { header: "الخليوي", ltr: true, cell: (r) => r.phone },
        {
          header: "المنطقة",
          cell: (r) =>
            [r.answers?.district, r.answers?.area].filter(Boolean).join(" – ") || "—",
        },
        { header: "الإجابات", cell: (r) => <Answers row={r} /> },
      ]}
    />
  );
}
