import Link from "next/link";
import { BRAND, NAV_LINKS } from "@/lib/site";
import MobileNav from "./MobileNav";
import NavHighlighter from "./NavHighlighter";

/**
 * Weir-system header: 78px, sticky, NO bottom border — it dissolves into the
 * page gradient via a top-down fade plus a backdrop blur. Wordmark left; nav
 * links are 12.5px uppercase in body colour, the active page picking up the
 * gold underline (NavHighlighter) at the bar's bottom edge; the free-check CTA
 * is the navy pill. Sticky so the primary CTA is always visible.
 */
export default function Header() {
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-[10px]"
      style={{
        background:
          "linear-gradient(180deg, rgba(220,229,246,0.92), rgba(220,229,246,0))",
      }}
    >
      <NavHighlighter />
      <div className="mx-auto flex h-[78px] max-w-[1200px] items-center gap-8 px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="text-[25px] font-semibold tracking-[-0.01em] text-ink"
        >
          {BRAND}
        </Link>

        <nav
          aria-label="Main"
          className="ml-auto hidden items-center gap-[34px] lg:flex"
        >
          {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-nav-link
              className="whitespace-nowrap py-[27px] text-[12.5px] font-medium uppercase tracking-[0.1em] text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/free-check/"
            className="btn-pill px-[22px] py-[13px] text-[12.5px] tracking-[0.12em]"
          >
            Free check <span className="text-[15px]">&#10230;</span>
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-4 lg:hidden">
          <Link
            href="/free-check/"
            className="btn-pill px-4 py-2.5 text-[12px] tracking-[0.1em]"
          >
            Free check <span className="text-[14px]">&#10230;</span>
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
