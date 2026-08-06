"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { saveProduct } from "@/app/admin/products/actions";
import type { ActionState } from "@/app/admin/actions";
import type { Collection, Product } from "@/lib/supabase/types";
import styles from "@/app/admin/admin.module.css";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className={styles.btnPrimary} type="submit" disabled={pending}>
      {pending ? "جارٍ الحفظ…" : "حفظ"}
    </button>
  );
}

export default function ProductForm({
  product,
  collections,
}: {
  product: Product | null;
  collections: Collection[];
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    saveProduct,
    undefined,
  );

  return (
    <form className={styles.form} action={formAction}>
      {product && <input type="hidden" name="__id" value={product.id} />}
      {state?.error && <p className={styles.error}>{state.error}</p>}

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="title_ar">
          الاسم *
        </label>
        <input
          className={styles.input}
          id="title_ar"
          name="title_ar"
          defaultValue={product?.title_ar ?? ""}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="slug">
          المعرّف *
        </label>
        <input
          className={styles.input}
          id="slug"
          name="slug"
          dir="ltr"
          defaultValue={product?.slug ?? ""}
          required
        />
        <span className={styles.fieldHelp}>يظهر في رابط المنتج</span>
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="description_ar">
          الوصف
        </label>
        <textarea
          className={styles.textarea}
          id="description_ar"
          name="description_ar"
          defaultValue={product?.description_ar ?? ""}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="price">
          السعر *
        </label>
        <input
          className={styles.input}
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          dir="ltr"
          defaultValue={product ? product.price_cents / 100 : 0}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="stock">
          الكمية المتوفرة
        </label>
        <input
          className={styles.input}
          id="stock"
          name="stock"
          type="number"
          min="0"
          step="1"
          dir="ltr"
          defaultValue={product?.stock ?? 0}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="collection_id">
          التصنيف
        </label>
        <select
          className={styles.select}
          id="collection_id"
          name="collection_id"
          defaultValue={product?.collection_id ?? ""}
        >
          <option value="">بدون تصنيف</option>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title_ar}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="status">
          الحالة
        </label>
        <select
          className={styles.select}
          id="status"
          name="status"
          defaultValue={product?.status ?? "draft"}
        >
          <option value="draft">مسودة</option>
          <option value="published">منشور</option>
          <option value="archived">مؤرشف</option>
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel} htmlFor="sort_order">
          الترتيب
        </label>
        <input
          className={styles.input}
          id="sort_order"
          name="sort_order"
          type="number"
          dir="ltr"
          defaultValue={product?.sort_order ?? 0}
        />
      </div>

      <div className={styles.formActions}>
        <SubmitButton />
        <Link className={styles.btn} href="/admin/products">
          إلغاء
        </Link>
      </div>
    </form>
  );
}
