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
'export'`), deployed on Vercel. **Design reference:
`mockup/sable-brand-sheet.html` (the "Berkeley" system, imported from Claude
Design 2026-08-02 — open it in a browser before styling anything).** It is the
delivered brand sheet with the ~700KB of inlined base64 fonts swapped for a
Google Fonts `<link>`; that `<link>` is fine because the sheet is a local
reference document and never ships. `mockup/weir-style.html` and `weir-*.jpg`
are the superseded 2026-07-20 system, kept only to read old commits against.
The IBM Plex mockups before that were deleted 2026-07-25; `git show
5ad0939:mockup/index.html` still has them.

```bash
npm run dev              # local dev
npm run build            # static export → out/ + harden-export.mjs — warning-free
npm test                 # geo + funnel + visual + security — gate for every change
npm run lint             # eslint
npm run verify:leads     # PRE-DEPLOY: live check that /free-check still accepts a lead
npm run canary:leads     # the hourly probe, by hand (CANARY_TARGET=<url> for a preview)
```

`npm run verify:leads` needs network and writes to the live queue, so it is
deliberately not part of `npm test`. **Run it after any change to `lib/site.ts`,
the Supabase keys, or the form** — a dead key is invisible from inside this
repo, and shipping one loses leads silently until someone checks by hand.

`npm run build` runs `scripts/harden-export.mjs` after `next build`; `out/` is
not deployable without it (no meta CSP, no /.well-known/security.txt).

`npm test` runs three projects: **chromium, webkit (Desktop Safari) and
mobile-safari (iPhone)**. WebKit is not optional here: `BottomBar` is
`position: fixed` and `Header` is `position: sticky` on every page, and Safari
treats both differently. (The `background-attachment: fixed` gradient that was
the other half of this rationale is gone with the weir system — the Berkeley
ground is a flat fill.) `visual.spec.ts` writes
chromium shots to `tests/screenshots/` (the design-critique loop) and WebKit
shots to `tests/screenshots/webkit/`; diff the pair when touching anything
fixed-position. New browsers install with
`./node_modules/.bin/playwright install webkit`.

**Never put `upgrade-insecure-requests` in the `<meta>` CSP.** WebKit honours
it there and upgrades every subresource to https even on `http://127.0.0.1`,
where TLS fails and the page renders with no CSS and no JS. Chromium exempts
localhost, so it looks fine until you run WebKit. It is header-only in
`vercel.json`, and `META_INVALID` in `harden-export.mjs` keeps it out.

Gate for every change: `npm run build && npm test && npm run lint`.
**Never `npx playwright test`** — `npx` resolves from the registry at run time,
which defeats the lockfile. `npm test` uses the local binary.
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
- **Voice: plain and short (locked 2026-07-25, website-plan §6).** No em dashes
  in any visible copy, including metadata titles and card headers — use a
  period, comma, colon, or `·`. En dashes stay for ranges ("1–2 business days",
  "Cat 1–6"). Two clauses per sentence max; prefer two sentences to one long
  one. No filler intensifiers ("actually", "exactly") or "real X, real Y, real
  Z" triads. `npm run build && grep -r "—" out/` must return nothing.
- **Every stat lives in `lib/stats.ts`** with text + source + URL. No unsourced
  numbers anywhere on the site.
- **Forms:** `/free-check` submissions go to the manual-queue backend (Supabase
  insert-only `leads` table — see scaffold.md §6). No client-side secrets; the
  anon key + RLS insert-only policy is the only browser-facing credential.
  - **A broken form must never be silent again (added 2026-07-31, scaffold §6d).**
    A dead key makes PostgREST return 401: no row, no `lead_alert_log` entry, no
    email, and the prospect still sees "your report is on the way". The hourly
    `.github/workflows/leads-canary.yml` probe is the only thing that goes red.
    It reads the key out of the **deployed** bundle, not `lib/site.ts`, because
    testing the repo's key proves the repo is fine, which is not the question.
    Never point it at `lib/site.ts` as a fallback: that turns a red canary green.
  - **`scripts/lead-canary.sql` must stay applied.** Probe rows are real rows in
    `leads`. Without it the canary mails a fake lead every hour and spends the
    20/hour Resend cap real leads need, and unreaped probe rows raise "overdue"
    SLA alerts at 24h. It marks rows by `source`, never by a new `status` value:
    the anon INSERT policy asserts `status = 'new'` and RLS `WITH CHECK` runs
    after BEFORE-INSERT triggers, so tagging by status makes the insert fail.
    `LEAD_CANARY_SOURCE` in `lib/site.ts` and the literal in that SQL are two
    copies of one string. Change them together.
  - **No auto-triggering of the teaser pipeline.** A teaser is engine spend and
    a document we send a stranger; it stays behind a human. Unchanged.
  - **AMENDED 2026-07-31 — one narrow exception: Tier-1 fact-sheet generation
    may run automatically on an admitted lead.** It is not the teaser pipeline
    and does not start one: it crawls the lead's own website and extracts quoted
    claims (L0 + L1), calls no model, spends no engine budget, and produces a
    DRAFT nothing may send until a human reviews it. The rule it exists to
    preserve — nothing reaches a prospect without a person deciding — is
    untouched, because a fact sheet reaches no prospect.
    - It runs as a **polling worker in geoPromptRunner**, never as a trigger
      here: `factsheet_jobs` lives in the platform project, so this project's
      trigger could not write to it even if we wanted that (see
      `geoPromptRunner/docs/factsheet-autogen-plan.md` §12.1/§12.3).
    - **No prospect PII crosses projects.** The worker carries `leads.id` as
      `lead_ref` and nothing else — never email, never phone. The report is still
      sent from the queue that already holds the address.
    - Reads go through the `leads_reader` role from `scripts/leads-visibility.sql`
      (SELECT-only, RLS-scoped). The browser keeps the anon insert-only key.
    - Widening this to Tier 2 (which does call models and does spend) is a
      **separate amendment**, not covered here.
