import type { Locale } from "./i18n";
import { telHref, whatsappHref } from "./format";

/**
 * JCD's public number, in one place: the helpline bar, the hero's "call us"
 * slide and the footer's phone and WhatsApp cards are all derived from it, so
 * changing the organisation's number is a one-line edit here.
 */
export const jcdPhone = "+961 70 277 877";

/**
 * The shop is switched off for now: the متجرنا band, the cart icon, the
 * "المتجر" nav entry and the /cart page all disappear together. Nothing is
 * deleted — flip this to true to bring the whole thing back.
 */
export const shopEnabled = false;

/**
 * The "تحدّث مع نور" floating button is switched off for now. Nothing is
 * deleted — flip this to true to bring it back.
 */
export const nourEnabled = false;

/**
 * Every string outside the page bands, in both languages.
 *
 * The Arabic is transcribed from the Canva mockup; the English is a
 * translation of that same copy, since the design's `EN` control implies a
 * bilingual site. Nav items point at the section ids rendered by
 * components/sections/Sections.tsx, through "/" so that they also work from
 * the inner pages.
 */

export const nav = {
  ar: [
    { label: "من نحن", href: "/#about" },
    { label: "برامجنا", href: "/#programmes" },
    { label: "نشاطاتنا", href: "/#activities" },
    { label: "MCD", href: "/#mcd" },
    { label: "JCD Club", href: "/#club" },
    { label: "تبرَّع", href: "/#donate" },
    { label: "تواصل", href: "/#contact" },
  ],
  en: [
    { label: "About", href: "/#about" },
    { label: "Programmes", href: "/#programmes" },
    { label: "Activities", href: "/#activities" },
    { label: "MCD", href: "/#mcd" },
    { label: "JCD Club", href: "/#club" },
    { label: "Donate", href: "/#donate" },
    { label: "Contact", href: "/#contact" },
  ],
} as const;

export const brand = {
  ar: {
    alt: "الشبيبة لمكافحة المخدّرات — JCD",
    href: "/",
  },
  en: {
    alt: "JCD — Youth Against Drugs",
    href: "/",
  },
} as const;

/** The header toggle shows the language you would switch *to*. */
export const languageToggle = { ar: "EN", en: "ع" } as const;

/**
 * The anniversary banner leads, then the three photographic slides. The banner
 * is finished artwork on a pale ground, so it is shown whole rather than
 * cropped and takes neither the scrim nor the overlaid copy.
 */
export const heroSlides = {
  ar: [
    {
      // A finished banner carrying its own wording, so it takes no overlay.
      image: "/hero-anniversary.jpg",
      imageAlt:
        "معاً من أجل شبيبةٍ رائدة، واعية وواعدة بمستقبل أفضل — ٣٣ سنة خبرة وعطاء",
      video: "/hero-anniversary.mp4",
      // Cut to the hero's shape on a phone, so it fills the band like the
      // photographs do instead of sitting letterboxed inside it.
      videoNarrow: "/hero-anniversary-mobile.mp4",
      imageNarrow: "/hero-anniversary-mobile.jpg",
      // The animation settles around six seconds; the rest lets it be read.
      holdMs: 9000,
    },
    {
      image: "/hero-volunteers.jpg",
      imageAlt: "ثلاثة متطوعين يحملون أدوات التنظيف ويبتسمون في الشارع",
      heading: "هل ترغب في التطوع وخدمة المجتمع؟",
      subheading: "اكتشف إذا كنت مستعداً للانضمام لفريقنا التطوعي",
      ctas: [
        { label: "استمارة جهوزية التطوع", href: "/volunteer-readiness" },
        { label: "استمارة MCD", href: "/mcd/volunteer" },
      ],
    },
    {
      image: "/sections/hero-support.jpg",
      imageAlt: "أخصائية تجلس إلى جانب رجل وتستمع إليه",
      heading: "هل أنت أو شخص قريب بحاجة إلى مساعدة مهنية؟",
      subheading: "دعم لطيف وسري من أخصائيين محترفين — خطوة واحدة تبدأ التغيير",
      ctas: [{ label: "تواصل مع أخصائي", href: "/#contact" }],
    },
    {
      image: "/sections/hero-concern.jpg",
      imageAlt: "مراهقة تنظر إلى هاتفها بينما تتحدث إليها والدتها",
      heading: "هل تعتقد أنّ شخصًا تعرفه يتعاطى المخدرات؟",
      subheading: "هذه القائمة تساعدك على الكشف المبكر",
      ctas: [{ label: "المؤشرات", href: "/family-checklist" }],
    },
  ],
  en: [
    {
      image: "/hero-anniversary.jpg",
      imageAlt:
        "Together for a pioneering, aware and promising youth — 33 years of experience and giving",
      video: "/hero-anniversary.mp4",
      videoNarrow: "/hero-anniversary-mobile.mp4",
      imageNarrow: "/hero-anniversary-mobile.jpg",
      holdMs: 9000,
    },
    {
      image: "/hero-volunteers.jpg",
      imageAlt: "Three volunteers holding cleaning tools and smiling in the street",
      heading: "Would you like to volunteer and serve your community?",
      subheading: "Find out whether you are ready to join our volunteer team",
      ctas: [
        { label: "Volunteer readiness form", href: "/volunteer-readiness" },
        { label: "MCD form", href: "/mcd/volunteer" },
      ],
    },
    {
      image: "/sections/hero-support.jpg",
      imageAlt: "A specialist sitting beside a man and listening to him",
      heading: "Do you, or someone close to you, need professional help?",
      subheading:
        "Gentle, confidential support from trained specialists — one step begins the change",
      ctas: [{ label: "Talk to a specialist", href: "/#contact" }],
    },
    {
      image: "/sections/hero-concern.jpg",
      imageAlt: "A teenager looking at her phone while her mother talks to her",
      heading: "Do you think someone you know is using drugs?",
      subheading: "This checklist helps you spot the signs early",
      ctas: [{ label: "The warning signs", href: "/family-checklist" }],
    },
  ],
} as const;

