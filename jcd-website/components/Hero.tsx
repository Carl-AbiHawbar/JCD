import Image from "next/image";
import Link from "next/link";
import heroImage from "@/public/hero-volunteers.jpg";
import { hero } from "@/lib/content";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <Image
        className={styles.photo}
        src={heroImage}
        alt={hero.imageAlt}
        fill
        sizes="100vw"
        priority
      />

      <div className={styles.content}>
        <h1 className={styles.heading}>{hero.heading}</h1>
        <p className={styles.subheading}>{hero.subheading}</p>
        <Link className={styles.cta} href={hero.ctaHref}>
          {hero.cta}
        </Link>
      </div>

      <div className={styles.dots} role="tablist" aria-label="شرائح العرض">
        {Array.from({ length: hero.slideCount }, (_, i) => (
          <span
            key={i}
            role="tab"
            aria-selected={i === hero.activeSlide}
            aria-label={`الشريحة ${i + 1}`}
            className={i === hero.activeSlide ? styles.dotActive : styles.dot}
          />
        ))}
      </div>
    </section>
  );
}
