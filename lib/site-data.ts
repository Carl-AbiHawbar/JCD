import "server-only";

import type { ShopProduct } from "@/components/sections/ShopGrid";
import { listPublished } from "./firebase/rest";
import type { Faq, Product, SiteEvent } from "./firebase/types";
import type { Locale } from "./i18n";
import { getSections, type Section } from "./sections";

/**
 * Loads the parts of the home page that the dashboard manages and folds them
 * into the static composition in lib/sections.ts.
 *
 * The static file stays the source of truth for layout, ordering and band
 * colours; only the *content* of the shop, activities and FAQ bands is
 * replaced, and only when Firestore actually returns rows. An empty or
 * unreachable database therefore leaves the page exactly as designed rather
 * than blank.
 *
 * The programme cards are not replaced: each now opens its own page
 * (lib/pages.ts), and a row from the dashboard would have nowhere to link.
 */

const MONTHS_AR = [
  "كانون ثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران",
  "تموز", "آب", "أيلول", "تشرين أول", "تشرين ثاني", "كانون أول",
];

export type SiteData = {
  sections: Section[];
  shopProducts: ShopProduct[];
};

export async function loadSiteData(locale: Locale): Promise<SiteData> {
  const staticSections = getSections(locale);

  const [products, faqs, events] = await Promise.all([
    listPublished<Product>("products"),
    listPublished<Faq>("faqs"),
    listPublished<SiteEvent>("events"),
  ]);

  const shopProducts: ShopProduct[] = products.map((p, i) => ({
    id: p.id,
    slug: p.slug,
    title: p.titleAr,
    priceCents: p.priceCents,
    currency: p.currency ?? "USD",
    // Products without their own artwork fall back to the generated tile that
    // matches their position in the grid.
    image: p.image ?? (i < 9 ? `/sections/product-${i + 1}.svg` : null),
    stock: p.stock ?? 0,
  }));

  const sections = staticSections.map<Section>((section) => {
    if (section.kind === "accordion" && section.id === "faq") {
      const items = faqs.map((f) => ({
        question: f.questionAr,
        answer: f.answerAr,
      }));
      return items.length > 0 ? { ...section, items } : section;
    }

    if (section.kind === "cardGrid" && section.id === "activities") {
      // JCD asked for three activities on the homepage, no more.
      const cards = events.slice(0, 3).map((e, i) => ({
        // The mockup shows the month above each event title.
        meta:
          e.summaryAr ??
          (e.startsAt ? MONTHS_AR[new Date(e.startsAt).getMonth()] : undefined),
        title: e.titleAr,
        // Rows carry no artwork of their own, so keep the slot's own image
        // rather than blanking it when the database supplies the copy.
        image: e.image ? { src: e.image, alt: e.titleAr } : section.cards[i]?.image ?? null,
      }));
      return cards.length > 0 ? { ...section, cards } : section;
    }

    return section;
  });

  return { sections, shopProducts };
}
