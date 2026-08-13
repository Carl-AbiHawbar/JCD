import Image from "next/image";

import { contentFor } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import logo from "@/public/jcd-logo.png";
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
        <CartLink locale={locale} />
        <LanguageToggle
          label={languageToggle}
          next={locale === "ar" ? "en" : "ar"}
        />
        <a className={styles.brand} href={brand.href}>
          <Image
            className={styles.logo}
            src={logo}
            alt={brand.alt}
            width={81}
            height={38}
            priority
          />
        </a>
      </div>
    </header>
  );
}
