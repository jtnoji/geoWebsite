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
 * engine — four engines, matching the "Four engines" pipeline stage and the
 * engines=4 data chip. ChatGPT pair must agree with SAMPLE_CALLOUT.
 */
export const SAMPLE_ROWS: readonly SamplingRow[] = [
  { engine: "ChatGPT", you: 2, competitor: 8, runs: 10 },
  { engine: "Google AI", you: 0, competitor: 6, runs: 10 },
  { engine: "Perplexity", you: 3, competitor: 7, runs: 10 },
  { engine: "Gemini", you: 1, competitor: 5, runs: 10 },
];

/** The engine highlighted in the home hero callout. */
export const SAMPLE_CALLOUT = {
  engine: "ChatGPT",
  hits: 2,
  runs: 10,
  competitorHits: 8,
} as const;

/**
 * Share of voice: every business the category's answers named, ordered by how
 * often. This is the artifact for the "Share of voice" metric the site has
 * always listed and never shown.
 *
 * DERIVED FROM SAMPLE_ROWS, NOT INVENTED ALONGSIDE IT. The totals are the same
 * forty runs (four engines x ten) those rows describe, so the two cannot
 * disagree: the client's 2+0+3+1 is this 6, and the top competitor's 8+6+7+5
 * is Saltgrass's 26. Change one and you have to change the other, which is the
 * whole reason both live in this file.
 *
 * It is a RATE table, never a league table. The order falls out of the
 * measurement; it is not a position we can sell, and nothing on the site may
 * imply we move a business up it (the no-guarantees rule in CLAUDE.md).
 */
export const SAMPLE_RUNS_TOTAL = 40;

export type SampleRank = {
  name: string;
  /** Answers naming this business, out of SAMPLE_RUNS_TOTAL. */
  hits: number;
  /** The one that is the reader. Rendered as the finding, not as a row. */
  you?: boolean;
};

export const SAMPLE_RANKING: readonly SampleRank[] = [
  { name: SAMPLE_COMPETITORS[0], hits: 26 },
  { name: SAMPLE_COMPETITORS[1], hits: 19 },
  { name: SAMPLE_COMPETITORS[2], hits: 14 },
  { name: SAMPLE_CLIENT, hits: 6, you: true },
];

export const SAMPLE_LABEL = "illustrative example · not a real client";
