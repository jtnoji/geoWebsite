import type { Metadata } from "next";
import Link from "next/link";
import AnswerCompare from "@/components/AnswerCompare";
import ClosingCta from "@/components/ClosingCta";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import PageSchema from "@/components/PageSchema";
import FoldReadout from "@/components/FoldReadout";
import FoundationList from "@/components/FoundationList";
import LiveAnswer from "@/components/LiveAnswer";
import RuleEyebrow from "@/components/RuleEyebrow";
import SamplingCard from "@/components/SamplingCard";
import ShareOfVoice from "@/components/ShareOfVoice";
import SearchShiftChart from "@/components/SearchShiftChart";
import StatTile from "@/components/StatTile";
import { SECTION, SECTION_X } from "@/lib/layout";
import { SERVICE_TIERS } from "@/lib/offers";
import { delay } from "@/lib/reveal";
import { faq } from "@/lib/schema";
import { HOME_STATS } from "@/lib/stats";
import { BRAND, OFFER_TITLE } from "@/lib/site";
import {
  CAPABILITIES,
  FAQ_FIGURES,
  FOLD_COPY,
  HOME_FAQS_TOP,
  PLANS_COPY,
} from "@/lib/home";
import { SAMPLE_LABEL, SAMPLE_ROWS } from "@/lib/sample";