- **Security headers live in `vercel.json` — nowhere else.** `next.config.ts`
  `headers()` is inert under `output: 'export'` (Next lists Headers as an
  unsupported feature), so the CDN config is the only header layer. Every
  header there is browser-side and **none of them gate a crawler** — that is
  what keeps Cat 1 green, and `tests/security.spec.ts` re-checks bot fetches
  after every change.
- **The CSP is two layers, on purpose.** `vercel.json` carries the header
  policy (it reaches non-HTML responses and is the only place
  `frame-ancestors` works). `scripts/harden-export.mjs` then adds a stricter
  `<meta>` policy per page, listing sha256 hashes of that page's inline
  scripts instead of `'unsafe-inline'` — Next inlines ~16 hydration scripts per
  page and a static export has no request cycle in which to mint a nonce.
  Browsers enforce every policy they are given, so the intersection is
  hash-only. The meta policy is DERIVED from `vercel.json`; never write it out
  twice. **Adding any third-party script or fetch destination means editing
  `connect-src`/`script-src` in `vercel.json` first, or it silently fails.**
- **Markdown is untrusted input, not documentation.** `content/learn/*.md` is
  production copy served to GPTBot, ClaudeBot, PerplexityBot and CCBot, and
  anyone with commit access can edit it. `marked` does NOT sanitize: by default
  it passes raw HTML straight through, so an off-screen `<div>` in an article
  would be invisible in review and in the browser and fully readable by every
  crawler we invite — the exact prompt injection we'd flag in a client audit.
  The sanitising renderer in `lib/articles.ts` drops every raw-HTML token and
  rejects non-http(s)/mailto/relative link targets. **Never swap it for a plain
  `marked.parse`.** Gated by the hidden-text and raw-HTML tests in
  `tests/geo.spec.ts`, which check the RAW response bytes — React deletes
  injected nodes on hydration, so a DOM-based check is blind to this and
  crawlers read the bytes anyway.
- **`scripts/harden-export.mjs` is fail-closed.** It hashes inline scripts into
  the CSP allowlist, so it must only ever hash *vetted* ones — otherwise a
  planted `<script>` gets inspected, hashed, and granted an exemption by the
  control meant to stop it. `ALLOWED_INLINE` pins the three shapes this build
  legitimately emits (Next flight payload, Next bootstrap, the layout reveal
  failsafe) plus `ld+json`. Anything else fails the build. If a Next upgrade
  changes the shape, add it deliberately; never widen the pattern to "any".
- **Brand images are generated, not hand-drawn.** `app/opengraph-image.png`,
  `app/icon.png` and `app/favicon.ico` come from
  `scripts/make-brand-assets.py`, which reads `BRAND` from `lib/site.ts` and
  pulls both families out of the woff2 `next/font` already downloaded into
  `out/` (weight 400 exists in Libre Franklin, Cormorant, and both italics, so
  `face()` matches on family + weight + style — matching weight alone returns
  whichever `@font-face` the CSS concatenation happened to put first).
  **Re-run it when the brand name lands**, or every link shared anywhere will
  keep saying `[Brand]`. **The committed PNGs are currently STALE** — they
  still carry the weir palette and Poppins. Regenerate with a venv that has
  Pillow + fontTools; the system Python has neither.
  Next emits the `og:image`, `twitter:image` and icon
  tags from the file names alone, so nothing else needs editing. It is NOT in
  `npm run build` on purpose: Vercel's build image has no guaranteed Python,
  and `next/og` `ImageResponse` cannot be used here at all (it needs a
  request-time runtime and fails the static export).
