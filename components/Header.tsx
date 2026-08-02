import Link from "next/link";
import { BRAND, NAV_LINKS, OFFER_SHORT } from "@/lib/site";
import MobileNav from "./MobileNav";
import NavHighlighter from "./NavHighlighter";
import { Lockup } from "./Plume";

/**
 * Berkeley-system header (brand sheet §06, mockup/sable-brand-sheet.html): an
 * opaque Berkeley-navy band, 64px, sticky. Plume lockup left, the mark at
 * ~20px so all three plumes survive the §03 reduction rule; nav links sentence
 * case in white at 72%, the active page picking up the Sky underline
 * (NavHighlighter); the free-check CTA is the inverted white pill.
 *
 * The lockup carries the "AI SEO" subline (brand sheet §02). The sheet's own
 * §06 header mockup shows mark + wordmark alone, so this is a deliberate
 * departure: Josh asked for it on 2026-08-02, which is the copy sign-off the
 * CLAUDE.md invariant requires. It also does real work — the wordmark is a
 * coined name that says nothing about the product on its own.
 *
 * Replaces the weir header, which was a translucent gradient dissolving into
 * the page. That trick needed a gradient ground to dissolve INTO — this system
 * has a flat paper ground, so the header states itself instead.
 *
 * Sticky so the primary CTA is always visible.
 *
 * The full nav appears from `md` (768px), not `lg` as the weir header did.
 * That header was 78px tall with uppercase, wide-tracked links that genuinely
 * could not fit below 1024; these are 12.5px sentence case, so at 768 the old
 * breakpoint left a half-empty bar with the links hidden behind a hamburger
 * for no reason. The gap tightens to 18px in the md–lg range to buy the room
 * and opens back to 30px above it. If a nav link is ever added, re-check 768
 * before assuming it still fits.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-ink">
      <NavHighlighter />
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-8 px-5 sm:px-8 lg:px-10">
        <Link href="/" aria-label={`${BRAND}, home`} className="text-white">
          <Lockup u={7} size={24} tone="navy" subline="AI SEO" />
        </Link>

        <nav
          aria-label="Main"
          className="ml-auto hidden items-center gap-[18px] md:flex lg:gap-[30px]"
        >
          {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-nav-link
              className="whitespace-nowrap py-[21px] text-[12.5px] tracking-[0.04em] text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/free-check/"
            className="btn-pill-invert px-[20px] py-[11px] text-[11px]"
          >
            {OFFER_SHORT} <span className="text-[14px]">&#10230;</span>
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-4 md:hidden">
          <Link
            href="/free-check/"
            className="btn-pill-invert px-4 py-2.5 text-[10.5px]"
          >
            {OFFER_SHORT} <span className="text-[13px]">&#10230;</span>
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
