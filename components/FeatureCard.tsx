/**
 * The bordered white card the home explainer grids are built from: square
 * corners, 1px line-dark border, no shadow — the same restraint as
 * ArtifactCard, because these sit next to measurement artifacts.
 *
 * Three home grids share it (engines, sources, situations); the slots are
 * what differ. `mark` takes the leading element (a legend swatch or a big
 * ghosted numeral), `sub` the Sable Blue line under the title, `signals` the
 * outlined tag row, `note` the ruled-off closing line.
 */
export default function FeatureCard({
  mark,
  kicker,
  title,
  sub,
  body,
  signals,
  note,
}: {
  mark?: React.ReactNode;
  kicker?: string;
  title: string;
  sub?: string;
  body: string;
  signals?: readonly string[];
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-3.5 border border-line-dark bg-white px-6 py-7">
      {mark}
      {kicker && (
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-faint">
          {kicker}
        </p>
      )}
      <h3 className="text-xl font-medium tracking-[-0.015em] text-ink text-pretty">
        {title}
      </h3>
      {sub && (
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
          {sub}
        </p>
      )}
      <p className="flex-1 text-[14.5px] leading-[1.65] text-ink-soft text-pretty">
        {body}
      </p>
      {signals && (
        <div className="mt-1 flex flex-wrap gap-2">
          {signals.map((signal) => (
            <span
              key={signal}
              className="border border-line-dark px-[11px] py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink-soft"
            >
              {signal}
            </span>
          ))}
        </div>
      )}
      {note && (
        <p className="mt-1 border-t border-line pt-3.5 text-[13px] font-medium leading-[1.55] text-accent">
          {note}
        </p>
      )}
    </div>
  );
}
