import {
  SAMPLE_LABEL,
  SAMPLE_QUERY,
  SAMPLE_RANKING,
  SAMPLE_ROWS,
  SAMPLE_RUNS_TOTAL,
  SAMPLE_VERTICAL,
} from "@/lib/sample";

/**
 * The deliverable as an object: a stack of report pages, the top one legible.
 *
 * WHY A STACK. Every artifact on this page is one flat card, which is why the
 * page reads as uniform however good the individual cards are. A document with
 * depth and pages behind it says "this is a thing you receive" in a way that a
 * fifth bordered rectangle cannot, and it gives the pricing block a focal
 * object instead of three columns of text.
 *
 * IT IS A PREVIEW, NOT A MOCKUP OF NOTHING. The visible page renders the real
 * canonical sample figures, so it is the same measurement the rest of the page
 * shows rather than lorem boxes. The sheets behind it are blank on purpose:
 * inventing content for pages nobody can read would be inventing content.
 *
 * Every figure derives from lib/sample.ts and carries the illustrative label,
 * and there are no client names, logos, or results anywhere in it.
 */

const HITS = SAMPLE_ROWS.reduce((n, r) => n + r.you, 0);
const RATE = Math.round((HITS / SAMPLE_RUNS_TOTAL) * 100);

export default function ReportStack() {
  return (
    <div className="relative">
      {/* Two sheets behind, rotated a hair. Decorative and hidden from the
          accessibility tree: they carry no information, they carry weight. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-4 -top-3 h-16 rounded-t-[var(--r-card)] border border-line-dark bg-white/70"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-2 -top-1.5 h-16 rounded-t-[var(--r-card)] border border-line-dark bg-white/85"
      />

      <div className="surface surface-lift relative border border-line-dark bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-line-dark bg-ink px-5 py-3 text-white">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em]">
            AI Visibility Audit
          </span>
          <span className="font-mono text-[11px] text-ink-dim">p. 1 of 9</span>
        </div>

        <div className="px-5 pb-5 pt-5">
          <p className="font-mono text-[11px] text-ink-faint">
            {`“${SAMPLE_QUERY}”`}
          </p>

          <div className="mt-4 flex items-end gap-4 border-b border-line pb-5">
            <span className="display text-[52px] leading-[0.85] text-ink">
              {`${RATE}%`}
            </span>
            <span className="pb-1 text-[13px] leading-[1.45] text-ink-soft">
              named in
              <br />
              <span className="font-semibold text-ink">
                {`${HITS} of ${SAMPLE_RUNS_TOTAL} answers`}
              </span>
            </span>
          </div>

          <p className="mt-4 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            {`Share of voice · ${SAMPLE_VERTICAL}`}
          </p>
          <ul className="mt-2.5">
            {SAMPLE_RANKING.map((row) => (
              <li
                key={row.name}
                className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 border-t border-line py-2 ${
                  row.you ? "-mx-5 border-transparent bg-ink px-5 text-white" : ""
                }`}
              >
                <span
                  className={`truncate text-[13px] ${
                    row.you ? "font-medium text-white" : "text-ink-soft"
                  }`}
                >
                  {row.name}
                </span>
                <span
                  className={`font-mono text-[12.5px] font-semibold ${
                    row.you ? "text-white" : "text-ink"
                  }`}
                >
                  {`${Math.round((row.hits / SAMPLE_RUNS_TOTAL) * 100)}%`}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="border-t border-line px-5 py-2.5 font-mono text-[11px] text-ink-faint">
          {SAMPLE_LABEL}
        </p>
      </div>
    </div>
  );
}
