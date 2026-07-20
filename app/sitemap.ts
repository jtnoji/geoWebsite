import type { MetadataRoute } from "next";
import { ALL_PAGES, DOMAIN } from "@/lib/site";
import { getAllArticles } from "@/lib/articles";

export const dynamic = "force-static";

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
