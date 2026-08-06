import Image from "next/image";
import logo from "@/public/jcd-logo.png";
import CartLink from "./CartLink";
import MobileNav from "./MobileNav";
import { brand, languageToggle, nav } from "@/lib/content";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  return (
    <header className={styles.header}>
      {/* Nav comes first in the DOM so that, in an RTL document, it lands on
          the right and the brand group on the left — as in the mockup. */}
      <nav className={styles.nav} aria-label="التنقل الرئيسي">
        <ul className={styles.navList}>
          {nav.map((item) => (
            <li key={item.label}>
              <a className={styles.navLink} href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <MobileNav />
      </nav>

      <div className={styles.brandGroup}>
        <CartLink />
        <button className={styles.langToggle} type="button" lang="en">
          {languageToggle}
        </button>
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
