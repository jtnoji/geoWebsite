import type { ReactNode } from "react";
import StageAutoplay from "./StageAutoplay";
import { delay } from "@/lib/reveal";

export type Stage = {
  label: string;
  title: string;
  body: string;
  /** The artifact beside the copy: what this stage produces (ConsoleCards). */
  card: ReactNode;
};

/**
 * The /how-it-works console (mockup/sable-site.dc.html): four stage tabs over
 * a title and a paragraph, beside the card for that stage.
 *
 * NO JAVASCRIPT NEEDED. Each tab is a <label> for a visually hidden radio
 * input, and the `.stage-*` rules in globals.css show the copy and the card
 * whose input is checked. So this is a server component, every stage's copy
 * and card is in the exported HTML with JavaScript off, and the tabs are
 * keyboard-operable as a radio group for free: Tab reaches the group and the
 * arrow keys move between stages.
 *
 * AUTOPLAY ON TOP (Josh, 2026-09-14). With script, StageAutoplay fills the
 * checked tab's bar and moves to the next stage when the bar is full, until the
 * reader picks a stage. It renders nothing and only ever sets `checked`, so
 * everything above still holds. The timing is `--stage-dwell` in globals.css.
 *
 * ONE CARD PER STAGE (Josh, 2026-09-14). The design drew one scorecard beside
 * every stage; each stage now shows its own artifact (ConsoleCards), so the
 * card always shows what the stage says. The copy and the cards are two stacks
 * that switch together.
 */

/* Fail closed: the selectors in globals.css are written out for four stages. */
const EXPECTED_STAGES = 4;

/* One console per page, so one id. StageAutoplay finds the console by it. */
const CONSOLE_ID = "stage-console";

export default function StageTabs({ stages }: { stages: readonly Stage[] }) {
  if (stages.length !== EXPECTED_STAGES) {
    throw new Error(
      `StageTabs: got ${stages.length} stages, but the .stage-* selectors in ` +
        `app/globals.css are written for ${EXPECTED_STAGES}. Change both together.`
    );
  }

  return (
    /* Frosted night glass rather than the design's 5% white: the page hero's
       beams run behind the console, and without the blur one crossed the
       fourth tab's label.

       The console carries its own reveal and `depth-in` rather than a
       wrapper's: opacity or a filter on an ANCESTOR of this backdrop blur
       would flatten it (globals.css, "Scroll depth"). */
    <div
      id={CONSOLE_ID}
      data-reveal="fade"
      style={delay(120)}
      className="stages depth-in relative overflow-hidden rounded-[18px] border border-white/12 bg-night/55 backdrop-blur-[14px]"
    >
      {stages.map((stage, i) => (
        <input
          key={stage.label}
          type="radio"
          name="stage"
          id={`stage-${i + 1}`}
          defaultChecked={i === 0}
          className="stage-input sr-only"
        />
      ))}

      <div className="grid grid-cols-2 md:grid-cols-4">
        {stages.map((stage, i) => (
          <label
            key={stage.label}
            htmlFor={`stage-${i + 1}`}
            className="stage-tab px-4 py-5 font-mono text-[12px] uppercase tracking-[0.14em] sm:px-[22px]"
          >
            <span className="mr-2 opacity-55">{String(i + 1).padStart(2, "0")}</span>
            {stage.label}
            {/* The bar: full under the checked tab, filling while autoplay runs
                (globals.css, "Stage tabs"). */}
            <span aria-hidden="true" className="stage-fill" />
          </label>
        ))}
      </div>

      <div className="grid items-start gap-10 p-6 sm:p-10 lg:grid-cols-2 wide:gap-24 wide:p-14">
        <div className="stage-stack min-w-0">
          {stages.map((stage) => (
            <div key={stage.label} className="stage-slot">
              <h2 className="display text-[clamp(26px,2.8vw,54px)] leading-[1.15] text-white text-pretty">
                {stage.title}
              </h2>
              <p className="mt-[18px] max-w-[46ch] text-[clamp(16px,1.111vw,20px)] leading-[1.7] text-white/82">
                {stage.body}
              </p>
            </div>
          ))}
        </div>

        <div className="stage-stack min-w-0">
          {stages.map((stage) => (
            <div key={stage.label} className="stage-slot">
              {stage.card}
            </div>
          ))}
        </div>
      </div>

      <StageAutoplay consoleId={CONSOLE_ID} />
    </div>
  );
}
