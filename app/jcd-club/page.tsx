import type { Metadata } from "next";

import InnerPageView from "@/components/page/InnerPageView";
import { currentLocale } from "@/lib/i18n";
import { clubPage } from "@/lib/pages";

export async function generateMetadata(): Promise<Metadata> {
  const page = clubPage(await currentLocale());
  return { title: page.title, description: page.summary };
}

export default async function ClubPage() {
  const locale = await currentLocale();
  const page = clubPage(locale);

  return (
    <InnerPageView
      page={page}
      locale={locale}
      trail={[
        { label: locale === "ar" ? "الرئيسية" : "Home", href: "/" },
        { label: page.title, href: "/jcd-club" },
      ]}
    />
  );
}
