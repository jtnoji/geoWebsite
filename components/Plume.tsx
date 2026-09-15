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
 * Colour follows the Sable site design (mockup/sable-site.dc.html): the two
 * short plumes are the ground's ink at two strengths and the tallest is Sky,
 * on dark and on light alike.
 *
 * Scale reduction (brand sheet §03) is automatic and keyed off the rendered
 * mark height, so a small call site cannot accidentally ship three plumes of
 * mud: under 20px the faintest plume drops and it runs two-up, under 16px only
 * the tallest survives.
 *
 * Decorative — the wordmark beside it carries the name, so this is
 * aria-hidden and contributes no accessible text.
 */

type Tone = "light" | "dark" | "header" | "mono";

/** Tallest-last, so slicing off the faint end is a single `.slice()`. */
const TONES: Record<Tone, readonly [string, string, string]> = {
  light: ["rgba(14,35,64,0.32)", "rgba(14,35,64,0.6)", "var(--color-sky)"],
  dark: ["rgba(255,255,255,0.42)", "rgba(255,255,255,0.78)", "var(--color-sky)"],
  // Follows the header's dress, which the page underneath decides
  // (globals.css, `.site-header`).
  header: ["var(--plume-1)", "var(--plume-2)", "var(--plume-3)"],
  // Single-colour lockup (brand sheet §02) — inherits from the parent.
  mono: ["currentColor", "currentColor", "currentColor"],
};

const HEIGHT_RATIOS = [1.7, 2.3, 2.9] as const;

export default function Plume({
  u = 6,
  tone = "light",
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
 * The lockup: mark, then the wordmark in Libre Franklin 500.
 *
 * The optional `subline` is the tracked "AI SEO" label (Josh, 2026-08-02). The
 * header sets it on the wordmark's baseline (`layout="row"`); the footer
 * stacks it underneath in mono (`layout="stack"`), which is how the design
 * draws the two.
 *
 * The wordmark renders BRAND from lib/site.ts, never a literal, so the launch
 * rename stays a one-file change.
 */
export function Lockup({
  u = 6,
  size = 21,
  tone = "light",
  subline,
  layout = "row",
  className = "",
}: {
  u?: number;
  /** Wordmark font-size in px. Never below 14 (brand sheet §03). */
  size?: number;
  tone?: Tone;
  subline?: string;
  layout?: "row" | "stack";
  className?: string;
}) {
  const stacked = layout === "stack";
  return (
    <span className={`inline-flex items-center ${className}`} style={{ gap: `${1.6 * u}px` }}>
      <Plume u={u} tone={tone} />
      <span
        className={stacked ? "flex flex-col" : "flex items-baseline"}
        style={{ gap: stacked ? "5px" : "9px" }}
      >
        <span
          className="font-medium leading-none"
          style={{ fontSize: `${size}px`, letterSpacing: "-0.02em" }}
        >
          {BRAND}
        </span>
        {subline ? (
          <span
            className={`uppercase leading-none ${stacked ? "font-mono" : "font-medium"}`}
            style={{
              fontSize: `${Math.max(9, size * 0.45)}px`,
              letterSpacing: "0.3em",
              opacity: 0.72,
            }}
          >
            {subline}
          </span>
        ) : null}
      </span>
    </span>
  );
}
