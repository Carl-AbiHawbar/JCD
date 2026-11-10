import type { Metadata } from "next";
import { Tajawal } from "next/font/google";

import WhatsAppButton from "@/components/WhatsAppButton";
import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/lib/firebase/auth";
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
        title: { default: "JCD — Youth Against Drugs", template: "%s — JCD" },
        description:
          "A Lebanese non-profit fighting addiction since 1994: rehabilitation, awareness, training and family support.",
      }
    : {
        title: { default: "الشبيبة لمكافحة المخدّرات — JCD", template: "%s — JCD" },
        description:
          "جمعية لبنانية لا تبغي الربح تكافح الإدمان منذ 1994: إعادة التأهيل والتوعية والتدريب ودعم العائلات.",
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
        {/* Auth wraps the whole site, not just the dashboard: shoppers sign in
            on the public pages too, and the header reflects their session. */}
        <AuthProvider>
          <CartProvider>
            {children}
            {/* Mounted here rather than per page so it is on every route. */}
            <WhatsAppButton locale={locale} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
