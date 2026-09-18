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
'export'`), deployed on Vercel. **Design reference: `mockup/sable-site.dc.html`
(the "Sable" system, imported from Claude Design 2026-09-14 — read it before
styling anything).** It is a Design Components file: the markup and the data
behind every section read as source, but it needs the Claude Design runtime to
render, so treat it as the spec rather than a page to open. Its Google Fonts
`<link>` is fine because it is a local reference and never ships.
`mockup/sable-brand-sheet.html` (the "Berkeley" system, 2026-08-02) stays
canonical for the mark only: plume geometry, the reduction rule and the lockup
(§01–§03, §07). Its type and palette are superseded. `mockup/weir-style.html`
and `weir-*.jpg` are the 2026-07-20 system, kept only to read old commits
against. The IBM Plex mockups before that were deleted 2026-07-25; `git show
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
mobile-safari (iPhone)**. WebKit is not optional here: `Header` is
`position: fixed` with a `backdrop-filter` on every page, and its dress is
picked with `:has()`, all of which Safari handles differently. `visual.spec.ts`
writes chromium shots to `tests/screenshots/` (the design-critique loop) and
WebKit shots to `tests/screenshots/webkit/`; diff the pair when touching
anything fixed-position. Browsers install with
`./node_modules/.bin/playwright install chromium webkit`. After a Playwright
upgrade every browser test fails in 0ms with "Executable doesn't exist" until
you do; the ~390 checks that need no browser still pass, which makes the run
look half-green.

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
`components/` (Header, Footer, Cta, ClosingCta, Beams, Eyebrow, StatTile,
CapabilityRow, FindingsPanel, StageTabs, HonestyBlock, FaqSection,
ReportPreview, FreeCheckForm) · `lib/` (`site.ts` brand/NAP/pricing constants,
`home.ts` home copy, `offers.ts` tiers, `sample.ts` illustrative data,
`schema.ts` JSON-LD builders, `stats.ts` cited statistics) · `content/learn/`
(articles as markdown) · `tests/` (geo.spec.ts, funnel.spec.ts,
visual.spec.ts, security.spec.ts) · `public/`.

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
  ChatGPT" is banned); visibility numbers are sampled rates ("3 of 5 runs": K=5 on
  every measurement, across five engines),
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
- **The home hero's domain field is a plain GET form**, not an island: it
  navigates to `/free-check/?site=…` and the real form prefills from the param
  after mount. Keep it that way. Turning the fold's primary action into client
  JavaScript would put the site's main call to action behind hydration.
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
  `scripts/make-brand-assets.py`, which reads `BRAND` and `OFFER_TITLE` from
  `lib/site.ts`, the hero headline from `lib/home.ts`, and pulls both families
  out of the woff2 `next/font` already downloaded into `out/` (weight 400
  exists in Libre Franklin, its italic and JetBrains Mono, so `face()` matches
  on family + weight + style — matching weight alone returns whichever
  `@font-face` the CSS concatenation happened to put first).
  **Re-run it when the brand name, the hero headline or the palette moves**,
  or every link shared anywhere keeps the old card. Last regenerated
  2026-09-14 for the Sable system. It needs a venv with Pillow, fontTools and
  brotli; the system Python has none of them.
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

## Design system (locked 2026-09-14 — the "Sable" system; canonical: `mockup/sable-site.dc.html`)

Replaces the "Berkeley" system (locked 2026-08-02,
`mockup/sable-brand-sheet.html`), which set Cormorant display type over warm
paper, rationed Sky to navy bands and carried the long-form home. Before that,
the "weir" system (`mockup/weir-style.html`). What each page kept, what was
softened and what was held back from the design are product decisions, recorded
in website-plan.md §6.

