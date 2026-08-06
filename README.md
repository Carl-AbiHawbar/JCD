# JCD website

Next.js 16 (App Router) recreation of the JCD Canva mockup, with a
Supabase-backed admin dashboard.

Arabic, RTL throughout. See [DESIGN.md](./DESIGN.md) for how the public page
was measured off the mockup and where it deliberately diverges.

## Running it

```bash
npm install
npm run dev
```

The public page works with no configuration. `/admin` shows a setup notice
until Supabase is connected.

## Connecting Supabase

1. Copy `.env.local.example` to `.env.local` and fill in the three values from
   your Supabase project's **Settings → API**.
2. Run `supabase/migrations/0001_init.sql` in the Supabase SQL editor.
3. Create a user under **Authentication → Users**, then grant it admin access:

   ```sql
   insert into public.admins (user_id, email, role)
   values ('<the user uuid>', '<their email>', 'owner');
   ```

4. Restart `npm run dev` and sign in at `/admin/login`.

Authenticating is not sufficient — a row in `public.admins` is what grants
access, checked both at sign-in and on every admin page load.

## Layout

```
app/
  page.tsx              public page
  admin/
    layout.tsx          auth-gated shell
    login/              sign-in
    [resource]/         generic CRUD for the content types
    products/           bespoke: price, stock, collection
    orders/             list, detail, status transitions
    subscribers/        list + CSV export
    settings/           singleton site settings
components/             public + admin components
lib/
  content.ts            every public string, transcribed from the mockup
  auth.ts               admin resolution and guards
  admin/resources.ts    registry driving the generic CRUD pages
  supabase/             typed clients, schema types
supabase/migrations/    schema, RLS policies
proxy.ts                refreshes the auth cookie on /admin/*
```

Adding a content type means adding an entry to `lib/admin/resources.ts` —
the list, create, and edit pages come for free.

## Security

- Row level security is on for every table. Published content is
  world-readable; all writes require `public.is_admin()`.
- Orders are never readable from the browser.
- The service-role key is only ever used in server code and is never
  referenced from a client component.
- CSV export escapes cells and neutralises leading `=+-@` to prevent
  spreadsheet formula injection.

## Volunteer readiness assessment

`/volunteer-readiness`, reached from the hero's `فحص جاهزية التطوع` button.
Ported from the supplied `volunteer-readiness-assessment.html` into React,
re-pointed at the site's palette, and wired to the database.

Questions and scoring live in [lib/assessment/questions.ts](./lib/assessment/questions.ts)
— one module with no React and no server imports, so the form and the API
route score from exactly the same source.

**One deliberate change from README-AR:** the original posts the whole
client-computed result. Here the client posts only its answers and
`POST /api/volunteer-assessment` recomputes the score, level and narrative
server-side, so a submission cannot claim a readiness level it did not earn.
Unknown question ids and option values are stripped, and incomplete
submissions are rejected with a 400.

Submissions land in `public.assessments` and are listed at
`/admin/assessments`. With no Supabase configured the visitor still gets their
result — it is computed client-side — and the route reports `stored: false`.

## Home page sections

Everything between the help bar and the footer renders from
[lib/sections.ts](./lib/sections.ts) — 19 bands, all copy transcribed from the
full-resolution mockup screenshots.

Ten archetypes cover the page:

| Kind | Used by |
| --- | --- |
| `split` | من نحن, تاريخنا, رسالتنا/رؤيتنا, شراكاتنا, إنجازاتنا, MCD |
| `feature` | فريقنا |
| `cardGrid` | خدماتنا, برامجنا, التدريب والتطوع, فعالياتنا, ابقَ على اطلاع |
| `steps` | مراحل العلاج الداخلي |
| `donate` | ساهم في إنقاذ حياة |
| `products` | متجرنا |
| `newsletter` | اشترك في النشرة الإخبارية |
| `stats` | the teal impact strip |
| `iconCards` | التقييمات |
| `accordion` | أسئلة شائعة |

The footer (تواصل معنا + copyright) is [SiteFooter](./components/SiteFooter.tsx),
driven by `footer` in [lib/content.ts](./lib/content.ts).

Two RTL details worth knowing, because both bit during the build:

- **`grid-column: 1` is the *right*-hand column in an RTL grid.** The split
  bands set `direction: ltr` on the grid and `rtl` on its cells, so `imageSide`
  means what it says on screen.
- The **stats strip** and the **donation amounts** both read left-to-right in
  the mockup, so those containers are `direction: ltr` too and their array
  order is screen order.

