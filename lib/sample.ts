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

export const SAMPLE_ROWS: readonly SamplingRow[] = [
  { engine: "ChatGPT", hits: 2, runs: 10 },
  { engine: "Google AI", hits: 0, runs: 10 },
  { engine: "Perplexity", hits: 3, runs: 10 },
  { engine: "Gemini", hits: 1, runs: 10 },
  { engine: "Competitor", hits: 8, runs: 10, competitor: true },
];

/** The engine highlighted in the home hero callout. */
export const SAMPLE_CALLOUT = {
  engine: "ChatGPT",
  hits: 2,
  runs: 10,
  competitorHits: 8,
} as const;

export const SAMPLE_LABEL = "illustrative example · not a real client";
