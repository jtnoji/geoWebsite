import Link from "next/link";
import { OFFER_CTA } from "@/lib/site";
import { SECTION } from "@/lib/layout";

/**
 * The closing band on home: full-bleed Berkeley navy, centered, inverted
 * white primary (a navy pill on navy would be invisible).
 * Centering is allowed here under the alignment rule — this is the page's
 * closing head, the same slot <Cta centered /> fills on the other routes.
 *
 * The fine print states the no-guarantees posture one last time, in the same
 * words as HonestyBlock.
 */
export default function ClosingCta() {
  return (
    <section className="bg-ink text-white">
      <div
        data-reveal
        className={`${SECTION} text-center`}
      >
        <h2 className="display mx-auto max-w-[960px] text-[clamp(36px,5.6vw,68px)] leading-[1.1] text-white text-pretty">
          Your customers are asking AI who to hire. Find out what it says.
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/free-check/"
            className="btn-pill-invert px-[30px] py-4 text-[12px]"
          >
            {OFFER_CTA} <span className="text-base">&#10230;</span>
          </Link>
          <Link
            href="/pricing/"
            className="btn-pill-ghost px-[30px] py-4 text-[12px]"
          >
            See pricing
          </Link>
        </div>
        <p className="mt-7 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-white/50">
          Free · 1–2 business days · No call · No guarantees, ever
        </p>
      </div>
    </section>
  );
}
