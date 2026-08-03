# Research Validation — Site & Roadmap Evidence Base

Compiled 2026-07-21 from a deep-research run: 5 search angles → primary-source
fetches → 115 extracted claims → adversarial verification (3 independent
refutation attempts per claim) on the core stat set. 16 of 18 fully-verified
claims survived with verbatim primary-source confirmation. Items marked
**[verified]** passed the 3-vote adversarial gauntlet; items marked
**[sourced, not adversarially verified]** come from direct primary-source
extraction but didn't complete the verification round.

---

## 1 · Verdicts on the stats the site uses today

| # | Site claim | Verdict | What the source actually says |
|---|---|---|---|
| 1a | "45% of U.S. consumers used AI tools to find local businesses last year, up from 6%" | **CONFIRMED [verified]** | Verbatim on two BrightLocal primary pages: LCRS 2026 (brightlocal.com/research/local-consumer-review-survey/, Feb 11 2026, n=1,002) and the AI & Trust companion (brightlocal.com/research/lcrs-ai-trust/, Mar 10 2026). Also re-confirmed by BrightLocal's newer Consumer Search Behavior 2026 (Jul 9 2026, n=1,227). |
| 1b | "ChatGPT 31%, Google AI Mode 23%" | **CONFIRMED [verified] — cite the right page** | The split lives ONLY on the lcrs-ai-trust page ("ChatGPT is the clear frontrunner… 31%… Google AI Mode 23%"), not the main LCRS page. Cite brightlocal.com/research/lcrs-ai-trust/. |
| 1c | "AI is the #3 local discovery channel" | **CONFIRMED [verified] — phrase carefully** | LCRS 2026: "third most used tool for local business recommendations, behind only Google (71%) and Facebook (59%)." Caveat: the newer Jul 2026 survey shows AI is only the **4th-ranked first-choice channel (8%)** behind Google Search (52%), Maps (9%), social (9%) — say "third most *used* tool," never "third first-choice channel." |
| 2 | "~3× fewer businesses in AI answers" (Sterling Sky / Places Scout) | **CONFIRMED [sourced]** | Exact figures: AI local packs surfaced **5,943** unique businesses vs **18,330** in traditional 3-packs across 322 markets (~32%, i.e. ~3× fewer). Get the exact article URL from sterlingsky.ca before shipping. |
| 3 | "AI answers on 2 of 3 informational searches" (Whitespark) | **NEEDS CORRECTION [verified]** | Whitespark (whitespark.ca/blog/case-study-the-prevalence-of-ai-overviews-in-local-search/, May 12 2025, 540 queries, Houston/Phoenix/Denver, 6 industries): **68% is the OVERALL local-business average; informational queries are 92%**, local-intent 15%, hybrid 97%. Fix the tile: either "2 of 3 **local-business** searches" (68%) or "**9 of 10 informational** searches" (92%). Current wording mismatches the number. |
| 4 | "65–81% of results turn over between runs" (SE Ranking) | **CONFIRMED IN SUBSTANCE — fix URL & phrasing [verified]** | Two different SE Ranking studies exist; the site conflates them. The volatility study (seranking.com/blog/**ai-mode-volatility-test**/, Sep 29 2025, 5,000 keywords, 5 cities, 15 runs each): general local queries lose **>60% of domains and ~80% of URLs** between same-city runs; explicit-city queries are ~2× more stable (≈48% URL / 56% domain overlap vs ~20% URL). The stats.ts URL currently points to a different article — change it. Cleanest phrasing: "four of five URLs change between repeat runs." |
| 5a | "AIO presence cuts top-organic CTR ~34–58%" (Ahrefs) | **PARTIAL — use 34.5% only [sourced]** | Ahrefs' 300,000-keyword study supports **34.5%** lower position-1 CTR when an AIO is present. The –58% upper bound wasn't substantiated in this run; drop it. Caveat worth keeping internally: GSC can't isolate AIO clicks, so all such numbers are indirect estimates. |
| 5b | "only ~1% click AIO sources" (Pew) | **CONFIRMED [sourced]** | Pew (Mar 2025 behavioral data, 900 US adults, 68,879 searches): ~1% of visits with an AI summary produced a click on a source inside the summary; result-link clicks fell 15%→8% when a summary was present (~47% relative drop — a second citable figure). |
| 5c | "88% of AI users verify on review platforms" (BrightLocal) | **CONFIRMED — refine wording [verified]** | Verbatim: "88% of AI users check to see if a review is legitimate (51%) or to see the source (37%)" and **"97% of AI users sometimes double-check AI recommendations"** (lcrs-ai-trust page). The 97% is arguably the stronger stat. |
| 6 | "Yelp 3.4× next source; ~60% home-services citations third-party; Perplexity–Yelp API deal" (Foundation/AirOps) | **MIXED [sourced]** | Yelp 3.4× next competitor over 28M+ AI responses: **confirmed** (plus: 72.5% share on Google AI Mode; 512,680 citations Q4 2025; 62.1% share on Perplexity). But the "~60% home-services third-party" figure and the "Perplexity–Yelp API deal" are **NOT in that source** — the 60% figure traces to a different AI-Overviews citation study. Fix the attribution in smb-pivot-plan.md or drop the claims. |

