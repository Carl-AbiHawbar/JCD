"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { heroInterval, heroSlides } from "@/lib/content";
import styles from "./Hero.module.css";

export default function Hero() {
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
      aria-label="عروض الصفحة الرئيسية"
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
        <div className={styles.dots} role="tablist" aria-label="شرائح العرض">
          {heroSlides.map((slide, i) => (
            <button
              key={slide.image}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`الشريحة ${i + 1}`}
              className={i === index ? styles.dotActive : styles.dot}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
