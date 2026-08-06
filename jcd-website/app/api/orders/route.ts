import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const MESSAGES: Record<string, string> = {
  INVALID_NAME: "الاسم مطلوب.",
  INVALID_PHONE: "رقم الهاتف مطلوب.",
  EMPTY_CART: "السلة فارغة.",
};

/**
 * Places an order.
 *
 * Everything happens inside public.create_order: the line prices are read from
 * the products table in the same transaction, so the browser only ever sends
 * product ids and quantities, and an order can never be written without its
 * lines. Nothing here can read an order back.
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Store is not configured." }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    name?: unknown;
    phone?: unknown;
    email?: unknown;
    address?: unknown;
    note?: unknown;
    lines?: unknown;
  };

  const lines = (Array.isArray(body.lines) ? body.lines : [])
    .map((line) => {
      const l = line as { productId?: unknown; quantity?: unknown };
      const productId = typeof l.productId === "string" ? l.productId : "";
      const quantity = Number(l.quantity);
      return { productId, quantity };
    })
    .filter(
      (l) =>
        /^[0-9a-f-]{36}$/i.test(l.productId) &&
        Number.isInteger(l.quantity) &&
        l.quantity > 0,
    );

  if (lines.length === 0) {
    return NextResponse.json({ error: MESSAGES.EMPTY_CART }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: reference, error } = await supabase.rpc("create_order", {
    p_name: String(body.name ?? ""),
    p_phone: String(body.phone ?? ""),
    p_email: String(body.email ?? ""),
    p_address: String(body.address ?? ""),
    p_note: String(body.note ?? ""),
    p_items: lines,
  });

  if (error) {
    const code = Object.keys(MESSAGES).find((key) => error.message.includes(key));
    if (code) {
      return NextResponse.json({ error: MESSAGES[code] }, { status: 400 });
    }
    console.error("Order failed:", error.message);
    return NextResponse.json({ error: "تعذّر إتمام الطلب." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, reference });
}
