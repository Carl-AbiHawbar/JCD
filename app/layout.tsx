import type { Metadata } from "next";
import { Tajawal } from "next/font/google";

import { CartProvider } from "@/lib/cart";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "الشبكة لمكافحة المخدرات — للوقاية وإعادة التأهيل",
  description:
    "هل ترغب في التطوع وخدمة المجتمع؟ اكتشف إذا كنت مستعداً للانضمام لفريقنا التطوعي.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
