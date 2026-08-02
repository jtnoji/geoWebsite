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
   * Half-width variant (home). Same markup and same schema — only the type
   * scale drops, because a 24px question set in a two-column grid reads as
   * six headlines rather than six questions.
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
                : "border-t border-line py-8 first:border-t-0 first:pt-0 last:pb-0"
            }
          >
            <h2
              className={
                compact
                  ? "display text-[20px] text-ink text-pretty"
                  : "display text-[27px] text-ink"
              }
            >
              {f.question}
            </h2>
            <p
              className={
                compact
                  ? "mt-2.5 text-[14.5px] leading-[1.7] text-ink-soft text-pretty"
                  : "mt-3 text-base leading-7 text-ink-soft"
              }
            >
              {f.answer}
            </p>
            {detail[f.question] && (
              <div className="mt-3 text-base leading-7 text-ink-soft">
                {detail[f.question]}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
