import type { Metadata } from "next";

import FormPage from "@/components/forms/FormPage";
import { formSchema } from "@/lib/forms";
import { currentLocale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const schema = formSchema("jcd", await currentLocale());
  return { title: schema.eyebrow, description: schema.title };
}

export default async function VolunteerReadinessPage() {
  const locale = await currentLocale();
  const ar = locale === "ar";

  return (
    <FormPage
      id="jcd"
      locale={locale}
      trail={[
        { label: ar ? "الرئيسية" : "Home", href: "/" },
        { label: "JCD Club", href: "/jcd-club" },
        { label: formSchema("jcd", locale).eyebrow, href: "/volunteer-readiness" },
      ]}
    />
  );
}
