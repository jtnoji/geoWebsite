# Website Scaffold — Next.js Static Export

Companion to `website-plan.md` (sitemap + copy). This is the build blueprint:
project structure, component inventory, GEO wiring, test setup, and the order to
build it in. Repo: this folder (`geoWebsite`), separate from `geoPromptRunner`.

Stack (decided): **Next.js (App Router) + TypeScript + Tailwind CSS**, built with
`output: 'export'` (pure static HTML — satisfies the Cat 2 "content exists without
JavaScript" check by construction), deployed on **Vercel**.

---

## 1. Project setup

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --eslint
                                   # site font: Poppins via next/font/google (no install)
npm run dev                        # local dev at localhost:3000
npm run build                      # static export → out/
npx playwright install chromium    # for the QA suite (dev machine)
```

Font (locked 2026-07-20, "weir" system): **Poppins** (400/500/600/700) for all
text — headings, body, and the label/metadata role alike. Loaded via
`next/font/google` so it's self-hosted and subsetted at build time (a Google
Fonts CDN `<link>` would break the self-contained static export). Poppins has
no weight above 700.

`next.config.ts`:

```ts
const nextConfig = {
  output: 'export',        // static HTML export — no server, Cat 2 by default
  trailingSlash: true,     // stable /page/ URLs on static hosting
  images: { unoptimized: true },  // required for static export
};
```

Rule for the whole codebase: **no `'use client'` for anything content-bearing.**
Client components are allowed only for interactivity islands (mobile nav toggle,
form submit state). All copy, headings, and JSON-LD must be in server components
so they land in the exported HTML.

---

## 2. Directory structure

```
geoWebsite/
├── app/
│   ├── layout.tsx              # root layout: <Header/>, <Footer/>, metadata, Org schema
│   ├── page.tsx                # Home
│   ├── globals.css             # Tailwind + design tokens
│   ├── free-check/page.tsx     # conversion page (minimal chrome)
│   ├── sample-report/page.tsx
│   ├── how-it-works/page.tsx
│   ├── pricing/page.tsx
│   ├── learn/
│   │   ├── page.tsx            # article index
│   │   └── [slug]/page.tsx     # articles via generateStaticParams (content in content/)
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── our-score/page.tsx
│   ├── sitemap.ts              # generates sitemap.xml at build
│   └── robots.ts               # generates robots.txt (AI-bot allowlist, §4)
├── components/
│   ├── Header.tsx              # nav + sticky "Free visibility check" button
│   ├── Footer.tsx              # full page list, NAP, founder LinkedIns
│   ├── Cta.tsx                 # primary/secondary CTA pair, used on every page
│   ├── StatTile.tsx            # stat + source line (home stat bar)
│   ├── StepList.tsx            # "how it works" 3-step
│   ├── HonestyBlock.tsx        # the no-guarantees block (reused verbatim)
│   ├── FaqSection.tsx          # renders Q&A pairs + emits FAQPage JSON-LD from same data
│   ├── ReportPreview.tsx       # sample-report imagery strip
│   └── FreeCheckForm.tsx       # 'use client' island — the ONE interactive component
├── lib/
│   ├── schema.ts               # JSON-LD builders: org(), faq(), person(), service(), article()
│   ├── site.ts                 # single source of truth: brand, domain, NAP, founders, links
│   └── stats.ts                # the cited statistics (text + source + url), used by StatTiles
├── content/
│   └── learn/*.md              # articles as markdown + frontmatter
├── tests/
│   ├── geo.spec.ts             # the mini-audit (§5) — runs in CI
│   ├── funnel.spec.ts          # every page → /free-check ≤1 click; form submits
│   └── visual.spec.ts          # screenshots at 390/768/1440 for review loop
├── public/                     # favicon, og-image, report screenshots
├── playwright.config.ts
├── next.config.ts
└── package.json
```

Placeholder discipline: `lib/site.ts` exports `BRAND = '[Brand]'`, `DOMAIN`,
`NAP`, `PRICING = { audit: '[$X]', retainer: '[$X]/mo' }`. Every page pulls from
here — when the name and prices land, they change in ONE file.

---

## 3. Component & page inventory (what each page composes)

| Page | Composition | Schema (JSON-LD) |
|---|---|---|
| layout | Header, Footer | Organization + ProfessionalService (site-wide) |
| / | Hero, StatTile×3, problem section, what-we-do, StepList, HonestyBlock, ReportPreview, Cta | — (inherits Org) |
| /free-check | Slim header, FreeCheckForm, what-you'll-get list | — |
| /sample-report | ReportPreview (full), annotations, Cta | — |
| /how-it-works | FaqSection (question-form H2s), HonestyBlock, Cta | FAQPage |
| /pricing | 3 tier cards, FaqSection, Cta | Service ×2 + FAQPage |
| /learn, /learn/[slug] | article index / markdown render, Cta | Article (+ FAQPage where Q&A) |
| /about | founder bios, Cta | Person ×2 |
| /our-score | audit-results table (hand-authored JSON at first), Cta | — |
| /contact | email, scheduling embed, Cta | — |

`FaqSection` is the key pattern: one data structure `{question, answer}[]` renders
both the visible H2/paragraph content AND the FAQPage JSON-LD — schema can never
drift from visible text (the thing your own Cat 5 validator checks for).

---

## 4. GEO wiring (rubric → code)

- **robots.ts** — explicit `Allow: /` groups for: GPTBot, ClaudeBot,
  Claude-SearchBot, PerplexityBot, Google-Extended, Bingbot, CCBot, plus `*`.
  Point at sitemap.xml.
- **Metadata** — per-page `export const metadata` (unique title ≤60 chars,
  description ≤155, OG tags). Canonical via `metadataBase` in layout.
- **JSON-LD** — emitted as `<script type="application/ld+json">` from server
  components via `lib/schema.ts` builders; present in raw exported HTML.
- **Answer-first content rule** — every H2 that poses a question is immediately
  followed by a 1–2 sentence standalone answer (enforced by review, encoded in
  the copy from website-plan.md).
- **NAP** — Footer renders from `lib/site.ts`; identical on every page.
- **Vercel** — confirm no bot-challenge/firewall rules on this project (defaults
  are fine; do NOT enable "Attack Challenge Mode" — it blocks AI crawlers, the
  exact Cat 1 failure we audit clients for).
- Deliberately absent: llms.txt (per pivot plan §5 — don't ship what we'd call
  theater in a client audit).

## 5. Playwright test suite (the dogfood mini-audit)

`geo.spec.ts` — runs against `out/` (or a deploy preview) in CI, per page:

1. Fetch with **JavaScript disabled** → assert key copy strings + `<script
   type="application/ld+json">` present in raw HTML.
2. Fetch with each AI-bot **user agent** (GPTBot, ClaudeBot, PerplexityBot,
   Google-Extended) → assert HTTP 200 and real content (no challenge page).
3. Parse every JSON-LD block → valid JSON, expected `@type` per the §3 table.
4. Assert unique `<title>` + meta description per page; robots.txt and
   sitemap.xml exist and parse.

`funnel.spec.ts` — from every page: a link/button to /free-check reachable in
≤1 click; form fills and submits; confirmation state renders.

`visual.spec.ts` — full-page screenshots at 390 / 768 / 1440 px per page, saved
to `tests/screenshots/` — the artifact for the design-critique loop.

CI: GitHub Actions (or Vercel build step) — `npm run build && npx playwright
test`. A Cat-check failure blocks deploy: the GEO-audit company cannot ship a
site that fails its own audit.

## 6. /free-check form backend (manual-queue, static-site compatible)

**Status: WIRED (2026-07-20)** to Supabase project `satjbyfjzrwocwwonsxz`
(config in `lib/site.ts`; not on Josh's Supabase account — believed to be
Abhi's). `FreeCheckForm` POSTs `{business, website, area, description, email}`
to `/rest/v1/leads` with the publishable key. Queue is manual: check the
Supabase dashboard → run teaser → email report.

**Before launch, run `node scripts/verify-leads-backend.mjs`** (needs network,
so run on a dev machine, not in a sandbox). It proves, using only the
browser-facing key: INSERT works with the form's exact field names, and
SELECT / DELETE / UPDATE are all blocked by RLS. A readable `leads` table
would leak every prospect's email to anyone who opens the site's JS bundle —
this check is a launch gate, and belongs in the pre-deploy checklist any time
the key, table, or policies change. Expected RLS: enable RLS on `leads`,
one policy `FOR INSERT TO anon WITH CHECK (true)`, and NO select/update/
delete policies for anon.

## 7. Build sequence (each step ships something reviewable)

1. **Scaffold + design system** — create-next-app, config, `lib/site.ts`
   placeholders, fonts via `next/font`, and the locked tokens + components
   from `mockup/weir-style.html` (see CLAUDE.md "Design system"): palette
   vars in `globals.css`, Chip, artifact-card pattern, data-chips strip,
   Header/Footer/Cta/BottomBar. → deploy preview on Vercel from day one.
2. **Home + /free-check** — the two pages that matter; copy from
   website-plan.md; FreeCheckForm wired to the queue. → screenshot review loop.
3. **GEO layer** — robots.ts, sitemap.ts, schema builders, metadata pass.
4. **Test suite** — geo.spec.ts + funnel.spec.ts green in CI.
5. **Supporting pages** — /how-it-works, /pricing, /about, /contact.
6. **Content pages** — /sample-report (needs the anonymized run), /learn with 5
   launch articles, /our-score (needs a real audit run against the deployed site).
7. **Launch pass** — brand name/pricing swap in `lib/site.ts`, OG images,
   favicon, domain + DNS, final audit run → publish score on /our-score.

Steps 1–5 have zero open-item dependencies. 6–7 wait on brand/domain, pricing,
and the sample-run pick.
