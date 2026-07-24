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
