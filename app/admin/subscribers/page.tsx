"use client";

import { listSubscribers } from "@/lib/firebase/admin-db";
import type { Subscriber } from "@/lib/firebase/types";
import RecordList from "../RecordList";
import { formatDate } from "../format";
import styles from "../admin.module.css";

export default function SubscribersPage() {
  return (
    <RecordList<Subscriber>
      title="المشتركون"
      load={listSubscribers}
      emptyText="لا يوجد مشتركون بعد."
      summary={(rows) => (
        <span className={styles.muted}>{rows.length} مشترك</span>
      )}
      columns={[
        { header: "البريد الإلكتروني", ltr: true, cell: (s) => s.email },
        { header: "تاريخ الاشتراك", cell: (s) => formatDate(s.createdAt) },
      ]}
    />
  );
}
