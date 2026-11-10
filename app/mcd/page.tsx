import type { Metadata } from "next";

import InnerPageView from "@/components/page/InnerPageView";
import { currentLocale } from "@/lib/i18n";
import { mcdPage } from "@/lib/pages";

export async function generateMetadata(): Promise<Metadata> {
  const page = mcdPage(await currentLocale());
  return { title: `${page.title} — ${page.eyebrow}`, description: page.summary };
}

export default async function McdPage() {
  const locale = await currentLocale();
  const page = mcdPage(locale);

  return (
    <InnerPageView
      page={page}
      locale={locale}
      trail={[
        { label: locale === "ar" ? "الرئيسية" : "Home", href: "/" },
        { label: page.title, href: "/mcd" },
      ]}
    />
  );
}
