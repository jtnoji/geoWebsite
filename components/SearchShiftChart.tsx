import { delay } from "@/lib/reveal";
import { AGENTIC_SHARE, SEARCH_CLICKS, type TrendSeries } from "@/lib/stats";

/**
 * The search-shift chart: buying that an AI agent shaped rising against clicks
 * leaving Google. The white card on the right of the home "problem" section.
 *
 * STRIPPED 2026-09-17 (Josh: "Also woudl be good to simplify the grahp. The
 * graph has too much text, strip it down to just the bare minimum"). What went:
 * the projection zone, the dashed projected strokes, the present line, the
 * "now" and "projection" markers, the 2027 and 2028 ticks, the chart's own
 * eyebrow, and the projection note. That was most of the card's text, and it
 * also takes our own 2028 extrapolation off the page. The points still exist
 * in lib/stats.ts behind their `projected` flag, which is what MEASURED below
 * filters on, so this is reversible.
 *
 * What stays, and is not negotiable: the two source links and the two
 * methodology caveats. "A chart is a measurement artifact" in CLAUDE.md puts
 * caveats NEXT to the chart rather than behind a link, because a company that
 * audits other people's evidence does not get to hide the break in its own.
 * Strip anything else before these.
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
const VIEW = { w: 720, h: 400 };
/* `right` leaves room for the last year label to sit centred under its own
   tick without running off the viewBox. At phone type sizes that label is ~60
   units wide, so the margin has to be at least half of that. */
const PLOT = { left: 70, right: 660, top: 48, bottom: 344 };
/* 45, not 70: with the projections gone the highest value drawn is 39.6, and a
   70 ceiling left the top third of the card empty. */
const Y_MAX = 45;
/* The window starts at 2024 because that is the earliest measured point on
   either series, and ends at 2026 because that is the latest. The agentic line
   begins a year later, and the empty quarter at the left is the truthful shape
   of that: nobody was measuring it yet. */
const YEARS = [2024, 2025, 2026] as const;
const GRID = [0, 20, 40] as const;

const x = (year: number) =>
  PLOT.left +
  ((year - YEARS[0]) / (YEARS[YEARS.length - 1] - YEARS[0])) *
    (PLOT.right - PLOT.left);

const y = (value: number) =>
  PLOT.bottom - (value / Y_MAX) * (PLOT.bottom - PLOT.top);

type Pt = { x: number; y: number };

/** Only the readings are drawn. See the note at the top of the file. */
const MEASURED = (series: TrendSeries) => series.points.filter((p) => !p.projected);

/**
 * Monotone cubic tangents (Fritsch-Carlson). The curve is interpolation
 * between measured points, not extra data: this variant is limited so it can
 * never overshoot a point, which means the line never travels through a value
 * neither source reported. Every measured point still carries its own dot, so
 * the reader can see which parts of the stroke are readings and which are the
 * curve between them.
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

const line = (pts: Pt[]) => {
  const m = tangents(pts);
  let d = `M${n(pts[0].x)} ${n(pts[0].y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const c = (pts[i + 1].x - pts[i].x) / 3;
    d +=
      ` C${n(pts[i].x + c)} ${n(pts[i].y + m[i] * c)},` +
      ` ${n(pts[i + 1].x - c)} ${n(pts[i + 1].y - m[i + 1] * c)},` +
      ` ${n(pts[i + 1].x)} ${n(pts[i + 1].y)}`;
  }
  return d;
};

/* Type inside an SVG scales with the viewBox, so these sizes are in user
   units and have to be set per breakpoint against how wide the card's plot
   actually renders: ~310px on a phone (0.43 scale), ~500 to 620px while the
   section is one column (0.7 to 0.87), ~570px at lg where the card takes two
   thirds of the row (0.79), and ~890px at 1440 (1.24). Re-check these if the
   section's column split moves. */
const AXIS = "text-[23px] sm:text-[16px] xl:text-[14px]";
const VALUE = "text-[28px] sm:text-[20px] xl:text-[19px] font-semibold";
const STROKE = "[stroke-width:6] sm:[stroke-width:4.5] xl:[stroke-width:3.5]";

const SERIES = [
  { series: AGENTIC_SHARE, swatch: "bg-ink" },
  { series: SEARCH_CLICKS, swatch: "bg-slate" },
] as const;

function Series({
  series,
  tone,
  drawDelay,
  labelAbove,
}: {
  series: TrendSeries;
  tone: "ink" | "slate";
  drawDelay: number;
  labelAbove: boolean;
}) {
  const measured = MEASURED(series);
  const stroke = tone === "ink" ? "stroke-ink" : "stroke-slate";
  const fill = tone === "ink" ? "fill-ink" : "fill-slate";
  const first = measured[0];
  const last = measured[measured.length - 1];

  return (
    <g>
      <path
        d={line(measured.map((p) => ({ x: x(p.year), y: y(p.value) })))}
        pathLength={100}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={delay(drawDelay)}
        className={`chart-line ${stroke} ${STROKE}`}
      />
      <g className="chart-late">
        {measured.map((p) => (
          <circle
            key={p.year}
            cx={x(p.year)}
            cy={y(p.value)}
            r={6}
            className={`${fill} stroke-white [stroke-width:2]`}
          />
        ))}
        {/* The opening value always sits above its point: at the left edge
            there is nothing above either line, while below the falling
            series' first point is exactly where the two lines cross. Only the
            closing value follows the series' own side. Values are always ink,
            whichever line they label. */}
        {[first, last].map((p) => (
          <text
            key={p.year}
            x={x(p.year) + (p === first ? 12 : 0)}
            y={y(p.value) + (p === first || labelAbove ? -18 : 36)}
            textAnchor={p === first ? "start" : "middle"}
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
  return (
    <figure
      data-reveal="draw"
      style={delay(120)}
      className="depth-in min-w-0 rounded-[30px] border border-line bg-white px-5 pb-6 pt-7 shadow-float sm:px-10 sm:pb-9 sm:pt-10"
    >
      {/* Legend in HTML, not SVG: it carries the source links, and HTML type
          stays readable at any width while SVG type scales with the box. */}
      <figcaption>
        <ul className="flex flex-col gap-[9px]">
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
              <span className="text-[14.5px] leading-[1.5] text-ink">
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
        className="mt-5 w-full"
        role="img"
        aria-labelledby="shift-title shift-desc"
      >
        <title id="shift-title">
          Purchases influenced by AI agents rising while Google searches that
          end in a click fall, 2024 to 2026
        </title>
        <desc id="shift-desc">
          {AGENTIC_SHARE.summary} {SEARCH_CLICKS.summary}
        </desc>

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
            y={PLOT.bottom + 38}
            textAnchor="middle"
            className={`fill-ink-soft ${AXIS}`}
          >
            {year}
          </text>
        ))}

        {/* The two closing values sit at the same x, so they take the side
            their own line is on: the agentic series is the lower of the two
            throughout the measured window. Flip both together if the measured
            points ever cross. */}
        <Series series={AGENTIC_SHARE} tone="ink" drawDelay={0} labelAbove={false} />
        <Series series={SEARCH_CLICKS} tone="slate" drawDelay={260} labelAbove />
      </svg>

      {/* The caveats ship WITH the chart, not in a link or a tooltip. A
          company that audits other people's evidence does not get to hide the
          methodology break in its own. These are the last thing to cut. */}
      <p className="mt-4 border-t border-line pt-3 text-[11.5px] leading-[1.55] text-ink-faint">
        {AGENTIC_SHARE.caveat} {SEARCH_CLICKS.caveat}
      </p>
    </figure>
  );
}
