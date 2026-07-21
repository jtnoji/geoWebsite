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
'export'`), deployed on Vercel. **Design reference: `mockup/weir-style.html` —
the full prototype (all 9 routes), imported from Claude Design 2026-07-20. Open
it in a browser before styling anything.** `mockup/weir-{hero,badge,steps}.jpg`
are the design-project screenshots.

`mockup/index.html` + `mockup/how-it-works.html` (+ `mockup/fonts-inline.css`)
are the **superseded** IBM Plex / editorial direction — kept for reference only.
Do not style from them.

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

## Design system ("weir", locked 2026-07-20 — canonical: `mockup/weir-style.html`)

**Typography.** Poppins for everything, loaded via `next/font/google` (Next
self-hosts it at build time — never a Google Fonts CDN link, which would break
the self-contained static export). Poppins has **no weight above 700** — never
specify 800+. Display H1: weight **500**, `clamp(40px,6vw,74px)`, line-height
1.03, tracking -0.02em. Section H2: 600–700, 26–34px, tracking -0.035em. Body:
16–18px, line-height 1.55–1.65, one or two **bolded key phrases per paragraph
in ink** (the "bold ration" — never more). Labels/eyebrows/nav/buttons: 500–600,
11–14px, uppercase, tracking .06em–.14em. The `font-mono` class is the
**label/metadata role**, not a different family — it also maps to Poppins.

**Tokens** (in `app/globals.css`): ink `#003262` (Berkeley blue) · body
`#616b76` · faint `#8b95a0` · dim `#9aa4af` · paper `#fff` · paper-dim `#f6f3ea`
(cream) · accent/bad `#a86a00` (gold-dark) · accent-dark `#24303a` · gold
`#fdb515` · gold-soft `#fdf0cf` · line `rgba(46,59,71,.08)` · line-dark
`rgba(46,59,71,.14)` · dot `#c7ccd6` · dot-bad `#f0cabb` · band `#e9edf7`.

**The page is a fixed pastel gradient** (`180deg #cfe0f5 → #dce7f1 → #eee7d6 →
#f4ecd4`, `background-attachment: fixed`) — set once on `body`. Sections are
transparent; only cards carry white/cream fills. Never give a section its own
background colour.

**Berkeley blue is the ink AND the only fill.** Blue backgrounds are allowed on
label-sized elements (section chips, artifact-card header bars, pipeline/step
number tabs, tiny tags) and on buttons. Never fill a content block, quote, or
strip — the data-chips row and the honesty pull-quote stay light.

**Color discipline.** Gold is the *single* accent and it means loss/absence or
emphasis: competitor sampling rows, "not mentioned" chips, accuracy flags, the
active-nav underline, link hover, the hot pipeline stage — **at most one gold
chip per page**. `--color-bad` and `--color-accent` are deliberately the same
value; there is no red in this system. Everything else is ink on the gradient
with hairline rules.

**Shape.** Pills (`999px`) for hero/nav CTAs; `12px` for solid section buttons,
inputs, and small chips; `18–22px` for product-mockup cards. **Data artifacts
stay square** with a 1px border — the rounded, shadowed treatment is reserved
for product mockups so measurement never reads as marketing. Shadows only on
floating product cards/callouts.

**Persistent bottom CTA bar** (`components/BottomBar.tsx`) is the signature
element: fixed to the viewport bottom on every route, wave SVG on its top edge,
routing to `/free-check`. `body` carries a 78px bottom padding to clear it.
Note it renders mid-page in full-page screenshots — that's a capture artifact of
`position: fixed`, not a bug; check viewport-sized shots to review it.

**Recurring components** (build once in `components/`, reuse everywhere):
chip label (navy, or gold once per page) · data-chips strip (bordered row:
`n=32 · engines=5 · runs=10×`) · artifact card (1px border, navy header bar) ·
run-sampling dot row (`●●●●○○○○○○ 4/10`, competitor row in gold) · §-numbered
sticky rail · pipeline stages · honesty pull-quote (top-rule, large type,
`NO GUARANTEES` chip) · pill/solid buttons (`.btn-pill`, `.btn-pill-outline`,
`.btn-solid` in `globals.css`).

**Claim + artifact rule.** No section ships as text-only. Every claim is
paired with a concrete artifact (query set card, sampling card, judge verdict,
deliverables grid). Section bodies are ≤2 sentences; the artifact does the
explaining. Every page gets one signature element (home: the ChatGPT answer
card; how-it-works: the pipeline).

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