Card title colour varies by band (`titleTone`): خدماتنا uses teal titles,
التدريب/فعاليات/الأخبار use dark ones. News meta renders as a filled pill
(`metaStyle: "badge"`), event meta as small teal text.

**Images.** The mockup's photographs were never supplied as files, so every
`image` is `null` and renders a neutral placeholder at the right aspect ratio.
Drop files into `public/sections/` and set `src` to fill them in — no component
changes needed.

## Backend

A Supabase project (`jcd-website`, eu-central-1, free tier) is provisioned and
seeded. Its URL and anon key live in `.env.local`, which is git-ignored — copy
`.env.local.example` and fill it in from the project's API settings. Both
values are public by design; every table is behind row level security.

**There is no service-role key, deliberately.** Public writes go through narrow
RLS insert policies or a security-definer function, and admin reads go through
the signed-in admin's own session. Nothing in the app needs a secret key, so
none exists to leak.

| Path | Does |
| --- | --- |
| `POST /api/orders` | Places an order via `create_order()` — prices re-read from `products` inside the transaction, so the browser only sends ids and quantities, and an order can never be written without its lines |
| `POST /api/donations` | Records a pledge. Amount must be one of the five offered |
| `POST /api/subscribe` | Newsletter sign-up. A repeat address is a success, not an error |
| `POST /api/volunteer-assessment` | Stores an assessment, rescoring server-side |

An owner account already exists in `public.admins`. Its password was set when
the project was seeded and is not recorded in this repository — reset it from
the Supabase dashboard (Authentication → Users) if you need it.

Three bugs worth remembering, all found by running the thing rather than
reading it:

- **`is_admin()` had to be defined after `public.admins`.** A `language sql`
  body is parsed at creation time, so the original ordering failed outright.
- **A policy that sub-selects a table the caller cannot read always fails.**
  `order_items`' insert check queried `orders`, where anon has no select
  policy, so the `EXISTS` saw zero rows and every checkout 500'd. The order RPC
  replaced it.
- **`pg_safeupdate` is enabled on Supabase.** The first version of
  `create_order()` used a temp table and died on `DELETE requires a WHERE
  clause`. It is now a single data-modifying CTE, which is atomic anyway.

## Deploying

The app lives at the repository root — `package.json`, `app/` and `proxy.ts`
are all top level — so Vercel's defaults work with **Root Directory left
blank**. It was previously nested one folder down, which meant Vercel found no
project at the root and built nothing.

Two environment variables must be set in the Vercel project (Settings →
Environment Variables), for Production, Preview and Development:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Both come from the Supabase dashboard under Project Settings → API. They are
git-ignored on purpose, so a fresh deploy will not have them.

Without them the site still renders — `loadSiteData()` falls back to the static
composition in `lib/sections.ts` — but the shop is empty, the cart cannot check
out, and the dashboard cannot sign anyone in.

## Status

Built and verified:

- public page: header, hero, help bar — pixel-matched to the mockup
- all 19 content bands plus the footer, checked section by section against the
  mockup screenshots
- responsive at 390 / 768 / 1366 with no horizontal overflow
- mobile disclosure nav (opens, traps scroll, closes on Escape)
- volunteer readiness assessment: consent gate, per-question validation,
  progress, resume from `localStorage`, results, copy/print/restart, and a
  submit that reaches the API — walked end to end in a browser
- API rejects incomplete, unknown-value and malformed payloads with 400
- admin dashboard, products, orders, content CRUD, subscribers, settings,
  assessments
- **against the live database**, walked end to end in a browser: shop reads 9
  products, add-to-cart updates the header badge, checkout writes an order with
  correct line items and total, newsletter sign-up, donation pledge, assessment
  submission, admin login, and a FAQ created in the dashboard appearing on the
  public page
- API rejects empty carts, unknown products and malformed payloads with 400
- `npm run build` clean, `tsc --noEmit` clean, no console errors

Not built, and why:

- **The section photographs.** Every layout, heading and paragraph is in place;
  only the image files are missing. See "Images" above.
- **`تقييم القلق من الاستخدام`** — the second assessment card links to `#`. Only
  its title and one-line description exist in the mockup, and I am not going to
  invent screening questions about someone's drug use. Supply the question set
  and it drops into `lib/assessment/` beside the volunteer one.
- **Taking payment.** Donations record a pledge and orders are cash-on-delivery;
  no payment provider is connected. Both write real rows and appear in the
  dashboard, but no money moves.
- **Email.** Nothing is sent on order, donation or newsletter sign-up.
- **Anything requiring a live database.** Schema, API and admin are written,
  compile, and behave correctly without credentials, but no query has yet run
  against a real Supabase project.
