/**
 * The page grid. One container, one vertical rhythm, used by every section on
 * every route.
 *
 * WHY THIS FILE EXISTS (2026-08-03). The home page had drifted to FIVE content
 * widths and six left edges, so the left margin jumped as you scrolled. Every
 * individual section was fine and the page still read as unstructured, because
 * the eye tracks the left edge and that edge never held still.
 *
 * WIDENED 2026-09-14 for the Sable redesign (mockup/sable-site.dc.html), which
 * draws every section on a 1440px track with 32px gutters and 100px of
 * vertical padding. The old 1120 measure and the 1400 wide track collapsed
 * into that one width.
 *
 * Import these. Do not retype the classes at a call site, and do not invent a
 * width for one section: a section that needs to feel wider is a full-bleed
 * band (a background on the <section>, this container inside it), which is
 * the one sanctioned way out.
 */

/** The content column. Every section's inner wrapper starts with this. */
export const SECTION_X = "mx-auto w-full max-w-[1440px] px-5 sm:px-8";

/** Standard vertical rhythm: 64px on phones, the design's 100px from md up. */
export const SECTION_Y = "py-16 md:py-[100px]";

/** Both, which is what almost every call site wants. */
export const SECTION = `${SECTION_X} ${SECTION_Y}`;

/**
 * The reading track, for a block whose content is a table or a column of text
 * that would sprawl at 1440 (the home comparison table). A SECOND value, not a
 * free-for-all: a section is at the track or at the reading track.
 */
export const SECTION_NARROW = "mx-auto w-full max-w-[1100px] px-5 sm:px-8";
