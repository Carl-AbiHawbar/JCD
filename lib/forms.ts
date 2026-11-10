import type { Locale } from "./i18n";

/**
 * The two volunteer forms from JCD's brief: استمارة جهوزية التطوع (JCD Club)
 * and استمارة التطوّع – أمهات ضدّ المخدرات (MCD).
 *
 * Both are applications rather than scored quizzes, so a submission is stored
 * as given: `fullName` and `phone` at the top of the document, everything else
 * under `answers`, keyed by the field ids below. Option values are stable ids
 * and never change with the language, so the dashboard can label any
 * submission whichever language it was filled in. An option with `specify`
 * asks for a few words when chosen; they are stored under `<field>Detail`.
 */

export type FormId = "jcd" | "mcd";

export type Choice = { value: string; label: string; specify?: string };

export type Field =
  | {
      kind: "text";
      id: string;
      label: string;
      required?: boolean;
      input?: "text" | "tel" | "date";
      autoComplete?: string;
      /** Sits beside the next half-width field on wide screens. */
      half?: boolean;
    }
  | { kind: "single"; id: string; label: string; options: Choice[]; required?: boolean }
  | { kind: "multi"; id: string; label: string; options: Choice[]; note?: string };

export type FormSchema = {
  id: FormId;
  eyebrow: string;
  title: string;
  intro: string;
  sections: { heading: string; fields: Field[] }[];
  consent: string;
  submit: string;
  sending: string;
  sentTitle: string;
  sentBody: string;
  failed: string;
  missing: string;
};

export type Answers = Record<string, string | string[]>;

/** Fields stored at the top of the document rather than under `answers`. */
export const TOP_LEVEL = ["fullName", "phone"] as const;

/* --------------------------------------------------------------- shared */

const yesNo = {
  ar: [
    { value: "yes", label: "نعم" },
    { value: "no", label: "كلا" },
  ],
  en: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ],
};

const ui = {
  ar: {
    personal: "معلومات شخصية",
    questions: "أسئلة الاستمارة",
    birthDate: "تاريخ الولادة",
    phone: "رقم الخليوي",
    district: "عنوان السكن: القضاء",
    area: "المنطقة",
    consent:
      "أوافق على أن تحتفظ الجمعية بهذه المعلومات وتستخدمها لدراسة طلب التطوع والتواصل معي فقط. تبقى المعلومات سرية.",
    submit: "إرسال الاستمارة",
    sending: "جارٍ الإرسال...",
    sentTitle: "شكرًا لك!",
    failed: "تعذّر إرسال الاستمارة. يرجى المحاولة لاحقًا.",
    missing: "يرجى تعبئة الحقول المطلوبة.",
  },
  en: {
    personal: "Personal information",
    questions: "Questions",
    birthDate: "Date of birth",
    phone: "Mobile number",
    district: "Address: district",
    area: "Area",
    consent:
      "I agree that JCD may keep this information and use it only to review my application and contact me. It stays confidential.",
    submit: "Send the form",
    sending: "Sending...",
    sentTitle: "Thank you!",
    failed: "We could not send the form. Please try again later.",
    missing: "Please fill in the required fields.",
  },
};

/* ------------------------------------------------- JCD volunteer readiness */

