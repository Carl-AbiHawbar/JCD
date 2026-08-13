"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
  type ProductInput,
} from "@/lib/firebase/admin-db";
import type { Product } from "@/lib/firebase/types";
import { money } from "../format";
import styles from "../admin.module.css";

const BLANK: ProductInput = {
  slug: "",
  titleAr: "",
  descriptionAr: "",
  priceCents: 0,
  currency: "USD",
  stock: 0,
  status: "draft",
  sortOrder: 0,
  image: "",
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9؀-ۿ]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<ProductInput>(BLANK);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setProducts(await listProducts());
    } catch {
      setError("تعذّر تحميل المنتجات. تأكد من نشر قواعد Firestore.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startNew() {
    setEditing("new");
    setForm({ ...BLANK, sortOrder: products.length });
  }

  function startEdit(product: Product) {
    setEditing(product.id);
    const { id: _id, ...rest } = product;
    void _id;
    setForm({ ...BLANK, ...rest });
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload: ProductInput = {
      ...form,
      slug: form.slug.trim() || slugify(form.titleAr),
      priceCents: Math.max(0, Math.round(Number(form.priceCents) || 0)),
      stock: Math.max(0, Math.round(Number(form.stock) || 0)),
      sortOrder: Math.round(Number(form.sortOrder) || 0),
      image: form.image?.trim() ? form.image.trim() : null,
    };

    try {
      if (editing === "new") await createProduct(payload);
      else if (editing) await updateProduct(editing, payload);
      setEditing(null);
      await load();
    } catch {
      setError("تعذّر الحفظ.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    setError("");
    try {
      await deleteProduct(id);
      await load();
    } catch {
      setError("تعذّر الحذف.");
    }
  }

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.title}>المنتجات</h1>
        <button className={styles.btnPrimary} type="button" onClick={startNew}>
          إضافة منتج
        </button>
      </div>

      <div className={styles.content}>
        {error && <p className={styles.error}>{error}</p>}

        {editing && (
          <div className={styles.cardPad} style={{ marginBottom: 20 }}>
            <form className={styles.form} onSubmit={save}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="titleAr">
                  الاسم *
                </label>
                <input
                  className={styles.input}
                  id="titleAr"
                  required
                  value={form.titleAr}
                  onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="descriptionAr">
                  الوصف
                </label>
                <textarea
                  className={styles.textarea}
                  id="descriptionAr"
                  rows={2}
                  value={form.descriptionAr ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, descriptionAr: e.target.value })
                  }
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="price">
                    السعر (بالسنت) *
                  </label>
                  <input
                    className={styles.input}
                    id="price"
                    type="number"
                    min={0}
                    required
                    dir="ltr"
                    value={form.priceCents}
                    onChange={(e) =>
                      setForm({ ...form, priceCents: Number(e.target.value) })
                    }
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="stock">
                    المخزون
                  </label>
                  <input
                    className={styles.input}
                    id="stock"
                    type="number"
                    min={0}
                    dir="ltr"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: Number(e.target.value) })
                    }
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="sortOrder">
                    الترتيب
                  </label>
                  <input
                    className={styles.input}
                    id="sortOrder"
                    type="number"
                    dir="ltr"
                    value={form.sortOrder}
                    onChange={(e) =>
                      setForm({ ...form, sortOrder: Number(e.target.value) })
                    }
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="status">
                    الحالة
                  </label>
                  <select
                    className={styles.select}
                    id="status"
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as Product["status"],
                      })
                    }
                  >
                    <option value="draft">مسودة</option>
                    <option value="published">منشور</option>
                  </select>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="image">
                  رابط الصورة
                </label>
                <input
                  className={styles.input}
                  id="image"
                  dir="ltr"
                  placeholder="/sections/product-1.jpg"
                  value={form.image ?? ""}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
              </div>

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
          ) : products.length === 0 ? (
            <p className={styles.empty}>
              لا توجد منتجات. استخدم «استيراد المحتوى الأولي» في النظرة العامة أو أضف منتجاً.
            </p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>الاسم</th>
                    <th>السعر</th>
                    <th>المخزون</th>
                    <th>الحالة</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className={styles.rowTitle}>{product.titleAr}</td>
                      <td dir="ltr">{money(product.priceCents, product.currency)}</td>
                      <td>{product.stock}</td>
                      <td>
                        <span
                          className={
                            product.status === "published"
                              ? styles.badgePublished
                              : styles.badgeDraft
                          }
                        >
                          {product.status === "published" ? "منشور" : "مسودة"}
                        </span>
                      </td>
                      <td>
                        <div className={styles.formActions}>
                          <button
                            className={styles.btn}
                            type="button"
                            onClick={() => startEdit(product)}
                          >
                            تعديل
                          </button>
                          <button
                            className={styles.btnDanger}
                            type="button"
                            onClick={() => remove(product.id)}
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
