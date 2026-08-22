import type { Locale } from "./i18n";

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
 * components/sections/Sections.tsx.
 */

export const nav = {
  ar: [
    { label: "من نحن", href: "#about" },
    { label: "برامجنا", href: "#programmes" },
    { label: "التدريب والتطوع", href: "#training" },
    { label: "فعاليات", href: "#events" },
    { label: "تبرَّع", href: "#donate" },
    { label: "تواصل", href: "#contact" },
  ],
  en: [
    { label: "About", href: "#about" },
    { label: "Programmes", href: "#programmes" },
    { label: "Training & volunteering", href: "#training" },
    { label: "Events", href: "#events" },
    { label: "Donate", href: "#donate" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

export const brand = {
  ar: {
    alt: "الشبكة لمكافحة المخدرات — للوقاية وإعادة التأهيل",
    href: "/",
  },
  en: {
    alt: "JCD — drug prevention and rehabilitation network",
    href: "/",
  },
} as const;

/** The header toggle shows the language you would switch *to*. */
export const languageToggle = { ar: "EN", en: "ع" } as const;

export const heroSlides = {
  ar: [
    {
      image: "/hero-volunteers.jpg",
      imageAlt: "ثلاثة متطوعين يحملون أدوات التنظيف ويبتسمون في الشارع",
      heading: "هل ترغب في التطوع وخدمة المجتمع؟",
      subheading: "اكتشف إذا كنت مستعداً للانضمام لفريقنا التطوعي",
      cta: "فحص جاهزية التطوع",
      ctaHref: "/volunteer-readiness",
    },
    {
      image: "/sections/hero-donate.jpg",
      imageAlt: "خلفية بألوان الجمعية",
      heading: "ساهم في إنقاذ حياة",
      subheading: "تبرعك يساعدنا في تقديم العلاج المجاني لمن لا يستطيع تحمّل تكاليفه.",
      cta: "تبرَّع الآن",
      ctaHref: "#donate",
    },
    {
      image: "/sections/hero-helpline.jpg",
      imageAlt: "خلفية بألوان الجمعية",
      heading: "خط المساعدة – متاح 24/7",
      subheading: "لا تتردد في الاتصال بنا. الاستشارة مجانية وسرية.",
      cta: "اتصل بنا",
      ctaHref: "tel:+9611234567",
    },
  ],
  en: [
    {
      image: "/hero-volunteers.jpg",
      imageAlt: "Three volunteers holding cleaning tools and smiling in the street",
      heading: "Would you like to volunteer and serve your community?",
      subheading: "Find out whether you are ready to join our volunteer team",
      cta: "Volunteer readiness check",
      ctaHref: "/volunteer-readiness",
    },
    {
      image: "/sections/hero-donate.jpg",
      imageAlt: "Background in the organisation's colours",
      heading: "Help save a life",
      subheading:
        "Your donation helps us provide free treatment to those who cannot afford it.",
      cta: "Donate now",
      ctaHref: "#donate",
    },
    {
      image: "/sections/hero-helpline.jpg",
      imageAlt: "Background in the organisation's colours",
      heading: "Helpline – available 24/7",
      subheading:
        "Do not hesitate to call us. Consultations are free and confidential.",
      cta: "Call us",
      ctaHref: "tel:+9611234567",
    },
  ],
} as const;

/** Milliseconds each hero slide is shown before advancing. */
export const heroInterval = 6000;

export const helpBar = {
  ar: {
    heading: "خط المساعدة – متاح 24/7",
    subheading: "لا تتردد في الاتصال بنا. الاستشارة مجانية وسرية.",
    phone: "+961 1 234 567",
  },
  en: {
    heading: "Helpline – available 24/7",
    subheading: "Do not hesitate to call us. Consultations are free and confidential.",
    phone: "+961 1 234 567",
  },
} as const;

export const footer = {
  ar: {
    heading: "تواصل معنا",
    subheading: "نحن هنا لمساعدتك. لا تتردد في التواصل معنا في أي وقت.",
    contacts: [
      { icon: "phone", label: "+961 1 234 567", href: "tel:+9611234567" },
      { icon: "whatsapp", label: "واتساب", href: "#" },
      {
        icon: "mail",
        label: "info@jcd-lebanon.org",
        href: "mailto:info@jcd-lebanon.org",
      },
      { icon: "pin", label: "بيروت، لبنان", href: "#" },
    ],
    copyright: "© 2026 JCD لبنان – جميع الحقوق محفوظة",
  },
  en: {
    heading: "Contact us",
    subheading: "We are here to help. Reach out to us at any time.",
    contacts: [
      { icon: "phone", label: "+961 1 234 567", href: "tel:+9611234567" },
      { icon: "whatsapp", label: "WhatsApp", href: "#" },
      {
        icon: "mail",
        label: "info@jcd-lebanon.org",
        href: "mailto:info@jcd-lebanon.org",
      },
      { icon: "pin", label: "Beirut, Lebanon", href: "#" },
    ],
    copyright: "© 2026 JCD Lebanon – all rights reserved",
  },
} as const;

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
