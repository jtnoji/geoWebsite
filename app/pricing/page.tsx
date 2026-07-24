import type { Metadata } from "next";
import Link from "next/link";
import Cta from "@/components/Cta";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import { service, type Faq } from "@/lib/schema";
import { PRICING } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing: audit & ongoing measurement",
  description:
    "Start with a free AI visibility check. The full audit and ongoing measurement are priced flat, and reports show sampled rates, never guaranteed rankings.",
};

const TIERS = [
  {
    name: "Free Visibility Check",
    price: "$0",
    description:
      "The short report. Where you stand on the big three engines, and who's named instead of you.",
    cta: { label: "Get started", href: "/free-check/" },
    featured: false,
  },
  {
    name: "Full AI Visibility Audit",
    price: `${PRICING.audit} one-time`,
    description:
      "Full query set across all engines, sampled runs, judged answers, accuracy findings, site + off-site audit, prioritized roadmap. Delivered as a report + a walkthrough call.",
    cta: { label: "Book a call", href: "/contact/" },
    featured: true,
  },
  {
    name: "Ongoing Measurement",
    price: PRICING.retainer,
    description:
      "We re-run your audit on a cadence and show what changed: before/after mention rates, new competitors, new sources. AI answers move; the point is the trend line.",
    cta: { label: "Book a call", href: "/contact/" },
    featured: false,
  },
] as const;

const FAQS: Faq[] = [
  {
    question: "Do you do the fixes too?",
    answer:
      "Our core service is measurement and the prioritized roadmap. For implementation, we work through the roadmap with you or hand it to your existing web team. Every fix is written so a competent developer can execute it.",
  },
  {
    question: "How long until AI answers change?",
    answer:
      "Honestly, weeks to months, and it varies by engine and by fix. We measure the change rather than promise it; that's what the ongoing measurement tier is for.",
  },
  {
    question: "What do you need from me?",
    answer:
      "A fact sheet about your business (we send a template) and about 30 minutes of your time to approve it. Everything else runs on our side.",
  },
];

export default function Pricing() {
  return (
    <>
      <JsonLd
        data={service({
          name: "Full AI Visibility Audit",
          description:
            "One-time audit: full query set across all major AI engines, sampled runs, judged answers, accuracy findings, site and off-site audit, prioritized roadmap.",
        })}
      />
      <JsonLd
        data={service({
          name: "Ongoing Measurement",
          description:
            "Recurring AI visibility measurement: audits re-run on a cadence with before/after mention rates, new competitors, and new sources.",
        })}
      />

      <div className="mx-auto max-w-[1120px] px-5 py-16 sm:px-8 md:py-20">
        <div className="max-w-[560px]">
          <h1 className="text-4xl font-bold tracking-tight text-ink">Pricing</h1>
          <p className="mt-5 text-base leading-7 text-ink-soft">
            Three tiers, ascending commitment. Every tier reports sampled rates
            with named sources. No tier, at any price, promises rankings.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3">
          {TIERS.map((tier, i) => (
            <div
              key={tier.name}
              className="flex flex-col border border-b-0 border-line-dark bg-white last:border-b md:border-b md:border-r-0 md:last:border-r"
            >
              <span className="block bg-ink px-3.5 py-1.5 font-mono text-[11px] text-white">
                {String(i + 1).padStart(2, "0")}
                {tier.featured && " · most popular"}
              </span>
              <div className="flex flex-1 flex-col px-4 pb-5 pt-4">
                <h2 className="text-base font-bold tracking-[-0.01em] text-ink">
                  {tier.name}
                </h2>
                <p className="mt-1.5 font-mono text-2xl font-semibold tracking-tight text-ink">
                  {tier.price}
                </p>
                <p className="mt-3.5 flex-1 text-sm leading-6 text-ink-soft">
                  {tier.description}
                </p>
                <Link
                  href={tier.cta.href}
                  className="btn-solid mt-6 self-start px-5 py-2.5 text-sm"
                >
                  {tier.cta.label}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 max-w-2xl">
          <FaqSection faqs={FAQS} />
        </div>
      </div>

      <Cta />
    </>
  );
}
