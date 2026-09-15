import Link from "next/link";
import { OFFER_CTA } from "@/lib/site";
import { SECTION } from "@/lib/layout";

/**
 * Closing CTA for every page except home (home closes on the ClosingCta
 * band): a white band, a heading, one line, the navy button to /free-check
 * and an optional quiet text link. The primary always routes to /free-check,
 * the ≤1-click funnel rule funnel.spec.ts enforces.
 *
 * Left-aligned by default, like every head in the Sable design. `centered` is
 * for the pages centred by founder decision (/our-score).
 */
export default function Cta({
  heading = "Find out what AI says about you. Free.",
  sub = "Takes one minute. We'll email your report within 1–2 business days.",
  primaryLabel = OFFER_CTA,
  secondaryLabel,
  secondaryHref,
  centered = false,
}: {
  heading?: string;
  sub?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  centered?: boolean;
}) {
  return (
    <section className="border-t border-line bg-white">
      <div data-reveal className={`${SECTION} ${centered ? "text-center" : ""}`}>
        <h2
          className={`display max-w-[20ch] text-[clamp(30px,3.6vw,48px)] leading-[1.06] text-ink text-pretty ${
            centered ? "mx-auto" : ""
          }`}
        >
          {heading}
        </h2>
        <p
          className={`mt-4 max-w-[52ch] text-[16px] leading-[1.7] text-ink-soft ${
            centered ? "mx-auto" : ""
          }`}
        >
          {sub}
        </p>
        <div
          className={`mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 ${
            centered ? "justify-center" : ""
          }`}
        >
          <Link href="/free-check/" className="btn btn-navy px-7 py-4 text-[16px]">
            {`${primaryLabel} `}
            <span aria-hidden="true">→</span>
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="border-b border-line-dark pb-0.5 text-[15px] font-medium text-ink transition-colors hover:border-ink"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
        <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-faint">
          No call required · No obligation
        </p>
      </div>
    </section>
  );
}
