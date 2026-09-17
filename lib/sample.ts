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

/* ---- The whole cycle, for the /sample-report walkthrough -----------------
   Everything above describes ONE question (25 answers). A paid cycle is the
   whole question set: 100 questions on the same five engines at K=5, so 2,500
   answers. These are the figures /sample-report renders section by section, in
   the order and shape the Track report prints them (Josh, 2026-09-16: "show
   the reader the page").

   ILLUSTRATIVE, like everything in this file, and the same business: an agency
   that gets named when a buyer already knows it and almost never when the
   buyer describes a problem. The numbers are internally consistent, and that
   is load-bearing: SAMPLE_BY_ENGINE and SAMPLE_BY_TYPE both sum to
   SAMPLE_CYCLE.named, SAMPLE_SHARE sums to SAMPLE_CYCLE.mentions, and each
   SAMPLE_MATRIX row sums to that brand's mentions. Change one, change its
   partners. */
export const SAMPLE_CYCLE = {
  questions: 100,
  runs: 5,
  engines: 5,
  answers: 2500,
  named: 618,
  /** Every brand mention, of any business, across the same answers. */
  mentions: 4210,
  window: "9 to 10 September 2026",
  geography: "United States · English · signed out, no personalisation",
  questionSet: "v1 · locked for the cycle",
} as const;

/** Section one: the same 618, split by engine. 500 answers per engine. */
export const SAMPLE_BY_ENGINE = [
  { engine: "ChatGPT", answers: 500, named: 121 },
  { engine: "Claude", answers: 500, named: 132 },
  { engine: "Gemini", answers: 500, named: 148 },
  { engine: "Perplexity", answers: 500, named: 127 },
  { engine: "AI Overviews", answers: 500, named: 90 },
] as const;

/** Section three: the same 618, split by what the buyer was doing. */
export const SAMPLE_BY_TYPE = [
  { type: "Brand", example: "is [agency] worth it for a seed-stage company", questions: 15, answers: 375, named: 341 },
  { type: "Category", example: SAMPLE_QUERY, questions: 30, answers: 750, named: 165 },
  { type: "Comparison", example: "marketing agency vs first marketing hire", questions: 20, answers: 500, named: 88 },
  { type: "Problem-aware", example: "how do we get more qualified pipeline", questions: 25, answers: 625, named: 19 },
  { type: "Adjacent", example: "what does a good demand-gen plan look like", questions: 10, answers: 250, named: 5 },
] as const;

/* The next three carry `you` on one row only, so they are typed rather than
   `as const`: a const tuple would make `row.you` an error on every other row. */

/** Section two: how the 4,210 brand mentions divided. Ordered by size, with
    the bucket of small agencies last, so the bar and the table agree: at 641
    against 618 the third competitor and the client are a percentage point
    apart, and the eye should not have to resolve that from two tints. */
export const SAMPLE_SHARE: readonly { name: string; mentions: number; you?: boolean }[] = [
  { name: SAMPLE_COMPETITORS[0], mentions: 1268 },
  { name: SAMPLE_COMPETITORS[1], mentions: 902 },
  { name: SAMPLE_COMPETITORS[2], mentions: 641 },
  { name: SAMPLE_CLIENT, mentions: 618, you: true },
  { name: "Nine smaller agencies", mentions: 781 },
];

/** Section four: mentions per brand per engine, in SAMPLE_BY_ENGINE order. */
export const SAMPLE_MATRIX: readonly {
  name: string;
  you?: boolean;
  byEngine: readonly number[];
}[] = [
  { name: SAMPLE_CLIENT, you: true, byEngine: [121, 132, 148, 127, 90] },
  { name: SAMPLE_COMPETITORS[0], byEngine: [268, 241, 279, 252, 228] },
  { name: SAMPLE_COMPETITORS[1], byEngine: [186, 172, 203, 178, 163] },
  { name: SAMPLE_COMPETITORS[2], byEngine: [133, 122, 145, 128, 113] },
];

