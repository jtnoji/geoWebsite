import type { CSSProperties } from "react";

/**
 * The light beams behind the dark bands (mockup/sable-site.dc.html). Pure CSS:
 * stacked, absolutely positioned gradient layers, each cut to a shard with
 * clip-path and tilted, then faded toward the text side and the section edges
 * so copy always sits on near-black.
 *
 * Decorative and server-rendered: aria-hidden, no pointer events, no motion.
 * Every layer is a plain <div> with inline styles, because the geometry is
 * one-off per variant and would only be renamed, not reused, as classes. None
 * of the styles hide anything, which the hidden-text gate in geo.spec.ts
 * checks on every page.
 *
 * Three variants, all taken from the design:
 *   hero  the home fold: a navy radial ground, a faint diagonal grid, a glow
 *         and two soft beams.
 *   band  the home "How it works" and closing bands: a glow and two brighter
 *         beams.
 *   page  the dark heroes on /how-it-works and /about: five beams.
 */

type Variant = "hero" | "band" | "page";

const SHARD_A = "polygon(0% 38%, 62% 0%, 100% 18%, 44% 100%, 0% 86%)";
const SHARD_B = "polygon(0% 12%, 46% 0%, 100% 52%, 58% 100%, 0% 70%)";

const BEAM_A =
  "linear-gradient(146deg, rgba(4,8,15,0) 14%, #060E1C 30%, #0D2A55 44%, #2D66C0 51.5%, #DCEAFA 53.5%, #2B63BB 55.5%, #0A1E3C 66%, rgba(4,8,15,0) 88%)";
const BEAM_B =
  "linear-gradient(158deg, rgba(4,8,15,0) 22%, #081525 40%, #2258AC 51%, #EAF2FC 53.5%, #2F6FD0 57%, #0A1B33 72%, rgba(4,8,15,0) 90%)";

/* Both fades keep the text side and the section edges near-black. The bottom
   stop is fully opaque, not the design's 0.92: at 0.92 a bright beam still
   showed through and ended in a hard horizontal cut where the section did. */
const FADE_SIDE: CSSProperties = {
  inset: 0,
  background:
    "linear-gradient(96deg, #04080F 11%, rgba(4,8,15,0.9) 26%, rgba(4,8,15,0.32) 42%, rgba(4,8,15,0) 57%)",
};
const FADE_EDGES: CSSProperties = {
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(4,8,15,0.66) 0%, rgba(4,8,15,0) 21%, rgba(4,8,15,0) 68%, #04080F 100%)",
};

const GLOW = (strength: number): CSSProperties => ({
  inset: "-10% -15% -10% 18%",
  background: `radial-gradient(46% 46% at 72% 52%, rgba(96,158,240,${strength}) 0%, rgba(22,62,118,${(strength * 0.56).toFixed(3)}) 46%, rgba(4,8,15,0) 78%)`,
  filter: "blur(30px)",
});

