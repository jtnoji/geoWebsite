/**
 * Cited statistics used by StatTiles. Every statistic carries a named source
 * (copy rule from website-plan.md: no numbers without attribution).
 * `value` is the big editorial number; `text` the remainder of the sentence;
 * `bold` is the ONE phrase inside `text` rendered in ink per the bold ration
 * (locked system, see CLAUDE.md "Design system").
 */

export type Stat = {
  value: string;
  text: string;
  bold?: string; // must be an exact substring of `text`
  source: string;
  url?: string;
};

export const HOME_STATS: Stat[] = [
  {
    value: "45%",
    text: "of U.S. consumers used AI tools to find local businesses last year, up from 6% the year before.",
    bold: "up from 6%",
    source: "BrightLocal, 2026",
    url: "https://www.brightlocal.com/research/lcrs-ai-trust/",
  },
  {
    // Verified in substance (research-validation.md §1.2): 5,943 unique
    // businesses in AI local packs vs 18,330 in traditional 3-packs across
    // 322 markets (~3× fewer). Follow-up: pin the exact article URL.
    value: "3× fewer",
    text: "businesses appear in AI answers than in traditional search results. The shortlist got smaller.",
    bold: "The shortlist got smaller.",
    source: "Sterling Sky / Places Scout, 322-market study",
    url: "https://www.sterlingsky.ca/",
  },
  {
    // research-validation.md §1.3: 68% is the LOCAL-BUSINESS average
    // (informational is 92%); "local-business searches" is the wording
    // that matches the 2-of-3 number.
    value: "2 of 3",
    text: "local-business searches now show an AI-generated answer above the results.",
    bold: "AI-generated answer",
    source: "Whitespark, 2025",
    url: "https://whitespark.ca/blog/case-study-the-prevalence-of-ai-overviews-in-local-search/",
  },
];

/* ---- The search-shift chart (home, second screen) -----------------------
   Two measured series and a labelled projection, rendered by
   components/SearchShiftChart.tsx.

   ADDED 2026-08-03. Both sources are new to the site and are NOT yet in
   research-validation.md's verdict table; they are recorded in its §5 pending
   block instead. Treat them as [sourced], not [verified], until someone reads
   the primary pages end to end.

   Why these two series and not a tidier pair: they measure the two halves of
   the thesis for the same country over the same window. They do NOT share a
   denominator, and the chart says so rather than implying one. Search VOLUME
   is not falling and this chart must never be read as saying it is. What is
   falling is the share of searches that end in a click, which is the part a
   business feels. */

/**
 * REVISED 2026-08-03. Projected points bend rather than continue the last
 * measured slope, which is the shape both series have had so far and not a
 * straight run off the end of the data.
 *
 * Two different things wear this flag, and the note under the chart names
 * which is which: the 2027 agentic point is FORRESTER's projection, and the
 * 2028 points on both series are OURS. Ours carry no source line, never appear
 * as a labelled number on the chart, and sit inside a zone the page calls a
 * projection in three places. If that labelling ever comes off, they come off
 * with it.
 */
export type TrendPoint = {
  year: number;
  value: number;
  /** Not measured. Drawn dashed inside the projection zone. */
  projected?: boolean;
};

export type TrendSeries = {
  label: string;
  /** Screen-reader and no-JS sentence. Also what an AI crawler quotes. */
  summary: string;
  points: TrendPoint[];
  source: string;
  url: string;
  /** The methodology caveat, shown under the chart. Never drop it. */
  caveat: string;
};

/**
 * Rising: buying that an AI agent had a hand in.
 *
 * REPLACED Pew's ChatGPT-adoption series 2026-08-03 (Josh). Adoption answered
 * "do people use it", which is no longer the interesting question. This series
 * answers "does it decide the purchase", which is the one a business is paying
 * us about.
 *
 * The trade is honest about its cost: Pew's was four waves of one instrument
 * read straight off the primary page, and this is two points that reach us
 * through trade coverage of a paywalled Forrester report. It is [sourced,
 * secondary] and stays that way until someone reads the report itself. Two
 * things to hold on to while it does:
 *
 * 1. Forrester's own public blog on the same research stresses that most
 *    "agentic" behaviour today is assistive rather than autonomous. The caveat
 *    below carries that, because citing a source past what it will say is the
 *    exact failure we audit other people for.
 * 2. Secondary write-ups of this report disagree with each other on the
 *    baseline (4% is variously placed in 2024 and in Q1 2025) and on the 2027
 *    figure (34% and 35%). The chart plots the conservative reading of each.
 *    If the primary report settles it differently, the primary wins.
 */
