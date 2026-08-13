"use client";

import { Fragment, useCallback, useEffect, useState } from "react";

import { listOrders, setOrderStatus } from "@/lib/firebase/admin-db";
import type { OrderStatus, OrderWithItems } from "@/lib/firebase/types";
import { formatDate, money } from "../format";
import styles from "../admin.module.css";

const LABELS: Record<OrderStatus, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  fulfilled: "تم التسليم",
  cancelled: "ملغى",
};

const BADGES: Record<OrderStatus, string> = {
  pending: styles.badgeWarn,
  confirmed: styles.badgeInfo,
  fulfilled: styles.badgePublished,
  cancelled: styles.badgeArchived,
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setOrders(await listOrders());
    } catch {
      setError("تعذّر تحميل الطلبات. تأكد من نشر قواعد Firestore.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function change(id: string, status: OrderStatus) {
    // Optimistic: the row updates immediately and reloads on failure.
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o)),
    );
    try {
      await setOrderStatus(id, status);
    } catch {
      setError("تعذّر تحديث حالة الطلب.");
      load();
    }
  }

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.title}>الطلبات</h1>
        <button className={styles.btn} type="button" onClick={load} disabled={loading}>
          تحديث
        </button>
      </div>

      <div className={styles.content}>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.card}>
          {loading ? (
            <p className={styles.empty}>جارٍ التحميل…</p>
          ) : orders.length === 0 ? (
            <p className={styles.empty}>لا توجد طلبات بعد.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>الرقم</th>
                    <th>التاريخ</th>
                    <th>العميل</th>
                    <th>الهاتف</th>
                    <th>الإجمالي</th>
                    <th>الحالة</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    // A fragment needs the key; its children must not carry one.
                    <Fragment key={order.id}>
                      <tr>
                        <td className={styles.rowTitle} dir="ltr">
                          {order.reference}
                        </td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>{order.customerName}</td>
                        <td dir="ltr">{order.customerPhone}</td>
                        <td dir="ltr">
                          {money(order.totalCents, order.currency)}
                          {order.discountPercent ? (
                            <span className={styles.muted}> −{order.discountPercent}%</span>
                          ) : null}
                        </td>
                        <td>
                          <span className={BADGES[order.status]}>
                            {LABELS[order.status]}
                          </span>
                        </td>
                        <td>
                          <div className={styles.formActions}>
                            <button
                              className={styles.btn}
                              type="button"
                              onClick={() =>
                                setOpenId(openId === order.id ? null : order.id)
                              }
                            >
                              {openId === order.id ? "إخفاء" : "تفاصيل"}
                            </button>
                            <select
                              className={styles.select}
                              value={order.status}
                              onChange={(e) =>
                                change(order.id, e.target.value as OrderStatus)
                              }
                              aria-label="حالة الطلب"
                            >
                              {Object.entries(LABELS).map(([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </tr>

                      {openId === order.id && (
                        <tr>
                          <td colSpan={7}>
                            <table className={styles.table}>
                              <thead>
                                <tr>
                                  <th>المنتج</th>
                                  <th>السعر</th>
                                  <th>الكمية</th>
                                  <th>المجموع</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item) => (
                                  <tr key={item.id}>
                                    <td>{item.titleAr}</td>
                                    <td dir="ltr">{money(item.unitPriceCents)}</td>
                                    <td>{item.quantity}</td>
                                    <td dir="ltr">
                                      {money(item.unitPriceCents * item.quantity)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <p className={styles.muted} style={{ padding: "10px 16px" }}>
                              المجموع الفرعي {money(order.subtotalCents)} ·
                              الدفع عند الاستلام
                              {order.addressAr ? ` · ${order.addressAr}` : ""}
                              {order.customerEmail ? ` · ${order.customerEmail}` : ""}
                            </p>
                          </td>
                        </tr>
                      )}
                    </Fragment>
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
