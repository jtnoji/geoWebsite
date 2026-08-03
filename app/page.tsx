import type { Metadata } from "next";
import Link from "next/link";
import AnswerCompare from "@/components/AnswerCompare";
import Chip from "@/components/Chip";
import ClosingCta from "@/components/ClosingCta";
import EngagementSteps from "@/components/EngagementSteps";
import FaqSection from "@/components/FaqSection";
import FeatureCard from "@/components/FeatureCard";
import FoundationList from "@/components/FoundationList";
import FreeCheckPanel from "@/components/FreeCheckPanel";
import JsonLd from "@/components/JsonLd";
import PageSchema from "@/components/PageSchema";
import PromptBar from "@/components/PromptBar";
import RevenueAtStake from "@/components/RevenueAtStake";
import RuleEyebrow from "@/components/RuleEyebrow";
import SamplingCard from "@/components/SamplingCard";
import SearchShiftChart from "@/components/SearchShiftChart";
import StatTile from "@/components/StatTile";
import StepList from "@/components/StepList";
import { delay } from "@/lib/reveal";
import { faq } from "@/lib/schema";
import { HOME_STATS } from "@/lib/stats";
import { BRAND, OFFER_SHORT } from "@/lib/site";
import {
  ENGINES,
  FAQ_FIGURES,
  HOME_FAQS,
  SITUATIONS,
  SOURCES,
} from "@/lib/home";
import {
  SAMPLE_CALLOUT,
  SAMPLE_COMPETITORS,
  SAMPLE_LABEL,
  SAMPLE_ROWS,
} from "@/lib/sample";

export const metadata: Metadata = {
  title: { absolute: `${BRAND}: does AI recommend your business?` },
  description:
    "ChatGPT, Google AI, Gemini, and Perplexity name only a few businesses per answer. We measure whether you're one of them, and who gets named instead.",
  alternates: { canonical: "/" },
};

const STEPS = [
  {
    title: "We ask",
    body: "Real customer questions, run across every major AI engine, multiple times each.",
  },
  {
    title: "We judge",
    body: "Every answer graded for presence, prominence, and accuracy against a fact sheet you approve.",
  },
  {
    title: "You get a roadmap",
    body: "Your numbers, your gaps, and a fix list ordered by what moves AI answers. We can implement it for you and measure again.",
  },
] as const;

const METRICS = [
  {
    name: "Mention rate",
    detail: (
      <>
        <b className="font-bold text-ink">Named in 7 of 10 runs.</b> Rates, not
        one-off screenshots.
      </>
    ),
  },
  {
    name: "Share of voice",
    detail: <>You vs. the competitors named instead of you.</>,
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
    detail: <>The sites AI cites when it builds the answer.</>,
  },
] as const;

/* The long-form explainer sections share one measure and one H2 scale (Claude
   Design update 2026-07-30). Kept as constants so a change lands on all of
   them at once rather than drifting section by section. */
const SECTION = "mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24";
const H2 =
  "display text-[clamp(33px,4.4vw,52px)] leading-[1.1] text-ink text-pretty";

