import { NextResponse } from "next/server";

import {
  computeResult,
  isComplete,
  sanitiseAnswers,
} from "@/lib/assessment/questions";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Receives a completed volunteer readiness assessment.
 *
 * The client sends only its answers. The score, level and narrative are
 * recomputed here from the shared module, so a submission cannot claim a
 * readiness level it did not earn. This differs from README-AR, which posts
 * the whole client-computed result.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const payload = (body ?? {}) as { assessmentId?: unknown; answers?: unknown };
  const answers = sanitiseAnswers(payload.answers);

  if (!isComplete(answers)) {
    return NextResponse.json(
      { error: "Assessment is incomplete." },
      { status: 400 },
    );
  }

  const reference =
    typeof payload.assessmentId === "string" &&
    /^VOL-\d+-[A-Z0-9]{1,12}$/.test(payload.assessmentId)
      ? payload.assessmentId
      : `VOL-${Date.now()}-SERVER`;

  const result = computeResult(answers);

  if (!isSupabaseConfigured) {
    // Nothing to persist to yet. The visitor still gets their result, which is
    // computed entirely client-side, so this is not treated as a failure.
    console.warn("Assessment received but Supabase is not configured:", reference);
    return NextResponse.json({ ok: true, stored: false, reference });
  }

  try {
    // Anonymous client: `assessments_public_insert` lets it write, and there
    // is no select policy for anon, so a submission can never be read back.
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("assessments").insert({
      reference,
      score: result.score,
      max_score: result.maxScore,
      percentage: result.percentage,
      level: result.level,
      status_ar: result.status,
      preferred_track: result.preferredTrack,
      answers: result.answers,
      strengths: result.strengths,
      development: result.development,
    });

    if (error) {
      // A repeat submission of the same attempt is not an error worth showing.
      if (error.code === "23505") {
        return NextResponse.json({ ok: true, stored: true, reference });
      }
      throw new Error(error.message);
    }

    return NextResponse.json({ ok: true, stored: true, reference });
  } catch (cause) {
    console.error("Failed to store assessment:", cause);
    return NextResponse.json(
      { error: "Could not store the assessment." },
      { status: 500 },
    );
  }
}
