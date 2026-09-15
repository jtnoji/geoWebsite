/**
 * The product panel beside each home capability (mockup/sable-site.dc.html):
 * a white card with a titled header and a stack of finding rows. A row carries
 * a label, then either a rate bar or a one-line note, and a status chip.
 *
 * Chip tones follow the flagged-finding rule in globals.css: `risk`, `caution`
 * and `ok` are status hues for findings, `note` is the neutral navy tint. They
 * are chip colours only, never text or section colours.
 *
 * Every panel that renders sample numbers says so in its `meta`, per the
 * sample-data honesty rule.
 */

export type FindingTone = "risk" | "caution" | "ok" | "note";

export type FindingRow = {
  label: string;
  value: string;
  tone: FindingTone;
  /** A one-line note under the label. */
  sub?: string;
  /** A rate, 0 to 1, drawn as a bar under the label. */
  bar?: number;
};

const CHIP: Record<FindingTone, string> = {
  risk: "bg-risk-bg text-risk",
  caution: "bg-caution-bg text-caution",
  ok: "bg-ok-bg text-ok",
  note: "bg-note-bg text-note",
};

export default function FindingsPanel({
  title,
  meta,
  rows,
}: {
  title: string;
  meta: string;
  rows: readonly FindingRow[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-paper-dim px-5 py-4">
        <p className="text-[15px] font-semibold text-ink">{title}</p>
        <p className="text-[12.5px] text-ink-faint">{meta}</p>
      </div>
      <ul className="flex flex-col gap-2.5 px-4 pb-5 pt-[18px] sm:px-5">
        {rows.map((row) => (
          <li
            key={row.label}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3.5 rounded-[10px] bg-inset px-3.5 py-3"
          >
            <div className="min-w-0">
              <p className="text-[14.5px] text-ink">{row.label}</p>
              {row.bar !== undefined && (
                <span
                  aria-hidden="true"
                  className="mt-[7px] block h-[5px] overflow-hidden rounded-full bg-track"
                >
                  <span
                    className="block h-full rounded-full bg-cobalt"
                    style={{ width: `${Math.round(row.bar * 100)}%` }}
                  />
                </span>
              )}
              {row.sub && (
                <p className="mt-0.5 text-[13px] text-ink-faint">{row.sub}</p>
              )}
            </div>
            <span
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-semibold ${CHIP[row.tone]}`}
            >
              {row.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
