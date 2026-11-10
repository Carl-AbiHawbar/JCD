import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import InnerPageView from "@/components/page/InnerPageView";
import styles from "@/components/page/page.module.css";
import { currentLocale } from "@/lib/i18n";
import { programme, programmeHelp, programmes } from "@/lib/pages";

export async function generateMetadata({
  params,
}: PageProps<"/programmes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = programme(await currentLocale(), slug);
  return page ? { title: page.title, description: page.summary } : {};
}

export default async function ProgrammePage({
  params,
}: PageProps<"/programmes/[slug]">) {
  const { slug } = await params;
  const locale = await currentLocale();
  const page = programme(locale, slug);
  if (!page) notFound();

  const others = programmes(locale).filter((p) => p.slug !== slug);

  return (
    <InnerPageView
      page={page}
      locale={locale}
      cta={programmeHelp(locale)}
      trail={[
        { label: locale === "ar" ? "الرئيسية" : "Home", href: "/" },
        { label: locale === "ar" ? "برامجنا" : "Programmes", href: "/#programmes" },
        { label: page.title, href: `/programmes/${page.slug}` },
      ]}
      aside={
        <nav className={styles.siblings} aria-labelledby="other-programmes">
          <h2 className={styles.blockHeading} id="other-programmes">
            {locale === "ar" ? "برامجنا الأخرى" : "Our other programmes"}
          </h2>
          <ul className={styles.siblingList}>
            {others.map((p) => (
              <li key={p.slug}>
                <Link className={styles.sibling} href={`/programmes/${p.slug}`}>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      }
    />
  );
}
