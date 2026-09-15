import Link from "next/link";
import { BRAND, NAV_LINKS, OFFER_SHORT } from "@/lib/site";
import MobileNav from "./MobileNav";
import NavHighlighter from "./NavHighlighter";
import { Lockup } from "./Plume";

/**
 * The Sable header (mockup/sable-site.dc.html): fixed, translucent, blurred,
 * and dressed by the page underneath it. The dress lives in globals.css under
 * `.site-header`: a page whose first section is a dark band marks it
 * `data-hero="dark"`, and every colour here flips through CSS variables. So
 * this stays a server component with nothing to decide at runtime.
 *
 * Lockup left with the "AI SEO" subline on the wordmark's baseline (Josh,
 * 2026-08-02). Nav links sentence case, the current page underlined by
 * NavHighlighter. The CTA is an outline pill.
 *
 * Fixed, so the primary CTA is visible on every page without scrolling back up
 * (website-plan §1). It replaced the persistent bottom CTA bar, which the
 * design does not have.
 *
 * The full nav appears at `lg` (1024px); below that it is the MobileNav
 * dropdown beside the CTA. The dropdown is the wanted behaviour below 1024,
 * not a fallback (Josh, 2026-08-02).
 */
export default function Header() {
  return (
    <header className="site-header fixed inset-x-0 top-0 z-40">
      <NavHighlighter />
      <div className="mx-auto flex h-[72px] w-full max-w-[1440px] items-center gap-6 px-5 sm:px-8">
        <Link href="/" aria-label={`${BRAND}, home`} className="shrink-0">
          <Lockup u={7} size={21} tone="header" subline="AI SEO" />
        </Link>

        <nav
          aria-label="Main"
          className="ml-auto hidden items-center gap-[22px] lg:flex"
        >
          {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-nav-link
              className="nav-link whitespace-nowrap pb-[3px] text-[15px] tracking-[-0.005em]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/free-check/"
            className="nav-cta ml-1 whitespace-nowrap rounded-full px-5 py-2.5 text-[14.5px] font-medium tracking-[-0.005em]"
          >
            {`${OFFER_SHORT} `}
            <span aria-hidden="true">→</span>
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:hidden">
          <Link
            href="/free-check/"
            className="nav-cta whitespace-nowrap rounded-full px-4 py-2 text-[13.5px] font-medium"
          >
            {`${OFFER_SHORT} `}
            <span aria-hidden="true">→</span>
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
