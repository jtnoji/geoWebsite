import Link from "next/link";
import RuleEyebrow from "./RuleEyebrow";
import { ENGAGEMENT } from "@/lib/home";
import { SECTION } from "@/lib/layout";

/**
 * "What happens after the report lands" — one of the two full-bleed
 * Berkeley-navy bands on the site (the other is the closing CTA). It is the
 * only place the paper ground is covered edge to edge, and that is deliberate:
 * the engagement is the one section that describes paid work, so it reads as a
 * different surface from the free explainer above it.
 *
 * Sky is legal here because the ground is navy, and it is spent exactly once —
 * on the eyebrow. The phase tags take a white wash and the CTA inverts to a
 * white pill; a band with five Sky marks in it would have no accent at all.
 */
export default function EngagementSteps() {
  return (
    <section className="bg-ink text-white">
      {/* The head column stretches and the sticky block sits inside it: a
          sticky grid item is exactly as tall as its own grid area, so it has
          no travel range and never sticks. See the same note in app/page.tsx. */}
      <div className={`${SECTION} grid gap-12 md:grid-cols-2 md:gap-[72px]`}>
        <div>
          <div data-reveal className="md:sticky md:top-[110px]">
            <RuleEyebrow onDark>The engagement</RuleEyebrow>
            <h2 className="display mt-4 max-w-[480px] text-[clamp(33px,4.4vw,52px)] leading-[1.1] text-white text-pretty">
              What happens after the report lands.
            </h2>
            <p className="mt-5 max-w-[420px] text-[15.5px] leading-[1.7] text-white/70">
              The free check is the first phase, not a teaser with the numbers
              removed. If you continue, the work runs on the same measured loop.
              Change one thing, re-run the identical question set, see whether
              the rate moved.
            </p>
            <Link
              href="/how-it-works/"
              className="btn-pill-invert mt-8 px-[26px] py-[15px] text-[11.5px]"
            >
              Read the full methodology
            </Link>
          </div>
        </div>

        <ol className="list-none">
          {ENGAGEMENT.map((step, i) => (
            <li
              key={step.phase}
              data-reveal
              className="grid grid-cols-[52px_minmax(0,1fr)] gap-5 border-t border-white/15 py-7 first:border-t-0 first:pt-0 md:gap-[22px]"
            >
              <span
                aria-hidden="true"
                className={`flex h-[52px] w-[52px] items-center justify-center rounded-full border text-[15px] font-medium ${
                  i === ENGAGEMENT.length - 1
                    ? "border-white/70 text-white"
                    : "border-white/25 text-white/70"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-2.5">
                <span className="self-start bg-white/12 px-2.5 py-[5px] font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/85">
                  {step.phase}
                </span>
                <h3 className="text-xl font-medium tracking-[-0.01em] text-white">
                  {step.title}
                </h3>
                <p className="text-[14.5px] leading-[1.7] text-white/70 text-pretty">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
