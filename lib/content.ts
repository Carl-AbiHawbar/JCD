/**
 * Every string in the site, transcribed from the Canva mockup
 * "JCD Organization Website Redesign Mockups" (design DAHLU10UT9c).
 *
 * Nav items are listed in the order they appear left-to-right in the mockup.
 */

export const nav = [
  { label: "من نحن", href: "#" },
  { label: "برامجنا", href: "#" },
  { label: "التدريب والتطوع", href: "#" },
  { label: "فعاليات", href: "#" },
  { label: "تبرَّع", href: "#" },
  { label: "المتجر", href: "#" },
  { label: "تواصل", href: "#" },
] as const;

export const languageToggle = "EN";

export const brand = {
  alt: "الشبكة لمكافحة المخدرات — للوقاية وإعادة التأهيل",
  href: "#",
};

/**
 * Hero carousel. The mockup shows three dots, so there are three slides.
 *
 * Every line of copy here already appears in the design — slide one is the
 * banner itself, slides two and three reuse the donation and helpline
 * messages verbatim. Nothing is invented. Replace `image` with real
 * photography when it is available; the sizes match public/hero-volunteers.jpg.
 */
export const heroSlides = [
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
] as const;

/** Milliseconds each slide is shown before advancing. */
export const heroInterval = 6000;

/** Contact band + copyright bar at the foot of the page. */
export const footer = {
  heading: "تواصل معنا",
  subheading: "نحن هنا لمساعدتك. لا تتردد في التواصل معنا في أي وقت.",
  // right-to-left on screen, matching the mockup
  contacts: [
    { icon: "phone", label: "+961 1 234 567", href: "tel:+9611234567" },
    { icon: "whatsapp", label: "واتساب", href: "#" },
    {
      icon: "mail",
      label: "info@jcd-lebanon.org",
      href: "mailto:info@jcd-lebanon.org",
    },
    { icon: "pin", label: "بيروت، لبنان", href: "#" },
  ] as const,
  copyright: "© 2026 JCD لبنان – جميع الحقوق محفوظة",
};

export const helpBar = {
  heading: "خط المساعدة – متاح 24/7",
  subheading: "لا تتردد في الاتصال بنا. الاستشارة مجانية وسرية.",
  phone: "+961 1 234 567",
};
