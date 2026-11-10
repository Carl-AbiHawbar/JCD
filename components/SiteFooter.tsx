import { contentFor } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
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

export default function SiteFooter({ locale }: { locale: Locale }) {
  const { footer } = contentFor(locale);

  return (
    <footer>
      <section className={styles.contact} id="contact">
        <div className={styles.inner}>
          <h2 className={styles.heading}>{footer.heading}</h2>
          <p className={styles.subheading}>{footer.subheading}</p>

          <ul className={styles.cards}>
            {footer.contacts.map((card) => {
              const Icon = ICONS[card.icon];
              return (
                <li className={styles.card} key={card.title}>
                  <span className={styles.icon}>
                    <Icon />
                  </span>
                  <h3 className={styles.title}>{card.title}</h3>
                  <ul className={styles.lines}>
                    {card.lines.map((line) => (
                      <li key={line.text}>
                        {line.href ? (
                          <a
                            className={styles.link}
                            href={line.href}
                            dir={line.ltr ? "ltr" : undefined}
                            // Map searches belong in their own tab.
                            {...(line.href.startsWith("http")
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                          >
                            {line.text}
                          </a>
                        ) : (
                          <span dir={line.ltr ? "ltr" : undefined}>
                            {line.text}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
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
