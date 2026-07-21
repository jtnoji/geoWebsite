"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/site";

/**
 * Interactivity island: the mobile nav toggle. The nav LINKS also exist in the
 * footer's server-rendered page list, so no content depends on this component.
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
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-line-dark bg-white/50 text-ink"
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
          className="absolute inset-x-0 top-[78px] border-b border-line bg-band"
        >
          <ul className="mx-auto max-w-[1120px] px-5 py-2 sm:px-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line py-3 text-sm text-ink last:border-b-0"
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
