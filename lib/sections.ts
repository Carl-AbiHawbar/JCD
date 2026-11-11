import type { Locale } from "./i18n";
import { img, type Committee, type Img } from "./images";
import { programmes } from "./pages";

export type { Img };

/**
 * Home page composition below the help bar.
 *
 * The order and the copy follow JCD's website brief: each band is a short
 * "front" that leads to a fuller inner page (lib/pages.ts). History, mission,
 * partnerships, team, services, treatment stages, training, newsletter, stats,
 * assessments and the FAQ were struck from the homepage in that brief; their
 * section kinds are still understood by components/sections/Sections.tsx, so
 * any of them can come back by adding an entry here.
 *
 * Layout, ordering, band colours and imagery are shared between languages —
 * only the words differ, which is why the two lists have one shape.
 */

export type Band = "cream" | "sand" | "mint" | "dark" | "teal";

export type Action = { label: string; href: string };

/** A short front for an inner page: heading, a line or two, and a link. */
export type TeaserSection = {
  kind: "teaser";
  id: string;
  band: Band;
  imageSide: "left" | "right";
  image: Img;
  /** Small line above the heading, e.g. what an acronym stands for. */
  eyebrow?: string;
  heading: string;
  /** A committee's front: its logo is shown in place of the heading text. */
  committee?: Committee;
  /** A slogan, set large under the heading. */
  tagline?: string;
  body?: string[];
  /** A closing line set in bold; words wrapped in *asterisks* turn red. */
  highlight?: string;
  cta: Action;
};

export type AchievementsSection = {
  kind: "achievements";
  id: string;
  band: Band;
  image: Img;
  heading: string;
  since: string;
  body: string[];
  /** The button that shows the figures, and the one that hides them again. */
  reveal: string;
  conceal: string;
  stats: { value: string; label: string }[];
};

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
  cards: { title: string; body?: string; meta?: string; image: Img; href?: string }[];
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
  | TeaserSection
  | AchievementsSection
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

/** The programme cards are the inner pages' own summaries, so they never drift. */
function programmeCards(locale: Locale): CardGridSection["cards"] {
  return programmes(locale).map((p) => ({
    title: p.title,
    body: p.summary,
    image: p.image,
    href: `/programmes/${p.slug}`,
  }));
}

/** 3285 → "3,285": the brief's figures, grouped so they read at a glance. */
const figure = (n: number) => n.toLocaleString("en-US");

/* ------------------------------------------------------------------ arabic */

const AR: Section[] = [
  {
    kind: "teaser", id: "about", band: "cream", imageSide: "left",
    image: img("about", "فريق الجمعية"),
    heading: "من نحن؟",
    body: ["جمعية (JCD) هي منظمة لبنانية لا تبغي الربح، متخصصة بمكافحة الإدمان، وتقديم خدمات إعادة التأهيل والتوعية والتدريب ودعم العائلات،"],
    highlight: "إيمانًا منها بأن *التعافي ممكن*، وأن طلب المساعدة هو الخطوة الأولى نحو *التغيير*.",
    cta: { label: "اقرأ المزيد", href: "/about" },
  },
  {
    kind: "cardGrid", id: "programmes", band: "dark", variant: "overlay",
    align: "center", titleTone: "dark", heading: "برامجنا",
    subheading: "برامج متنوعة تلبي مختلف الاحتياجات في مسيرة التعافي",
    cards: programmeCards("ar"),
  },
  {
    kind: "achievements", id: "achievements", band: "sand",
    image: { src: "/sections/anniversary-33.png", alt: "٣٣ سنة خبرة وعطاء" },
    heading: "إنجازاتنا",
    since: "منذ 4 شباط 1994",
    body: [
      "33 سنة من الالتزام والعطاء، والعمل من أجل شبيبة رائدة، واعية وواعدة بمستقبل أفضل، ومن أجل عائلة محمية ومتماسكة.",
      "إنجازات فريق العمل الرائع ما زالت مستمرة، وخدماتنا في تطوّر دائم. أمّا تضحياتنا، فلا حدود لها.",
    ],
    reveal: "اكتشف أرقامنا",
    conceal: "إخفاء الأرقام",
    stats: [
      { value: figure(3285), label: "المستفيدون من العلاج الداخلي" },
      { value: figure(1856), label: "المستفيدون من العلاج الخارجي" },
      { value: figure(8940), label: "المستفيدون من الاستشارات والدعم" },
      { value: figure(44560), label: "المستفيدون من خدماتنا" },
    ],
  },
  {
    // The brief asks for three photographs, each with the activity's name.
    kind: "cardGrid", id: "activities", band: "cream", variant: "stacked",
    align: "start", titleTone: "dark", heading: "نشاطاتنا",
    subheading: "انضم إلينا في أنشطتنا المجتمعية والتوعوية",
    cards: [
      { title: "حفل العشاء الخيري", image: img("event-1", "حفل العشاء الخيري") },
      { title: "ماراثون الأمل", image: img("event-2", "ماراثون الأمل") },
      { title: "ورشة توعية للشباب", image: img("event-3", "ورشة توعية للشباب") },
    ],
  },
  {
    kind: "teaser", id: "mcd", band: "mint", imageSide: "right", committee: "mcd",
    image: img("mcd", "لجنة أمّهات ضدّ المخدّرات"),
    eyebrow: "لجنة أمّهات ضدّ المخدّرات",
    heading: "MCD",
    tagline: "من قلب الأمّ، بتبلّش الوقاية",
    cta: { label: "اقرأ المزيد", href: "/mcd" },
  },
  {
    kind: "teaser", id: "club", band: "cream", imageSide: "left", committee: "club",
    image: img("training-2", "شباب متطوعون في نشاط جماعي"),
    eyebrow: "أندية الشبيبة لمكافحة المخدّرات",
    heading: "JCD Club",
    tagline: "عندك طاقة؟ خلّي إلها تأثير!",
    cta: { label: "اقرأ المزيد", href: "/jcd-club" },
  },
  {
    kind: "donate", id: "donate", band: "dark",
    heading: "ساهم في إنقاذ حياة",
    subheading: "تبرعك يساعدنا في تقديم العلاج المجاني لمن لا يستطيع تحمّل تكاليفه.",
    amounts: ["$20", "$50", "$100", "$150", "$200"],
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
    // Labels from the brief; the items themselves are still to come from JCD.
    kind: "cardGrid", id: "news", band: "mint", variant: "stacked",
    align: "start", titleTone: "dark", metaStyle: "badge",
    heading: "ابقَ على اطلاع",
    cards: [
      { meta: "مباشر", title: "تغطية مباشرة لنشاطاتنا", body: "قريبًا.", image: img("news-1", "مباشر") },
      { meta: "قريبًا...", title: "ما ينتظرنا قريبًا", body: "قريبًا.", image: img("news-2", "قريبًا") },
      { meta: "المقابلات", title: "مقابلات وشهادات", body: "قريبًا.", image: img("news-3", "المقابلات") },
    ],
  },
];

