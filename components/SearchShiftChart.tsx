import RuleEyebrow from "./RuleEyebrow";
import { SEARCH_SHIFT_COPY } from "@/lib/home";
import { delay } from "@/lib/reveal";
import {
  AGENTIC_SHARE,
  SEARCH_CLICKS,
  TREND_NOW,
  type TrendSeries,
} from "@/lib/stats";

/**
 * The search-shift chart: buying that an AI agent shaped rising against clicks
 * leaving Google, with a dashed present line and a labelled projection past it.
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
 * are quotable by a crawler. The prose summary under the chart carries the
 * same figures in sentences for the same reason.
 */

/* Geometry is in viewBox units. Deliberately small (720 wide) so the SVG
   scales UP on desktop rather than down, which keeps the mobile scale factor
   survivable: type inside an SVG scales with the box, so a 1200-unit design
   would render 8px axis labels on a phone. Font sizes below are still
   responsive in user units for the same reason. */
const VIEW = { w: 720, h: 440 };
/* `right` leaves room for the 2028 label to sit centred under its own tick
   without running off the viewBox. At mobile type sizes that label is ~50
   units wide, so the margin has to be at least half of that. */
const PLOT = { left: 70, right: 660, top: 48, bottom: 344 };
const Y_MAX = 70;
/* The window starts at 2024 because that is the earliest measured point on
   either series. The agentic line begins a year later, and the empty quarter
   at the left is the truthful shape of that: nobody was measuring it yet. */
const YEARS = [2024, 2025, 2026, 2027, 2028] as const;
const GRID = [0, 20, 40, 60] as const;

const x = (year: number) =>
  PLOT.left +
  ((year - YEARS[0]) / (YEARS[YEARS.length - 1] - YEARS[0])) *
    (PLOT.right - PLOT.left);

const y = (value: number) =>
  PLOT.bottom - (value / Y_MAX) * (PLOT.bottom - PLOT.top);

type Pt = { x: number; y: number };

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

/* Both strokes are cut out of ONE curve, so the tangent at the present line is
   shared and the dashed half leaves exactly where the solid half arrives. */
const paths = (series: TrendSeries) => {
  const pts = series.points.map((p) => ({ x: x(p.year), y: y(p.value) }));
  const m = tangents(pts);
  const firstProjected = series.points.findIndex((p) => p.projected);
  const cut = firstProjected === -1 ? pts.length - 1 : firstProjected - 1;
  return {
    measured: segment(pts, m, 0, cut),
    projected: segment(pts, m, cut, pts.length - 1),
  };
};

/* Type inside an SVG scales with the viewBox, so these sizes are in user
   units and have to be set per breakpoint against how wide the box actually
   renders: ~350px on a phone (0.49 scale), ~880px on a tablet where the
   section is still one column (1.2), ~740px once it splits into two columns at
   lg (1.03). One fixed size cannot serve all three. Re-check these if the
   column split moves. */
const AXIS = "text-[22px] sm:text-[15px] lg:text-[13.5px]";
const VALUE = "text-[24px] sm:text-[16px] lg:text-[15px] font-medium";
const STROKE = "[stroke-width:5.5] sm:[stroke-width:4] lg:[stroke-width:3.4]";

function Series({
  series,
  tone,
  drawDelay,
  labelAbove,
}: {
  series: TrendSeries;
  tone: "ink" | "soft";
  drawDelay: number;
  labelAbove: boolean;
}) {
  const { measured: measuredPath, projected: projectedPath } = paths(series);
  const measured = series.points.filter((p) => !p.projected);
  const stroke = tone === "ink" ? "stroke-ink" : "stroke-ink-soft";
  const fill = tone === "ink" ? "fill-ink" : "fill-ink-soft";
  const first = measured[0];
  const last = measured[measured.length - 1];

  return (
    <g>
      <path
        d={measuredPath}
        pathLength={100}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={delay(drawDelay)}
        className={`chart-line ${stroke} ${STROKE}`}
      />
      <path
        d={projectedPath}
        fill="none"
        strokeLinecap="round"
        strokeDasharray="7 9"
        className={`chart-late ${stroke} ${STROKE} [stroke-opacity:0.5]`}
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
            closing value follows the series' own side. */}
        {[first, last].map((p) => (
          <text
            key={p.year}
            x={x(p.year) + (p === first ? 12 : 0)}
            y={y(p.value) + (p === first || labelAbove ? -18 : 34)}
            textAnchor={p === first ? "start" : "middle"}
            className={`${fill} ${VALUE}`}
          >
            {p.value}%
          </text>
        ))}
      </g>
    </g>
  );
}

