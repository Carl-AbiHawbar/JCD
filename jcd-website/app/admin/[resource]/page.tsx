import Link from "next/link";
import { notFound } from "next/navigation";

import { Cell } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getResource } from "@/lib/admin/resources";
import styles from "../admin.module.css";

export default async function ResourceListPage({
  params,
}: PageProps<"/admin/[resource]">) {
  await requireAdmin();

  const { resource } = await params;
  const config = getResource(resource);
  if (!config) notFound();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(config.table)
    .select("*")
    .order(config.orderBy.column, { ascending: config.orderBy.ascending });

  const rows = (data ?? []) as Record<string, unknown>[];

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.title}>{config.labelAr}</h1>
        <Link className={styles.btnPrimary} href={`/admin/${resource}/new`}>
          إضافة جديد
        </Link>
      </div>

      <div className={styles.content}>
        {error && <p className={styles.error}>{error.message}</p>}

        <div className={styles.card}>
          {rows.length === 0 ? (
            <p className={styles.empty}>لا توجد عناصر بعد.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>العنوان</th>
                    {config.listFields.map((f) => (
                      <th key={f.name}>{f.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={String(row.id)}>
                      <td>
                        <Link
                          className={styles.rowTitle}
                          href={`/admin/${resource}/${row.id}`}
                        >
                          {String(row[config.titleField] ?? "—")}
                        </Link>
                      </td>
                      {config.listFields.map((f) => (
                        <td key={f.name}>
                          <Cell value={row[f.name]} />
                        </td>
                      ))}
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
