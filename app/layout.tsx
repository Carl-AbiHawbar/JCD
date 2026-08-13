import type { Metadata } from "next";
import { Tajawal } from "next/font/google";

import { CartProvider } from "@/lib/cart";
import { currentLocale, dir } from "@/lib/i18n";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await currentLocale();

  return locale === "en"
    ? {
        title: "JCD — drug prevention and rehabilitation network",
        description:
          "Would you like to volunteer and serve your community? Find out whether you are ready to join our volunteer team.",
      }
    : {
        title: "الشبكة لمكافحة المخدرات — للوقاية وإعادة التأهيل",
        description:
          "هل ترغب في التطوع وخدمة المجتمع؟ اكتشف إذا كنت مستعداً للانضمام لفريقنا التطوعي.",
      };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Reading the locale here keeps `lang` and `dir` correct on the very first
  // paint, so an English visitor never sees a flash of right-to-left layout.
  const locale = await currentLocale();

  return (
    <html lang={locale} dir={dir(locale)} className={tajawal.variable}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
