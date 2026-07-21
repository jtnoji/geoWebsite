import type { Metadata } from "next";
import ArtifactCard from "@/components/ArtifactCard";
import Chip from "@/components/Chip";
import Cta from "@/components/Cta";
import DataChips from "@/components/DataChips";
import HonestyBlock from "@/components/HonestyBlock";
import JsonLd from "@/components/JsonLd";
import { SamplingRows } from "@/components/SamplingCard";
import { faq } from "@/lib/schema";
import { HONESTY_COPY } from "@/lib/site";
import { SAMPLING_FOOTNOTE } from "@/lib/stats";

export const metadata: Metadata = {
  title: "How It Works — our AI visibility methodology",
  description:
    "Which engines we measure, why every question runs multiple times, how answers are judged, and what the audit covers. Transparency is the methodology.",
};

/**
 * The flagship page (mockup/how-it-works.html). Section bodies are ≤2
 * sentences; the artifact does the explaining. `body` is the plain visible
 * text; `bolds` phrases are styled by splitting — so the FAQPage JSON-LD
 * built from {heading, body} always matches the rendered copy exactly.
 */
const SECTIONS = [
  {
    id: "s1",
    rail: "§1  What we ask",
    chip: "§1 — The query set",
    heading: "The questions your customers actually ask",
    body: 'Real phrasings across the whole funnel — cost, comparison, "is this business legit." Locked per cycle, so every before/after is apples to apples.',
    bolds: ['"is this business legit."', "apples to apples"],
  },
  {
    id: "s2",
    rail: "§2  How we sample",
    chip: "§2 — Sampling",
    heading: "Ten runs, not one screenshot",
    body: 'AI answers change between runs — a single fetch is a coin flip. We run every query 10× per engine and report the rate; a single-run "AI rank" is just noise.',
    bolds: ["a single fetch is a coin flip", "10× per engine"],
  },
  {
    id: "s3",
    rail: "§3  How we judge",
    chip: "§3 — Judging",
    heading: "Every answer graded against ground truth",
    body: `A mention isn't enough. Each answer is judged against a fact sheet you approve: present? prominent? accurate? "AI says you close at 5 — you run 24/7" is a finding, not a blind spot.`,
    bolds: ["a fact sheet you approve", "accurate?"],
  },
  {
    id: "s4",
    rail: "§4  What you get",
    chip: "§4 — The report",
    heading: "Numbers first, then the roadmap",
    body: "Rates by engine and question type, the queries you're losing, who's named instead, and a fix list ranked by what the evidence says moves answers.",
    bolds: ["the queries you're losing", "what the evidence says moves answers"],
  },
  {
    id: "s5",
    rail: "§5  What we won't promise",
    chip: "§5 — The fine print, up front",
    heading: HONESTY_COPY.heading,
    body: HONESTY_COPY.body,
    bolds: [],
  },
] as const;

const PIPELINE = [
  {
    n: "01",
    title: "Query set",
    desc: "Real customer questions, locked per cycle.",
    art: '"average cost of AC replacement in berkeley"',
    hot: false,
  },
  {
    n: "02",
    title: "Five engines",
    desc: "Chat models + live-search surfaces.",
    art: "chatgpt · google ai · gemini · perplexity · claude",
    hot: false,
  },
  {
    n: "03",
    title: "Ten runs",
    desc: "Sampled — answers change run to run.",
    art: (
      <>
        <span className="text-ink">
          ●●●●<span className="text-dot">●●●●●●</span>
        </span>{" "}
        → 4/10 mention rate
      </>
    ),
    hot: false,
  },
  {
    n: "04",
    title: "Judged",
    desc: "Graded against ground truth.",
    art: "presence · prominence · accuracy",
    hot: false,
  },
  {
    n: "05",
    title: "Reported",
    desc: "Rates, gaps, roadmap.",
    art: "losing queries → who's named instead → why",
    hot: true,
  },
] as const;

const QUERY_ROWS = [
  { q: '"best plumber in berkeley"', tag: "LOCAL" },
  { q: '"average cost to replace a water heater"', tag: "COST" },
  { q: '"plumber near me open now"', tag: "LOCAL" },
  { q: '"is [business] plumbing legit"', tag: "BRAND" },
] as const;

const SAMPLING_ROWS = [
  { engine: "ChatGPT", hits: 4, runs: 10 },
  { engine: "Google AI", hits: 2, runs: 10 },
  { engine: "Perplexity", hits: 1, runs: 10 },
  { engine: "Gemini", hits: 3, runs: 10 },
  { engine: "Competitor", hits: 8, runs: 10, competitor: true },
] as const;

const VERDICT_ROWS = [
  { k: "presence", bold: "Mentioned", rest: " — 2nd of 3 named", flag: false },
  { k: "prominence", bold: "Secondary", rest: " — not the lead recommendation", flag: false },
  {
    k: "accuracy",
    bold: "1 error",
    rest: " — says weekdays only; you run 24/7 emergency",
    flag: true,
  },
] as const;

