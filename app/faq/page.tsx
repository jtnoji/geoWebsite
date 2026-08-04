import type { Metadata } from "next";
import Cta from "@/components/Cta";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import PageSchema from "@/components/PageSchema";
import RuleEyebrow from "@/components/RuleEyebrow";
import { HOME_FAQS } from "@/lib/home";
import { SECTION } from "@/lib/layout";
import { delay } from "@/lib/reveal";
import { crumb, faq } from "@/lib/schema";

export const metadata: Metadata = {
  /* Kept under 60 including the " · Sable" the layout template appends;
     the geo suite fails the build on a longer one. */
  title: "FAQ: what we measure, and what we will not promise",
  description:
    "The questions we get about AI visibility measurement, answered directly. Sampled rates, never guaranteed rankings, and what we will not claim.",
  alternates: { canonical: "/faq/" },
};

/**
 * The full FAQ, moved off the home page 2026-08-03 (Josh). The home page is a
 * sequence of scenes now and a six-question accordion was the one block on it
 * that could only be read rather than seen; a compact reassurance line beside
 * the final CTA carries the load-bearing points and links here.
 *
 * IT KEEPS THE FULL SET. Home rendered HOME_FAQS_TOP (four); this renders all
 * of HOME_FAQS, so moving the block off the home page did not quietly delete
 * two questions from the site. The FAQPage JSON-LD is built from the same
 * array that renders the visible questions, so schema cannot drift.
 */
export default function FaqPage() {
  return (
    <>
      <PageSchema meta={metadata} path="/faq/" trail={[crumb("/faq/")]} />
      <JsonLd data={faq(HOME_FAQS)} />

      <section className="border-b border-line">
        <div className={SECTION}>
          <div data-reveal className="max-w-[680px]">
            <RuleEyebrow>Frequently asked</RuleEyebrow>
            <h1 className="display mt-4 text-[clamp(33px,4.4vw,52px)] leading-[1.1] text-ink text-pretty">
              The questions we get, answered directly.
            </h1>
            <p className="mt-5 text-[16px] leading-[1.7] text-ink-soft">
              Including the ones with answers you may not want. We would rather
              you know now.
            </p>
          </div>

          <div data-reveal style={delay(120)} className="mt-12 max-w-[820px]">
            <FaqSection faqs={HOME_FAQS} />
          </div>
        </div>
      </section>

      <Cta />
    </>
  );
}
