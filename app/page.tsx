import type { Metadata } from "next";
import Link from "next/link";
import AnswerCompare from "@/components/AnswerCompare";
import ClosingCta from "@/components/ClosingCta";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import PageSchema from "@/components/PageSchema";
import FoldReadout from "@/components/FoldReadout";
import PromptBar from "@/components/PromptBar";
import RuleEyebrow from "@/components/RuleEyebrow";
import ShareOfVoice from "@/components/ShareOfVoice";
import SearchShiftChart from "@/components/SearchShiftChart";
import StatTile from "@/components/StatTile";
import StepList from "@/components/StepList";
import { SECTION, SECTION_X } from "@/lib/layout";
import { delay } from "@/lib/reveal";
import { faq } from "@/lib/schema";
import { HOME_STATS } from "@/lib/stats";
import { BRAND, OFFER_TITLE } from "@/lib/site";
import {
  DELIVERABLES_COPY,
  FAQ_FIGURES,
  FOLD_COPY,
  HOME_FAQS,
  PROMPT_DEMO,
  REPORT_CONTENTS,
  SHOWCASE_COPY,
} from "@/lib/home";
import { SAMPLE_COMPETITORS, SAMPLE_QUERY } from "@/lib/sample";

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

/* The long-form explainer sections share one measure and one H2 scale (Claude
   Design update 2026-07-30). The measure now comes from lib/layout.ts, which
   every route shares: this page used to carry its own 1180 and was the only
   thing on the site that did. */
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

      {/* THE FOLD. Rebuilt 2026-08-03 (Josh: the site reads like a research
          report, not a product). Three things changed and each is load-bearing.

          IT IS NAVY. The site opened on warm paper under a navy header, which
          put a seam across the top of every page and made the first screen the
          palest thing on it. Running the fold in ink instead lets the header
          dissolve into it, gives Sky somewhere legal to live at the top of the
          page, and means the deliverable can be the bright object in the frame
          rather than one more card on the same ground.

          IT SHOWS A MEASUREMENT. The old fold was a headline, a lede and a
          field: three claims about measuring and nothing measured. FoldReadout
          is a real reading off the sample dataset, so the first screen argues
          by evidence like the rest of the page does.

          THE CHEVRON IS GONE, and with it the svh arithmetic it needed. That
          block existed to promise "the first screen ends AT the chevron", which
          only had to hold because the fold was one centred column with nothing
          below the lede to signal depth. A two-column fold whose right half is
          a data card signals it without a hint to scroll. `min-h` still fills
          the screen on desktop; on phones the columns stack and the readout is
          simply the next thing, which is the point.

          UNCHANGED ON PURPOSE: the h1 and the lede (the strongest sentences on
          the site), and the GET form, which stays a plain form so the primary
          action never waits on hydration. #site and the "Run my" button are
          pinned by funnel.spec.ts. */}
      <section className="bg-ink text-white">
        <div
          className={`${SECTION_X} flex min-h-[calc(100svh-126px)] flex-col justify-center py-14 md:py-16`}
        >
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
            {/* min-w-0 on both halves: on phones this is a single auto column
                and a grid item defaults to min-width:auto, so the column is
                floored at its min-content and pushes the page sideways. Same
                root cause as the fr tracks in lib/layout.ts's commit. */}
            <div className="min-w-0">
              <div data-reveal>
                <RuleEyebrow onDark>{FOLD_COPY.eyebrow}</RuleEyebrow>
              </div>
              {/* The commercial proposition, not the provocation. The old h1
                  ("does it say your name?") asked the visitor a question and
                  left them to work out what was being sold; this states the
                  service and the outcome in one line. */}
              <h1
                data-reveal
                style={delay(80)}
                className="display mt-5 max-w-[620px] text-[clamp(34px,4.6vw,54px)] leading-[1.06] text-white text-pretty"
              >
                {FOLD_COPY.heading}
              </h1>
              <p
                data-reveal
                style={delay(160)}
                className="mt-6 max-w-[560px] text-[16.5px] leading-[1.65] text-white/75"
              >
                {FOLD_COPY.lede}
              </p>

              {/* One field, then the same form the visitor was always going to
                  fill. A GET form is not an interactivity island, so the fold
                  still works with JavaScript off, and `form-action 'self'` in
                  the CSP already allows it. /free-check reads the `site` param
                  and prefills the website field. */}
              <form
                action="/free-check/"
                method="get"
                data-reveal
                style={delay(240)}
                /* Stacked, not side by side. The primary action's label grew
                   to the full offer name and squeezed the field to ~140px in a
                   row, which put the page's most important input second in
                   visual weight to its own button. Full-width both makes the
                   field usable and the action unmistakable. */
                className="mt-8 flex w-full max-w-[440px] flex-col gap-3"
              >
                <label htmlFor="site" className="sr-only">
                  Your website
                </label>
                {/* A translucent field rather than a white one: a white input
                    beside a white submit reads as one shape, and the button has
                    to be the brighter of the two. */}
                <input
                  id="site"
                  name="site"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  required
                  maxLength={200}
                  placeholder="yourbusiness.com"
                  className="w-full rounded-full border border-white/35 bg-white/[0.14] px-[22px] py-[15px] text-[15px] text-white placeholder:text-white/60 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/25"
                />
                <button
                  type="submit"
                  className="btn-pill-invert w-full justify-center px-[26px] py-[16px] text-[13.5px]"
                >
                  {/* One text node, not two: `Run my {x}` ships as
                      `Run my <!-- -->free ai check` and splits the label in the
                      raw bytes a crawler reads. */}
                  {/* The full offer name, not OFFER_SHORT: the pill is
                      uppercase-transformed so length is the only cost, and the
                      brief wants the primary action to say what it runs. */}
                  {`Run my ${OFFER_TITLE} `}
                  <span className="text-base">&#10230;</span>
                </button>
              </form>

              <p
                data-reveal
                style={delay(300)}
                className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] text-white/75"
              >
                {/* The dogfood page is the credential we actually have: nobody
                    else in this category publishes an audit of themselves, and
                    the sample-data honesty rule forbids a client logo wall
                    until a real result is cleared. */}
                <Link
                  href="/our-score/"
                  className="inline-flex items-center gap-2 font-medium text-white/85 underline-offset-4 hover:text-white hover:underline"
                >
                  <span
                    aria-hidden="true"
                    className="h-[6px] w-[6px] rounded-full bg-sky"
                  />
                  {FOLD_COPY.proof}
                </Link>
                <Link
                  href="/sample-report/"
                  className="font-medium text-white/85 underline-offset-4 hover:text-white hover:underline"
                >
                  {FOLD_COPY.secondary}
                </Link>
              </p>
            </div>

            <div data-reveal="scale" style={delay(220)} className="min-w-0">
              <FoldReadout />
              <p className="mt-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">
                {FOLD_COPY.readoutLabel}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- 2. WHAT YOU GET -------------------------------------------
          Second screen answers the second buying question. The deliverables
          list already existed inside FreeCheckPanel at the very bottom of the
          page, where a visitor deciding whether to start had already left. */}
      <section className="border-b border-line">
        <div className={SECTION}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
            <div data-reveal className="min-w-0">
              <RuleEyebrow>{DELIVERABLES_COPY.eyebrow}</RuleEyebrow>
              <h2 className={`mt-4 ${H2}`}>{DELIVERABLES_COPY.heading}</h2>
              <p className="mt-5 max-w-[420px] text-[15.5px] leading-[1.7] text-ink-soft">
                {DELIVERABLES_COPY.body}
              </p>
              <Link
                href="/sample-report/"
                className="btn-pill-outline mt-8 px-[26px] py-[13px] text-[12.5px]"
              >
                {FOLD_COPY.secondary}
                <span aria-hidden="true" className="ml-2.5">&#10230;</span>
              </Link>
            </div>

            {/* Numbered ledger rather than a card grid: five deliverables in
                white boxes would be the fourth card grid on a page that now
                only has room for one of anything. */}
            <dl data-reveal style={delay(120)} className="min-w-0">
              {REPORT_CONTENTS.map((item, i) => (
                <div
                  key={item.name}
                  className="grid grid-cols-[30px_minmax(0,1fr)] items-baseline gap-x-4 border-t border-line-dark py-5 last:border-b"
                >
                  <dt className="display text-[19px] leading-none text-ink-faint">
                    {String(i + 1).padStart(2, "0")}
                  </dt>
                  <dd>
                    <p className="text-[16px] font-medium text-ink">{item.name}</p>
                    <p className="mt-1.5 text-[14.5px] leading-[1.6] text-ink-soft">
                      {item.body}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ---- 3. HOW IT WORKS --------------------------------------------
          Three steps, with the prompt bar as step one's evidence rather than
          as its own explanatory screen. The claim-and-artifact rule wanted a
          artifact here and this section never had one. */}
      <section className="border-b border-line">
        <div className={SECTION}>
          <div data-reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <RuleEyebrow>How it works</RuleEyebrow>
              <h2 className={`mt-4 ${H2}`}>Three steps, no theater.</h2>
            </div>
            <Link
              href="/how-it-works/"
              className="pb-2 text-sm font-semibold text-ink underline-offset-4 hover:text-accent hover:underline"
            >
              Full methodology &#10230;
            </Link>
          </div>

          <div className="mt-9 max-w-[760px]">
            <p data-reveal className="text-[15.5px] leading-[1.7] text-ink-soft">
              {PROMPT_DEMO.body}
            </p>
            <PromptBar bare />
          </div>

          {/* Revealed as one block: the step cells share borders, so fading
              them in individually would expose the seams. */}
          <div data-reveal style={delay(120)} className="mt-12">
            <StepList steps={STEPS} />
          </div>
        </div>
      </section>

      {/* ---- 4. THE SAMPLE RESULT ---------------------------------------- */}
      {/* The answer card and the share-of-voice table are ONE surface: the
          card is a single run and the table is what forty of them add up to,
          which is the difference between a screenshot and a measurement.

          The pair is deliberately mismatched in register. The card is a
          product mockup, so it keeps its radius and its shadow; the table is a
          measurement artifact, so it stays square and flat. One is what AI
          said, the other is what Sable did with it. */}
      <section className="border-b border-line">
        <div className={SECTION}>
          <div data-reveal className="max-w-[560px]">
            <RuleEyebrow>{SHOWCASE_COPY.eyebrow}</RuleEyebrow>
            <h2 className={`${H2} mt-4`}>{SHOWCASE_COPY.heading}</h2>
            <p className="mt-5 text-[15.5px] leading-[1.7] text-ink-soft">
              {SHOWCASE_COPY.body}
            </p>
          </div>

          <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-14">
            <div
              data-reveal="scale"
              className="min-w-0 overflow-hidden rounded-[22px] bg-paper-dim shadow-[0_34px_70px_-26px_rgba(14,35,64,0.4)]"
            >
              <div className="flex justify-between gap-3 border-b border-line px-[22px] py-[15px] text-xs text-ink-faint">
                <span className="font-semibold text-ink">
                  {`chatgpt \u00a0\u00b7\u00a0 \u201c${SAMPLE_QUERY}\u201d`}
                </span>
                <span className="shrink-0">run 3/10</span>
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
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-white" />
                Your business: not mentioned
              </div>
            </div>

            <div data-reveal="scale" style={delay(160)} className="min-w-0">
              <ShareOfVoice />
            </div>
          </div>
        </div>
      </section>

      {/* ---- 5. THE TWO CONTRASTING ANSWERS ------------------------------
          Everything above is mechanism; this is the outcome the mechanism
          produces. Illustrative and labeled (lib/sample.ts honesty rule). */}
      <section className="border-b border-line">
        <div className={SECTION}>
          <div data-reveal className="max-w-[700px]">
            <RuleEyebrow>What this looks like in practice</RuleEyebrow>
            <h2 className={`mt-4 ${H2}`}>
              The same question. Two very different answers.
            </h2>
            <p className="mt-5 max-w-[600px] text-[15.5px] leading-[1.7] text-ink-soft">
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

      {/* ---- 6. MARKET CONTEXT -------------------------------------------
          Concise, and late. This is the "why now" a visitor checks AFTER they
          understand the offer, not the argument they have to read through to
          reach it. The three sourced stats and the two-line chart do the job
          that eight explanatory sections used to. */}
      <section className="border-b border-line">
        <div className={`${SECTION} grid gap-7 md:grid-cols-3 md:gap-12`}>
          {HOME_STATS.map((stat, i) => (
            <div key={stat.source} data-reveal style={delay(i * 110)}>
              <StatTile stat={stat} />
            </div>
          ))}
        </div>
      </section>

      <SearchShiftChart />

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
