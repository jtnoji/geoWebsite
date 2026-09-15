/**
 * The page grid. One gutter, one vertical rhythm, used by every section on
 * every route.
 *
 * WHY THIS FILE EXISTS (2026-08-03). The home page had drifted to FIVE content
 * widths and six left edges, so the left margin jumped as you scrolled. Every
 * individual section was fine and the page still read as unstructured, because
 * the eye tracks the left edge and that edge never held still.
 *
 * FULL WIDTH SINCE 2026-09-14 (Josh: "make sure it fills the entire width of
 * the page when fullscreen"). The Sable redesign first capped every section at
 * its 1440px track, which on a 1728px laptop screen boxed the content into the
 * middle 80% of the page. There is no max-width container now: every section
 * runs gutter to gutter at every width, the gutter widens on large screens,
 * and headings keep scaling with the viewport past 1440 so the composition
 * holds instead of thinning out. At 1440 and below nothing changed.
 *
 * What still has a measure is reading copy, set in `ch`: a line stays legible
 * to roughly 75 characters however wide the screen is, so a paragraph is never
 * stretched to fill a row. Width is filled by the grid instead: from 1600px up
 * a text-only head splits into its heading on the left and its copy on the
 * right (`HEAD_SPLIT`), and lists become grids.
 *
 * Import these. Do not retype the classes at a call site.
 */

/** Side padding: 20px on phones, the design's 32px from sm, wider on large screens. */
export const GUTTER = "px-5 sm:px-8 wide:px-12 ultra:px-16";

/** The content column: the whole width of the page, inside the gutter. */
export const SECTION_X = `w-full ${GUTTER}`;

/** Standard vertical rhythm: 64px on phones, the design's 100px from md up. */
export const SECTION_Y = "py-16 md:py-[100px]";

/** Both, which is what almost every call site wants. */
export const SECTION = `${SECTION_X} ${SECTION_Y}`;

/**
 * A text-only head (a heading and its copy) that stacks below 1600px and
 * splits across the page from there up: heading left, copy right,
 * bottom-aligned. Children space themselves with this grid's gap rather than
 * margins, so the stacked and the split layouts share one markup.
 */
export const HEAD_SPLIT =
  "grid gap-y-5 wide:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] wide:items-end wide:gap-x-24";
