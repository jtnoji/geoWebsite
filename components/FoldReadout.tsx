import { SAMPLE_LABEL, SAMPLE_QUERY, SAMPLE_ROWS } from "@/lib/sample";

/**
 * The fold's instrument: one verdict figure, then the four engines that
 * produced it. It is the first thing on the site that is a measurement rather
 * than a claim about measurement.
 *
 * WHY A THIRD SAMPLING ARTIFACT IS NOT A REPEAT. Three views, three metrics,
 * and they appear in the order a reader can absorb them: this is the RATE (how
 * often you are named at all), ShareOfVoice below is the RANKING (who is named
 * instead), and SamplingCard further down is the PAIR (you against one
 * competitor, per engine). Showing the same number three ways would be
 * padding; showing three different numbers is the product.
 *
 * DERIVED, NEVER TYPED. Every figure here is computed from SAMPLE_ROWS, so the
 * fold cannot drift from the sampling card or the ranking. There is no second
 * copy of "6" or "40" anywhere in this file.
 *
 * A white artifact on the navy fold, which is the whole contrast idea: the
 * ground is the instrument's housing and the deliverable is the bright thing
 * sitting on it. Square and shadowless, because it is data.
 */

const RUNS = SAMPLE_ROWS.reduce((sum, r) => sum + r.runs, 0);
const HITS = SAMPLE_ROWS.reduce((sum, r) => sum + r.you, 0);
const RATE = Math.round((HITS / RUNS) * 100);

export default function FoldReadout() {
  return (
    <div className="surface surface-soft border border-white/15 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-paper-dim px-4 py-2.5 font-mono text-[11px] text-ink-faint">
        <span className="truncate">{`“${SAMPLE_QUERY}”`}</span>
        <span className="shrink-0">{`${RUNS} answers`}</span>
      </div>

      {/* The verdict. Cormorant at display scale because the brand sheet gives
          the serif to editorial figures, and this is the page's largest one. */}
      <div className="flex items-end gap-4 px-4 pb-4 pt-5">
        <span className="display text-[clamp(52px,7vw,68px)] leading-[0.85] text-ink">
          {`${RATE}%`}
        </span>
        <span className="pb-1.5 text-[13.5px] leading-[1.45] text-ink-soft">
          named in
          <br />
          <span className="font-semibold text-ink">{`${HITS} of ${RUNS} answers`}</span>
        </span>
      </div>

      <ul className="px-4 pb-1">
        {SAMPLE_ROWS.map((row) => {
          const share = Math.round((row.you / row.runs) * 100);
          return (
            <li
              key={row.engine}
              className="grid grid-cols-[92px_minmax(0,1fr)_auto] items-center gap-x-3 border-t border-line py-2.5"
            >
              <span className="truncate text-[13px] font-medium text-ink">
                {row.engine}
              </span>
              {/* The bar takes the flexible column and the label a fixed one.
                  The other way round gives a chart whose bars are the
                  narrowest thing in the row, which is what this was. */}
              {/* Track and fill, not dots: at this size ten dots per engine is
                  four rows of noise, and the fold needs one reading. */}
              <span aria-hidden="true" className="block h-[3px] w-full bg-line">
                <span
                  className="block h-full bg-ink"
                  style={{ width: `${share}%` }}
                />
              </span>
              <span className="text-right font-mono text-[12px] font-semibold tabular-nums text-ink-soft">
                {`${row.you}/${row.runs}`}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="border-t border-line px-4 py-2.5 font-mono text-[11px] text-ink-faint">
        {SAMPLE_LABEL}
      </p>
    </div>
  );
}