const LAYERS: Record<Variant, CSSProperties[]> = {
  hero: [
    {
      inset: 0,
      background:
        "radial-gradient(120% 110% at 78% 34%, #10294A 0%, #0A1728 44%, #04080F 100%)",
    },
    {
      inset: 0,
      backgroundImage:
        "repeating-linear-gradient(72deg, rgba(127,166,217,0.055) 0 1px, rgba(255,255,255,0) 1px 26px), repeating-linear-gradient(162deg, rgba(127,166,217,0.035) 0 1px, rgba(255,255,255,0) 1px 26px)",
    },
    {
      inset: "-20% -10%",
      background:
        "radial-gradient(42% 46% at 74% 44%, rgba(96,158,240,0.3) 0%, rgba(24,66,124,0.14) 46%, rgba(4,8,15,0) 76%)",
      filter: "blur(34px)",
    },
    {
      width: "74%",
      height: "150%",
      right: "-18%",
      top: "-26%",
      transform: "rotate(-19deg)",
      clipPath: SHARD_A,
      background:
        "linear-gradient(146deg, rgba(4,8,15,0) 16%, rgba(13,42,85,0.55) 42%, rgba(63,124,218,0.5) 52%, rgba(220,234,250,0.42) 53.6%, rgba(43,99,187,0.4) 56%, rgba(10,30,60,0.4) 68%, rgba(4,8,15,0) 88%)",
      opacity: 0.6,
    },
    {
      width: "46%",
      height: "104%",
      right: "4%",
      top: "20%",
      transform: "rotate(-52deg)",
      clipPath: SHARD_B,
      background:
        "linear-gradient(158deg, rgba(4,8,15,0) 24%, rgba(8,21,37,0.5) 42%, rgba(34,88,172,0.45) 51%, rgba(234,242,252,0.35) 53.5%, rgba(47,111,208,0.35) 58%, rgba(4,8,15,0) 88%)",
      filter: "blur(3px)",
      opacity: 0.5,
    },
    {
      inset: 0,
      background:
        "linear-gradient(96deg, #04080F 12%, rgba(4,8,15,0.9) 28%, rgba(4,8,15,0.4) 46%, rgba(4,8,15,0.05) 62%)",
    },
    {
      inset: 0,
      background:
        "linear-gradient(180deg, rgba(4,8,15,0.72) 0%, rgba(4,8,15,0) 20%, rgba(4,8,15,0) 70%, #04080F 100%)",
    },
  ],
  band: [
    GLOW(0.42),
    {
      width: "84%",
      height: "142%",
      right: "-22%",
      top: "-26%",
      transform: "rotate(-19deg)",
      clipPath: SHARD_A,
      background: BEAM_A,
      opacity: 0.9,
    },
    {
      width: "52%",
      height: "98%",
      right: "2%",
      top: "22%",
      transform: "rotate(-52deg)",
      clipPath: SHARD_B,
      background: BEAM_B,
      filter: "blur(2px)",
      opacity: 0.7,
    },
    FADE_SIDE,
    FADE_EDGES,
  ],
  page: [
    GLOW(0.425),
    {
      width: "84%",
      height: "142%",
      right: "-22%",
      top: "-26%",
      transform: "rotate(-19deg)",
      clipPath: SHARD_A,
      background: BEAM_A,
      opacity: 0.85,
    },
    {
      width: "66%",
      height: "122%",
      right: "-12%",
      top: "-6%",
      transform: "rotate(-33deg)",
      clipPath: "polygon(0% 22%, 54% 0%, 100% 40%, 68% 100%, 6% 78%)",
      background:
        "linear-gradient(152deg, rgba(4,8,15,0) 18%, #07101F 34%, #163E7B 47%, #5B90DC 52.5%, #FFFFFF 54%, #3F7CDA 56%, #0A1B33 70%, rgba(4,8,15,0) 88%)",
      filter: "blur(1px)",
      opacity: 0.81,
    },
    {
      width: "52%",
      height: "98%",
      right: "2%",
      top: "22%",
      transform: "rotate(-52deg)",
      clipPath: SHARD_B,
      background: BEAM_B,
      filter: "blur(2px)",
      opacity: 0.68,
    },
    {
      width: "74%",
      height: "84%",
      right: "34%",
      top: "52%",
      transform: "rotate(-71deg)",
      clipPath: "polygon(0% 30%, 70% 0%, 100% 26%, 36% 100%, 0% 74%)",
      background:
        "linear-gradient(164deg, rgba(4,8,15,0) 28%, #081525 44%, #17417E 52%, #8FB8E5 54.5%, #14396E 62%, rgba(4,8,15,0) 82%)",
      filter: "blur(7px)",
      opacity: 0.42,
    },
    {
      width: "78%",
      height: "76%",
      left: "-18%",
      bottom: "-22%",
      transform: "rotate(18deg)",
      clipPath: "polygon(0% 26%, 64% 0%, 100% 34%, 40% 100%, 0% 72%)",
      background:
        "linear-gradient(168deg, rgba(4,8,15,0) 26%, #071324 44%, #123258 53%, #4E86D8 55.5%, #0F2C56 62%, rgba(4,8,15,0) 82%)",
      filter: "blur(6px)",
      opacity: 0.42,
    },
    FADE_SIDE,
    FADE_EDGES,
  ],
};

export default function Beams({ variant }: { variant: Variant }) {
  return (
    /* `.beams` is the hook for the scroll-linked depth in globals.css: the
       layer sinks behind a dark hero as it leaves and drifts through a dark
       band as it passes. It must stay a direct child of its <section>. */
    <div
      aria-hidden="true"
      className="beams pointer-events-none absolute inset-0 overflow-hidden"
    >
      {LAYERS[variant].map((layer, i) => (
        <div key={i} className="absolute" style={layer} />
      ))}
      {/* Phones: the text column spans the full width there, so the beams sit
          behind the copy instead of beside it. One veil keeps it readable. */}
      <div className="absolute inset-0 bg-night/40 sm:hidden" />
    </div>
  );
}
