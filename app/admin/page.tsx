"use client";

import { useCallback, useEffect, useState } from "react";

import { listDonations, listOrders, listSubscribers } from "@/lib/firebase/admin-db";
import { seedContent, type SeedReport } from "@/lib/firebase/seed";
import type { Donation, OrderWithItems } from "@/lib/firebase/types";
import { money } from "./format";
import styles from "./admin.module.css";

/** Orders that count as revenue. Cancelled ones never do. */
const EARNING: OrderWithItems["status"][] = ["confirmed", "fulfilled"];

function startOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function toDate(value: unknown): Date | null {
  if (!value) return null;
  // Firestore timestamps arrive as {seconds} through the SDK.
  const seconds = (value as { seconds?: number }).seconds;
  if (typeof seconds === "number") return new Date(seconds * 1000);
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export default function OverviewPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [subscribers, setSubscribers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [seeding, setSeeding] = useState(false);
  const [seedNote, setSeedNote] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [o, d, s] = await Promise.all([
        listOrders(),
        listDonations(),
        listSubscribers(),
      ]);
      setOrders(o);
      setDonations(d);
      setSubscribers(s.length);
    } catch (cause) {
      setError(
        cause instanceof Error && cause.message.includes("permission")
          ? "لا توجد صلاحية للقراءة. تأكد من نشر قواعد Firestore ومن إضافة حسابك إلى admins."
          : "تعذّر تحميل البيانات.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const paid = orders.filter((o) => EARNING.includes(o.status));
  const revenue = paid.reduce((sum, o) => sum + o.totalCents, 0);
  const since = startOfMonth();
  const thisMonth = paid.filter((o) => {
    const at = toDate(o.createdAt);
    return at !== null && at >= since;
  });
  const monthRevenue = thisMonth.reduce((sum, o) => sum + o.totalCents, 0);
  const pending = orders.filter((o) => o.status === "pending").length;
  const average = paid.length ? Math.round(revenue / paid.length) : 0;
  const pledged = donations
    .filter((d) => d.status !== "cancelled")
    .reduce((sum, d) => sum + d.amountCents, 0);

  // Best sellers, summed across every earning order.
  const unitsByProduct = new Map<string, { title: string; units: number; cents: number }>();
  for (const order of paid) {
    for (const item of order.items) {
      const row = unitsByProduct.get(item.productId) ?? {
        title: item.titleAr,
        units: 0,
        cents: 0,
      };
      row.units += item.quantity;
      row.cents += item.unitPriceCents * item.quantity;
      unitsByProduct.set(item.productId, row);
    }
  }
  const best = [...unitsByProduct.values()]
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  async function runSeed() {
    setSeeding(true);
    setSeedNote("");
    try {
      const report: SeedReport = await seedContent();
      setSeedNote(
        Object.entries(report)
          .map(([k, v]) => `${k}: ${v === "skipped" ? "موجود مسبقاً" : v}`)
          .join(" · "),
      );
      await load();
    } catch {
      setSeedNote("تعذّر الاستيراد. تأكد من نشر قواعد Firestore.");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.title}>نظرة عامة</h1>
        <div className={styles.formActions}>
          <button className={styles.btn} type="button" onClick={load} disabled={loading}>
            تحديث
          </button>
          <button
            className={styles.btnPrimary}
            type="button"
            onClick={runSeed}
            disabled={seeding}
          >
            {seeding ? "جارٍ الاستيراد…" : "استيراد المحتوى الأولي"}
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {error && <p className={styles.error}>{error}</p>}
        {seedNote && <p className={styles.notice}>{seedNote}</p>}

        {loading ? (
          <p className={styles.empty}>جارٍ التحميل…</p>
        ) : (
          <>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <p className={styles.statLabel}>إجمالي المبيعات</p>
                <p className={styles.statValue} dir="ltr">{money(revenue)}</p>
                <p className={styles.statHint}>{paid.length} طلب مؤكد</p>
              </div>
              <div className={styles.stat}>
                <p className={styles.statLabel}>مبيعات هذا الشهر</p>
                <p className={styles.statValue} dir="ltr">{money(monthRevenue)}</p>
                <p className={styles.statHint}>{thisMonth.length} طلب</p>
              </div>
              <div className={styles.stat}>
                <p className={styles.statLabel}>متوسط قيمة الطلب</p>
                <p className={styles.statValue} dir="ltr">{money(average)}</p>
              </div>
              <div className={styles.stat}>
                <p className={styles.statLabel}>طلبات قيد الانتظار</p>
                <p className={styles.statValue}>{pending}</p>
                <p className={styles.statHint}>بحاجة إلى تأكيد</p>
              </div>
              <div className={styles.stat}>
                <p className={styles.statLabel}>التبرعات المسجّلة</p>
                <p className={styles.statValue} dir="ltr">{money(pledged)}</p>
                <p className={styles.statHint}>{donations.length} تبرع</p>
              </div>
              <div className={styles.stat}>
                <p className={styles.statLabel}>المشتركون</p>
                <p className={styles.statValue}>{subscribers}</p>
              </div>
            </div>

            <div className={styles.card}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>الأكثر مبيعاً</th>
                    <th>الكمية</th>
                    <th>الإيراد</th>
                  </tr>
                </thead>
                <tbody>
                  {best.length === 0 ? (
                    <tr>
                      <td colSpan={3}>
                        <p className={styles.empty}>
                          لا توجد مبيعات مؤكدة بعد. أكّد طلباً من صفحة الطلبات ليظهر هنا.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    best.map((row) => (
                      <tr key={row.title}>
                        <td className={styles.rowTitle}>{row.title}</td>
                        <td>{row.units}</td>
                        <td dir="ltr">{money(row.cents)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
