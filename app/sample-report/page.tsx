import type { Metadata } from "next";
import Link from "next/link";
import Cta from "@/components/Cta";
import Eyebrow from "@/components/Eyebrow";
import PageSchema from "@/components/PageSchema";
import { SourcesCard } from "@/components/ReportPreview";
import {
  CitationsCard,
  CycleTopLine,
  ExcerptsCard,
  FactSheetCard,
  JourneyCard,
  LedgerCard,
  MatrixCard,
  MethodCard,
  ShareCard,
  VisibilityCard,
} from "@/components/ReportSections";
import { HEAD_SPLIT, SECTION, SECTION_X } from "@/lib/layout";
import { delay } from "@/lib/reveal";
import { SAMPLE_CLIENT, SAMPLE_CYCLE, SAMPLE_FIXES } from "@/lib/sample";
import { crumb } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Sample AI Visibility Report",
  description:
    "Walk the whole report: mention rate by engine, share of model, the buying-journey split, cited sources, fact-sheet contradictions and verbatim answers.",
  path: "/sample-report/",
});

/**
 * THE REPORT, SECTION BY SECTION (Josh, 2026-09-16: "show the reader the
 * page"). The page used to list what the report contains and show three
 * artifacts. It now walks every section in the order the report prints it,
 * with that section's own artifact rendered beside the explanation, so a
 * reader can see what they get rather than read a description of it.
 *
 * The figures are the illustrative cycle in lib/sample.ts: 100 questions on
 * five engines at five runs, 2,500 answers, one business that is named when a
 * buyer already knows it and almost never when the buyer describes a problem.
 * Every card carries the illustrative label; nothing here is a real client.
 *
 * Sections 01 to 07 and the two appendices are the measurement report. 08 and
 * the fix list are what the audit adds on top, which is why they sit between
 * the report's own sections and the close.
 */

const SECTIONS = [
  {
    page: "01",
    title: "How often you come up",
    body: "The headline rate, and the same rate split by engine. It counts answers, not people, searches or traffic.",
    aside:
      "A rise means the engines named you more often than last cycle. It does not claim that caused visits or sales.",
    artifact: <VisibilityCard />,
  },
  {
    page: "02",
    title: "Your share of the conversation",
    body: "Of every brand mention in your category, how many were you. Visibility is about presence; share is about crowding.",
    aside:
      "The two can move in opposite directions: an engine that starts naming six businesses instead of three leaves your presence intact and your share smaller.",
    artifact: <ShareCard />,
  },
  {
    page: "03",
    title: "Where in the buying journey you appear",
    body: "The same answers, tagged by what the buyer was doing. This is usually the section that changes what a business does next.",
    aside:
      "A single blended number hides this: a business can look moderately present everywhere when it is really near-universal at one end of the journey and absent at the other.",
    artifact: <JourneyCard />,
  },
  {
    page: "04",
    title: "Which engines name which brands",
    body: "Every tracked brand against every engine, on identical questions. A gap between engines is a sourcing difference, not a difference of opinion.",
    aside:
      "Competitors are measured by the same method in the same cycle, so the columns are directly comparable. Naming a brand is not an endorsement by the engine or by us.",
    artifact: <MatrixCard />,
  },
  {
    page: "05",
    title: "Where the engines got their information",
    body: "The domains cited across the cycle, and how much of it was your own site. For most businesses the answer is: almost none of it.",
    aside:
      "This reports which sources were cited and how often. It does not rank them by quality, and being cited is not a judgement of accuracy.",
    artifact: <CitationsCard />,
  },
  {
    page: "06",
    title: "Statements that contradict the fact sheet",
    body: "You sign a fact sheet before the cycle runs. Every answer is read against it, and a finding is a checkable fact stated differently.",
    aside:
      "Severity describes consequence to a buyer, not how often the statement occurred. The five marks show which engines carried it.",
    artifact: <FactSheetCard />,
  },
  {
    page: "07",
    title: "What the engines actually said",
    body: "Verbatim excerpts, chosen by a fixed rule rather than by hand, so the examples are comparable from cycle to cycle. Every answer is in the export.",
    aside:
      "The rule is printed in the appendix: earliest mention, latest mention, first answer naming nobody. Nothing here was picked to flatter or alarm.",
    artifact: <ExcerptsCard />,
  },
  {
    page: "08",
    title: "What blocks retrieval on your own site",
    body: "The audit adds the part you control: whether the engines can reach your pages, read them without JavaScript, and find you on the sources they cite.",
    aside:
      "A crawler blocked at the firewall caps every number above it, which is why this is checked first and fixed first.",
    artifact: <SourcesCard />,
  },
  {
    page: "09",
    title: "The citation ledger",
    body: "Every domain the engines cited, ranked, with the answer each citation came from in the export. So a claim about sources can be checked rather than trusted.",
    aside: null,
    artifact: <LedgerCard />,
  },
  {
    page: "10",
    title: "How this was measured",
    body: "The window, the geography, the question set, and what each term means. The appendix exists so the rest of the report can be argued with.",
    aside:
      "These systems are non-deterministic, so the same question can return a different answer tomorrow. That is why every question runs five times and every figure counts answers actually read.",
    artifact: <MethodCard />,
  },
];