**The mark** (`components/Plume.tsx`, geometry from brand sheet §01). Three
rising plumes. Each is a teardrop — `border-radius: 60% 60% 60% 0`, three
rounded corners and one square heel — and all three sit on a shared baseline.
Every dimension derives from one unit `u`: heights `1.7u · 2.3u · 2.9u`, gap
`0.3u`. `Plume` takes `u` and nothing else, because brand sheet §07 forbids
stretching, squashing and re-proportioning. **§03 reduction rule:** under 20px
tall the mark drops to two plumes, under 16px to one; `Plume` applies it
itself, so callers just pass a smaller `u`. Colour follows the Sable design:
the two short plumes are the ground's ink at two strengths and the tallest is
Sky, on dark and on light alike (`tone`: `light` | `dark` | `header` | `mono`;
`header` reads CSS variables, so the mark follows the header's dress).
`Lockup` = mark + wordmark in Libre Franklin 500 + optional tracked subline.
`layout="row"` sets the subline on the wordmark's baseline (header);
`layout="stack"` stacks it in mono (footer). The wordmark renders `BRAND` from
`lib/site.ts`, never a literal. **The header lockup carries the "AI SEO"
subline** (Josh, 2026-08-02).

**Typography.** Two families. **Libre Franklin** carries everything a person
reads: headings at 600 with tight negative tracking via `.display`, body at
400, and the one light hero headline at 300 via `.display-light`. **JetBrains
Mono** carries eyebrows, labels, sources, data cells and the compact buttons,
uppercase with wide tracking (.1–.16em). Both via `next/font/google`
(self-hosted at build; never a fonts CDN `<link>` — it would break the static
export). Nothing is heavier than 600.
- `.display` in globals.css is **deliberately unlayered**, so it beats the
  `font-bold` and `tracking-*` utilities on headings across the site without
  touching any of them. `.display-light` comes after it and wins when both are
  set.

**Tokens** (`app/globals.css` `@theme`). One navy hue over a cool grey ground.
ink `#0e2340` (headings, fills) · accent `#12325c` (links) · ink-soft `#3c4c66`
(body) · ink-faint `#5e6e88` (labels, meta, sources) · ink-dim `#8c9bb5`
(**non-text only**) · slate `#4a5b80` (second chart series, the stepped-down
side of a comparison) · paper `#ffffff` (cards) · paper-dim `#eef1f5` (the
ground) · inset `#f7f9fc` (rows inside a white panel) · frost `#f4f7fb` /
frost-dim `#e7ecf4` (light panels on a dark band, and their header strip) ·
night `#04080f` (dark bands, footer) · sky `#7fa6d9` · cobalt `#2f6fd0` · line
`#e1e8f2` / line-dark `#d5ddea` · track `#dce4ef` · field `#c9d5e6` (inputs) ·
the status pairs risk, caution, ok and note (text on its own tint, chips only) ·
shadows `card`, `float` and `glass`, and no fourth.
- **The contrast ratios are the invariant, not the hex values.** On the ground,
  ink-soft is 7.7:1 and ink-faint 4.56:1, which makes ink-faint the floor for
  any text. The design also set meta text in `#8c9bb5` (2.8:1 on white), so
  every text use of it moved to ink-faint. Each status pair is at least 5.5:1.
  Re-measure before changing any of them.

**The two bright notes, and neither crosses over.** **Sky is the bright note on
dark:** eyebrows, the headline accent, and the fill of the primary button on a
dark band (`.btn-sky`). **Cobalt is the bright note on light:** the headline
accent, bars, list dots and the compact form button (`.btn-cobalt`). Cobalt is
4.9:1 on white but 4.3:1 on the ground, so on the ground it is large text or a
mark only; that is why the /sample-report numerals are accent, not cobalt. The
Berkeley "Sky once per navy band" rule went with that system.

**Ground and bands.** The ground is flat `paper-dim`; white sections and white
cards step up from it. The dark device is a full-bleed `night` band. A band that
opens a page, or carries the home's steps or its close, sits on the light beams
(`Beams`: `hero` | `band` | `page`): stacked CSS gradients cut with
`clip-path`, decorative, `aria-hidden`, and faded so copy always sits on
near-black. Dark on the home: the fold, How it works, What you get, the closing
band. Dark heroes elsewhere: /how-it-works and /about. **A page whose first
section is dark marks that section `data-hero="dark"`.** That one attribute
dresses the header light-on-dark and lets the hero run up behind it
(`body:has(...)` in globals.css). Forget it and the page gets a light header
over a dark hero.

**Header.** Fixed, 72px, translucent with a backdrop blur, in one of two dresses
chosen by `data-hero` as above. `.site-main` pads every other page by 72px so
content starts below the bar. The dress is a set of CSS variables (`--hdr-*`,
`--plume-*`) consumed by `.nav-link`, `.nav-on`, `.nav-cta` and `.nav-panel`, so
`MobileNav` follows it without knowing the page. **There is no bottom CTA bar**
any more (removed 2026-09-14): the fixed header's CTA is the ≤1-click route to
/free-check on every page.

**Shapes and buttons.** Radii: 10px inputs and compact buttons, 11px buttons,
12–14px tiles and tier cards, 16px panels and artifact cards, 18px the console,
22px panel wells, 30px the shift chart card, 999px pills. **Buttons are `.btn`
plus one tone:** `.btn-navy` (primary on light), `.btn-sky` (primary on dark),
`.btn-cobalt`, `.btn-white` (on a navy card), `.btn-ghost` (secondary on dark),
`.btn-outline` (secondary on light), with `.btn-mono` as the compact modifier.
Radius, weight and tracking live in globals.css and are unlayered, so a
`rounded-*` or `tracking-*` utility at the call site loses silently; padding and
font size stay at the call site. The header CTA is its own outline pill
(`.nav-cta`).

**Motion** (revised 2026-09-14, Josh: "make it feel more premium"). All CSS
(one island only moves the console's stage on), no library, reduced-motion
safe, and none of it ever keeps a word out of the raw HTML. Five kinds, and a
sixth needs a reason, not a preference:
- **Reveal** (`data-reveal`, toggled once by `ScrollReveal`): fade, rise and
  de-blur on a long expo ease. Variants: `fade`, `scale`, `left` / `right`
  (sideways from md up only, so a phone never widens mid-animation), `stagger`
  (the children cascade 70ms apart; short lists only, while long lists such as
  an FAQ put `data-reveal` on each item) and `draw` (the chart). Rate bars
  (`.bar-fill`) fill once their panel arrives.
- **Scroll depth** (scroll-linked, inside `@supports (animation-timeline:
  view())`): a dark hero's `.beams` sink while its `.hero-copy` lifts away and
  dims; a dark band's beams drift as it passes; `.depth-in` objects (the shift
  chart, the capability panels, the console) settle from 94%. **Never put
  opacity or a filter on an ANCESTOR of a glass card**: it makes that ancestor
  a backdrop root and the card's blur goes flat. That is why `.hero-copy` goes
  on the home hero's headline and copy, never on its panel column, and why
  `LiveAnswer`, `StageTabs` and the home steps' glass cards carry their own
  reveal (the steps are a stagger's children, and a stagger container never
  fades). A `.depth-in` element must not use the `scale` reveal variant.
- **The chart draw** and **the typing loop** in the hero's live customer
  questions (`LiveAnswer`, the `.prompt-*` rules, cut for six questions; it
  throws at build time if the count changes).
- **The header fill** over a dark hero.
- **The console's stage bar** on /how-it-works: the checked tab's bar fills and
  hands on to the next stage, and the panels crossfade. The timing is CSS; the
  one script is the behavior-only `StageAutoplay` island that moves the radio
  on ("Interactive without JavaScript" below).
Everything animates opacity, translate, scale or filter, never a layout
property, using the individual `translate` / `scale` properties so scroll depth
and reveal compose. Nothing pins, hijacks or smooths the scroll. Put a reveal
on a wrapper, never on a `.btn`, whose hover transition it would replace.

**Interactive without JavaScript.** The /how-it-works console (`StageTabs`) is
four visually hidden radio inputs and `:has()` selectors: every stage's copy is
in the raw HTML, the tabs are a keyboard radio group, and the console needs no
script to work. The first panel shows by default, so a browser without `:has()`
still shows stage one. The selectors are written for four stages, and
`StageTabs` throws at build time if the count changes.
- **Autoplay is an enhancement on top** (Josh, 2026-09-14). `StageAutoplay` is
  a behavior-only island like `ScrollReveal` and renders nothing. The checked
  tab's bar fills over `--stage-dwell` (6.4s, in `globals.css`), and on
  `animationend` the island checks the next stage, looping. It only ever sets
  `checked`, so the radio group always names the stage on show. The first
  click or arrow key on a stage stops it for good: script-set `checked` fires
  no event, which is how the two are told apart. Keyboard focus in the
  console, the console off screen and a hidden tab pause it; reduced motion
  never starts it. The panels share one grid cell and crossfade, so nothing
  below the console moves when a stage changes. `security.spec.ts` proves the
  island runs under the hash-pinned CSP and that a click stops it.
- **Each stage shows its own card** (Josh, 2026-09-14): the question set on
  Measure, the audit findings on Diagnose, the fix list on Improve and the
  re-run on Track (`ConsoleCards`). The copy and the cards are two stacks
  (`.stage-stack` > `.stage-slot`) that switch together, and every card is in
  the raw HTML whichever stage is showing; `tests/pages.ts` pins the Track
  card's title to prove it.

**A chart is a measurement artifact.** Server-rendered inline SVG only: every
value must survive JS-off, which is both the static-export invariant and how
the engines we audit will read it. No charting library. Real `<text>` nodes,
never paths, so the numbers stay quotable. Measured data is solid; anything
extrapolated is dashed inside a tinted zone and labelled as a projection.
Methodology caveats ship next to the chart, not behind a link.
- **The home shift chart draws readings plus the SOURCE'S OWN projection, and
  never ours** (stripped 2026-09-17, "strip it down to just the bare
  minimum"; made starker 2026-09-18, the graph "isn't extreme enough. It
  should really demonstrate and exaggerate the shift"). It plots the four
  readings and Forrester's own 2027 point, dashed inside the tinted zone and
  labelled, because that is the point that takes the agentic line above where
  the click line ends. **Our own 2028 pair stays out**, flagged `ours` in
  `lib/stats.ts`, which is the filter the chart applies. A `projected` point
  without that flag is a source projecting its own data and is citable; one
  with it is ours and never renders.
- **Make the reading stark, never the data.** Asked three times over two days
  to push the shift harder, and every lever spent was presentation: a 40
  ceiling instead of 70, a cobalt filled area instead of an ink stroke, a
  heavier stroke on the rising series than the falling one, bigger value
  labels, and the plot at the box's full height with the one-screen fit paid
  for out of PADDING. Nothing is re-based, re-indexed, or extended past what a
  source published, and no value has moved.
  - **Two levers are off the table, permanently.** A baseline above zero, and
    our own extrapolation. Both make the line steeper by lying about it, and a
    chart that overstates its own evidence is the exact failure this company
    sells an audit of. If the shift needs to look bigger than presentation can
    make it, the answer is a better-sourced number, not a steeper axis.
- **The source links and the caveats are the floor, not part of the strip.**
  On a chart they are the last thing to cut, and the answer is "not these". A
  company that audits other people's evidence does not get to hide the
  methodology break in its own.

**Absence has two directions.**
- **Comparison** (you vs competitor, sampling dot rows, crawler seen/not-seen):
  a quantity shown as *less*, so it steps **DOWN** to slate text and paler
  dots. See `SamplingCard`.
- **Flagged finding** (a blocked crawler, absence from a cited source, a
  failing check): a **status chip** in the design's hues, `risk`, `caution`,
  `ok` or the neutral `note`, text on its own tint. See `FindingsPanel` and
  `ReportPreview`. The hues are chips only: never a text colour on their own,
  never a section fill. (The Berkeley "never red" rule went with that system,
  by design.)

**Recurring components** (in `components/`, reuse — never fork): Plume / Lockup
· Eyebrow (dot + mono label, `onDark`) · Chip (`solid` | `outline` | `sky`) ·
Beams · ArtifactCard (white panel, navy mono header strip) · SamplingCard ·
FindingsPanel (a titled panel of finding rows, each with a bar or a note and a
status chip) · StatTile · HonestyBlock · FaqSection · Cta (the closing band on
every page but home) · StageTabs (with `ConsoleCards`, one card per stage). Home only: LiveAnswer (the live customer
questions panel in the design's glass card) · SearchShiftChart (the chart
card) · CapabilityRow · CompareTable · ClosingCta. /sample-report only:
`ReportSections` (one artifact per section of the report, all reading the
illustrative cycle in `lib/sample.ts`) and `ReportPreview` (the retrieval
checklist). Home copy lives in `lib/home.ts` and tier copy in
`lib/offers.ts`, never in the page.

**Width and alignment (revised 2026-09-14).** Every page runs the full width of
the screen (Josh: "make sure it fills the entire width of the page when
fullscreen"). There is no max-width container: `lib/layout.ts` gives each
section the whole row inside a gutter that widens on large screens, and the
header and footer share that gutter. Type is set in clamps that equal the
design at 1440 and keep growing past it, so a 1728 or 2560 screen gets the same
composition larger rather than a 1440 box with margins; nothing changes at 1440
or below. Reading copy keeps a `ch` measure, so a paragraph is never stretched
across a row. Width is filled by the grid instead: from 1600px a text-only head
splits into heading left and copy right (`HEAD_SPLIT`), FAQ sets run two or
three across (`FaqSection columns`), and an article's title column sits beside
its body. Inner pages are left-aligned, as every page in the design is; the
pages once centred by founder decision (/contact, /our-score, /404) went full
width with the rest. The home varies its section heads on purpose ("Section
variation" below).
- **Wide-screen overrides use the `wide:` (1600px) and `ultra:` (2200px)
  theme breakpoints** declared in `globals.css`, never arbitrary
  `min-[1600px]:` variants. Tailwind v4 cannot sort a px breakpoint against
  its rem ones, so an arbitrary px override is emitted before `sm:`/`md:`/`lg:`
  and silently loses to them. The first full-width pass shipped exactly that:
  every wide gutter, gap and column ratio was in the CSS and none applied.
- **The home fold anchors bottom-left** (Josh, 2026-09-14, after the
  Cerebrium homepage). From lg the headline sits in the bottom-left corner in
  three lines, the lede and actions sit bottom-right on its last baseline, and
  and the live customer questions sit behind everything (below). The headline
  is sized from its
  own column (`@container`, `9.6cqi`), so it holds the corner at every width
  and always sets in the same three lines; its `11em` cap holds them where the
  size ceiling leaves slack. It is kept off the corner itself (Josh: "too close
  to the bottom left corner"): from lg its column is inset from the gutter and
  the fold's bottom padding is the fluid `--fold-bottom`, which the copy rises
  with because it sits on the headline's baseline. Placement is grid lines
  only: the markup order is headline, copy, panel, which is what phones and
  crawlers read.
- **The live customer questions are a layer behind the fold, not a column in
  it** (Josh, 2026-09-17: "the live customer questions item be really big and
  sit translucently behind everything", "in the bottom right"). Below lg the
  card is exactly what it always was, in flow and full strength. From lg it
  leaves the flow and fills the fold's right side, anchored `top-[14%]` with
  the gutter inset on the right: one `scale` on the wrapper (2.5x from
  `origin-top-right`) takes the card, its type, its rules and its radii up
  together, so nothing inside LiveAnswer is re-sized and it costs no layout.
  At `opacity-30` the headline, the lede, the actions and the domain form all
  read over it.
  - **It is anchored from the TOP even though the brief said bottom right**
    (Josh, "in the bottom right", then "make it way bigger"). At this size the
    card is taller than the space under the header, so it has to bleed off one
    edge. Scaling from the bottom crops the top, which is the card's label and
    the question being typed, the two things that make it legible as a
    customer asking an engine. Scaling from the top instead bleeds off the
    bottom, and at 1440x900 only about 18px of it goes. Its mass still sits
    right and low, which is what the brief was after.
  - **`pointer-events-none` is load-bearing.** The layer covers the lede, the
    actions and the form, and without it the card would swallow their clicks.
    `funnel.spec.ts` submits that form, so a regression here fails the suite.
  - **The opacity flattens the card's backdrop blur**, which is a bug
    everywhere else (see Motion). It is deliberate for a background layer on a
    night band, where there is nothing behind it to blur but the beams. Do not
    copy the pattern onto a card that is still in front.
  - The headline, the copy and the form block each carry `lg:relative lg:z-10`
    to sit above the layer. An absolutely positioned sibling paints over static
    ones, so dropping the `z-10` puts the card over the copy, and a negative
    `z-index` instead would drop it behind the section's own background.
  **The fold is the one layout that must fit the screen's height.** The card
  used to compete for that height, which is why the grid had two
  viewport-height modes; out of flow it no longer does, so the grid is one
  `lg:grid-rows-[1fr_auto]` and the `tall:` / `short:` variants (`globals.css`,
  53rem, mutually exclusive) now only cap the headline. That cap still
  reserves room for a panel that is no longer in flow, which is conservative
  rather than wrong: at every width measured, `9.6cqi` is the binding term and
  the cap never fires. **The fold now fits 100svh at every viewport measured
  from 1024 to 2560**, where it used to run 24-43px past it at 1440x900 and
  1600x900, because the card is no longer competing for the height. Re-measure
  if the copy or the bottom padding grows.

**Section variation (home, added 2026-09-14).** Josh: the section headings sat
"in the same spot every single time", which made the long scroll feel stale,
and bare text everywhere read as generic. So the home varies where each head
sits and gives text a container where one earns it. Subtly, on purpose:
- **Heads, top to bottom:** the fold bottom-left, the problem left and centred
  beside its chart, the solution centred over the capability rows (its action centred
  under them), the steps band left, What you get mirrored (list left, head
  right, from lg), Why Sable centred, the close left. **No two neighbouring
  sections put their head in the same place**; keep it that way when a section
  is added or moved.
- **Centring is for a short head over a set** (the capability rows, the
  comparison), from md up only. The paragraph under a centred head stays short,
  and phones stay left-aligned.
- **Containers:** the three steps sit in glass cards on the beams, and the
  comparison sits in a white card with our column tinted. Everything else stays
  bare. A third card treatment would be the same repetition in boxes.
- Mirroring and centring are grid placement and alignment only. The markup
  order never changes, so the head still comes first for phones, screen
  readers and crawlers. Inner pages keep left-aligned heads.

**Claim + artifact rule.** No section ships as text-only. Every claim is paired
with a concrete artifact (the findings panels, the shift chart, the console's
stage cards, the query set card, the judge verdict). Every page gets one
signature element (home: the live customer questions; /how-it-works: the
console).

**Sample data honesty.** All illustrative mention-rate numbers come from
`lib/sample.ts` and are labeled "illustrative example" wherever they render.
The Bluequarry dataset is ONE canonical set, and every panel that shows it
computes from it rather than retyping it (the home measure panel, the
/how-it-works console's stage cards). The Track card's second run
(`SAMPLE_RERUN_ROWS`) is the only figure set not derived from `SAMPLE_ROWS`:
modest and mixed on purpose, with Google AI flat, so it cannot read as a
promised result. The hero's live customer questions show no rates at all, and the
businesses their answers name are not named: the answer draws the three it
listed as redacted bars, because nobody has verified eighteen invented names
and the shape of the reply is the point (Josh, 2026-09-16). Never label
invented data as a real or anonymized client — swap in a real run via
lib/sample.ts when one is cleared (website-plan §6).

## Process

- Validation loop for every change: write → `npm run build` → `npm test` → screenshot review (visual.spec.ts emits 390/768/1440/1920px full-page
  shots to `tests/screenshots/`) → commit.
- Build order follows scaffold.md §7. Steps 1–5 have no open-item
  dependencies; `/sample-report`, `/learn` content, and the launch pass wait on
  the open items in website-plan.md §6.
- Vercel: every branch gets a preview deploy; run the Playwright suite against
  the preview URL before promoting to production.
- Keep `website-plan.md` §6 (decisions & open items) current — when a
  placeholder resolves (brand, pricing, sample run), update the doc in the same
  commit as the code change.
