import type { Metadata } from "next";
import Link from "next/link";
import ArtifactCard from "@/components/ArtifactCard";
import Chip from "@/components/Chip";
import Cta from "@/components/Cta";
import HonestyBlock from "@/components/HonestyBlock";
import SamplingCard from "@/components/SamplingCard";
import StatTile from "@/components/StatTile";
import StepList from "@/components/StepList";
import { HOME_STATS } from "@/lib/stats";
import { BRAND } from "@/lib/site";

export const metadata: Metadata = {
  title: `${BRAND} — Does AI recommend your business?`,
  description:
    "ChatGPT, Google AI, and Perplexity name only a few businesses per answer. We measure whether you're one of them — and who's named instead.",
};

const STEPS = [
  {
    title: "We ask",
    body: "A versioned set of real customer questions, run across every major AI engine — multiple times each, to average out the noise.",
  },
  {
    title: "We judge",
    body: "Every answer graded for your presence, prominence, and accuracy against a fact sheet you approve.",
  },
  {
    title: "You get a roadmap",
    body: "Your numbers, your gaps, and a prioritized fix list ordered by what actually moves AI answers.",
  },
] as const;

const METRICS = [
  {
    name: "Mention rate",
    detail: (
      <>
        <b className="font-bold text-ink">Named in 7 of 10 runs</b> — rates, not
        one-off screenshots.
      </>
    ),
  },
  {
    name: "Share of voice",
    detail: <>You vs. the competitors AI names instead of you.</>,
  },
  {
    name: "Accuracy",
    detail: (
      <>
        What AI says about you,{" "}
        <b className="font-bold text-ink">checked against the facts</b>.
      </>
    ),
  },
  {
    name: "Sources",
    detail: <>The exact sites AI cites when it builds the answer.</>,
  },
] as const;

const SAMPLE_ROWS = [
  { engine: "ChatGPT", hits: 4, runs: 10 },
  { engine: "Google AI", hits: 2, runs: 10 },
  { engine: "Perplexity", hits: 1, runs: 10 },
  { engine: "Gemini", hits: 3, runs: 10 },
  { engine: "Competitor", hits: 8, runs: 10, competitor: true },
] as const;

