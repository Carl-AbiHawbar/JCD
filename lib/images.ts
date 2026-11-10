export type Img = { src: string; alt: string } | null;

/**
 * Section imagery, in public/sections.
 *
 * Most slots are photographs sourced under licences that permit reuse; see
 * public/sections/ATTRIBUTION.md. Every one was reviewed before inclusion.
 * They stand in until JCD sends its own photographs of the team, programmes,
 * MCD, the clubs and its activities.
 *
 * The slots not listed in `PHOTOS` deliberately keep an illustrated panel
 * instead: no suitable photograph was found, and for the care sections a
 * photograph of an identifiable person would imply that person is a patient —
 * something an open licence does not grant permission for. Add a file named
 * `<slot>.jpg` and list the slot here to switch it to a photograph.
 */
const PHOTOS = new Set([
  "about", "history", "mission", "partnerships", "team", "achievements",
  "mcd", "service-1", "service-2", "service-3",
  "programme-1", "programme-2", "programme-3", "programme-4", "programme-5",
  "training-1", "training-2", "training-3",
  "event-1", "event-2", "event-3", "event-4", "event-5", "event-6",
  "news-1", "news-2", "news-3",
  "product-1", "product-2", "product-3", "product-4",
  "product-6", "product-7", "product-8", "product-9",
]);

export const img = (name: string, alt: string): Img => ({
  src: `/sections/${name}.${PHOTOS.has(name) ? "jpg" : "svg"}`,
  alt,
});
