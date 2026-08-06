import Link from "next/link";

import { formatPrice } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import styles from "./admin.module.css";

async function count(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  table: string,
  filter?: { column: string; value: string },
) {
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) q = q.eq(filter.column, filter.value);
  const { count: n } = await q;
  return n ?? 0;
}

export default async function AdminDashboard() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();

  const [products, pendingOrders, events, subscribers] = await Promise.all([
    count(supabase, "products", { column: "status", value: "published" }),
    count(supabase, "orders", { column: "status", value: "pending" }),
    count(supabase, "events", { column: "status", value: "published" }),
    count(supabase, "subscribers"),
  ]);

  const { data: recent } = await supabase
    .from("orders")
    .select("id, reference, customer_name, subtotal_cents, currency, status")
    .order("created_at", { ascending: false })
    .limit(8);

  const stats = [
    { label: "منتجات منشورة", value: products, href: "/admin/products" },
    { label: "طلبات قيد الانتظار", value: pendingOrders, href: "/admin/orders" },
    { label: "فعاليات منشورة", value: events, href: "/admin/events" },
    { label: "المشتركون", value: subscribers, href: "/admin/subscribers" },
  ];

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.title}>نظرة عامة</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.stats}>
          {stats.map((s) => (
            <Link className={styles.cardPad} href={s.href} key={s.label}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </Link>
          ))}
        </div>

        <div className={styles.card}>
          {!recent || recent.length === 0 ? (
            <p className={styles.empty}>لا توجد طلبات بعد.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>الرقم</th>
                    <th>العميل</th>
                    <th>المجموع</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <Link className={styles.rowTitle} href={`/admin/orders/${o.id}`}>
                          {o.reference}
                        </Link>
                      </td>
                      <td>{o.customer_name}</td>
                      <td>{formatPrice(o.subtotal_cents, o.currency)}</td>
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
