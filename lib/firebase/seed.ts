"use client";

import { collection, getDocs, writeBatch, doc, limit, query } from "firebase/firestore";

import { db } from "./client";

/**
 * One-time content import, run from the dashboard by a signed-in admin.
 *
 * There is no service account in this project, so seeding cannot happen from a
 * script — it runs as the admin, through the same rules as any other write.
 * Collections that already contain documents are skipped, so pressing the
 * button twice cannot duplicate the catalogue.
 */

const PRODUCTS = [
  ["fig-jam", "مربى التين", "مربى تين بلدي محضّر يدويًا.", 1200],
  ["pistachio-baklava", "بقلاوة بالفستق", "بقلاوة بالفستق الحلبي.", 1800],
  ["handmade-chocolate", "شوكولاتة يدوية", "شوكولاتة محضّرة يدويًا.", 1500],
  ["olive-oil", "زيت زيتون بلدي", "زيت زيتون بكر ممتاز من مزارع لبنانية.", 2000],
  ["natural-honey", "عسل طبيعي", "عسل طبيعي مئة بالمئة.", 2200],
  ["zaatar", "زعتر بلدي", "خلطة زعتر بلدي تقليدية.", 800],
  ["dried-fruits", "فواكه مجففة", "تشكيلة فواكه مجففة طبيعية.", 1400],
  ["rose-water", "ماء ورد", "ماء ورد مقطر طبيعيًا.", 1000],
  ["pomegranate-molasses", "دبس رمان", "دبس رمان طبيعي بلا إضافات.", 1200],
] as const;

const FAQS = [
  ["هل العلاج سري بالكامل؟",
   "نعم، جميع المعلومات والاستشارات سرية بالكامل ومحمية بموجب قوانين السرية الطبية."],
  ["كم تستغرق مدة العلاج؟",
   "تختلف المدة حسب الحالة، عادة من 3 إلى 12 شهرًا مع متابعة مستمرة."],
  ["هل يمكن لأفراد العائلة المشاركة؟",
   "بالتأكيد! نقدم برامج خاصة لدعم العائلة وإشراكها في عملية التعافي."],
  ["هل الخدمات مجانية؟",
   "نقدم خدمات مجانية ومدعومة للحالات غير القادرة بفضل تبرعاتكم."],
] as const;

const PROGRAMS = [
  ["inpatient", "العلاج الداخلي",
   "برنامج إقامة كاملة يشمل مراحل إزالة السموم والعلاج النفسي والتأهيل."],
  ["outpatient-behavioural", "العلاج الخارجي – السلوكي",
   "جلسات علاجية في مركز السلوكي دون الحاجة للإقامة."],
  ["admission", "القبول", "إجراءات القبول والتقييم الأولي للانضمام لبرامجنا."],
  ["outpatient-followup", "العلاج الخارجي – المتابعة",
   "جلسات متابعة وعلاج خارجي متقدمة لدعم التعافي المستمر."],
  ["awareness", "التوعية والتدريب",
   "ورش عمل ومحاضرات في المدارس والجامعات لنشر الوعي."],
] as const;

const EVENTS = [
  ["charity-dinner", "حفل العشاء الخيري", "تموز"],
  ["hope-marathon", "ماراثون الأمل", "آب"],
  ["youth-workshop", "ورشة توعية للشباب", "أيلول"],
  ["recovery-art", "معرض فن التعافي", "تشرين أول"],
  ["yoga-day", "يوم اليوغا والتأمل", "تشرين ثاني"],
  ["food-festival", "مهرجان الطعام", "كانون أول"],
] as const;

async function isEmpty(name: string) {
  const snap = await getDocs(query(collection(db(), name), limit(1)));
  return snap.empty;
}

export type SeedReport = Record<string, number | "skipped">;

export async function seedContent(): Promise<SeedReport> {
  const report: SeedReport = {};
  const batch = writeBatch(db());

  if (await isEmpty("products")) {
    PRODUCTS.forEach(([slug, titleAr, descriptionAr, priceCents], i) => {
      batch.set(doc(collection(db(), "products")), {
        slug, titleAr, descriptionAr,
        priceCents, currency: "USD", stock: 25,
        status: "published", sortOrder: i,
        image: `/sections/product-${i + 1}.svg`,
      });
    });
    report.products = PRODUCTS.length;
  } else report.products = "skipped";

  if (await isEmpty("faqs")) {
    FAQS.forEach(([questionAr, answerAr], i) => {
      batch.set(doc(collection(db(), "faqs")), {
        questionAr, answerAr, status: "published", sortOrder: i,
      });
    });
    report.faqs = FAQS.length;
  } else report.faqs = "skipped";

  if (await isEmpty("programs")) {
    PROGRAMS.forEach(([slug, titleAr, summaryAr], i) => {
      batch.set(doc(collection(db(), "programs")), {
        slug, titleAr, summaryAr, status: "published", sortOrder: i,
        image: `/sections/programme-${i + 1}.svg`,
      });
    });
    report.programs = PROGRAMS.length;
  } else report.programs = "skipped";

  if (await isEmpty("events")) {
    EVENTS.forEach(([slug, titleAr, summaryAr], i) => {
      batch.set(doc(collection(db(), "events")), {
        slug, titleAr, summaryAr, status: "published", sortOrder: i,
        image: `/sections/event-${i + 1}.svg`,
      });
    });
    report.events = EVENTS.length;
  } else report.events = "skipped";

  if (await isEmpty("siteSettings")) {
    batch.set(doc(db(), "siteSettings", "main"), {
      phone: "+961 1 234 567",
      helplineAr: "خط المساعدة – متاح 24/7",
      helplineNoteAr: "لا تتردد في الاتصال بنا. الاستشارة مجانية وسرية.",
    });
    report.siteSettings = 1;
  } else report.siteSettings = "skipped";

  await batch.commit();
  return report;
}
