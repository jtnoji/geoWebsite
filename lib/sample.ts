/**
 * THE canonical illustrative sample dataset — every mention-rate figure shown
 * on the site (home showcase, home sampling card, /sample-report) comes from
 * here, so the numbers can never disagree between pages.
 *
 * HONESTY RULE (gtm-legal-readiness + HonestyBlock posture): this is an
 * ILLUSTRATIVE example modeled on real audit runs — no real client's report
 * is published yet. Label it as such everywhere it renders. When a real
 * anonymized run is cleared for publication (website-plan §6 open item),
 * replace these numbers in ONE place and update the label.
 *
 * THE SHAPE IS THE PRODUCT'S (Josh, 2026-09-16): five engines, five runs per
 * question per engine (K=5, the standard on every measurement), so one
 * question is 25 answers. It was four engines at ten runs until the price list
 * and the Track report settled the real method.
 */

import type { SamplingRow } from "@/components/SamplingCard";

/**
 * The fictional scenario cast (example-swap-plan.md §0). Names are INVENTED
 * and verified against real agencies before shipping — never swap in real
 * company names; we put words in AI's mouth about these businesses.
 */
export const SAMPLE_CLIENT = "Bluequarry Growth";
export const SAMPLE_VERTICAL = "b2b marketing agency";
export const SAMPLE_COMPETITORS = [
  "Saltgrass Digital",
  "Fathom & Reed",
  "Pinelock Marketing",
] as const;

export const SAMPLE_QUERY = "best b2b marketing agency for seed-stage startups";

/**
 * Per-engine pairs: the client (blue) vs the top competitor (red) on the SAME
 * engine — the five engines we measure, at K=5 runs each. "AI Overviews" is
 * the short label the reports use in tables; prose says Google AI Overviews.
 * The ChatGPT pair must agree with SAMPLE_CALLOUT.
 */
export const SAMPLE_ROWS: readonly SamplingRow[] = [
  { engine: "ChatGPT", you: 1, competitor: 4, runs: 5 },
  { engine: "Claude", you: 1, competitor: 3, runs: 5 },
  { engine: "Gemini", you: 2, competitor: 4, runs: 5 },
  { engine: "Perplexity", you: 1, competitor: 3, runs: 5 },
  { engine: "AI Overviews", you: 0, competitor: 3, runs: 5 },
];

/** The engine highlighted in the home hero callout. */
export const SAMPLE_CALLOUT = {
  engine: "ChatGPT",
  hits: 1,
  runs: 5,
  competitorHits: 4,
} as const;

/**
 * Share of voice: every business the category's answers named, ordered by how
 * often. This is the artifact for the "Share of voice" metric the site has
 * always listed and never shown.
 *
 * DERIVED FROM SAMPLE_ROWS, NOT INVENTED ALONGSIDE IT. The totals are the same
 * twenty-five answers (five engines x five runs) those rows describe, so the
 * two cannot disagree: the client's 1+1+2+1+0 is this 5, and the top
 * competitor's 4+3+4+3+3 is Saltgrass's 17. Change one and you have to change
 * the other, which is the whole reason both live in this file.
 *
 * It is a RATE table, never a league table. The order falls out of the
 * measurement; it is not a position we can sell, and nothing on the site may
 * imply we move a business up it (the no-guarantees rule in CLAUDE.md).
 */
export const SAMPLE_RUNS_TOTAL = 25;

export type SampleRank = {
  name: string;
  /** Answers naming this business, out of SAMPLE_RUNS_TOTAL. */
  hits: number;
  /** The one that is the reader. Rendered as the finding, not as a row. */
  you?: boolean;
};

export const SAMPLE_RANKING: readonly SampleRank[] = [
  { name: SAMPLE_COMPETITORS[0], hits: 17 },
  { name: SAMPLE_COMPETITORS[1], hits: 12 },
  { name: SAMPLE_COMPETITORS[2], hits: 9 },
  { name: SAMPLE_CLIENT, hits: 5, you: true },
];

export const SAMPLE_LABEL = "illustrative example · not a real client";

/* ---- The /how-it-works console's stage cards (Josh, 2026-09-14) ----------
   Each stage of the console shows its own artifact (components/ConsoleCards).
   The facts behind those cards live here, and the pages that showed them
   first read them from here too, so no count is ever typed twice. */

/** The question set: the Measure card and the /how-it-works query set card.
    Tagged with the buckets the Track report uses, which run from the end of
    the buying journey back to the start. */
export const SAMPLE_QUESTIONS = [
  { q: SAMPLE_QUERY, tag: "CATEGORY" },
  { q: "how much should a startup spend on a marketing agency", tag: "PROBLEM-AWARE" },
  { q: "marketing agency vs first marketing hire", tag: "COMPARISON" },
  { q: "is [agency] worth it for a seed-stage company", tag: "BRAND" },
] as const;

/** The third-party lists the engines cite for the category, and how many list the client. */
export const SAMPLE_SOURCES = { cited: 6, listed: 2 } as const;

/** Questions where a competitor's page is quoted and the client has no page. */
export const SAMPLE_LOSING_QUERIES = 3;

/** What the judge flagged as wrong in one ChatGPT answer (/how-it-works, "Judging"). */
export const SAMPLE_ACCURACY_ERROR = "says they only run paid ads; they run full-funnel";

/** The fix list the full audit closes with: /sample-report, and the Improve card. */
export const SAMPLE_FIXES = [
  {
    fix: "Unblock AI crawlers at the firewall",
    why: "GPTBot and PerplexityBot were getting challenge pages, so the site is invisible to the engines we measure.",
    where: "Your site",
  },
  {
    fix: `Get listed on the ${SAMPLE_SOURCES.cited - SAMPLE_SOURCES.listed} missing directories AI cites`,
    why: `The engines cited the same ${SAMPLE_SOURCES.cited} sources across runs; the client appears on ${SAMPLE_SOURCES.listed} of them.`,
    where: "Off site",
  },
  {
    fix: `Publish answer-first service pages for the ${SAMPLE_LOSING_QUERIES} losing queries`,
    why: "Competitors' pages were quoted verbatim in the answers. The client had no page on those questions.",
    where: "Content",
  },
] as const;

/**
 * The Track card: the same twenty-five answers, run again a month later.
 *
 * RUN ONE IS SAMPLE_ROWS, read from there; only run two's counts live here.
 * The movement is deliberately modest and mixed, and AI Overviews does not
 * move at all: a re-run where everything rose would read as the outcome
 * promise the no-guarantees rule forbids. NEW ILLUSTRATIVE FIGURES
 * (2026-09-14), flagged for Josh in website-plan §6.
 */
const RUN_TWO: Readonly<Record<string, number>> = {
  ChatGPT: 2,
  Claude: 1,
  Gemini: 3,
  Perplexity: 1,
  "AI Overviews": 0,
};

export const SAMPLE_RERUN_ROWS = SAMPLE_ROWS.map((row) => {
  const after = RUN_TWO[row.engine];
  if (after === undefined) {
    throw new Error(
      `lib/sample.ts: RUN_TWO has no count for ${row.engine}. Add one beside SAMPLE_ROWS.`
    );
  }
  return { engine: row.engine, runs: row.runs, before: row.you, after };
});
