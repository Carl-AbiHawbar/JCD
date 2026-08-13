"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  createDoc,
  deleteDocById,
  listAll,
  updateDocById,
} from "@/lib/firebase/admin-db";
import styles from "../../admin.module.css";

type FieldSpec = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "status";
  required?: boolean;
};

type Config = {
  collection: string;
  labelAr: string;
  titleField: string;
  fields: FieldSpec[];
};

const STATUS: FieldSpec = { name: "status", label: "الحالة", type: "status" };
const SORT: FieldSpec = { name: "sortOrder", label: "الترتيب", type: "number" };

/** The three content types share one editor; only the field list differs. */
const CONFIGS: Record<string, Config> = {
  programs: {
    collection: "programs",
    labelAr: "البرامج",
    titleField: "titleAr",
    fields: [
      { name: "titleAr", label: "العنوان", type: "text", required: true },
      { name: "slug", label: "المعرّف", type: "text" },
      { name: "summaryAr", label: "الملخص", type: "textarea" },
      { name: "image", label: "رابط الصورة", type: "text" },
      STATUS,
      SORT,
    ],
  },
  events: {
    collection: "events",
    labelAr: "الفعاليات",
    titleField: "titleAr",
    fields: [
      { name: "titleAr", label: "العنوان", type: "text", required: true },
      { name: "slug", label: "المعرّف", type: "text" },
      { name: "summaryAr", label: "الشهر أو الملخص", type: "text" },
      { name: "locationAr", label: "المكان", type: "text" },
      { name: "image", label: "رابط الصورة", type: "text" },
      STATUS,
      SORT,
    ],
  },
  faqs: {
    collection: "faqs",
    labelAr: "الأسئلة الشائعة",
    titleField: "questionAr",
    fields: [
      { name: "questionAr", label: "السؤال", type: "text", required: true },
      { name: "answerAr", label: "الجواب", type: "textarea", required: true },
      STATUS,
      SORT,
    ],
  },
};

type Row = Record<string, unknown> & { id: string };

export default function ContentPage() {
  const params = useParams<{ type: string }>();
  const config = CONFIGS[params.type];

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!config) return;
    setLoading(true);
    setError("");
    try {
      setRows(await listAll<Row>(config.collection));
    } catch {
      setError("تعذّر التحميل. تأكد من نشر قواعد Firestore.");
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    load();
  }, [load]);

  if (!config) {
    return (
      <div className={styles.content}>
        <p className={styles.error}>نوع محتوى غير معروف.</p>
      </div>
    );
  }

  function blank() {
    const out: Record<string, string> = {};
    for (const field of config.fields) {
      out[field.name] =
        field.type === "status" ? "draft" : field.type === "number" ? "0" : "";
    }
    return out;
  }

  function startEdit(row: Row) {
    const out: Record<string, string> = {};
    for (const field of config.fields) {
      out[field.name] = row[field.name] == null ? "" : String(row[field.name]);
    }
    setForm(out);
    setEditing(row.id);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload: Record<string, unknown> = {};
    for (const field of config.fields) {
      const raw = (form[field.name] ?? "").trim();
      payload[field.name] =
        field.type === "number" ? Math.round(Number(raw) || 0) : raw;
    }

    try {
      if (editing === "new") await createDoc(config.collection, payload);
      else if (editing) await updateDocById(config.collection, editing, payload);
      setEditing(null);
      await load();
    } catch {
      setError("تعذّر الحفظ.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.title}>{config.labelAr}</h1>
        <button
          className={styles.btnPrimary}
          type="button"
          onClick={() => {
            setForm(blank());
            setEditing("new");
          }}
        >
          إضافة
        </button>
      </div>

      <div className={styles.content}>
        {error && <p className={styles.error}>{error}</p>}

        {editing && (
          <div className={styles.cardPad} style={{ marginBottom: 20 }}>
            <form className={styles.form} onSubmit={save}>
              {config.fields.map((field) => (
                <div className={styles.field} key={field.name}>
                  <label className={styles.fieldLabel} htmlFor={field.name}>
                    {field.label}
                    {field.required ? " *" : ""}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      className={styles.textarea}
                      id={field.name}
                      rows={3}
                      required={field.required}
                      value={form[field.name] ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, [field.name]: e.target.value })
                      }
                    />
                  ) : field.type === "status" ? (
                    <select
                      className={styles.select}
                      id={field.name}
                      value={form[field.name] ?? "draft"}
                      onChange={(e) =>
                        setForm({ ...form, [field.name]: e.target.value })
                      }
                    >
                      <option value="draft">مسودة</option>
                      <option value="published">منشور</option>
                    </select>
                  ) : (
                    <input
                      className={styles.input}
                      id={field.name}
                      type={field.type === "number" ? "number" : "text"}
                      dir={field.name === "image" || field.name === "slug" ? "ltr" : "rtl"}
                      required={field.required}
                      value={form[field.name] ?? ""}
                      onChange={(e) =>
                        setForm({ ...form, [field.name]: e.target.value })
                      }
                    />
                  )}
                </div>
              ))}

              <div className={styles.formActions}>
                <button className={styles.btnPrimary} type="submit" disabled={saving}>
                  {saving ? "جارٍ الحفظ…" : "حفظ"}
                </button>
                <button
                  className={styles.btn}
                  type="button"
                  onClick={() => setEditing(null)}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.card}>
          {loading ? (
            <p className={styles.empty}>جارٍ التحميل…</p>
          ) : rows.length === 0 ? (
            <p className={styles.empty}>لا توجد عناصر بعد.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>العنوان</th>
                    <th>الحالة</th>
                    <th>الترتيب</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td className={styles.rowTitle}>
                        {String(row[config.titleField] ?? "—")}
                      </td>
                      <td>
                        <span
                          className={
                            row.status === "published"
                              ? styles.badgePublished
                              : styles.badgeDraft
                          }
                        >
                          {row.status === "published" ? "منشور" : "مسودة"}
                        </span>
                      </td>
                      <td>{String(row.sortOrder ?? 0)}</td>
                      <td>
                        <div className={styles.formActions}>
                          <button
                            className={styles.btn}
                            type="button"
                            onClick={() => startEdit(row)}
                          >
                            تعديل
                          </button>
                          <button
                            className={styles.btnDanger}
                            type="button"
                            onClick={async () => {
                              await deleteDocById(config.collection, row.id);
                              await load();
                            }}
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
