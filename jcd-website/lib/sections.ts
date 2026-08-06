/**
 * Home page composition below the help bar.
 *
 * Copy transcribed from the full-resolution screenshots of the JCD mockup.
 * Every string here is read off the design — nothing is invented.
 *
 * Image slots are `null` because the mockup's photographs were not supplied as
 * files. Each slot renders a neutral placeholder at the correct aspect ratio;
 * drop a file in `public/sections/` and set `src` to make it appear.
 */

export type Band = "cream" | "sand" | "mint" | "dark" | "teal";

export type Img = { src: string; alt: string } | null;

export type SplitSection = {
  kind: "split";
  id: string;
  band: Band;
  /** Which side of the screen the photo sits on. */
  imageSide: "left" | "right";
  image: Img;
  /** Usually one; رسالتنا/رؤيتنا shares a single column with two. */
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
  /** `overlay` puts the copy over the photo; `stacked` puts it underneath. */
  variant: "stacked" | "overlay";
  align: "start" | "center";
  /** خدماتنا uses teal card titles; التدريب and فعاليات use dark ones. */
  titleTone: "teal" | "dark";
  /** News cards show their meta as a filled pill rather than small teal text. */
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
  placeholder: string;
  cta: string;
};

export type StatsSection = {
  kind: "stats";
  id: string;
  band: Band;
  /** Laid out left-to-right in the mockup, so this order is screen order. */
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

export const sections: Section[] = [
  {
    kind: "split",
    id: "about",
    band: "cream",
    imageSide: "left",
    image: null,
    blocks: [
      {
        heading: "من نحن",
        body: [
          "جمعية JCD هي منظمة لبنانية غير ربحية متخصصة في مكافحة الإدمان وتقديم خدمات إعادة التأهيل والإرشاد النفسي والاجتماعي. نعمل منذ سنوات على دعم الأفراد والعائلات المتضررة من آفة المخدرات.",
        ],
      },
    ],
  },
  {
    kind: "split",
    id: "history",
    band: "mint",
    imageSide: "right",
    image: null,
    blocks: [
      {
        heading: "تاريخنا",
        body: [
          "تأسست جمعية JCD في لبنان بهدف مكافحة آفة الإدمان ودعم المتضررين. على مدار السنوات، نمت الجمعية لتصبح مرجعًا وطنيًا في مجال الوقاية والعلاج وإعادة التأهيل.",
        ],
      },
    ],
  },
  {
    kind: "split",
    id: "mission",
    band: "cream",
    imageSide: "left",
    image: null,
    blocks: [
      {
        heading: "رسالتنا",
        body: [
          "نسعى إلى تقديم خدمات علاجية وتأهيلية شاملة لمكافحة الإدمان، ودعم الأفراد والعائلات في رحلة التعافي، وبناء مجتمع واعٍ وصحي.",
        ],
      },
      {
        heading: "رؤيتنا",
        body: [
          "مجتمع لبناني خالٍ من الإدمان، يتمتع فيه كل فرد بحياة كريمة ومستقبل مشرق.",
        ],
      },
    ],
  },
  {
    kind: "split",
    id: "partnerships",
    band: "mint",
    imageSide: "right",
    image: null,
    blocks: [
      {
        heading: "شراكاتنا",
        body: [
          "نتعاون مع مؤسسات محلية ودولية لتعزيز خدماتنا وتوسيع نطاق عملنا. شراكاتنا تشمل جهات حكومية ومنظمات غير حكومية ومؤسسات أكاديمية.",
        ],
      },
    ],
  },
  {
    kind: "feature",
    id: "team",
    band: "cream",
    heading: "فريقنا",
    subheading:
      "فريق متعدد التخصصات من الأطباء والمعالجين النفسيين والأخصائيين الاجتماعيين.",
    image: null,
  },
  {
    kind: "split",
    id: "achievements",
    band: "sand",
    imageSide: "left",
    image: null,
    blocks: [
      {
        heading: "إنجازاتنا",
        body: [
          "حققنا إنجازات عديدة في مجال مكافحة الإدمان، من تخريج آلاف المتعافين إلى الحصول على اعتمادات دولية وتوسيع خدماتنا في مختلف المناطق اللبنانية.",
        ],
      },
    ],
  },
  {
    kind: "split",
    id: "mcd",
    band: "cream",
    imageSide: "right",
    image: null,
    blocks: [
      {
        heading: "MCD",
        body: [
          "مركز MCD للخدمات المجتمعية والدعم الميداني — يقدم خدمات التوعية والإرشاد في المجتمعات المحلية ويعمل على تعزيز الوقاية من الإدمان.",
        ],
      },
    ],
  },
  {
    kind: "cardGrid",
    id: "services",
    band: "mint",
    variant: "stacked",
    align: "start",
    titleTone: "teal",
    heading: "خدماتنا",
    cards: [
      {
        title: "إعادة التأهيل",
        body: "برامج متكاملة لإعادة التأهيل الجسدي والنفسي في بيئة آمنة وداعمة.",
        image: null,
      },
      {
        title: "الإرشاد النفسي",
        body: "جلسات فردية وجماعية مع مختصين لدعم التعافي والصحة النفسية.",
        image: null,
      },
      {
        title: "دعم الأسرة",
        body: "مساعدة العائلات على فهم الإدمان والتعامل معه بطرق صحية وفعالة.",
        image: null,
      },
    ],
  },
  {
    kind: "cardGrid",
    id: "programmes",
    band: "dark",
    variant: "overlay",
    align: "center",
    titleTone: "dark",
    heading: "برامجنا",
    subheading: "برامج متنوعة تلبي مختلف الاحتياجات في مسيرة التعافي",
    cards: [
      {
        title: "العلاج الداخلي",
        body: "برنامج إقامة كاملة يشمل مراحل إزالة السموم والعلاج النفسي والتأهيل.",
        image: null,
      },
      {
        title: "العلاج الخارجي – السلوكي",
        body: "جلسات علاجية في مركز السلوكي دون الحاجة للإقامة.",
        image: null,
      },
      {
        title: "القبول",
        body: "إجراءات القبول والتقييم الأولي للانضمام لبرامجنا.",
        image: null,
      },
      {
        title: "العلاج الخارجي – المتابعة",
        body: "جلسات متابعة وعلاج خارجي متقدمة لدعم التعافي المستمر.",
        image: null,
      },
      {
        title: "التوعية والتدريب",
        body: "ورش عمل ومحاضرات في المدارس والجامعات لنشر الوعي.",
        image: null,
      },
    ],
  },
  {
    kind: "steps",
    id: "treatment-stages",
    band: "cream",
    heading: "مراحل العلاج الداخلي",
    subheading: "رحلة التعافي خطوة بخطوة مع فريقنا المتخصص",
    steps: [
      {
        title: "التقييم الأولي",
        body: "لقاء مع فريق متخصص لفهم حالتك ووضع خطة علاج مخصصة.",
      },
      {
        title: "إزالة السموم",
        body: "مرحلة طبية مراقبة لتخليص الجسم من المواد بأمان.",
      },
      {
        title: "العلاج والتأهيل",
        body: "جلسات علاج نفسي وسلوكي فردية وجماعية لبناء مهارات التعافي.",
      },
      {
        title: "المتابعة والدعم",
        body: "برنامج متابعة مستمر لمنع الانتكاس وضمان استقرار التعافي.",
      },
    ],
  },
  {
    kind: "cardGrid",
    id: "training",
    band: "mint",
    variant: "stacked",
    align: "center",
    titleTone: "dark",
    heading: "التدريب والتطوع",
    subheading: "فرص تدريب وتطوع لطلاب علم النفس والمتطوعين",
    cards: [
      {
        title: "تدريب طلاب علم النفس",
        body: "برنامج تدريب عملي لطلاب علم النفس تحت إشراف مختصين.",
        image: null,
      },
      {
        title: "JCD",
        body: "انضم كمتطوع في JCD وساهم في أنشطة التوعية والدعم المجتمعي.",
        image: null,
      },
      {
        title: "MCD",
        body: "تطوع مع MCD في المشاريع الميدانية والخدمات المجتمعية.",
        image: null,
      },
    ],
  },
  {
    kind: "cardGrid",
    id: "events",
    band: "cream",
    variant: "stacked",
    align: "start",
    titleTone: "dark",
    heading: "فعالياتنا القادمة",
    subheading: "انضم إلينا في أنشطتنا المجتمعية والتوعوية",
    cards: [
      { meta: "تموز", title: "حفل العشاء الخيري", image: null },
      { meta: "آب", title: "ماراثون الأمل", image: null },
      { meta: "أيلول", title: "ورشة توعية للشباب", image: null },
      { meta: "تشرين أول", title: "معرض فن التعافي", image: null },
      { meta: "تشرين ثاني", title: "يوم اليوغا والتأمل", image: null },
      { meta: "كانون أول", title: "مهرجان الطعام", image: null },
    ],
  },
  {
    kind: "donate",
    id: "donate",
    band: "dark",
    heading: "ساهم في إنقاذ حياة",
    subheading: "تبرعك يساعدنا في تقديم العلاج المجاني لمن لا يستطيع تحمّل تكاليفه.",
    // ascending right-to-left, as laid out in the mockup
    amounts: ["$0", "$100", "$150", "$200", "$500"],
    cta: { label: "تبرَّع الآن", href: "#" },
    image: null,
  },
  {
    kind: "products",
    id: "shop",
    band: "mint",
    heading: "متجرنا",
    subheading: "منتجات يدوية من صنع المتعافين — كل عملية شراء تدعم رحلة التعافي.",
    addToCart: "أضف إلى السلة",
    products: [
      { title: "مربى التين", price: "$12", image: null },
      { title: "بقلاوة بالفستق", price: "$18", image: null },
      { title: "شوكولاتة يدوية", price: "$15", image: null },
      { title: "زيت زيتون بلدي", price: "$20", image: null },
      { title: "عسل طبيعي", price: "$22", image: null },
      { title: "زعتر بلدي", price: "$8", image: null },
      { title: "فواكه مجففة", price: "$14", image: null },
      { title: "ماء ورد", price: "$10", image: null },
      { title: "دبس رمان", price: "$12", image: null },
    ],
  },
  {
    kind: "cardGrid",
    id: "news",
    band: "cream",
    variant: "stacked",
    align: "start",
    titleTone: "dark",
    metaStyle: "badge",
    heading: "ابقَ على اطلاع",
    cards: [
      {
        meta: "دراسة",
        title: "دراسة جديدة حول الإدمان الرقمي",
        body: "نتائج بحثية حديثة تسلط الضوء على تأثير الشاشات على الصحة النفسية للشباب.",
        image: null,
      },
      {
        meta: "أخبار",
        title: "افتتاح مركز جديد في الشمال",
        body: "توسيع خدماتنا لتشمل المناطق الشمالية بالتعاون مع البلديات المحلية.",
        image: null,
      },
      {
        meta: "تحديث",
        title: "تحديث بروتوكولات العلاج 2026",
        body: "اعتماد أحدث المعايير العالمية في بروتوكولات العلاج والتأهيل.",
        image: null,
      },
    ],
  },
  {
    kind: "newsletter",
    id: "newsletter",
    band: "cream",
    heading: "اشترك في النشرة الإخبارية",
    placeholder: "بريدك الإلكتروني",
    cta: "اشترك",
  },
  {
    kind: "stats",
    id: "impact",
    band: "teal",
    stats: [
      { value: "24/7", label: "خط مساعدة مفتوح" },
      { value: "85%", label: "نسبة نجاح العلاج" },
      { value: "+15", label: "سنة من الخبرة" },
      { value: "2000+", label: "مستفيد من خدماتنا" },
    ],
  },
  {
    kind: "iconCards",
    id: "assessments",
    band: "sand",
    heading: "التقييمات",
    subheading: "أدوات تقييم سرية لمساعدتك على اتخاذ الخطوة الأولى",
    cards: [
      {
        icon: "search",
        title: "تقييم القلق من الاستخدام",
        body: "هل تشك أن شخصاً قريباً يستخدم المخدرات؟",
        href: "#",
      },
      {
        icon: "personCheck",
        title: "فحص جاهزية التطوع",
        body: "اكتشف إذا كنت مستعداً للانضمام لفريقنا",
        href: "/volunteer-readiness",
      },
    ],
  },
  {
    kind: "accordion",
    id: "faq",
    band: "mint",
    heading: "أسئلة شائعة",
    items: [
      {
        question: "هل العلاج سري بالكامل؟",
        answer:
          "نعم، جميع المعلومات والاستشارات سرية بالكامل ومحمية بموجب قوانين السرية الطبية.",
      },
      {
        question: "كم تستغرق مدة العلاج؟",
        answer: "تختلف المدة حسب الحالة، عادة من 3 إلى 12 شهرًا مع متابعة مستمرة.",
      },
      {
        question: "هل يمكن لأفراد العائلة المشاركة؟",
        answer:
          "بالتأكيد! نقدم برامج خاصة لدعم العائلة وإشراكها في عملية التعافي.",
      },
      {
        question: "هل الخدمات مجانية؟",
        answer: "نقدم خدمات مجانية ومدعومة للحالات غير القادرة بفضل تبرعاتكم.",
      },
    ],
  },
];
