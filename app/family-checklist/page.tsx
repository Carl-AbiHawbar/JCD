import type { Metadata } from "next";

import FamilyChecklist from "@/components/checklist/FamilyChecklist";
import styles from "@/components/checklist/checklist.module.css";
import { Crumbs, PageShell } from "@/components/page/InnerPageView";
import { checklist } from "@/lib/checklist";
import { jcdPhone } from "@/lib/content";
import { telHref, whatsappHref } from "@/lib/format";
import { currentLocale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const list = checklist(await currentLocale());
  return { title: list.title, description: list.disclaimer };
}

export default async function FamilyChecklistPage() {
  const locale = await currentLocale();
  const list = checklist(locale);

  return (
    <PageShell locale={locale}>
      <div className={styles.page}>
        <div className={styles.inner}>
          <Crumbs
            trail={[
              { label: locale === "ar" ? "الرئيسية" : "Home", href: "/" },
              { label: list.title, href: "/family-checklist" },
            ]}
          />
          <header className={styles.intro}>
            <h1 className={styles.title}>{list.title}</h1>
            <p className={styles.lead}>{list.lead}</p>
            <p className={styles.disclaimer}>{list.disclaimer}</p>
          </header>
          <FamilyChecklist
            list={list}
            callHref={telHref(jcdPhone)}
            whatsappHref={whatsappHref(jcdPhone)}
          />
        </div>
      </div>
    </PageShell>
  );
}
