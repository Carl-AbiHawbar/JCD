"use client";

import { listDonations } from "@/lib/firebase/admin-db";
import type { Donation } from "@/lib/firebase/types";
import RecordList from "../RecordList";
import { formatDate, money } from "../format";
import styles from "../admin.module.css";

const LABELS: Record<Donation["status"], string> = {
  pledged: "قيد المتابعة",
  received: "تم الاستلام",
  cancelled: "ملغى",
};

const BADGES: Record<Donation["status"], string> = {
  pledged: styles.badgeWarn,
  received: styles.badgePublished,
  cancelled: styles.badgeArchived,
};

export default function DonationsPage() {
  return (
    <RecordList<Donation>
      title="التبرعات"
      load={listDonations}
      emptyText="لا توجد تبرعات بعد."
      summary={(rows) => (
        <span className={styles.muted} dir="ltr">
          {money(
            rows
              .filter((d) => d.status !== "cancelled")
              .reduce((sum, d) => sum + d.amountCents, 0),
          )}
        </span>
      )}
      columns={[
        { header: "التاريخ", cell: (d) => formatDate(d.createdAt) },
        { header: "المبلغ", ltr: true, cell: (d) => money(d.amountCents, d.currency) },
        { header: "المتبرع", cell: (d) => d.donorName || "—" },
        {
          header: "وسيلة التواصل",
          ltr: true,
          cell: (d) => d.donorEmail || d.donorPhone || "—",
        },
        {
          header: "الحالة",
          cell: (d) => <span className={BADGES[d.status]}>{LABELS[d.status]}</span>,
        },
      ]}
    />
  );
}
