import type { Metadata } from "next";
import Cta from "@/components/Cta";
import Eyebrow from "@/components/Eyebrow";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import PageSchema from "@/components/PageSchema";
import { HOME_FAQS } from "@/lib/home";
import { HEAD_SPLIT, SECTION } from "@/lib/layout";
import { delay } from "@/lib/reveal";
import { crumb, faq } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "FAQ: what we measure, and what we will not promise",
  description:
    "The questions we get about AI visibility measurement, answered directly. Sampled rates, never guaranteed rankings, and what we will not claim.",
  path: "/faq/",
});

/**
 * The full FAQ, moved off the home page 2026-08-03 (Josh). The home page is a
 * sequence of scenes now and a six-question accordion was the one block on it
 * that could only be read rather than seen.
 *
 * IT KEEPS THE FULL SET: all six of HOME_FAQS, so moving the block off the
 * home page did not quietly delete questions from the site. The FAQPage
 * JSON-LD is built from the same array that renders the visible questions, so
 * schema cannot drift.
 *
 * Full width like every page (lib/layout.ts): the head splits from 1600px and
 * the questions run two across from lg.
 */
export default function FaqPage() {
  return (
    <>
      <PageSchema meta={metadata} path="/faq/" trail={[crumb("/faq/")]} />
      <JsonLd data={faq(HOME_FAQS)} />

      <section>
        <div className={SECTION}>
          <div className={HEAD_SPLIT}>
            <div data-reveal className="min-w-0">
              <Eyebrow>Frequently asked</Eyebrow>
              <h1 className="display mt-6 max-w-[18ch] text-[clamp(34px,4.4vw,96px)] leading-[1.05] text-ink text-pretty">
                The questions we get, answered directly.
              </h1>
            </div>
            <p
              data-reveal
              style={delay(100)}
              className="max-w-[52ch] text-[clamp(16px,1.111vw,20px)] leading-[1.7] text-ink-soft"
            >
              Including the ones with answers you may not want. We would rather
              you know now.
            </p>
          </div>

          <div className="mt-12">
            <FaqSection faqs={HOME_FAQS} columns={2} />
          </div>
        </div>
      </section>

      <Cta />
    </>
  );
}
