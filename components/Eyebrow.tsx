/**
 * The section eyebrow (mockup/sable-site.dc.html): a dot and a tracked mono
 * label. Replaces RuleEyebrow, whose rule-and-label belonged to the Berkeley
 * system.
 *
 * The dot is its own aria-hidden span, so the label is plain words in the raw
 * HTML a crawler reads and in what a screen reader announces. Sky on a dark
 * band, ink-faint on light.
 */
export default function Eyebrow({
  children,
  onDark = false,
  className = "",
}: {
  children: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`font-mono text-[11px] uppercase tracking-[0.16em] ${
        onDark ? "text-sky" : "text-ink-faint"
      } ${className}`}
    >
      <span aria-hidden="true" className="mr-2">
        ●
      </span>
      {children}
    </p>
  );
}
