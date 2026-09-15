import Link from "next/link";
import { OFFER_CTA } from "@/lib/site";
import { HEAD_SPLIT, SECTION } from "@/lib/layout";

/**
 * Closing CTA for every page except home (home closes on the ClosingCta
 * band): a white band, a heading, one line, the navy button to /free-check
 * and an optional quiet text link. The primary always routes to /free-check,
 * the ≤1-click funnel rule funnel.spec.ts enforces.
 *
 * Left-aligned, like every head in the Sable design, and full width: from
 * 1600px the band splits into the heading on the left and the rest on the
 * right, so it spans the page instead of sitting in its left half.
 */
export default function Cta({
  heading = "Find out what AI says about you. Free.",
  sub = "Takes one minute. We'll email your report within 1–2 business days.",
  primaryLabel = OFFER_CTA,
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
    <section className="border-t border-line bg-white">
      <div data-reveal="stagger" className={`${SECTION} ${HEAD_SPLIT}`}>
        <h2 className="display max-w-[20ch] text-[clamp(30px,3.6vw,76px)] leading-[1.06] text-ink text-pretty">
          {heading}
        </h2>
        <div className="min-w-0">
          <p className="max-w-[52ch] text-[clamp(16px,1.111vw,20px)] leading-[1.7] text-ink-soft">
            {sub}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/free-check/"
              className="btn btn-navy px-7 py-4 text-[16px] wide:px-9 wide:py-5 wide:text-[18px]"
            >
              {`${primaryLabel} `}
              <span aria-hidden="true">→</span>
            </Link>
            {secondaryLabel && secondaryHref && (
              <Link
                href={secondaryHref}
                className="border-b border-line-dark pb-0.5 text-[clamp(15px,1.042vw,18px)] font-medium text-ink transition-colors hover:border-ink"
              >
                {secondaryLabel}
              </Link>
            )}
          </div>
          <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-faint">
            No call required · No obligation
          </p>
        </div>
      </div>
    </section>
  );
}
