import type { Metadata } from "next";
import ArtifactCard from "@/components/ArtifactCard";
import Chip from "@/components/Chip";
import Cta from "@/components/Cta";
import DataChips from "@/components/DataChips";
import HonestyBlock from "@/components/HonestyBlock";
import JsonLd from "@/components/JsonLd";
import { SamplingRows } from "@/components/SamplingCard";
import { faq } from "@/lib/schema";
import { SAMPLE_LABEL, SAMPLE_QUERY, SAMPLE_ROWS } from "@/lib/sample";
import { HONESTY_COPY } from "@/lib/site";
import { SAMPLING_FOOTNOTE } from "@/lib/stats";

export const metadata: Metadata = {
  title: "How it works: our AI visibility methodology",
  description:
    "Which engines we measure, why every question runs ten times, how answers are judged, and how we implement the fixes. The whole protocol, in public.",
};

/**
 * The flagship page. Section bodies are ≤2
 * sentences; the artifact does the explaining. `body` is the plain visible
 * text; `bolds` phrases are styled by splitting — so the FAQPage JSON-LD
 * built from {heading, body} always matches the rendered copy exactly.
 */
const SECTIONS = [
  {
    id: "s1",
    rail: "§1  What we ask",
    chip: "§1 · The query set",
    heading: "The questions your customers actually ask",
    body: 'Real phrasings from across the funnel: cost, comparison, "is this agency worth it." Locked per cycle, so every before and after is apples to apples.',
    bolds: ['"is this agency worth it."', "apples to apples"],
  },
  {
    id: "s2",
    rail: "§2  How we sample",
    chip: "§2 · Sampling",
    heading: "Ten runs, not one screenshot",
    body: 'AI answers change between runs, so a single fetch is a coin flip. We run every query 10× per engine and report the rate. A single-run "AI rank" is noise.',
    bolds: ["a single fetch is a coin flip", "10× per engine"],
  },
  {
    id: "s3",
    rail: "§3  How we judge",
    chip: "§3 · Judging",
    heading: "Every answer graded against ground truth",
    body: `A mention isn't enough. Each answer is judged against a fact sheet you approve: present? prominent? accurate? If AI says you only run paid ads when you run full-funnel, that's a finding, not a blind spot.`,
    bolds: ["a fact sheet you approve", "accurate?"],
  },
  {
    id: "s4",
    rail: "§4  What you get",
    chip: "§4 · The report and the work",
    heading: "Numbers first, then the roadmap, then the work",
    body: "Rates by engine and question type, the queries you're losing, who's named instead, and a fix list ranked by what the evidence says moves answers. On the ongoing tier we implement that list and run the whole protocol again, so every change is measured rather than assumed.",
    bolds: ["the queries you're losing", "we implement that list"],
  },
  {
    id: "s5",
    rail: "§5  What we won't promise",
    chip: "§5 · The fine print, up front",
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
    art: '"how much should a startup spend on a marketing agency"',
    hot: false,
  },
  {
    n: "02",
    title: "Four engines",
    desc: "Chat models + live-search surfaces.",
    art: "chatgpt · google ai · gemini · perplexity",
    hot: false,
  },
  {
    n: "03",
    title: "Ten runs",
    desc: "Answers change run to run.",
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
    hot: false,
  },
  {
    // The gold marker moved here from 05 with the Ongoing GEO reframe: the
    // emphasised endpoint of the protocol is the work, not the report. Labelled
    // "ongoing tier" so nobody reads implementation into the one-time audit.
    n: "06",
    title: "Implemented",
    desc: "Ongoing tier: we make the fixes, then re-run.",
    art: "fix → re-run → before / after",
    hot: true,
  },
] as const;

const QUERY_ROWS = [
  { q: `"${SAMPLE_QUERY}"`, tag: "CATEGORY" },
  { q: '"how much should a startup spend on a marketing agency"', tag: "COST" },
  { q: '"marketing agency vs first marketing hire"', tag: "COMPARE" },
  { q: '"is [agency] worth it for a seed-stage company"', tag: "BRAND" },
] as const;

