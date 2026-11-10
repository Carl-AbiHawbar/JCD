import type { Locale } from "./i18n";

/**
 * "هل تلاحظ تغيرات مقلقة على أحد أفراد عائلتك؟" — JCD's early-warning list
 * for families.
 *
 * Nothing is stored: the ticks never leave the visitor's browser. The list
 * counts them, and from `threshold` signs on it suggests a professional
 * assessment, exactly as JCD's text does.
 */

export type Checklist = {
  title: string;
  lead: string;
  disclaimer: string;
  groups: { heading: string; signs: string[] }[];
  /** Shown before the number of ticked signs. */
  count: string;
  threshold: number;
  whenTitle: string;
  whenBody: string;
  belowBody: string;
  important: string;
  call: string;
  whatsapp: string;
  reset: string;
};

const AR: Checklist = {
  title: "هل تلاحظ تغيرات مقلقة على أحد أفراد عائلتك؟",
  lead: "هذه القائمة تساعدك على الكشف المبكر.",
  disclaimer:
    "لا يمكن تشخيص الإدمان من خلال هذه القائمة وحدها، لكنها تساعد على اكتشاف المشكلة مبكرًا.",
  groups: [
    {
      heading: "أولًا: تغيرات في السلوك",
      signs: [
        "الانعزال لساعات في غرفته.",
        "الكذب المتكرر أو إخفاء أماكن التواجد.",
        "فقدان الاهتمام بالدراسة أو العمل أو الهوايات.",
        "تقلبات حادة في المزاج (غضب، عصبية، اكتئاب).",
        "النوم لساعات طويلة أو الأرق المستمر.",
        "الخروج في أوقات غير معتادة أو العودة المتأخرة باستمرار.",
        "طلب المال بشكل متكرر دون سبب واضح.",
        "اختفاء أغراض أو أموال من المنزل.",
        "إهمال المسؤوليات اليومية.",
      ],
    },
    {
      heading: "ثانيًا: علامات جسدية",
      signs: [
        "فقدان أو زيادة الوزن بشكل ملحوظ.",
        "شحوب الوجه أو الإرهاق الدائم.",
        "إهمال النظافة الشخصية والمظهر.",
        "رعشة في اليدين أو عدم التوازن.",
        "وجود آثار حقن أو جروح غير مبررة (في بعض أنواع التعاطي).",
        "رائحة غريبة من الفم أو الملابس.",
      ],
    },
    {
      heading: "ثالثًا: تغيرات نفسية",
      signs: [
        "فقدان الحافز والطموح.",
        "القلق أو التوتر دون سبب واضح.",
        "نوبات غضب شديدة.",
        "الشك الزائد أو التصرف بعدوانية.",
        "صعوبة في التركيز.",
      ],
    },
    {
      heading: "رابعًا: تغيرات اجتماعية",
      signs: [
        "تغيير مفاجئ في دائرة الأصدقاء.",
        "الابتعاد عن الأنشطة العائلية.",
        "كثرة المشاكل مع المدرسة أو العمل.",
        "سلوكيات خطرة.",
      ],
    },
  ],
  count: "المؤشرات التي لاحظتها:",
  threshold: 7,
  whenTitle: "متى يجب طلب المساعدة؟",
  whenBody:
    "إذا لاحظت 7 مؤشرات أو أكثر من هذه العلامات بشكل مستمر خلال عدة أسابيع، فمن الأفضل التواصل مع مركز متخصص لإجراء تقييم مهني.",
  belowBody:
    "حتى لو كانت المؤشرات قليلة، إن كان لديك قلق فلا تتردد في التواصل معنا. الاستشارة مجانية وسرية.",
  important:
    "مهم: بعض هذه الأعراض قد تكون ناتجة عن ضغوط نفسية أو أمراض أخرى، لذلك يبقى التقييم من قبل مختص هو الطريقة الصحيحة لتحديد السبب ووضع خطة للمساعدة.",
  call: "اتصل بخط المساعدة",
  whatsapp: "راسلنا على واتساب",
  reset: "مسح الإجابات",
};

const EN: Checklist = {
  title: "Are you noticing worrying changes in a family member?",
  lead: "This checklist helps you spot the signs early.",
  disclaimer:
    "Addiction cannot be diagnosed from this list alone, but it helps you notice a problem early.",
  groups: [
    {
      heading: "1. Changes in behaviour",
      signs: [
        "Shutting themselves in their room for hours.",
        "Lying often, or hiding where they have been.",
        "Losing interest in school, work or hobbies.",
        "Sharp mood swings (anger, irritability, depression).",
        "Sleeping for very long hours, or constant insomnia.",
        "Going out at unusual times, or regularly coming home late.",
        "Asking for money often, with no clear reason.",
        "Things or money going missing at home.",
        "Neglecting daily responsibilities.",
      ],
    },
    {
      heading: "2. Physical signs",
      signs: [
        "Noticeable weight loss or gain.",
        "A pale face, or constant tiredness.",
        "Neglecting personal hygiene and appearance.",
        "Trembling hands, or loss of balance.",
        "Injection marks or unexplained wounds (with some kinds of use).",
        "A strange smell on the breath or clothes.",
      ],
    },
    {
      heading: "3. Psychological changes",
      signs: [
        "Losing motivation and ambition.",
        "Anxiety or tension with no clear cause.",
        "Fits of intense anger.",
        "Excessive suspicion, or aggressive behaviour.",
        "Difficulty concentrating.",
      ],
    },
    {
      heading: "4. Social changes",
      signs: [
        "A sudden change of friends.",
        "Pulling away from family activities.",
        "Frequent trouble at school or work.",
        "Risky behaviour.",
      ],
    },
  ],
  count: "Signs you have noticed:",
  threshold: 7,
  whenTitle: "When should you ask for help?",
  whenBody:
    "If you notice 7 or more of these signs persistently over several weeks, it is best to contact a specialist centre for a professional assessment.",
  belowBody:
    "Even with only a few signs, if you are worried do not hesitate to contact us. Consultations are free and confidential.",
  important:
    "Important: some of these signs can come from stress or other illnesses, so an assessment by a specialist remains the right way to find the cause and plan help.",
  call: "Call the helpline",
  whatsapp: "Message us on WhatsApp",
  reset: "Clear my answers",
};

export function checklist(locale: Locale) {
  return locale === "en" ? EN : AR;
}
