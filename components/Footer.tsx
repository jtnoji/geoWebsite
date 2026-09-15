import Link from "next/link";
import { SECTION_X } from "@/lib/layout";
import { ALL_PAGES, BRAND, EMAIL, FOUNDERS, NAP } from "@/lib/site";
import { Lockup } from "./Plume";

/**
 * The Sable footer (mockup/sable-site.dc.html): the night band that closes
 * every page. The design draws a lockup, a one-line description, the header's
 * links and a contact column. It also keeps what website-plan §1 requires of
 * the footer, identical on every page: the FULL page list (so /learn and every
 * other page stays one internal link away from anywhere), NAP, and both
 * founders' LinkedIns.
 */
export default function Footer() {
  return (
    <footer className="bg-night text-white/72">
      <div
        className={`${SECTION_X} grid gap-10 pb-[30px] pt-[70px] sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1fr)]`}
      >
        <div>
          <Lockup
            u={7}
            size={22}
            tone="dark"
            subline="AI SEO"
            layout="stack"
            className="text-white"
          />
          <p className="mt-[18px] max-w-[32ch] text-[15px] leading-[1.65]">
            We measure where your business appears in AI answers, and fix what
            keeps you out.
          </p>
          <p className="mt-3 text-[14px] text-white/60">
            {NAP.city}, {NAP.region}
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-sky">
            Site
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3">
            {ALL_PAGES.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="text-[15px] text-white/72 transition-colors hover:text-white"
                >
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-sky">
            Contact
          </p>
          <ul className="mt-4 flex flex-col gap-3 text-[15px]">
            <li>
              <a
                href={`mailto:${EMAIL}`}
                className="text-white/72 transition-colors hover:text-white"
              >
                {EMAIL}
              </a>
            </li>
            {FOUNDERS.map((f) => (
              <li key={f.name}>
                <a
                  href={f.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/72 transition-colors hover:text-white"
                >
                  {f.name} on LinkedIn ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={`${SECTION_X} flex flex-wrap justify-between gap-x-6 gap-y-2 pb-[34px] font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/60`}
      >
        <p>
          © {new Date().getFullYear()} {BRAND}
        </p>
        <p>We report measurements, not promises</p>
      </div>
    </footer>
  );
}
