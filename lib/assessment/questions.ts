/**
 * Volunteer readiness assessment — questions and scoring.
 *
 * Ported from the supplied standalone `volunteer-readiness-assessment.html`.
 * Kept free of React and of any browser or server API so that the client form
 * and the API route score identically from the same source.
 *
 * Per README-AR: questions 1–7, 9 and 10 are scored 3→0 in option order;
 * question 8 is unscored and only selects the preferred track. The banding and
 * weights are implementation choices, not rules stated in the source document.
 */

export type Option = {
  value: string;
  label: string;
  score?: number;
  track?: string;
};

export type Question = {
  id: string;
  text: string;
  /** false for the track question, which does not contribute to the score. */
  scored?: false;
  options: Option[];
};

export const QUESTIONS: Question[] = [
  {
    id: "motivation",
    text: "ما هو الدافع الرئيسي الذي يجعلك ترغب في التطوع معنا؟",
    options: [
      { value: "mission", label: "أؤمن برسالة المركز وأرغب في دعم المتعافين.", score: 3 },
      { value: "community", label: "أرغب في خدمة المجتمع واكتساب خبرة.", score: 2 },
      { value: "hours", label: "أبحث عن ساعات تطوع أو متطلب جامعي.", score: 1 },
      { value: "unsure", label: "لست متأكداً بعد من سبب رغبتي.", score: 0 },
    ],
  },
  {
    id: "commitment",
    text: "ما مدى قدرتك على الالتزام بالتطوع؟",
    options: [
      { value: "fixed", label: "أستطيع الالتزام بجدول ثابت أسبوعياً.", score: 3 },
      { value: "needed", label: "أستطيع التطوع عند الحاجة فقط.", score: 2 },
      { value: "occasional", label: "أستطيع المشاركة بشكل متقطع.", score: 1 },
      { value: "none", label: "لا أستطيع الالتزام حالياً.", score: 0 },
    ],
  },
  {
    id: "experience",
    text: "ما هي خبرتك السابقة في العمل التطوعي؟",
    options: [
      { value: "extensive", label: "لدي خبرة واسعة في التطوع.", score: 3 },
      { value: "limited", label: "لدي خبرة محدودة.", score: 2 },
      { value: "simple", label: "شاركت في نشاطات بسيطة.", score: 1 },
      { value: "none", label: "لا أملك أي خبرة.", score: 0 },
    ],
  },
  {
    id: "stress",
    text: "كيف تتعامل مع الضغط النفسي؟",
    options: [
      { value: "calm_support", label: "أتعامل معه بهدوء وأطلب الدعم عند الحاجة.", score: 3 },
      { value: "mostly_well", label: "أتعامل معه غالباً بشكل جيد.", score: 2 },
      { value: "sometimes_difficult", label: "أواجه صعوبة أحياناً.", score: 1 },
      { value: "avoid", label: "أفضل تجنب المواقف الضاغطة.", score: 0 },
    ],
  },
  {
    id: "addictionKnowledge",
    text: "ما مدى معرفتك بقضية الإدمان؟",
    options: [
      { value: "good", label: "لدي معرفة جيدة بطبيعة الإدمان والتعافي.", score: 3 },
      { value: "basic", label: "لدي معرفة أساسية.", score: 2 },
      { value: "limited", label: "معلوماتي محدودة.", score: 1 },
      { value: "none", label: "لا أملك أي معرفة.", score: 0 },
    ],
  },
  {
    id: "communication",
    text: "كيف تقيّم مهاراتك في التواصل؟",
    options: [
      { value: "excellent", label: "ممتازة وأستطيع بناء علاقة احترام وثقة.", score: 3 },
      { value: "good", label: "جيدة.", score: 2 },
      { value: "acceptable", label: "مقبولة.", score: 1 },
      { value: "develop", label: "أحتاج إلى تطويرها.", score: 0 },
    ],
  },
  {
    id: "background",
    text: "هل لديك خلفية في أحد المجالات التالية؟",
    options: [
      {
        value: "specialized",
        label: "علم النفس أو الخدمة الاجتماعية أو التمريض أو التربية.",
        score: 3,
      },
      { value: "health_humanitarian", label: "مجال صحي أو إنساني آخر.", score: 2 },
      { value: "different", label: "تخصص مختلف.", score: 1 },
      { value: "student", label: "لا أزال طالباً.", score: 0 },
    ],
  },
  {
    id: "preferredTrack",
    text: "أي نوع من التطوع تفضّل؟",
    scored: false,
    options: [
      { value: "direct", label: "العمل المباشر مع المتعافين.", track: "العمل المباشر مع المتعافين" },
      { value: "awareness", label: "التوعية المجتمعية والأنشطة.", track: "التوعية المجتمعية والأنشطة" },
      { value: "logistics", label: "التنظيم واللوجستيات.", track: "التنظيم واللوجستيات" },
      { value: "admin_media", label: "الدعم الإداري والإعلامي.", track: "الدعم الإداري والإعلامي" },
    ],
  },
  {
    id: "confidentiality",
    text: "إذا طُلب منك الحفاظ على سرية معلومات المستفيدين، ماذا سيكون موقفك؟",
    options: [
      { value: "full", label: "ألتزم بالسرية بشكل كامل.", score: 3 },
      { value: "guidance", label: "ألتزم بها مع طلب التوجيه عند الحاجة.", score: 2 },
      { value: "unclear", label: "لست متأكداً من حدود السرية.", score: 1 },
      { value: "need_info", label: "أحتاج لمعرفة المزيد قبل الإجابة.", score: 0 },
    ],
  },
  {
    id: "eligibility",
    text: "هل تستوفي شروط التطوع الأساسية؟",
    options: [
      {
        value: "all",
        label:
          "نعم، عمري فوق 18 سنة، ولا أعاني حالياً من إدمان، وأستطيع حضور التدريبات.",
        score: 3,
      },
      { value: "two", label: "ينطبق علي شرطان فقط.", score: 2 },
      { value: "one", label: "ينطبق علي شرط واحد.", score: 1 },
      { value: "none", label: "لا تنطبق علي هذه الشروط حالياً.", score: 0 },
    ],
  },
];

