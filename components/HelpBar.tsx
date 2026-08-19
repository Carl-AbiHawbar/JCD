import { displayPhone, telHref } from "@/lib/format";
import type { Locale } from "@/lib/i18n";
import styles from "./HelpBar.module.css";

type HelpBarContent = {
  heading: string;
  subheading: string;
  phone: string;
};

function PhoneIcon() {
  return (
    <svg
      className={styles.phoneIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

export default function HelpBar({
  helpBar,
  locale,
}: {
  helpBar: HelpBarContent;
  locale: Locale;
}) {
  return (
    <section className={styles.bar}>
      <div className={styles.inner}>
        <div className={styles.text}>
          <p className={styles.heading}>{helpBar.heading}</p>
          <p className={styles.subheading}>{helpBar.subheading}</p>
        </div>

        <a className={styles.phone} href={telHref(helpBar.phone)}>
          <PhoneIcon />
          {/* A phone number reads left-to-right even on an RTL page. */}
          <span className={styles.phoneLabel} dir="ltr">
            {displayPhone(helpBar.phone, locale)}
          </span>
        </a>
      </div>
    </section>
  );
}
