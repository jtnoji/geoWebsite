"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/site";

/**
 * Interactivity island: the mobile nav toggle. The nav LINKS also exist in the
 * footer's server-rendered page list, so no content depends on this component.
 *
 * Colours come from the header's CSS variables (globals.css, `.nav-cta` and
 * `.nav-panel`), so the button and the dropdown follow the header's dress
 * without this island knowing which page it is on.
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="nav-cta flex h-9 w-9 items-center justify-center rounded-[10px]"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          {open ? (
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          ) : (
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open && (
        <nav
          aria-label="Mobile"
          className="nav-panel absolute inset-x-0 top-[72px] shadow-[0_18px_30px_-24px_rgba(4,8,15,0.6)]"
        >
          <ul className="mx-auto w-full max-w-[1440px] px-5 py-2 sm:px-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3.5 text-[15px]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
