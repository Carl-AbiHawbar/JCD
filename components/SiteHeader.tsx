import Image from "next/image";

import { contentFor, shopEnabled } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import lockupEn from "@/public/logos/jcd-fr-white.png";
import mark from "@/public/logos/jcd-mark-white.png";
import AccountLink from "./AccountLink";
import CartLink from "./CartLink";
import LanguageToggle from "./LanguageToggle";
import MobileNav from "./MobileNav";
import styles from "./SiteHeader.module.css";

export default function SiteHeader({ locale }: { locale: Locale }) {
  const { nav, brand, languageToggle } = contentFor(locale);

  return (
    <header className={styles.header}>
      {/* Nav comes first in the DOM so that, in an RTL document, it lands on
          the right and the brand group on the left — as in the mockup. */}
      <nav className={styles.nav} aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main navigation"}>
        <ul className={styles.navList}>
          {nav.map((item) => (
            <li key={item.href}>
              <a className={styles.navLink} href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <MobileNav items={nav} locale={locale} />
      </nav>

      <div className={styles.brandGroup}>
        {shopEnabled && <CartLink locale={locale} />}
        <AccountLink locale={locale} />
        <LanguageToggle
          label={languageToggle}
          next={locale === "ar" ? "en" : "ar"}
        />
        {/* Each language gets JCD's own lockup, reversed for the grey bar
            (black ink turned white, the red kept) and without its tagline
            line, which is too small to read at header size.

            English: JCD's "jeunesse contre la drogue" artwork.
            Arabic: the jCD mark from JCD's artwork beside the name set as
            real text — the only Arabic logo file was a small image with its
            grey ground baked in, too soft to enlarge. */}
        <a className={styles.brand} href={brand.href} aria-label={brand.alt}>
          {locale === "en" ? (
            <Image className={styles.lockup} src={lockupEn} alt="" sizes="170px" priority />
          ) : (
            <>
              <Image className={styles.mark} src={mark} alt="" sizes="80px" priority />
              <span className={styles.wordmark} lang="ar" dir="rtl" aria-hidden="true">
                <span>الشبيبة</span>
                <span>لمكافحة</span>
                <span>المخدّرات</span>
              </span>
            </>
          )}
        </a>
      </div>
    </header>
  );
}
