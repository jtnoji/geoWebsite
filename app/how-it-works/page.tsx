import type { Metadata } from "next";
import ArtifactCard from "@/components/ArtifactCard";
import Chip from "@/components/Chip";
import Cta from "@/components/Cta";
import HonestyBlock from "@/components/HonestyBlock";
import JsonLd from "@/components/JsonLd";
import SamplingCard from "@/components/SamplingCard";
import { faq, type Faq } from "@/lib/schema";
import { SAMPLE_LABEL, SAMPLE_QUERY, SAMPLE_ROWS } from "@/lib/sample";
import { SAMPLING_FOOTNOTE } from "@/lib/stats";

export const metadata: Metadata = {
  title: "How It Works: our AI visibility methodology",
  description:
    "The full protocol: which engines we measure, why every question runs ten times, how answers are judged against a fact sheet, and what the report contains.",
};

/**
 * The flagship page: no section ships as text-only (claim + artifact rule).
 * SECTIONS is the single source for BOTH the visible §-sections and the
 * FAQPage JSON-LD — the schema-sync invariant. `answer` is the standalone,
 * quotable 1–2 sentence claim; the artifact beside it does the explaining.
 */
const SECTIONS: readonly (Faq & { id: string; chip: string })[] = [
  {
    id: "query-set",
    chip: "§1 · The query set",
    question: "What do you actually ask the AI engines?",
    answer:
      "The questions your customers actually ask: cost, comparison, \"is this business legit.\" The set is versioned and locked per measurement cycle, so every before/after comparison is apples to apples.",
  },
  {
    id: "sampling",
    chip: "§2 · Sampling",
    question: "Why do you run every question ten times?",
    answer:
      "AI answers change between runs; a single fetch is a coin flip. We run every query ten times per engine and report the rate. Anyone showing you a single-run \"AI rank\" is measuring noise.",
  },
  {
    id: "judging",
    chip: "§3 · Judging",
    question: "How do you judge the answers?",
    answer:
      "Every answer is graded for presence, prominence, and accuracy against a fact sheet about your business that you approve, so \"the AI mentioned you but got your hours or services wrong\" is a finding instead of a blind spot.",
  },
  {
    id: "report",
    chip: "§4 · The report",
    question: "What do you get at the end?",
    answer:
      "Mention rates by engine and question type, the queries you're losing, who's named instead of you, the sources the engines cite, and a fix list ranked by what the evidence says actually moves AI answers.",
  },
  {
    id: "honesty",
    chip: "§5 · The fine print, up front",
    question: "Can you guarantee results?",
    answer:
      "No, and no one honest can. Nobody controls what ChatGPT says. What we deliver is measurement: where you stand, how it changes over time, and which fixes have evidence behind them.",
  },
];

const PIPELINE = [
  {
    title: "Query set",
    body: "Real customer questions, versioned and locked per cycle.",
    artifact: `"${SAMPLE_QUERY}"`,
  },
  {
    title: "Five engines",
    body: "Chat models and live-search surfaces.",
    artifact: "chatgpt · google ai · gemini · perplexity · claude",
  },
  {
    title: "Ten runs",
    body: "Sampled repeatedly, because answers change run to run.",
    artifact: "●●○○○○○○○○ → 2/10 mention rate",
  },
  {
    title: "Judged",
    body: "Every answer graded against ground truth.",
    artifact: "presence · prominence · accuracy",
  },
  {
    title: "Reported",
    body: "Rates, gaps, and a prioritized roadmap.",
    artifact: "losing queries → who's named instead → why",
  },
] as const;

const QUERY_CARD = [
  { query: `"${SAMPLE_QUERY}"`, tag: "local" },
  { query: '"average cost to replace a water heater"', tag: "cost" },
  { query: '"plumber near me open now"', tag: "local" },
  { query: '"is [business] plumbing legit"', tag: "brand" },
] as const;

const DELIVERABLES = [
  { name: "Mention rates", detail: "per engine · per question type · sampled" },
  { name: "Losing queries", detail: "where a rival is named and you aren't" },
  { name: "Source map", detail: "the sites AI cites, and where you're missing" },
  { name: "Roadmap", detail: "prioritized, evidence-ranked fixes" },
] as const;

function SectionShell({
  chip,
  question,
  answer,
  children,
}: {
  chip: string;
  question: string;
  answer: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="grid items-start gap-8 border-t border-line-dark py-12 first:border-t-0 first:pt-0 md:grid-cols-[5fr_6fr] md:gap-14">
      <div>
        <Chip>{chip}</Chip>
        <h2 className="mt-4 max-w-[380px] text-2xl font-semibold leading-snug tracking-tight text-ink md:text-[27px]">
          {question}
        </h2>
        <p className="mt-3 text-[15px] leading-7 text-ink-soft">{answer}</p>
      </div>
      <div>{children}</div>
    </section>
  );
}

