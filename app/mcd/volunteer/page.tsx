import type { Metadata } from "next";

import FormPage from "@/components/forms/FormPage";
import { formSchema } from "@/lib/forms";
import { currentLocale } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const schema = formSchema("mcd", await currentLocale());
  return { title: schema.eyebrow, description: schema.title };
}

export default async function McdVolunteerPage() {
  const locale = await currentLocale();
  const ar = locale === "ar";

  return (
    <FormPage
      id="mcd"
      locale={locale}
      trail={[
        { label: ar ? "الرئيسية" : "Home", href: "/" },
        { label: "MCD", href: "/mcd" },
        { label: formSchema("mcd", locale).eyebrow, href: "/mcd/volunteer" },
      ]}
    />
  );
}
