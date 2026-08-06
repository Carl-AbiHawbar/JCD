import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import styles from "../../admin.module.css";

export default async function NewProductPage() {
  await requireAdmin();

  const supabase = await createSupabaseServerClient();
  const { data: collections } = await supabase
    .from("collections")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.title}>منتج جديد</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.cardPad}>
          <ProductForm product={null} collections={collections ?? []} />
        </div>
      </div>
    </>
  );
}
