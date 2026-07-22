import type { Metadata } from "next";
import Link from "next/link";
import Chip from "@/components/Chip";
import Cta from "@/components/Cta";
import SamplingCard from "@/components/SamplingCard";
import StatTile from "@/components/StatTile";
import StepList from "@/components/StepList";
import { HOME_STATS } from "@/lib/stats";
import { BRAND } from "@/lib/site";
import { SAMPLE_CALLOUT, SAMPLE_LABEL, SAMPLE_ROWS } from "@/lib/sample";

export const metadata: Metadata = {
  title: `${BRAND} · Does AI recommend your business?`,
  description:
    "ChatGPT, Google AI, and Perplexity name only a few businesses per answer. We measure whether you're one of them, and who's named instead.",
};

const STEPS = [
  {
    title: "We ask",
    body: "A versioned set of real customer questions, run across every major AI engine, multiple times each, to average out the noise.",
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
        <b className="font-bold text-ink">Named in 7 of 10 runs</b>. Rates, not
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



export default function Home() {
  return (
    <>
      {/* Hero — centered badge, display headline, pill CTAs, bobbing chevron */}
      <section>
        <div className="mx-auto max-w-[920px] px-5 pb-6 pt-16 text-center sm:px-8">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(46,59,71,0.22)] bg-white/40 px-[18px] py-2.5 text-[13px] font-medium text-ink">
            <span
              aria-hidden="true"
              className="h-[7px] w-[7px] rounded-full bg-gold"
            />
            AI visibility, measured
          </span>
          <h1 className="mx-auto mt-6 max-w-[840px] text-[clamp(40px,6vw,74px)] font-medium leading-[1.03] tracking-[-0.02em] text-ink">
            When someone asks AI for a recommendation, does it say your name?
          </h1>
          <p className="mx-auto mt-6 max-w-[560px] text-[18px] leading-[1.6] text-ink-soft">
            ChatGPT, Google AI, and Perplexity now answer your customers&rsquo;
            questions directly, and they only name{" "}
            <b className="font-semibold text-ink">a few businesses per answer</b>.{" "}
            {BRAND}{" "}measures whether you&rsquo;re one of them,{" "}
            <b className="font-semibold text-ink">who&rsquo;s named instead</b>,
            and what&rsquo;s driving the answer.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/free-check/"
              className="btn-pill px-[26px] py-[15px] text-[13.5px]"
            >
              Get your free check <span className="text-base">&#10230;</span>
            </Link>
            <Link
              href="/sample-report/"
              className="btn-pill-outline px-[26px] py-[15px] text-[13.5px]"
            >
              See a sample report
            </Link>
          </div>
          <div
            aria-hidden="true"
            className="weir-bob mt-[50px] flex justify-center text-ink"
          >
            <svg width="30" height="18" viewBox="0 0 30 18" fill="none">
              <path
                d="M3 3l12 12L27 3"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Product showcase — the cream answer card with its floating stat
            callout anchored to the card's top-right corner. */}
        <div className="mx-auto max-w-[1000px] px-5 pb-24 pt-14 sm:px-8">
          <div className="relative mx-auto max-w-[660px]">
            <div className="overflow-hidden rounded-[22px] bg-paper-dim shadow-[0_34px_70px_-26px_rgba(46,59,71,0.4)]">
              <div className="flex justify-between gap-3 border-b border-line px-[22px] py-[15px] text-xs text-ink-faint">
                <span className="font-semibold text-ink">
                  chatgpt &nbsp;·&nbsp; &ldquo;best b2b marketing agency for seed-stage startups&rdquo;
                </span>
                <span>run 3/10</span>
              </div>
              <p className="px-6 pb-1.5 pt-[22px] text-base leading-[1.65] text-ink-soft">
                For a seed-stage B2B startup, I&rsquo;d look at{" "}
                <b className="font-semibold text-ink">Saltgrass Digital</b>,{" "}
                <b className="font-semibold text-ink">Fathom &amp; Reed</b>, or{" "}
                <b className="font-semibold text-ink">Pinelock Marketing</b>. All
                three have strong track records with early-stage B2B
                companies&hellip;
              </p>
              <div className="mx-6 mb-[22px] mt-2 inline-flex items-center gap-2.5 rounded-xl bg-gold-soft px-4 py-2.5 text-sm font-semibold text-bad">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-bad"
                />
                Your business: not mentioned
              </div>
            </div>

            <div className="absolute -top-[54px] right-0 max-w-[212px] rounded-[18px] bg-white px-5 py-4 shadow-[0_24px_48px_-22px_rgba(46,59,71,0.45)] sm:-right-[34px]">
              <p className="text-[28px] font-semibold leading-none text-ink">
                {SAMPLE_CALLOUT.hits}
                <span className="text-[15px] font-medium text-ink-faint">
                  {" "}/ {SAMPLE_CALLOUT.runs} runs
                </span>
              </p>
              <p className="mt-1.5 text-[13px] leading-[1.4] text-ink-faint">
                named on {SAMPLE_CALLOUT.engine} ·{" "}
                <span className="font-semibold text-bad">
                  competitor: {SAMPLE_CALLOUT.competitorHits}/{SAMPLE_CALLOUT.runs}
                </span>
              </p>
            </div>
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
                We run the questions your customers actually ask across
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
                title="mention rate by engine · sample"
                meta="10 runs/engine"
                rows={SAMPLE_ROWS}
                footer={`n=32 queries · ${SAMPLE_LABEL}`}
              />
              <p className="mt-3 font-mono text-[11px] text-ink-faint">
                <Link href="/sample-report/" className="text-ink hover:text-accent">
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
              className="text-sm font-semibold text-ink hover:text-accent"
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
        <div className="mx-auto grid max-w-[1120px] items-center gap-10 px-5 py-20 sm:px-8 md:grid-cols-[6fr_5fr] md:gap-16">
          <div>
            <h2 className="max-w-[560px] text-3xl font-bold tracking-[-0.035em] text-ink">
              The shortlist got smaller
            </h2>
            <p className="mt-4 max-w-[540px] text-base leading-7 text-ink-soft">
              When a customer asks Google or ChatGPT &ldquo;best marketing agency
              for startups&rdquo; or &ldquo;which budgeting app should I
              use,&rdquo; the
              answer isn&rsquo;t ten blue links anymore. It&rsquo;s{" "}
              <b className="font-bold text-ink">a paragraph that names two or three options</b>.
              If you&rsquo;re not in that paragraph, you&rsquo;re not in the
              conversation. And you can&rsquo;t see it happening, because
              everyone&rsquo;s answer looks different and nobody screenshots the AI
              that <em>didn&rsquo;t</em> mention them.
            </p>
          </div>

          {/* Then-vs-now artifact: ten blue links collapsing into a 3-name
              answer — the claim, drawn (claim + artifact rule). */}
          <div aria-hidden="true" className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/70 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                Search, then
              </p>
              <div className="mt-3 space-y-2.5">
                {[92, 78, 85, 70, 88, 64, 80, 74, 68, 58].map((w, i) => (
                  <div key={i} className="h-2 rounded-full bg-line-dark/70" style={{ width: `${w}%` }} />
                ))}
              </div>
              <p className="mt-3 text-[11px] text-ink-faint">10 results per page</p>
            </div>
            <div className="rounded-xl bg-paper-dim p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
                AI answers, now
              </p>
              <div className="mt-3 space-y-2.5">
                <div className="h-2 w-[90%] rounded-full bg-line-dark/50" />
                <div className="h-2 w-[68%] rounded-full bg-line-dark/50" />
                <div className="mt-1 flex flex-wrap gap-1.5 pt-1">
                  {["A", "B", "C"].map((n) => (
                    <span key={n} className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold text-white">
                      Agency {n}
                    </span>
                  ))}
                </div>
                <div className="h-2 w-[80%] rounded-full bg-line-dark/50" />
              </div>
              <p className="mt-3 text-[11px] font-semibold text-bad">3 names per answer</p>
            </div>
          </div>
        </div>
      </section>

      <Cta />
    </>
  );
}