**Killed by adversarial review (do not use):** "only 2% used AI as their sole
channel" (denominator misread of the Jul 2026 BrightLocal survey), and any
turnover framing based on SE Ranking's *other* study (10,000 keywords, 9.2%
URL overlap — a different measurement, not the 65–81% basis).

## 2 · Technique claims (the audit-rubric questions)

- **llms.txt — SETTLED: it's theater.** Google's Gary Illyes (mid-2025): does
  not support it, not planning to. John Mueller compared it to the abandoned
  keywords meta tag. Google's 2026 guidance names llms.txt in a mythbusting
  section as a tactic that doesn't help. SE Ranking's ~300,000-domain analysis
  found **zero correlation** between llms.txt and AI citations; no major
  platform officially confirms using it. → The roadmap rubric's "llms.txt
  present and valid" check should be dropped or reframed as "note-only, no
  evidence"; the website's no-llms.txt stance is exactly right. High confidence.
- **Schema.org → AI citations — the honest answer is "no, with caveats."**
  The strongest evidence is Ahrefs' controlled study (1,885 pages that added
  JSON-LD Aug 2025–Mar 2026 vs 4,000 matched controls): **no meaningful
  citation lift** on AIO/AI Mode/ChatGPT — AIO actually showed a small but
  significant −4.6%. A companion retrieval experiment found AI systems fetching
  pages directly read only visible HTML and **ignore JSON-LD entirely**.
  Correlational studies conflict (Semrush 304,805 URLs: +22% for cited pages;
  Search Atlas 5.5M responses: no effect). Authors' caveat: schema may still
  help pages with *zero* AI visibility get indexed at all. → Sell schema as
  cheap hygiene + entity clarity, never as a citation driver. The claimed
  "only Bing confirms use" needs its own source — it wasn't in these studies.
  High confidence.