/** Section five: what the engines read while answering. */
export const SAMPLE_CITATIONS: {
  total: number;
  domains: number;
  byType: readonly { type: string; share: number }[];
  top: readonly {
    domain: string;
    type: string;
    citations: number;
    answers: number;
    you?: boolean;
  }[];
} = {
  total: 5980,
  domains: 143,
  byType: [
    { type: "Editorial and review", share: 0.36 },
    { type: "Directory and listing", share: 0.26 },
    { type: "Community and social", share: 0.22 },
    { type: "Video", share: 0.15 },
    { type: "Brand-owned", share: 0.01 },
  ],
  top: [
    { domain: "industrypub.com", type: "Editorial", citations: 412, answers: 388 },
    { domain: "reviewsite.com", type: "Directory", citations: 388, answers: 366 },
    { domain: "foundersforum.com", type: "Community", citations: 301, answers: 268 },
    { domain: "citylist.com", type: "Directory", citations: 254, answers: 243 },
    { domain: "agencyrank.com", type: "Editorial", citations: 188, answers: 181 },
    { domain: "yourdomain.com", type: "Brand-owned", citations: 71, answers: 71, you: true },
  ],
} as const;

/** Section six: statements that contradict the signed fact sheet. The five
    engine marks are in SAMPLE_BY_ENGINE order. */
export const SAMPLE_FACT_FINDINGS = [
  {
    statement: "Described as a paid-media shop; they run full-funnel",
    severity: "Urgent",
    answers: 612,
    engines: [true, true, true, false, true],
  },
  {
    statement: "Minimum engagement quoted at $10k a month",
    severity: "Urgent",
    answers: 218,
    engines: [true, false, true, false, true],
  },
  {
    statement: "Listed as a subsidiary of a holding group",
    severity: "High",
    answers: 143,
    engines: [false, true, true, false, false],
  },
  {
    statement: "Founding year given as 2019",
    severity: "High",
    answers: 96,
    engines: [true, false, false, true, false],
  },
  {
    statement: "Service area given as the Bay Area only",
    severity: "Medium",
    answers: 74,
    engines: [false, true, false, true, false],
  },
  {
    statement: "Team size understated at under ten",
    severity: "Low",
    answers: 38,
    engines: [true, false, false, false, false],
  },
] as const;

/** Section seven: excerpts picked by a fixed rule, not by hand. */
export const SAMPLE_EXCERPTS = [
  {
    rule: "Named late",
    engine: "ChatGPT",
    run: "run 2 of 5",
    question: SAMPLE_QUERY,
    type: "category",
    text: `For seed-stage B2B, ${SAMPLE_COMPETITORS[0]} and ${SAMPLE_COMPETITORS[1]} come up most often, and ${SAMPLE_COMPETITORS[2]} is strong on content. ${SAMPLE_CLIENT} is also worth a look if you want demand gen and content under one roof.`,
    note: "Named in the last sentence, after three competitors.",
    cited: "industrypub.com · reviewsite.com",
  },
  {
    rule: "Not named",
    engine: "Perplexity",
    run: "run 4 of 5",
    question: "how do we get more qualified pipeline",
    type: "problem-aware",
    text: "Tighten the ICP first, then run a small paid test against two segments and measure meetings booked rather than clicks. Most teams also need a clearer comparison page before outbound converts.",
    note: "No agency named in this answer at all.",
    cited: "foundersforum.com · industrypub.com",
  },
  {
    rule: "Carries an urgent finding",
    engine: "Gemini",
    run: "run 1 of 5",
    question: `is ${SAMPLE_CLIENT} worth it for a seed-stage company`,
    type: "brand",
    text: `${SAMPLE_CLIENT} is a paid-media agency, so they fit if you mainly need ad buying rather than content or lifecycle work.`,
    note: "The fact sheet says full-funnel. Observed in 3 of 5 runs on this engine.",
    cited: "agencyrank.com · citylist.com",
  },
] as const;

/** The appendix that makes every figure above checkable. */
export const SAMPLE_METHOD = [
  {
    term: "AI visibility",
    value: "Answers naming the business at least once, out of answers read.",
  },
  {
    term: "Share of model",
    value: "The business's share of every brand mention across the same answers.",
  },
  {
    term: "Finding",
    value: "A statement in an answer that contradicts the fact sheet you signed.",
  },
  {
    term: "Severity",
    value: "By consequence to a buyer, not by how often the statement occurred.",
  },
  {
    term: "Example selection",
    value: "A fixed rule: earliest mention, latest mention, first answer naming nobody.",
  },
] as const;

export const SAMPLE_RERUN_ROWS = SAMPLE_ROWS.map((row) => {
  const after = RUN_TWO[row.engine];
  if (after === undefined) {
    throw new Error(
      `lib/sample.ts: RUN_TWO has no count for ${row.engine}. Add one beside SAMPLE_ROWS.`
    );
  }
  return { engine: row.engine, runs: row.runs, before: row.you, after };
});
