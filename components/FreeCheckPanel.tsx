import Link from "next/link";
import RuleEyebrow from "./RuleEyebrow";
import { REPORT_CONTENTS } from "@/lib/home";
import { OFFER_CTA } from "@/lib/site";

/**
 * The split conversion panel: the ask on the left, what the report actually
 * contains on the right. It replaces the plain <Cta /> on home, because by
 * this point in a long page the objection is no longer "why" but "what do I
 * get" — so the answer sits inside the CTA rather than a click away.
 *
 * Primary routes to /free-check (the ≤1-click funnel rule, funnel.spec.ts).
 */
export default function FreeCheckPanel() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24">
        <div
          data-reveal
          className="grid border border-line-dark md:grid-cols-2"
        >
          <div className="bg-white px-8 py-12 sm:px-11 sm:py-13">
            <RuleEyebrow>Free AI visibility check</RuleEyebrow>
            <h2 className="display mt-4 text-[clamp(31px,3.8vw,46px)] leading-[1.12] text-ink text-pretty">
              Find out where you stand in AI answers today.
            </h2>
            <p className="mt-5 text-[15.5px] leading-[1.7] text-ink-soft">
              Takes about a minute to request. We run real customer questions
              for your category and area across all four engines, score them,
              and email the report within 1–2 business days. No call, no
              obligation, no packages.
            </p>
            <Link
              href="/free-check/"
              className="btn-pill mt-8 px-7 py-4 text-[13.5px]"
            >
              {OFFER_CTA} <span className="text-base">&#10230;</span>
            </Link>
          </div>

          <div className="bg-ink px-8 py-12 text-white sm:px-11 sm:py-13">
            {/* The panel's one Sky mark. It is legal because this half is
                navy; the tick discs stay white so the accent is spent once. */}
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-sky">
              What the report contains
            </p>
            <ul className="mt-6 list-none">
              {REPORT_CONTENTS.map((item) => (
                <li
                  key={item.name}
                  className="grid grid-cols-[24px_1fr] items-start gap-3.5 border-t border-white/15 py-4 first:border-t-0 first:pt-0"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white text-xs font-medium text-ink"
                  >
                    &#10003;
                  </span>
                  <span>
                    <span className="block text-[15px] font-semibold text-white">
                      {item.name}
                    </span>
                    <span className="mt-1 block text-[13.5px] leading-[1.55] text-white/65">
                      {item.body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
              Free · No call required · 1–2 business days
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
