import type { Metadata } from "next";
import FreeCheckForm from "@/components/FreeCheckForm";
import PageSchema from "@/components/PageSchema";
import { delay } from "@/lib/reveal";
import { crumb } from "@/lib/schema";
import { OFFER_TITLE } from "@/lib/site";

export const metadata: Metadata = {
  title: OFFER_TITLE,
  description:
    // Adding Gemini pushed this past the 155-char meta-description limit that
    // geo.spec.ts enforces; "then email a short report" buys the 4 chars back.
    "Tell us who you are. We run real customer questions through ChatGPT, Google AI, Gemini, and Perplexity, then email a short report. Free, no call required.",
  alternates: { canonical: "/free-check/" },
};

const DELIVERABLES = [
  "What the AI engines said, word for word",
  "The competitors named instead of you",
  "The sources the AI cited",
  "Whether AI bots can even read your website",
] as const;

/**
 * THE conversion page — cold-email links land here. Minimal chrome, zero
 * distractions: the page keeps the (slim, sticky) global header but no extra
 * sections between the visitor and the form.
 */
export default function FreeCheck() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 md:py-20">
      <PageSchema meta={metadata} path="/free-check/" trail={[crumb("/free-check/")]} />

      {/* Head centres; the form below keeps left-aligned labels and inputs. */}
      <div data-reveal className="text-center">
        <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-ink md:text-4xl">
          What does AI say when customers ask about businesses like yours?
        </h1>
        <p className="mt-5 text-base leading-7 text-ink-soft">
          Tell us who you are. We&rsquo;ll run real customer questions through
          ChatGPT, Google&rsquo;s AI answers, Gemini, and Perplexity, then email
          you a short report: whether you&rsquo;re mentioned, who&rsquo;s named
          instead, and which sources shaped the answer. Free, no call required.
        </p>
      </div>

      {/* The form itself reveals as one block. Staggering the fields would
          delay the thing the visitor came here to use. */}
      <div data-reveal style={delay(110)} className="mt-10">
        <FreeCheckForm />
      </div>

      <div data-reveal style={delay(220)} className="mt-14 border-t-2 border-ink pt-5 text-center">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.06em] text-ink-faint">
          What you&rsquo;ll get
        </h2>
        <ul className="mt-4">
          {DELIVERABLES.map((item) => (
            <li
              key={item}
              className="border-t border-line py-3 text-sm leading-6 text-ink-soft first:border-t-0"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
