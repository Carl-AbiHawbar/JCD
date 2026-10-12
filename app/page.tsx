import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import HelpBar from "@/components/HelpBar";
import Sections from "@/components/sections/Sections";
import SiteFooter from "@/components/SiteFooter";
import TalkToNour from "@/components/TalkToNour";
import { contentFor, nourEnabled, shopEnabled } from "@/lib/content";
import { currentLocale } from "@/lib/i18n";
import { loadSiteData } from "@/lib/site-data";
import styles from "./page.module.css";

// Shop stock, programmes, events and FAQs are editable in the dashboard, and
// the language comes from a cookie, so this renders per request.
export const dynamic = "force-dynamic";

export default async function Home() {
  const locale = await currentLocale();
  const { brand, heroSlides, helpBar } = contentFor(locale);
  const { sections, shopProducts } = await loadSiteData(locale);
  // The shop band is withheld entirely while the shop is switched off.
  const visible = shopEnabled
    ? sections
    : sections.filter((section) => section.kind !== "products");

  return (
    <>
      <SiteHeader locale={locale} />
      <main className={styles.main}>
        {/* The hero is artwork now, so the page's heading is carried here. */}
        <h1 className="srOnly">{brand.alt}</h1>
        <Hero
          slides={heroSlides}
          carouselLabel={locale === "ar" ? "شرائح العرض" : "Highlights"}
          slideLabel={locale === "ar" ? "الشريحة" : "Slide"}
        />
        <HelpBar helpBar={helpBar} locale={locale} />
        {/* Layout comes from lib/sections.ts; the shop, programmes, events and
            FAQ bands take their content from Firestore when it has rows. */}
        <Sections
          sections={visible}
          shopProducts={shopProducts}
          locale={locale}
        />
      </main>
      <SiteFooter locale={locale} />
      {nourEnabled && <TalkToNour locale={locale} />}
    </>
  );
}
