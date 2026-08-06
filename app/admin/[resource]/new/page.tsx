import { notFound } from "next/navigation";

import ResourceForm from "@/components/admin/ResourceForm";
import { requireAdmin } from "@/lib/auth";
import { getResource } from "@/lib/admin/resources";
import styles from "../../admin.module.css";

export default async function NewResourcePage({
  params,
}: PageProps<"/admin/[resource]/new">) {
  await requireAdmin();

  const { resource } = await params;
  const config = getResource(resource);
  if (!config) notFound();

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.title}>{config.labelAr} — إضافة</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.cardPad}>
          <ResourceForm resource={resource} config={config} record={null} />
        </div>
      </div>
    </>
  );
}
