# geoWebsite — root guide

Marketing website for the GEO measurement service ([Brand], name TBD). Goal:
communicate what we do, then move visitors to `/free-check` (primary CTA — feeds
the teaser pipeline in `geoPromptRunner`) or `/contact`. Founders: Abhi
(technical), Josh (sales/clients).

**Before non-trivial work, read `website-plan.md`** (sitemap + approved copy +
decisions) **and `scaffold.md`** (structure, component inventory, GEO wiring,
test suite, build sequence). Don't invent pages, copy, or structure that
contradicts them — change the doc first, then the code.

## Stack & commands

Next.js (App Router) + TypeScript + Tailwind, **static export** (`output:
'export'`), deployed on Vercel. **Design reference: `mockup/weir-style.html`
(the "weir" system, imported from Claude Design 2026-07-20 — open it in a
browser before styling anything; `weir-*.jpg` are its key screenshots).**
`mockup/index.html` + `mockup/how-it-works.html` are the SUPERSEDED IBM Plex
direction — kept for copy/structure reference only; don't style from them.

```bash
npm run dev              # local dev
npm run build            # static export → out/  — must stay warning-free
npx playwright test      # geo + funnel + visual suites — gate for every change
npm run lint             # eslint
```

Gate for every change: `npm run build && npx playwright test && npm run lint`.
A failing geo spec blocks merge/deploy — a GEO-audit company cannot ship a site
that fails its own audit.

## Layout

`app/` (one folder per route — see scaffold.md §2 for the full tree) ·
`components/` (Header, Footer, Cta, StatTile, StepList, HonestyBlock,
FaqSection, ReportPreview, FreeCheckForm) · `lib/` (`site.ts` brand/NAP/pricing
constants, `schema.ts` JSON-LD builders, `stats.ts` cited statistics) ·
`content/learn/` (articles as markdown) · `tests/` (geo.spec.ts,
funnel.spec.ts, visual.spec.ts) · `public/`.

## Hard invariants

- **Static export is sacred (our own Cat 2 check).** Never remove `output:
  'export'`. No server actions, no API routes, no runtime rendering. Every word
  of copy and every JSON-LD block must exist in the raw exported HTML with
  JavaScript disabled.
- **`'use client'` is allowed only for interactivity islands** (FreeCheckForm
  submit state, mobile nav toggle). Content-bearing components are server
  components, always. If a component renders copy, headings, or schema, it
  cannot be a client component.
- **`lib/site.ts` is the single source of truth** for brand name, domain, NAP,
  founder info, pricing. Placeholders (`[Brand]`, `[$X]`) live there and ONLY
  there — never hardcode them in a page. Launch swap must be a one-file change.
- **Schema never drifts from visible text.** JSON-LD comes only from
  `lib/schema.ts` builders, fed by the same data structures that render the
  visible content (the FaqSection pattern: one `{question, answer}[]` renders
  both the H2s and the FAQPage JSON-LD). Never hand-write a JSON-LD string in
  a page.
- **Bot access is a feature.** `app/robots.ts` explicitly allows GPTBot,
  ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Bingbot, CCBot.
  Never add a rule, middleware, or Vercel setting (e.g. Attack Challenge Mode)
  that challenges or blocks crawlers. `tests/geo.spec.ts` fetches every page as
  each bot UA and with JS disabled — keep those assertions green, never weaken
  them.
