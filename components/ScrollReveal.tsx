"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Presentation-only island: reveals `[data-reveal]` elements as they scroll
 * into view. Like NavHighlighter, it renders nothing and owns no copy — the
 * sections stay server components, and this only toggles a class on them.
 *
 * The hidden state lives behind `html.js-reveal`, which the inline script in
 * app/layout.tsx adds before first paint. With JavaScript off — how AI crawlers
 * read the site — that class never lands and nothing is ever hidden.
 *
 * One-shot: each element is unobserved once it has revealed, so scrolling back
 * up never re-hides or re-animates anything.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // The inline script armed a failsafe that strips `js-reveal` if this island
    // never mounts (JS error, hydration failure). We're here, so disarm it.
    const w = window as Window & { __revealFailsafe?: ReturnType<typeof setTimeout> };
    clearTimeout(w.__revealFailsafe);

    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (targets.length === 0) return;

    const reveal = (el: Element) => el.classList.add("is-in");

    // Reduced motion and no-IntersectionObserver both mean: just show it.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      targets.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      // Hold the reveal until the element is a little way up from the bottom
      // edge, so it animates into a comfortable reading position rather than
      // firing the instant one pixel clears the fold.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
