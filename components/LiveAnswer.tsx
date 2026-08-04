import { PROMPT_DEMO } from "@/lib/home";
import { SAMPLE_LABEL } from "@/lib/sample";

/**
 * The hero: a working AI interface. A customer question types itself into the
 * box, the engine answers, the answer names three businesses, and the reader's
 * is not one of them. Then it clears and the next customer asks something else.
 *
 * This is the whole product argument performed rather than described, which is
 * why it is the first thing on the page instead of a headline about it.
 *
 * SERVER COMPONENT, pure CSS, no library. All six questions and all six
 * answers are real text in the exported HTML with JavaScript off, so a crawler
 * reads the full set while a human sees them in rotation. The mechanism is the
 * `.prompt-*` block in globals.css, shared with PromptBar: the covers type,
 * `prompt-live` decides whose turn it is, and `prompt-answer` brings the reply
 * in once the query is complete and takes it away as the erase starts.
 *
 * It runs on the dark panel by setting `--prompt-bg` and `--prompt-caret`,
 * because the cover has to match whatever it sits on.
 *
 * THE BUSINESS NAMES ARE PLACEHOLDERS. See the note in lib/home.ts: putting
 * words in a real company's mouth is the one thing lib/sample.ts flatly
 * forbids, and eighteen unverified invented names would be worse than the
 * convention the rest of the site already uses.
 */

const SLOT_SECONDS = 5.5;
const CYCLE_SECONDS = PROMPT_DEMO.questions.length * SLOT_SECONDS;

export default function LiveAnswer() {
  return (
    <div
      /* A panel a step darker than the fold, so the interface reads as an
         inset device rather than a card floating on the same colour. */
      className="overflow-hidden rounded-[20px] border border-white/12 bg-[#0a1a30] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)]"
      style={
        {
          "--prompt-bg": "#0a1a30",
          "--prompt-caret": "#7fa6d9",
        } as React.CSSProperties
      }
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-sky" />
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
          Live customer questions
        </span>
      </div>

      {/* The query box. Chrome first so it reads as an input even in the
          instant before the caret moves. */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3 rounded-[14px] border border-white/20 bg-white/[0.06] px-4 py-3">
          <p className="min-w-0 flex-1 text-[clamp(12px,3.2vw,16px)] leading-[1.35] text-white">
            <span className="prompt-slot">
              {PROMPT_DEMO.questions.map(({ q }, i) => (
                <span
                  key={q}
                  className="prompt-word"
                  style={
                    {
                      "--prompt-cycle": `${CYCLE_SECONDS.toFixed(2)}s`,
                      "--prompt-slot-start": `${(i * SLOT_SECONDS).toFixed(2)}s`,
                    } as React.CSSProperties
                  }
                >
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
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
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

      {/* The answers, stacked in one grid cell exactly like the questions, so
          the panel never changes height as they swap. */}
      <div className="grid px-4 pb-4 pt-3.5">
        {PROMPT_DEMO.questions.map(({ q, engine, lead }, i) => (
          <div
            key={q}
            className="prompt-answer col-start-1 row-start-1"
            style={
              {
                "--prompt-cycle": `${CYCLE_SECONDS.toFixed(2)}s`,
                "--prompt-slot-start": `${(i * SLOT_SECONDS).toFixed(2)}s`,
              } as React.CSSProperties
            }
          >
            <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-sky">
              {engine}
            </p>
            <p className="mt-2 text-[14.5px] leading-[1.6] text-white/85">
              {lead}
            </p>

            {/* THE SHORTLIST, DRAWN. The answer used to say "Competitor A,
                Competitor B, and Competitor C" in a sentence, which reads as
                prose about naming rather than as naming. Three filled chips
                and one empty one is the same information as a picture: the
                list has four slots in the reader's head and theirs is the one
                with nothing in it. */}
            <ul className="mt-3.5 flex flex-wrap items-center gap-2">
              {PROMPT_DEMO.named.map((name) => (
                <li
                  key={name}
                  className="rounded-full bg-white/[0.16] px-3.5 py-[7px] text-[12.5px] font-medium text-white"
                >
                  {name}
                </li>
              ))}
              <li className="rounded-full border border-dashed border-white/35 px-3.5 py-[7px] text-[12.5px] font-medium text-white/45">
                your business
              </li>
            </ul>
          </div>
        ))}
      </div>

      <p className="border-t border-white/10 px-4 py-2.5 font-mono text-[10.5px] text-white/40">
        {SAMPLE_LABEL}
      </p>
    </div>
  );
}
