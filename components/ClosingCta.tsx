import Link from "next/link";
import Beams from "./Beams";
import { CLOSING } from "@/lib/home";
import { SECTION_X } from "@/lib/layout";
import { OFFER } from "@/lib/site";

/**
 * The closing band on home (mockup/sable-site.dc.html): full-bleed night with
 * the light beams, the ask, and the primary action in Sky. Left-aligned like
 * every head in the Sable design.
 *
 * Fills the viewport from lg up, as drawn. On phones and tablets it takes its
 * content's height: a mostly empty screen of beams there reads as a gap, not
 * as emphasis.
 */
export default function ClosingCta() {
  return (
    <section className="relative flex items-center overflow-hidden bg-night text-white lg:min-h-screen">
      <Beams variant="band" />
      <div
        data-reveal="stagger"
        className={`relative ${SECTION_X} py-20 md:py-[100px]`}
      >
        <h2 className="display max-w-[16ch] text-[clamp(38px,5vw,108px)] leading-[1.04] text-white text-pretty">
          {`${CLOSING.heading} `}
          <span className="text-sky">{CLOSING.headingAccent}</span>
        </h2>
        <p className="mt-[22px] max-w-[50ch] text-[clamp(16.5px,1.146vw,20.5px)] leading-[1.7] text-white/88">
          {CLOSING.body}
        </p>
        <div className="mt-[34px] flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link
            href="/free-check/"
            className="btn btn-sky px-7 py-4 text-[16.5px] sm:px-[30px] sm:py-[17px] wide:px-9 wide:py-5 wide:text-[19px]"
          >
            {`Run my ${OFFER} `}
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/pricing/"
            className="border-b border-white/30 pb-0.5 text-[clamp(15px,1.042vw,19px)] text-white/85 transition-colors hover:text-white"
          >
            See pricing
          </Link>
        </div>
        <p className="mt-4 text-[clamp(13.5px,0.9375vw,16px)] text-white/70">
          {CLOSING.fineprint}
        </p>
      </div>
    </section>
  );
}