export default function Home() {
  return (
    <>
      {/* Hero — chip, headline, mock AI answer as an ArtifactCard */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1120px] px-5 pb-[72px] pt-[84px] sm:px-8">
          <div className="grid items-center gap-11 md:grid-cols-[7fr_5fr] md:gap-16">
            <div>
              <Chip>AI visibility, measured</Chip>
              <h1 className="mt-5 max-w-[560px] text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-ink md:text-[54px]">
                When someone asks AI for a recommendation, does it say your name?
              </h1>
              <p className="mt-4 max-w-[480px] text-[17.5px] leading-7 text-ink-soft">
                ChatGPT, Google AI, and Perplexity now answer your customers&rsquo;
                questions directly — and they only name{" "}
                <b className="font-bold text-ink">a few businesses per answer</b>.{" "}
                {BRAND}{" "}measures whether you&rsquo;re one of them,{" "}
                <b className="font-bold text-ink">who&rsquo;s named instead</b>,
                and what&rsquo;s driving the answer.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Link
                  href="/free-check/"
                  className="rounded-md bg-accent px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-accent-dark"
                >
                  Get your free AI visibility check
                </Link>
                <Link
                  href="/sample-report/"
                  className="border-b border-line-dark pb-0.5 text-[15px] font-semibold text-ink transition-colors hover:border-ink"
                >
                  See a sample report
                </Link>
              </div>
            </div>

            <ArtifactCard
              title={<>chatgpt — &ldquo;best plumber near berkeley&rdquo;</>}
              meta="run 3/10"
            >
              <p className="px-4 py-4 text-sm leading-6 text-ink-soft">
                Based on reviews and reputation, I&rsquo;d recommend{" "}
                <b className="font-bold text-ink">Apex Plumbing Co.</b>,{" "}
                <b className="font-bold text-ink">BayFlow Drains</b>, or{" "}
                <b className="font-bold text-ink">Hartley &amp; Sons</b>. All
                three are well-reviewed for residential work in the Berkeley
                area&hellip;
              </p>
              <p className="mx-4 mb-4 border-l-2 border-bad bg-[#fdf5f5] px-3 py-2 font-mono text-[13px] font-semibold text-bad">
                Your business — not mentioned
              </p>
            </ArtifactCard>
          </div>
        </div>
      </section>

      {/* Stat row — editorial, every number with a named source */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1120px] gap-7 px-5 py-14 sm:px-8 md:grid-cols-3 md:gap-12">
          {HOME_STATS.map((stat) => (
            <StatTile key={stat.source} stat={stat} />
          ))}
        </div>
      </section>

      {/* What we do — metrics list + sampling card */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1120px] px-5 py-20 sm:px-8">
          <div className="grid items-start gap-11 md:grid-cols-[6fr_5fr] md:gap-[72px]">
            <div>
              <Chip>What we do</Chip>
              <h2 className="mt-3.5 max-w-[560px] text-3xl font-bold tracking-[-0.035em] text-ink md:text-[34px]">
                We measure it. Properly.
              </h2>
              <p className="mt-3.5 max-w-[520px] text-[16.5px] leading-7 text-ink-soft">
                We run the questions your customers actually ask — across
                ChatGPT, Google&rsquo;s AI answers, Gemini, and Perplexity,{" "}
                <b className="font-bold text-ink">multiple times each</b>,
                because AI answers change run to run. Then we judge every
                answer. You get numbers, not vibes.
              </p>
              <dl className="mt-8">
                {METRICS.map((metric) => (
                  <div
                    key={metric.name}
                    className="grid gap-1 border-t border-line py-4 md:grid-cols-[140px_1fr] md:gap-4"
                  >
                    <dt className="text-[15px] font-bold text-ink">{metric.name}</dt>
                    <dd className="text-sm leading-6 text-ink-soft">{metric.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <SamplingCard
                title="mention rate by engine — sample"
                meta="10 runs/engine"
                rows={SAMPLE_ROWS}
                footer="n=32 queries · anonymized client · may 2026"
              />
              <p className="mt-3 font-mono text-[11px] text-ink-faint">
                <Link href="/sample-report/" className="text-accent hover:text-accent-dark">
                  see the full sample report →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — joined step cells */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1120px] px-5 py-20 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <Chip>How it works</Chip>
              <h2 className="text-3xl font-bold tracking-[-0.035em] text-ink md:text-[34px]">
                Three steps, no theater
              </h2>
            </div>
            <Link
              href="/how-it-works/"
              className="text-sm font-semibold text-accent hover:text-accent-dark"
            >
              Full methodology →
            </Link>
          </div>
          <div className="mt-8">
            <StepList steps={STEPS} />
          </div>
        </div>
      </section>

      {/* The shortlist problem, folded into the honesty band (kept for the
          full problem framing from website-plan.md) */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1120px] px-5 py-20 sm:px-8">
          <h2 className="max-w-[560px] text-3xl font-bold tracking-[-0.035em] text-ink">
            The shortlist got smaller
          </h2>
          <p className="mt-4 max-w-[540px] text-base leading-7 text-ink-soft">
            When a customer asks Google or ChatGPT &ldquo;best {"{your category}"}{" "}
            near me&rdquo; or &ldquo;which {"{product}"}{" "}should I buy,&rdquo; the
            answer isn&rsquo;t ten blue links anymore. It&rsquo;s{" "}
            <b className="font-bold text-ink">a paragraph that names two or three options</b>.
            If you&rsquo;re not in that paragraph, you&rsquo;re not in the
            conversation — and you can&rsquo;t see it happening, because
            everyone&rsquo;s answer looks different and nobody screenshots the AI
            that <em>didn&rsquo;t</em> mention them.
          </p>
        </div>
      </section>

      {/* Honesty pull-quote */}
      <section>
        <div className="mx-auto max-w-[1120px] px-5 py-20 sm:px-8">
          <HonestyBlock />
        </div>
      </section>

      <Cta />
    </>
  );
}
