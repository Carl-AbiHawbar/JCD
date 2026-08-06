import { footer } from "@/lib/content";
import {
  MailIcon,
  PhoneIcon,
  PinIcon,
  WhatsappIcon,
} from "./sections/icons";
import styles from "./SiteFooter.module.css";

const ICONS = {
  phone: PhoneIcon,
  whatsapp: WhatsappIcon,
  mail: MailIcon,
  pin: PinIcon,
};

export default function SiteFooter() {
  return (
    <footer>
      <section className={styles.contact} id="contact">
        <div className={styles.inner}>
          <h2 className={styles.heading}>{footer.heading}</h2>
          <p className={styles.subheading}>{footer.subheading}</p>

          <ul className={styles.cards}>
            {footer.contacts.map((item) => {
              const Icon = ICONS[item.icon];
              return (
                <li key={item.label}>
                  <a className={styles.card} href={item.href}>
                    <span className={styles.icon}>
                      <Icon />
                    </span>
                    <span className={styles.label}>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <div className={styles.copyright}>{footer.copyright}</div>
    </footer>
  );
}
