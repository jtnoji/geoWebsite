import Link from "next/link";
import { ALL_PAGES, BRAND, EMAIL, FOUNDERS, NAP } from "@/lib/site";

/**
 * v2 footer: quiet, rule-top, small type. Still carries the full page list,
 * NAP, and founder LinkedIns (website-plan.md §1) — identical on every page.
 */
export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1120px] px-5 py-10 text-[13px] text-ink-faint sm:px-8">
        <div className="flex flex-wrap justify-between gap-x-6 gap-y-8">
          <div className="max-w-xs">
            <p>
              <span className="font-bold text-ink">{BRAND}</span>
              <span className="text-ink-soft">
                {" "}· {NAP.city}, {NAP.region} ·{" "}
              </span>
              <a href={`mailto:${EMAIL}`} className="text-ink-soft hover:text-ink">
                {EMAIL}
              </a>
            </p>
            <p className="mt-3 leading-5">
              We measure whether AI engines mention your business, with sampled
              rates and named sources, never guarantees.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="font-semibold text-ink-soft">Pages</p>
            <ul className="mt-2.5 grid grid-cols-2 gap-x-8 gap-y-1.5">
              {ALL_PAGES.map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className="text-ink-soft transition-colors hover:text-ink">
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-semibold text-ink-soft">Founders</p>
            <ul className="mt-2.5 space-y-1.5">
              {FOUNDERS.map((f) => (
                <li key={f.name}>
                  <a
                    href={f.linkedin}
                    rel="noopener noreferrer"
                    className="text-ink-soft transition-colors hover:text-ink"
                  >
                    {f.name} on LinkedIn ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-line pt-5">
          © {new Date().getFullYear()} {BRAND}. We report measurements, not promises.
        </p>
      </div>
    </footer>
  );
}
