import type { Metadata } from "next";
import Link from "next/link";
import Cta from "@/components/Cta";
import Eyebrow from "@/components/Eyebrow";
import PageSchema from "@/components/PageSchema";
import { MentionRateCard, SourcesCard, VerbatimCard } from "@/components/ReportPreview";
import { SECTION_X } from "@/lib/layout";
import { delay } from "@/lib/reveal";
import { crumb } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Sample AI Visibility Report",
  description:
    "What the report looks like: verbatim AI answers, the competitors named instead, mention-rate tables, cited sources, and the prioritized fix list.",
  path: "/sample-report/",
});

/**
 * Rebuilt 2026-09-14 from the Sable design (mockup/sable-site.dc.html): the
 * head, the report's contents down the left, and the report itself on the
 * right. The design drew a placeholder page preview there; the page shows the
 * three report artifacts it already had instead, and keeps the fix list below
 * (Josh: "new look, keep some of the content").
 *
 * "Nine pages" and "The whole report" are the design's words for the full
 * deliverable. They are flagged in website-plan §6 to confirm before launch.
 */

const CONTENTS = [
  {
    title: "Mention rate by engine",
    body: "How often you are named across ChatGPT, Google AI, Gemini and Perplexity, sampled ten runs per question.",
  },
  {
    title: "Share of voice",
    body: "Where you sit against the businesses named instead of you, ranked across the full query set.",
  },
  {
    title: "Sources behind the answers",
    body: "The third-party sites the engines cite for your category, and which of them mention you.",
  },
  {
    title: "Accuracy findings",
    body: "What the engines say about you that is wrong, outdated or attributed to someone else.",
  },
  {
    title: "Crawler and structure audit",
    body: "What blocks retrieval on your own site, from crawler access to missing structured data.",
  },
  {
    title: "Prioritized roadmap",
    body: "The fixes in the order that moves the needle fastest, with the effort each one takes.",
  },
] as const;

const FIX_LIST = [
  {
    fix: "Unblock AI crawlers at the firewall",
    why: "GPTBot and PerplexityBot were getting challenge pages, so the site is invisible to the engines we measure.",
  },
  {
    fix: "Get listed on the 4 missing directories AI cites",
    why: "The engines cited the same 6 sources across runs; the client appears on 2 of them.",
  },
  {
    fix: "Publish answer-first service pages for the 3 losing queries",
    why: "Competitors' pages were quoted verbatim in the answers. The client had no page on those questions.",
  },
] as const;

export default function SampleReport() {
  return (
    <>
      <PageSchema
        meta={metadata}
        path="/sample-report/"
        trail={[crumb("/sample-report/")]}
      />

      <section className={`${SECTION_X} pb-12 pt-14 md:pb-[60px] md:pt-[68px]`}>
        <div data-reveal>
          <Eyebrow>Sample report</Eyebrow>
          <h1 className="display mt-6 max-w-[17ch] text-[clamp(42px,5.4vw,74px)] leading-[1.03] text-ink text-pretty">
            {"The whole report, "}
            <span className="text-cobalt">before you pay for one</span>
          </h1>
          <p className="mt-[22px] max-w-[54ch] text-[16px] leading-[1.7] text-ink-soft">
            Nine pages, built from the same query set we would run for you.
            Numbers are from an illustrative business, not a real client.
          </p>
        </div>
      </section>

      <section
        className={`${SECTION_X} grid items-start gap-12 pb-16 md:pb-[100px] lg:grid-cols-2`}
      >
        <div data-reveal className="min-w-0">
          <ol className="flex flex-col gap-3.5">
            {CONTENTS.map((item, i) => (
              <li
                key={item.title}
                className="grid grid-cols-[34px_minmax(0,1fr)] items-start gap-3 border-t border-line-dark pt-3.5"
              >
                {/* Accent, not the design's cobalt: cobalt is 4.3:1 on the
                    ground, under AA at 12px. */}
                <span className="font-mono text-[12px] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-[17px] text-ink">{item.title}</p>
                  <p className="mt-1.5 text-[14.5px] leading-[1.6] text-ink-soft">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <Link
            href="/free-check/"
            className="btn btn-mono btn-cobalt mt-8 px-6 py-[15px] text-[12px]"
          >
            {"Run my free check "}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div data-reveal="scale" style={delay(120)} className="flex min-w-0 flex-col gap-5">
          <VerbatimCard />
          <MentionRateCard />
          <SourcesCard />
        </div>
      </section>

      <section className="border-t border-line-dark">
        <div className={`${SECTION_X} py-16 md:py-[100px]`}>
          <div data-reveal>
            <h2 className="display max-w-[20ch] text-[clamp(30px,3.4vw,44px)] leading-[1.08] text-ink text-pretty">
              The prioritized fix list
            </h2>
            <p className="mt-4 max-w-[56ch] text-[16px] leading-[1.7] text-ink-soft">
              The full audit closes with fixes ordered by what moves AI answers.
              Each one ties back to a finding in the data.
            </p>
          </div>
          <ol data-reveal style={delay(100)} className="mt-10 max-w-3xl">
            {FIX_LIST.map((item, i) => (
              <li
                key={item.fix}
                className="grid gap-1 border-t border-line-dark py-5 md:grid-cols-[48px_minmax(0,1fr)] md:gap-4"
              >
                <span className="font-mono text-[12px] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-[17px] font-semibold text-ink">{item.fix}</p>
                  <p className="mt-1.5 text-[14.5px] leading-[1.6] text-ink-soft">
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
        sub="The free AI visibility check takes one minute. Report in your inbox within 1–2 business days."
      />
    </>
  );
}