const DELIVERABLES = [
  { title: "Mention rates", desc: "per engine · per question type" },
  { title: "Losing queries", desc: "where a rival is named, not you" },
  { title: "Source map", desc: "the sites AI cites — where you're missing" },
  { title: "Roadmap", desc: "prioritized, evidence-ranked fixes" },
] as const;

function BodyWithBolds({ body, bolds }: { body: string; bolds: readonly string[] }) {
  let parts: React.ReactNode[] = [body];
  for (const phrase of bolds) {
    const next: React.ReactNode[] = [];
    for (const part of parts) {
      if (typeof part !== "string" || !part.includes(phrase)) {
        next.push(part);
        continue;
      }
      const [before, after] = part.split(phrase, 2);
      next.push(
        before,
        <b key={phrase} className="font-bold text-ink">
          {phrase}
        </b>,
        after
      );
    }
    parts = next;
  }
  return <>{parts}</>;
}

export default function HowItWorks() {
  return (
    <>
      <JsonLd
        data={faq(SECTIONS.map((s) => ({ question: s.heading, answer: s.body })))}
      />

      {/* Head */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1120px] px-5 pb-[52px] pt-[72px] sm:px-8">
          <Chip>Methodology · v2.1 · May 2026</Chip>
          <h1 className="mb-4 mt-5 max-w-[720px] text-[40px] font-bold leading-[1.0] tracking-[-0.04em] text-ink md:text-[58px]">
            Measurement you can actually inspect.
          </h1>
          <p className="mb-7 max-w-[540px] text-lg leading-7 text-ink-soft">
            The full protocol — <b className="font-bold text-ink">what we run</b>,{" "}
            <b className="font-bold text-ink">how often</b>, and{" "}
            <b className="font-bold text-ink">how every answer is judged</b>.
            Public, because measurement you can&rsquo;t inspect is marketing.
          </p>
          <DataChips
            cells={[
              { label: "n=", value: "32", suffix: " queries" },
              { label: "engines=", value: "5" },
              { label: "runs=", value: "10×", suffix: " each" },
              { label: "judged vs fact sheet", accent: true },
            ]}
          />
        </div>
      </section>

      {/* Pipeline */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1120px] px-5 py-14 sm:px-8">
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <Chip>The pipeline</Chip>
            <h2 className="text-[22px] font-bold tracking-[-0.03em] text-ink">
              Every audit, same five stages
            </h2>
          </div>
          <div className="grid md:grid-cols-5">
            {PIPELINE.map((stage) => (
              <div
                key={stage.n}
                className="border border-b-0 border-line-dark bg-white pb-4 last:border-b md:border-b md:border-r-0 md:last:border-r"
              >
                <span
                  className={`block px-3.5 py-1.5 font-mono text-[11px] ${
                    stage.hot ? "bg-gold text-ink" : "bg-ink text-white"
                  }`}
                >
                  {stage.n}
                </span>
                <div className="px-3.5 pt-3.5">
                  <span className="block text-[15px] font-bold tracking-[-0.01em] text-ink">
                    {stage.title}
                  </span>
                  <span className="mt-1 block text-[12.5px] leading-[1.45] text-ink-soft">
                    {stage.desc}
                  </span>
                </div>
                <div
                  className={`mx-3.5 mt-3 min-h-[52px] px-2.5 py-2 font-mono text-[10.5px] leading-6 ${
                    stage.hot ? "bg-gold-soft text-bad" : "bg-paper-dim text-ink-soft"
                  }`}
                >
                  {stage.art}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doc grid: sticky §-rail + sections */}
      <div className="mx-auto grid max-w-[1120px] gap-8 px-5 py-16 sm:px-8 md:grid-cols-[190px_1fr] md:gap-14">
        <aside className="md:sticky md:top-[82px] md:self-start">
          <nav
            aria-label="Sections"
            className="flex flex-wrap gap-x-4 border-b border-line pb-2.5 font-mono text-xs text-ink-faint md:block md:border-b-0 md:pb-0"
          >
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block py-1 transition-colors hover:text-ink md:border-b md:border-line md:py-2"
              >
                {s.rail}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          {/* §1 */}
          <section
            id="s1"
            className="grid gap-6 border-b border-line py-12 pt-0 md:grid-cols-[5fr_6fr] md:gap-13"
          >
            <div>
              <Chip>{SECTIONS[0].chip}</Chip>
              <h2 className="mb-3 mt-3.5 max-w-[360px] text-[28px] font-bold leading-[1.1] tracking-[-0.035em] text-ink">
                {SECTIONS[0].heading}
              </h2>
              <p className="text-[15.5px] leading-[1.6] text-ink-soft">
                <BodyWithBolds body={SECTIONS[0].body} bolds={SECTIONS[0].bolds} />
              </p>
            </div>
            <ArtifactCard title="query set — plumbing · berkeley" meta="v1 · locked">
              <div className="px-4 py-2">
                {QUERY_ROWS.map((row) => (
                  <div
                    key={row.q}
                    className="flex justify-between gap-3.5 border-b border-dashed border-line py-2.5 font-mono text-[12.5px] text-ink last:border-b-0"
                  >
                    <span>{row.q}</span>
                    <span className="self-center bg-ink px-2 py-0.5 text-[10px] text-white">
                      {row.tag}
                    </span>
                  </div>
                ))}
              </div>
            </ArtifactCard>
          </section>

          {/* §2 */}
          <section
            id="s2"
            className="grid gap-6 border-b border-line py-12 md:grid-cols-[5fr_6fr] md:gap-13"
          >
            <div>
              <Chip>{SECTIONS[1].chip}</Chip>
              <h2 className="mb-3 mt-3.5 max-w-[360px] text-[28px] font-bold leading-[1.1] tracking-[-0.035em] text-ink">
                {SECTIONS[1].heading}
              </h2>
              <p className="text-[15.5px] leading-[1.6] text-ink-soft">
                <BodyWithBolds body={SECTIONS[1].body} bolds={SECTIONS[1].bolds} />
                <sup>1</sup>
              </p>
              <p className="mt-3.5 text-xs leading-[1.5] text-ink-faint">
                <b className="text-ink-soft">1.</b> {SAMPLING_FOOTNOTE.value}{" "}
                {SAMPLING_FOOTNOTE.text} {SAMPLING_FOOTNOTE.source}.
              </p>
            </div>
            <ArtifactCard
              title={<>sampling — &ldquo;best plumber near berkeley&rdquo;</>}
              meta="10 runs/engine"
            >
              <SamplingRows rows={SAMPLING_ROWS} />
            </ArtifactCard>
          </section>

          {/* §3 */}
          <section
            id="s3"
            className="grid gap-6 border-b border-line py-12 md:grid-cols-[5fr_6fr] md:gap-13"
          >
            <div>
              <Chip>{SECTIONS[2].chip}</Chip>
              <h2 className="mb-3 mt-3.5 max-w-[360px] text-[28px] font-bold leading-[1.1] tracking-[-0.035em] text-ink">
                {SECTIONS[2].heading}
              </h2>
              <p className="text-[15.5px] leading-[1.6] text-ink-soft">
                <BodyWithBolds body={SECTIONS[2].body} bolds={SECTIONS[2].bolds} />
              </p>
            </div>
            <ArtifactCard title="judge verdict — run 7/10 · chatgpt" meta="fact sheet v3">
              <div className="px-4 py-2">
                {VERDICT_ROWS.map((row) => (
                  <div
                    key={row.k}
                    className="grid grid-cols-[104px_1fr] gap-3 border-b border-dashed border-line py-2.5 text-[13.5px] last:border-b-0"
                  >
                    <span className="pt-0.5 font-mono text-[11px] uppercase text-ink-faint">
                      {row.k}
                    </span>
                    <span className="text-ink-soft">
                      <b className="font-bold text-ink">{row.bold}</b>
                      {row.rest}
                      {row.flag && (
                        <span className="mt-1.5 block">
                          <span className="inline-block bg-gold px-2 py-0.5 font-mono text-[11px] text-ink">
                            wrong_hours_or_availability · HIGH
                          </span>
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </ArtifactCard>
          </section>

          {/* §4 */}
          <section
            id="s4"
            className="grid gap-6 border-b border-line py-12 md:grid-cols-[5fr_6fr] md:gap-13"
          >
            <div>
              <Chip>{SECTIONS[3].chip}</Chip>
              <h2 className="mb-3 mt-3.5 max-w-[360px] text-[28px] font-bold leading-[1.1] tracking-[-0.035em] text-ink">
                {SECTIONS[3].heading}
              </h2>
              <p className="text-[15.5px] leading-[1.6] text-ink-soft">
                <BodyWithBolds body={SECTIONS[3].body} bolds={SECTIONS[3].bolds} />
              </p>
            </div>
            <div className="grid grid-cols-1 gap-px border border-line-dark bg-line-dark sm:grid-cols-2">
              {DELIVERABLES.map((d) => (
                <div key={d.title} className="bg-white px-4 py-4">
                  <b className="block text-[14.5px] font-bold tracking-[-0.01em] text-ink">
                    {d.title}
                  </b>
                  <span className="text-[12.5px] text-ink-soft">{d.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* §5 — the honesty pull-quote; the chip here is the page's one red chip */}
          <section id="s5" className="grid gap-6 py-12 pb-0 md:grid-cols-[5fr_6fr] md:gap-13">
            <div>
              <Chip gold>{SECTIONS[4].chip}</Chip>
              <h2 className="mb-3 mt-3.5 max-w-[360px] text-[28px] font-bold leading-[1.1] tracking-[-0.035em] text-ink">
                {SECTIONS[4].heading}
              </h2>
            </div>
            <HonestyBlock withLabel={false} />
          </section>
        </div>
      </div>

      <Cta
        heading="See the protocol run on your business."
        sub="The free check is a small version of exactly this — real queries, real engines, real answers."
      />
    </>
  );
}
