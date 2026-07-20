import type { Metadata } from "next";
import FreeCheckForm from "@/components/FreeCheckForm";

export const metadata: Metadata = {
  title: "Free AI Visibility Check",
  description:
    "Tell us who you are. We run real customer questions through ChatGPT, Google AI, and Perplexity, and email you a short report. Free, no call required.",
};

const DELIVERABLES = [
  "Verbatim excerpts of what the AI engines said",
  "The competitors named instead of you, by name",
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
      <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-ink md:text-4xl">
        What does AI say when customers ask about businesses like yours?
      </h1>
      <p className="mt-5 text-base leading-7 text-ink-soft">
        Tell us who you are. We&rsquo;ll run real customer questions through
        ChatGPT, Google&rsquo;s AI answers, and Perplexity, and email you a short
        report: whether you&rsquo;re mentioned, who&rsquo;s named instead of
        you, and which sources are shaping the answer. Free, no call required.
      </p>

      <div className="mt-10">
        <FreeCheckForm />
      </div>

      <div className="mt-14 border-t-2 border-ink pt-5">
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
