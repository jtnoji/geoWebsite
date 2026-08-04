import ArtifactCard from "./ArtifactCard";

/**
 * Run-sampling rows inside an ArtifactCard. One row per engine; the box is
 * split in half — the client ("You", ink) on the left, the top competitor
 * (Harbour) on the right — so the two rates read side by side per engine.
 * Filled ● = mentioned in that run.
 *
 * This is the COMPARISON case of absence: a quantity shown as less, so the
 * competitor half steps DOWN a tone rather than lighting up. A flagged
 * failure is the other case and goes the other way — see ReportPreview.
 */

export type SamplingRow = {
  engine: string;
  you: number;
  competitor: number;
  runs: number;
};

/* The dots step down below lg, not below sm. The two-column section layouts
   start at md (768px), which leaves this card about 350px of column between
   768 and 1024 -- narrower than the phone case it was drawn to survive. The
   step-up has to clear the two-column range, not the phone range.

   The dots step down on phones. Ten of them at the desktop size, twice over
   plus the engine label and the run count, floor this card at ~400px, which is
   wider than a 390px phone has to give and pushed every page carrying it
   sideways. Shrinking the mark is the fix that keeps the row intact; stacking
   the two halves would cost the side-by-side comparison the card exists for. */
function Dots({ hits, runs, competitor }: { hits: number; runs: number; competitor?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`text-[10px] tracking-[1px] lg:text-[13px] lg:tracking-[2px] ${competitor ? "text-bad" : "text-ink"}`}
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
      className={`flex items-center gap-1.5 lg:gap-2.5 ${competitor ? "text-bad" : "text-ink"}`}
      aria-label={`${competitor ? "competitor" : "you"}: mentioned in ${hits} of ${runs} runs`}
    >
      <Dots hits={hits} runs={runs} competitor={competitor} />
      <span className="ml-auto font-mono text-[11px] font-semibold lg:text-[12.5px]">
        {hits}/{runs}
      </span>
    </div>
  );
}

export function SamplingRows({ rows }: { rows: readonly SamplingRow[] }) {
  return (
    /* `overflow-x-auto` is the floor under the responsive sizing above, not a
       replacement for it. Ten dots twice over plus a label and a count has a
       min-content width that no amount of shrinking gets under ~300px, and a
       320px phone in a two-column section has less than that. Past that point
       the card scrolls inside itself; the page never does. */
    <div className="overflow-x-auto p-4">
      {/* Column headers over the split */}
      <div className="grid grid-cols-[52px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-2 pb-2 lg:grid-cols-[76px_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-4 text-[10.5px] font-semibold uppercase tracking-[0.06em]">
        <span aria-hidden="true" />
        <span className="text-ink-faint">You</span>
        <span className="border-l border-line pl-2.5 text-bad lg:pl-4">Competitor</span>
      </div>
      {rows.map((row) => (
        <div
          key={row.engine}
          className="grid grid-cols-[52px_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-2 border-t border-line py-2.5 last:pb-0 lg:grid-cols-[76px_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-4"
        >
          <span className="text-[11.5px] font-bold text-ink lg:text-[12.5px]">{row.engine}</span>
          <HalfCell hits={row.you} runs={row.runs} />
          <div className="border-l border-line pl-2.5 lg:pl-4">
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
