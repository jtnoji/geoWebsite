import ArtifactCard from "./ArtifactCard";

/**
 * Run-sampling rows inside an ArtifactCard. One row per engine; the box is
 * split in half — the client ("You", ink) on the left, the top competitor
 * (gold-dark) on the right — so the two rates read side by side per engine.
 * Filled ● = mentioned in that run.
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
      className={`text-[13px] tracking-[2px] ${competitor ? "text-bad" : "text-ink"}`}
    >
      {"●".repeat(hits)}
      <span className={competitor ? "text-dot-bad" : "text-dot"}>
        {"●".repeat(Math.max(0, runs - hits))}
      </span>
    </span>
  );
}

function HalfCell({
  hits,
  runs,
  competitor = false,
}: {
  hits: number;
  runs: number;
  competitor?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 ${competitor ? "text-bad" : "text-ink"}`}
      aria-label={`${competitor ? "competitor" : "you"}: mentioned in ${hits} of ${runs} runs`}
    >
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
      {/* Column headers over the split */}
      <div className="grid grid-cols-[76px_1fr_1fr] items-center gap-x-4 pb-2 text-[10.5px] font-semibold uppercase tracking-[0.06em]">
        <span aria-hidden="true" />
        <span className="text-ink-faint">You</span>
        <span className="border-l border-line pl-4 text-bad">Competitor</span>
      </div>
      {rows.map((row) => (
        <div
          key={row.engine}
          className="grid grid-cols-[76px_1fr_1fr] items-center gap-x-4 border-t border-line py-2.5 last:pb-0"
        >
          <span className="text-[12.5px] font-bold text-ink">{row.engine}</span>
          <HalfCell hits={row.you} runs={row.runs} />
          <div className="border-l border-line pl-4">
            <HalfCell hits={row.competitor} runs={row.runs} competitor />
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
