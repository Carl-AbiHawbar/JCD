"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  QUESTIONS,
  computeResult,
  type Answers,
  type AssessmentResult,
} from "@/lib/assessment/questions";
import { submitAssessment } from "@/lib/firebase/public-writes";
import styles from "./Assessment.module.css";

const STORAGE_KEY = "volunteerAssessmentProgress";
const CENTER_NAME = "الشبكة لمكافحة المخدرات";

type Screen = "intro" | "question" | "result";

type Saved = { currentIndex: number; answers: Answers; assessmentId: string };

function createAssessmentId() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `VOL-${Date.now()}-${random}`;
}

function buildSummaryText(result: AssessmentResult, assessmentId: string) {
  return [
    `تقييم جهوزية التطوع — ${CENTER_NAME}`,
    `رقم التقييم: ${assessmentId}`,
    `مؤشر الجهوزية: ${result.percentage}%`,
    `النتيجة: ${result.status}`,
    `المسار المفضّل: ${result.preferredTrack}`,
    "",
    "نقاط القوة:",
    ...result.strengths.map((s) => `- ${s}`),
    "",
    "نقاط تحتاج مراجعة أو تدريباً:",
    ...result.development.map((s) => `- ${s}`),
    "",
    "ملاحظة: النتيجة أولية ولا تشكّل قبولاً نهائياً.",
  ].join("\n");
}

