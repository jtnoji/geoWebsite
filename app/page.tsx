import type { Metadata } from "next";
import Link from "next/link";
import Beams from "@/components/Beams";
import CapabilityRow from "@/components/CapabilityRow";
import ClosingCta from "@/components/ClosingCta";
import CompareTable from "@/components/CompareTable";
import Eyebrow from "@/components/Eyebrow";
import LiveAnswer from "@/components/LiveAnswer";
import PageSchema from "@/components/PageSchema";
import SearchShiftChart from "@/components/SearchShiftChart";
import StatTile from "@/components/StatTile";
import {
  CAPABILITIES,
  COMPARISON,
  HERO,
  PROBLEM,
  SERVICES,
  SOLUTION,
  STEPS,
} from "@/lib/home";
import { SECTION, SECTION_X } from "@/lib/layout";
import { delay } from "@/lib/reveal";
import { HOME_STATS } from "@/lib/stats";
import { BRAND, OFFER, OFFER_SHORT } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: `${BRAND}: does AI recommend your business?`,
  description:
    "ChatGPT, Google AI, Gemini, and Perplexity name only a few businesses per answer. We measure whether you're one of them, and who gets named instead.",
  path: "/",
  absoluteTitle: true,
});

/* One text node, not two: `Run my {x}` would ship as `Run my <!-- -->free AI
   visibility check` and split the label in the raw bytes a crawler reads. */
const PRIMARY = `Run my ${OFFER} `;

/* The in-flow primary button, at the design's size and a step larger on the
   wide screens where everything around it has grown. */
const PRIMARY_SIZE =
  "px-7 py-4 text-[16.5px] sm:px-[30px] sm:py-[17px] wide:px-9 wide:py-5 wide:text-[19px]";

/**
 * The home page, rebuilt 2026-09-14 from the Sable design
 * (mockup/sable-site.dc.html), section for section: the fold, the problem with
 * the shift chart, three capabilities, how it works, what you get, the
 * comparison, and the closing band. Copy lives in lib/home.ts.
 *
 * Every section runs the full width of the page (lib/layout.ts). Type sizes
 * are clamps that equal the design at 1440 and keep growing past it, so a
 * large screen gets the same composition larger rather than a 1440 box with
 * margins either side.
 */
