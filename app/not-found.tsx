import type { Metadata } from "next";
import Link from "next/link";
import { SECTION_X } from "@/lib/layout";
import { delay } from "@/lib/reveal";
import { ALL_PAGES, OFFER_CTA } from "@/lib/site";

/**
 * Custom 404. Under `output: 'export'` this renders to out/404.html, which is
 * what Vercel serves for an unmatched path on a static deploy.
 *
 * It still routes to /free-check in one click, which is the funnel rule every
 * other page follows (funnel.spec.ts). A mistyped URL is a real visitor.
 *
 * Full width and left-aligned like every page since 2026-09-14; it used to be
 * centred. The page list runs across the width as a grid.
 */

/**
 * The noindex is now EXPLICIT, and it has to be.
 *
 * Next adds a noindex tag to 404s on its own, which was enough while the root
 * layout declared no robots metadata. Once layout.tsx started sending
 * `index, follow, max-snippet:-1, ...` site-wide (2026-07-31), this page
 * inherited it and shipped two contradictory robots tags in one head.
 * Crawlers resolve that to the most restrictive reading, so the page was still
 * noindex, but "it happens to resolve correctly" is not a control.
 *
 * Note the built page still carries TWO robots tags: Next's own `noindex` plus
 * this one. They now agree (`noindex` and `noindex, nofollow`) instead of
 * contradicting, which is the part that matters. Next's tag is injected
 * outside the metadata system and cannot be suppressed from here.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
export default function NotFound() {
  return (
    <div className={`${SECTION_X} py-24 md:py-32`}>
      <div data-reveal>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-ink-faint">
          404
        </p>
        <h1 className="display mt-4 text-[clamp(40px,4.4vw,96px)] leading-[1.05] text-ink">
          That page isn&rsquo;t here.
        </h1>
        <p className="mt-5 max-w-[52ch] text-[clamp(16px,1.111vw,20px)] leading-[1.7] text-ink-soft">
          The link may be old, or we may have moved something. Everything on the
          site is one click away below.
        </p>
      </div>

      <div data-reveal style={delay(110)} className="mt-9 flex flex-wrap items-center gap-4">
        <Link href="/free-check/" className="btn btn-navy px-[26px] py-[15px] text-[15px]">
          {`${OFFER_CTA} `}
          <span aria-hidden="true">→</span>
        </Link>
        <Link href="/" className="btn btn-outline px-[26px] py-[15px] text-[15px]">
          Back to home
        </Link>
      </div>

      <nav
        data-reveal
        style={delay(220)}
        aria-label="All pages"
        className="mt-16 border-t-2 border-ink pt-5"
      >
        <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.06em] text-ink-faint">
          Every page
        </h2>
        <ul className="mt-4 grid gap-x-8 gap-y-2.5 text-[clamp(14px,0.972vw,17px)] sm:grid-cols-2 lg:grid-cols-4 wide:grid-cols-6">
          {ALL_PAGES.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                className="font-semibold text-ink transition-colors hover:text-accent"
              >
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
