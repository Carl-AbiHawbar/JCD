import { getCurrentAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Escapes a value for CSV, guarding against spreadsheet formula injection. */
function csvCell(value: string) {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await getCurrentAdmin())) {
    return new Response("Forbidden", { status: 403 });
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("subscribers")
    .select("email, unsubscribed, created_at")
    .order("created_at", { ascending: false });

  const rows = [
    ["email", "unsubscribed", "created_at"],
    ...(data ?? []).map((s) => [
      s.email,
      String(s.unsubscribed),
      s.created_at,
    ]),
  ];

  const csv = rows.map((r) => r.map(csvCell).join(",")).join("\r\n");

  return new Response("﻿" + csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="subscribers.csv"',
    },
  });
}