export const AGENTIC_SHARE: TrendSeries = {
  label: "U.S. online purchases AI agents influence",
  summary:
    "The share of U.S. online purchases influenced or initiated by an AI agent rose from about 4% in early 2025 to 19% in the first quarter of 2026, and Forrester projects 34% by the end of 2027.",
  points: [
    { year: 2025, value: 4 },
    { year: 2026, value: 19 },
    { year: 2027, value: 34, projected: true },
    { year: 2028, value: 62, projected: true },
  ],
  source: "Forrester Research, 2026",
  url: "https://www.forrester.com/blogs/the-state-of-agentic-commerce-in-mid-2026/",
  caveat:
    "Forrester counts agent-influenced purchases, not autonomous ones, and says most agent use today is still assistive.",
};

/**
 * Falling: searches that still send a click.
 *
 * SparkToro publishes the ZERO-click rate (60.45% in 2024, 68.01% in the first
 * four months of 2026). These points are its exact complement, because the
 * chart needs the line to fall the way the reader's traffic does. Deriving it
 * is arithmetic, not interpretation, and the caveat names the original metric.
 *
 * "Ends in a click" counts a click of any kind, including ones to Google's own
 * properties and to ads. The open-web share is smaller still. Do not relabel
 * this as "clicks to your website": that would overstate a number that is
 * already bad enough.
 */
export const SEARCH_CLICKS: TrendSeries = {
  label: "Google searches ending in a click",
  summary:
    "The share of U.S. Google searches ending in a click of any kind fell from 39.6% in 2024 to 32% in early 2026, the inverse of SparkToro's zero-click rate.",
  points: [
    { year: 2024, value: 39.6 },
    { year: 2026, value: 32 },
    { year: 2027, value: 25, projected: true },
    { year: 2028, value: 16, projected: true },
  ],
  source: "SparkToro with Similarweb, 2026",
  url: "https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click/",
  caveat:
    "SparkToro's 2024 and 2026 waves used different panels, so the pair is directional.",
};

/** The year the dashed present line sits on. Everything right of it is drawn. */
export const TREND_NOW = 2026;

/* ---- What the shift is worth (home, RevenueAtStake) ---------------------
   ADDED 2026-08-03. All three numbers come from ONE study, on purpose.

   The question these answer is "what does absence from AI answers cost", and
   the honest answer is that nobody can price a specific business's absence.
   The market is full of vendors who will: the going rate when this section
   was written was "$680,000 of at-risk revenue for a mid-market company",
   published by a GEO tool on its own marketing site with no method attached.
   That is a manufactured number and we would flag it in a client audit, so it
   is not here and must not arrive later.

   What CAN be sourced is the size of the channel and the exposure of brands
   that ignore it. McKinsey's is the strongest public work on both, so the
   section sizes the channel and then says plainly that the per-business figure
   does not exist. Do not pad this list with a fourth number from a weaker
   source to make the row wider. */
export const REVENUE_STATS: Stat[] = [
  {
    value: "$750B",
    text: "of U.S. revenue will move through AI-powered search by 2028, on McKinsey's projection.",
    bold: "by 2028",
    source: "McKinsey & Company, 2025",
    url: "https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/new-front-door-to-the-internet-winning-in-the-age-of-ai-search",
  },
  {
    value: "20 to 50%",
    text: "of traditional search traffic is what the same study puts at risk for brands that do not prepare for this.",
    bold: "brands that do not prepare",
    source: "McKinsey & Company, 2025",
    url: "https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/new-front-door-to-the-internet-winning-in-the-age-of-ai-search",
  },
  {
    value: "Half",
    text: "of consumers now seek out AI search deliberately, and most say it is their top source for buying decisions.",
    bold: "top source for buying decisions",
    source: "McKinsey & Company, 2025",
    url: "https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/new-front-door-to-the-internet-winning-in-the-age-of-ai-search",
  },
];

/**
 * Why the loss does not show up in the reader's own analytics. This is the
 * load-bearing claim of the RevenueAtStake artifact, so it carries a source
 * like any other number.
 */
export const ATTRIBUTION_NOTE: Stat = {
  value: "6 in 10",
  text: "ChatGPT referrals land on a homepage rather than a specific page, and traffic that arrives without a clean referral tag gets filed as direct.",
  source: "Similarweb, 2026",
  url: "https://www.similarweb.com/blog/marketing/geo/gen-ai-stats/",
};

/**
 * Footnote stat for /how-it-works §2 (sampling). Lives here per the
 * every-stat-has-a-source rule.
 *
 * research-validation.md §1.4: the citable basis is SE Ranking's AI Mode
 * volatility test (5,000 keywords, 5 cities, 15 runs each). General local
 * queries lose ~80% of URLs between same-city runs; explicit-city queries
 * are ~2× more stable. Do NOT cite the separate 10,000-keyword overlap study.
 */
export const SAMPLING_FOOTNOTE: Stat = {
  value: "Four of five",
  text: "URLs change between repeat runs of the same AI query; explicit-city queries are about twice as stable.",
  source: "SE Ranking AI Mode volatility test, 2025",
  url: "https://seranking.com/blog/ai-mode-volatility-test/",
};
