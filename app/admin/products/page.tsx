import Link from "next/link";

import { StatusBadge, formatPrice } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import styles from "../admin.module.css";

export default async function ProductsPage() {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  const products = data ?? [];

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.title}>المنتجات</h1>
        <Link className={styles.btnPrimary} href="/admin/products/new">
          إضافة منتج
        </Link>
      </div>

      <div className={styles.content}>
        {error && <p className={styles.error}>{error.message}</p>}

        <div className={styles.card}>
          {products.length === 0 ? (
            <p className={styles.empty}>لا توجد منتجات بعد.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>الاسم</th>
                    <th>السعر</th>
                    <th>المخزون</th>
                    <th>الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <Link
                          className={styles.rowTitle}
                          href={`/admin/products/${p.id}`}
                        >
                          {p.title_ar}
                        </Link>
                      </td>
                      <td>{formatPrice(p.price_cents, p.currency)}</td>
                      <td>
                        {p.stock === 0 ? (
                          <span className={styles.badgeArchived}>نفد</span>
                        ) : (
                          p.stock
                        )}
                      </td>
                      <td>
                        <StatusBadge status={p.status} />
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
