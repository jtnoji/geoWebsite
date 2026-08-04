import RuleEyebrow from "./RuleEyebrow";
import { PROMPT_DEMO } from "@/lib/home";
import { delay } from "@/lib/reveal";
import { SECTION } from "@/lib/layout";

/**
 * A mock AI prompt bar. It types out a question, erases it, and types the
 * next one, through six of them. The home page's opening beat: the fold asks
 * whether AI says your name, and this is the moment where it would.
 *
 * It briefly typed only the first question and crossfaded the rest (Josh tried
 * both on 2026-08-03 and kept the typing). It also used to hold "what is the
 * best" fixed while only the category swapped, which made every question the
 * same shape; each entry is now a whole question, so the openings vary.
 *
 * SERVER COMPONENT, and it has to stay one. It renders copy, so the CLAUDE.md
 * invariant applies: every question must exist in the exported HTML with
 * JavaScript off. That rules out the usual typewriter libraries, and we need
 * none. All six are real text in the raw bytes and the animation is pure CSS
 * (see the prompt-bar block in globals.css), so a crawler reads the whole set
 * and a human sees them in rotation.
 *
 * That also means the cycle is fixed rather than random: CSS has no source of
 * randomness, and shuffling would cost a client boundary on the site's first
 * section below the fold. Not worth it.
 *
 * THE MOTION BUDGET. The design system ships two motions and says a third
 * needs a reason. This is the third, and the reason is that the section's
 * subject IS the asking: a static bar is a screenshot of an input box, which
 * says nothing the surrounding copy does not already say. It is
 * reduced-motion safe (globals.css freezes it on the first question, fully
 * typed) and costs no JavaScript.
 */

/** Seconds per question: type, hold, erase. Must match the keyframe stops,
    which cut this slot at 37.5% and 80%. At six questions that is roughly
    2.1s typing, 2.3s holding (the caret blinks through it) and 1.1s
    erasing. */
const SLOT_SECONDS = 5.5;

/* Fail closed. The keyframe stops in globals.css encode the question count (a
   slot is 1/n of the loop), so a seventh added here without recutting them
   would silently desynchronise every cover. Break the build instead: same
   posture as harden-export.mjs, where a control that fails open is worse than
   no control. */
const EXPECTED_QUESTIONS = 6;
if (PROMPT_DEMO.questions.length !== EXPECTED_QUESTIONS) {
  throw new Error(
    `PromptBar: PROMPT_DEMO.questions has ${PROMPT_DEMO.questions.length} ` +
      `entries, but the prompt-type keyframes in app/globals.css are cut ` +
      `into ${EXPECTED_QUESTIONS}ths. Recut the stops (100/n for the slot, ` +
      `then 37.5% and 75% of that) and update EXPECTED_QUESTIONS together.`
  );
}

const CYCLE_SECONDS = PROMPT_DEMO.questions.length * SLOT_SECONDS;

/**
 * `bare` renders the input on its own, with no section, heading or caption.
 * The conversion rebuild (2026-08-03) folds this into the process section as
 * the evidence for step one, where it costs about 120px instead of the ~550px
 * a full explanatory section around it was spending to say the same thing.
 */
export default function PromptBar({ bare = false }: { bare?: boolean }) {
  const bar = (
    <>
          {/* The artifact. A product mockup, so it takes the soft shadow and
              the 22px radius the measurement artifacts are denied. */}
          {/* `overflow-hidden` is a backstop, not the layout: the type scales
              so the longest phrase clears the send button down to 360px. If a
              future phrase is longer than the ones here, this clips it rather
              than widening the page. */}
          <div
            data-reveal="scale"
            style={delay(220)}
            className="mt-11 flex items-center gap-3 overflow-hidden rounded-[22px] border border-line-dark bg-white px-4 py-4 shadow-[0_28px_60px_-32px_rgba(14,35,64,0.45)] sm:gap-5 sm:px-6 sm:py-5"
          >
            {/* A question cannot wrap (each is one nowrap span), so the whole
                line has to fit on one line at every width. If it wrapped, the
                bar would change height every time a long one cycled in. */}
            <p className="min-w-0 flex-1 text-[clamp(11.5px,3.35vw,21px)] leading-[1.35] text-ink">
              {/* Every question is rendered; they are stacked in one grid cell
                  and revealed in turn. See globals.css for the mechanism. */}
              <span className="prompt-slot">
                {PROMPT_DEMO.questions.map(({ q: question }, i) => (
                  <span
                    key={question}
                    className="prompt-word"
                    /* The question and its cover run two different keyframe
                       sets on one clock, so the timing is set once here as
                       custom properties and inherited by the cover. toFixed,
                       or binary float prints 16.500000000000004s into the
                       shipped HTML. */
                    style={
                      {
                        "--prompt-cycle": `${CYCLE_SECONDS.toFixed(2)}s`,
                        "--prompt-slot-start": `${(i * SLOT_SECONDS).toFixed(2)}s`,
                      } as React.CSSProperties
                    }
                  >
                    {question}
                    {/* The opaque cover, with the caret riding its left edge.
                        Only the step count is per-question here: it is the
                        character count, which is what makes this type rather
                        than wipe. */}
                    <span
                      aria-hidden="true"
                      className="prompt-cover"
                      style={{
                        animationTimingFunction: `steps(${question.length})`,
                      }}
                    >
                      <span className="prompt-caret" />
                    </span>
                  </span>
                ))}
              </span>
            </p>
            <span
              aria-hidden="true"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-white sm:h-10 sm:w-10"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 13.5V3M8 3L3.4 7.6M8 3l4.6 4.6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

    </>
  );

  if (bare) return bar;

  return (
    <section className="border-b border-line">
      <div className={SECTION}>
        {/* Measure only, NOT a centred column: `mx-auto` here put this
            section's eyebrow ~150px right of every other eyebrow on the page,
            which is the drift lib/layout.ts exists to stop. */}
        <div className="max-w-[760px]">
          <div data-reveal>
            <RuleEyebrow>{PROMPT_DEMO.eyebrow}</RuleEyebrow>
          </div>
          <h2
            data-reveal
            style={delay(80)}
            className="display mt-4 max-w-[560px] text-[clamp(30px,4.2vw,46px)] leading-[1.1] text-ink text-pretty"
          >
            {PROMPT_DEMO.heading}
          </h2>
          <p
            data-reveal
            style={delay(140)}
            className="mt-5 max-w-[480px] text-[15.5px] leading-[1.7] text-ink-soft"
          >
            {PROMPT_DEMO.body}
          </p>
          {bar}
          <p
            data-reveal
            style={delay(300)}
            className="mt-4 max-w-[480px] text-[13px] leading-[1.5] text-ink-faint"
          >
            {PROMPT_DEMO.caption}
          </p>
        </div>
      </div>
    </section>
  );
}
