import Image from "next/image";
import Link from "next/link";

import type {
  AccordionSection,
  Band,
  CardGridSection,
  DonateSection,
  FeatureSection,
  IconCardsSection,
  Img,
  NewsletterSection,
  ProductsSection,
  Section,
  SplitSection,
  StatsSection,
  StepsSection,
} from "@/lib/sections";
import Accordion from "./Accordion";
import DonateForm from "./DonateForm";
import NewsletterForm from "./NewsletterForm";
import ShopGrid, { type ShopProduct } from "./ShopGrid";
import { MailIcon, PersonCheckIcon, SearchIcon } from "./icons";
import styles from "./sections.module.css";

const BAND: Record<Band, string> = {
  cream: styles.cream,
  sand: styles.sand,
  mint: styles.mint,
  dark: styles.dark,
  teal: styles.teal,
};

/** Renders the photo when one is supplied, otherwise leaves the placeholder. */
function Photo({ image, sizes }: { image: Img; sizes: string }) {
  if (!image) return null;
  return <Image src={image.src} alt={image.alt} fill sizes={sizes} />;
}

function Heading({
  text,
  teal,
  gap,
}: {
  text: string;
  teal?: boolean;
  gap?: boolean;
}) {
  const cls = teal ? styles.headingTeal : styles.heading;
  return <h2 className={gap ? `${cls} ${styles.headingGap}` : cls}>{text}</h2>;
}

