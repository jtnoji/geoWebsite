# Launch checklist

Everything on this site that is still a placeholder, an invented figure or an
unrun step, and what has to arrive to replace it. Compiled 2026-09-16 from a
repo-wide sweep plus Josh's answers the same day.

**Status key:** `DONE` · `READY` (we have the value, a step is in the way) ·
`OPEN` (we do not have it yet) · `DECISION` (a founder call, not research).

Close an item by replacing the real thing AND deleting the row. A ticked row
that stays here rots.

---

## 1. Domain, identity, contact

| Item | Status | Where it lands | Notes |
| --- | --- | --- | --- |
| Domain `sableagency.co` | READY | `DOMAIN` in `lib/site.ts` | Bought 2026-09-16, DNS not pointed at Vercel yet. Deliberately NOT swapped in: every canonical, the sitemap, the feed and the OG image URL build from it, and the hourly lead canary fetches it, so a host that does not resolve breaks all of them. Point DNS, flip the constant, rebuild. |
| Contact email `hello@sableagency.co` | DONE | `EMAIL` in `lib/site.ts` | Live 2026-09-16. Renders on /contact and publishes as the disclosure contact in `/.well-known/security.txt`. |
| Business details | OPEN | `NAP` in `lib/site.ts`, `lib/schema.ts` | Legal entity name if it differs from Sable, a street address or the decision not to publish one, a phone number or the same decision, hours if wanted. `telephone`, `priceRange` and `geo` are deliberately absent from the schema until they exist. Holds /our-score "Cat 4: Local presence" at Partial. |
| Profile links | OPEN | Organization `sameAs` in `lib/schema.ts` | Google Business Profile, LinkedIn company page, any directories that should count as the canonical set. Also Cat 4. |
| Google Search Console | OPEN | `GOOGLE_SITE_VERIFICATION` in `lib/site.ts` | Either the HTML-tag token, or verify by DNS TXT and leave the constant empty. Empty emits no tag, which is correct. |
| Scheduling link | OPEN | `app/contact/page.tsx`, /about booking panel | Cal.com or Calendly embed replaces the "comes with launch" stub. Same slot, no layout change. |

## 2. Services and prices

Source: `v1PriceList.pdf` (INTERNAL). Costs, labour hours, margins and capacity
stay in that document and never reach the site. Client-facing facts only below.

**Status: READY on numbers, DECISION on how the site presents them.**

The real catalogue: Snapshot free · Track $49/mo · Track Pro $149/mo ·
onboarding uplift $897 once on month 1 of any plan · Essential $597/mo ·
Growth $1,297/mo · Authority $2,497/mo · AI-Ready Site $697 · additional page
$199 · Site Care $59/mo · edit block $75 per 30 minutes · Full AI Visibility
Audit standalone $1,197. First invoice: Essential $1,494, Growth $2,194,
Authority $3,394; month-to-month after that, 30 days' notice.

The site today shows three tiers in `lib/offers.ts` with `[$X]` prices from
`PRICING` in `lib/site.ts`: the free check, a one-time audit, and an ongoing
retainer. Twelve products do not fit that shape.

Decisions needed before /pricing is rewritten:

1. Which products appear publicly, and in what order. Twelve SKUs on one page
   reads as a price list, not an offer.
2. Whether the free offer becomes Snapshot and is described as directional (10
   questions, 5 platforms, 5 runs, automated two-page report) rather than
   today's "a real measurement, not a teaser" with a 1 to 2 business day wait.
   The internal note says Snapshot "is directional, not a measurement, and
   should be described that way", which contradicts the current copy.
3. How the onboarding uplift is presented so the first invoice is not a
   surprise, given every plan page currently implies one monthly number.
4. Whether Site Care ships at $59 or the $79 the internal margin note argues
   for.
5. Whether per-tier measurement volumes are published at all.

