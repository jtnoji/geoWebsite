import { delay } from "@/lib/reveal";
import { AGENTIC_SHARE, SEARCH_CLICKS, type TrendPoint, type TrendSeries } from "@/lib/stats";

/**
 * The search-shift chart: buying that an AI agent shaped climbing past the
 * clicks leaving Google. The white card on the right of the home "problem"
 * section.
 *
 * MADE STARKER 2026-09-18 (Josh: the graph "isn't extreme enough. It should
 * really demonstrate and exaggerate the shift to agentic search and
 * importnacei n sales"). Four levers, and every one of them is presentation:
 *
 * 1. The ceiling is 40, not 70, so the two series fill the box instead of
 *    sitting in its bottom half.
 * 2. The agentic series is a COBALT AREA, not an ink line. Filled mass reads
 *    as a takeover; a stroke of the same data reads as a statistic, and
 *    cobalt is the one bright note the system allows on a white ground.
 * 3. FORRESTER'S OWN 2027 projection is drawn again. It is the point that
 *    takes the agentic line ABOVE where the click line ends, which is the
 *    whole thesis in one image, and it is Forrester's number, not ours.
 * 4. The box is shorter (330 units, was 400), which steepens every slope and
 *    was needed anyway to fit the section on one screen.
 *
 * WHAT DID NOT CHANGE, AND MUST NOT: a value. Nothing here is re-based,
 * re-indexed, or extended past what a source published. Our own 2028 figures
 * stay out (`ours` in lib/stats.ts), so the starkest thing on the card is
 * still somebody else's published number. Exaggerate the READING of the data,
 * never the data. A chart that overstates its own evidence is the exact
 * failure this company sells an audit of.
 *
 * SERVER COMPONENT, and it has to stay one. It renders copy and numbers, so
 * the CLAUDE.md invariant applies: every value here must exist in the exported
 * HTML with JavaScript off, which is also how the engines we measure will read
 * it. That rules out a charting library, and we need none. The whole thing is
 * inline SVG built from `lib/stats.ts`, and the draw-in is CSS keyed off the
 * `.is-in` class ScrollReveal already toggles (see the chart block in
 * globals.css). No new dependency, no second observer, no client boundary.
 *
 * Every <text> below is real text in the raw HTML, not a path, so the numbers
 * are quotable by a crawler. The <desc> carries the same figures in sentences
 * for the same reason.
 */

/* Geometry is in viewBox units. Deliberately small (720 wide) so the SVG
   scales UP on desktop rather than down, which keeps the mobile scale factor
   survivable: type inside an SVG scales with the box, so a 1200-unit design
   would render 8px axis labels on a phone. */
/* h stops just under the year labels: the card's own padding is the margin. */
const VIEW = { w: 720, h: 330 };
/* `right` leaves room for the last year label to sit centred under its own
   tick without running off the viewBox. At phone type sizes that label is ~60
   units wide, so the margin has to be at least half of that. */
const PLOT = { left: 70, right: 660, top: 44, bottom: 280 };
/* 40, just over the highest value drawn (39.6). A taller ceiling leaves the
   top of the card empty and flattens both slopes. */
const Y_MAX = 40;
/* 2024 is the earliest measured point on either series and 2027 the latest
   drawn. The agentic line starts a year in, and the empty quarter at the left
   is the truthful shape of that: nobody was measuring it yet. */
const YEARS = [2024, 2025, 2026, 2027] as const;
const GRID = [0, 20, 40] as const;
/* Everything from here right is projected, and gets the tint. */
const PROJECTION_FROM = 2026;

const x = (year: number) =>
  PLOT.left +
  ((year - YEARS[0]) / (YEARS[YEARS.length - 1] - YEARS[0])) *
    (PLOT.right - PLOT.left);

const y = (value: number) =>
  PLOT.bottom - (value / Y_MAX) * (PLOT.bottom - PLOT.top);

type Pt = { x: number; y: number };

/**
 * Every point the chart is allowed to draw: the readings, plus a projection
 * the SOURCE published. `ours` is our own extrapolation and never renders.
 */
const drawn = (series: TrendSeries) => series.points.filter((p) => !p.ours);

/**
 * Monotone cubic tangents (Fritsch-Carlson). The curve is interpolation
 * between points, not extra data: this variant is limited so it can never
 * overshoot a point, which means the line never travels through a value the
 * source did not report. Every point still carries its own dot, so the reader
 * can see which parts of the stroke are readings and which are the curve
 * between them.
 */
