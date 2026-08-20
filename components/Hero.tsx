"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { heroInterval } from "@/lib/content";
import styles from "./Hero.module.css";

type Slide = {
  image: string;
  imageAlt: string;
  heading: string;
  subheading: string;
  cta: string;
  ctaHref: string;
};

export default function Hero({
  slides: heroSlides,
  carouselLabel,
  slideLabel,
}: {
  slides: readonly Slide[];
  carouselLabel: string;
  /** Prefixed to the slide number; a function prop cannot cross this boundary. */
  slideLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  const go = useCallback((next: number) => {
    setIndex(((next % heroSlides.length) + heroSlides.length) % heroSlides.length);
  }, []);

  // Auto-advance, unless the visitor is interacting or prefers reduced motion.
  useEffect(() => {
    if (paused || heroSlides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    timer.current = window.setTimeout(
      () => setIndex((i) => (i + 1) % heroSlides.length),
      heroInterval,
    );
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [index, paused]);

  function onKeyDown(event: React.KeyboardEvent) {
    // In RTL, ArrowLeft moves forward through the slides.
    if (event.key === "ArrowLeft") go(index + 1);
    if (event.key === "ArrowRight") go(index - 1);
  }

  return (
    <section
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label={carouselLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={onKeyDown}
    >
      {heroSlides.map((slide, i) => (
        <div
          key={slide.image}
          className={i === index ? styles.slideActive : styles.slide}
          aria-hidden={i !== index}
          // Slides out of view must not be reachable by keyboard.
          inert={i !== index}
        >
          <Image
            className={styles.photo}
            src={slide.image}
            alt={slide.imageAlt}
            fill
            sizes="100vw"
            priority={i === 0}
          />

          {/* Slide one's photograph came out of the mockup with a scrim baked
              in; the others are plain photographs. This darkens every slide so
              the white headline stays legible whatever image is dropped in. */}
          <div className={styles.scrim} />

          <div className={styles.content}>
            <h1 className={styles.heading}>{slide.heading}</h1>
            <p className={styles.subheading}>{slide.subheading}</p>
            <Link className={styles.cta} href={slide.ctaHref}>
              {slide.cta}
            </Link>
          </div>
        </div>
      ))}

      {heroSlides.length > 1 && (
        <div className={styles.dots} role="tablist" aria-label={carouselLabel}>
          {heroSlides.map((slide, i) => (
            <button
              key={slide.image}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${slideLabel} ${i + 1}`}
              className={i === index ? styles.dotActive : styles.dot}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