- **Copy rules are legal posture (from geoPromptRunner's gtm-legal-readiness +
  smb-pivot-plan):** never guarantee placement or rankings ("rank #1 in
  ChatGPT" is banned); visibility numbers are sampled rates ("7 of 10 runs"),
  never point-in-time ranks; every statistic carries a named source; no
  llms.txt (we'd flag it as theater in a client audit). New marketing copy
  follows website-plan.md or gets Josh's sign-off first.
- **Every stat lives in `lib/stats.ts`** with text + source + URL. No unsourced
  numbers anywhere on the site.
- **Forms:** `/free-check` submissions go to the manual-queue backend (Supabase
  insert-only `leads` table — see scaffold.md §6). No auto-triggering of the
  teaser pipeline, no client-side secrets; the anon key + RLS insert-only
  policy is the only browser-facing credential.
- **No new dependencies without need.** This is a static marketing site: no UI
  kits, no animation libraries, no analytics beyond the one chosen lightweight
  option. If a feature seems to need a heavy dependency, it's probably the
  wrong feature.

## Design system (locked 2026-07-20 — the "weir" system; canonical: `mockup/weir-style.html`)

**Typography.** Poppins for everything — headings, body, labels, and data
alike (one family, no mono face). Load via `next/font/google` (self-hosted at
build; never a fonts CDN `<link>` — it would break the static export). Poppins
has **no weight above 700** — never specify 800+. Headlines 500–600,
tracking -0.02em; buttons/labels 600 uppercase with wide tracking (.06–.1em).

**Tokens** (in `app/globals.css`): ink `#003262` (Berkeley blue — text AND
fills) · ink-soft `#616b76` · ink-faint `#8b95a0` · paper `#fdfcf7` ·
paper-dim `#f6f3ea` (cream cards) · accent `#003262` / accent-dark `#a86a00`
(links are ink; **hover is amber**) · line `#dfe3ea` · line-dark `#c7ccd6` ·
bad `#b91c1c` · **gold `#fdb515` / gold-soft `#fdf0cf`** (California gold — the
single accent) · dot `#c9d2dc` / dot-bad `#ecc4bc` · ink-dim `#9fb3cd`.

**Ground.** The body wears the fixed pastel gradient (`#cfe0f5 → #dce7f1 →
#eee7d6 → #f4ecd4`, `background-attachment: fixed`). Sections sit transparent
on it — never paint a full-bleed white section over the gradient; cards and
surfaces (cream `paper-dim`, white/80) carry the contrast instead.

**Shapes.** Radii: 12px standard, 18–22px feature cards, 999px pills. Buttons
are `.btn-pill` / `.btn-pill-outline` (hero/nav) and `.btn-solid` (in-flow) —
blue fill, uppercase, amber hover; defined once in globals.css, never
recomposed inline. Soft large shadows are allowed ONLY on product-mockup
cards (the hero answer card); measurement artifacts (ArtifactCard,
SamplingCard) stay square-cornered and shadowless so data never reads as
marketing. One motion: `.weir-bob` on the hero chevron (reduced-motion safe).

**Color discipline.** Gold is the accent and it is rationed: chips'
`gold` variant, the honesty block, ≤1 gold-marked element per page. Red
(`bad`) only for loss/absence (competitor rows, accuracy flags, "not
mentioned"). Everything else is Berkeley blue on the gradient/cream ground.
Hover states go amber, not underline-blue.

**Recurring components** (in `components/`, reuse — never fork): Chip (pill
label, white-on-blue; gold variant rationed) · ArtifactCard (square, blue
header bar) · SamplingCard (dot rows, competitor row in red) · DataChips ·
StepList (joined cells, numbered tabs) · HonestyBlock · the cream
product-mockup card (hero answer card pattern).

**Claim + artifact rule.** No section ships as text-only. Every claim is
paired with a concrete artifact (query set card, sampling card, judge verdict,
deliverables grid). Section bodies are ≤2 sentences; the artifact does the
explaining. Every page gets one signature element (home: the answer card;
how-it-works: the pipeline).

**Sample data honesty.** All illustrative mention-rate numbers come from
`lib/sample.ts` (ONE canonical dataset) and are labeled "illustrative
example" wherever they render. Never label invented data as a real or
anonymized client — swap in a real run via lib/sample.ts when one is cleared
(website-plan §6).

## Process

- Validation loop for every change: write → `npm run build` → `npx playwright
  test` → screenshot review (visual.spec.ts emits 390/768/1440px full-page
  shots to `tests/screenshots/`) → commit.
- Build order follows scaffold.md §7. Steps 1–5 have no open-item
  dependencies; `/sample-report`, `/learn` content, and the launch pass wait on
  the open items in website-plan.md §6.
- Vercel: every branch gets a preview deploy; run the Playwright suite against
  the preview URL before promoting to production.
- Keep `website-plan.md` §6 (decisions & open items) current — when a
  placeholder resolves (brand, pricing, sample run), update the doc in the same
  commit as the code change.