/** Milliseconds each hero slide is shown before advancing. */
export const heroInterval = 6000;

export const helpBar = {
  ar: {
    heading: "خط المساعدة – متاح 24/7",
    subheading: "لا تتردد في الاتصال بنا. الاستشارة مجانية وسرية.",
    phone: jcdPhone,
  },
  en: {
    heading: "Helpline – available 24/7",
    subheading: "Do not hesitate to call us. Consultations are free and confidential.",
    phone: jcdPhone,
  },
} as const;

/**
 * The contact band's four cards, as JCD laid them out: the 24/7 line (which
 * opens WhatsApp), the admission office, the general administration, and the
 * two places people come to.
 */
const admissionPhone = "+961 81 336 883";
const adminPhones = ["+961 9 638 241", "+961 9 638 141"] as const;
const email = "jcd@jcdlb.org";

/**
 * Map searches rather than pinned coordinates, so a guessed pin can never send
 * someone to the wrong door. Swap in Google Maps share links once JCD sends
 * them.
 */
const mapsSearch = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const jouniehMap = mapsSearch("Jeunesse Contre la Drogue JCD Jounieh");
const salloumeMap = mapsSearch("Jeunesse Contre la Drogue JCD Salloumi Bourj Hammoud");

export type ContactLine = { text: string; href?: string; ltr?: boolean };
export type ContactCard = {
  icon: "whatsapp" | "phone" | "mail" | "pin";
  title: string;
  lines: ContactLine[];
};

const footerAr: { heading: string; subheading: string; contacts: ContactCard[]; copyright: string } = {
  heading: "تواصل معنا",
  subheading: "نحن هنا لمساعدتك. لا تتردد في التواصل معنا في أي وقت.",
  contacts: [
    {
      icon: "whatsapp",
      title: "خط مساعدة مفتوح 24/7",
      lines: [{ text: jcdPhone, href: whatsappHref(jcdPhone), ltr: true }],
    },
    {
      icon: "phone",
      title: "مكتب الدخول",
      lines: [{ text: "81/336883", href: telHref(admissionPhone), ltr: true }],
    },
    {
      icon: "mail",
      title: "الإدارة العامة",
      lines: [
        { text: "09/638241", href: telHref(adminPhones[0]), ltr: true },
        { text: "09/638141", href: telHref(adminPhones[1]), ltr: true },
        { text: "ص.ب. 2666 جونية، لبنان" },
        { text: email, href: `mailto:${email}`, ltr: true },
      ],
    },
    {
      icon: "pin",
      title: "مواقعنا",
      lines: [
        { text: "مكتب جونية", href: jouniehMap },
        { text: "مركز الصالومي", href: salloumeMap },
      ],
    },
  ],
  copyright: "© 2026 الشبيبة لمكافحة المخدّرات JCD – جميع الحقوق محفوظة",
};

const footerEn: typeof footerAr = {
  heading: "Contact us",
  subheading: "We are here to help. Reach out to us at any time.",
  contacts: [
    {
      icon: "whatsapp",
      title: "Helpline open 24/7",
      lines: [{ text: jcdPhone, href: whatsappHref(jcdPhone), ltr: true }],
    },
    {
      icon: "phone",
      title: "Admission office",
      lines: [{ text: "81/336883", href: telHref(admissionPhone), ltr: true }],
    },
    {
      icon: "mail",
      title: "General administration",
      lines: [
        { text: "09/638241", href: telHref(adminPhones[0]), ltr: true },
        { text: "09/638141", href: telHref(adminPhones[1]), ltr: true },
        { text: "P.O. Box 2666, Jounieh, Lebanon" },
        { text: email, href: `mailto:${email}`, ltr: true },
      ],
    },
    {
      icon: "pin",
      title: "Our locations",
      lines: [
        { text: "Jounieh office", href: jouniehMap },
        { text: "Salloume centre", href: salloumeMap },
      ],
    },
  ],
  copyright: "© 2026 JCD Lebanon – all rights reserved",
};

export const footer = { ar: footerAr, en: footerEn };

