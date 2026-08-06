import { formatDate } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import styles from "../admin.module.css";

export default async function SubscribersPage() {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  const subscribers = data ?? [];

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.title}>المشتركون</h1>
        <a className={styles.btn} href="/admin/subscribers/export" download>
          تصدير CSV
        </a>
      </div>

      <div className={styles.content}>
        {error && <p className={styles.error}>{error.message}</p>}

        <div className={styles.card}>
          {subscribers.length === 0 ? (
            <p className={styles.empty}>لا يوجد مشتركون بعد.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>البريد الإلكتروني</th>
                    <th>تاريخ الاشتراك</th>
                    <th>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((s) => (
                    <tr key={s.id}>
                      <td className={styles.rowTitle} dir="ltr">
                        {s.email}
                      </td>
                      <td>{formatDate(s.created_at)}</td>
                      <td>
                        <span
                          className={
                            s.unsubscribed ? styles.badgeArchived : styles.badgePublished
                          }
                        >
                          {s.unsubscribed ? "ألغى الاشتراك" : "مشترك"}
                        </span>
                      </td>
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
