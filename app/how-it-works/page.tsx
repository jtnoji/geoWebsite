import type { Metadata } from "next";
import ArtifactCard from "@/components/ArtifactCard";
import Beams from "@/components/Beams";
import Chip from "@/components/Chip";
import Cta from "@/components/Cta";
import Eyebrow from "@/components/Eyebrow";
import HonestyBlock from "@/components/HonestyBlock";
import JsonLd from "@/components/JsonLd";
import PageSchema from "@/components/PageSchema";
import { SamplingRows } from "@/components/SamplingCard";
import StageTabs, { type Stage } from "@/components/StageTabs";
import { HEAD_SPLIT, SECTION_X } from "@/lib/layout";
import { delay } from "@/lib/reveal";
import { crumb, faq } from "@/lib/schema";
import { SAMPLE_LABEL, SAMPLE_QUERY, SAMPLE_ROWS } from "@/lib/sample";
import { BRAND, HONESTY_COPY } from "@/lib/site";
import { SAMPLING_FOOTNOTE } from "@/lib/stats";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "How it works: our AI visibility methodology",
  description:
    "Which engines we measure, why every question runs ten times, how answers are judged, and how we implement the fixes. The whole protocol, in public.",
  path: "/how-it-works/",
});

/**
 * Rebuilt 2026-09-14 from the Sable design (mockup/sable-site.dc.html): a dark
 * hero with the stage console. Below it the page keeps the five protocol
 * sections it had before (Josh: "new look, keep some of the content"), because
 * they carry the FAQPage schema and the method detail the design's single
 * block leaves out. The six-stage pipeline grid and the section rail went: the
 * console now tells the sequence.
 */

/** The console's four stages, as the design writes them. */
const STAGES: readonly Stage[] = [
  {
    label: "Measure",
    title: "We ask what your customers ask.",
    body: "Real buying questions for your category, run across ChatGPT, Google AI, Gemini and Perplexity, ten times each. Answers move run to run, so a single screenshot tells you nothing.",
  },
  {
    label: "Diagnose",
    title: "We find what keeps you out.",
    body: "Every answer is traced back to the sources behind it. Crawler access, missing structure, thin category pages and the third-party sites doing the deciding.",
  },
  {
    label: "Improve",
    title: "We work the roadmap.",
    body: "Fixes on your site and off it, in the order that moves the needle fastest. You can take the roadmap and run it yourself, or we implement it.",
  },
  {
    label: "Track",
    title: "We re-run the same query set.",
    body: "Before and after rates on identical questions, plus any new competitors and sources that entered the answer. You see what each change did.",
  },
];

/**
 * The protocol sections. Section bodies are ≤2 sentences; the artifact does
 * the explaining. `body` is the plain visible text; `bolds` phrases are styled
 * by splitting, so the FAQPage JSON-LD built from {heading, body} always
 * matches the rendered copy exactly.
 */
const SECTIONS = [
  {
    id: "s1",
    label: "01 · The query set",
    heading: "The questions your customers actually ask",
    body: 'Real phrasings from across the funnel: cost, comparison, "is this agency worth it." Locked per cycle, so every before and after is apples to apples.',
    bolds: ['"is this agency worth it."', "apples to apples"],
  },
  {
    id: "s2",
    label: "02 · Sampling",
    heading: "Ten runs, not one screenshot",
    body: 'AI answers change between runs, so a single fetch is a coin flip. We run every query 10× per engine and report the rate. A single-run "AI rank" is noise.',
    bolds: ["a single fetch is a coin flip", "10× per engine"],
  },
  {
    id: "s3",
    label: "03 · Judging",
    heading: "Every answer graded against ground truth",
    body: `A mention isn't enough. Each answer is judged against a fact sheet you approve: present? prominent? accurate? If AI says you only run paid ads when you run full-funnel, that's a finding, not a blind spot.`,
    bolds: ["a fact sheet you approve", "accurate?"],
  },
  {
    id: "s4",
    label: "04 · The report and the work",
    heading: "Numbers first, then the roadmap, then the work",
    body: "Rates by engine and question type, the queries you're losing, who's named instead, and a fix list ranked by what the evidence says moves answers. On the ongoing tier we implement that list and run the whole protocol again, so every change is measured rather than assumed.",
    bolds: ["the queries you're losing", "we implement that list"],
  },
  {
    id: "s5",
    label: "05 · The fine print, up front",
    heading: HONESTY_COPY.heading,
    body: HONESTY_COPY.body,
    bolds: [],
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
        <b key={phrase} className="font-semibold text-ink">
          {phrase}
        </b>,
        after
      );
    }
    parts = next;
  }
  return <>{parts}</>;
}

