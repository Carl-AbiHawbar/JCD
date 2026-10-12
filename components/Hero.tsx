"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { heroInterval } from "@/lib/content";
import styles from "./Hero.module.css";

type Slide = {
  /** Shown under the video while it loads, and in its place when motion is reduced. */
  image: string;
  imageAlt: string;
  /** When set the slide is this video, which carries its own copy. */
  video?: string;
  heading?: string;
  subheading?: string;
  cta?: string;
  ctaHref?: string;
  /** How long this slide is held; the shared interval when unset. */
  holdMs?: number;
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

  // Autoplaying footage is the thing a visitor who asks for less motion is
  // asking to be spared, so those slides fall back to their still.
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const go = useCallback((next: number) => {
    setIndex(((next % heroSlides.length) + heroSlides.length) % heroSlides.length);
  }, []);

  // Auto-advance, unless the visitor is interacting or prefers reduced motion.
  useEffect(() => {
    if (paused || heroSlides.length < 2 || reduceMotion) return;

    timer.current = window.setTimeout(
      () => setIndex((i) => (i + 1) % heroSlides.length),
      heroSlides[index].holdMs ?? heroInterval,
    );
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [index, paused, reduceMotion]);

  // A video plays only while its own slide is up, and from the beginning each
  // time it comes round, so the animation is never joined halfway.
  const videos = useRef(new Map<number, HTMLVideoElement>());
  useEffect(() => {
    for (const [i, el] of videos.current) {
      if (i === index) {
        el.currentTime = 0;
        void el.play().catch(() => {
          /* a browser that refuses autoplay leaves the poster up */
        });
      } else {
        el.pause();
      }
    }
  }, [index, reduceMotion]);

  function onKeyDown(event: React.KeyboardEvent) {
    // In RTL, ArrowLeft moves forward through the slides.
    if (event.key === "ArrowLeft") go(index + 1);
    if (event.key === "ArrowRight") go(index - 1);
  }

  const allArtwork = heroSlides.every((slide) => slide.video);

  return (
    <section
      className={[styles.hero, allArtwork ? styles.heroArtwork : ""].join(" ")}
      aria-roledescription="carousel"
      aria-label={carouselLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={onKeyDown}
    >
      {heroSlides.map((slide, i) => {
        const isArtwork = Boolean(slide.video);
        const active = i === index;

        return (
          <div
            key={slide.image}
            className={[
              active ? styles.slideActive : styles.slide,
              isArtwork ? styles.artworkSlide : "",
            ].join(" ")}
            aria-hidden={!active}
            // Slides out of view must not be reachable by keyboard.
            inert={!active}
          >
            {slide.video && !reduceMotion ? (
              <video
                className={styles.artwork}
                ref={(el) => {
                  if (el) videos.current.set(i, el);
                  else videos.current.delete(i);
                }}
                src={slide.video}
                poster={slide.image}
                aria-label={slide.imageAlt}
                muted
                loop
                playsInline
                preload={i === 0 ? "auto" : "metadata"}
              />
            ) : (
              <Image
                className={isArtwork ? styles.artwork : styles.photo}
                src={slide.image}
                alt={slide.imageAlt}
                fill
                sizes="100vw"
                priority={i === 0}
              />
            )}

            {/* An artwork slide is pale and carries its own wording, so the
                scrim and the overlaid copy would only fight it. */}
            {!isArtwork && (
              <>
                {/* Slide one's photograph came out of the mockup with a scrim
                    baked in; the others are plain photographs. This darkens
                    every slide so the white headline stays legible whatever
                    image is dropped in. */}
                <div className={styles.scrim} />

                <div className={styles.content}>
                  <h1 className={styles.heading}>{slide.heading}</h1>
                  <p className={styles.subheading}>{slide.subheading}</p>
                  <Link className={styles.cta} href={slide.ctaHref ?? "#"}>
                    {slide.cta}
                  </Link>
                </div>
              </>
            )}
          </div>
        );
      })}

      {heroSlides.length > 1 && (
        <div
          className={[
            styles.dots,
            heroSlides[index].video ? styles.dotsOnLight : "",
          ].join(" ")}
          role="tablist"
          aria-label={carouselLabel}
        >
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
