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

export const hero = {
  heading: "هل ترغب في التطوع وخدمة المجتمع؟",
  subheading: "اكتشف إذا كنت مستعداً للانضمام لفريقنا التطوعي",
  cta: "فحص جاهزية التطوع",
  ctaHref: "/volunteer-readiness",
  imageAlt: "ثلاثة متطوعين يحملون أدوات التنظيف ويبتسمون في الشارع",
  slideCount: 3,
  activeSlide: 0,
};

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
