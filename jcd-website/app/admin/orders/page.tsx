import Link from "next/link";

import { StatusBadge, formatDate, formatPrice } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import styles from "../admin.module.css";

export default async function OrdersPage() {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const orders = data ?? [];

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.title}>الطلبات</h1>
      </div>

      <div className={styles.content}>
        {error && <p className={styles.error}>{error.message}</p>}

        <div className={styles.card}>
          {orders.length === 0 ? (
            <p className={styles.empty}>لا توجد طلبات بعد.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>الرقم</th>
                    <th>العميل</th>
                    <th>التاريخ</th>
                    <th>المجموع</th>
                    <th>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <Link className={styles.rowTitle} href={`/admin/orders/${o.id}`}>
                          {o.reference}
                        </Link>
                      </td>
                      <td>{o.customer_name}</td>
                      <td>{formatDate(o.created_at)}</td>
                      <td>{formatPrice(o.subtotal_cents, o.currency)}</td>
                      <td>
                        <StatusBadge status={o.status} />
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