const JCD: Record<Locale, FormSchema> = {
  ar: {
    id: "jcd",
    eyebrow: "استمارة جهوزية التطوع",
    title: "طاقتك بتعمل فرق، وتطوّعك بيصنع التغيير!",
    intro: "اتطوع معنا وكون جزء من الحلّ.",
    sections: [
      {
        heading: ui.ar.personal,
        fields: [
          { kind: "text", id: "fullName", label: "الاسم", required: true, autoComplete: "name" },
          { kind: "text", id: "birthDate", label: ui.ar.birthDate, input: "date", half: true },
          { kind: "text", id: "phone", label: ui.ar.phone, required: true, input: "tel", autoComplete: "tel", half: true },
          { kind: "text", id: "district", label: ui.ar.district, half: true },
          { kind: "text", id: "area", label: ui.ar.area, half: true },
          { kind: "single", id: "transport", label: "لدي وسيلة نقل", options: yesNo.ar },
        ],
      },
      {
        heading: ui.ar.questions,
        fields: [
          {
            kind: "single", id: "motivation", required: true,
            label: "ما هو الدافع الرئيسي الذي يجعلك ترغب في التطوع معنا؟",
            options: [
              { value: "mission", label: "أؤمن برسالة الجمعية." },
              { value: "experience", label: "أرغب في اكتساب خبرة." },
              { value: "freeTime", label: "أرغب في الاستفادة من أوقات فراغي." },
            ],
          },
          {
            kind: "single", id: "commitment", required: true,
            label: "ما مدى قدرتك على الالتزام بالتطوع؟",
            options: [
              { value: "fixed", label: "أستطيع التطوع بجدول ثابت أسبوعيًا أو شهريًا." },
              { value: "asNeeded", label: "أستطيع التطوع عند الحاجة فقط." },
              { value: "holidays", label: "أستطيع التطوع في الصيف والفرص." },
            ],
          },
          {
            kind: "single", id: "experience", required: true,
            label: "ما هي خبرتك السابقة في العمل التطوعي؟",
            options: [
              { value: "extensive", label: "لدي خبرة واسعة في التطوع." },
              { value: "limited", label: "لدي خبرة محدودة." },
              { value: "none", label: "لا أملك أي خبرة." },
            ],
          },
          {
            kind: "single", id: "preferredType", required: true,
            label: "أي نوع من التطوع تفضّل؟",
            options: [
              { value: "awareness", label: "الأنشطة التوعوية." },
              { value: "logistics", label: "اللوجستيات وجمع التبرعات." },
              { value: "admin", label: "الأمور الإدارية." },
            ],
          },
          {
            kind: "single", id: "knowledge", required: true,
            label: "ما مدى معرفتك بمشكلة الإدمان؟",
            options: [
              { value: "good", label: "لدي معرفة جيدة بطبيعة الإدمان والتعافي." },
              { value: "limited", label: "معلوماتي محدودة." },
              { value: "none", label: "لا أملك أي معرفة." },
            ],
          },
          {
            kind: "single", id: "communication", required: true,
            label: "كيف تقيّم مهاراتك في التواصل؟",
            options: [
              { value: "excellent", label: "ممتازة، حيث أستطيع التواصل بسهولة مع الآخرين." },
              { value: "good", label: "جيدة." },
              { value: "develop", label: "أحتاج إلى تطويرها." },
            ],
          },
          {
            kind: "single", id: "background", required: true,
            label: "هل لديك خلفية في أحد المجالات التالية؟",
            options: [
              { value: "psychology", label: "علم النفس أو المساعدة الاجتماعية." },
              { value: "other", label: "مجال آخر.", specify: "حدّد المجال" },
              { value: "student", label: "لا أزال طالبًا." },
            ],
          },
          {
            kind: "single", id: "otherAssociation", required: true,
            label: "هل أنت منتسب إلى جمعية أخرى؟",
            options: [
              { value: "no", label: "كلا" },
              { value: "yes", label: "نعم", specify: "اذكر اسم الجمعية" },
            ],
          },
          {
            kind: "multi", id: "participated",
            label: "هل سبق وشاركت؟",
            note: "اختر كل ما ينطبق.",
            options: [
              { value: "campaigns", label: "بحملات توعية" },
              { value: "camps", label: "بمخيمات توعوية" },
              { value: "fundraising", label: "بحملات تبرّع" },
            ],
          },
          {
            kind: "multi", id: "private",
            label: "معلومات خاصة",
            note: "اختياري. تبقى هذه المعلومات سرية ولا يطّلع عليها إلا فريق الجمعية.",
            options: [
              { value: "smoker", label: "أنا مدخّن" },
              { value: "recovering", label: "أنا مدمن متعافٍ" },
              { value: "alcohol", label: "أتناول الكحول" },
            ],
          },
        ],
      },
    ],
    consent: ui.ar.consent,
    submit: ui.ar.submit,
    sending: ui.ar.sending,
    sentTitle: ui.ar.sentTitle,
    sentBody: "وصلتنا استمارتك. سيتواصل معك فريق الجمعية قريبًا.",
    failed: ui.ar.failed,
    missing: ui.ar.missing,
  },
  en: {
    id: "jcd",
    eyebrow: "Volunteer readiness form",
    title: "Your energy makes a difference, and your volunteering makes change!",
    intro: "Volunteer with us and be part of the solution.",
    sections: [
      {
        heading: ui.en.personal,
        fields: [
          { kind: "text", id: "fullName", label: "Name", required: true, autoComplete: "name" },
          { kind: "text", id: "birthDate", label: ui.en.birthDate, input: "date", half: true },
          { kind: "text", id: "phone", label: ui.en.phone, required: true, input: "tel", autoComplete: "tel", half: true },
          { kind: "text", id: "district", label: ui.en.district, half: true },
          { kind: "text", id: "area", label: ui.en.area, half: true },
          { kind: "single", id: "transport", label: "I have my own transport", options: yesNo.en },
        ],
      },
      {
        heading: ui.en.questions,
        fields: [
          {
            kind: "single", id: "motivation", required: true,
            label: "What is the main reason you want to volunteer with us?",
            options: [
              { value: "mission", label: "I believe in JCD's mission." },
              { value: "experience", label: "I want to gain experience." },
              { value: "freeTime", label: "I want to make good use of my free time." },
            ],
          },
          {
            kind: "single", id: "commitment", required: true,
            label: "How much can you commit to volunteering?",
            options: [
              { value: "fixed", label: "I can volunteer on a fixed weekly or monthly schedule." },
              { value: "asNeeded", label: "I can volunteer only when needed." },
              { value: "holidays", label: "I can volunteer in the summer and the holidays." },
            ],
          },
          {
            kind: "single", id: "experience", required: true,
            label: "What volunteering experience do you have?",
            options: [
              { value: "extensive", label: "I have a lot of volunteering experience." },
              { value: "limited", label: "I have some experience." },
              { value: "none", label: "I have no experience." },
            ],
          },
          {
            kind: "single", id: "preferredType", required: true,
            label: "What kind of volunteering do you prefer?",
            options: [
              { value: "awareness", label: "Awareness activities." },
              { value: "logistics", label: "Logistics and fundraising." },
              { value: "admin", label: "Administration." },
            ],
          },
          {
            kind: "single", id: "knowledge", required: true,
            label: "How much do you know about addiction?",
            options: [
              { value: "good", label: "I know addiction and recovery well." },
              { value: "limited", label: "I know a little." },
              { value: "none", label: "I know nothing about it." },
            ],
          },
          {
            kind: "single", id: "communication", required: true,
            label: "How would you rate your communication skills?",
            options: [
              { value: "excellent", label: "Excellent — I communicate easily with others." },
              { value: "good", label: "Good." },
              { value: "develop", label: "I need to develop them." },
            ],
          },
          {
            kind: "single", id: "background", required: true,
            label: "Do you have a background in any of these fields?",
            options: [
              { value: "psychology", label: "Psychology or social work." },
              { value: "other", label: "Another field.", specify: "Which field?" },
              { value: "student", label: "I am still a student." },
            ],
          },
          {
            kind: "single", id: "otherAssociation", required: true,
            label: "Are you a member of another association?",
            options: [
              { value: "no", label: "No" },
              { value: "yes", label: "Yes", specify: "Name of the association" },
            ],
          },
          {
            kind: "multi", id: "participated",
            label: "Have you ever taken part in…",
            note: "Choose all that apply.",
            options: [
              { value: "campaigns", label: "Awareness campaigns" },
              { value: "camps", label: "Awareness camps" },
              { value: "fundraising", label: "Fundraising campaigns" },
            ],
          },
          {
            kind: "multi", id: "private",
            label: "Private information",
            note: "Optional. This stays confidential and is seen only by JCD's team.",
            options: [
              { value: "smoker", label: "I smoke" },
              { value: "recovering", label: "I am in recovery from addiction" },
              { value: "alcohol", label: "I drink alcohol" },
            ],
          },
        ],
      },
    ],
    consent: ui.en.consent,
    submit: ui.en.submit,
    sending: ui.en.sending,
    sentTitle: ui.en.sentTitle,
    sentBody: "We have received your form. JCD's team will be in touch soon.",
    failed: ui.en.failed,
    missing: ui.en.missing,
  },
};

