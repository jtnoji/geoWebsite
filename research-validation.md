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
