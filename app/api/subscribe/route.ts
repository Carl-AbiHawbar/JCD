import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Newsletter sign-up. Anonymous insert is allowed by `subscribers_insert`;
 * only admins can read the list back.
 */
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let email = "";

  if (contentType.includes("application/json")) {
    const body = (await request.json().catch(() => ({}))) as { email?: unknown };
    email = typeof body.email === "string" ? body.email : "";
  } else {
    const form = await request.formData();
    email = String(form.get("email") ?? "");
  }

  email = email.trim().toLowerCase();

  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: "يرجى إدخال بريد إلكتروني صحيح." },
      { status: 400 },
    );
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: true, stored: false });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("subscribers").insert({ email });

  // A repeat sign-up is a success from the visitor's point of view.
  if (error && error.code !== "23505") {
    console.error("Subscribe failed:", error.message);
    return NextResponse.json(
      { error: "تعذّر إتمام الاشتراك. يرجى المحاولة لاحقاً." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, stored: true });
}