export default function Home() {
  return (
    <>
      {/* No breadcrumb: the home page is the root of every trail. */}
      <PageSchema meta={metadata} path="/" />
      {/* The home FAQ renders from the same HOME_FAQS array that feeds this
          FAQPage node, so the visible questions and the schema cannot drift.
          Same pattern as /how-it-works. */}
      <JsonLd data={faq(HOME_FAQS)} />

      {/* Hero — centered badge, display headline, pill CTAs, bobbing chevron.
          The first screen ends AT the chevron: the block is one viewport minus
          the 64px header and the 62px BottomBar the body already reserves, and
          `svh` rather than `vh` so a mobile browser's collapsing URL bar cannot
          push the chevron under the fold. The copy carries `my-auto` so it
          centres in whatever is left above the chevron, and the chevron's own
          margin is fixed — two auto margins would split the slack instead of
          seating it on the bottom edge.

          Every gap and both type sizes in here are `min(designed, Nsvh)`, and
          the headline's clamp takes a height term on BOTH ends. A width-only
          clamp cannot know that a 1280x720 window has 658 usable pixels and
          the headline alone wants 265 of them, so the fold promise breaks on
          exactly the screens that are short rather than narrow. The caps are
          the designed values, so any viewport tall enough to seat the block —
          1440x900 and up on desktop, and every current phone — renders it
          unchanged and nothing below 720px tall overflows. Re-measure the
          chevron against `innerHeight - 62` before retuning any of them. */}
      <section>
        <div className="mx-auto flex min-h-[calc(100svh-126px)] max-w-[920px] flex-col px-5 pb-[min(24px,3svh)] pt-[min(24px,3svh)] text-center sm:px-8">
          <div className="my-auto">
            {/* Where every competitor puts a customer logo wall. We cannot run
                one until a real client result is cleared (the sample-data
                honesty rule), and the dogfood page is the better credential
                anyway: nobody else in this category publishes an audit of
                themselves. Same slot, same pill, zero added fold height. */}
            <Link
              href="/our-score/"
              data-reveal
              className="inline-flex items-center gap-2.5 rounded-full border border-[rgba(14,35,64,0.22)] bg-white px-[18px] py-2.5 text-[13px] font-medium text-ink transition-colors hover:border-ink"
            >
              <span
                aria-hidden="true"
                className="h-[7px] w-[7px] rounded-full bg-ink"
              />
              We ran this audit on our own site
              <span aria-hidden="true" className="text-ink-faint">
                &#10230;
              </span>
            </Link>
            <h1
              data-reveal
              style={delay(80)}
              className="display mx-auto mt-[min(24px,2.6svh)] max-w-[900px] text-[clamp(min(38px,4.8svh),min(6.6vw,9.4svh),84px)] leading-[1.05] text-ink"
            >
              When someone asks AI for a recommendation, does it say your name?
            </h1>
            <p
              data-reveal
              style={delay(160)}
              className="display mx-auto mt-[min(24px,2.6svh)] max-w-[620px] text-[min(19px,2.5svh)] italic leading-[1.5] text-ink-soft sm:text-[min(23px,2.9svh)]"
            >
              ChatGPT, Google AI, Gemini, and Perplexity answer your customers
              directly, and each answer names{" "}
              <b className="font-semibold text-ink">only a few businesses</b>.{" "}
              {BRAND}{" "}measures whether you&rsquo;re one of them and{" "}
              <b className="font-semibold text-ink">who gets named instead</b>.
              {" "}Then we do the work the numbers point to.
            </p>
            {/* One field, then the same form the visitor was always going to
                fill. Every established site in this category opens with domain
                capture rather than a link to a capture page, and it costs us
                nothing to match: a GET form is not an interactivity island, so
                the fold still works with JavaScript off, and `form-action
                'self'` in the CSP already allows it. /free-check reads the
                `site` param and prefills the website field. */}
            <form
              action="/free-check/"
              method="get"
              data-reveal
              style={delay(240)}
              className="mx-auto mt-[min(24px,2.8svh)] flex w-full max-w-[520px] flex-col gap-3 sm:mt-[min(32px,3.4svh)] sm:flex-row"
            >
              <label htmlFor="site" className="sr-only">
                Your website
              </label>
              <input
                id="site"
                name="site"
                type="text"
                inputMode="url"
                autoComplete="url"
                required
                maxLength={200}
                placeholder="yourbusiness.com"
                className="w-full rounded-full border border-line-dark bg-white px-[22px] py-[15px] text-[15px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
              />
              <button
                type="submit"
                className="btn-pill shrink-0 justify-center px-[26px] py-[15px] text-[13.5px]"
              >
                {/* Derived from the locked offer name rather than a second
                    shortening of it, but phrased as the visitor's own action:
                    the header pill directly above already reads OFFER_SHORT,
                    and two identical labels in one viewport read as a repeat
                    instead of a next step. */}
                Run my {OFFER_SHORT.toLowerCase()}{" "}
                <span className="text-base">&#10230;</span>
              </button>
            </form>
            <p
              data-reveal
              style={delay(300)}
              className="mx-auto mt-[min(12px,1.5svh)] max-w-[640px] text-[13px] leading-[1.5] text-ink-faint"
            >
              Verbatim answers, mention rates per engine, and who gets named
              instead.{" "}
              <Link
                href="/sample-report/"
                className="font-medium text-ink-soft underline-offset-4 hover:text-accent hover:underline"
              >
                See a sample report
              </Link>
              .
            </p>
          </div>
          {/* "fade" (no transform) so the reveal can't fight the bob animation. */}
          <div
            aria-hidden="true"
            data-reveal="fade"
            style={delay(360)}
            className="weir-bob mt-[min(24px,2.8svh)] flex shrink-0 justify-center text-ink sm:mt-[min(30px,3.2svh)]"
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
      </section>

      {/* The moment the fold is about: a customer typing the question. It
          comes first because the two sections under it both assume it. The
          chart says the question now goes to an answer engine, and the answer
          card shows what that answer leaves out. */}
      <PromptBar />

      {/* Second screen: the thesis as two measured lines. It sits between the
          fold and the answer card on purpose. The card shows one business
          missing from one answer, which only lands once the reader accepts
          that the answer is where the question now goes. */}
      <SearchShiftChart />

      {/* What the shift is worth. Moved here 2026-08-03 (Josh) from after the
          shortlist section: it answers the chart immediately above, because the
          question a reader has on finishing those two lines is what the
          crossing is worth. It sizes the channel and then says the
          per-business figure does not exist, which is why it stays ahead of
          every method section either way. */}
      <RevenueAtStake />

      {/* Product showcase — the cream answer card with its floating stat
          callout anchored to the card's top-right corner. Top padding clears
          the callout's own -54px overhang. */}
      <section>
        <div className="mx-auto max-w-[1000px] px-5 pb-24 pt-[104px] sm:px-8">
          <div className="relative mx-auto max-w-[660px]">
            <div
              data-reveal="scale"
              className="overflow-hidden rounded-[22px] bg-paper-dim shadow-[0_34px_70px_-26px_rgba(14,35,64,0.4)]"
            >
              <div className="flex justify-between gap-3 border-b border-line px-[22px] py-[15px] text-xs text-ink-faint">
                <span className="font-semibold text-ink">
                  chatgpt &nbsp;·&nbsp; &ldquo;best b2b marketing agency for seed-stage startups&rdquo;
                </span>
                <span>run 3/10</span>
              </div>
              <p className="px-6 pb-1.5 pt-[22px] text-base leading-[1.65] text-ink-soft">
                For a seed-stage B2B startup, I&rsquo;d look at{" "}
                <b className="font-semibold text-ink">{SAMPLE_COMPETITORS[0]}</b>,{" "}
                <b className="font-semibold text-ink">{SAMPLE_COMPETITORS[1]}</b>, or{" "}
                <b className="font-semibold text-ink">{SAMPLE_COMPETITORS[2]}</b>. All
                three have strong track records with early-stage B2B
                companies&hellip;
              </p>
              <div className="mx-6 mb-[22px] mt-2 inline-flex items-center gap-2.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-white">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-white"
                />
                Your business: not mentioned
              </div>
            </div>

            <div
              data-reveal="scale"
              style={delay(220)}
              className="absolute -top-[54px] right-0 max-w-[212px] rounded-[18px] bg-white px-5 py-4 shadow-[0_24px_48px_-22px_rgba(14,35,64,0.45)] sm:-right-[34px]"
            >
              <p className="text-[28px] font-semibold leading-none text-ink">
                {SAMPLE_CALLOUT.hits}
                <span className="text-[15px] font-medium text-ink-faint">
                  {" "}/ {SAMPLE_CALLOUT.runs} runs
                </span>
              </p>
              <p className="mt-1.5 text-[13px] leading-[1.4] text-ink-faint">
                named on {SAMPLE_CALLOUT.engine} ·{" "}
                <span className="font-medium text-bad">
                  competitor {SAMPLE_CALLOUT.competitorHits}/{SAMPLE_CALLOUT.runs}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stat row — editorial, every number with a named source */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1120px] gap-7 px-5 py-14 sm:px-8 md:grid-cols-3 md:gap-12">
          {HOME_STATS.map((stat, i) => (
            <div key={stat.source} data-reveal style={delay(i * 110)}>
              <StatTile stat={stat} />
            </div>
          ))}
        </div>
      </section>

      {/* Where search lives in 2026 — the framing that makes the stat row
          above mean something: ten slots became one paragraph. Two columns so
          the claim and the reasoning read as separate registers.

          The page's first navy band, added 2026-08-03 (Josh). The other three
          all sit in the last quarter, so ~4,000 words of explainer ran on one
          unbroken paper ground before the reader met a second surface. This
          section earns the break: it carries no artifact to invert, and it is
          the thesis every method section below is downstream of. Sky is spent
          on the eyebrow, once, per the band rule. */}
      <section className="bg-ink text-white">
        <div className={SECTION}>
          <div className="grid gap-12 md:grid-cols-2 md:gap-[72px] md:items-start">
            <div data-reveal>
              <RuleEyebrow onDark>Where search lives in 2026</RuleEyebrow>
              <h2 className="display mt-4 max-w-[620px] text-[clamp(33px,4.4vw,52px)] leading-[1.1] text-white text-pretty">
                Your customers ask four different AI systems. Most businesses
                are measured on none of them.
              </h2>
            </div>
            <div data-reveal style={delay(140)} className="flex flex-col gap-5 pt-2">
              <p className="text-[19px] font-medium leading-[1.6] text-white text-pretty">
                Traditional search put you on a page with ten slots. An AI
                answer is a paragraph that names two or three businesses. That
                is the whole change, and it is not a future one. A growing
                share of your customers already decide this way.
              </p>
              <p className="text-[15.5px] leading-[1.7] text-white/70">
                Each engine builds that paragraph differently. They read
                different sources, run different crawlers, weight recency
                differently, and change their answer from one run to the next.
                One good screenshot tells you nothing. So does one bad one.
              </p>
              <p className="text-[15.5px] leading-[1.7] text-white/70">
                So we sample. The same customer questions, run repeatedly
                across all four engines, scored the same way every time. That
                turns an anxiety you cannot see into a number you can compare
                month over month.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The shortlist problem. Stays in the page's first movement, per
          website-plan.md §2's page order: the reader needs the problem before
          the method. It shipped second-to-last until 2026-07-28, so the page
          explained how we measure before saying why it matters. The 2026-07-30
          explainer sections were inserted around it, never in front of it. */}
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1120px] items-center gap-10 px-5 py-20 sm:px-8 md:grid-cols-[6fr_5fr] md:gap-16">
          <div data-reveal>
            <h2 className="display max-w-[580px] text-[34px] text-ink">
              The shortlist got smaller
            </h2>
            {/* Two example queries, local trade + software, per the settled
                audience decision in website-plan.md §6 ("mixed examples").
                They deliberately do NOT match the B2B-agency scenario in the
                hero card: the stat tiles above cite local-business research,
                so an agency-only page reads as if it serves only agencies.
                The single agency example here was a 2026-07-28 clarity fix. */}
            <p className="mt-4 max-w-[540px] text-base leading-7 text-ink-soft">
              When a customer asks Google or ChatGPT &ldquo;best electrician
              near me&rdquo; or &ldquo;which budgeting app should I use,&rdquo;
              the answer isn&rsquo;t ten blue links. It&rsquo;s{" "}
              <b className="font-bold text-ink">a paragraph that names two or three options</b>.
              If you&rsquo;re not in it, you&rsquo;re not in the conversation.
              And you never find out, because everyone&rsquo;s answer is
              different and nobody screenshots the AI that{" "}
              <em>didn&rsquo;t</em> mention them.
            </p>
          </div>

          {/* Then-vs-now artifact: ten blue links collapsing into a 3-name
              answer — the claim, drawn (claim + artifact rule). */}
          <div
            aria-hidden="true"
            data-reveal
            style={delay(140)}
            className="grid grid-cols-2 gap-4"
          >
            <div className="rounded-xl bg-white p-4">
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
                      Option {n}
                    </span>
                  ))}
                </div>
                <div className="h-2 w-[80%] rounded-full bg-line-dark/50" />
              </div>
              <p className="mt-3 text-[11px] font-medium text-bad">3 names per answer</p>
            </div>
          </div>
        </div>
      </section>

      {/* The four engines. Named individually because "AI search" as one blob
          is why people assume a single fix exists: the engines disagree, and
          the card set is the artifact that says so. Order matches
          lib/sample.ts SAMPLE_ROWS so the sampling card below reads as the
          same four. */}
      <section className="border-b border-line">
        <div className={SECTION}>
          <div data-reveal>
            <RuleEyebrow>The four surfaces we measure</RuleEyebrow>
            <h2 className={`mt-4 max-w-[760px] ${H2}`}>
              Four engines. Four different sets of rules.
            </h2>
          </div>
          {/* `grid` on each reveal wrapper, not `flex`: a lone grid child
              stretches on both axes, so the wrapper cannot leave a short card
              floating in a tall row. Same for the source and situation grids. */}
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {ENGINES.map((engine, i) => (
              <div key={engine.name} data-reveal style={delay(i * 90)} className="grid">
                <FeatureCard
                  kicker={engine.kicker}
                  title={engine.name}
                  sub={engine.mode}
                  body={engine.body}
                  signals={engine.signals}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we do — metrics list + sampling card */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1120px] px-5 py-20 sm:px-8">
          <div className="grid items-center gap-11 md:grid-cols-[6fr_5fr] md:gap-[72px]">
            <div data-reveal>
              <Chip>What we do</Chip>
              <h2 className="display mt-3.5 max-w-[580px] text-[34px] text-ink md:text-[38px]">
                We measure your AI visibility. Properly.
              </h2>
              <p className="mt-3.5 max-w-[520px] text-[16.5px] leading-7 text-ink-soft">
                We run your customers&rsquo; real questions across ChatGPT,
                Google&rsquo;s AI answers, Gemini, and Perplexity,{" "}
                <b className="font-bold text-ink">multiple times each</b>,
                because the answers change run to run. Then we grade every one.
                You get numbers, not vibes.
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
            <div data-reveal style={delay(140)}>
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

      {/* Where an answer comes from. The point the sampling card above cannot
          make on its own: the rate is produced by other people's pages, which
          is why the fix list is rarely "change your homepage". */}
      <section className="border-b border-line">
        <div className={SECTION}>
          <div
            data-reveal
            className="flex flex-wrap items-end justify-between gap-6"
          >
            <div>
              <RuleEyebrow>Where an answer comes from</RuleEyebrow>
              <h2 className={`mt-4 max-w-[700px] ${H2}`}>
                An AI answer is assembled from other people&rsquo;s pages.
              </h2>
            </div>
            <p className="max-w-[360px] pb-2 text-[15.5px] leading-[1.7] text-ink-soft">
              Engines learn what to say about you by reading what other sources
              say about you. These are the surfaces that conversation happens
              on, and the ones we check you against.
            </p>
          </div>
          {/* A ledger on the ground, not a fifth grid of white boxes. This was
              a 4-up FeatureCard set identical to the engines grid five
              sections above, and two matching grids that close to each other
              read as one repeated module rather than two separate arguments.
              Rules and a name column also suit the content better: these are
              four surfaces to be itemised and checked against, not four
              parallel products. The swatches stay, because the sampling
              artifacts elsewhere use the same legend. */}
          <dl className="mt-12">
            {SOURCES.map((source, i) => (
              <div
                key={source.name}
                data-reveal
                style={delay(i * 80)}
                className="grid gap-x-10 gap-y-3 border-t border-line-dark py-8 last:border-b last:border-line-dark md:grid-cols-[minmax(190px,240px)_1fr]"
              >
                <dt className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center ${source.swatchBox}`}
                  >
                    <span
                      className={`h-[9px] w-[9px] rounded-full ${source.swatch}`}
                    />
                  </span>
                  <span className="text-[19px] font-medium leading-[1.3] tracking-[-0.015em] text-ink text-pretty">
                    {source.name}
                  </span>
                </dt>
                <dd>
                  <p className="max-w-[680px] text-[15px] leading-[1.7] text-ink-soft text-pretty">
                    {source.body}
                  </p>
                  <p className="mt-3.5 text-[13px] font-medium leading-[1.55] text-accent">
                    {source.note}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* The four technical foundations. Sticky head against a scrolling list:
          the four are a single argument, so the question stays on screen while
          the answers pass. Crawler access is numbered in full-strength ink because it is
          the failure we hit most often. */}
      <section className="border-b border-line">
        <div className={SECTION}>
          {/* No `items-start` here, and the sticky element is a CHILD of the
              grid item rather than the item itself. A sticky grid item is
              exactly as tall as its grid area either way — stretched it fills
              the area, start-aligned it shrinks to content — so it has no
              travel range and never sticks. The stretched wrapper gives the
              child one. */}
          <div className="grid gap-12 md:grid-cols-2 md:gap-[72px]">
            <div>
              <div data-reveal className="md:sticky md:top-[110px]">
                <RuleEyebrow>The four technical foundations</RuleEyebrow>
                <h2 className={`mt-4 max-w-[520px] ${H2}`}>
                  Before anything else: can the engines read you?
                </h2>
                <p className="mt-6 max-w-[440px] text-[15.5px] leading-[1.7] text-ink-soft">
                  Four things decide whether an engine can use your website as
                  a source. None are exotic and all are measurable. The first
                  one alone accounts for more invisible businesses than every
                  content problem combined.
                </p>
                <p className="mt-4 max-w-[440px] text-[15.5px] leading-[1.7] text-ink-soft">
                  Every free check covers all four, verified by live fetch
                  rather than assumption.
                </p>
              </div>
            </div>
            <div data-reveal style={delay(140)}>
              <FoundationList />
            </div>
          </div>
        </div>
      </section>

      {/* How it works — joined step cells */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-[1120px] px-5 py-20 sm:px-8">
          <div data-reveal className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <Chip>How it works</Chip>
              <h2 className="display text-[34px] text-ink md:text-[38px]">
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
          {/* Revealed as one block — the step cells share borders, so fading
              them in individually would expose the seams. */}
          <div data-reveal style={delay(120)} className="mt-8">
            <StepList steps={STEPS} />
          </div>
        </div>
      </section>

      {/* The same question, two answers. The page's second artifact: everything
          above is mechanism, this is the outcome the mechanism produces.
          Illustrative and labeled as such (lib/sample.ts honesty rule). */}
      <section className="border-b border-line">
        <div className={SECTION}>
          <div data-reveal className="max-w-[760px]">
            <RuleEyebrow>What this looks like in practice</RuleEyebrow>
            <h2 className={`mt-4 max-w-[700px] ${H2}`}>
              The same question. Two very different answers.
            </h2>
            <p className="mt-6 max-w-[600px] text-[15.5px] leading-[1.7] text-ink-soft">
              Both of these businesses rank on page one of Google for the
              query. Only one of them exists in the paragraph the customer
              reads.
            </p>
          </div>
          <div data-reveal style={delay(120)} className="mt-11">
            <AnswerCompare />
          </div>
        </div>
      </section>

      {/* Who asks for this. Qualification without a quiz: the reader picks
          their own row and gets the specific first step for it. */}
      <section className="border-b border-line">
        <div className={SECTION}>
          <div data-reveal>
            <RuleEyebrow>Who asks for this</RuleEyebrow>
            <h2 className={`mt-4 max-w-[640px] ${H2}`}>
              Three situations that bring people here.
            </h2>
          </div>
          {/* Columns with no card around them: a rule on top, the numeral, and
              the text sitting directly on the paper. The three-across rhythm is
              right for the content (the reader picks their own row) but the
              white fill was not, because a bordered box says "one of a set of
              equal things" and these are alternatives. Dropping the fill also
              leaves the engines grid as the page's only card set. */}
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-x-12">
            {SITUATIONS.map((situation, i) => (
              <div
                key={situation.title}
                data-reveal
                style={delay(i * 110)}
                className="flex flex-col border-t-2 border-ink pt-5"
              >
                <span
                  aria-hidden="true"
                  className="display text-[34px] leading-none text-[rgba(14,35,64,0.22)]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-xl font-medium tracking-[-0.015em] text-ink text-pretty">
                  {situation.title}
                </h3>
                <p className="mt-3.5 flex-1 text-[14.5px] leading-[1.65] text-ink-soft text-pretty">
                  {situation.body}
                </p>
                <p className="mt-5 border-t border-line pt-4 text-[13px] font-medium leading-[1.55] text-accent">
                  {situation.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EngagementSteps />

      <FreeCheckPanel />

      {/* FAQ. One {question, answer}[] renders both the visible H2s and the
          FAQPage JSON-LD (lib/home.ts HOME_FAQS), so schema cannot drift from
          the text. The two figures beside it restate the protocol and the
          posture as numbers. */}
      <section className="border-t border-line">
        <div className={SECTION}>
          <div className="grid gap-12 md:grid-cols-2 md:gap-[72px] md:items-start">
            <div data-reveal>
              <RuleEyebrow>Frequently asked</RuleEyebrow>
              <h2 className={`mt-4 max-w-[460px] ${H2}`}>
                The questions we get, answered directly.
              </h2>
              <div className="mt-9 flex flex-col gap-4">
                {FAQ_FIGURES.map((figure) => (
                  <div
                    key={figure.label}
                    className="border border-line-dark bg-white px-[26px] py-6"
                  >
                    <p
                      className={`display text-[44px] leading-none ${
                        figure.accent ? "text-accent" : "text-ink"
                      }`}
                    >
                      {figure.value}
                    </p>
                    <p className="mt-2 font-mono text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                      {figure.label}
                    </p>
                    <p className="mt-3 text-sm leading-[1.6] text-ink-soft">
                      {figure.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div data-reveal style={delay(140)}>
              <FaqSection faqs={HOME_FAQS} compact />
            </div>
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