export default function SampleReport() {
  return (
    <>
      <PageSchema
        meta={metadata}
        path="/sample-report/"
        trail={[crumb("/sample-report/")]}
      />

      <section
        className={`${SECTION_X} ${HEAD_SPLIT} pb-12 pt-14 md:pb-[60px] md:pt-[68px]`}
      >
        <div data-reveal className="min-w-0">
          <Eyebrow>Sample report</Eyebrow>
          <h1 className="display mt-6 max-w-[17ch] text-[clamp(42px,5.4vw,116px)] leading-[1.03] text-ink text-pretty">
            {"The whole report, "}
            <span className="text-cobalt">before you pay for one</span>
          </h1>
        </div>
        <p
          data-reveal
          style={delay(100)}
          className="max-w-[54ch] text-[clamp(16px,1.111vw,20px)] leading-[1.7] text-ink-soft"
        >
          {`Every section, built from the same query set we would run for you. The
          figures below are one illustrative cycle for ${SAMPLE_CLIENT}, not a real
          client.`}
        </p>
      </section>

      {/* The cycle in four numbers, before any section: a reader should know
          the size of the thing before reading a rate out of it. */}
      <section className="border-y border-line-dark bg-white">
        <div data-reveal className={`${SECTION_X} py-12 md:py-16`}>
          <CycleTopLine />
        </div>
      </section>

      {/* One block per section of the report: the page number and what the
          section answers on the left, that section's artifact on the right. */}
      {SECTIONS.map((section, i) => (
        <section
          key={section.page}
          className={i % 2 === 1 ? "bg-white" : undefined}
        >
          <div
            className={`${SECTION_X} grid items-start gap-8 py-12 md:py-[68px] lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:gap-16 wide:gap-24`}
          >
            <div data-reveal className="min-w-0 lg:sticky lg:top-[104px]">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                {`Page ${section.page}`}
              </p>
              <h2 className="display mt-4 max-w-[18ch] text-[clamp(26px,2.6vw,50px)] leading-[1.1] text-ink text-pretty">
                {section.title}
              </h2>
              <p className="mt-4 max-w-[46ch] text-[clamp(15.5px,1.076vw,19px)] leading-[1.65] text-ink-soft">
                {section.body}
              </p>
              {section.aside && (
                <p className="mt-4 max-w-[46ch] border-l-2 border-line-dark pl-4 text-[clamp(14px,0.972vw,17px)] leading-[1.6] text-ink-faint">
                  {section.aside}
                </p>
              )}
            </div>
            <div data-reveal="scale" style={delay(100)} className="min-w-0">
              {section.artifact}
            </div>
          </div>
        </section>
      ))}

      <section className="border-t border-line-dark">
        {/* Stacked below 1600px; from there the head sits beside the list so
            the section spans the page. */}
        <div
          className={`${SECTION} grid gap-10 wide:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] wide:gap-24`}
        >
          <div data-reveal className="min-w-0">
            <h2 className="display max-w-[20ch] text-[clamp(30px,3.4vw,72px)] leading-[1.08] text-ink text-pretty">
              The prioritized fix list
            </h2>
            <p className="mt-4 max-w-[56ch] text-[clamp(16px,1.111vw,20px)] leading-[1.7] text-ink-soft">
              The full audit closes with fixes ordered by what moves AI answers.
              Each one ties back to a finding in the data.
            </p>
            <Link
              href="/free-check/"
              className="btn btn-mono btn-cobalt mt-8 px-6 py-[15px] text-[12px]"
            >
              {"Run my free check "}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ol
            data-reveal="stagger"
            style={delay(100)}
            className="min-w-0 max-w-3xl wide:max-w-none"
          >
            {SAMPLE_FIXES.map((item, i) => (
              <li
                key={item.fix}
                className="grid gap-1 border-t border-line-dark py-5 md:grid-cols-[48px_minmax(0,1fr)] md:gap-4"
              >
                <span className="font-mono text-[12px] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-[clamp(17px,1.181vw,21px)] font-semibold text-ink">
                    {item.fix}
                  </p>
                  <p className="mt-1.5 max-w-[64ch] text-[clamp(14.5px,1.007vw,18px)] leading-[1.6] text-ink-soft">
                    {item.why}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Cta
        heading="Want yours?"
        sub={`The free AI visibility check takes one minute. It runs a short question set on the same ${SAMPLE_CYCLE.engines} engines, and the report lands within 1–2 business days.`}
      />
    </>
  );
}