export type Answers = Record<string, string>;

export type ReadinessLevel =
  | "blocked"
  | "high"
  | "good"
  | "developing"
  | "limited";

export type AssessmentResult = {
  score: number;
  maxScore: number;
  percentage: number;
  level: ReadinessLevel;
  status: string;
  summary: string;
  preferredTrack: string;
  trackNote: string;
  strengths: string[];
  development: string[];
  answers: {
    questionId: string;
    question: string;
    answerValue: string | null;
    answer: string | null;
    score: number | null;
  }[];
};

const SCORED = QUESTIONS.filter((q) => q.scored !== false);

export const MAX_SCORE = SCORED.reduce(
  (sum, q) => sum + Math.max(...q.options.map((o) => o.score ?? 0)),
  0,
);

export function findQuestion(id: string) {
  return QUESTIONS.find((q) => q.id === id) ?? null;
}

function selected(answers: Answers, id: string): Option | null {
  const question = findQuestion(id);
  if (!question) return null;
  return question.options.find((o) => o.value === answers[id]) ?? null;
}

function scoreOf(answers: Answers, id: string): number {
  return selected(answers, id)?.score ?? 0;
}

/** True when every question has an answer that exists in its option list. */
export function isComplete(answers: Answers) {
  return QUESTIONS.every((q) =>
    q.options.some((o) => o.value === answers[q.id]),
  );
}

/** Drops anything that is not a known question/option pair. */
export function sanitiseAnswers(input: unknown): Answers {
  const out: Answers = {};
  if (!input || typeof input !== "object") return out;

  const record = input as Record<string, unknown>;
  for (const question of QUESTIONS) {
    const value = record[question.id];
    if (
      typeof value === "string" &&
      question.options.some((o) => o.value === value)
    ) {
      out[question.id] = value;
    }
  }
  return out;
}

