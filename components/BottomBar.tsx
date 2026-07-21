import Link from "next/link";

/**
 * The persistent bottom CTA bar — the signature element of this system
 * (mockup/weir-style.html). Fixed to the viewport bottom on every route, with
 * a full-width wave riding its top edge. Body carries a 78px bottom padding
 * (globals.css) so it never covers the footer.
 *
 * Server-rendered: it is the ≤1-click route to /free-check from every page
 * (funnel.spec.ts), so it must exist in the raw exported HTML.
 */
export default function BottomBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
      <svg
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="block h-8 w-full"
      >
        <path
          d="M0,26 C240,6 460,6 700,24 C940,42 1200,42 1440,16 L1440,40 L0,40 Z"
          fill="var(--color-band)"
        />
      </svg>
      <div className="pointer-events-auto flex justify-center bg-band px-5 py-[15px]">
        <Link
          href="/free-check/"
          className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:text-accent"
        >
          Get your free AI check
        </Link>
      </div>
    </div>
  );
}
