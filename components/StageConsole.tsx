import FoldReadout from "./FoldReadout";
import RoadmapPanel from "./RoadmapPanel";
import SamplingCard from "./SamplingCard";
import ShareOfVoice from "./ShareOfVoice";
import { CAPABILITIES } from "@/lib/home";
import { SAMPLE_LABEL, SAMPLE_ROWS } from "@/lib/sample";

/**
 * Measure, diagnose, improve, track: one panel that advances itself, instead
 * of four sections with the same shape.
 *
 * WHY IT REPLACED FOUR SECTIONS. Each stage had a heading, a paragraph and a
 * card, so the page said "here is another thing we do" four times in the same
 * voice and the same composition. As one console the four are a sequence a
 * reader watches, the rail shows where they are in it, and three paragraphs of
 * copy stop being necessary because the artifact swapping IS the explanation.
 *
 * SERVER COMPONENT, pure CSS, no JavaScript. All four stages and all four
 * artifacts are in the exported HTML at once, which is what lets a crawler
 * read the whole sequence while a human sees it play. See the stage-console
 * block in globals.css.
 *
 * `--stage-min` holds the panel's height so the page below it does not jump
 * every five seconds as stages of different heights swap.
 */

const STAGE_SECONDS = 5.5;

/* Fail closed: the keyframe stops in globals.css cut the loop into quarters.
   A fifth capability added to lib/home.ts without recutting them would leave
   the rail and the artifacts running on different clocks. */
const EXPECTED_STAGES = 4;
if (CAPABILITIES.length !== EXPECTED_STAGES) {
  throw new Error(
    `StageConsole: CAPABILITIES has ${CAPABILITIES.length} entries, but the ` +
      `stage-item / stage-tab / stage-fill keyframes in app/globals.css are ` +
      `cut into ${EXPECTED_STAGES}ths. Recut the stops (100/n) and update ` +
      `EXPECTED_STAGES together.`
  );
}

const CYCLE = CAPABILITIES.length * STAGE_SECONDS;

const artifact = (key: string) => {
  if (key === "measure") return <FoldReadout />;
  if (key === "diagnose") return <ShareOfVoice />;
  if (key === "improve") return <RoadmapPanel />;
  return (
    <SamplingCard
      title="mention rate by engine · sample"
      meta="10 runs/engine"
      rows={SAMPLE_ROWS}
      footer={SAMPLE_LABEL}
    />
  );
};

export default function StageConsole() {
  const vars = (i: number) =>
    ({
      "--stage-cycle": `${CYCLE.toFixed(2)}s`,
      "--stage-start": `${(i * STAGE_SECONDS).toFixed(2)}s`,
    }) as React.CSSProperties;

  return (
    <div className="rounded-[var(--r-panel)] border border-white/12 bg-[#0a1a30] p-4 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.65)] sm:p-6">
      {/* The rail. Four numbered stops, the live one at full strength and the
          rest dimmed, each with a bar that fills across its own slot. */}
      <ol className="grid gap-3 sm:grid-cols-4">
        {CAPABILITIES.map((cap, i) => (
          <li key={cap.key} className="stage-tab min-w-0" style={vars(i)}>
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-[11px] font-semibold text-sky">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="truncate font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                {cap.eyebrow}
              </span>
            </div>
            <span
              aria-hidden="true"
              className="mt-2.5 block h-[2px] w-full bg-white/15"
            >
              <span
                className="stage-fill block h-full bg-sky"
                style={vars(i)}
              />
            </span>
          </li>
        ))}
      </ol>

      {/* One cell, four artifacts. Each stage's headline rides with its own
          artifact so the copy changes with the picture. */}
      <div className="stage-panel mt-7 grid">
        {CAPABILITIES.map((cap, i) => (
          <div
            key={cap.key}
            className="stage-item col-start-1 row-start-1 min-w-0"
            style={vars(i)}
          >
            <div className="grid items-start gap-6 md:grid-cols-[minmax(0,4fr)_minmax(0,5fr)] md:gap-10">
              <div className="min-w-0">
                <h3 className="display text-[clamp(22px,2.4vw,30px)] leading-[1.15] text-white text-pretty">
                  {cap.heading}
                </h3>
                <p className="mt-3.5 text-[14.5px] leading-[1.65] text-white/70">
                  {cap.body}
                </p>
              </div>
              <div className="min-w-0">{artifact(cap.key)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
