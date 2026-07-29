import type { CSSProperties } from "react";

/**
 * Stagger a `[data-reveal]` element. See the scroll-reveal block in
 * app/globals.css and components/ScrollReveal.tsx.
 *
 * Lives here rather than in each page because every route reveals now, and a
 * per-file copy of the CSSProperties cast is the kind of thing that drifts.
 * The reveal itself needs no import: ScrollReveal is mounted once in
 * layout.tsx and observes `[data-reveal]` on every route, so a page opts in
 * with the bare attribute and only needs this when siblings should cascade.
 */
export const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;