/* ----------------------------------------------------------------- english */

const EN: Section[] = [
  {
    kind: "teaser", id: "about", band: "cream", imageSide: "left",
    image: img("about", "The JCD team"),
    heading: "Who are we?",
    body: ["JCD is a Lebanese non-profit organisation specialising in fighting addiction, and in rehabilitation, awareness, training and family support —"],
    highlight: "because we believe *recovery is possible*, and that asking for help is the first step towards *change*.",
    cta: { label: "Read more", href: "/about" },
  },
  {
    kind: "cardGrid", id: "programmes", band: "dark", variant: "overlay",
    align: "center", titleTone: "dark", heading: "Our programmes",
    subheading: "A range of programmes meeting different needs along the road to recovery",
    cards: programmeCards("en"),
  },
  {
    kind: "achievements", id: "achievements", band: "sand",
    image: { src: "/sections/anniversary-33.png", alt: "33 years of experience and giving" },
    heading: "Our achievements",
    since: "Since 4 February 1994",
    body: [
      "33 years of commitment and giving, working for a pioneering, aware and promising youth with a better future, and for families that are protected and united.",
      "Our wonderful team's achievements continue, and our services keep growing. As for our sacrifices, they know no limits.",
    ],
    reveal: "See our numbers",
    conceal: "Hide the numbers",
    stats: [
      { value: figure(3285), label: "People helped through inpatient treatment" },
      { value: figure(1856), label: "People helped through outpatient treatment" },
      { value: figure(8940), label: "People helped through counselling and support" },
      { value: figure(44560), label: "People reached by our services" },
    ],
  },
  {
    kind: "cardGrid", id: "activities", band: "cream", variant: "stacked",
    align: "start", titleTone: "dark", heading: "Our activities",
    subheading: "Join us at our community and awareness activities",
    cards: [
      { title: "Charity dinner", image: img("event-1", "Charity dinner") },
      { title: "Marathon of Hope", image: img("event-2", "Marathon of Hope") },
      { title: "Youth awareness workshop", image: img("event-3", "Youth awareness workshop") },
    ],
  },
  {
    kind: "teaser", id: "mcd", band: "mint", imageSide: "right", committee: "mcd",
    image: img("mcd", "Mothers Against Drugs"),
    eyebrow: "Mothers Against Drugs",
    heading: "MCD",
    tagline: "Prevention begins in a mother's heart",
    cta: { label: "Read more", href: "/mcd" },
  },
  {
    kind: "teaser", id: "club", band: "cream", imageSide: "left", committee: "club",
    image: img("training-2", "Young volunteers in a group activity"),
    eyebrow: "Youth Against Drugs clubs",
    heading: "JCD Club",
    tagline: "Got energy? Make it count!",
    cta: { label: "Read more", href: "/jcd-club" },
  },
  {
    kind: "donate", id: "donate", band: "dark",
    heading: "Help save a life",
    subheading: "Your donation helps us provide free treatment to those who cannot afford it.",
    amounts: ["$20", "$50", "$100", "$150", "$200"],
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
    kind: "cardGrid", id: "news", band: "mint", variant: "stacked",
    align: "start", titleTone: "dark", metaStyle: "badge",
    heading: "Stay informed",
    cards: [
      { meta: "Live", title: "Live coverage of our activities", body: "Coming soon.", image: img("news-1", "Live") },
      { meta: "Coming soon…", title: "What's next", body: "Coming soon.", image: img("news-2", "Coming soon") },
      { meta: "Interviews", title: "Interviews and testimonies", body: "Coming soon.", image: img("news-3", "Interviews") },
    ],
  },
];

export function getSections(locale: Locale): Section[] {
  return locale === "en" ? EN : AR;
}

/** Kept for callers that only need the default-language composition. */
export const sections = AR;