export default function Home() {
  return (
    <>
      {/* No breadcrumb: the home page is the root of every trail. */}
      <PageSchema meta={metadata} path="/" />

      {/* ---- THE FOLD ------------------------------------------------------
          data-hero="dark" dresses the header light-on-dark for this page and
          lets the fold run up behind it (globals.css, "Header").

          THE COMPOSITION (Josh, 2026-09-14, after the Cerebrium homepage).
          From lg up the headline anchors the bottom-left corner in three
          lines, the lede and the actions sit bottom-right on its last
          baseline, and the live customer questions float in the open space
          above them. In a window too short to hold both (under 784px) the
          questions drop just below the copy instead, so the headline is never
          what gets cut off at the fold. That is grid placement only: the
          markup still runs headline, copy, panel, so a phone and a crawler
          read the order they always have.

          The GET form stays a plain form, not an island: the fold's primary
          action must never wait on hydration, and `form-action 'self'` in the
          CSP already allows it. /free-check reads `site` and prefills the
          website field. #site and the button's name are pinned by
          funnel.spec.ts. */}
      <section data-hero="dark" className="relative overflow-hidden bg-night text-white">
        <Beams variant="hero" />
        <div
          className={`relative ${SECTION_X} grid min-h-[100svh] content-end pb-[var(--fold-bottom)] pt-28 [--fold-bottom:44px] lg:grid-cols-[minmax(0,1fr)_clamp(440px,37vw,660px)] lg:gap-x-[clamp(48px,5vw,112px)] lg:pt-24 lg:[--fold-bottom:clamp(72px,5.5vw,128px)] lg:tall:grid-rows-[1fr_auto] lg:tall:gap-y-10 lg:short:grid-rows-[minmax(auto,calc(100svh_-_96px_-_var(--fold-bottom)))_auto] lg:short:gap-y-[calc(var(--fold-bottom)_+_24px)]`}
        >
          {/* `hero-copy` lifts away and dims as the fold scrolls off
              (globals.css, "Scroll depth"). It goes on the headline and on the
              copy, never on the panel column, whose glass would go flat.

              The headline is sized from its own column (`@container`). At
              9.6cqi its widest line, "Are you in the answer?" (9.64em in
              Franklin 300), spans 93% of the column, so it holds the corner at
              any width and never wraps to a fourth line. The 11em cap keeps the
              same three lines where the size ceiling leaves the column wider,
              and in a browser without text-wrap: balance.

              KEPT OFF THE CORNER (Josh: "too close to the bottom left corner").
              From lg the column is inset from the gutter, and `--fold-bottom`,
              the fold's bottom padding, grows with the width. The copy sits on
              the headline's baseline, so it rises with it. In a short window
              the panel's gap is that padding plus 24px, so the panel starts
              just below the fold instead of peeking into it.

              On a tall screen the panel stacks above the copy, so the headline
              also yields to the height: (100svh - 540px - --fold-bottom) / 3.1
              is the largest three-line headline that leaves room for the panel
              (540px is the top padding, the gap and the panel column, which
              grew to ~400px when the live answer took the shape of a real
              reply), which keeps it clear of the fold on wide, shallow
              windows. */}
          <div className="hero-copy @container min-w-0 lg:col-start-1 lg:self-baseline-last lg:pl-[clamp(24px,2vw,56px)] lg:tall:row-start-2 lg:short:row-start-1">
            <h1
              data-reveal
              className="display display-light max-w-[11em] text-[clamp(30px,9.6cqi,68px)] leading-[1.03] text-white text-balance lg:short:text-[clamp(40px,9.6cqi,136px)] lg:tall:text-[clamp(40px,min(9.6cqi,calc((100svh_-_480px_-_var(--fold-bottom))/3.1)),136px)]"
            >
              {`${HERO.heading} `}
              <span className="block text-sky">{HERO.headingAccent}</span>
            </h1>
          </div>

          <div className="hero-copy mt-5 min-w-0 lg:col-start-2 lg:mt-0 lg:self-baseline-last lg:tall:row-start-2 lg:short:row-start-1">
            <p
              data-reveal
              style={delay(80)}
              className="max-w-[48ch] text-[clamp(16.5px,1.146vw,20.5px)] leading-[1.65] text-white/86 text-pretty"
            >
              {HERO.lede}
            </p>
            <div
              data-reveal
              style={delay(160)}
              className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-4 wide:mt-9"
            >
              <Link
                href="/free-check/"
                className="btn btn-sky px-7 py-4 text-[17px] sm:px-[34px] sm:py-[19px] sm:text-[18px] wide:px-10 wide:py-[22px] wide:text-[20px]"
              >
                {PRIMARY}
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/how-it-works/"
                className="border-b border-white/30 pb-0.5 text-[clamp(15.5px,1.076vw,19px)] text-white/85 transition-colors hover:text-white"
              >
                {`${HERO.secondary} `}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <p
              data-reveal
              style={delay(220)}
              className="mt-3.5 text-[clamp(13.5px,0.9375vw,16px)] text-white/70"
            >
              {HERO.fineprint}
            </p>
          </div>

          {/* No reveal on this column itself: opacity or a filter on an
              ancestor of the glass card flattens its backdrop blur, so the
              card, the form and the links each carry their own. From lg, in a
              tall enough window, it takes the upper row of the right column
              and centres in the height the fold has to spare above the copy;
              in a shorter one it drops below the copy (the `tall:` / `short:`
              variants in globals.css). */}
          <div className="mt-12 w-full min-w-0 max-w-[430px] lg:col-start-2 lg:mt-0 lg:max-w-none lg:tall:row-start-1 lg:tall:self-center lg:short:row-start-2 lg:short:self-start">
            {/* The live customer questions, kept from the previous home page
                in place of the design's before/after card (Josh, 2026-09-14). */}
            <LiveAnswer />
            <form
              action="/free-check/"
              method="get"
              data-reveal
              style={delay(380)}
              className="mt-[18px] flex flex-wrap gap-2.5"
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
                className="min-w-[170px] flex-1 rounded-[10px] border border-white/22 bg-white/[0.08] px-4 py-[13px] font-mono text-[15px] text-white placeholder:text-white/55 focus:border-sky focus:outline-none"
              />
              {/* `grow` so that when a phone wraps the button under the field it
                  takes the full width rather than sitting short on the left. */}
              <button
                type="submit"
                className="btn btn-mono btn-sky grow px-[22px] py-[13px] text-[12px] sm:grow-0"
              >
                {`${OFFER_SHORT} `}
                <span aria-hidden="true">→</span>
              </button>
            </form>
            <p
              data-reveal
              style={delay(440)}
              className="mt-3.5 flex flex-wrap gap-x-2 gap-y-1 text-[clamp(14px,0.972vw,16.5px)] text-white/80"
            >
              <Link href="/our-score/" className="transition-colors hover:text-white">
                {HERO.proof}
              </Link>
              {/* Hidden on phones, where the two links wrap onto two lines and
                  the dot would dangle at the end of the first. */}
              <span aria-hidden="true" className="hidden sm:inline">
                ·
              </span>
              <Link href="/sample-report/" className="transition-colors hover:text-white">
                {HERO.sample}
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ---- THE PROBLEM ---------------------------------------------------
          The shift chart is the evidence for the heading beside it, and the
          two cited stats sit under both. */}
      <section className="bg-paper-dim">
        <div
          className={`${SECTION_X} grid items-start gap-12 pb-10 pt-16 md:pt-[100px] lg:grid-cols-[minmax(260px,0.72fr)_minmax(0,2fr)] lg:gap-[52px] wide:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] wide:gap-24`}
        >
          <div data-reveal className="min-w-0">
            <Eyebrow>{PROBLEM.eyebrow}</Eyebrow>
            <h2 className="display mt-[18px] max-w-[16ch] text-[clamp(28px,2.4vw,52px)] leading-[1.12] text-ink text-pretty">
              {PROBLEM.heading}
            </h2>
            <p className="mt-4 max-w-[40ch] text-[clamp(14.5px,1.007vw,18px)] leading-[1.65] text-ink-soft">
              {PROBLEM.body}
            </p>
            <ul data-reveal="stagger" className="mt-6 flex flex-col gap-[13px]">
              {PROBLEM.points.map((point) => (
                <li key={point.title} className="border-t border-line-dark pt-[13px]">
                  <h3 className="text-[clamp(14.5px,1.007vw,18px)] font-semibold text-ink">
                    {point.title}
                  </h3>
                  <p className="mt-1 text-[clamp(13.5px,0.9375vw,17px)] leading-[1.6] text-ink-soft">
                    {point.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <SearchShiftChart />
        </div>
        <div
          className={`${SECTION_X} grid gap-4 pb-16 pt-6 md:grid-cols-2 md:pb-[100px] wide:gap-6`}
        >
          {HOME_STATS.slice(0, 2).map((stat, i) => (
            <div key={stat.source} data-reveal style={delay(i * 110)} className="min-w-0">
              <StatTile stat={stat} />
            </div>
          ))}
        </div>
      </section>

      {/* ---- THE SOLUTION --------------------------------------------------
          The head centres over the capability rows and the closing action
          centres under them, so the zig-zag between reads as one set. From md
          up only: a phone stacks everything, and a centred paragraph there is
          just harder to read. Heads vary down the page on purpose (CLAUDE.md,
          "Section variation"). */}
      <section className="bg-white">
        <div className={`${SECTION_X} pb-4 pt-16 md:pb-10 md:pt-[100px] md:text-center`}>
          <div data-reveal>
            <Eyebrow>{SOLUTION.eyebrow}</Eyebrow>
            <h2 className="display mt-6 max-w-[16ch] text-[clamp(34px,4.2vw,90px)] leading-[1.05] text-ink text-pretty md:mx-auto md:text-balance">
              {`${SOLUTION.heading} `}
              <span className="text-cobalt">{SOLUTION.headingAccent}</span>
            </h2>
          </div>
          <p
            data-reveal
            style={delay(100)}
            className="mt-5 max-w-[52ch] text-[clamp(16.5px,1.146vw,20.5px)] leading-[1.7] text-ink-soft md:mx-auto wide:mt-7"
          >
            {SOLUTION.body}
          </p>
        </div>
        {CAPABILITIES.map((capability, i) => (
          <CapabilityRow key={capability.no} capability={capability} flip={i % 2 === 1} />
        ))}
        <div
          data-reveal
          className={`${SECTION_X} pb-16 pt-6 md:flex md:justify-center md:pb-[100px]`}
        >
          <Link href="/free-check/" className={`btn btn-navy ${PRIMARY_SIZE}`}>
            {PRIMARY}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* ---- HOW IT WORKS --------------------------------------------------
          The three steps sit in glass cards on the beams. The bright core
          crosses the third one, and the frosted card keeps its copy legible
          without the text-shadow halo the bare columns needed. The stagger
          reveal lands on the cards themselves, never on an ancestor, or the
          glass goes flat (CLAUDE.md, "Motion"). Stacked until lg, where three
          padded cards side by side still leave the copy a workable measure. */}
      <section className="relative flex items-center overflow-hidden bg-night text-white lg:min-h-screen">
        <Beams variant="band" />
        <div className={`relative ${SECTION}`}>
          <div data-reveal>
            <Eyebrow onDark>{STEPS.eyebrow}</Eyebrow>
            <h2 className="display mt-6 max-w-[17ch] text-[clamp(34px,4.2vw,90px)] leading-[1.05] text-white text-pretty">
              {STEPS.heading}
            </h2>
          </div>
          <ol
            data-reveal="stagger"
            className="mt-12 grid gap-4 md:mt-14 lg:grid-cols-3 lg:gap-5 wide:gap-8"
          >
            {STEPS.steps.map((step) => (
              <li
                key={step.no}
                className="rounded-2xl border border-white/14 bg-night/55 p-6 shadow-glass backdrop-blur-[14px] sm:p-7 wide:p-9"
              >
                <h3 className="font-mono text-[clamp(11px,0.764vw,13px)] font-normal uppercase tracking-[0.16em] text-sky">
                  {`${step.no} · ${step.name}`}
                </h3>
                <p className="mt-3.5 text-[clamp(16.5px,1.146vw,20.5px)] leading-[1.7] text-white/88">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
          {/* The reveal sits on a wrapper, not on the button: the reveal's
              transition list would replace the button's hover transition. */}
          <div data-reveal className="mt-11">
            <Link href="/free-check/" className={`btn btn-sky ${PRIMARY_SIZE}`}>
              {PRIMARY}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---- WHAT YOU GET --------------------------------------------------
          Mirrored from lg: the list on the left, the head on the right. It
          follows the steps band, whose head sits left, and the flip is what
          tells two dark sections in a row apart. The head stays first in the
          markup, so phones and crawlers still read it before the list. */}
      <section className="bg-night text-white">
        <div
          className={`${SECTION} grid items-start gap-12 lg:grid-cols-2 lg:gap-14 wide:gap-24`}
        >
          <div data-reveal className="lg:col-start-2 lg:row-start-1">
            <Eyebrow onDark>{SERVICES.eyebrow}</Eyebrow>
            <h2 className="display mt-6 max-w-[14ch] text-[clamp(32px,3.8vw,80px)] leading-[1.06] text-white">
              {SERVICES.heading}
            </h2>
            <p className="mt-5 max-w-[42ch] text-[clamp(16px,1.111vw,20px)] leading-[1.7] text-white/84">
              {SERVICES.body}
            </p>
            <Link
              href="/pricing/"
              className="btn btn-ghost mt-7 px-6 py-3.5 text-[15px] wide:px-8 wide:py-4 wide:text-[17px]"
            >
              See pricing
            </Link>
          </div>
          <ul
            data-reveal="stagger"
            style={delay(120)}
            className="grid gap-x-8 sm:grid-cols-2 lg:col-start-1 lg:row-start-1 wide:gap-x-12"
          >
            {SERVICES.items.map((item) => (
              <li
                key={item}
                className="border-t border-white/18 py-[15px] text-[clamp(16px,1.111vw,20px)] text-white wide:py-5"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- WHY SABLE -----------------------------------------------------
          The head centres over the comparison, and the table sits in a white
          card on the ground with our column tinted (CompareTable), so the one
          table on the page reads as an object rather than more running text.
          The card runs full width like every section; the head centres from
          md up and stays left on phones. */}
      <section className="bg-paper-dim">
        <div className={SECTION}>
          <div data-reveal className="md:text-center">
            <Eyebrow>{COMPARISON.eyebrow}</Eyebrow>
            <h2 className="display mt-6 max-w-[18ch] text-[clamp(32px,3.8vw,80px)] leading-[1.06] text-ink text-pretty md:mx-auto md:text-balance">
              {COMPARISON.heading}
            </h2>
          </div>
          <div
            data-reveal
            style={delay(120)}
            className="mt-10 min-w-0 rounded-2xl bg-white px-3 shadow-card sm:px-8 md:mt-14 wide:px-12"
          >
            <CompareTable />
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  );
}
