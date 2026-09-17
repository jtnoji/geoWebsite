import type { Metadata } from "next";
import Eyebrow from "@/components/Eyebrow";
import FreeCheckForm from "@/components/FreeCheckForm";
import PageSchema from "@/components/PageSchema";
import { SECTION_X } from "@/lib/layout";
import { delay } from "@/lib/reveal";
import { crumb } from "@/lib/schema";
import { OFFER_TITLE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: OFFER_TITLE,
  description:
    "Tell us who you are. We run real customer questions through ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews, then email a short report.",
  path: "/free-check/",
});

const DELIVERABLES = [
  "What the AI engines said, word for word",
  "The competitors named instead of you",
  "The sources the AI cited",
  "Whether AI bots can even read your website",
] as const;

/**
 * THE conversion page — cold-email links land here. Minimal chrome, zero
 * distractions: the global header, then the head and the form.
 *
 * The design does not draw this page, so it takes the Sable language from the
 * pages it does (2026-09-14): a left head, and the form in a white card like
 * the design's booking form. From lg up the form sits beside the head so it is
 * above the fold; below lg the order is head, form, then what you get. That
 * reordering is grid placement, not a second copy of the list, so the raw HTML
 * carries every line exactly once.
 */
export default function FreeCheck() {
  return (
    <div
      className={`${SECTION_X} grid items-start gap-12 pb-16 pt-12 md:pb-[100px] md:pt-[68px] lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-10 wide:grid-cols-[minmax(0,1fr)_minmax(0,640px)] wide:gap-x-24`}
    >
      <PageSchema meta={metadata} path="/free-check/" trail={[crumb("/free-check/")]} />

      <div data-reveal className="min-w-0 lg:col-start-1 lg:row-start-1">
        <Eyebrow>{OFFER_TITLE}</Eyebrow>
        <h1 className="display mt-6 max-w-[18ch] text-[clamp(34px,4.4vw,96px)] leading-[1.05] text-ink text-pretty">
          What does AI say when customers ask about businesses like yours?
        </h1>
        <p className="mt-5 max-w-[52ch] text-[clamp(16px,1.111vw,20px)] leading-[1.7] text-ink-soft">
          Tell us who you are. We&rsquo;ll run real customer questions through
          ChatGPT, Google&rsquo;s AI answers, Gemini, and Perplexity, then email
          you a short report: whether you&rsquo;re mentioned, who&rsquo;s named
          instead, and which sources shaped the answer. Free, no call required.
        </p>
      </div>

      {/* The form reveals as one block. Staggering the fields would delay the
          thing the visitor came here to use. */}
      <div
        data-reveal
        style={delay(110)}
        className="min-w-0 rounded-2xl bg-white p-6 shadow-card sm:p-8 lg:col-start-2 lg:row-span-2 lg:row-start-1"
      >
        <FreeCheckForm />
      </div>

      <div data-reveal style={delay(220)} className="min-w-0 lg:col-start-1 lg:row-start-2">
        <h2 className="font-mono text-[10.5px] font-normal uppercase tracking-[0.16em] text-ink-faint">
          What you&rsquo;ll get
        </h2>
        <ul data-reveal="stagger" className="mt-4 max-w-[52ch]">
          {DELIVERABLES.map((item) => (
            <li
              key={item}
              className="grid grid-cols-[18px_minmax(0,1fr)] items-start gap-2.5 border-t border-line-dark py-3 text-[clamp(15px,1.042vw,19px)] leading-[1.55] text-ink"
            >
              <span aria-hidden="true" className="mt-[0.5em] h-1.5 w-1.5 rounded-full bg-cobalt" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
