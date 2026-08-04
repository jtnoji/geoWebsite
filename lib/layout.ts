/**
 * The page grid. One container, one vertical rhythm, used by every section on
 * every route.
 *
 * WHY THIS FILE EXISTS (2026-08-03). The home page had drifted to FIVE content
 * widths and six left edges: 1280 (the chart), 1180 (ten sections), 1120 (four
 * sections), 1000 (the answer card) and 920 (the hero), so the left margin
 * jumped between 80px and 260px as you scrolled. Vertical padding was equally
 * scattered across 24 / 56 / 80 / 96 / 104px. Every individual section was
 * fine and the page still read as unstructured, because the eye tracks the
 * left edge and that edge never held still.
 *
 * 1120 is not a new number: /pricing, /how-it-works, /about, /sample-report,
 * /our-score, the header, the footer and the mobile nav were all already on
 * it. The home page was the outlier, so this is the rest of the site's grid
 * written down rather than a redesign.
 *
 * Import these. Do not retype the classes at a call site, and do not invent a
 * width for one section: a section that needs to be wider than the measure is
 * a full-bleed band (a background colour on the <section>, this container
 * inside it), which is the one sanctioned way out.
 */

/** The content column. Every section's inner wrapper starts with this. */
export const SECTION_X = "mx-auto max-w-[1120px] px-5 sm:px-8";

/**
 * Standard vertical rhythm: 64px on phones, 80px from md up. Adjacent
 * sections each contribute their own, so the gap between two blocks of
 * content is double this.
 *
 * It is deliberately one step tighter than the 96px that most home sections
 * used to carry. The page is long (about 17 viewports) and the padding was
 * paying for length without buying separation that the hairline rules and the
 * navy bands were not already providing.
 */
export const SECTION_Y = "py-16 md:py-20";

/** Both, which is what almost every call site wants. */
export const SECTION = `${SECTION_X} ${SECTION_Y}`;
