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
| layout | Header, Footer | Organization + WebSite + ProfessionalService (site-wide) |
| / | Hero, StatTile×3, problem section, what-we-do, StepList, HonestyBlock, ReportPreview, Cta | WebPage (inherits Org/WebSite/Service) |
| /free-check | Slim header, FreeCheckForm, what-you'll-get list | WebPage + BreadcrumbList |
| /sample-report | ReportPreview (full), annotations, Cta | WebPage + BreadcrumbList |
| /how-it-works | FaqSection (question-form H2s), HonestyBlock, Cta | WebPage + BreadcrumbList + FAQPage |
| /pricing | 3 tier cards, FaqSection, Cta | WebPage + BreadcrumbList + Service ×2 + FAQPage |
| /learn | article index, Cta | CollectionPage + BreadcrumbList |
| /learn/[slug] | markdown render, byline, Cta | WebPage + BreadcrumbList + Article |
| /about | founder bios, Cta | AboutPage + BreadcrumbList + Person ×2 |
| /our-score | audit-results table (hand-authored JSON at first), Cta | WebPage + BreadcrumbList |
| /contact | email, scheduling embed, Cta | ContactPage + BreadcrumbList |
| /privacy | legal notice | WebPage + BreadcrumbList |

**The graph is `@id`-linked (2026-07-31).** Before this, Organization and
ProfessionalService were two same-named, same-URL nodes with no `@id` and no
relation, which is an entity an engine cannot resolve to one company.
`lib/schema.ts` now exports `ORG_ID`, `SITE_ID` and `SERVICE_ID`; every node
that refers to the company points at `ORG_ID` instead of restating it, both
founders get stable Person `@id`s, and each page's WebPage node declares
`isPartOf: SITE_ID`. `Organization.logo` points at the generated
`app/icon.png`. `Organization.sameAs` is still empty and stays that way until
real company profiles exist (open item) — an invented profile URL is worse
than none.

`FaqSection` is the key pattern: one data structure `{question, answer}[]` renders
both the visible H2/paragraph content AND the FAQPage JSON-LD — schema can never
drift from visible text (the thing your own Cat 5 validator checks for).

---

## 4. GEO wiring (rubric → code)

- **robots.ts** — explicit `Allow: /` groups for every token in
  `lib/crawlers.ts`, plus `*`. Point at sitemap.xml. **The roster was widened
  2026-07-31** from seven tokens to the full answer-engine set: the original
  list was all *training* crawlers, and named none of the bots that fetch a
  page in order to answer a live question (OAI-SearchBot, ChatGPT-User,
  Claude-User, Perplexity-User, Googlebot, and friends). `*: Allow: /` did
  cover them, but the whole reason the explicit list exists is that it survives
  a later `*` change — and it is the same list /our-score publishes traffic
  against. geo.spec.ts now iterates `AI_BOT_TOKENS` rather than hardcoding
  names, so robots.txt and the roster cannot drift apart.
- **Metadata** — per-page `export const metadata` (unique title ≤60 chars,
  description ≤155, OG tags). **Canonical is `alternates.canonical` on each
  page, NOT `metadataBase`** — `metadataBase` only resolves relative metadata
  URLs and emits no canonical tag at all. This doc asserted otherwise until
  2026-07-31 and the site shipped with zero canonicals as a result. Site-wide
  `robots` metadata sets `max-snippet:-1` / `max-image-preview:large` /
  `max-video-preview:-1`; `/404` overrides with noindex.
- **JSON-LD** — emitted as `<script type="application/ld+json">` from server
  components via `lib/schema.ts` builders; present in raw exported HTML. The
  per-page WebPage + BreadcrumbList block comes from `components/PageSchema.tsx`,
  which is handed **the page's own `metadata` object** rather than a second copy
  of the title and description. That is the FaqSection pattern applied to page
  metadata: there is no second string to drift.
- **/feed.xml** — RSS 2.0 over `getAllArticles()`, a Route Handler with
  `dynamic = "force-static"` (same pattern as `app/security.txt/route.ts`).
  Linked from /learn and the article pages via `alternates.types`.
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

### 6a. Reading the queue (`scripts/leads-visibility.sql`, applied 2026-07-28)

An email goes out when a lead lands (§6b), but **the queue is the record and
the email is only a prompt to look at it.** Right now that email reaches Abhi
only, so until §6b's domain item is done, Josh finds out by being told or by
reading the queue. Read the queue with the **`leads_reader`** role — never the `postgres`
superuser string. Password is out-of-band (password manager, not git):