- **Analytics is `process.env.VERCEL`-gated, and `/privacy` must track it.**
  `<Analytics />` in `app/layout.tsx` renders only on Vercel's builder.
  `/_vercel/insights` exists only on Vercel's edge, so an ungated local build
  404s on every page load and took the suite from 44s to 11 minutes. It counts
  HUMANS ONLY: a JS beacon cannot see AI crawlers, which never execute
  JavaScript, so it can never answer "is GPTBot fetching us" — that needs
  request logs. **`/privacy` states exactly what is collected; any change to
  analytics changes that page in the same commit.**
- **`.npmrc` sets `ignore-scripts=true`.** Note `min-release-age` makes
  `npm install <new-pkg>` fail with `ENOVERSIONS` for some packages; `npm ci`
  (what Vercel runs) is unaffected. Add new deps with
  `npm install <pkg> --min-release-age=0` after checking the release date. Install hooks are how essentially
  every recent npm worm executed, and this build needs none (verified: `npm ci
  && npm run build` passes with it set). Don't remove it to make a dependency
  install; use `npm rebuild <pkg>` for that one package.
- **No new dependencies without need.** This is a static marketing site: no UI
  kits, no animation libraries, no analytics beyond the one chosen lightweight
  option. If a feature seems to need a heavy dependency, it's probably the
  wrong feature.

## Design system (locked 2026-08-02 — the "Berkeley" system; canonical: `mockup/sable-brand-sheet.html`)

Replaces the "weir" system (locked 2026-07-20, `mockup/weir-style.html`), which
ran on a fixed pastel gradient, Poppins, and a rationed California-gold accent.
Section numbers below (§01–§07) refer to the brand sheet.

**The mark** (§01, `components/Plume.tsx`). Three rising plumes. Each is a
teardrop — `border-radius: 60% 60% 60% 0`, three rounded corners and one square
heel — and all three sit on a shared baseline. Every dimension derives from one
unit `u` (the width of a single plume): heights `1.7u · 2.3u · 2.9u`, gap
`0.3u`. That is why `Plume` takes `u` and nothing else: §07 forbids stretching,
squashing and re-proportioning, and a geometry that can only be scaled cannot
be any of those. **§03 reduction rule:** under 20px tall the mark drops to two
plumes, under 16px to one — `Plume` applies this itself, so callers just pass a
smaller `u`. Never below 14px wordmark.
`Lockup` = mark + wordmark (+ optional tracked subline). The wordmark renders
`BRAND` from `lib/site.ts`, never a literal, so the launch rename stays a
one-file change. **The header lockup carries the "AI SEO" subline** (Josh,
2026-08-02); the sheet's own §06 header shows mark + wordmark alone, so this is
a deliberate departure and the copy sign-off is on record.

**Typography** (§05). **Two families, and the split is the system.** Cormorant
Garamond is display ONLY — h1, h2, and editorial figures, applied via the
`.display` class. Libre Franklin carries everything else: body, h3 and below,
labels, buttons, and every data cell. Both via `next/font/google` (self-hosted
at build; never a fonts CDN `<link>` — it would break the static export).
- `.display` in globals.css is **deliberately unlayered**, so it beats the
  `font-bold` and `tracking-*` utilities already sitting on ~28 headings
  without touching one of them. It sets weight 400 and letter-spacing
  **+0.02em**. Positive: the sheet specifies "Light 300 & Regular 400 … tracked
  +0.01 to +0.04 em", and Cormorant at 500 with negative tracking closes its
  hairlines into adjacent stems.
- Cormorant runs small for its point size, so display sizes want roughly a step
  more than the sans equivalent.
- Franklin sets labels and metadata uppercase with wide tracking (.14–.36em).
  **That tracked label is the only uppercase in the system.** Nothing goes
  above weight 500 in new work.

**Tokens** (`app/globals.css`). A single navy hue stepped four ways over warm
paper. ink `#0e2340` (Berkeley Navy — headings, fills, tallest plume) · accent
`#12325c` (Sable Blue — links, active states, eyebrows) · ink-soft `#4a5666`
(Harbour — body, middle plume) · ink-faint `#626c78` (labels, card meta) ·
ink-dim `#b2b7bc` (Mist — first plume; **non-text only**) · paper `#ffffff`
(cards) · paper-dim `#f2f1ec` (Paper — the ground AND inset artifact boxes) ·
sky `#7fa6d9` · line `rgba(14,35,64,.1)` / line-dark `rgba(14,35,64,.16)` ·
bad `#4a5666` (== ink-soft) · dot `#c3c6cb` / dot-bad `#d0d2d6` · band
`#ffffff` (BottomBar — body reserves 62px).
- **Harbour and the label grey are darker than the brand sheet's own values,
  on purpose.** The sheet ships `#697585` and `#98a1ab`, which measure 4.14:1
  and 2.32:1 on this paper — both under WCAG AA's 4.5:1, at a 15px body size.
  Both moved down a flat -31 per channel, which keeps the hue and the even
  spacing between steps and buys 6.59:1 and 4.72:1. **The contrast ratios are
  the invariant, not the hex values.** Re-measure before changing either.

