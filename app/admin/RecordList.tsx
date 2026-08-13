"use client";

import { useCallback, useEffect, useState } from "react";

import styles from "./admin.module.css";

export type Column<T> = {
  header: string;
  cell: (row: T) => React.ReactNode;
  ltr?: boolean;
};

/**
 * Read-only list used by the donations, subscribers and assessments pages.
 * They differ only in their query and their columns.
 */
export default function RecordList<T extends { id: string }>({
  title,
  load,
  columns,
  emptyText,
  summary,
}: {
  title: string;
  load: () => Promise<T[]>;
  columns: Column<T>[];
  emptyText: string;
  summary?: (rows: T[]) => React.ReactNode;
}) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const run = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRows(await load());
    } catch {
      setError("تعذّر التحميل. تأكد من نشر قواعد Firestore ومن صلاحيات حسابك.");
    } finally {
      setLoading(false);
    }
  }, [load]);

  useEffect(() => {
    run();
  }, [run]);

  return (
    <>
      <div className={styles.topbar}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.formActions}>
          {summary && !loading ? summary(rows) : null}
          <button className={styles.btn} type="button" onClick={run} disabled={loading}>
            تحديث
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.card}>
          {loading ? (
            <p className={styles.empty}>جارٍ التحميل…</p>
          ) : rows.length === 0 ? (
            <p className={styles.empty}>{emptyText}</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.header}>{column.header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      {columns.map((column) => (
                        <td key={column.header} dir={column.ltr ? "ltr" : undefined}>
                          {column.cell(row)}
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