/* ---------------------------------------------------- MCD volunteer form */

const MCD: Record<Locale, FormSchema> = {
  ar: {
    id: "mcd",
    eyebrow: "استمارة التطوّع – أمهات ضدّ المخدرات",
    title: "وعي الأم قوّة، كوني جزء من الحلّ.",
    intro: "انضمّي إلى لجنة أمّهات ضدّ المخدّرات وساهمي في نشر الوعي داخل الأسرة والمجتمع.",
    sections: [
      {
        heading: ui.ar.personal,
        fields: [
          { kind: "text", id: "fullName", label: "الاسم الثلاثي", required: true, autoComplete: "name" },
          { kind: "text", id: "birthDate", label: ui.ar.birthDate, input: "date", half: true },
          { kind: "text", id: "phone", label: ui.ar.phone, required: true, input: "tel", autoComplete: "tel", half: true },
          { kind: "text", id: "district", label: ui.ar.district, half: true },
          { kind: "text", id: "area", label: ui.ar.area, half: true },
          { kind: "text", id: "specialty", label: "الاختصاص", half: true },
          { kind: "text", id: "job", label: "الوظيفة", half: true },
          { kind: "single", id: "transport", label: "هل لديكِ وسيلة نقل؟", options: yesNo.ar },
        ],
      },
      {
        heading: ui.ar.questions,
        fields: [
          {
            kind: "single", id: "motivation", required: true,
            label: "ما هو الدافع الرئيسي الذي يجعلكِ ترغبين في التطوّع معنا؟",
            options: [
              { value: "experience", label: "أرغب في اكتساب خبرة والمشاركة في العمل التطوّعي." },
              { value: "supportMothers", label: "أرغب في مساندة الأمهات اللواتي يواجهن مشكلة الإدمان في أسرهن." },
              { value: "other", label: "سبب آخر.", specify: "ما هو السبب؟" },
            ],
          },
          {
            kind: "single", id: "commitment", required: true,
            label: "ما مدى قدرتكِ على الالتزام بالتطوّع؟",
            options: [
              { value: "fixed", label: "أستطيع الالتزام بجدول ثابت أسبوعيًا أو شهريًا." },
              { value: "asNeeded", label: "أستطيع التطوّع عند الحاجة فقط." },
              { value: "campaigns", label: "أستطيع المشاركة في حملات وأنشطة محدّدة." },
            ],
          },
          {
            kind: "single", id: "experience", required: true,
            label: "هل لديكِ خبرة سابقة في العمل التطوّعي؟",
            options: [
              { value: "extensive", label: "لديّ خبرة واسعة." },
              { value: "limited", label: "لديّ خبرة محدودة." },
              { value: "none", label: "لا أملك خبرة سابقة." },
            ],
          },
          {
            kind: "single", id: "knowledge", required: true,
            label: "ما مدى معرفتكِ بمشكلة الإدمان؟",
            options: [
              { value: "good", label: "لديّ معرفة جيدة بمخاطر المخدرات والإدمان وطرق التعافي." },
              { value: "limited", label: "لديّ معلومات محدودة." },
              { value: "none", label: "لا أملك معرفة كافية." },
            ],
          },
          {
            kind: "single", id: "addictionBackground", required: true,
            label: "هل لديكِ خلفية أو خبرة في مجال الإدمان؟",
            options: [
              { value: "no", label: "كلا" },
              { value: "yes", label: "نعم", specify: "حدّدي" },
            ],
          },
          {
            kind: "single", id: "otherAssociation", required: true,
            label: "هل أنتِ منتسبة إلى جمعية أخرى؟",
            options: [
              { value: "yes", label: "نعم", specify: "اسم الجمعية" },
              { value: "no", label: "كلا" },
            ],
          },
          {
            kind: "multi", id: "roles",
            label: "ما هي المهام التي تقترحين استلامها في لجنة أمهات ضدّ المخدرات؟",
            note: "اختاري كل ما ينطبق.",
            options: [
              { value: "member", label: "عضو منتسب" },
              { value: "media", label: "الإعلام" },
              { value: "social", label: "التواصل الاجتماعي" },
              { value: "projects", label: "أنشطة ومشاريع" },
              { value: "pr", label: "العلاقات العامة" },
              { value: "awareness", label: "التوعية" },
              { value: "other", label: "اقتراح آخر", specify: "ما هو اقتراحكِ؟" },
            ],
          },
        ],
      },
    ],
    consent: ui.ar.consent,
    submit: ui.ar.submit,
    sending: ui.ar.sending,
    sentTitle: "شكرًا لكِ!",
    sentBody: "وصلتنا استمارتكِ. ستتواصل معكِ لجنة أمّهات ضدّ المخدّرات قريبًا.",
    failed: ui.ar.failed,
    missing: ui.ar.missing,
  },
  en: {
    id: "mcd",
    eyebrow: "Volunteer form – Mothers Against Drugs",
    title: "A mother's awareness is strength — be part of the solution.",
    intro: "Join the Mothers Against Drugs committee and help raise awareness in families and in society.",
    sections: [
      {
        heading: ui.en.personal,
        fields: [
          { kind: "text", id: "fullName", label: "Full name", required: true, autoComplete: "name" },
          { kind: "text", id: "birthDate", label: ui.en.birthDate, input: "date", half: true },
          { kind: "text", id: "phone", label: ui.en.phone, required: true, input: "tel", autoComplete: "tel", half: true },
          { kind: "text", id: "district", label: ui.en.district, half: true },
          { kind: "text", id: "area", label: ui.en.area, half: true },
          { kind: "text", id: "specialty", label: "Field of study", half: true },
          { kind: "text", id: "job", label: "Occupation", half: true },
          { kind: "single", id: "transport", label: "Do you have your own transport?", options: yesNo.en },
        ],
      },
      {
        heading: ui.en.questions,
        fields: [
          {
            kind: "single", id: "motivation", required: true,
            label: "What is the main reason you want to volunteer with us?",
            options: [
              { value: "experience", label: "I want to gain experience and take part in volunteer work." },
              { value: "supportMothers", label: "I want to support mothers facing addiction in their families." },
              { value: "other", label: "Another reason.", specify: "What is it?" },
            ],
          },
          {
            kind: "single", id: "commitment", required: true,
            label: "How much can you commit to volunteering?",
            options: [
              { value: "fixed", label: "I can keep a fixed weekly or monthly schedule." },
              { value: "asNeeded", label: "I can volunteer only when needed." },
              { value: "campaigns", label: "I can take part in specific campaigns and activities." },
            ],
          },
          {
            kind: "single", id: "experience", required: true,
            label: "Do you have any volunteering experience?",
            options: [
              { value: "extensive", label: "A lot of experience." },
              { value: "limited", label: "Some experience." },
              { value: "none", label: "No previous experience." },
            ],
          },
          {
            kind: "single", id: "knowledge", required: true,
            label: "How much do you know about addiction?",
            options: [
              { value: "good", label: "I know the dangers of drugs and addiction, and how recovery works, well." },
              { value: "limited", label: "I know a little." },
              { value: "none", label: "I do not know enough." },
            ],
          },
          {
            kind: "single", id: "addictionBackground", required: true,
            label: "Do you have a background or experience in addiction?",
            options: [
              { value: "no", label: "No" },
              { value: "yes", label: "Yes", specify: "Please describe" },
            ],
          },
          {
            kind: "single", id: "otherAssociation", required: true,
            label: "Are you a member of another association?",
            options: [
              { value: "yes", label: "Yes", specify: "Name of the association" },
              { value: "no", label: "No" },
            ],
          },
          {
            kind: "multi", id: "roles",
            label: "Which roles would you like to take on in the committee?",
            note: "Choose all that apply.",
            options: [
              { value: "member", label: "Member" },
              { value: "media", label: "Media" },
              { value: "social", label: "Social media" },
              { value: "projects", label: "Activities and projects" },
              { value: "pr", label: "Public relations" },
              { value: "awareness", label: "Awareness" },
              { value: "other", label: "Something else", specify: "What do you suggest?" },
            ],
          },
        ],
      },
    ],
    consent: ui.en.consent,
    submit: ui.en.submit,
    sending: ui.en.sending,
    sentTitle: ui.en.sentTitle,
    sentBody: "We have received your form. The Mothers Against Drugs committee will be in touch soon.",
    failed: ui.en.failed,
    missing: ui.en.missing,
  },
};

export function formSchema(id: FormId, locale: Locale) {
  return (id === "mcd" ? MCD : JCD)[locale];
}

/** Every field of a form, flattened, for labelling a stored submission. */
export function formFields(id: FormId, locale: Locale = "ar") {
  return formSchema(id, locale).sections.flatMap((s) => s.fields);
}
