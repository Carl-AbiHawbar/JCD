import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import HelpBar from "@/components/HelpBar";
import Sections from "@/components/sections/Sections";
import SiteFooter from "@/components/SiteFooter";
import { loadSiteData } from "@/lib/site-data";
import styles from "./page.module.css";

// Shop stock, programmes, events and FAQs are editable in the dashboard, so
// the page is rendered per request rather than cached at build time.
export const dynamic = "force-dynamic";

export default async function Home() {
  const { sections, shopProducts } = await loadSiteData();

  return (
    <>
      <SiteHeader />
      <main className={styles.main}>
        <Hero />
        <HelpBar />
        {/* Layout comes from lib/sections.ts; the shop, programmes, events and
            FAQ bands take their content from the database when it has rows. */}
        <Sections sections={sections} shopProducts={shopProducts} />
      </main>
      <SiteFooter />
    </>
  );
}