```sql
select * from public.leads_queue order by created_at desc;   -- age + sla_state per lead
select * from public.lead_sla_events order by recorded_at desc;  -- what blew the promise
```

`leads_queue` adds `age` and `sla_state` (`ok` / `due` at 24h / `overdue` at
48h / `worked` once status leaves `new`). Thresholds are wall-clock hours, not
business days, so a Friday lead flags on Sunday — early is the safe direction.

An hourly `pg_cron` job, `record-lead-sla-breaches`, writes one
`lead_sla_events` row per lead per level, so a missed lead leaves a permanent
record instead of just aging quietly. It is idempotent (`unique (lead_id,
level)`), verified end to end 2026-07-28.

**The default-privilege footgun.** This project carries Supabase's stock
`pg_default_acl`, which grants ALL to `anon` and `authenticated` on every new
table/view `postgres` creates in `public`. That is where `leads`' unused
`authenticated` grants came from — not from any script here. **Any new table
starts fully exposed and is safe only by RLS accident.** Revoke explicitly, as
`leads-visibility.sql` does for every object it creates.

### 6b. Email alerts (`scripts/lead-email-alerts.sql`, APPLIED 2026-07-30)

Live on the project in `lib/site.ts`. `pg_net` + an AFTER INSERT trigger on
`leads` + a send from `record_lead_sla_breaches()`, all going through
**Resend**. Four alert kinds: `new_lead`, `phone_optin` (the second row the
confirmation screen inserts), `sla_due` at 24h, `sla_overdue` at 48h. All four
paths were tested end to end against the live project on 2026-07-30 with real
inserts, which were then deleted.

Four things that are load-bearing, not incidental:

- **The trigger can never cost us a lead.** It catches every exception and
  still returns `NEW`. A missing Vault key raising inside the INSERT would
  give PostgREST a 500, and FreeCheckForm would show "That didn't send" to a
  prospect whose details we then would not have.
- **There is an hourly cap of 20 alerts.** The publishable key is public and
  PostgREST has no per-IP rate limit on the free plan, so the insert path is
  otherwise a button for burning our Resend quota. Past the cap, sends are
  recorded as `kind='flood'` instead.
- **pg_net is fire-and-forget, so failures are reconciled.** `send_lead_alert`
  logs the request id to `public.lead_alert_log`; a 5-minute cron job
  (`reconcile-lead-alerts`) joins it to `net._http_response` and fills in
  `status_code` / `error`. **Any row with a non-null `error` is an alert that
  did not arrive.** Without this the channel fails silently, which is worse
  than no channel because you stop checking by hand.
- **ONE recipient, and that is not a preference.** `DOMAIN` in `lib/site.ts`
  is still the interim Vercel URL, so there is no domain to verify with Resend
  and the sender is its shared `onboarding@resend.dev`. Confirmed against the
  live API 2026-07-30: Resend then refuses any send whose `to` contains an
  address other than the account owner's, with `403 validation_error`, and
  **the whole send fails**. Putting `joshuanoji@gmail.com` back today does not
  give Josh the mail, it stops Abhi getting it too. Add him back in the same
  edit that points `sender` at a verified domain, not before.

**THE NEXT STEP HERE IS BUYING THE DOMAIN**, which is already an open item in
website-plan.md §6. Verify it with Resend, set `sender` to `alerts@<domain>`,
then restore the second recipient.

The Resend API key lives in Supabase Vault as `resend_api_key`, never in git.
Recipients live in one place: the `recipients` constant in
`public.send_lead_alert`.

