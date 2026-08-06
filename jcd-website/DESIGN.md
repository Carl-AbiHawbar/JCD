# Design notes

Source of truth for the public page: Canva design `DAHLU10UT9c`,
"JCD Organization Website Redesign Mockups".

## What the Canva file actually contains

One page, and that page is a **single flattened 1366×768 raster image** — no
text layers, no separate image layers, one embedded bitmap. Canva offers only
PDF export for it, and the exported PDF has zero extractable text. Every value
below was measured off the bitmap, not read from the design.

That image covers exactly one viewport:

| Band       | Y       | Notes |
|------------|---------|-------|
| Header     | 0–56    | `#828893`, logo + `EN` pill left, 7 nav items right |
| Hero       | 56–594  | full-bleed photo, dark scrim, H1 + sub + CTA, 3 dots |
| Help bar   | 594–684 | `#828893`, copy right, white phone button left |
| Next band  | 684–768 | `#FAF9F7` — only 84px visible before the image ends |

Nothing below y=768 exists in the design, so nothing below it is invented here.
The cream band simply fills the remaining viewport.

## Measured values

Positions are page coordinates at a 1366px viewport.

- `EN` pill: x59–98, y16–39 (40×24), radius 4, `#9B9FA8`
- logo: x112–193, y9–46 (81×38)
- nav: 7 items, ~33px gaps, ink band y24–36, right edge x1291
- H1 ink: x477–886 (410 wide), y257–277
- subtitle ink: x489–866, y292–317
- CTA button: x574–791 (218×53), y348–400, radius 12, label `#4A9E8E`
- dots: centres x660.5 / 682.5 / 704.5 (uniform 22px), active 14px white,
  inactive 10px white at 45%
- help copy right edge: x974; phone button x390–596 (207×48), radius 8
- phone label `#357A6D`

Palette: slate `#828893`, cream `#FAF9F7`, teal `#357A6D`, CTA teal `#40968A`.

## The hero photo

The mockup's hero text and CTA are baked into the bitmap. To make them real
HTML, the photo was cropped out of the mockup and the baked text painted out:
a morphological top-hat isolates the thin bright glyph strokes (a plain
brightness threshold catches the white t-shirts instead), and the CTA button
and dot rectangles are removed wholesale because the re-rendered elements sit
in exactly the same place and cover any residue.

The dark scrim is part of the exported photo, so no overlay is layered on top.

If the original photograph turns up, drop it in as `public/hero-volunteers.jpg`
and the retouching becomes irrelevant.

## Arabic typography — deliberate divergence

The mockup's Arabic runs about 50% wider than any browser will render it.
That is not a font-size or font-choice difference: the design tool applied
letter-spacing to Arabic and stretched the letter joins.

Browsers refuse to do this. `letter-spacing` on cursive script is a no-op in
Chrome — verified directly: with `letter-spacing: 4.4px` computed on a nav
link, the rendered width changed by exactly 0px. The only way to force the
mockup's look would be to inject tatweel (`ـ`) padding characters, which
breaks copy-paste, search, and screen readers, and reads as broken Arabic.

**Decision: render Arabic correctly.** Layout, colours, sizes, and positions
match the mockup to the pixel; Arabic text runs come out narrower. There is
therefore no `letter-spacing` on Arabic anywhere in this project — adding it
back would be dead code.

## Verified fidelity

Measured by diffing a Playwright render at 1366×768 against the mockup bitmap:

- band boundaries 0 / 56 / 594 / 684 — exact
- CTA button x574–791, y348–400 — exact
- phone button 207×48, y615–662 — exact
- H1 within 11px of the mockup's 410px ink width, vertically centred to 0px
- carousel dot centres — exact

Remaining horizontal deltas on text runs are the Arabic width divergence above.