export default function SearchShiftChart() {
  const nowX = x(TREND_NOW);

  return (
    <section className="border-b border-line">
      <div className="mx-auto flex min-h-[calc(100svh-126px)] max-w-[1280px] flex-col justify-center px-5 py-14 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[4fr_7fr] lg:gap-14">
          <div data-reveal>
            <RuleEyebrow>{SEARCH_SHIFT_COPY.eyebrow}</RuleEyebrow>
            <h2 className="display mt-4 max-w-[560px] text-[clamp(29px,3.6vw,46px)] leading-[1.1] text-ink text-pretty">
              {SEARCH_SHIFT_COPY.heading}
            </h2>
            <p className="mt-5 max-w-[480px] text-[15.5px] leading-[1.7] text-ink-soft">
              {SEARCH_SHIFT_COPY.body[0]}
            </p>
            <p className="mt-4 max-w-[480px] text-[15.5px] leading-[1.7] text-ink-soft">
              {SEARCH_SHIFT_COPY.body[1]}
            </p>
          </div>

          {/* No card. The chart sits directly on the paper ground: it is the
              section's signature element, so a white panel around it would
              read as a mockup pasted onto the page rather than as the page's
              own evidence. Losing the white fill costs the projection zone its
              contrast, so that tint is now an ink wash (below) instead of
              paper-dim, which would vanish against a paper-dim ground. */}
          <figure data-reveal="draw" style={delay(120)}>
            {/* Legend in HTML, not SVG: it carries the source links, and HTML
                type stays readable at any width while SVG type scales with
                the box. */}
            <figcaption className="flex flex-wrap gap-x-7 gap-y-2">
              {[AGENTIC_SHARE, SEARCH_CLICKS].map((series, i) => (
                <span key={series.label} className="flex items-baseline gap-2.5">
                  <span
                    aria-hidden="true"
                    className={`mt-[7px] h-[3px] w-6 shrink-0 ${
                      i === 0 ? "bg-ink" : "bg-ink-soft"
                    }`}
                  />
                  <span className="text-[13.5px] leading-[1.5] text-ink">
                    {series.label}{" "}
                    <a
                      href={series.url}
                      rel="noopener noreferrer"
                      className="whitespace-nowrap font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-faint hover:text-ink"
                    >
                      {series.source}
                    </a>
                  </span>
                </span>
              ))}
            </figcaption>

            <svg
              viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
              className="mt-3 w-full"
              role="img"
              aria-labelledby="shift-title shift-desc"
            >
            <title id="shift-title">
              Purchases influenced by AI agents rising while Google searches
              that end in a click fall, 2024 to 2026, with a projection to 2028
            </title>
            <desc id="shift-desc">
              {AGENTIC_SHARE.summary} {SEARCH_CLICKS.summary}
            </desc>

            {/* Everything right of the present line is drawn, not measured.
                A wash of the ink already in the palette, so "this part is not
                data" is carried by tone rather than by a colour this palette
                does not have. */}
            <rect
              x={nowX}
              y={PLOT.top - 22}
              width={PLOT.right - nowX + 14}
              height={PLOT.bottom - PLOT.top + 22}
              className="fill-ink opacity-[0.045]"
            />

            {GRID.map((g) => (
              <g key={g}>
                <line
                  x1={PLOT.left}
                  x2={PLOT.right + 12}
                  y1={y(g)}
                  y2={y(g)}
                  className="stroke-line [stroke-width:1]"
                />
                <text
                  x={PLOT.left - 14}
                  y={y(g) + 4}
                  textAnchor="end"
                  className={`fill-ink-faint ${AXIS} font-mono`}
                >
                  {g}%
                </text>
              </g>
            ))}

            <line
              x1={nowX}
              x2={nowX}
              y1={PLOT.top - 22}
              y2={PLOT.bottom}
              strokeDasharray="5 7"
              className="stroke-line-dark [stroke-width:1.5]"
            />
            <text
              x={nowX - 12}
              y={PLOT.top - 26}
              textAnchor="end"
              className={`fill-ink-faint ${AXIS} font-mono uppercase tracking-[0.16em]`}
            >
              now
            </text>
            <text
              x={(nowX + PLOT.right) / 2}
              y={PLOT.top - 26}
              textAnchor="middle"
              className={`fill-ink-faint ${AXIS} font-mono uppercase tracking-[0.16em]`}
            >
              projection
            </text>

            {YEARS.map((year) => (
              <text
                key={year}
                x={x(year)}
                y={PLOT.bottom + 34}
                textAnchor="middle"
                className={`fill-ink-faint ${AXIS} font-mono`}
              >
                {year}
              </text>
            ))}

              {/* The two closing values sit at the same x, so they take the
                  side their own line is on: the agentic series is still the
                  lower of the two in 2026 and only crosses inside the
                  projection. Flip both together if the measured points ever
                  cross before the present line. */}
              <Series
                series={AGENTIC_SHARE}
                tone="ink"
                drawDelay={0}
                labelAbove={false}
              />
              <Series
                series={SEARCH_CLICKS}
                tone="soft"
                drawDelay={260}
                labelAbove
              />
            </svg>

            {/* The caveats ship WITH the chart, not in a link or a tooltip.
                A company that audits other people's evidence does not get to
                hide the methodology break in its own. */}
            <p className="mt-3 border-t border-line pt-3 text-[11.5px] leading-[1.55] text-ink-faint">
              {SEARCH_SHIFT_COPY.projectionNote} {AGENTIC_SHARE.caveat}{" "}
              {SEARCH_CLICKS.caveat}
            </p>
          </figure>
        </div>
      </div>
    </section>
  );
}
