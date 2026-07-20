import Link from "next/link";
import { BRAND, NAV_LINKS } from "@/lib/site";
import MobileNav from "./MobileNav";
import NavHighlighter from "./NavHighlighter";

/**
 * Locked-system header (mockup `.nav`): 58px rule-bottom bar, 14px/600 links
 * in body color, active page underlined in ink, and the free-check CTA as the
 * solid BLACK nav button (black is punctuation — this is one of its few
 * allowed fills). Sticky so the primary CTA is always visible.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <NavHighlighter />
      <div className="mx-auto flex h-[58px] max-w-[1120px] items-center gap-8 px-5 sm:px-8">
        <Link href="/" className="text-base font-bold tracking-[-0.02em] text-ink">
          {BRAND}
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-6 lg:flex">
          {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-[18px] text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/free-check/"
            className="whitespace-nowrap rounded-md bg-ink px-4 py-2 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent"
          >
            Free visibility check →
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-4 lg:hidden">
          <Link
            href="/free-check/"
            className="whitespace-nowrap rounded-md bg-ink px-3 py-2 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent"
          >
            Free check →
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
