import type { Metadata } from "next";
import Link from "next/link";
import Cta from "@/components/Cta";
import Eyebrow from "@/components/Eyebrow";
import FaqSection from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import PageSchema from "@/components/PageSchema";
import { SECTION_X } from "@/lib/layout";
import { delay } from "@/lib/reveal";
import { crumb, service, type Faq } from "@/lib/schema";
import { PRICING_COPY, SERVICE_TIERS } from "@/lib/offers";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Pricing: audit and ongoing GEO",
  description:
    "Start with a free AI visibility check. The full audit and the ongoing work are priced flat. Reports show sampled rates, never guaranteed rankings.",
  path: "/pricing/",
});

/**
 * Rebuilt 2026-09-14 from the Sable design (mockup/sable-site.dc.html): the
 * head and the three tier cards, the middle one in navy. It keeps the FAQ and
 * both Service nodes it had before, and the old head's no-rankings line now
 * sits under the tiers.
 */

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

      <section className={`${SECTION_X} pb-12 pt-14 md:pb-14 md:pt-[68px]`}>
        <div data-reveal>
          <Eyebrow>{PRICING_COPY.eyebrow}</Eyebrow>
          <h1 className="display mt-6 max-w-[18ch] text-[clamp(42px,5.4vw,76px)] leading-[1.03] text-ink text-pretty">
            {`${PRICING_COPY.heading} `}
            <span className="text-cobalt">{PRICING_COPY.headingAccent}</span>
          </h1>
          <p className="mt-[22px] max-w-[52ch] text-[16px] leading-[1.7] text-ink-soft">
            {PRICING_COPY.body}
          </p>
        </div>
      </section>

      <section className={`${SECTION_X} pb-16 md:pb-[100px]`}>
        <div className="grid items-stretch gap-4 lg:grid-cols-3">
          {SERVICE_TIERS.map((tier, i) => {
            const dark = tier.featured;
            return (
              <div
                key={tier.name}
                data-reveal
                style={delay(i * 90)}
                className={`flex min-w-0 flex-col rounded-[14px] border p-7 sm:p-8 ${
                  dark ? "border-ink bg-ink text-white" : "border-track bg-white"
                }`}
              >
                <h2
                  className={`font-mono text-[10.5px] font-normal uppercase tracking-[0.16em] ${
                    dark ? "text-sky" : "text-ink-faint"
                  }`}
                >
                  {tier.name}
                </h2>
                <p
                  className={`mt-[22px] text-[clamp(38px,3.4vw,46px)] font-light leading-[1.05] tracking-[-0.04em] ${
                    dark ? "text-white" : "text-ink"
                  }`}
                >
                  {tier.price}
                </p>
                <p className={`mt-2.5 text-[14px] ${dark ? "text-white/72" : "text-ink-faint"}`}>
                  {tier.priceNote}
                </p>
                <p
                  className={`mt-5 text-[15.5px] leading-[1.65] ${
                    dark ? "text-white/88" : "text-ink-soft"
                  }`}
                >
                  {tier.description}
                </p>
                <ul className="mb-[30px] mt-[26px] flex flex-col gap-3">
                  {tier.includes.map((item) => (
                    <li
                      key={item}
                      className={`grid grid-cols-[16px_minmax(0,1fr)] items-start gap-2.5 text-[15px] leading-[1.55] ${
                        dark ? "text-white" : "text-ink"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-2 h-1.5 w-1.5 rounded-full ${dark ? "bg-sky" : "bg-cobalt"}`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.cta.href}
                  className={`btn btn-mono mt-auto w-full py-[15px] text-[11.5px] ${
                    dark ? "btn-white" : "btn-navy"
                  }`}
                >
                  {tier.cta.label}
                </Link>
              </div>
            );
          })}
        </div>
        <p data-reveal className="mt-6 max-w-[60ch] text-[14px] leading-[1.6] text-ink-faint">
          {PRICING_COPY.honesty}
        </p>
      </section>

      <section className="border-t border-line-dark">
        <div className={`${SECTION_X} py-16 md:py-[100px]`}>
          <Eyebrow>Questions</Eyebrow>
          <div data-reveal style={delay(100)} className="mt-8 max-w-3xl">
            <FaqSection faqs={FAQS} />
          </div>
        </div>
      </section>

      <Cta />
    </>
  );
}
