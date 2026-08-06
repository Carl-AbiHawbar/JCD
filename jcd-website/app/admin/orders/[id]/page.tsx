import { notFound } from "next/navigation";

import { StatusBadge, formatDate, formatPrice } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateOrderStatus } from "../actions";
import styles from "../../admin.module.css";

const STATUS_OPTIONS = [
  { value: "pending", label: "قيد الانتظار" },
  { value: "paid", label: "مدفوع" },
  { value: "fulfilled", label: "تم التنفيذ" },
  { value: "cancelled", label: "ملغى" },
  { value: "refunded", label: "مُسترد" },
];

export default async function OrderDetailPage({
  params,
}: PageProps<"/admin/orders/[id]">) {
  await requireAdmin();

  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [{ data: order }, { data: items }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).maybeSingle(),
    supabase.from("order_items").select("*").eq("order_id", id),
  ]);

  if (!order) notFound();

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.title}>طلب {order.reference}</h1>
        <StatusBadge status={order.status} />
      </div>

      <div className={styles.content}>
        <div className={styles.stats}>
          <div className={styles.cardPad}>
            <div className={styles.statLabel}>العميل</div>
            <div className={styles.rowTitle}>{order.customer_name}</div>
            <div className={styles.statLabel} dir="ltr">
              {order.customer_phone}
            </div>
            {order.customer_email && (
              <div className={styles.statLabel} dir="ltr">
                {order.customer_email}
              </div>
            )}
          </div>

          <div className={styles.cardPad}>
            <div className={styles.statLabel}>التاريخ</div>
            <div className={styles.rowTitle}>{formatDate(order.created_at)}</div>
          </div>

          <div className={styles.cardPad}>
            <div className={styles.statLabel}>المجموع</div>
            <div className={styles.statValue}>
              {formatPrice(order.subtotal_cents, order.currency)}
            </div>
          </div>
        </div>

        <div className={styles.card} style={{ marginBottom: 22 }}>
          {!items || items.length === 0 ? (
            <p className={styles.empty}>لا توجد عناصر في هذا الطلب.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>المنتج</th>
                    <th>سعر الوحدة</th>
                    <th>الكمية</th>
                    <th>المجموع</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id}>
                      <td className={styles.rowTitle}>{it.title_ar}</td>
                      <td>{formatPrice(it.unit_price_cents, order.currency)}</td>
                      <td>{it.quantity}</td>
                      <td>
                        {formatPrice(
                          it.unit_price_cents * it.quantity,
                          order.currency,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className={styles.cardPad}>
          <form action={updateOrderStatus} className={styles.btnRow}>
            <input type="hidden" name="id" value={order.id} />
            <label className={styles.fieldLabel} htmlFor="status">
              تغيير الحالة
            </label>
            <select
              className={styles.select}
              id="status"
              name="status"
              defaultValue={order.status}
              style={{ width: "auto" }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <button className={styles.btnPrimary} type="submit">
              تحديث
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
