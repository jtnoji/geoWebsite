/**
 * Section eyebrow in the long-form home style: a 26×2px rule followed by an
 * uppercase tracked label. It is the section marker for the explainer
 * sections, where Chip's filled navy tag would stack up as ten solid blocks
 * down the page.
 *
 * Chip is still the marker everywhere else. The two do not mix inside one
 * section.
 *
 * On paper both the rule and the label are Sable Blue — one step off the ink,
 * which is how this palette says "quieter than a heading, louder than meta".
 * `onDark` swaps them to Sky for the full-bleed navy bands, where Sky is legal
 * and Sable Blue has no contrast.
 */
export default function RuleEyebrow({
  children,
  onDark = false,
  className = "",
}: {
  children: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span
        aria-hidden="true"
        className={`h-0.5 w-[26px] ${onDark ? "bg-sky" : "bg-accent"}`}
      />
      <span
        className={`font-mono text-[11px] font-medium uppercase tracking-[0.22em] ${
          onDark ? "text-sky" : "text-accent"
        }`}
      >
        {children}
      </span>
    </div>
  );
}
