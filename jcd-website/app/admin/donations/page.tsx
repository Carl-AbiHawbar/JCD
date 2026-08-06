import { formatDate } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import styles from "../admin.module.css";

const STATUS_LABELS: Record<string, string> = {
  pledged: "قيد المتابعة",
  received: "تم الاستلام",
  cancelled: "ملغى",
};

const STATUS_STYLES: Record<string, string> = {
  pledged: styles.badgeWarn,
  received: styles.badgePublished,
  cancelled: styles.badgeArchived,
};

function money(cents: number, currency: string) {
  const amount = cents / 100;
  const text = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  return currency === "USD" ? `$${text}` : `${text} ${currency}`;
}

export default async function DonationsPage() {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = data ?? [];
  const total = rows
    .filter((d) => d.status !== "cancelled")
    .reduce((sum, d) => sum + d.amount_cents, 0);

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.title}>التبرعات</h1>
        <span className={styles.muted} dir="ltr">
          {money(total, "USD")}
        </span>
      </div>

      <div className={styles.content}>
        {error && <p className={styles.error}>{error.message}</p>}

        <div className={styles.card}>
          {rows.length === 0 ? (
            <p className={styles.empty}>لا توجد تبرعات بعد.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>الرقم</th>
                    <th>التاريخ</th>
                    <th>المبلغ</th>
                    <th>المتبرع</th>
                    <th>وسيلة التواصل</th>
                    <th>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((d) => (
                    <tr key={d.id}>
                      <td className={styles.rowTitle} dir="ltr">
                        {d.reference}
                      </td>
                      <td>{formatDate(d.created_at)}</td>
                      <td dir="ltr">{money(d.amount_cents, d.currency)}</td>
                      <td>{d.donor_name || "—"}</td>
                      <td dir="ltr">{d.donor_email || d.donor_phone || "—"}</td>
                      <td>
                        <span
                          className={STATUS_STYLES[d.status] ?? styles.badgeDraft}
                        >
                          {STATUS_LABELS[d.status] ?? d.status}
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