**Blocking conflict, bigger than the prices.** The site's measurement claim is
ten runs per question across four engines, forty answers. The price list is
five runs per question (K=5) across five platforms, six on the full bundle,
with 10, 40, 60 or 100 questions by tier. Until this is settled the following
all state the wrong shape: the home hero and capability copy ("ten times
each"), /how-it-works §2 ("Ten runs, not one screenshot", "10× per engine"),
the FAQ ("Why run the same question ten times?"), the sample dataset (4 engines
× 10 runs = 40 answers) and four test pins. To fix it we need the five platform
names, the sixth that the full bundle adds, and the per-tier question counts
that are safe to publish.

## 3. The sample report

**Status: OPEN.** Every figure on /sample-report, the home panels and the
/how-it-works console comes from one invented scenario in `lib/sample.ts`
("Bluequarry Growth", a b2b marketing agency), labelled "illustrative example ·
not a real client".

A cleared run has to supply:

- Written permission to publish an anonymized version, and how far to
  anonymize (industry and region only?).
- The question set actually run, with intent types.
- Runs per question and the platform list.
- The client's mention count per platform.
- Who was named instead, with counts, and how to anonymize them.
- One verbatim answer excerpt, captured rather than written. The current quote
  on /sample-report is ours, and its "run 3/10" label is invented.
- How many third-party lists the engines cite, and how many name the client.
- The crawler-access finding.
- One accuracy error the judging caught.
- The fix list, with a one-line reason each.
- A second run of the same questions for the console's Track card.
- The real report's page count, to replace "Nine pages".

Fallback if no client clears: run the check on a real local business and
anonymize that. Swapping the dataset also changes the honesty label to a dated
"anonymized client run" and touches several test pins (§10).

Also invented, in the same scenario: the home audit-findings panel rows
("GPTBot blocked in robots.txt", "Product schema missing on 38 pages", "Service
area pages thin", "12 open") and the home sources panel domains
(`industrypub.com` 22, `reviewsite.com` 17, `citylist.com` 11, `yourdomain.com`
6), plus the free-check form's example answers ("Bluequarry Growth", the
unregistered `bluequarrygrowth.com`, "Berkeley, CA"). The scenario notes place
that client in Oakland, so the form and the scenario disagree.

## 4. Our own GEO

**Status: OPEN, committed.** We sell an audit, so we run it on ourselves and
publish it.

| Item | Where it lands | Notes |
| --- | --- | --- |
| A real audit of the deployed site, and its date | `app/our-score/page.tsx` | The Cat 1 to 6 rows are hand-authored and `AUDIT_DATE` reads "Pending first deploy". Run after the domain connects, so the audit is of the real host. |
| Cat 4 status | same | Stays Partial until the NAP and directory items in §1 land. |
| Our own mention-rate tracking | /our-score | The page promises it "starts at launch". Needs our own question set and a first run. |
| Crawler log | `lib/crawler-hits.ts` (currently `null`) | Needs Vercel Pro plus a Log Drain, then `node scripts/ingest-crawler-hits.mjs <logs.ndjson>`. The panel renders nothing until then, by design. **Turning it on requires editing /privacy in the same commit**, because it publishes server-log data about third parties. |

## 5. Statistics to firm up

| Item | Where | Notes |
| --- | --- | --- |
| "3× fewer businesses appear in AI answers" | `lib/stats.ts`, `content/learn/what-is-geo.md` | Verified in substance; both places link the publisher's homepage instead of the study. Pin the article URL in both. |
| Forrester agentic-commerce series | `lib/stats.ts` | Reaches us through trade coverage of a paywalled report, so it is sourced but not verified. Secondary write-ups disagree on the baseline and the 2027 figure; the chart plots the conservative reading. Reading the primary report settles it. |
| The 2028 points on both chart series | `lib/stats.ts` | Ours, not anyone's published projection. Keep only while the page labels them as a projection in all three places. |
| `REVENUE_STATS`, `ATTRIBUTION_NOTE` | `lib/stats.ts` | Orphaned since the redesign removed their section. Delete or re-home. |

## 6. Email, forms and database

| Item | Status | Notes |
| --- | --- | --- |
| `scripts/harden-leads-rls.sql` | OPEN, unrun | Anon can still write `status`, `notes`, `teaser_url` and `audit_run_id`; the shipped policy is `with check (true)` over unbounded text columns. Verify with `node scripts/verify-leads-hardening.mjs` (exit 0 = hardened). |
| `scripts/lead-canary.sql` | OPEN, unapplied | Until applied, every hourly probe emails Abhi a fake lead and burns one of the 20 hourly Resend sends real leads need. Apply, confirm with `npm run canary:leads`, then uncomment the schedule in `.github/workflows/leads-canary.yml`. |
| `scripts/leads-visibility.sql` | OPEN | Ships `password 'CHANGE_ME_BEFORE_USE'`; set a real password immediately after applying. Re-running this file after `lead-email-alerts.sql` silently switches lead emails off, so re-apply the alert SQL after it. |
| Supabase project ownership | OPEN | The project is not on Josh's account and is believed to be Abhi's. Confirm or transfer; whoever owns it runs the SQL above. |
| Alert recipients | OPEN | Alerts go only to Abhi's Gmail, sent from Resend's shared `onboarding@resend.dev`. Josh cannot be added until the sending domain is verified: adding a second recipient before that breaks the whole send. |
| SPF, DKIM, DMARC on `sableagency.co` | OPEN | Before the first report email. Delivery is the product; unauthenticated mail lands in spam and burns the domain. |
| `npm run verify:leads` | OPEN | Run once the domain and keys are final. It writes to the live queue, so not part of `npm test`. |
| DNS CAA record, HSTS preload submission | OPEN | CAA once the domain is bought; preload only when the apex and subdomains are definitely HTTPS-only. |
| `npm audit` at launch | OPEN | As of 2026-07-25 the remaining highs were all in the eslint dev chain. |

## 7. Legal and privacy

| Item | Status | Notes |
| --- | --- | --- |
| Retention 12 months, deletion within 30 days, effective 25 July 2026 | DECISION | Business commitments, not observations. `app/privacy/page.tsx` flags them for Josh's sign-off, ideally counsel's, and the effective date needs to be the real one at launch. |
| `security.txt` expiry | OPEN | Currently 2027-07-25. Bump whenever the disclosure contact is reviewed; the test suite fails once it passes. |
| Analytics wording | OPEN | Confirm /privacy describes exactly what is collected. Any change to analytics changes that page in the same commit. |
| Terms, cookie notice | DECISION | Neither exists today. |

## 8. Copy awaiting sign-off

No research needed, just a yes or no:

- The hero lede, "so your company appears more often in ChatGPT, Google AI
  Overviews, and other AI search results" (`lib/home.ts`).
- The Grow capability line, "We get you into the ones that matter"
  (`lib/home.ts`).
- /sample-report's "The whole report" and "Nine pages", which describe the
  full deliverable rather than the artifacts the page shows.
- The console Track card's second run, 15% to 25% named with Google AI flat
  (`SAMPLE_RERUN_ROWS` in `lib/sample.ts`), the only invented figures added
  since the redesign.
- The three unchecked boxes in `example-swap-plan.md`: both founders approving
  the fictional cast, a re-check that the invented names do not collide with
  real businesses, and the form-example decision. That file says to delete it
  once they close.

## 9. Assets and docs

| Item | Notes |
| --- | --- |
| Brand assets | Re-run `scripts/make-brand-assets.py` whenever the name, hero headline or palette moves. Needs `npm run build` first and a venv with pillow, fonttools and brotli. |
| Founder photos | None today; bios and personal LinkedIn links are real. Supply if wanted. |
| `README.md` | Two-line stub. |
| `CLAUDE.md` line 3 | Still calls the brand "[Brand], name TBD"; it is Sable, locked 2026-08-02. |
| `scaffold.md` | Placeholder section still says `BRAND = '[Brand]'`; only `PRICING` is still `[$X]`. |
| `website-plan.md` brand-asset entry | Dated 2026-08-02 though the assets were regenerated 2026-09-14. |
| `naming.md`, `naming-more.md` | Exploration docs, superseded now the name is locked. |
| `_to_delete/geoweb-src.tgz` and its lockfile | Still tracked in git. |
| `public/` | Referenced by both docs; does not exist. Assets live in `app/`. |
| `mockup/*.html` | Carry their own placeholder logos and LinkedIn URLs. Reference files only; never ship those values. |

## 10. What breaks when the placeholders land

For whoever does the swap, so nothing is discovered in CI:

- **Sample-data swap** touches test pins in `tests/pages.ts`: "Same 40 answers,
  re-run" (pins 40 answers), "The whole report", "mention rate", "what is the
  best restaurant in my area?"; and the funnel fixtures in
  `tests/funnel.spec.ts` (`bluequarry-test.example.com`).
- **Question-count change** hits the hard build-time guard in `LiveAnswer.tsx`:
  exactly six questions, because the typing keyframes in `globals.css` are cut
  into sixths.
- **Domain swap** flows automatically into the canonical, WebPage, feed and
  breadcrumb assertions, since they all derive from `DOMAIN`, but the export
  must be rebuilt and `scripts/canary-leads.mjs` retargets with it.
- **Prices** need no test changes; the pins are tier names only.
- **Visual screenshots** in `tests/screenshots/` are local review artifacts and
  simply regenerate.
- **Gate for every change:** `npm run build && npm test && npm run lint`, plus
  `npm run build && grep -r "\[Brand\]" out/` returning nothing at launch.
