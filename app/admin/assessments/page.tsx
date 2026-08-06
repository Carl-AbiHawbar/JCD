import Link from "next/link";

import { formatDate } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import styles from "../admin.module.css";

const LEVEL_LABELS: Record<string, string> = {
  high: "جهوزية مرتفعة",
  good: "جهوزية جيدة",
  developing: "تحتاج تدريباً",
  limited: "محدودة",
  blocked: "شروط غير مستوفاة",
};

const LEVEL_STYLES: Record<string, string> = {
  high: styles.badgePublished,
  good: styles.badgeInfo,
  developing: styles.badgeWarn,
  limited: styles.badgeDraft,
  blocked: styles.badgeArchived,
};

export default async function AssessmentsPage() {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = data ?? [];

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.title}>تقييمات جهوزية التطوع</h1>
        <Link className={styles.btn} href="/volunteer-readiness">
          فتح التقييم
        </Link>
      </div>

      <div className={styles.content}>
        {error && <p className={styles.error}>{error.message}</p>}

        <div className={styles.card}>
          {rows.length === 0 ? (
            <p className={styles.empty}>لا توجد تقييمات بعد.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>الرقم</th>
                    <th>التاريخ</th>
                    <th>المؤشر</th>
                    <th>النتيجة</th>
                    <th>المسار المفضّل</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a) => (
                    <tr key={a.id}>
                      <td className={styles.rowTitle} dir="ltr">
                        {a.reference}
                      </td>
                      <td>{formatDate(a.created_at)}</td>
                      <td>{a.percentage}%</td>
                      <td>
                        <span className={LEVEL_STYLES[a.level] ?? styles.badgeDraft}>
                          {LEVEL_LABELS[a.level] ?? a.level}
                        </span>
                      </td>
                      <td>{a.preferred_track}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