export default function Assessment() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [consent, setConsent] = useState(false);
  const [validation, setValidation] = useState("");
  const [assessmentId, setAssessmentId] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");
  const [submitState, setSubmitState] = useState<
    { kind: "idle" | "sending" | "sent" | "error"; message: string }
  >({ kind: "idle", message: "" });

  // Restore any in-progress attempt. Runs once, client-side only.
  useEffect(() => {
    let restored: Saved | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) restored = JSON.parse(raw) as Saved;
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }

    if (restored && typeof restored === "object") {
      const valid: Answers = {};
      for (const q of QUESTIONS) {
        const v = restored.answers?.[q.id];
        if (q.options.some((o) => o.value === v)) valid[q.id] = v;
      }
      setAnswers(valid);
      setIndex(
        Math.min(Math.max(Number(restored.currentIndex) || 0, 0), QUESTIONS.length - 1),
      );
      setAssessmentId(restored.assessmentId || createAssessmentId());
    } else {
      setAssessmentId(createAssessmentId());
    }
  }, []);

  const save = useCallback(
    (next: { currentIndex: number; answers: Answers }) => {
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...next, assessmentId }),
        );
      } catch {
        /* storage unavailable (private mode) — progress simply won't persist */
      }
    },
    [assessmentId],
  );

  const question = QUESTIONS[index];
  const selectedValue = answers[question.id];
  const isLast = index === QUESTIONS.length - 1;

  const result = useMemo(
    () => (screen === "result" ? computeResult(answers) : null),
    [screen, answers],
  );

  function choose(value: string) {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    setValidation("");
    save({ currentIndex: index, answers: next });
  }

  function goNext() {
    if (screen === "intro") {
      if (!consent) return;
      setScreen("question");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!answers[question.id]) {
      setValidation("يرجى اختيار إجابة قبل المتابعة.");
      return;
    }

    if (!isLast) {
      const next = index + 1;
      setIndex(next);
      save({ currentIndex: next, answers });
    } else {
      setScreen("result");
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    if (index === 0) return;
    const next = index - 1;
    setIndex(next);
    save({ currentIndex: next, answers });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    setAnswers({});
    setIndex(0);
    setConsent(false);
    setShowAnswers(false);
    setCopyStatus("");
    setSubmitState({ kind: "idle", message: "" });
    setAssessmentId(createAssessmentId());
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setScreen("intro");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function copySummary() {
    if (!result) return;
    const text = buildSummaryText(result, assessmentId);
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("تم نسخ ملخص النتيجة.");
    } catch {
      setCopyStatus("تعذّر النسخ تلقائياً. يمكنك تحديد النص ونسخه يدوياً.");
    }
  }

  async function submit() {
    if (submitState.kind === "sending" || submitState.kind === "sent") return;
    setSubmitState({ kind: "sending", message: "جارٍ إرسال النتيجة..." });

    try {
      const scored = computeResult(answers);
      await submitAssessment({
        reference: assessmentId,
        score: scored.score,
        maxScore: scored.maxScore,
        percentage: scored.percentage,
        level: scored.level,
        statusAr: scored.status,
        preferredTrack: scored.preferredTrack,
        answers: scored.answers,
        strengths: scored.strengths,
        development: scored.development,
      });

      setSubmitState({ kind: "sent", message: "تم إرسال النتيجة بنجاح." });
    } catch {
      setSubmitState({
        kind: "error",
        message: "تعذّر إرسال النتيجة. يرجى المحاولة لاحقاً.",
      });
    }
  }

  const progress = ((index + 1) / QUESTIONS.length) * 100;

  const badgeClass =
    result?.level === "blocked"
      ? styles.badgeBlocked
      : result?.level === "high"
        ? styles.badge
        : styles.badgeWarning;

  const badgeText =
    result?.level === "blocked"
      ? "تحتاج مراجعة الشروط"
      : result?.level === "high"
        ? "أولوية مرتفعة للمراجعة"
        : "تحتاج مراجعة أو توجيهاً";

  return (
    <div className={styles.page}>
      <main className={styles.shell}>
        <div className={styles.brandRow}>
          <div className={styles.brand}>
            <div className={styles.brandMark} aria-hidden="true">
              ت
            </div>
            <span>{CENTER_NAME}</span>
          </div>
          <div className={styles.privacyNote}>
            تقييم أولي — لا يشكّل قبولاً نهائياً
          </div>
        </div>

        <section className={styles.card}>
          {screen === "question" && (
            <header className={styles.cardHeader}>
              <div className={styles.progressWrap} aria-label="تقدّم التقييم">
                <div className={styles.progressTrack} aria-hidden="true">
                  <div
                    className={styles.progressBar}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className={styles.progressLabel}>
                  {index + 1} من {QUESTIONS.length}
                </div>
              </div>
            </header>
          )}

          <div className={styles.cardBody}>
            {screen === "intro" && (
              <section>
                <p className={styles.eyebrow}>تقييم جهوزية التطوع</p>
                <h1 className={styles.h1}>اكتشف مدى جهوزيتك للتطوع معنا</h1>
                <p className={styles.lead}>
                  يتكوّن هذا التقييم من {QUESTIONS.length} أسئلة قصيرة حول الدافع،
                  الالتزام، الخبرة، التواصل، السرية، والشروط الأساسية للتطوع.
                </p>

                <div className={styles.introGrid}>
                  <div className={styles.introItem}>
                    <strong>{QUESTIONS.length} أسئلة</strong>
                    <span>اختيار واحد لكل سؤال</span>
                  </div>
                  <div className={styles.introItem}>
                    <strong>نتيجة فورية</strong>
                    <span>مع نقاط القوة واحتياجات التطوير</span>
                  </div>
                  <div className={styles.introItem}>
                    <strong>مسار مقترح</strong>
                    <span>بحسب نوع التطوع المفضّل</span>
                  </div>
                </div>

                <div className={styles.consentBox}>
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <label htmlFor="consent">
                    أفهم أن هذه النتيجة أولية، وأن القبول وتحديد الدور المناسب
                    يخضعان لمراجعة المركز، المقابلة، التدريب، ومتطلبات حماية
                    المستفيدين.
                  </label>
                </div>
              </section>
            )}

            {screen === "question" && (
              <section aria-live="polite">
                <div className={styles.questionNumber}>
                  السؤال {index + 1} من {QUESTIONS.length}
                </div>
                <h2 className={styles.h2}>{question.text}</h2>

                <div className={styles.optionsList} role="radiogroup">
                  {question.options.map((option) => (
                    <label
                      key={option.value}
                      className={
                        option.value === selectedValue
                          ? styles.optionSelected
                          : styles.optionCard
                      }
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.value}
                        checked={option.value === selectedValue}
                        onChange={() => choose(option.value)}
                      />
                      <span className={styles.optionText}>{option.label}</span>
                    </label>
                  ))}
                </div>

                <div className={styles.validation} aria-live="assertive">
                  {validation}
                </div>
              </section>
            )}

            {screen === "result" && result && (
              <section aria-live="polite">
                <div className={styles.resultHero}>
                  <div
                    className={styles.scoreRing}
                    style={
                      {
                        "--score-angle": `${result.percentage * 3.6}deg`,
                      } as React.CSSProperties
                    }
                  >
                    <div className={styles.scoreValue}>
                      <span>{result.percentage}%</span>
                      <small>مؤشر الجهوزية</small>
                    </div>
                  </div>

                  <div>
                    <span className={badgeClass}>{badgeText}</span>
                    <h2 className={styles.resultStatus}>{result.status}</h2>
                    <p className={styles.resultSummary}>{result.summary}</p>
                  </div>
                </div>

                <div className={styles.resultGrid}>
                  <article className={styles.trackBox}>
                    <div className={styles.trackLabel}>مسار التطوع المفضّل</div>
                    <h3 className={styles.h3}>{result.preferredTrack}</h3>
                    <p style={{ margin: 0 }}>{result.trackNote}</p>
                  </article>

                  <article className={styles.panel}>
                    <h3 className={styles.h3}>نقاط القوة الظاهرة</h3>
                    <ul>
                      {result.strengths.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </article>

                  <article className={styles.panel}>
                    <h3 className={styles.h3}>نقاط تحتاج مراجعة أو تدريباً</h3>
                    <ul>
                      {result.development.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </article>
                </div>

                <button
                  className={styles.answersToggle}
                  type="button"
                  aria-expanded={showAnswers}
                  onClick={() => setShowAnswers((v) => !v)}
                >
                  {showAnswers ? "إخفاء الإجابات" : "عرض الإجابات"}
                </button>

                {showAnswers && (
                  <div className={styles.answersList}>
                    {result.answers.map((item, i) => (
                      <div className={styles.answerRow} key={item.questionId}>
                        <strong>
                          {i + 1}. {item.question}
                        </strong>
                        <span>{item.answer ?? "لم تتم الإجابة"}</span>
                      </div>
                    ))}
                  </div>
                )}

                <p className={styles.disclaimer}>
                  هذا التقييم أداة فرز أولية وليس تقييماً نفسياً أو طبياً، ولا
                  يضمن قبول طلب التطوع أو إسناد دور مباشر مع المستفيدين.
                </p>

                <p className={styles.status}>{copyStatus}</p>
                <p
                  className={
                    submitState.kind === "error" ? styles.statusError : styles.status
                  }
                  aria-live="polite"
                >
                  {submitState.message}
                </p>
              </section>
            )}
          </div>

          <footer className={styles.cardFooter}>
            {screen === "result" && (
              <button className={styles.btnQuiet} type="button" onClick={restart}>
                إعادة التقييم
              </button>
            )}

            <div className={styles.footerActions}>
              {screen === "question" && (
                <button
                  className={styles.btnSecondary}
                  type="button"
                  onClick={goBack}
                  disabled={index === 0}
                >
                  السابق
                </button>
              )}

              {screen === "result" && (
                <>
                  <button
                    className={styles.btnSecondary}
                    type="button"
                    onClick={copySummary}
                  >
                    نسخ الملخص
                  </button>
                  <button
                    className={styles.btnSecondary}
                    type="button"
                    onClick={() => window.print()}
                  >
                    طباعة / حفظ PDF
                  </button>
                  <button
                    className={styles.btnPrimary}
                    type="button"
                    onClick={submit}
                    disabled={
                      submitState.kind === "sending" || submitState.kind === "sent"
                    }
                  >
                    {submitState.kind === "sent" ? "تم الإرسال" : "إرسال النتيجة"}
                  </button>
                </>
              )}

              {screen !== "result" && (
                <button
                  className={styles.btnPrimary}
                  type="button"
                  onClick={goNext}
                  disabled={
                    screen === "intro" ? !consent : !selectedValue
                  }
                >
                  {screen === "intro"
                    ? "ابدأ التقييم"
                    : isLast
                      ? "عرض النتيجة"
                      : "التالي"}
                </button>
              )}
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
