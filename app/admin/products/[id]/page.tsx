import { notFound } from "next/navigation";

import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { deleteProduct } from "../actions";
import styles from "../../admin.module.css";

export default async function EditProductPage({
  params,
}: PageProps<"/admin/products/[id]">) {
  await requireAdmin();

  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const [{ data: product }, { data: collections }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("collections").select("*").order("sort_order", { ascending: true }),
  ]);

  if (!product) notFound();

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.title}>{product.title_ar}</h1>
        <form action={deleteProduct}>
          <input type="hidden" name="__id" value={id} />
          <button className={styles.btnDanger} type="submit">
            حذف
          </button>
        </form>
      </div>

      <div className={styles.content}>
        <div className={styles.cardPad}>
          <ProductForm product={product} collections={collections ?? []} />
        </div>
      </div>
    </>
  );
}
