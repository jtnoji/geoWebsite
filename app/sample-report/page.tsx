import type { Metadata } from "next";
import Cta from "@/components/Cta";
import { MentionRateCard, SourcesCard, VerbatimCard } from "@/components/ReportPreview";

export const metadata: Metadata = {
  title: "Sample AI Visibility Report",
  description:
    "An anonymized real report: verbatim AI answers, the competitors named instead, mention-rate tables, cited sources, and the prioritized fix list.",
};

const FIX_LIST = [
  {
    fix: "Unblock AI crawlers at the firewall",
    why: "GPTBot and PerplexityBot were receiving challenge pages — the site is invisible to the engines being measured.",
  },
  {
    fix: "Get listed on the 4 missing directories AI actually cites",
    why: "The engines cited the same 6 sources across runs; the client appears on 2 of them.",
  },
  {
    fix: "Publish answer-first service pages for the 3 losing queries",
    why: "Competitors' pages were quoted verbatim in answers; the client had no page addressing those questions.",
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
        <div className="max-w-[560px]">
          <h1 className="text-4xl font-bold tracking-tight text-ink">
            This is what you actually get.
          </h1>
          <p className="mt-5 text-base leading-7 text-ink-soft">
            Below is an anonymized real teaser — a Berkeley plumbing company,
            May 2026 — shown exactly as the client received it, with margin
            notes on how to read each section.
          </p>
        </div>

        <div className="mt-12 space-y-12">
          <section className="grid items-start gap-6 md:grid-cols-[2fr_1fr]">
            <VerbatimCard />
            <Annotation>
              Every report opens with verbatim AI answers. The bold names mark
              who WAS named — the client&rsquo;s absence is the finding.
            </Annotation>
          </section>

          <section className="grid items-start gap-6 md:grid-cols-[2fr_1fr]">
            <MentionRateCard />
            <Annotation>
              Rates, not ranks: each question runs multiple times per engine,
              because a single fetch is a coin flip. &ldquo;Mentioned in 2 of 10
              runs on ChatGPT, 0 of 10 on Google AI&rdquo; is a measurement you
              can re-run next month and compare.
            </Annotation>
          </section>

          <section className="grid items-start gap-6 md:grid-cols-[2fr_1fr]">
            <SourcesCard />
            <Annotation>
              The cited-sources checklist: which websites the engines leaned on
              when deciding, and whether you exist on them — what&rsquo;s
              blocked, what&rsquo;s thin, what&rsquo;s fine.
            </Annotation>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              The prioritized fix list
            </h2>
            <p className="mt-3 max-w-[560px] text-base leading-7 text-ink-soft">
              The full audit closes with fixes ordered by what actually moves AI
              answers — each tied to a finding in the data, never generic advice.
            </p>
            <ol className="mt-7 max-w-3xl">
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

      <Cta heading="Want yours?" sub="Free visibility check — takes one minute, report in your inbox within 1–2 business days." />
    </>
  );
}