const tangents = (pts: Pt[]) => {
  const dx: number[] = [];
  const slope: number[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    dx.push(pts[i + 1].x - pts[i].x);
    slope.push((pts[i + 1].y - pts[i].y) / dx[i]);
  }

  const m = [slope[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    if (slope[i - 1] * slope[i] <= 0) {
      m.push(0);
      continue;
    }
    const w1 = 2 * dx[i] + dx[i - 1];
    const w2 = dx[i] + 2 * dx[i - 1];
    m.push((w1 + w2) / (w1 / slope[i - 1] + w2 / slope[i]));
  }
  m.push(slope[slope.length - 1]);
  return m;
};

const n = (v: number) => v.toFixed(1);

/* Both strokes are cut out of ONE curve, so the tangent where the dash starts
   is shared and the projected half leaves exactly where the measured half
   arrives. */
const segment = (pts: Pt[], m: number[], from: number, to: number) => {
  let d = `M${n(pts[from].x)} ${n(pts[from].y)}`;
  for (let i = from; i < to; i++) {
    const c = (pts[i + 1].x - pts[i].x) / 3;
    d +=
      ` C${n(pts[i].x + c)} ${n(pts[i].y + m[i] * c)},` +
      ` ${n(pts[i + 1].x - c)} ${n(pts[i + 1].y - m[i + 1] * c)},` +
      ` ${n(pts[i + 1].x)} ${n(pts[i + 1].y)}`;
  }
  return d;
};

const curves = (points: TrendPoint[]) => {
  const pts = points.map((p) => ({ x: x(p.year), y: y(p.value) }));
  const m = tangents(pts);
  const firstProjected = points.findIndex((p) => p.projected);
  const cut = firstProjected === -1 ? pts.length - 1 : firstProjected - 1;
  return {
    measured: segment(pts, m, 0, cut),
    /** Empty when the series has no projection of its own to draw. */
    projected: cut === pts.length - 1 ? "" : segment(pts, m, cut, pts.length - 1),
    /* The fill runs under the whole curve, projection included: it sits
       inside the tinted zone there, under a stroke that is already dashed. */
    area:
      segment(pts, m, 0, pts.length - 1) +
      ` L${n(pts[pts.length - 1].x)} ${n(PLOT.bottom)}` +
      ` L${n(pts[0].x)} ${n(PLOT.bottom)} Z`,
  };
};

/* Type inside an SVG scales with the viewBox, so these sizes are in user
   units and have to be set per breakpoint against how wide the card's plot
   actually renders: ~310px on a phone (0.43 scale), ~500 to 620px while the
   section is one column (0.7 to 0.87), ~470px at lg where the card takes
   three fifths of the row (0.65), and ~740px at 1440 (1.03). Re-check these
   if the section's column split moves. */
const AXIS = "text-[23px] sm:text-[17px] xl:text-[15px]";
const VALUE = "text-[29px] sm:text-[22px] xl:text-[21px] font-semibold";
const STROKE = "[stroke-width:6] sm:[stroke-width:5] xl:[stroke-width:4]";

/* The rising series takes COBALT, the design system's bright note on light
   (CLAUDE.md: bars, dots and accents on a white ground), and the falling one
   stays slate, which is the same system's stepped-down tone for a quantity
   shown as less. Before this the rising series was ink and its wash was ink at
   10%, which read as the same grey as the 5% projection tint and left the
   climb with no visual weight at all. The value labels stay ink either way, so
   cobalt never has to carry text. */
const SERIES = [
  { series: AGENTIC_SHARE, swatch: "bg-cobalt" },
  { series: SEARCH_CLICKS, swatch: "bg-slate" },
] as const;

function Series({
  series,
  tone,
  drawDelay,
  labelAbove,
  area,
}: {
  series: TrendSeries;
  tone: "cobalt" | "slate";
  drawDelay: number;
  labelAbove: boolean;
  /** The rising series carries the fill. Two filled areas would be mud. */
  area?: boolean;
}) {
  const points = drawn(series);
  const { measured, projected, area: areaPath } = curves(points);
  const stroke = tone === "cobalt" ? "stroke-cobalt" : "stroke-slate";
  const fill = tone === "cobalt" ? "fill-cobalt" : "fill-slate";
  const first = points[0];
  const lastMeasured = points.filter((p) => !p.projected).slice(-1)[0];
  const end = points[points.length - 1];
  /* first, the last reading, and the projected end when there is one. A Set
     keeps the middle one from being labelled twice on a series with no
     projection. */
  const labelled = [...new Set([first, lastMeasured, end])];

  return (
    <g>
      {/* The wash goes on an inner path with `.chart-late` on the wrapper:
          that class sets opacity:1 from a more specific selector
          (globals.css), so an opacity utility on the SAME element silently
          loses and the area renders solid. */}
      {area ? (
        <g className="chart-late">
          <path d={areaPath} className={`${fill} opacity-[0.13]`} />
        </g>
      ) : null}
      <path
        d={measured}
        pathLength={100}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={delay(drawDelay)}
        className={`chart-line ${stroke} ${STROKE}`}
      />
      {projected ? (
        <path
          d={projected}
          fill="none"
          strokeLinecap="round"
          strokeDasharray="11 9"
          className={`chart-late ${stroke} ${STROKE} [stroke-opacity:0.55]`}
        />
      ) : null}
      <g className="chart-late">
        {points.map((p) => (
          <circle
            key={p.year}
            cx={x(p.year)}
            cy={y(p.value)}
            r={6}
            className={`${fill} stroke-white [stroke-width:2]`}
          />
        ))}
        {/* Every value sits ABOVE its point. Below is inside the fill on the
            rising series, where ink text on ink is unreadable, and on the
            falling series it lands where the two lines cross. Measured at
            1440: the agentic 19% clears the click line by ~77px, so the two
            2026 labels do not collide. Re-check that if a value moves. */}
        {labelled.map((p) => (
          <text
            key={p.year}
            x={x(p.year) + (p === first ? 12 : p === end ? -6 : 0)}
            y={y(p.value) + (p === first || labelAbove || p === end ? -18 : 34)}
            textAnchor={p === first ? "start" : p === end ? "end" : "middle"}
            className={`fill-ink ${VALUE}`}
          >
            {p.value}%
          </text>
        ))}
      </g>
    </g>
  );
}

export default function SearchShiftChart() {
  const zoneX = x(PROJECTION_FROM);

  return (
    <figure
      data-reveal="draw"
      style={delay(120)}
      className="depth-in min-w-0 rounded-[30px] border border-line bg-white px-5 pb-5 pt-6 shadow-float sm:px-8 sm:pb-7 sm:pt-8"
    >
      {/* Legend in HTML, not SVG: it carries the source links, and HTML type
          stays readable at any width while SVG type scales with the box. */}
      <figcaption>
        <ul className="flex flex-col gap-[7px]">
          {/* The swatch has its own column, so when a phone wraps the label
              and its source, both wrap under the label and the swatch stays
              beside the first line instead of sitting alone above it. */}
          {SERIES.map(({ series, swatch }) => (
            <li
              key={series.label}
              className="grid grid-cols-[30px_minmax(0,1fr)] gap-x-[11px]"
            >
              <span
                aria-hidden="true"
                className={`mt-[9px] h-1 w-[30px] rounded-sm ${swatch}`}
              />
              <span className="text-[14px] leading-[1.5] text-ink">
                {`${series.label} `}
                <a
                  href={series.url}
                  rel="noopener noreferrer"
                  className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint transition-colors hover:text-ink"
                >
                  {series.source}
                </a>
              </span>
            </li>
          ))}
        </ul>
      </figcaption>

      <svg
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        className="mt-4 w-full"
        role="img"
        aria-labelledby="shift-title shift-desc"
      >
        <title id="shift-title">
          Purchases influenced by AI agents climbing past Google searches that
          end in a click, 2024 to 2026, with Forrester&apos;s projection to 2027
        </title>
        <desc id="shift-desc">
          {AGENTIC_SHARE.summary} {SEARCH_CLICKS.summary}
        </desc>

        {/* Everything right of here is projected, not measured. A wash of the
            ink already in the palette, so "this part is not data" is carried
            by tone rather than by another colour. */}
        <rect
          x={zoneX}
          y={PLOT.top - 20}
          width={PLOT.right - zoneX + 14}
          height={PLOT.bottom - PLOT.top + 20}
          className="fill-ink opacity-[0.05]"
        />
        <text
          x={PLOT.right + 12}
          y={PLOT.top - 28}
          textAnchor="end"
          className={`fill-ink-faint ${AXIS} uppercase tracking-[0.16em]`}
        >
          projected
        </text>

        {GRID.map((g) => (
          <g key={g}>
            <line
              x1={PLOT.left}
              x2={PLOT.right + 12}
              y1={y(g)}
              y2={y(g)}
              className="stroke-line-dark [stroke-width:1]"
            />
            <text
              x={PLOT.left - 14}
              y={y(g) + 5}
              textAnchor="end"
              className={`fill-ink-faint ${AXIS}`}
            >
              {g}%
            </text>
          </g>
        ))}

        {YEARS.map((year) => (
          <text
            key={year}
            x={x(year)}
            y={PLOT.bottom + 36}
            textAnchor="middle"
            className={`fill-ink-soft ${AXIS}`}
          >
            {year}
          </text>
        ))}

        {/* The rising series is drawn second so its fill and stroke sit over
            the falling one where they cross. */}
        <Series series={SEARCH_CLICKS} tone="slate" drawDelay={260} labelAbove />
        <Series series={AGENTIC_SHARE} tone="cobalt" drawDelay={0} labelAbove area />
      </svg>

      {/* The caveats ship WITH the chart, not in a link or a tooltip. A
          company that audits other people's evidence does not get to hide the
          methodology break in its own. These are the last thing to cut. */}
      <p className="mt-3 border-t border-line pt-3 text-[11.5px] leading-[1.5] text-ink-faint">
        {AGENTIC_SHARE.caveat} {SEARCH_CLICKS.caveat}
      </p>
    </figure>
  );
}
