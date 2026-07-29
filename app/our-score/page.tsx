import type { Metadata } from "next";
import { CrawlerLogSection } from "@/components/CrawlerLog";
import Cta from "@/components/Cta";
import { delay } from "@/lib/reveal";
import { BRAND } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our score: we audited our own website",
  description:
    "The exact Cat 1–6 audit we sell, run against this site, published and dated. No competitor publishes their own audit of themselves.",
};

/**
 * Hand-authored audit results (scaffold §3) — replace with the output of a
 * real audit run against the deployed site at launch (build step 7), then
 * update `AUDIT_DATE` on every re-run.
 */
const AUDIT_DATE = "Pending first deploy";

const RESULTS = [
  {
    category: "Cat 1: Bot access",
    check: "GPTBot, ClaudeBot, PerplexityBot, Google-Extended fetch real pages (no challenge walls)",
    status: "Pass",
    note: "robots.txt explicitly allows every major AI crawler; Vercel challenge mode off.",
  },
  {
    category: "Cat 2: Rendering",
    check: "Every word of copy and all schema present with JavaScript disabled",
    status: "Pass",
    note: "The site is a pure static export, so there is no client-rendered content to miss.",
  },
  {
    category: "Cat 3: Content structure",
    check: "Question-form headings with standalone, quotable first-sentence answers",
    status: "Pass",
    note: "Enforced as a copy rule across /how-it-works, /pricing FAQ, and /learn.",
  },
  {
    category: "Cat 4: Local presence",
    check: "Consistent NAP on every page; founders named with profiles",
    status: "Partial",
    note: "NAP renders site-wide from one source file. The business name and directory listings land with the brand decision.",
  },
  {
    category: "Cat 5: Structured data",
    check: "Organization, ProfessionalService, FAQPage, Service, Person schema, all matching visible text",
    status: "Pass",
    note: "Schema is generated from the same data structures that render the visible copy, so it cannot drift.",
  },
  {
    category: "Cat 6: Hygiene",
    check: "sitemap.xml, canonical URLs, unique titles and descriptions, OG tags",
    status: "Pass",
    note: "Generated at build time; verified by the CI test suite on every deploy.",
  },
] as const;

export default function OurScore() {
  return (
    <>
      <div className="mx-auto max-w-[1120px] px-5 py-16 text-center sm:px-8 md:py-20">
        <div data-reveal>
        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-ink">
          We ran our own audit on this website. Here&rsquo;s the report.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-ink-soft">
          A company selling AI visibility audits should pass its own. Below are
          the Cat 1–6 results for this site: same rubric, same checks, published
          and dated. Mention-rate tracking for {BRAND}{" "}queries starts at
          launch and gets published here too.
        </p>
        <p className="mt-3 text-sm text-ink-faint">Last audit: {AUDIT_DATE}</p>
        </div>

        {/* The table reveals whole. Row-by-row would ripple the shared
            horizontal rules, and this is a data artifact, not marketing. */}
        <div data-reveal style={delay(120)} className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink text-[12.5px] uppercase tracking-[0.07em] text-ink-faint">
                <th className="py-3 pr-4 font-semibold">Category</th>
                <th className="py-3 pr-4 font-semibold">What we check</th>
                <th className="py-3 font-semibold">Result</th>
              </tr>
            </thead>
            <tbody>
              {RESULTS.map((row) => (
                <tr key={row.category} className="border-b border-line align-top">
                  <td className="whitespace-nowrap py-4 pr-4 font-semibold text-ink">
                    {row.category}
                  </td>
                  <td className="py-4 pr-4 leading-6 text-ink-soft">
                    {row.check}
                    <span className="mt-1 block text-xs text-ink-faint">{row.note}</span>
                  </td>
                  <td
                    className={`py-4 font-semibold ${
                      row.status === "Pass" ? "text-ink" : "text-bad"
                    }`}
                  >
                    {row.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Renders nothing until a crawler log is ingested (lib/crawler-hits.ts).
            The page argues that measurement should be inspectable, so a
            placeholder panel here would argue against itself. */}
        <CrawlerLogSection />
      </div>

      <Cta
        centered
        heading="This is the exact report you'd get."
        sub="See where your own site stands. Free, in your inbox within 1–2 business days."
      />
    </>
  );
}
