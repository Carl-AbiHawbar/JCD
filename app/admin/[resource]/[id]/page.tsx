import { notFound } from "next/navigation";

import ResourceForm from "@/components/admin/ResourceForm";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getResource } from "@/lib/admin/resources";
import { deleteResource } from "../../actions";
import styles from "../../admin.module.css";

export default async function EditResourcePage({
  params,
}: PageProps<"/admin/[resource]/[id]">) {
  await requireAdmin();

  const { resource, id } = await params;
  const config = getResource(resource);
  if (!config) notFound();

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from(config.table)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.title}>{config.labelAr} — تعديل</h1>
        <form action={deleteResource}>
          <input type="hidden" name="__resource" value={resource} />
          <input type="hidden" name="__id" value={id} />
          <button className={styles.btnDanger} type="submit">
            حذف
          </button>
        </form>
      </div>

      <div className={styles.content}>
        <div className={styles.cardPad}>
          <ResourceForm
            resource={resource}
            config={config}
            record={data as Record<string, unknown>}
          />
        </div>
      </div>
    </>
  );
}
