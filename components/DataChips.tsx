/**
 * The bordered mono data strip (mockup `.chips`): white bg, 1px line-dark
 * border, cells split by 1px borders, mono 12.5px, bold ink values, optional
 * accent cell. NEVER a black fill (tried and rejected).
 */

export type DataChipCell = {
  /* Rendered as-is; wrap emphasized values in <b> via the `value` split */
  label?: string;
  value?: string;
  suffix?: string;
  accent?: boolean;
};

export default function DataChips({ cells }: { cells: readonly DataChipCell[] }) {
  return (
    <div className="inline-flex flex-col border border-line-dark bg-white font-mono text-[12.5px] text-ink-soft sm:flex-row">
      {cells.map((cell, i) => (
        <span
          key={i}
          className={`border-b border-line-dark px-4 py-2.5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 ${
            cell.accent ? "font-semibold text-accent" : ""
          }`}
        >
          {cell.label}
          {cell.value && <b className="font-bold text-ink">{cell.value}</b>}
          {cell.suffix}
        </span>
      ))}
    </div>
  );
}