const VERDICT_ROWS = [
  { k: "presence", bold: "Mentioned", rest: ": 2nd of 3 named", flag: false },
  { k: "prominence", bold: "Secondary", rest: ": not the lead recommendation", flag: false },
  {
    k: "accuracy",
    bold: "1 error",
    rest: ": says they only run paid ads; they run full-funnel",
    flag: true,
  },
] as const;

const DELIVERABLES = [
  { title: "Mention rates", desc: "per engine · per question type" },
  { title: "Losing queries", desc: "where a rival is named, not you" },
  { title: "Source map", desc: "the sites AI cites, and where you're missing" },
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
        <div className="mx-auto max-w-[1120px] px-5 pb-[52px] pt-[72px] text-center sm:px-8">
          <Chip>Methodology · v2.1 · May 2026</Chip>
          <h1 className="mx-auto mb-4 mt-5 max-w-[720px] text-[40px] font-bold leading-[1.0] tracking-[-0.04em] text-ink md:text-[58px]">
            Measurement you can actually inspect.
          </h1>
          <p className="mx-auto mb-7 max-w-[540px] text-lg leading-7 text-ink-soft">
            The full protocol: <b className="font-bold text-ink">what we run</b>,{" "}
            <b className="font-bold text-ink">how often</b>, and{" "}
            <b className="font-bold text-ink">how every answer is judged</b>.
            Public, because measurement you can&rsquo;t inspect is just
            marketing.
          </p>
          <DataChips
            cells={[
              { label: "n=", value: "32", suffix: " queries" },
              { label: "engines=", value: "4" },
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
              Five stages to the report, then the work
            </h2>
          </div>
          {/* gap-px over a line-dark ground: one clean seam in every layout,
              which the old per-cell borders could not do once this wrapped to
              two rows. Same pattern as the §4 deliverables grid. */}
          <div className="grid gap-px border border-line-dark bg-line-dark sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {PIPELINE.map((stage) => (
              <div
                key={stage.n}
                className="flex flex-col bg-white pb-4"
              >
                <span
                  className={`block px-3.5 py-1.5 font-mono text-[11px] ${
                    stage.hot ? "bg-gold text-ink" : "bg-ink text-white"
                  }`}
                >
                  {stage.n}
                </span>
                <div className="px-3.5 pb-3 pt-3.5">
                  <span className="block text-[15px] font-bold tracking-[-0.01em] text-ink">
                    {stage.title}
                  </span>
                  <span className="mt-1 block text-[12.5px] leading-[1.45] text-ink-soft">
                    {stage.desc}
                  </span>
                </div>
                {/* min-h fits the tallest artifact (stage 01 wraps to three
                    24px lines at the lg 6-column width: 72px + 16px padding),
                    so every box in the row is the same height and the tops
                    line up instead of only the mt-auto bottoms. The inner span
                    keeps the artifact a single flex child, otherwise stage
                    03's dot run and its label become separate flex items and
                    stop wrapping as one line of text. */}
                <div
                  className={`mx-3.5 mt-auto flex min-h-[88px] items-center justify-center px-2.5 py-2 text-center font-mono text-[10.5px] leading-6 ${
                    stage.hot ? "bg-gold-soft text-bad" : "bg-paper-dim text-ink-soft"
                  }`}
                >
                  <span>{stage.art}</span>
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
            <ArtifactCard title="query set · b2b marketing agency" meta="v1 · locked">
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
              title={<>sampling: &ldquo;{SAMPLE_QUERY}&rdquo;</>}
              meta="10 runs/engine"
              footer={SAMPLE_LABEL}
            >
              <SamplingRows rows={SAMPLE_ROWS} />
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
            <ArtifactCard title="judge verdict · run 7/10 · chatgpt" meta="fact sheet v3">
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
                            missing_or_invented_feature · HIGH
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
        centered
        heading="See the protocol run on your business."
        sub="The free AI visibility check is a small version of exactly this: real queries, real engines, real answers."
      />
    </>
  );
}