function Artifact({ id }: { id: string }) {
  if (id === "s1") {
    return (
      <ArtifactCard title="query set · b2b marketing agency" meta="v1 · locked">
        <div className="px-5 py-2">
          {QUERY_ROWS.map((row) => (
            <div
              key={row.q}
              className="flex justify-between gap-3.5 border-b border-dashed border-line py-3 font-mono text-[12.5px] text-ink last:border-b-0"
            >
              <span className="min-w-0">{row.q}</span>
              <span className="self-center rounded-full bg-note-bg px-2.5 py-0.5 text-[10px] text-note">
                {row.tag}
              </span>
            </div>
          ))}
        </div>
      </ArtifactCard>
    );
  }
  if (id === "s2") {
    return (
      <ArtifactCard
        title={<>sampling: &ldquo;{SAMPLE_QUERY}&rdquo;</>}
        meta="10 runs/engine"
        footer={SAMPLE_LABEL}
      >
        <SamplingRows rows={SAMPLE_ROWS} />
      </ArtifactCard>
    );
  }
  if (id === "s3") {
    return (
      <ArtifactCard title="judge verdict · run 7/10 · chatgpt" meta="fact sheet v3">
        <div className="px-5 py-2">
          {VERDICT_ROWS.map((row) => (
            <div
              key={row.k}
              className="grid grid-cols-[104px_minmax(0,1fr)] gap-3 border-b border-dashed border-line py-3 text-[14px] last:border-b-0"
            >
              <span className="pt-0.5 font-mono text-[11px] uppercase text-ink-faint">
                {row.k}
              </span>
              <span className="text-ink-soft">
                <b className="font-semibold text-ink">{row.bold}</b>
                {row.rest}
                {row.flag && (
                  <span className="mt-2 block">
                    {/* `overflow-wrap: anywhere` because the payload is a
                        snake_case identifier with no break opportunity in it,
                        and it once pushed a 768px page 46px sideways. */}
                    <span className="inline-block max-w-full rounded-full bg-risk-bg px-2.5 py-1 font-mono text-[11px] font-medium text-risk [overflow-wrap:anywhere]">
                      missing_or_invented_feature · HIGH
                    </span>
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </ArtifactCard>
    );
  }
  if (id === "s4") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {DELIVERABLES.map((d) => (
          <div key={d.title} className="rounded-xl bg-white px-5 py-4">
            <b className="block text-[15px] font-semibold text-ink">{d.title}</b>
            <span className="mt-1 block text-[13px] text-ink-soft">{d.desc}</span>
          </div>
        ))}
      </div>
    );
  }
  return <HonestyBlock withLabel={false} />;
}

export default function HowItWorks() {
  return (
    <>
      <PageSchema
        meta={metadata}
        path="/how-it-works/"
        trail={[crumb("/how-it-works/")]}
      />
      <JsonLd
        data={faq(SECTIONS.map((s) => ({ question: s.heading, answer: s.body })))}
      />

      {/* ---- HERO + CONSOLE ------------------------------------------------ */}
      <section data-hero="dark" className="relative overflow-hidden bg-night text-white">
        <Beams variant="page" />
        <div
          className={`hero-copy relative ${SECTION_X} pb-12 pt-32 md:pb-[70px] md:pt-[150px]`}
        >
          <div data-reveal>
            <Eyebrow onDark>{`How ${BRAND} works`}</Eyebrow>
            <h1 className="display mt-6 max-w-[15ch] text-[clamp(42px,5.6vw,120px)] leading-[1.02] text-white text-pretty">
              {"One system, running on "}
              <span className="text-sky">a schedule</span>
            </h1>
          </div>
        </div>
        {/* The console reveals itself (see StageTabs): a wrapper's opacity
            would flatten its glass. */}
        <div className={`relative ${SECTION_X} pb-16 md:pb-[100px]`}>
          <StageTabs stages={STAGES} />
        </div>
      </section>

      {/* ---- THE PROTOCOL ---------------------------------------------------
          Kept from the previous page: the FAQPage JSON-LD above is built from
          these five, so the headings and bodies here ARE the schema. */}
      <section className="bg-paper-dim">
        <div className={`${SECTION_X} ${HEAD_SPLIT} pt-16 md:pt-[100px]`}>
          <div data-reveal className="min-w-0">
            <Eyebrow>The protocol</Eyebrow>
            <h2 className="display mt-6 max-w-[18ch] text-[clamp(32px,3.8vw,80px)] leading-[1.06] text-ink text-pretty">
              Measurement you can inspect.
            </h2>
          </div>
          <p
            data-reveal
            style={delay(100)}
            className="max-w-[56ch] text-[clamp(16.5px,1.146vw,20.5px)] leading-[1.7] text-ink-soft"
          >
            What we run, how often, and how every answer is judged. Public,
            because measurement you can&rsquo;t inspect is just marketing.
          </p>
        </div>

        <div className={`${SECTION_X} pb-16 pt-6 md:pb-[100px] md:pt-10`}>
          {SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              data-reveal
              className="grid items-start gap-8 border-t border-line-dark py-12 first:border-t-0 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-14 wide:gap-24 wide:py-16"
            >
              <div className="min-w-0">
                <Chip tone="outline">{section.label}</Chip>
                <h2 className="display mt-5 max-w-[20ch] text-[clamp(26px,2.6vw,54px)] leading-[1.12] text-ink text-pretty">
                  {section.heading}
                </h2>
                {section.id !== "s5" && (
                  <p className="mt-4 max-w-[52ch] text-[clamp(16px,1.111vw,20px)] leading-[1.7] text-ink-soft">
                    <BodyWithBolds body={section.body} bolds={section.bolds} />
                    {section.id === "s2" && <sup>1</sup>}
                  </p>
                )}
                {section.id === "s2" && (
                  <p className="mt-3.5 max-w-[52ch] text-[12.5px] leading-[1.5] text-ink-faint">
                    <b className="text-ink-soft">1.</b> {SAMPLING_FOOTNOTE.value}{" "}
                    {SAMPLING_FOOTNOTE.text} {SAMPLING_FOOTNOTE.source}.
                  </p>
                )}
              </div>
              <div className="min-w-0">
                <Artifact id={section.id} />
              </div>
            </section>
          ))}
        </div>
      </section>

      <Cta
        heading="See the protocol run on your business."
        sub="The free AI visibility check is a smaller version of it, run on your category."
      />
    </>
  );
}
