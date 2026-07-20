import ArtifactCard from "./ArtifactCard";

/**
 * Run-sampling dot rows inside an ArtifactCard (mockup `.runrow`/`.dots`):
 * bold engine name, ● filled / ○-colored empty dots at 2.5px tracking, mono
 * rate right-aligned. The competitor row renders entirely in red (the ONLY
 * red usage: loss).
 */

export type SamplingRow = {
  engine: string;
  hits: number;
  runs: number;
  competitor?: boolean;
};

function Dots({ hits, runs, competitor }: { hits: number; runs: number; competitor?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`text-sm tracking-[2.5px] ${competitor ? "text-bad" : "text-ink"}`}
    >
      {"●".repeat(hits)}
      <span className={competitor ? "text-bad/30" : "text-[#d5d7d2]"}>
        {"●".repeat(Math.max(0, runs - hits))}
      </span>
    </span>
  );
}

export function SamplingRows({ rows }: { rows: readonly SamplingRow[] }) {
  return (
    <div className="p-4">
      {rows.map((row) => (
        <div
          key={row.engine}
          className={`mb-3 flex items-center gap-3 text-[13px] last:mb-0 ${
            row.competitor ? "text-bad" : ""
          }`}
        >
          <span className="w-[88px] text-[12.5px] font-bold">{row.engine}</span>
          <Dots hits={row.hits} runs={row.runs} competitor={row.competitor} />
          <span
            className="ml-auto font-mono text-[12.5px] font-semibold"
            aria-label={`mentioned in ${row.hits} of ${row.runs} runs`}
          >
            {row.hits}/{row.runs}
          </span>
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
