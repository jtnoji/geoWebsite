import type { Metadata } from "next";
import Cta from "@/components/Cta";
import { MentionRateCard, SourcesCard, VerbatimCard } from "@/components/ReportPreview";

export const metadata: Metadata = {
  title: "Sample AI Visibility Report",
  description:
    "What the report looks like: verbatim AI answers, the competitors named instead, mention-rate tables, cited sources, and the prioritized fix list.",
};

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

function Annotation({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-l border-line-dark pl-4 text-sm italic leading-6 text-ink-soft">
      {children}
    </p>
  );
}

export default function SampleReport() {
  return (
    <>
      <div className="mx-auto max-w-[1120px] px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-[560px] text-center">
          <h1 className="text-4xl font-bold tracking-tight text-ink">
            This is what you actually get.
          </h1>
          <p className="mt-5 text-base leading-7 text-ink-soft">
            Below is a teaser for a fictional B2B marketing agency, in the exact
            format a client gets, with notes on how to read each section. The
            numbers are modeled on real audit runs. We&rsquo;ll publish a real
            anonymized client report here as soon as one is cleared.
          </p>
        </div>

        <div className="mt-12 space-y-12">
          <section className="grid items-start gap-6 md:grid-cols-[2fr_1fr]">
            <VerbatimCard />
            <Annotation>
              Every report opens with verbatim AI answers. The bold names are
              who got mentioned. The client&rsquo;s absence is the finding.
            </Annotation>
          </section>

          <section className="grid items-start gap-6 md:grid-cols-[2fr_1fr]">
            <MentionRateCard />
            <Annotation>
              Rates, not ranks. Each question runs ten times per engine, because
              a single fetch is a coin flip. &ldquo;2 of 10 runs on ChatGPT, 0
              of 10 on Google AI&rdquo; is something you can re-run next month
              and compare.
            </Annotation>
          </section>

          <section className="grid items-start gap-6 md:grid-cols-[2fr_1fr]">
            <SourcesCard />
            <Annotation>
              The cited-sources checklist: which websites the engines leaned on,
              and whether you exist on them.
            </Annotation>
          </section>

          {/* The block is capped at 3xl for line length, so it needs mx-auto
              or it hugs the container's left edge and leaves a ~320px gutter
              on the right at 1440 (the sections above are full-width grids).
              Centring the BLOCK only; the text inside stays left-aligned per
              the alignment rule in CLAUDE.md. */}
          <section className="mx-auto w-full max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              The prioritized fix list
            </h2>
            <p className="mt-3 max-w-[560px] text-base leading-7 text-ink-soft">
              The full audit closes with fixes ordered by what moves AI answers.
              Each one ties back to a finding in the data.
            </p>
            <ol className="mt-7">
              {FIX_LIST.map((item, i) => (
                <li
                  key={item.fix}
                  className="grid gap-1 border-t border-line py-5 md:grid-cols-[48px_1fr] md:gap-4"
                >
                  <span className="text-[13px] tabular-nums text-ink-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{item.fix}</p>
                    <p className="mt-1.5 text-sm leading-6 text-ink-soft">{item.why}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      <Cta
        centered
        heading="Want yours?"
        sub="The free AI visibility check takes one minute. Report in your inbox within 1–2 business days."
      />
    </>
  );
}
