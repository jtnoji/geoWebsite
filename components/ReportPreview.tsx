import ArtifactCard from "./ArtifactCard";
import { SAMPLE_SOURCES } from "@/lib/sample";

/**
 * The retrieval checklist on /sample-report: the part of the report that is
 * about the reader's own site rather than about the engines.
 *
 * It used to sit beside a verbatim card and a mention-rate card. Those went
 * when the page became a walkthrough of the whole report (2026-09-16): the
 * excerpts and the rates are now sections of their own, rendered by
 * ReportSections from the same illustrative cycle in lib/sample.ts.
 *
 * This is the FLAGGED-FAILURE case of absence: a finding that demands
 * attention is risk-tinted, the same treatment the home findings panels give a
 * blocked crawler.
 */

const SOURCE_CHECKS = [
  { label: "AI crawlers can read your site", state: "Blocked by firewall", bad: true },
  {
    label: "Listed on the sources AI cites",
    state: `${SAMPLE_SOURCES.listed} of ${SAMPLE_SOURCES.cited} best-agency lists`,
    bad: false,
  },
  { label: "Content readable without JavaScript", state: "Yes", bad: false },
] as const;

function SourcesCard() {
  return (
    <ArtifactCard title="cited-sources checklist" meta="site + off-site">
      <ul className="px-5 py-4 text-[14px] leading-5">
        {SOURCE_CHECKS.map((check) => (
          <li
            key={check.label}
            className="border-t border-dashed border-line py-3 first:border-t-0 first:pt-0 last:pb-0"
          >
            <span className="font-semibold text-ink">{check.label}</span>
            <span
              className={`mt-1 block font-mono text-[12px] ${
                check.bad ? "font-medium text-risk" : "text-ink-soft"
              }`}
            >
              {check.state}
            </span>
          </li>
        ))}
      </ul>
    </ArtifactCard>
  );
}

export { SourcesCard };