function Split({ section }: { section: SplitSection }) {
  const left = section.imageSide === "left";
  return (
    <section id={section.id} className={BAND[section.band]}>
      <div className={styles.inner}>
        <div className={styles.split}>
          <div className={left ? styles.mediaLeft : styles.mediaRight}>
            <Photo
              image={section.image}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </div>

          <div className={left ? styles.copyRight : styles.copyLeft}>
            {section.blocks.map((block) => (
              <div className={styles.block} key={block.heading}>
                <h2 className={styles.blockHeading}>{block.heading}</h2>
                {block.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ section }: { section: FeatureSection }) {
  return (
    <section id={section.id} className={BAND[section.band]}>
      <div className={styles.inner}>
        <Heading text={section.heading} teal />
        {section.subheading && (
          <p className={styles.subheading}>{section.subheading}</p>
        )}
        <div className={styles.featureMedia}>
          <Photo image={section.image} sizes="100vw" />
        </div>
      </div>
    </section>
  );
}

function CardGrid({ section }: { section: CardGridSection }) {
  const overlay = section.variant === "overlay";
  return (
    <section id={section.id} className={BAND[section.band]}>
      <div className={styles.inner}>
        <Heading text={section.heading} gap={!section.subheading} />
        {section.subheading && (
          <p className={styles.subheading}>{section.subheading}</p>
        )}

        <div
          className={`${styles.grid} ${
            section.align === "center" ? styles.alignCenter : ""
          }`}
        >
          {section.cards.map((card, i) =>
            overlay ? (
              <article className={styles.overlayCard} key={`${i}-${card.title}`}>
                <Photo
                  image={card.image}
                  sizes="(max-width: 900px) 100vw, 33vw"
                />
                <div className={styles.overlayScrim} />
                <div className={styles.overlayBody}>
                  <h3 className={styles.overlayTitle}>{card.title}</h3>
                  {card.body && (
                    <p className={styles.overlayText}>{card.body}</p>
                  )}
                </div>
              </article>
            ) : (
              <article className={styles.card} key={`${i}-${card.title}`}>
                <div className={styles.cardMedia}>
                  <Photo
                    image={card.image}
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                </div>
                <div className={styles.cardBody}>
                  {card.meta &&
                    (section.metaStyle === "badge" ? (
                      <div>
                        <span className={styles.cardBadge}>{card.meta}</span>
                      </div>
                    ) : (
                      <p className={styles.cardMeta}>{card.meta}</p>
                    ))}
                  <h3
                    className={
                      section.titleTone === "teal"
                        ? styles.cardTitleTeal
                        : styles.cardTitle
                    }
                  >
                    {card.title}
                  </h3>
                  {card.body && <p className={styles.cardText}>{card.body}</p>}
                </div>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function Steps({ section }: { section: StepsSection }) {
  return (
    <section id={section.id} className={BAND[section.band]}>
      <div className={styles.inner}>
        <Heading text={section.heading} teal gap={!section.subheading} />
        {section.subheading && (
          <p className={styles.subheading}>{section.subheading}</p>
        )}

        <ol className={styles.steps}>
          {section.steps.map((step, i) => (
            <li className={styles.step} key={step.title}>
              <span className={styles.stepNumber} aria-hidden="true">
                {i + 1}
              </span>
              <div className={styles.stepCard}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Donate({ section }: { section: DonateSection }) {
  return (
    <section
      id={section.id}
      className={`${BAND[section.band]} ${styles.donate}`}
    >
      <div className={styles.donateMedia}>
        <Photo image={section.image} sizes="100vw" />
      </div>

      <div className={`${styles.inner} ${styles.donateInner}`}>
        <Heading text={section.heading} />
        <p className={styles.subheading}>{section.subheading}</p>

        <DonateForm amounts={section.amounts} cta={section.cta.label} />
      </div>
    </section>
  );
}

function Products({
  section,
  shopProducts,
}: {
  section: ProductsSection;
  shopProducts: ShopProduct[];
}) {
  if (shopProducts.length === 0) return null;

  return (
    <section id={section.id} className={BAND[section.band]}>
      <div className={styles.inner}>
        <Heading text={section.heading} gap={!section.subheading} />
        {section.subheading && (
          <p className={styles.subheading}>{section.subheading}</p>
        )}

        <ShopGrid products={shopProducts} addToCart={section.addToCart} />
      </div>
    </section>
  );
}

function Newsletter({ section }: { section: NewsletterSection }) {
  return (
    <section id={section.id} className={BAND[section.band]}>
      <div className={styles.inner}>
        <div className={styles.newsletter}>
          <span className={styles.newsletterIcon}>
            <MailIcon size={40} />
          </span>
          <h2 className={styles.newsletterHeading}>{section.heading}</h2>

          <NewsletterForm
            placeholder={section.placeholder}
            cta={section.cta}
          />
        </div>
      </div>
    </section>
  );
}

function Stats({ section }: { section: StatsSection }) {
  return (
    <section id={section.id} className={BAND[section.band]}>
      <div className={styles.inner}>
        <div className={styles.stats}>
          {section.stats.map((stat) => (
            <div key={stat.value}>
              <div className={styles.statValue} dir="ltr">
                {stat.value}
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IconCards({ section }: { section: IconCardsSection }) {
  return (
    <section id={section.id} className={BAND[section.band]}>
      <div className={styles.inner}>
        <Heading text={section.heading} gap={!section.subheading} />
        {section.subheading && (
          <p className={styles.subheading}>{section.subheading}</p>
        )}

        <div className={styles.iconCards}>
          {section.cards.map((card) => (
            <Link className={styles.iconCard} href={card.href} key={card.title}>
              <span className={styles.iconCardIcon}>
                {card.icon === "personCheck" ? (
                  <PersonCheckIcon />
                ) : (
                  <SearchIcon />
                )}
              </span>
              <h3 className={styles.iconCardTitle}>{card.title}</h3>
              <p className={styles.iconCardText}>{card.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function AccordionBand({ section }: { section: AccordionSection }) {
  return (
    <section id={section.id} className={BAND[section.band]}>
      <div className={styles.inner}>
        <Heading text={section.heading} teal gap />
        <Accordion items={section.items} />
      </div>
    </section>
  );
}

export default function Sections({
  sections,
  shopProducts,
}: {
  sections: Section[];
  shopProducts: ShopProduct[];
}) {
  return (
    <>
      {sections.map((section) => {
        switch (section.kind) {
          case "split":
            return <Split key={section.id} section={section} />;
          case "feature":
            return <Feature key={section.id} section={section} />;
          case "cardGrid":
            return <CardGrid key={section.id} section={section} />;
          case "steps":
            return <Steps key={section.id} section={section} />;
          case "donate":
            return <Donate key={section.id} section={section} />;
          case "products":
            return (
              <Products
                key={section.id}
                section={section}
                shopProducts={shopProducts}
              />
            );
          case "newsletter":
            return <Newsletter key={section.id} section={section} />;
          case "stats":
            return <Stats key={section.id} section={section} />;
          case "iconCards":
            return <IconCards key={section.id} section={section} />;
          case "accordion":
            return <AccordionBand key={section.id} section={section} />;
        }
      })}
    </>
  );
}
