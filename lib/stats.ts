/**
 * Cited statistics used by StatTiles. Every statistic carries a named source —
 * copy rule from website-plan.md: no numbers without attribution.
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
    text: "of U.S. consumers used AI tools to find local businesses last year — up from 6% the year before.",
    bold: "up from 6%",
    source: "BrightLocal, 2026",
    url: "https://www.brightlocal.com/research/",
  },
  {
    value: "3× fewer",
    text: "businesses appear in AI answers than in traditional search results. The shortlist got smaller.",
    bold: "The shortlist got smaller.",
    source: "Sterling Sky / Places Scout, 322-market study",
    url: "https://www.sterlingsky.ca/",
  },
  {
    value: "2 of 3",
    text: "informational Google searches now show an AI-generated answer above the results.",
    bold: "AI-generated answer",
    source: "Whitespark, 2025",
    url: "https://whitespark.ca/",
  },
];

/**
 * Footnote stat for /how-it-works §2 (sampling). Lives here per the
 * every-stat-has-a-source rule.
 */
export const SAMPLING_FOOTNOTE: Stat = {
  value: "65–81%",
  text: "of results turn over between repeat runs of the same query.",
  source: "SE Ranking, 5,000-keyword study, 2025",
  url: "https://seranking.com/blog/ai-overviews-research/",
};
