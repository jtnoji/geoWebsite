"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Presentation-only island: marks the current page's nav link with the ink
 * underline (mockup `nav.links a.on`). The links themselves stay in the
 * server-rendered Header — without JS every link still exists and works;
 * only the underline decoration is progressive.
 */
export default function NavHighlighter() {
  const pathname = usePathname();

  useEffect(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>("nav[aria-label='Main'] a");
    links.forEach((link) => {
      const href = link.getAttribute("href") ?? "";
      const on = href !== "/" && pathname.startsWith(href.replace(/\/$/, ""));
      link.classList.toggle("nav-on", on);
    });
  }, [pathname]);

  return null;
}
