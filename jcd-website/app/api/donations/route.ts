import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Amounts offered on the page, in cents. Anything else is rejected. */
const ALLOWED_CENTS = new Set([0, 10000, 15000, 20000, 50000]);

/**
 * Records a donation pledge.
 *
 * No payment provider is connected, so this stores an intent for manual
 * follow-up rather than taking money. `donations_public_insert` pins new rows
 * to status 'pledged'; only admins can read them.
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Donations are not configured." }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    amountCents?: unknown;
    name?: unknown;
    email?: unknown;
    phone?: unknown;
    note?: unknown;
  };

  const amountCents = Number(body.amountCents);
  if (!Number.isInteger(amountCents) || !ALLOWED_CENTS.has(amountCents)) {
    return NextResponse.json({ error: "مبلغ غير صالح." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const note = String(body.note ?? "").trim();

  if (!name && !email && !phone) {
    return NextResponse.json(
      { error: "يرجى ترك وسيلة تواصل واحدة على الأقل." },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("donations").insert({
    amount_cents: amountCents,
    currency: "USD",
    donor_name: name || null,
    donor_email: email || null,
    donor_phone: phone || null,
    note: note || null,
    status: "pledged",
  });

  if (error) {
    console.error("Donation insert failed:", error.message);
    return NextResponse.json({ error: "تعذّر تسجيل التبرع." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
