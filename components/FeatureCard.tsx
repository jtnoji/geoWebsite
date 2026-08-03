/**
 * The bordered white card the home engine grid is built from: square corners,
 * 1px line-dark border, no shadow — the same restraint as ArtifactCard,
 * because these sit next to measurement artifacts.
 *
 * It backed three home grids until 2026-08-03, when the sources became a ruled
 * ledger and the situations lost their fill. Three identical card sets down one
 * page read as one module repeating rather than three arguments, so the card is
 * now spent once, on the four engines. `mark` and `note` went with the two
 * grids that left; both are in git if a fourth set ever earns the treatment.
 */
export default function FeatureCard({
  kicker,
  title,
  sub,
  body,
  signals,
}: {
  kicker?: string;
  title: string;
  sub?: string;
  body: string;
  signals?: readonly string[];
}) {
  return (
    <div className="flex flex-col gap-3.5 border border-line-dark bg-white px-6 py-7">
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
    </div>
  );
}