**The Sky rule** (§04). Sky is the one bright note and it is legal **on navy
only, never on paper**. The sheet says once per page; the operative rule here is
**at most once per navy band**, because the long-form home runs ~9k words over
three widely separated navy bands and a single accent across that distance is
not a system, it is a typo. On a short page the two readings coincide.
Outside the chrome (the header lockup's tallest plume and the active-nav
underline) the home spends it exactly twice: the `EngagementSteps` band eyebrow
and the `FreeCheckPanel` navy panel's label. Anything tempted to be a third
inside the same band uses `white/12` or the inverted pill instead.

**Ground.** Flat warm paper (`paper-dim`), no gradient. Cards earn separation
from a white fill plus a hairline, never from the ground shifting under them.

**Shapes.** Radii: 12px standard, 18–22px product-mockup cards, 999px pills.
Buttons are `.btn-pill` / `.btn-pill-outline` (hero/nav), `.btn-pill-invert`
(white fill on navy bands — the header CTA), `.btn-pill-ghost` and `.btn-solid`
(in-flow); all weight 500, tracking .14em, defined once in globals.css and
never recomposed inline. Soft large shadows ONLY on product-mockup cards (the
hero answer card); measurement artifacts (ArtifactCard, SamplingCard) stay
square-cornered and shadowless so data never reads as marketing. One motion:
`.weir-bob` on the hero chevron (name predates this system; reduced-motion
safe).

**Absence has two directions, and mixing them up is the easy mistake.** This
palette has no warning hue and gets none — absence is carried by TONE and
STRUCTURE, never by a colour shift, and never by red.
- **Comparison** (you vs competitor, sampling dot rows, crawler seen/not-seen):
  a quantity shown as *less*, so it steps **DOWN** — Harbour text, lighter
  dots. See `SamplingCard`.
- **Flagged failure** ("not mentioned", a failing check, a form error): a
  finding that demands attention, so it steps **UP** to full ink, and the
  loudest of them inverts to a navy fill with white text. See `ReportPreview`
  and the home hero's "not mentioned" flag.

**Emphasis steps down, not up.** Navy fill is already the loudest thing
available on paper, and it is what the *default* state wears. So the one
emphasized element in a set is marked by the OTHERS stepping down to
paper-dim/ink-faint — see the `hot` stage in the how-it-works pipeline. The
same inversion applies to `Chip`, whose default is now the solid navy fill and
whose quiet variant is `tone="outline"`.

**Recurring components** (in `components/`, reuse — never fork): Plume /
Lockup (the mark) · Chip (`tone`: `solid` default | `outline` | `sky`; the
weir `gold` boolean is gone) · ArtifactCard (square, navy header bar) ·
SamplingCard (side-by-side you-vs-competitor dot rows, competitor half stepped
down) · DataChips · StepList (joined cells, numbered tabs) · HonestyBlock ·
BottomBar (persistent bottom CTA band, no decorative wave) · the product-mockup
card (hero answer card pattern).
Long-form home only: RuleEyebrow (rule + tracked label, `onDark` for navy
bands) · FeatureCard · FoundationList · AnswerCompare · EngagementSteps (navy
band) · FreeCheckPanel (navy panel) · ClosingCta (navy band). Their copy lives
in `lib/home.ts`, not in the page.

**Alignment (settled 2026-07-25).** One rule, applied everywhere: **the page
head centres, the body does not.** The head is the h1, the lede under it, and
the closing `<Cta centered />`. Everything below stays left-aligned, because
it is content people read or scan: founder bios, article lists, tier cards,
FAQ answers, the /our-score table, and every form label and input. Centring
multi-line body copy costs readability and buys nothing. Two pages are fully
centred by founder decision because they are short one-line sections rather
than body copy: `/contact` and `/our-score`. `/404` is fully centred too.

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

- Validation loop for every change: write → `npm run build` → `npm test` → screenshot review (visual.spec.ts emits 390/768/1440px full-page
  shots to `tests/screenshots/`) → commit.
- Build order follows scaffold.md §7. Steps 1–5 have no open-item
  dependencies; `/sample-report`, `/learn` content, and the launch pass wait on
  the open items in website-plan.md §6.
- Vercel: every branch gets a preview deploy; run the Playwright suite against
  the preview URL before promoting to production.
- Keep `website-plan.md` §6 (decisions & open items) current — when a
  placeholder resolves (brand, pricing, sample run), update the doc in the same
  commit as the code change.