**Resend is a subprocessor and `/privacy` names it** ("Who else can see my
details?"). It is contacted by Supabase, not by the browser, so it is **not** a
`connect-src` entry in `vercel.json`.

## 6c. Crawler log (`/our-score`) — built 2026-07-28, NOT YET FED

**The panel renders nothing today, on purpose.** `lib/crawler-hits.ts` exports
`null` until real logs are ingested, and `CrawlerLogSection` returns `null` when
there is no data. Placeholder counts are not an option here: they would be
invented numbers about third-party crawlers, on the page whose entire argument
is that measurement should be inspectable.

**Why it exists.** Vercel Web Analytics counts humans only. A JS beacon cannot
see an AI crawler, because crawlers do not execute JavaScript, so the one
question this company exists to answer about its own site ("is GPTBot actually
fetching us") was the one thing the site could not see.

**Why it is not fed yet (verified 2026-07-29):**

- This site is a **static export**, so it runs no serverless or edge functions
  and emits **no Vercel runtime logs at all**. The runtime-log API returns zero
  rows for `prj_IOOQvIqOph6ouyETt2uMpp8UqNmA`, and that is structural, not a
  retention window.
- CDN **access logs** are the only place a crawler page fetch appears, and
  reaching them needs a **Log Drain**, which is Pro and above. The account is
  currently Hobby (the API returns the `Hobby 1h` retention notice).

**To turn it on:**

1. Upgrade to Pro and add a Log Drain delivering **NDJSON**.
2. `node scripts/ingest-crawler-hits.mjs <logs.ndjson>` — rewrites
   `lib/crawler-hits.ts`. It reads the bot roster out of `lib/crawlers.ts`, so
   the script cannot drift from the site, and it **fails closed**: if nothing
   matches a roster bot it writes nothing and exits 1, rather than publishing
   zeroes it did not measure.
3. `npm run build && npm test`.
4. **Update `/privacy` in the same commit.** A Log Drain ships every request
   log, including human IPs, to a new destination. That is a new subprocessor
   and a processing change, which is the same rule the analytics invariant
   states in CLAUDE.md. `/privacy` already carries a **"Do you keep server
   logs?"** entry describing the logs Vercel keeps as host; it ends with a
   promise that we will name any destination *before* forwarding starts. So
   activation means naming the drain there and deleting that last sentence,
   and doing it in the commit that enables the drain, not after.

**The roster is single-source.** `AI_BOTS` lives in `lib/crawlers.ts` and
`app/robots.ts` imports it. The list of bots we allow and the list we publish
traffic for must be the same list, or the page reports on a bot we quietly
stopped allowing. `robots.txt` output is byte-identical after the move.

### 6d. Liveness canary (`scripts/canary-leads.mjs`, built 2026-07-31, SQL NOT YET APPLIED)

**The problem it exists for: every failure of the lead path is silent.** When
the publishable key stopped working, PostgREST returned 401, so there was no
row, no `lead_alert_log` entry and no email, while `FreeCheckForm` still showed
the prospect "your report is on the way". Nothing anywhere went red. It was
found only because someone ran `verify-leads-backend.mjs` by hand, and we still
cannot say how long it had been broken or how many leads it ate.

**What runs.** `.github/workflows/leads-canary.yml`, hourly at :30 UTC, runs
`npm run canary:leads`. The probe fetches the deployed `/free-check`, extracts
the Supabase URL + publishable key **from the JavaScript Vercel is actually
serving**, POSTs a submission with them, and asserts 201 plus a still-blocked
SELECT. Alerting is GitHub's own workflow-failure email, deliberately: the
thing most likely to be broken in an incident is the Supabase + Resend path we
would otherwise alert through.

Reading the key off the live bundle rather than `lib/site.ts` is the whole
point. Checking the repo's key proves the repo is fine, which is not the
question. The two differ whenever a deploy is stale, a build is misconfigured,
or a key is rotated in Supabase but not shipped. Verified 2026-07-31: the key
appears **only** in `/_next/static/chunks/*.js`, never in the HTML, and those
URLs carry Vercel's `?dpl=` suffix, so the chunk scan is load-bearing.

**`scripts/lead-canary.sql` MUST be applied before the schedule is enabled.**
A canary writes a real row to `public.leads`, so it hits every mechanism built
for prospects: the `lead_arrived` trigger mails a fake lead (24/day, each one
counting against the 20/hour Resend cap that real leads need), and
`record_lead_sla_breaches()` mails an "overdue" alert at 24h because it selects
`from public.leads where status = 'new'` — the table, not `leads_queue`. The
SQL suppresses the first with a `WHEN` clause on the trigger and the second by
reaping probe rows every 15 minutes, long before they can age into a breach.

It marks rows with `source = LEAD_CANARY_SOURCE`, **not** a new `status` value.
Tagging by status cannot work: the anon INSERT policy asserts `status = 'new'`
(`harden-leads-rls.sql:57`) and RLS `WITH CHECK` runs *after* BEFORE-INSERT
triggers, so a trigger setting `status := 'canary'` makes the policy reject the
row and the canary reports 403 forever. `status` is also outside the
column-scoped anon INSERT grant. `source` is inside it and needs no policy
change.

The SQL recreates one trigger and adds one reaper. It does **not** rewrite
`notify_new_lead()`, `send_lead_alert()`, `record_lead_sla_breaches()` or
`leads_queue`, because those have drifted from git once already (the recipient
list, commit `1f88724`) and replacing a body to add one predicate would
silently revert whatever else changed live.

`verify-leads-backend.mjs` now posts the same marker, so it no longer mails a
fake lead on every run and its row is reaped too. That is what makes it safe to
run routinely as the pre-deploy gate `npm run verify:leads`.

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
