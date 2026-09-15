import { PROMPT_DEMO } from "@/lib/home";

/**
 * The hero's live customer questions: a working AI interface. A customer
 * question types itself into the box, the engine answers, the answer names
 * three businesses, and the reader's is not one of them. Then it clears and
 * the next customer asks something else.
 *
 * RESTORED 2026-09-14 at Josh's request. It was the fold's right-hand panel on
 * the previous home page, and it replaces the Sable design's static
 * before/after card. The shell is the design's glass card; the mechanism is
 * the original.
 *
 * SERVER COMPONENT, pure CSS, no library. All six questions and all six
 * answers are real text in the exported HTML with JavaScript off, so a crawler
 * reads the full set while a human sees them in rotation. The mechanism is the
 * `.prompt-*` block in globals.css: the covers type, `prompt-live` decides
 * whose turn it is, and `prompt-answer` brings the reply in once the query is
 * complete and takes it away as the erase starts.
 *
 * THE BUSINESS NAMES ARE PLACEHOLDERS. See the note on PROMPT_DEMO in
 * lib/home.ts: putting words in a real company's mouth is the one thing
 * lib/sample.ts flatly forbids.
 */

const SLOT_SECONDS = 5.5;

/* Fail closed: the prompt-* keyframes in globals.css are cut into sixths, one
   slot per question. A seventh question without recutting them would put two
   questions on screen at once. */
const EXPECTED_QUESTIONS = 6;
if (PROMPT_DEMO.questions.length !== EXPECTED_QUESTIONS) {
  throw new Error(
    `LiveAnswer: PROMPT_DEMO has ${PROMPT_DEMO.questions.length} questions, but ` +
      `the prompt-* keyframes in app/globals.css are cut into ` +
      `${EXPECTED_QUESTIONS}ths. Recut the stops and update EXPECTED_QUESTIONS together.`
  );
}

const CYCLE_SECONDS = PROMPT_DEMO.questions.length * SLOT_SECONDS;

/* The query box is opaque, and the typing cover has to be exactly its colour:
   the cover is a solid block laid over the untyped half of the question, so
   any mismatch shows as a rectangle. The card around the box stays glass. */
const BOX = "#0f1a2b";

const slot = (i: number) =>
  ({
    "--prompt-cycle": `${CYCLE_SECONDS.toFixed(2)}s`,
    "--prompt-slot-start": `${(i * SLOT_SECONDS).toFixed(2)}s`,
  }) as React.CSSProperties;

export default function LiveAnswer() {
  return (
    /* The card carries its own reveal rather than a wrapper's: opacity or a
       filter on an ANCESTOR of this backdrop blur would flatten the glass
       (globals.css, "Scroll depth"). */
    <div
      data-reveal="scale"
      className="overflow-hidden rounded-2xl border border-white/16 bg-night/60 shadow-glass backdrop-blur-[14px]"
      style={
        {
          "--prompt-bg": BOX,
          "--prompt-caret": "#7fa6d9",
          "--reveal-delay": "200ms",
        } as React.CSSProperties
      }
    >
      <div className="flex flex-wrap justify-between gap-3 border-b border-white/12 px-[18px] py-[11px] font-mono text-[10px] uppercase tracking-[0.16em]">
        <span className="text-sky">
          <span aria-hidden="true" className="mr-1.5">
            ●
          </span>
          {PROMPT_DEMO.label}
        </span>
        <span className="tracking-[0.1em] text-white/55">illustrative example</span>
      </div>

      {/* The query box. Chrome first so it reads as an input even in the
          instant before the caret moves. */}
      <div className="px-[18px] pt-4">
        <div
          className="flex items-center gap-3 rounded-[10px] border border-white/14 py-[9px] pl-3.5 pr-2"
          style={{ background: BOX }}
        >
          {/* overflow-hidden is the floor for the narrowest phones, where the
              longest question can outgrow the box: it clips inside the box
              rather than running under the send button. The vertical padding
              gives the cover's overshoot room inside that clip. */}
          <p className="min-w-0 flex-1 overflow-hidden py-[0.12em] text-[clamp(12px,3.2vw,14.5px)] leading-[1.35] text-white">
            <span className="prompt-slot">
              {PROMPT_DEMO.questions.map(({ q }, i) => (
                <span key={q} className="prompt-word" style={slot(i)}>
                  {q}
                  <span
                    aria-hidden="true"
                    className="prompt-cover"
                    style={{ animationTimingFunction: `steps(${q.length})` }}
                  >
                    <span className="prompt-caret" />
                  </span>
                </span>
              ))}
            </span>
          </p>
          <span
            aria-hidden="true"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-night"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 13.5V3M8 3L3.4 7.6M8 3l4.6 4.6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* The answers, stacked in one grid cell like the questions, so the panel
          never changes height as they swap. */}
      <div className="grid px-[18px] pb-[18px] pt-3.5">
        {PROMPT_DEMO.questions.map(({ q, engine, lead }, i) => (
          <div key={q} className="prompt-answer col-start-1 row-start-1" style={slot(i)}>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-sky">
              {engine}
            </p>
            <p className="mt-2 text-[13.5px] leading-[1.55] text-white/85">{lead}</p>

            {/* THE SHORTLIST, DRAWN. Three filled chips and one empty one: the
                list has four slots in the reader's head and theirs is the one
                with nothing in it. */}
            <ul className="mt-3 flex flex-wrap items-center gap-2">
              {PROMPT_DEMO.named.map((name) => (
                <li
                  key={name}
                  className="rounded-full bg-white/[0.14] px-3 py-1.5 text-[12.5px] font-medium text-white"
                >
                  {name}
                </li>
              ))}
              <li className="rounded-full border border-dashed border-white/35 px-3 py-1.5 text-[12.5px] font-medium text-white/55">
                your business
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
