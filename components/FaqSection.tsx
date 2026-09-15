import JsonLd from "./JsonLd";
import { faq, type Faq } from "@/lib/schema";

/**
 * THE key GEO pattern (scaffold §3): one {question, answer}[] renders both the
 * visible question-form H2s + answer-first paragraphs AND the FAQPage JSON-LD,
 * so schema can never drift from visible text (the Cat 5 drift check).
 *
 * `detail` holds elaboration beyond the standalone answer — visible but
 * deliberately NOT in the schema, which carries only the quotable answer.
 */
export default function FaqSection({
  faqs,
  detail = {},
  withSchema = true,
  compact = false,
  columns = 1,
}: {
  faqs: readonly Faq[];
  detail?: Record<string, React.ReactNode>;
  withSchema?: boolean;
  /**
   * Smaller type for a half-width column. Same markup and same schema: only
   * the scale drops, because a large question set in a narrow column reads as
   * a stack of headlines rather than a list of questions.
   */
  compact?: boolean;
  /**
   * Lay the questions out as a grid from lg up, so a set fills the width of
   * the page instead of running down its left side (2026-09-14). Each answer
   * keeps its own reading measure inside its column.
   */
  columns?: 1 | 2 | 3;
}) {
  const grid =
    columns === 3
      ? "grid gap-x-16 lg:grid-cols-3"
      : columns === 2
        ? "grid gap-x-16 lg:grid-cols-2"
        : "";
  const item =
    columns > 1
      ? "border-t border-line-dark py-8"
      : "border-t border-line-dark py-8 first:border-t-0 first:pt-0 last:pb-0";

  return (
    <section>
      {withSchema && <JsonLd data={faq(faqs)} />}
      <div className={compact ? "border-t border-line-dark" : grid}>
        {/* Each question reveals on its own rather than as one staggered
            block: an FAQ runs well past the fold, and a cascade started at
            its top would finish before anyone scrolled to the bottom. */}
        {faqs.map((f) => (
          <div
            key={f.question}
            data-reveal
            className={compact ? "border-b border-line-dark py-6" : item}
          >
            <h2
              className={
                compact
                  ? "display text-[19px] leading-[1.3] text-ink text-pretty"
                  : "display max-w-[30ch] text-[clamp(24px,1.667vw,32px)] leading-[1.25] text-ink text-pretty"
              }
            >
              {f.question}
            </h2>
            <p
              className={
                compact
                  ? "mt-2.5 text-[14.5px] leading-[1.7] text-ink-soft text-pretty"
                  : "mt-3 max-w-[64ch] text-[clamp(16px,1.111vw,20px)] leading-[1.7] text-ink-soft"
              }
            >
              {f.answer}
            </p>
            {detail[f.question] && (
              <div className="mt-3 max-w-[64ch] text-[clamp(16px,1.111vw,20px)] leading-[1.7] text-ink-soft">
                {detail[f.question]}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
