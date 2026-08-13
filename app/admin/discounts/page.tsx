"use client";

import { useCallback, useEffect, useState } from "react";

import {
  deleteDiscountCode,
  listDiscountCodes,
  saveDiscountCode,
} from "@/lib/firebase/admin-db";
import type { DiscountCode } from "@/lib/firebase/types";
import styles from "../admin.module.css";

export default function DiscountsPage() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [percent, setPercent] = useState(10);
  const [labelAr, setLabelAr] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setCodes(await listDiscountCodes());
    } catch {
      setError("تعذّر تحميل الرموز. تأكد من نشر قواعد Firestore.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const id = code.trim().toUpperCase();

    if (!/^[A-Z0-9_-]{3,24}$/.test(id)) {
      setError("الرمز يجب أن يتكوّن من 3 إلى 24 حرفاً أو رقماً بالإنجليزية.");
      return;
    }
    const pct = Math.round(Number(percent));
    if (!Number.isInteger(pct) || pct < 1 || pct > 100) {
      setError("النسبة يجب أن تكون بين 1 و100.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await saveDiscountCode(id, {
        percent: pct,
        active: true,
        ...(labelAr.trim() ? { labelAr: labelAr.trim() } : {}),
      });
      setCode("");
      setLabelAr("");
      setPercent(10);
      await load();
    } catch {
      setError("تعذّر الحفظ.");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(entry: DiscountCode) {
    try {
      await saveDiscountCode(entry.id, {
        percent: entry.percent,
        active: !entry.active,
        ...(entry.labelAr ? { labelAr: entry.labelAr } : {}),
      });
      await load();
    } catch {
      setError("تعذّر التحديث.");
    }
  }

  async function remove(id: string) {
    try {
      await deleteDiscountCode(id);
      await load();
    } catch {
      setError("تعذّر الحذف.");
    }
  }

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.title}>رموز الخصم</h1>
      </div>

      <div className={styles.content}>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.cardPad} style={{ marginBottom: 20 }}>
          <form className={styles.form} onSubmit={save}>
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="code">
                  الرمز *
                </label>
                <input
                  className={styles.input}
                  id="code"
                  dir="ltr"
                  placeholder="RAMADAN20"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="percent">
                  نسبة الخصم % *
                </label>
                <input
                  className={styles.input}
                  id="percent"
                  type="number"
                  min={1}
                  max={100}
                  dir="ltr"
                  required
                  value={percent}
                  onChange={(e) => setPercent(Number(e.target.value))}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="labelAr">
                  الوصف
                </label>
                <input
                  className={styles.input}
                  id="labelAr"
                  value={labelAr}
                  onChange={(e) => setLabelAr(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button className={styles.btnPrimary} type="submit" disabled={saving}>
                {saving ? "جارٍ الحفظ…" : "حفظ الرمز"}
              </button>
            </div>

            <p className={styles.muted}>
              الرمز نفسه هو معرّف المستند، والقواعد تسمح بقراءة رمز واحد فقط عند
              إدخاله ولا تسمح بسرد كل الرموز — لذلك لا يمكن للزائر اكتشافها.
            </p>
          </form>
        </div>

        <div className={styles.card}>
          {loading ? (
            <p className={styles.empty}>جارٍ التحميل…</p>
          ) : codes.length === 0 ? (
            <p className={styles.empty}>لا توجد رموز خصم بعد.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>الرمز</th>
                    <th>النسبة</th>
                    <th>الوصف</th>
                    <th>الحالة</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((entry) => (
                    <tr key={entry.id}>
                      <td className={styles.rowTitle} dir="ltr">
                        {entry.id}
                      </td>
                      <td dir="ltr">{entry.percent}%</td>
                      <td>{entry.labelAr ?? "—"}</td>
                      <td>
                        <span
                          className={
                            entry.active ? styles.badgePublished : styles.badgeDraft
                          }
                        >
                          {entry.active ? "مفعّل" : "متوقف"}
                        </span>
                      </td>
                      <td>
                        <div className={styles.formActions}>
                          <button
                            className={styles.btn}
                            type="button"
                            onClick={() => toggle(entry)}
                          >
                            {entry.active ? "إيقاف" : "تفعيل"}
                          </button>
                          <button
                            className={styles.btnDanger}
                            type="button"
                            onClick={() => remove(entry.id)}
                          >
                            حذف
                          </button>
                        </div>
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
