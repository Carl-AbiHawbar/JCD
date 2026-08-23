import type { Locale } from "./i18n";

/**
 * Home page composition below the help bar.
 *
 * Arabic is transcribed from the mockup screenshots; English is a translation
 * of that same copy. Layout, ordering, band colours and imagery are shared —
 * only the words differ between locales, which is why the two lists are built
 * from one shape below.
 */

export type Band = "cream" | "sand" | "mint" | "dark" | "teal";

export type Img = { src: string; alt: string } | null;

export type SplitSection = {
  kind: "split";
  id: string;
  band: Band;
  imageSide: "left" | "right";
  image: Img;
  blocks: { heading: string; body: string[] }[];
};

export type FeatureSection = {
  kind: "feature";
  id: string;
  band: Band;
  heading: string;
  subheading?: string;
  image: Img;
};

export type CardGridSection = {
  kind: "cardGrid";
  id: string;
  band: Band;
  variant: "stacked" | "overlay";
  align: "start" | "center";
  titleTone: "teal" | "dark";
  metaStyle?: "badge";
  heading: string;
  subheading?: string;
  cards: { title: string; body?: string; meta?: string; image: Img }[];
};

export type StepsSection = {
  kind: "steps";
  id: string;
  band: Band;
  heading: string;
  subheading?: string;
  steps: { title: string; body: string }[];
};

export type DonateSection = {
  kind: "donate";
  id: string;
  band: Band;
  heading: string;
  subheading: string;
  amounts: string[];
  cta: { label: string; href: string };
  image: Img;
};

export type ProductsSection = {
  kind: "products";
  id: string;
  band: Band;
  heading: string;
  subheading?: string;
  addToCart: string;
  products: { title: string; price: string; image: Img }[];
};

export type NewsletterSection = {
  kind: "newsletter";
  id: string;
  band: Band;
  heading: string;
  subheading: string;
  placeholder: string;
  cta: string;
};

export type StatsSection = {
  kind: "stats";
  id: string;
  band: Band;
  stats: { value: string; label: string }[];
};

export type IconName = "personCheck" | "search";

export type IconCardsSection = {
  kind: "iconCards";
  id: string;
  band: Band;
  heading: string;
  subheading?: string;
  cards: { icon: IconName; title: string; body: string; href: string }[];
};

export type AccordionSection = {
  kind: "accordion";
  id: string;
  band: Band;
  heading: string;
  items: { question: string; answer: string }[];
};

export type Section =
  | SplitSection
  | FeatureSection
  | CardGridSection
  | StepsSection
  | DonateSection
  | ProductsSection
  | NewsletterSection
  | StatsSection
  | IconCardsSection
  | AccordionSection;

/**
 * Section imagery, in public/sections.
 *
 * Most slots are photographs sourced under licences that permit reuse; see
 * public/sections/ATTRIBUTION.md. Every one was reviewed before inclusion.
 *
 * The slots listed below `PHOTOS` deliberately keep an illustrated panel
 * instead: no suitable photograph was found, and for the care sections a
 * photograph of an identifiable person would imply that person is a patient —
 * something an open licence does not grant permission for. Add a file named
 * `<slot>.jpg` and list the slot here to switch it to a photograph.
 */
const PHOTOS = new Set([
  "about", "history", "mission", "partnerships", "team", "achievements",
  "mcd", "service-1", "service-2",
  "programme-1", "programme-2", "programme-3", "programme-4", "programme-5",
  "training-1", "training-2", "training-3",
  "event-1", "event-2", "event-3", "event-4", "event-5", "event-6",
  "news-1", "news-2", "news-3",
  "product-1", "product-2", "product-3", "product-4",
  "product-6", "product-7", "product-8", "product-9",
]);

const img = (name: string, alt: string): Img => ({
  src: `/sections/${name}.${PHOTOS.has(name) ? "jpg" : "svg"}`,
  alt,
});

/* ------------------------------------------------------------------ arabic */