export default function HowItWorks() {
  return (
    <>
      <JsonLd data={faq(SECTIONS)} />

      {/* Head */}
      <div className="mx-auto max-w-[1120px] px-5 pb-4 pt-16 sm:px-8 md:pt-20">
        <Chip>Methodology · public by design</Chip>
        <h1 className="mt-5 max-w-[720px] text-[clamp(34px,4.6vw,54px)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
          Measurement you can actually inspect.
        </h1>
        <p className="mt-5 max-w-[560px] text-[17px] leading-[1.6] text-ink-soft">
          The full protocol:{" "}
          <b className="font-semibold text-ink">what we run</b>,{" "}
          <b className="font-semibold text-ink">how often</b>, and{" "}
          <b className="font-semibold text-ink">how every answer is judged</b>.
          It&rsquo;s public because measurement you can&rsquo;t inspect is marketing.
        </p>
        <div className="mt-7 inline-flex flex-wrap overflow-hidden rounded-xl border border-line-dark bg-white/70 text-[13px] text-ink-soft">
          {["n=32 queries", "engines=5", "runs=10× each", "judged vs fact sheet"].map(
            (chip) => (
              <span
                key={chip}
                className="border-r border-line-dark px-4 py-2.5 font-medium last:border-r-0"
              >
                {chip}
              </span>
            ),
          )}
        </div>
      </div>

      {/* Pipeline */}
      <div className="mx-auto max-w-[1120px] px-5 py-14 sm:px-8">
        <div className="flex flex-wrap items-center gap-4">
          <Chip>The pipeline</Chip>
          <h2 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
            Every audit, same five stages
          </h2>
        </div>
        <ol className="mt-7 grid gap-3 md:grid-cols-5">
          {PIPELINE.map((stage, i) => (
            <li
              key={stage.title}
              className="flex flex-col rounded-xl bg-paper-dim p-4"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[12px] font-semibold text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-[15px] font-semibold text-ink">
                {stage.title}
              </h3>
              <p className="mt-1 flex-1 text-[12.5px] leading-5 text-ink-soft">
                {stage.body}
              </p>
              <p className="mt-3 rounded-lg bg-white/80 px-2.5 py-2 text-[11px] leading-4 text-ink-soft">
                {stage.artifact}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* §-sections — claim left, artifact right */}
      <div className="mx-auto max-w-[1120px] px-5 pb-8 pt-6 sm:px-8">
        <SectionShell {...SECTIONS[0]}>
          <ArtifactCard
            title="query set: plumbing, berkeley"
            meta="v1 · locked"
          >
            <ul className="p-4">
              {QUERY_CARD.map((row) => (
                <li
                  key={row.query}
                  className="flex items-center justify-between gap-3 border-t border-dashed border-line py-2.5 text-[13px] text-ink first:border-t-0 first:pt-0 last:pb-0"
                >
                  <span>{row.query}</span>
                  <Chip className="!px-2 !py-0.5 text-[10px]">{row.tag}</Chip>
                </li>
              ))}
            </ul>
          </ArtifactCard>
        </SectionShell>

        <SectionShell {...SECTIONS[1]}>
          <SamplingCard
            title={<>sampling: &ldquo;{SAMPLE_QUERY}&rdquo;</>}
            meta="10 runs/engine"
            rows={[...SAMPLE_ROWS]}
            footer={SAMPLE_LABEL}
          />
          <p className="mt-3 text-xs leading-5 text-ink-faint">
            <b className="font-semibold text-ink-soft">{SAMPLING_FOOTNOTE.value}</b>{" "}
            {SAMPLING_FOOTNOTE.text} ({SAMPLING_FOOTNOTE.source}).
          </p>
        </SectionShell>

        <SectionShell {...SECTIONS[2]}>
          <ArtifactCard
            title="judge verdict: run 7/10 · chatgpt"
            meta="fact sheet v3"
          >
            <dl className="p-4 text-[13.5px]">
              {[
                {
                  k: "presence",
                  v: (
                    <>
                      <b className="font-semibold text-ink">Mentioned</b>, 2nd of
                      3 businesses named
                    </>
                  ),
                },
                {
                  k: "prominence",
                  v: (
                    <>
                      <b className="font-semibold text-ink">Secondary</b>, not
                      the lead recommendation
                    </>
                  ),
                },
                {
                  k: "accuracy",
                  v: (
                    <>
                      <b className="font-semibold text-ink">1 error</b>: answer
                      says weekdays only; the business runs 24/7 emergency
                      service
                      <span className="mt-1.5 block">
                        <span className="inline-block rounded-full bg-gold-soft px-2.5 py-0.5 text-[11px] font-semibold text-bad">
                          wrong_hours_or_availability · high
                        </span>
                      </span>
                    </>
                  ),
                },
              ].map((row) => (
                <div
                  key={row.k}
                  className="grid gap-1 border-t border-dashed border-line py-2.5 first:border-t-0 first:pt-0 last:pb-0 md:grid-cols-[104px_1fr] md:gap-3"
                >
                  <dt className="text-[11px] uppercase tracking-wide text-ink-faint">
                    {row.k}
                  </dt>
                  <dd className="leading-6 text-ink-soft">{row.v}</dd>
                </div>
              ))}
            </dl>
          </ArtifactCard>
        </SectionShell>

        <SectionShell {...SECTIONS[3]}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DELIVERABLES.map((d) => (
              <div key={d.name} className="rounded-xl bg-paper-dim px-4 py-4">
                <h3 className="text-[14.5px] font-semibold text-ink">{d.name}</h3>
                <p className="mt-1 text-[12.5px] leading-5 text-ink-soft">
                  {d.detail}
                </p>
              </div>
            ))}
          </div>
        </SectionShell>

        <SectionShell {...SECTIONS[4]}>
          <HonestyBlock />
        </SectionShell>
      </div>

      <Cta
        heading="See the protocol run on your business."
        sub="The free check is a small version of exactly this: real queries, real engines, real answers."
        secondaryLabel="See a sample report"
        secondaryHref="/sample-report/"
      />
    </>
  );
}
