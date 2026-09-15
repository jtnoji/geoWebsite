import ArtifactCard from "./ArtifactCard";
import SamplingCard from "./SamplingCard";
import {
  SAMPLE_COMPETITORS,
  SAMPLE_LABEL,
  SAMPLE_QUERY,
  SAMPLE_ROWS,
} from "@/lib/sample";

/**
 * Report panels: ArtifactCards and the run-sampling dot rows. Data comes from
 * lib/sample.ts (the ONE canonical illustrative dataset). Swap for real
 * anonymized report imagery when the sample run is picked (scaffold §7 step 6).
 *
 * These are the FLAGGED-FAILURE case of absence, the opposite of SamplingCard's
 * comparison case: a finding that demands attention is a risk-tinted chip, the
 * same treatment the home findings panels give a blocked crawler.
 */

const SOURCE_CHECKS = [
  { label: "AI crawlers can read your site", state: "Blocked by firewall", bad: true },
  { label: "Listed on the sources AI cites", state: "2 of 6 best-agency lists", bad: false },
  { label: "Content readable without JavaScript", state: "Yes", bad: false },
] as const;

function MentionRateCard() {
  return (
    <SamplingCard
      title={<>mention rate · &ldquo;{SAMPLE_QUERY}&rdquo;</>}
      meta="10 runs/engine"
      rows={[...SAMPLE_ROWS]}
      footer={SAMPLE_LABEL}
    />
  );
}

function VerbatimCard() {
  return (
    <ArtifactCard
      title={<>chatgpt: &ldquo;{SAMPLE_QUERY}&rdquo;</>}
      meta="run 3/10"
    >
      <p className="px-5 py-4 text-[14.5px] leading-6 text-ink-soft">
        &ldquo;For a seed-stage B2B startup, well-regarded agencies include{" "}
        <b className="font-semibold text-ink">{SAMPLE_COMPETITORS[0]}</b> and{" "}
        <b className="font-semibold text-ink">{SAMPLE_COMPETITORS[1]}</b>&hellip;&rdquo;
      </p>
      <p className="mx-5 mb-5 rounded-[10px] bg-risk-bg px-3.5 py-2.5 font-mono text-[12.5px] font-medium text-risk">
        The client was not mentioned.
      </p>
    </ArtifactCard>
  );
}

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

export { MentionRateCard, VerbatimCard, SourcesCard };