export const metadata: Metadata = {
  title: { absolute: `${BRAND}: does AI recommend your business?` },
  description:
    "ChatGPT, Google AI, Gemini, and Perplexity name only a few businesses per answer. We measure whether you're one of them, and who gets named instead.",
  alternates: { canonical: "/" },
};

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
      <JsonLd data={faq(HOME_FAQS_TOP)} />

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
                {FOLD_COPY.heroHeading}
              </h1>
              <p
                data-reveal
                style={delay(160)}
                className="mt-6 max-w-[560px] text-[16.5px] leading-[1.65] text-white/75"
              >
                {FOLD_COPY.heroLede}
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

            {/* The interface, not a readout of one. FoldReadout stated the
                result; this performs the behaviour that produces it, which is
                the difference between a page about AI search and a page that
                shows it. The scorecard is not lost: it is the same numbers the
                sample-result section carries below. */}
            <div data-reveal="scale" style={delay(220)} className="min-w-0">
              <LiveAnswer />
            </div>
          </div>
        </div>
      </section>

      {/* ---- 2. WHY IT MATTERS ------------------------------------------
          One compact section, not a category essay. Two sourced statistics and
          the projection, and then the page moves to the offer. The third stat
          and the whole revenue-consequence section moved off home: a visitor
          evaluating a service does not need the market sized for them, they
          need to know it is real and then see what they can buy. */}
      <section className="border-b border-line">
        <div className={SECTION}>
          <div data-reveal className="max-w-[620px]">
            <RuleEyebrow>Why this matters now</RuleEyebrow>
            <h2 className={`mt-4 ${H2}`}>
              Search is moving to answers, and answers name a shortlist.
            </h2>
          </div>
          <div className="mt-10 grid gap-7 md:grid-cols-2 md:gap-12">
            {HOME_STATS.slice(0, 2).map((stat, i) => (
              <div key={stat.source} data-reveal style={delay(i * 110)}>
                <StatTile stat={stat} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <SearchShiftChart />

      {/* ---- 3. SERVICES AND PRICING -------------------------------------
          Near the top, deliberately. A visitor evaluating a service wants to
          know what it costs before they read four feature sections, and
          burying it under the argument is what made this page feel like a
          paper rather than a product.

          PRICES COME FROM lib/offers.ts, WHICH READS lib/site.ts. Two of the
          three are still "[$X]" and nothing here papers over that with an
          invented number or a fake "from" price. */}
      <section id="pricing" className="scroll-mt-20 border-b border-line">
        <div className={SECTION}>
          <div data-reveal className="max-w-[620px]">
            <RuleEyebrow>{PLANS_COPY.eyebrow}</RuleEyebrow>
            <h2 className={`mt-4 ${H2}`}>{PLANS_COPY.heading}</h2>
            <p className="mt-5 text-[15.5px] leading-[1.7] text-ink-soft">
              {PLANS_COPY.body}
            </p>
          </div>

          <div className="mt-11 grid gap-5 md:grid-cols-3">
            {SERVICE_TIERS.map((tier, i) => (
              <div
                key={tier.name}
                data-reveal
                style={delay(i * 90)}
                /* The featured tier inverts rather than gaining a border
                   colour: this palette carries emphasis with fill, and a
                   third border weight would just be another hairline box. */
                className={`flex min-w-0 flex-col p-7 ${
                  tier.featured
                    ? "bg-ink text-white"
                    : "border border-line-dark bg-white"
                }`}
              >
                <p
                  className={`font-mono text-[11px] font-semibold uppercase tracking-[0.14em] ${
                    tier.featured ? "text-sky" : "text-ink-faint"
                  }`}
                >
                  {tier.name}
                </p>
                <p
                  className={`display mt-4 text-[34px] leading-none ${
                    tier.featured ? "text-white" : "text-ink"
                  }`}
                >
                  {tier.price}
                </p>
                {tier.priceNote && (
                  <p className="mt-2 text-[12.5px] text-ink-faint">
                    {tier.priceNote}
                  </p>
                )}
                <p
                  className={`mt-4 text-[14.5px] leading-[1.6] ${
                    tier.featured ? "text-white/75" : "text-ink-soft"
                  }`}
                >
                  {tier.description}
                </p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {tier.includes.map((item) => (
                    <li
                      key={item}
                      className={`grid grid-cols-[14px_minmax(0,1fr)] gap-x-2.5 text-[13.5px] leading-[1.5] ${
                        tier.featured ? "text-white/85" : "text-ink-soft"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-[7px] h-[5px] w-[5px] rounded-full ${
                          tier.featured ? "bg-sky" : "bg-ink"
                        }`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                {tier.note && (
                  <p
                    className={`mt-4 text-[12.5px] leading-[1.5] ${
                      tier.featured ? "text-white/60" : "text-ink-faint"
                    }`}
                  >
                    {tier.note}
                  </p>
                )}
                <Link
                  href={tier.cta.href}
                  className={`mt-7 justify-center px-6 py-[13px] text-[12.5px] ${
                    tier.featured ? "btn-pill-invert" : "btn-pill"
                  }`}
                >
                  {tier.cta.label}
                </Link>
              </div>
            ))}
          </div>

          <p data-reveal className="mt-6 text-[13.5px] text-ink-soft">
            <Link
              href="/pricing/"
              className="font-medium text-ink underline-offset-4 hover:text-accent hover:underline"
            >
              Compare the tiers in full
            </Link>
          </p>
        </div>
      </section>

      {/* ---- 4. WHAT SABLE DOES -----------------------------------------
          Four capabilities, each its own full-bleed section, ALTERNATING navy
          and paper. This is the pacing change: the page used to run one dark
          hero and then eight paper sections, which is why it scrolled like a
          document. Now the surface flips four times on the way down and the
          reader feels the progression instead of reading that there is one.

          The artifacts are all white cards, which is what makes the flip work
          in both directions: on paper they sit in the page, on navy they are
          the lit object in a dark room.

          Improve carries FoundationList, which restores the four technical
          foundations to the site: they were the largest block orphaned by the
          conversion pass, and "what we would fix" is where they belong. */}
      <div id="features" className="scroll-mt-20">
        {CAPABILITIES.map((cap, i) => {
          const dark = i % 2 === 1;
          return (
            <section
              key={cap.key}
              className={dark ? "bg-ink text-white" : "border-b border-line"}
            >
              <div className={SECTION}>
                {/* items-start + a sticky copy column. Improve's artifact is
                    the four-foundation list and runs ~1400px; centred against
                    it, the copy floated in the middle of an empty half. Now it
                    holds at the top and rides the artifact down, which also
                    gives the long section a reason to be long. */}
                <div className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
                  <div
                    data-reveal
                    className={`min-w-0 md:sticky md:top-28 ${
                      i % 2 === 1 ? "md:order-2" : ""
                    }`}
                  >
                    {/* The numeral is the spine. Oversized, serif, and set
                        against the eyebrow rather than above it, so each
                        section opens on a mark you can find at a glance while
                        scrolling. Four of them in sequence is the tactile
                        sense of progression the cards were not giving. */}
                    <div className="flex items-baseline gap-5">
                      <span
                        aria-hidden="true"
                        className={`display text-[clamp(52px,7vw,86px)] leading-[0.8] ${
                          dark ? "text-white/25" : "text-ink/15"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p
                        className={`font-mono text-[11px] font-semibold uppercase tracking-[0.18em] ${
                          dark ? "text-sky" : "text-accent"
                        }`}
                      >
                        {cap.eyebrow}
                      </p>
                    </div>

                    <h3
                      className={`display mt-6 text-[clamp(28px,3.4vw,42px)] leading-[1.1] text-pretty ${
                        dark ? "text-white" : "text-ink"
                      }`}
                    >
                      {cap.heading}
                    </h3>
                    <p
                      className={`mt-5 max-w-[440px] text-[15.5px] leading-[1.7] ${
                        dark ? "text-white/75" : "text-ink-soft"
                      }`}
                    >
                      {cap.body}
                    </p>
                  </div>

                  <div
                    data-reveal="scale"
                    style={delay(120)}
                    className="min-w-0"
                  >
                    {cap.key === "measure" && <FoldReadout />}
                    {cap.key === "diagnose" && <ShareOfVoice />}
                    {cap.key === "improve" && <FoundationList />}
                    {cap.key === "track" && (
                      <SamplingCard
                        title="mention rate by engine · sample"
                        meta="10 runs/engine"
                        rows={SAMPLE_ROWS}
                        footer={SAMPLE_LABEL}
                      />
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ---- 5. PROOF ----------------------------------------------------
          One sample result, with the repeated-run methodology folded into it
          rather than taught in a section of its own: both cards carry their
          run number, which is the methodology stated where it is load-bearing. */}
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

      {/* FAQ. One {question, answer}[] renders both the visible H2s and the
          FAQPage JSON-LD (lib/home.ts HOME_FAQS), so schema cannot drift from
          the text. The two figures beside it restate the protocol and the
          posture as numbers. */}
      <section id="faq" className="scroll-mt-20 border-t border-line">
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
              <FaqSection faqs={HOME_FAQS_TOP} compact />
            </div>
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
