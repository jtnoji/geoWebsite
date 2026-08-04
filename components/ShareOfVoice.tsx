import ArtifactCard from "./ArtifactCard";
import {
  SAMPLE_LABEL,
  SAMPLE_RANKING,
  SAMPLE_RUNS_TOTAL,
  SAMPLE_VERTICAL,
} from "@/lib/sample";

/**
 * Share of voice: every business the category's answers named, ordered by how
 * often, with the reader's own business last.
 *
 * WHY IT EXISTS. "Share of voice" has been one of the four headline metrics
 * since the first build and the only one with no artifact behind it, so the
 * page asserted the most interesting number Sable produces and never showed
 * it. The answer card above shows one answer; this shows what forty of them
 * add up to, which is the actual deliverable.
 *
 * A MEASUREMENT ARTIFACT, so it obeys those rules: square corners, no shadow,
 * navy header bar, server-rendered, every figure real text in the exported
 * HTML. No client boundary and no chart library. The bars are divs whose width
 * is a percentage, so they survive JS-off exactly like SearchShiftChart's SVG.
 *
 * THE TWO DIRECTIONS OF ABSENCE, both in one card, which is why it reads.
 * Competitors are the COMPARISON case: more than you, so they step DOWN into
 * Harbour with a hairline bar. Your own row is the FLAGGED FAILURE case: it
 * steps UP and inverts to a navy fill. The result is that the loudest row on
 * the card carries the shortest bar, which is the finding stated as
 * composition rather than as a sentence.
 *
 * Numerals are Cormorant via `.display` because the brand sheet reserves the
 * serif for headings AND editorial figures, and a rank column is the second.
 */

const pct = (hits: number) => Math.round((hits / SAMPLE_RUNS_TOTAL) * 100);

export default function ShareOfVoice({
  className = "",
}: {
  className?: string;
}) {
  /* The bar scale is relative to the leader, not to 100%, so the gap between
     first and last is what the eye measures. Against a 100% axis every bar is
     short and the ranking reads as "everyone is small". */
  const leader = Math.max(...SAMPLE_RANKING.map((r) => r.hits));

  return (
    <ArtifactCard
      /* Template strings, not JSX interpolation beside literal text: React
         separates adjacent text nodes with an HTML comment, so `{n} answers`
         ships as `40<!-- --> answers` and a crawler reading raw bytes never
         sees the figure and its unit as one token. On a site whose product is
         being quotable by those crawlers, that is not a detail. */
      title={`share of voice \u00a0\u00b7\u00a0 ${SAMPLE_VERTICAL}`}
      meta={`${SAMPLE_RUNS_TOTAL} answers`}
      footer={SAMPLE_LABEL}
      className={className}
    >
      <div className="px-4 pb-3 pt-3.5">
        <div className="flex items-baseline justify-between gap-3 pb-2.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
          <span>Named in the answer</span>
          <span>{`Of ${SAMPLE_RUNS_TOTAL}`}</span>
        </div>

        <ol>
          {SAMPLE_RANKING.map((row, i) => {
            const share = pct(row.hits);
            const width = `${Math.round((row.hits / leader) * 100)}%`;

            return (
              <li
                key={row.name}
                className={`grid grid-cols-[26px_minmax(0,1fr)_auto] items-center gap-x-3 border-t border-line py-2.5 ${
                  row.you ? "-mx-4 mt-0 border-transparent bg-ink px-4 text-white" : ""
                }`}
              >
                {/* ink-faint, NOT ink-dim: the tokens mark ink-dim non-text
                    only and mean it, at 2.3:1 on this paper. A rank numeral is
                    text, however decorative it looks. */}
                <span
                  className={`display text-[20px] leading-none ${
                    row.you ? "text-white/70" : "text-ink-faint"
                  }`}
                >
                  {i + 1}
                </span>

                <span className="min-w-0">
                  <span
                    className={`block truncate text-[13.5px] font-medium ${
                      row.you ? "text-white" : "text-ink"
                    }`}
                  >
                    {row.name}
                    {row.you && (
                      <span className="ml-2 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/60">
                        you
                      </span>
                    )}
                  </span>
                  {/* The bar. Track and fill both sit inside the row, so the
                      inverted row's bar inverts with it rather than needing a
                      second colour. */}
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 block h-[3px] w-full ${
                      row.you ? "bg-white/20" : "bg-line"
                    }`}
                  >
                    <span
                      className={`block h-full ${row.you ? "bg-white" : "bg-ink-soft"}`}
                      style={{ width }}
                    />
                  </span>
                </span>

                <span className="text-right">
                  <span
                    className={`font-mono text-[13.5px] font-semibold ${
                      row.you ? "text-white" : "text-ink"
                    }`}
                  >
                    {row.hits}
                  </span>
                  <span
                    className={`ml-1.5 font-mono text-[11px] ${
                      row.you ? "text-white/60" : "text-ink-faint"
                    }`}
                  >
                    {`${share}%`}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </ArtifactCard>
  );
}
