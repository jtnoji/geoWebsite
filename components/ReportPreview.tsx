import ArtifactCard from "./ArtifactCard";
import SamplingCard from "./SamplingCard";
import { SAMPLE_LABEL, SAMPLE_QUERY, SAMPLE_ROWS } from "@/lib/sample";

/**
 * Report panels in the locked system: ArtifactCards (black mono header bars)
 * and the run-sampling dot rows. Red only where loss/absence is shown. Data comes
 * from lib/sample.ts (the ONE canonical illustrative dataset) — swap for real
 * anonymized report imagery when the sample run is picked (scaffold §7 step 6).
 */



const SOURCE_CHECKS = [
  { label: "AI crawlers can read your site", state: "Blocked by firewall", bad: true },
  { label: "Listed on the sources AI cites", state: "2 of 6 directories", bad: false },
  { label: "Content readable without JavaScript", state: "Yes", bad: false },
] as const;

function MentionRateCard() {
  return (
    <SamplingCard
      title={<>mention rate: &ldquo;{SAMPLE_QUERY}&rdquo;</>}
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
      <p className="px-4 py-4 text-sm leading-6 text-ink-soft">
        &ldquo;For plumbing in Berkeley, well-reviewed options include{" "}
        <b className="font-bold text-ink">Competitor A</b> and{" "}
        <b className="font-bold text-ink">Competitor B</b>&hellip;&rdquo;
      </p>
      <p className="mx-4 mb-4 border-l-2 border-gold bg-gold-soft px-3 py-2 font-mono text-[13px] font-semibold text-bad">
        The client was not mentioned.
      </p>
    </ArtifactCard>
  );
}

function SourcesCard() {
  return (
    <ArtifactCard title="cited-sources checklist" meta="site + off-site">
      <ul className="p-4 text-[13px] leading-5">
        {SOURCE_CHECKS.map((check) => (
          <li
            key={check.label}
            className="border-t border-dashed border-line py-2.5 first:border-t-0 first:pt-0 last:pb-0"
          >
            <span className="font-bold text-ink">{check.label}</span>
            <span
              className={`mt-0.5 block font-mono text-xs ${
                check.bad ? "font-semibold text-bad" : "text-ink-soft"
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

export default function ReportPreview() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <MentionRateCard />
      <VerbatimCard />
      <SourcesCard />
    </div>
  );
}

export { MentionRateCard, VerbatimCard, SourcesCard };
