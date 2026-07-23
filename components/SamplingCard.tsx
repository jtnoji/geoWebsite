import ArtifactCard from "./ArtifactCard";

/**
 * Run-sampling rows inside an ArtifactCard. Each engine shows a PAIR of dot
 * rows: the client ("you") in ink and the top competitor in gold-dark — the
 * only place the accent marks data. Filled ● = mentioned in that run.
 */

export type SamplingRow = {
  engine: string;
  you: number;
  competitor: number;
  runs: number;
};

function Dots({ hits, runs, competitor }: { hits: number; runs: number; competitor?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`text-sm tracking-[2.5px] ${competitor ? "text-bad" : "text-ink"}`}
    >
      {"●".repeat(hits)}
      <span className={competitor ? "text-dot-bad" : "text-dot"}>
        {"●".repeat(Math.max(0, runs - hits))}
      </span>
    </span>
  );
}

function RateRow({
  label,
  hits,
  runs,
  competitor = false,
}: {
  label: string;
  hits: number;
  runs: number;
  competitor?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 ${competitor ? "text-bad" : "text-ink"}`}
      aria-label={`${label}: mentioned in ${hits} of ${runs} runs`}
    >
      <span
        className={`w-[74px] text-[11px] font-semibold uppercase tracking-[0.06em] ${
          competitor ? "text-bad" : "text-ink-faint"
        }`}
      >
        {label}
      </span>
      <Dots hits={hits} runs={runs} competitor={competitor} />
      <span className="ml-auto font-mono text-[12.5px] font-semibold">
        {hits}/{runs}
      </span>
    </div>
  );
}

export function SamplingRows({ rows }: { rows: readonly SamplingRow[] }) {
  return (
    <div className="p-4">
      {rows.map((row) => (
        <div
          key={row.engine}
          className="border-t border-line pb-3 pt-3 first:border-t-0 first:pt-0 last:pb-0"
        >
          <span className="block text-[12.5px] font-bold text-ink">{row.engine}</span>
          <div className="mt-1.5 space-y-1">
            <RateRow label="You" hits={row.you} runs={row.runs} />
            <RateRow label="Competitor" hits={row.competitor} runs={row.runs} competitor />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SamplingCard({
  title,
  meta,
  rows,
  footer,
}: {
  title: React.ReactNode;
  meta?: React.ReactNode;
  rows: readonly SamplingRow[];
  footer?: React.ReactNode;
}) {
  return (
    <ArtifactCard title={title} meta={meta} footer={footer}>
      <SamplingRows rows={rows} />
    </ArtifactCard>
  );
}
