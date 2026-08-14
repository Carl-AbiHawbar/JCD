import type { Metadata } from "next";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { contentFor } from "@/lib/content";
import { currentLocale } from "@/lib/i18n";
import AccountView from "./AccountView";
import styles from "./account.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await currentLocale();
  return {
    title: contentFor(locale).accountUi.title,
    // A personal area has nothing to offer a search engine.
    robots: { index: false, follow: false },
  };
}

export default async function AccountPage() {
  const locale = await currentLocale();
  const { accountUi } = contentFor(locale);

  return (
    <>
      <SiteHeader locale={locale} />
      <main className={styles.page}>
        <div className={styles.inner}>
          <h1 className={styles.heading}>{accountUi.title}</h1>
          <AccountView t={accountUi} />
        </div>
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