const AR: Section[] = [
  {
    kind: "split", id: "about", band: "cream", imageSide: "left",
    image: img("about", "فريق الجمعية"),
    blocks: [{
      heading: "من نحن",
      body: ["جمعية JCD هي منظمة لبنانية غير ربحية متخصصة في مكافحة الإدمان وتقديم خدمات إعادة التأهيل والإرشاد النفسي والاجتماعي. نعمل منذ سنوات على دعم الأفراد والعائلات المتضررة من آفة المخدرات."],
    }],
  },
  {
    kind: "split", id: "history", band: "mint", imageSide: "right",
    image: img("history", "مقر الجمعية"),
    blocks: [{
      heading: "تاريخنا",
      body: ["تأسست جمعية JCD في لبنان بهدف مكافحة آفة الإدمان ودعم المتضررين. على مدار السنوات، نمت الجمعية لتصبح مرجعًا وطنيًا في مجال الوقاية والعلاج وإعادة التأهيل."],
    }],
  },
  {
    kind: "split", id: "mission", band: "cream", imageSide: "left",
    image: img("mission", "رسالتنا ورؤيتنا"),
    blocks: [
      { heading: "رسالتنا", body: ["نسعى إلى تقديم خدمات علاجية وتأهيلية شاملة لمكافحة الإدمان، ودعم الأفراد والعائلات في رحلة التعافي، وبناء مجتمع واعٍ وصحي."] },
      { heading: "رؤيتنا", body: ["مجتمع لبناني خالٍ من الإدمان، يتمتع فيه كل فرد بحياة كريمة ومستقبل مشرق."] },
    ],
  },
  {
    kind: "split", id: "partnerships", band: "mint", imageSide: "right",
    image: img("partnerships", "شراكاتنا"),
    blocks: [{
      heading: "شراكاتنا",
      body: ["نتعاون مع مؤسسات محلية ودولية لتعزيز خدماتنا وتوسيع نطاق عملنا. شراكاتنا تشمل جهات حكومية ومنظمات غير حكومية ومؤسسات أكاديمية."],
    }],
  },
  {
    kind: "feature", id: "team", band: "cream",
    heading: "فريقنا",
    subheading: "فريق متعدد التخصصات من الأطباء والمعالجين النفسيين والأخصائيين الاجتماعيين.",
    image: img("team", "فريقنا متعدد التخصصات"),
  },
  {
    kind: "split", id: "achievements", band: "sand", imageSide: "left",
    image: img("achievements", "إنجازاتنا"),
    blocks: [{
      heading: "إنجازاتنا",
      body: ["حققنا إنجازات عديدة في مجال مكافحة الإدمان، من تخريج آلاف المتعافين إلى الحصول على اعتمادات دولية وتوسيع خدماتنا في مختلف المناطق اللبنانية."],
    }],
  },
  {
    kind: "split", id: "mcd", band: "cream", imageSide: "right",
    image: img("mcd", "مركز MCD للخدمات المجتمعية"),
    blocks: [{
      heading: "MCD",
      body: ["مركز MCD للخدمات المجتمعية والدعم الميداني — يقدم خدمات التوعية والإرشاد في المجتمعات المحلية ويعمل على تعزيز الوقاية من الإدمان."],
    }],
  },
  {
    kind: "cardGrid", id: "services", band: "mint", variant: "stacked",
    align: "start", titleTone: "teal", heading: "خدماتنا",
    cards: [
      { title: "إعادة التأهيل", body: "برامج متكاملة لإعادة التأهيل الجسدي والنفسي في بيئة آمنة وداعمة.", image: img("service-1", "إعادة التأهيل") },
      { title: "الإرشاد النفسي", body: "جلسات فردية وجماعية مع مختصين لدعم التعافي والصحة النفسية.", image: img("service-2", "الإرشاد النفسي") },
      { title: "دعم الأسرة", body: "مساعدة العائلات على فهم الإدمان والتعامل معه بطرق صحية وفعالة.", image: img("service-3", "دعم الأسرة") },
    ],
  },
  {
    kind: "cardGrid", id: "programmes", band: "dark", variant: "overlay",
    align: "center", titleTone: "dark", heading: "برامجنا",
    subheading: "برامج متنوعة تلبي مختلف الاحتياجات في مسيرة التعافي",
    cards: [
      { title: "العلاج الداخلي", body: "برنامج إقامة كاملة يشمل مراحل إزالة السموم والعلاج النفسي والتأهيل.", image: img("programme-1", "العلاج الداخلي") },
      { title: "العلاج الخارجي – السلوكي", body: "جلسات علاجية في مركز السلوكي دون الحاجة للإقامة.", image: img("programme-2", "العلاج الخارجي") },
      { title: "القبول", body: "إجراءات القبول والتقييم الأولي للانضمام لبرامجنا.", image: img("programme-3", "القبول") },
      { title: "العلاج الخارجي – المتابعة", body: "جلسات متابعة وعلاج خارجي متقدمة لدعم التعافي المستمر.", image: img("programme-4", "المتابعة") },
      { title: "التوعية والتدريب", body: "ورش عمل ومحاضرات في المدارس والجامعات لنشر الوعي.", image: img("programme-5", "التوعية والتدريب") },
    ],
  },
  {
    kind: "steps", id: "treatment-stages", band: "cream",
    heading: "مراحل العلاج الداخلي",
    subheading: "رحلة التعافي خطوة بخطوة مع فريقنا المتخصص",
    steps: [
      { title: "التقييم الأولي", body: "لقاء مع فريق متخصص لفهم حالتك ووضع خطة علاج مخصصة." },
      { title: "إزالة السموم", body: "مرحلة طبية مراقبة لتخليص الجسم من المواد بأمان." },
      { title: "العلاج والتأهيل", body: "جلسات علاج نفسي وسلوكي فردية وجماعية لبناء مهارات التعافي." },
      { title: "المتابعة والدعم", body: "برنامج متابعة مستمر لمنع الانتكاس وضمان استقرار التعافي." },
    ],
  },
  {
    kind: "cardGrid", id: "training", band: "mint", variant: "stacked",
    align: "center", titleTone: "dark", heading: "التدريب والتطوع",
    subheading: "فرص تدريب وتطوع لطلاب علم النفس والمتطوعين",
    cards: [
      { title: "تدريب طلاب علم النفس", body: "برنامج تدريب عملي لطلاب علم النفس تحت إشراف مختصين.", image: img("training-1", "تدريب طلاب علم النفس") },
      { title: "JCD", body: "انضم كمتطوع في JCD وساهم في أنشطة التوعية والدعم المجتمعي.", image: img("training-2", "التطوع في JCD") },
      { title: "MCD", body: "تطوع مع MCD في المشاريع الميدانية والخدمات المجتمعية.", image: img("training-3", "التطوع في MCD") },
    ],
  },
  {
    kind: "cardGrid", id: "events", band: "cream", variant: "stacked",
    align: "start", titleTone: "dark", heading: "فعالياتنا القادمة",
    subheading: "انضم إلينا في أنشطتنا المجتمعية والتوعوية",
    cards: [
      { meta: "تموز", title: "حفل العشاء الخيري", image: img("event-1", "حفل العشاء الخيري") },
      { meta: "آب", title: "ماراثون الأمل", image: img("event-2", "ماراثون الأمل") },
      { meta: "أيلول", title: "ورشة توعية للشباب", image: img("event-3", "ورشة توعية للشباب") },
      { meta: "تشرين أول", title: "معرض فن التعافي", image: img("event-4", "معرض فن التعافي") },
      { meta: "تشرين ثاني", title: "يوم اليوغا والتأمل", image: img("event-5", "يوم اليوغا والتأمل") },
      { meta: "كانون أول", title: "مهرجان الطعام", image: img("event-6", "مهرجان الطعام") },
    ],
  },
  {
    kind: "donate", id: "donate", band: "dark",
    heading: "ساهم في إنقاذ حياة",
    subheading: "تبرعك يساعدنا في تقديم العلاج المجاني لمن لا يستطيع تحمّل تكاليفه.",
    amounts: ["$50", "$100", "$150", "$200", "$500"],
    cta: { label: "تبرَّع الآن", href: "#donate" },
    image: img("donate", "ساهم في إنقاذ حياة"),
  },
  {
    kind: "products", id: "shop", band: "mint",
    heading: "متجرنا",
    subheading: "منتجات يدوية من صنع المتعافين — كل عملية شراء تدعم رحلة التعافي.",
    addToCart: "أضف إلى السلة",
    products: [],
  },
  {
    kind: "cardGrid", id: "news", band: "cream", variant: "stacked",
    align: "start", titleTone: "dark", metaStyle: "badge",
    heading: "ابقَ على اطلاع",
    cards: [
      { meta: "دراسة", title: "دراسة جديدة حول الإدمان الرقمي", body: "نتائج بحثية حديثة تسلط الضوء على تأثير الشاشات على الصحة النفسية للشباب.", image: img("news-1", "دراسة") },
      { meta: "أخبار", title: "افتتاح مركز جديد في الشمال", body: "توسيع خدماتنا لتشمل المناطق الشمالية بالتعاون مع البلديات المحلية.", image: img("news-2", "أخبار") },
      { meta: "تحديث", title: "تحديث بروتوكولات العلاج 2026", body: "اعتماد أحدث المعايير العالمية في بروتوكولات العلاج والتأهيل.", image: img("news-3", "تحديث") },
    ],
  },
  {
    kind: "newsletter", id: "newsletter", band: "cream",
    heading: "اشترك في النشرة الإخبارية",
    subheading: "ابقَ على اطلاع بآخر أخبارنا وفعالياتنا",
    placeholder: "البريد الإلكتروني",
    cta: "اشتراك",
  },
  {
    kind: "stats", id: "impact", band: "teal",
    stats: [
      { value: "24/7", label: "خط مساعدة مفتوح" },
      { value: "85%", label: "نسبة نجاح العلاج" },
      { value: "+15", label: "سنة من الخبرة" },
      { value: "2000+", label: "مستفيد من خدماتنا" },
    ],
  },
  {
    kind: "iconCards", id: "assessments", band: "sand",
    heading: "التقييمات",
    subheading: "أدوات تقييم سرية لمساعدتك على اتخاذ الخطوة الأولى",
    cards: [
      { icon: "search", title: "تقييم القلق من الاستخدام", body: "هل تشك أن شخصاً قريباً يستخدم المخدرات؟", href: "#contact" },
      { icon: "personCheck", title: "فحص جاهزية التطوع", body: "اكتشف إذا كنت مستعداً للانضمام لفريقنا", href: "/volunteer-readiness" },
    ],
  },
  {
    kind: "accordion", id: "faq", band: "mint",
    heading: "أسئلة شائعة",
    items: [
      { question: "هل العلاج سري بالكامل؟", answer: "نعم، جميع المعلومات والاستشارات سرية بالكامل ومحمية بموجب قوانين السرية الطبية." },
      { question: "كم تستغرق مدة العلاج؟", answer: "تختلف المدة حسب الحالة، عادة من 3 إلى 12 شهرًا مع متابعة مستمرة." },
      { question: "هل يمكن لأفراد العائلة المشاركة؟", answer: "بالتأكيد! نقدم برامج خاصة لدعم العائلة وإشراكها في عملية التعافي." },
      { question: "هل الخدمات مجانية؟", answer: "نقدم خدمات مجانية ومدعومة للحالات غير القادرة بفضل تبرعاتكم." },
    ],
  },
];

