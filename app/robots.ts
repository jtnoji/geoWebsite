import type { MetadataRoute } from "next";
import { DOMAIN } from "@/lib/site";

export const dynamic = "force-static";

/**
 * Explicit Allow groups for every major AI crawler (Cat 1). An explicit
 * per-bot allow is the point: it survives a later `*` policy change and is
 * what our own audit checks clients for.
 */
const AI_BOTS = [
  "GPTBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended",
  "Bingbot",
  "CCBot",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...AI_BOTS.map((bot) => ({ userAgent: bot, allow: "/" })),
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${DOMAIN}/sitemap.xml`,
  };
}
