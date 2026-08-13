"use client";

import { listAssessments } from "@/lib/firebase/admin-db";
import type { AssessmentRecord } from "@/lib/firebase/types";
import RecordList from "../RecordList";
import { formatDate } from "../format";
import styles from "../admin.module.css";

const LEVELS: Record<string, string> = {
  high: "جهوزية مرتفعة",
  good: "جهوزية جيدة",
  developing: "تحتاج تدريباً",
  limited: "محدودة",
  blocked: "شروط غير مستوفاة",
};

const BADGES: Record<string, string> = {
  high: styles.badgePublished,
  good: styles.badgeInfo,
  developing: styles.badgeWarn,
  limited: styles.badgeDraft,
  blocked: styles.badgeArchived,
};

export default function AssessmentsPage() {
  return (
    <RecordList<AssessmentRecord>
      title="تقييمات الجهوزية"
      load={listAssessments}
      emptyText="لا توجد تقييمات بعد."
      columns={[
        { header: "الرقم", ltr: true, cell: (a) => a.reference },
        { header: "التاريخ", cell: (a) => formatDate(a.createdAt) },
        { header: "المؤشر", ltr: true, cell: (a) => `${a.percentage}%` },
        {
          header: "النتيجة",
          cell: (a) => (
            <span className={BADGES[a.level] ?? styles.badgeDraft}>
              {LEVELS[a.level] ?? a.level}
            </span>
          ),
        },
        { header: "المسار المفضّل", cell: (a) => a.preferredTrack },
      ]}
    />
  );
}