/* ----------------------------------------------------------------- english */

const EN: Section[] = [
  {
    kind: "split", id: "about", band: "cream", imageSide: "left",
    image: img("about", "The JCD team"),
    blocks: [{
      heading: "About us",
      body: ["JCD is a Lebanese non-profit specialising in fighting addiction and providing rehabilitation, psychological and social counselling services. For years we have supported individuals and families affected by drugs."],
    }],
  },
  {
    kind: "split", id: "history", band: "mint", imageSide: "right",
    image: img("history", "The organisation's premises"),
    blocks: [{
      heading: "Our history",
      body: ["JCD was founded in Lebanon to fight addiction and support those affected by it. Over the years it has grown into a national reference in prevention, treatment and rehabilitation."],
    }],
  },
  {
    kind: "split", id: "mission", band: "cream", imageSide: "left",
    image: img("mission", "Our mission and vision"),
    blocks: [
      { heading: "Our mission", body: ["We provide comprehensive treatment and rehabilitation services, support individuals and families through recovery, and help build an aware and healthy society."] },
      { heading: "Our vision", body: ["A Lebanon free of addiction, where every person enjoys a dignified life and a bright future."] },
    ],
  },
  {
    kind: "split", id: "partnerships", band: "mint", imageSide: "right",
    image: img("partnerships", "Our partnerships"),
    blocks: [{
      heading: "Our partnerships",
      body: ["We work with local and international institutions to strengthen our services and widen our reach. Our partners include government bodies, non-governmental organisations and academic institutions."],
    }],
  },
  {
    kind: "feature", id: "team", band: "cream",
    heading: "Our team",
    subheading: "A multidisciplinary team of doctors, psychotherapists and social workers.",
    image: img("team", "Our multidisciplinary team"),
  },
  {
    kind: "split", id: "achievements", band: "sand", imageSide: "left",
    image: img("achievements", "Our achievements"),
    blocks: [{
      heading: "Our achievements",
      body: ["We have achieved a great deal in the fight against addiction, from thousands of people completing recovery to earning international accreditation and expanding our services across Lebanon."],
    }],
  },
  {
    kind: "split", id: "mcd", band: "cream", imageSide: "right",
    image: img("mcd", "The MCD community services centre"),
    blocks: [{
      heading: "MCD",
      body: ["The MCD centre for community services and field support delivers awareness and counselling within local communities and works to strengthen addiction prevention."],
    }],
  },
  {
    kind: "cardGrid", id: "services", band: "mint", variant: "stacked",
    align: "start", titleTone: "teal", heading: "Our services",
    cards: [
      { title: "Rehabilitation", body: "Integrated physical and psychological rehabilitation in a safe, supportive setting.", image: img("service-1", "Rehabilitation") },
      { title: "Psychological counselling", body: "Individual and group sessions with specialists supporting recovery and mental health.", image: img("service-2", "Psychological counselling") },
      { title: "Family support", body: "Helping families understand addiction and respond to it in healthy, effective ways.", image: img("service-3", "Family support") },
    ],
  },
  {
    kind: "cardGrid", id: "programmes", band: "dark", variant: "overlay",
    align: "center", titleTone: "dark", heading: "Our programmes",
    subheading: "A range of programmes meeting different needs along the road to recovery",
    cards: [
      { title: "Inpatient treatment", body: "A full residential programme covering detox, psychological treatment and rehabilitation.", image: img("programme-1", "Inpatient treatment") },
      { title: "Outpatient – behavioural", body: "Therapy sessions at the behavioural centre without needing to stay.", image: img("programme-2", "Outpatient treatment") },
      { title: "Admission", body: "Admission procedures and the initial assessment for joining our programmes.", image: img("programme-3", "Admission") },
      { title: "Outpatient – follow-up", body: "Advanced follow-up and outpatient sessions supporting continued recovery.", image: img("programme-4", "Follow-up") },
      { title: "Awareness and training", body: "Workshops and lectures in schools and universities to spread awareness.", image: img("programme-5", "Awareness and training") },
    ],
  },
  {
    kind: "steps", id: "treatment-stages", band: "cream",
    heading: "Stages of inpatient treatment",
    subheading: "The road to recovery, step by step, with our specialist team",
    steps: [
      { title: "Initial assessment", body: "A meeting with a specialist team to understand your situation and build a tailored treatment plan." },
      { title: "Detoxification", body: "A medically supervised stage that clears substances from the body safely." },
      { title: "Treatment and rehabilitation", body: "Individual and group psychological and behavioural therapy that builds recovery skills." },
      { title: "Follow-up and support", body: "An ongoing follow-up programme preventing relapse and keeping recovery stable." },
    ],
  },
  {
    kind: "cardGrid", id: "training", band: "mint", variant: "stacked",
    align: "center", titleTone: "dark", heading: "Training and volunteering",
    subheading: "Training and volunteering opportunities for psychology students and volunteers",
    cards: [
      { title: "Psychology student training", body: "A practical training programme for psychology students under specialist supervision.", image: img("training-1", "Psychology student training") },
      { title: "JCD", body: "Join JCD as a volunteer and contribute to awareness and community support work.", image: img("training-2", "Volunteering with JCD") },
      { title: "MCD", body: "Volunteer with MCD on field projects and community services.", image: img("training-3", "Volunteering with MCD") },
    ],
  },
  {
    kind: "cardGrid", id: "events", band: "cream", variant: "stacked",
    align: "start", titleTone: "dark", heading: "Upcoming events",
    subheading: "Join us at our community and awareness activities",
    cards: [
      { meta: "July", title: "Charity dinner", image: img("event-1", "Charity dinner") },
      { meta: "August", title: "Marathon of Hope", image: img("event-2", "Marathon of Hope") },
      { meta: "September", title: "Youth awareness workshop", image: img("event-3", "Youth awareness workshop") },
      { meta: "October", title: "Recovery art exhibition", image: img("event-4", "Recovery art exhibition") },
      { meta: "November", title: "Yoga and meditation day", image: img("event-5", "Yoga and meditation day") },
      { meta: "December", title: "Food festival", image: img("event-6", "Food festival") },
    ],
  },
  {
    kind: "donate", id: "donate", band: "dark",
    heading: "Help save a life",
    subheading: "Your donation helps us provide free treatment to those who cannot afford it.",
    amounts: ["$50", "$100", "$150", "$200", "$500"],
    cta: { label: "Donate now", href: "#donate" },
    image: img("donate", "Help save a life"),
  },
  {
    kind: "products", id: "shop", band: "mint",
    heading: "Our shop",
    subheading: "Handmade products made by people in recovery — every purchase supports their journey.",
    addToCart: "Add to cart",
    products: [],
  },
  {
    kind: "cardGrid", id: "news", band: "cream", variant: "stacked",
    align: "start", titleTone: "dark", metaStyle: "badge",
    heading: "Stay informed",
    cards: [
      { meta: "Study", title: "New study on digital addiction", body: "Recent research highlighting the effect of screens on young people's mental health.", image: img("news-1", "Study") },
      { meta: "News", title: "A new centre opens in the North", body: "Extending our services to northern regions in cooperation with local municipalities.", image: img("news-2", "News") },
      { meta: "Update", title: "Treatment protocols updated for 2026", body: "Adopting the latest international standards in treatment and rehabilitation protocols.", image: img("news-3", "Update") },
    ],
  },
  {
    kind: "newsletter", id: "newsletter", band: "cream",
    heading: "Subscribe to our newsletter",
    subheading: "Stay up to date with our latest news and events",
    placeholder: "Email address",
    cta: "Subscribe",
  },
  {
    kind: "stats", id: "impact", band: "teal",
    stats: [
      { value: "24/7", label: "Helpline open" },
      { value: "85%", label: "Treatment success rate" },
      { value: "+15", label: "Years of experience" },
      { value: "2000+", label: "People served" },
    ],
  },
  {
    kind: "iconCards", id: "assessments", band: "sand",
    heading: "Assessments",
    subheading: "Confidential assessment tools to help you take the first step",
    cards: [
      { icon: "search", title: "Concern about substance use", body: "Do you suspect someone close to you is using drugs?", href: "#contact" },
      { icon: "personCheck", title: "Volunteer readiness check", body: "Find out whether you are ready to join our team", href: "/volunteer-readiness" },
    ],
  },
  {
    kind: "accordion", id: "faq", band: "mint",
    heading: "Frequently asked questions",
    items: [
      { question: "Is treatment completely confidential?", answer: "Yes. All information and consultations are entirely confidential and protected under medical confidentiality law." },
      { question: "How long does treatment take?", answer: "It varies by case, usually between 3 and 12 months with ongoing follow-up." },
      { question: "Can family members take part?", answer: "Absolutely. We run dedicated programmes that support families and involve them in recovery." },
      { question: "Are the services free?", answer: "We provide free and subsidised services to those who cannot pay, thanks to your donations." },
    ],
  },
];

export function getSections(locale: Locale): Section[] {
  return locale === "en" ? EN : AR;
}

/** Kept for callers that only need the default-language composition. */
export const sections = AR;
