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
'export'`), deployed on Vercel. **Design reference: `mockup/index.html` (home)
and `mockup/how-it-works.html` — both in the final approved language; open
them in a browser before styling anything.** They share `mockup/fonts-inline.css`
(embedded Plex; the real build loads the same faces via `next/font`).

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

## Design system (locked 2026-07-20 — canonical: `mockup/how-it-works.html`)

**Typography.** IBM Plex Sans for everything; IBM Plex Mono for every number,
label, and metadata string. Load via `next/font` (self-hosted; the mockups use
`@fontsource/ibm-plex-sans` + `@fontsource/ibm-plex-mono` — same files). Plex
has **no weight above 700** — never specify 800+. Headlines: 700, tracking
-0.03em to -0.04em, line-height ~1.0–1.1. Body: 15.5–18px on `--body`, one or
two **bolded key phrases per paragraph in ink** (the "bold ration" — never
more; if everything is bold, nothing is).

**Tokens** (in `app/globals.css`, from the mockup): ink `#0e1116` · body
`#343b45` · faint `#8a929c` · bg `#fdfdfc` · dim `#f4f4f2` · accent `#1d4ed8`
· bad `#b91c1c` · line `#e5e6e3` · line-dark `#c4c6c1`.

**Black is punctuation, never a fill.** Black backgrounds are allowed only on
label-sized elements: section chips (`§2 — SAMPLING`), the thin header bar of
artifact cards, pipeline stage-number tabs, tiny tags (LOCAL/COST/BRAND), and
the nav CTA button. Never fill a content block, quote, or strip with black —
the data-chips row and the honesty pull-quote are explicitly light (we tried
black; rejected).

**Color discipline.** Red = loss/absence only (competitor rows, accuracy
flags, "not mentioned", at most one red chip per page). Blue = CTAs, links,
and at most one emphasized phrase per page. Everything else is ink on warm
white with hairline rules. No shadows, no gradients, no border-radius except
6px on buttons.

**Recurring components** (build once in `components/`, reuse everywhere):
black chip label · data-chips strip (bordered mono row: `n=32 · engines=5 ·
runs=10×`) · artifact card (1px border, black mono header bar) · run-sampling
dot row (`●●●●○○○○○○ 4/10`, competitor row in red) · §-numbered sticky rail ·
pipeline stages · honesty pull-quote (top-rule, large type, `NO GUARANTEES`
chip).

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
