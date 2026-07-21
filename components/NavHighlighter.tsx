"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Presentation-only island: marks the current page's nav link with the gold
 * underline. The links themselves stay in the server-rendered Header —
 * without JS every link still exists and works; only the underline decoration
 * is progressive.
 *
 * Scoped to [data-nav-link] so it never matches the free-check CTA pill, which
 * also lives inside this nav — on /free-check/ the inset underline would
 * otherwise trace a gold arc around the pill's 999px radius.
 */
export default function NavHighlighter() {
  const pathname = usePathname();

  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>(
      "nav[aria-label='Main'] a[data-nav-link]",
    );
    links.forEach((link) => {
      const href = link.getAttribute("href") ?? "";
      const on = href !== "/" && pathname.startsWith(href.replace(/\/$/, ""));
      link.classList.toggle("nav-on", on);
    });
  }, [pathname]);

  return null;
}
