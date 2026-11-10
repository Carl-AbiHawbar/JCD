import Image from "next/image";
import Link from "next/link";

import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import TalkToNour from "@/components/TalkToNour";
import { PinIcon } from "@/components/sections/icons";
import { nourEnabled } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import type { Action, Block, InnerPage } from "@/lib/pages";
import styles from "./page.module.css";

/**
 * Header, footer and the floating buttons around an inner page's content, so
 * every page outside the homepage is framed the same way.
 */
export function PageShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader locale={locale} />
      <main className={styles.main}>{children}</main>
      <SiteFooter locale={locale} />
      {nourEnabled && <TalkToNour locale={locale} />}
    </>
  );
}

export function Crumbs({ trail }: { trail: Action[] }) {
  return (
    <nav className={styles.crumbs} aria-label="breadcrumb">
      <ol>
        {trail.map((step, i) =>
          i < trail.length - 1 ? (
            <li key={step.href}>
              <Link href={step.href}>{step.label}</Link>
            </li>
          ) : (
            <li key={step.href} aria-current="page">
              {step.label}
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}

function BlockView({ block, locale }: { block: Block; locale: Locale }) {
  switch (block.kind) {
    case "paragraphs":
      return (
        <section className={styles.block}>
          {block.heading && <h2 className={styles.blockHeading}>{block.heading}</h2>}
          {block.paragraphs.map((p, i) => (
            <p className={styles.paragraph} key={i}>
              {p}
            </p>
          ))}
        </section>
      );

    case "list": {
      const List = block.numbered ? "ol" : "ul";
      return (
        <section className={styles.block}>
          <h2 className={styles.blockHeading}>{block.heading}</h2>
          {block.intro && <p className={styles.paragraph}>{block.intro}</p>}
          <List className={block.numbered ? styles.numbered : styles.bullets}>
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </List>
        </section>
      );
    }

    case "place":
      return (
        <section className={styles.place}>
          <span className={styles.placeIcon}>
            <PinIcon />
          </span>
          <div>
            <h2 className={styles.placeHeading}>{block.heading}</h2>
            {block.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </section>
      );

    case "team":
      return (
        <section className={styles.block}>
          <h2 className={styles.blockHeading}>{block.heading}</h2>
          <div className={styles.team}>
            {block.groups.map((group) => (
              <figure className={styles.teamGroup} key={group.title}>
                <div className={styles.teamPhoto}>
                  {group.image ? (
                    <Image
                      src={group.image.src}
                      alt={group.image.alt}
                      fill
                      sizes="(max-width: 760px) 100vw, 380px"
                    />
                  ) : (
                    <span className={styles.photoSoon}>
                      {locale === "ar" ? "الصورة قريبًا" : "Photo coming soon"}
                    </span>
                  )}
                </div>
                <figcaption className={styles.teamCaption}>{group.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      );

    case "links":
      return (
        <section className={styles.block}>
          <h2 className={styles.blockHeading}>{block.heading}</h2>
          <div className={styles.linkCards}>
            {block.items.map((item) => {
              const body = (
                <>
                  <h3 className={styles.linkTitle}>{item.title}</h3>
                  <p className={styles.linkBody}>{item.body}</p>
                </>
              );
              return item.href ? (
                <Link className={styles.linkCard} href={item.href} key={item.title}>
                  {body}
                </Link>
              ) : (
                <div className={styles.linkCardStatic} key={item.title}>
                  {body}
                </div>
              );
            })}
          </div>
        </section>
      );
  }
}

/** One inner page: its hero, its content blocks, and the closing call to action. */
export default function InnerPageView({
  page,
  locale,
  trail,
  cta = page.cta,
  aside,
}: {
  page: InnerPage;
  locale: Locale;
  trail: Action[];
  cta?: InnerPage["cta"];
  /** Rendered after the blocks, e.g. links to the other programmes. */
  aside?: React.ReactNode;
}) {
  return (
    <PageShell locale={locale}>
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <Crumbs trail={trail} />
            {page.eyebrow && <p className={styles.eyebrow}>{page.eyebrow}</p>}
            <h1 className={styles.title}>{page.title}</h1>
            {page.tagline && <p className={styles.tagline}>{page.tagline}</p>}
            <p className={styles.summary}>{page.summary}</p>
          </div>
          <div className={styles.heroMedia}>
            {page.image && (
              <Image
                src={page.image.src}
                alt={page.image.alt}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            )}
          </div>
        </div>
      </header>

      <div className={styles.body}>
        {page.blocks.map((block, i) => (
          <BlockView block={block} locale={locale} key={i} />
        ))}
        {aside}
      </div>

      {cta && (
        <section className={styles.cta}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaHeading}>{cta.heading}</h2>
            {cta.body && <p className={styles.ctaBody}>{cta.body}</p>}
            <div className={styles.ctaActions}>
              {cta.actions.map((action, i) => (
                <Link
                  className={i === 0 ? styles.ctaPrimary : styles.ctaSecondary}
                  href={action.href}
                  key={action.href}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageShell>
  );
}
