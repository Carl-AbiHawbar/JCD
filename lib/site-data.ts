import "server-only";

import type { ShopProduct } from "@/components/sections/ShopGrid";
import { sections as staticSections, type Section } from "./sections";
import { isSupabaseConfigured } from "./supabase/env";
import { createSupabaseServerClient } from "./supabase/server";

/**
 * Loads the parts of the home page that the admin dashboard manages, and
 * folds them into the static composition in lib/sections.ts.
 *
 * The static file remains the source of truth for layout, ordering and band
 * colours. Only the *content* of the shop, programmes, events and FAQ bands is
 * replaced, and only when the database actually returns rows — so an empty or
 * unreachable database leaves the page exactly as designed rather than blank.
 */

const MONTHS_AR = [
  "كانون ثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران",
  "تموز", "آب", "أيلول", "تشرين أول", "تشرين ثاني", "كانون أول",
];

export type SiteData = {
  sections: Section[];
  shopProducts: ShopProduct[];
};

export async function loadSiteData(): Promise<SiteData> {
  if (!isSupabaseConfigured) {
    return { sections: staticSections, shopProducts: [] };
  }

  try {
    const supabase = await createSupabaseServerClient();

    const [products, faqs, events, programs] = await Promise.all([
      supabase
        .from("products")
        .select("id, slug, title_ar, price_cents, currency")
        .eq("status", "published")
        .order("sort_order", { ascending: true }),
      supabase
        .from("faqs")
        .select("question_ar, answer_ar")
        .eq("status", "published")
        .order("sort_order", { ascending: true }),
      supabase
        .from("events")
        .select("title_ar, summary_ar, starts_at")
        .eq("status", "published")
        .order("sort_order", { ascending: true }),
      supabase
        .from("programs")
        .select("title_ar, summary_ar")
        .eq("status", "published")
        .order("sort_order", { ascending: true }),
    ]);

    // Products carry no artwork in the database yet, so each falls back to the
    // generated tile that matches its position in the grid.
    const shopProducts: ShopProduct[] = (products.data ?? []).map((p, i) => ({
      id: p.id,
      slug: p.slug,
      title: p.title_ar,
      priceCents: p.price_cents,
      currency: p.currency,
      image: i < 9 ? `/sections/product-${i + 1}.jpg` : null,
    }));

    const sections = staticSections.map<Section>((section) => {
      if (section.kind === "accordion" && section.id === "faq") {
        const items = (faqs.data ?? []).map((f) => ({
          question: f.question_ar,
          answer: f.answer_ar,
        }));
        return items.length > 0 ? { ...section, items } : section;
      }

      if (section.kind === "cardGrid" && section.id === "events") {
        const cards = (events.data ?? []).map((e, i) => ({
          // The mockup shows the month above each event title.
          meta:
            e.summary_ar ??
            (e.starts_at ? MONTHS_AR[new Date(e.starts_at).getMonth()] : undefined),
          title: e.title_ar,
          // Rows carry no artwork of their own, so keep the slot's own image
          // rather than blanking it when the database supplies the copy.
          image: section.cards[i]?.image ?? null,
        }));
        return cards.length > 0 ? { ...section, cards } : section;
      }

      if (section.kind === "cardGrid" && section.id === "programmes") {
        const cards = (programs.data ?? []).map((p, i) => ({
          title: p.title_ar,
          body: p.summary_ar ?? undefined,
          image: section.cards[i]?.image ?? null,
        }));
        return cards.length > 0 ? { ...section, cards } : section;
      }

      return section;
    });

    return { sections, shopProducts };
  } catch (cause) {
    console.error("Falling back to static sections:", cause);
    return { sections: staticSections, shopProducts: [] };
  }
}
