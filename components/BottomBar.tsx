import Link from "next/link";
import { OFFER_CTA } from "@/lib/site";

/**
 * The persistent bottom CTA bar. Fixed to the viewport bottom on every route;
 * body carries a 62px bottom padding (globals.css) so it never covers the
 * footer.
 *
 * The weir system rode a decorative wave on this bar's top edge. That wave was
 * a gradient-era flourish: it read as a shape cut out of a coloured band. On
 * the flat paper ground the same bar is a white plane closed by a hairline,
 * which is how every other surface in the Berkeley system separates itself.
 *
 * Server-rendered: it is the ≤1-click route to /free-check from every page
 * (funnel.spec.ts), so it must exist in the raw exported HTML.
 */
export default function BottomBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line-dark bg-band">
      <div className="flex justify-center px-5 py-[18px]">
        <Link
          href="/free-check/"
          className="inline-flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:text-accent"
        >
          {OFFER_CTA}
        </Link>
      </div>
    </div>
  );
}
