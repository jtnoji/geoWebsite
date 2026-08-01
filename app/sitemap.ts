import type { MetadataRoute } from "next";
import { ALL_PAGES, DOMAIN } from "@/lib/site";
import { getAllArticles } from "@/lib/articles";

export const dynamic = "force-static";

/**
 * NO `lastModified` ON THE STATIC PAGES, and that is a decision, not an
 * oversight (reviewed 2026-07-31).
 *
 * Articles get one because `content/learn/*.md` carries a real `date`. The ten
 * routes in ALL_PAGES have no honest source for one. Source-file mtimes are
 * the checkout time on a fresh Vercel build, so emitting them would tell every
 * engine that all ten pages changed on every deploy — a fabricated freshness
 * signal, and precisely the sort of thing this company's own audit flags in a
 * client's sitemap. An absent lastmod is simply ignored; a false one is a lie
 * that gets believed. Add it only when a real per-page edit date exists.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ALL_PAGES.map((page) => ({
    url: `${DOMAIN}${page.href}`,
    changeFrequency: "weekly" as const,
    priority: page.href === "/" || page.href === "/free-check/" ? 1 : 0.7,
  }));

  const articles = getAllArticles().map((article) => ({
    url: `${DOMAIN}/learn/${article.slug}/`,
    lastModified: article.date,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...pages, ...articles];
}
