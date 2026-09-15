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
}) {
  return (
    <section>
      {withSchema && <JsonLd data={faq(faqs)} />}
      <div className={compact ? "border-t border-line-dark" : ""}>
        {faqs.map((f) => (
          <div
            key={f.question}
            className={
              compact
                ? "border-b border-line-dark py-6"
                : "border-t border-line-dark py-8 first:border-t-0 first:pt-0 last:pb-0"
            }
          >
            <h2
              className={
                compact
                  ? "display text-[19px] leading-[1.3] text-ink text-pretty"
                  : "display text-[24px] leading-[1.25] text-ink text-pretty"
              }
            >
              {f.question}
            </h2>
            <p
              className={
                compact
                  ? "mt-2.5 text-[14.5px] leading-[1.7] text-ink-soft text-pretty"
                  : "mt-3 text-[16px] leading-[1.7] text-ink-soft"
              }
            >
              {f.answer}
            </p>
            {detail[f.question] && (
              <div className="mt-3 text-[16px] leading-[1.7] text-ink-soft">
                {detail[f.question]}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