- **JS rendering — confirmed hard requirement.** Vercel + MERJ analyzed 500M
  GPTBot fetches: **zero evidence of JavaScript execution** (GPTBot downloads
  JS 11.5% of the time, never runs it). No major AI crawler — OpenAI's three
  bots, ClaudeBot (fetches JS 23.8%, doesn't execute), PerplexityBot,
  Bytespider — renders JS. Client-side-rendered content is invisible to all of
  them. Your Cat 2/SSR check is on the firmest ground of anything in the
  rubric. High confidence.
- **CDN/WAF blocking — confirmed and growing.** Cloudflare flipped to
  **default-blocking AI crawlers for newly onboarded domains on July 1, 2025**
  (~20% of web traffic; 1M+ customers had already opted in since Sep 2024;
  Pay-Per-Crawl launched alongside). The "many sites block AI bots without
  knowing" pitch is current and strengthening. High confidence.
- **Off-site > on-site for citations — strongly supported.** Foundation/AirOps
  (5.1M responses, 57.2M citations, 50 B2B brands): only **10.15%** of
  citations point to brand-owned domains; in **68% of AI answers the brand's
  own content doesn't appear at all**; AirOps (Oct 2025): brands are **6.5×**
  more likely to be cited via third parties. For B2B prompts the top cited
  sources are **Reddit 21%, YouTube 13%, LinkedIn 13%**. For local: Yelp
  dominance (above). Medium-high confidence (single research group for the
  B2B set — corroborate before making it a headline).
- **Sampling/nondeterminism — supported; your 10× posture is defensible.**
  SE Ranking's volatility data (¶1.4) is the citable basis. Note the roadmap
  doc says 3× runs while the site methodology says 10× — align the docs.

## 3 · Ranked shortlist of citable stats (for lib/stats.ts)

Local/general audience:
1. **45%** of U.S. consumers used AI tools for local business recommendations in the past year, up from 6% — BrightLocal LCRS 2026 · brightlocal.com/research/lcrs-ai-trust/ [verified]
2. **ChatGPT 31% · Google AI Mode 23%** — same source/page [verified]
3. AI is now the **third most-used tool** for local recommendations (Google 71%, Facebook 59%, AI 45%) — BrightLocal LCRS 2026 [verified]
4. **97%** of AI users sometimes double-check AI recommendations; 88% verify reviews/sources — brightlocal.com/research/lcrs-ai-trust/ [verified]
5. AI Overviews appear on **68%** of local-business searches (92% informational, 97% hybrid) — Whitespark, May 2025 · whitespark.ca/blog/case-study-the-prevalence-of-ai-overviews-in-local-search/ [verified]
6. **~3× fewer** businesses appear in AI local answers (5,943 vs 18,330, 322 markets) — Sterling Sky/Places Scout [sourced; pin exact URL]
7. **Four of five URLs change** between repeat AI Mode runs; explicit-city queries ~2× more stable — SE Ranking, Sep 2025 · seranking.com/blog/ai-mode-volatility-test/ [verified]
8. Top result CTR drops **34.5%** when an AI Overview is present (300k keywords) — Ahrefs [sourced; pin exact URL]
9. Only **~1%** of AI-summary views produce a click on the summary's sources — Pew Research Center, 2025 [sourced; pin exact URL]

B2B/startup audience (new — for the repositioning):
10. **51%** of B2B software buyers now start research with an AI chatbot more often than Google, up from 29% ~11 months earlier — G2 "The Answer Economy," Mar 2026 survey (n=1,076 + 39 interviews) [sourced]
11. **69%** chose a different vendor than planned based on AI guidance; **33%** bought from a previously unknown vendor; **64%** encountered inaccurate AI recommendations — same G2 report [sourced] (the 64% is your accuracy-audit pitch in one number)
12. Only **10.15%** of AI-answer citations point to brand-owned domains; in **68%** of answers the brand's own content never appears — Foundation/AirOps, 5.1M responses [sourced]
13. Top cited sources in B2B AI answers: **Reddit 21% · YouTube 13% · LinkedIn 13%** — Foundation/AirOps [sourced]

## 4 · Doc/site changes this implies

1. **stats.ts:** fix the SE Ranking URL (→ /blog/ai-mode-volatility-test/);
   fix the "2 of 3 informational" tile (→ "2 of 3 local-business searches" or
   "92% of informational"); add exact LCRS AI-trust URL; keep 45%/6%.
2. **Sample copy anywhere citing Ahrefs:** use 34.5%, drop "–58%".
3. **smb-pivot-plan.md (geoPromptRunner):** correct the Foundation/AirOps
   attribution (60% third-party + Perplexity–Yelp deal aren't in that study).
4. **Roadmap rubric:** drop llms.txt as a scored check (note-only); reword the
   schema check to hygiene/entity-consistency framing; the SSR and WAF checks
   are your strongest-evidenced items — lead with them in sales material.
5. **If/when the site repositions toward funded startups:** stats 10–13 are
   the hero numbers — especially G2's 51% and 64%-inaccurate (the latter is
   the entire accuracy-judge value prop, externally substantiated).
6. **Align run-count language:** roadmap says 3×/cycle, site says 10× — pick
   one story (the volatility data argues for more, not fewer).

Open follow-ups: pin exact URLs for Sterling Sky, Ahrefs CTR study, Pew
report, G2 Answer Economy, and Foundation/AirOps reports before they go in
lib/stats.ts (source names and figures are verified/extracted; the precise
permalinks weren't all captured before the run was interrupted).

## 5 · Added 2026-08-03 — the home search-shift chart [SOURCED, NOT YET VERIFIED]

Two new series ship on the home page's second screen
(`components/SearchShiftChart.tsx`, data in `lib/stats.ts`). Both were pulled
from the primary pages and both carry a methodology caveat on the page itself.
**Neither has been through the adversarial pass the table in §1 got.** Read the
primary sources end to end and move them up into that table, or correct them.

| Series | Points | Source | Status |
|---|---|---|---|
| U.S. online purchases AI agents influence | 4% (early 2025), 19% (Q1 2026), 34% (end 2027, Forrester's own projection) | Forrester Research, "The Agentic Commerce Inflection Point" / "The State Of Agentic Commerce, Q2 2026". Report is paywalled; figures reach us through trade coverage. Public blog permalink is pinned in stats.ts. | [sourced, secondary] |
| Google searches that end in a click | 39.6% (2024), 32.0% (early 2026) | SparkToro with Similarweb, "In 2026, Less than One Third of Google Searches Still Send a Click", Jun 2026. | [sourced, derived] |

**The rising series changed on 2026-08-03** and the replacement is weaker
evidence than what it replaced. It was Pew's ChatGPT-adoption line (18/23/34/44
across 2023–2026), which was four waves of one instrument read straight off the
primary appendix table. Josh swapped it because adoption is a settled question
and the section needs to speak to purchase influence. Pew's series is still the
better-sourced pair member and is the fallback if the Forrester figures do not
survive review. Four things a reviewer must settle on the Forrester series:

- **Secondary sources disagree with each other.** The 4% baseline is placed in
  2024 by one write-up and in Q1 2025 by another; the 2027 figure appears as
  both 34% and 35%; a third write-up describes a different metric entirely
  (AI-*initiated* transactions, 1.4% in Q4 2024 rising to 11% by Q4 2026). The
  chart plots the conservative reading of each. Read the report.
- **Forrester's own public commentary cuts against the drama.** Its mid-2026
  blog says most agentic experience is still conversational, true autonomy is
  rare, and "hype is running ahead of behavior". The chart caveat says so on
  the page. Do not let a copy edit remove that clause while keeping the line.
- **"Influenced" is doing a lot of work.** It counts assisted research, not
  agents completing checkout. Any copy that reads this as "19% of purchases are
  made by robots" is a misuse of the number.
- **The 2027 point is Forrester's projection, not a measurement**, and is drawn
  dashed for that reason. The note under the chart distinguishes it from our
  own 2028 point by name.

Three things a reviewer should check before this counts as verified:

1. **The click series is derived, not quoted.** SparkToro publishes the
   ZERO-click rate: 60.45% in 2024 and 68.01% for January–April 2026. The chart
   plots the exact complement so the line falls the way a reader's traffic
   does. If that inversion is judged too clever, plot the zero-click rate
   rising instead; the numbers are the same fact either way.
2. **"Ends in a click" is not "clicks to your site."** It counts clicks of any
   kind, including to Google's own properties and to ads. Only about two thirds
   of those clicks reach the open web, so the true figure for the open web is
   worse. The page deliberately does not claim the stronger version. The
   per-1,000-clicks framing was left off entirely because secondary coverage
   reported it two different ways (276 vs 232 per 1,000) and the primary page
   did not settle it.
3. **The zero-click rate is the only measured half of the falling line.** Its
   2027 and 2028 points are ours, like the agentic 2028 point.

Also on the page and unsourced by definition: our **2028 projection** on both
series, drawn dashed inside a tinted zone and labelled as a projection in three
places (the zone label, the caveat line, and the alt text). **Revised
2026-08-03** to bend rather than continue the last measured slope, which makes
it a more aggressive claim than the version reviewed above: the agentic line
runs to 62% and the click line to 16%. It remains the only forward-looking
claim anywhere on the site, so if the no-forecasts posture is meant to be
absolute, this is the thing to cut, and the case for cutting it got stronger
when it got steeper.

## 6 · Added 2026-08-03 — "What the shift is worth" [SOURCED, NOT YET VERIFIED]

`components/RevenueAtStake.tsx`, data in `lib/stats.ts` (`REVENUE_STATS`,
`ATTRIBUTION_NOTE`). Three figures, all from one study, plus one attribution
note.

| Claim | Source | Status |
|---|---|---|
| $750B of U.S. revenue moves through AI-powered search by 2028 | McKinsey & Company, "New front door to the internet: Winning in the age of AI search", Oct/Nov 2025 | [sourced] |
| 20–50% of traditional search traffic at risk for unprepared brands | Same report | [sourced] |
| Half of consumers deliberately seek out AI search, most call it their top source for buying decisions | Same report | [sourced] |
| ~6 in 10 ChatGPT referrals land on a homepage, untagged traffic gets filed as direct | Similarweb, 2026 Generative AI Landscape coverage | [sourced] |

What a reviewer should check:

1. **Every figure is McKinsey's own framing of a market, not of a business.**
   That is the whole design. The section's argument is that the per-business
   number does not exist, so importing one would refute the section.
2. **Three numbers from one study is a concentration risk, not an oversight.**
   The alternative sources for this claim are GEO vendors quoting their own
   models. A fourth number from a weaker source would cost more credibility
   than the wider row would buy.
3. **Explicitly rejected during research** (do not let these come back): a GEO
   tool's "$680,000 of at-risk AI-influenced revenue for the average mid-market
   company" and "$294,000 lost over 24 months", published on its own marketing
   site with no stated method; another vendor's worked example deriving "$75,000
   in monthly recurring revenue" from assumed conversion rates; and Gartner's
   "traditional search volume drops 25% by 2026", which is now testable and
   **failed** (search volume grew; Google reported accelerating query growth
   through 2025). Anyone reaching for a punchy number will find these first.
4. **Read the McKinsey figures against the primary page.** They were captured
   from mckinsey.com and from verbatim quotation of it, not from the PDF.
