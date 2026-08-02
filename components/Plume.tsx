import { BRAND } from "@/lib/site";

/**
 * The plume mark — three rising plumes (brand sheet §01, mockup/sable-brand-sheet.html).
 *
 * Each plume is a teardrop: three rounded corners and one square heel, all
 * seated on a shared baseline. Geometry is derived from a single unit `u`
 * (the width of one plume) so the mark can never be stretched, squashed or
 * re-proportioned at a call site — brand sheet §07 forbids all three:
 *
 *     width   1 u each
 *     heights 1.7 u · 2.3 u · 2.9 u
 *     gap     0.3 u
 *     corner  60% 60% 60% 0
 *
 * Tone steps down with height so the eye lands on the tallest, darkest form.
 *
 * Scale reduction (brand sheet §03) is automatic and keyed off the rendered
 * mark height, so a small call site cannot accidentally ship three plumes of
 * mud: under 20px the faintest plume drops and it runs two-up, under 16px only
 * the tallest survives.
 *
 * Decorative — the wordmark beside it carries the name, so this is
 * aria-hidden and contributes no accessible text.
 */

type Tone = "paper" | "navy" | "mono";

/** Tallest-first, so slicing off the faint end is a single `.slice()`. */
const TONES: Record<Tone, readonly [string, string, string]> = {
  // On the paper ground: Mist → Harbour → Berkeley Navy.
  paper: ["var(--color-ink-dim)", "var(--color-ink-soft)", "var(--color-ink)"],
  // On navy: two whites, then Sky. This is the one accent mark the system
  // spends site-wide, and it is legal here because the ground is navy.
  navy: ["rgba(255,255,255,0.36)", "rgba(255,255,255,0.74)", "var(--color-sky)"],
  // Single-colour lockup (brand sheet §02) — inherits from the parent.
  mono: ["currentColor", "currentColor", "currentColor"],
};

const HEIGHT_RATIOS = [1.7, 2.3, 2.9] as const;

export default function Plume({
  u = 6,
  tone = "paper",
  className = "",
}: {
  /** Width of one plume, in px. The mark stands 2.9u tall. */
  u?: number;
  tone?: Tone;
  className?: string;
}) {
  const markHeight = HEIGHT_RATIOS[2] * u;
  // Below 16px only the tallest plume reads; below 20px, two.
  const count = markHeight < 16 ? 1 : markHeight < 20 ? 2 : 3;

  const ratios = HEIGHT_RATIOS.slice(3 - count);
  const colors = TONES[tone].slice(3 - count);

  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-end ${className}`}
      style={{ gap: `${0.3 * u}px` }}
    >
      {ratios.map((ratio, i) => (
        <span
          key={ratio}
          style={{
            width: `${u}px`,
            height: `${ratio * u}px`,
            background: colors[i],
            borderRadius: "60% 60% 60% 0",
          }}
        />
      ))}
    </span>
  );
}

/**
 * The primary horizontal lockup: mark, then the Garamond wordmark.
 *
 * The optional `subline` renders the brand sheet's tracked "AI SEO" label. It
 * is OFF by default and unused on the site: the brand sheet's own site-header
 * mockup (§06) shows mark plus wordmark alone, and "AI SEO" is a positioning
 * word that website-plan.md has never approved as visible copy. Turn it on
 * only with sign-off.
 */
export function Lockup({
  u = 6,
  size = 30,
  tone = "paper",
  subline,
  className = "",
}: {
  u?: number;
  /** Wordmark font-size in px. Never below 14 (brand sheet §03). */
  size?: number;
  tone?: Tone;
  subline?: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center ${className}`} style={{ gap: `${1.6 * u}px` }}>
      <Plume u={u} tone={tone} />
      <span className="flex flex-col" style={{ gap: `${0.7 * u}px` }}>
        <span
          className="display leading-none"
          style={{ fontSize: `${size}px`, letterSpacing: "0.04em" }}
        >
          {BRAND}
        </span>
        {subline ? (
          <span
            className="font-mono uppercase"
            style={{
              fontSize: `${Math.max(7.5, size * 0.23)}px`,
              letterSpacing: "0.36em",
              opacity: 0.6,
            }}
          >
            {subline}
          </span>
        ) : null}
      </span>
    </span>
  );
}
