import type { Metadata } from "next";
import Link from "next/link";
import Cta from "@/components/Cta";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import PageSchema from "@/components/PageSchema";
import { delay } from "@/lib/reveal";
import { crumb, service, type Faq } from "@/lib/schema";
import { SERVICE_TIERS } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Pricing: audit and ongoing GEO",
  description:
    "Start with a free AI visibility check. The full audit and the ongoing work are priced flat. Reports show sampled rates, never guaranteed rankings.",
  alternates: { canonical: "/pricing/" },
};

const FAQS: Faq[] = [
  {
    question: "Do you do the fixes too?",
    answer:
      "Yes, on the ongoing tier. We implement the roadmap on your site and off it, then re-measure so you can see what each change did. It's the newest part of what we do and we're booking our first implementation clients now. If you'd rather your own web team execute, every fix is written so a competent developer can pick it up.",
  },
  {
    question: "How long until AI answers change?",
    answer:
      "Weeks to months, and it varies by engine and by fix. We measure the change rather than promise it, which is why the ongoing tier pairs the work with a re-run of the audit.",
  },
  {
    question: "What do you need from me?",
    answer:
      "A fact sheet about your business (we send a template) and 30 minutes to approve it. Everything else runs on our side.",
  },
];

export default function Pricing() {
  return (
    <>
      <PageSchema meta={metadata} path="/pricing/" trail={[crumb("/pricing/")]} />
      <JsonLd
        data={service({
          name: "Full AI Visibility Audit",
          description:
            "One-time audit: full query set across all major AI engines, sampled runs, judged answers, accuracy findings, site and off-site audit, prioritized roadmap.",
        })}
      />
      <JsonLd
        data={service({
          name: "Ongoing GEO",
          description:
            "Recurring generative engine optimization: we implement the audit's prioritized fixes on-site and off-site, then re-run the audit to measure what each change did, reporting before and after mention rates, new competitors, and new sources.",
        })}
      />

      <div className="mx-auto max-w-[1120px] px-5 py-16 sm:px-8 md:py-20">
        <div data-reveal className="mx-auto max-w-[560px] text-center">
          <h1 className="display text-4xl font-bold tracking-tight text-ink">Pricing</h1>
          <p className="mt-5 text-base leading-7 text-ink-soft">
            Three tiers. Every one reports sampled rates with named sources.
            None of them, at any price, promises rankings.
          </p>
        </div>

        {/* Revealed as one block: the tier cells share borders, so fading
            them in individually would expose the seams (same reason the home
            StepList reveals whole). */}
        <div data-reveal style={delay(120)} className="mt-12 grid md:grid-cols-3">
          {SERVICE_TIERS.map((tier, i) => (
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
                <p className="mt-3.5 text-sm leading-6 text-ink-soft">
                  {tier.description}
                </p>
                <p className="mt-3 flex-1 text-xs leading-5 text-ink-faint">
                  {"note" in tier ? tier.note : null}
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

        <div data-reveal className="mt-20 max-w-2xl">
          <FaqSection faqs={FAQS} />
        </div>
      </div>

      <Cta centered />
    </>
  );
}
