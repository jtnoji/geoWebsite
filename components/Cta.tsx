import Link from "next/link";

/**
 * Final CTA section: rule-top, left-aligned, one navy button + quiet
 * text link. Primary always routes to /free-check (the ≤1-click funnel rule
 * enforced by funnel.spec.ts).
 */
export default function Cta({
  heading = "Find out what AI says about you. Free.",
  sub = "Takes one minute. We'll email your report within 1–2 business days.",
  primaryLabel = "Get your free visibility check",
  secondaryLabel,
  secondaryHref,
}: {
  heading?: string;
  sub?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-[1120px] px-5 py-20 sm:px-8 md:py-24">
        <h2 className="max-w-xl text-3xl font-bold tracking-tight text-ink md:text-4xl">
          {heading}
        </h2>
        <p className="mt-3.5 max-w-xl text-base leading-7 text-ink-soft">{sub}</p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link
            href="/free-check/"
            className="btn-solid px-[22px] py-3 text-[15px]"
          >
            {primaryLabel}
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="border-b border-line-dark pb-0.5 text-[15px] font-semibold text-ink transition-colors hover:border-ink"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
        <p className="mt-4 font-mono text-[11.5px] uppercase text-ink-faint">
          No call required · No obligation · Real data from real AI answers
        </p>
      </div>
    </section>
  );
}
