import type { Metadata } from "next";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { contentFor } from "@/lib/content";
import { currentLocale } from "@/lib/i18n";
import CartView from "./CartView";
import styles from "./cart.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await currentLocale();
  return { title: contentFor(locale).shopUi.cartTitle };
}

export default async function CartPage() {
  const locale = await currentLocale();
  const { shopUi } = contentFor(locale);

  return (
    <>
      <SiteHeader locale={locale} />
      <main className={styles.page}>
        <div className={styles.inner}>
          <h1 className={styles.heading}>{shopUi.cartTitle}</h1>
          <CartView t={shopUi} locale={locale} />
        </div>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