/** Shop, cart and checkout wording. */
export const shopUi = {
  ar: {
    cartTitle: "سلة التسوق",
    cartEmpty: "سلتك فارغة.",
    browse: "تصفّح المتجر",
    loading: "جارٍ التحميل...",
    quantity: "الكمية",
    increase: "زيادة الكمية",
    decrease: "إنقاص الكمية",
    remove: "حذف",
    checkout: "إتمام الطلب",
    codeLabel: "رمز الخصم",
    apply: "تطبيق",
    codeBad: "الرمز غير صالح أو منتهي الصلاحية.",
    codeOk: (p: number) => `تم تطبيق خصم ${p}%`,
    fullName: "الاسم الكامل *",
    phone: "رقم الهاتف *",
    email: "البريد الإلكتروني",
    address: "العنوان",
    subtotal: "المجموع الفرعي",
    discount: "الخصم",
    total: "الإجمالي",
    confirm: "تأكيد الطلب",
    sending: "جارٍ الإرسال...",
    codNote: "الدفع عند الاستلام (COD). لا يتم تحصيل أي مبلغ عبر الموقع.",
    failed: "تعذّر إتمام الطلب. يرجى المحاولة لاحقاً.",
    emptyCart: "السلة فارغة.",
    thanks: "شكراً لك، تم استلام طلبك.",
    orderNumber: "رقم الطلب:",
    thanksNote: "الدفع عند الاستلام. سنتواصل معك لتأكيد التفاصيل والتسليم.",
    backToShop: "العودة إلى المتجر",
    cartAria: "سلة التسوق",
    added: "تمت الإضافة ✓",
    wishlist: (t: string) => `أضف ${t} إلى المفضلة`,
  },
  en: {
    cartTitle: "Shopping cart",
    cartEmpty: "Your cart is empty.",
    browse: "Browse the shop",
    loading: "Loading...",
    quantity: "Quantity",
    increase: "Increase quantity",
    decrease: "Decrease quantity",
    remove: "Remove",
    checkout: "Checkout",
    codeLabel: "Discount code",
    apply: "Apply",
    codeBad: "That code is not valid or has expired.",
    codeOk: (p: number) => `${p}% discount applied`,
    fullName: "Full name *",
    phone: "Phone number *",
    email: "Email address",
    address: "Address",
    subtotal: "Subtotal",
    discount: "Discount",
    total: "Total",
    confirm: "Place order",
    sending: "Sending...",
    codNote: "Cash on delivery. Nothing is charged through this website.",
    failed: "We could not place the order. Please try again later.",
    emptyCart: "Your cart is empty.",
    thanks: "Thank you — we have received your order.",
    orderNumber: "Order number:",
    thanksNote:
      "Cash on delivery. We will contact you to confirm the details and delivery.",
    backToShop: "Back to the shop",
    cartAria: "Shopping cart",
    added: "Added ✓",
    wishlist: (t: string) => `Add ${t} to favourites`,
  },
} as const;

/** Customer account area. */
export const accountUi = {
  ar: {
    title: "حسابي",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    signOut: "تسجيل الخروج",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    name: "الاسم",
    haveAccount: "لديك حساب؟ سجّل الدخول",
    noAccount: "ليس لديك حساب؟ أنشئ واحداً",
    or: "أو",
    google: "المتابعة عبر Google",
    welcome: "أهلاً",
    myOrders: "طلباتي",
    noOrders: "لا توجد طلبات بعد.",
    browse: "تصفّح المتجر",
    loading: "جارٍ التحميل...",
    working: "جارٍ...",
    orderNumber: "رقم الطلب",
    date: "التاريخ",
    total: "الإجمالي",
    status: "الحالة",
    statuses: {
      pending: "قيد الانتظار",
      confirmed: "مؤكد",
      fulfilled: "تم التسليم",
      cancelled: "ملغى",
    } as Record<string, string>,
  },
  en: {
    title: "My account",
    signIn: "Sign in",
    signUp: "Create account",
    signOut: "Sign out",
    email: "Email address",
    password: "Password",
    name: "Name",
    haveAccount: "Already have an account? Sign in",
    noAccount: "No account yet? Create one",
    or: "or",
    google: "Continue with Google",
    welcome: "Welcome",
    myOrders: "My orders",
    noOrders: "No orders yet.",
    browse: "Browse the shop",
    loading: "Loading...",
    working: "Working...",
    orderNumber: "Order number",
    date: "Date",
    total: "Total",
    status: "Status",
    statuses: {
      pending: "Pending",
      confirmed: "Confirmed",
      fulfilled: "Delivered",
      cancelled: "Cancelled",
    } as Record<string, string>,
  },
} as const;

export function contentFor(locale: Locale) {
  return {
    nav: nav[locale],
    brand: brand[locale],
    languageToggle: languageToggle[locale],
    heroSlides: heroSlides[locale],
    helpBar: helpBar[locale],
    footer: footer[locale],
    shopUi: shopUi[locale],
    accountUi: accountUi[locale],
  };
}