export function computeResult(answers: Answers): AssessmentResult {
  const score = SCORED.reduce((sum, q) => sum + scoreOf(answers, q.id), 0);
  const percentage = Math.round((score / MAX_SCORE) * 100);

  const confidentiality = selected(answers, "confidentiality")?.value;
  const eligibility = selected(answers, "eligibility")?.value;
  const commitment = selected(answers, "commitment")?.value;
  const trackOption = selected(answers, "preferredTrack");

  let level: ReadinessLevel;
  let status: string;
  let summary: string;

  if (eligibility === "none") {
    level = "blocked";
    status = "غير مستوفٍ للشروط الأساسية حالياً";
    summary =
      "تشير الإجابة الخاصة بالشروط الأساسية إلى أن طلب التطوع يحتاج إلى تأجيل أو مراجعة مباشرة مع المركز قبل الانتقال إلى أي دور.";
  } else if (percentage >= 80) {
    level = "high";
    status = "جهوزية مرتفعة";
    summary =
      "تظهر الإجابات مستوى مرتفعاً من الدافع والالتزام والقدرات الأولية، مع بقاء المقابلة والتدريب ومراجعة شروط الحماية ضرورية.";
  } else if (percentage >= 60) {
    level = "good";
    status = "جهوزية جيدة مع حاجة إلى توجيه";
    summary =
      "توجد قاعدة مناسبة للبدء، مع بعض النقاط التي ينبغي توضيحها أو تطويرها قبل تحديد الدور النهائي.";
  } else if (percentage >= 40) {
    level = "developing";
    status = "جهوزية أولية تحتاج إلى تدريب";
    summary =
      "توجد رغبة أو قدرات أولية، لكن يلزم تدريب وتمهيد أوضح قبل إسناد مسؤوليات تطوعية منتظمة.";
  } else {
    level = "limited";
    status = "الجهوزية الحالية محدودة";
    summary =
      "تشير الإجابات إلى أن البدء الفوري قد لا يكون مناسباً، ويُفضّل معالجة متطلبات الالتزام والمعرفة والمهارات الأساسية أولاً.";
  }

  const strengths: string[] = [];
  const development: string[] = [];

  const strength = (ok: boolean, text: string) => ok && strengths.push(text);
  const develop = (ok: boolean, text: string) => ok && development.push(text);

  strength(scoreOf(answers, "motivation") >= 2, "دافع واضح لخدمة رسالة المركز أو المجتمع.");
  strength(scoreOf(answers, "commitment") >= 2, "قدرة مناسبة على تخصيص وقت للتطوع.");
  strength(scoreOf(answers, "experience") >= 2, "خبرة تطوعية سابقة يمكن البناء عليها.");
  strength(scoreOf(answers, "stress") >= 2, "قدرة جيدة على التعامل مع الضغط وطلب الدعم.");
  strength(scoreOf(answers, "addictionKnowledge") >= 2, "معرفة أولية مناسبة بالإدمان والتعافي.");
  strength(scoreOf(answers, "communication") >= 2, "مهارات تواصل تساعد على بناء الاحترام والثقة.");
  strength(scoreOf(answers, "background") >= 2, "خلفية أكاديمية أو مهنية ذات صلة.");
  strength(confidentiality === "full", "التزام واضح بسرية معلومات المستفيدين.");
  strength(eligibility === "all", "استيفاء الشروط الأساسية المعلنة للتطوع.");

  develop(scoreOf(answers, "motivation") <= 1, "توضيح الدافع والتوقعات خلال المقابلة.");
  develop(
    commitment === "occasional" || commitment === "none",
    "مراجعة القدرة على الالتزام بجدول تطوعي مناسب.",
  );
  develop(scoreOf(answers, "experience") === 0, "توجيه تمهيدي بسبب عدم وجود خبرة تطوعية سابقة.");
  develop(scoreOf(answers, "stress") <= 1, "تدريب على التعامل مع الضغط وحدود الدور وطلب الدعم.");
  develop(scoreOf(answers, "addictionKnowledge") <= 1, "تدريب أساسي حول الإدمان ومسار التعافي.");
  develop(scoreOf(answers, "communication") <= 1, "تطوير مهارات التواصل ووضع الحدود المهنية.");
  develop(scoreOf(answers, "background") <= 1, "تحديد دور يتناسب مع الخلفية الحالية مع تدريب مناسب.");
  develop(confidentiality !== "full", "توضيح سياسة السرية وحدود مشاركة معلومات المستفيدين.");
  develop(eligibility !== "all", "مراجعة الشروط الأساسية قبل اعتماد الطلب.");

  if (strengths.length === 0) {
    strengths.push("تم تسجيل الاهتمام بالتطوع والمسار المفضّل للمراجعة.");
  }
  if (development.length === 0) {
    development.push("استكمال المقابلة والتدريب الإلزامي قبل بدء التطوع.");
  }

  let trackNote =
    "يخضع تحديد الدور النهائي لاحتياجات المركز ونتائج المقابلة والتدريب.";
  if (
    trackOption?.value === "direct" &&
    (percentage < 80 || confidentiality !== "full" || eligibility !== "all")
  ) {
    trackNote =
      "تم تسجيل تفضيل العمل المباشر، لكن هذا المسار يتطلب مراجعة أعلى للسرية والجهوزية والشروط الأساسية قبل اعتماده.";
  }

  return {
    score,
    maxScore: MAX_SCORE,
    percentage,
    level,
    status,
    summary,
    preferredTrack: trackOption?.track ?? "غير محدد",
    trackNote,
    strengths,
    development,
    answers: QUESTIONS.map((q) => {
      const option = selected(answers, q.id);
      return {
        questionId: q.id,
        question: q.text,
        answerValue: option?.value ?? null,
        answer: option?.label ?? null,
        score: q.scored === false ? null : option?.score ?? null,
      };
    }),
  };
}
