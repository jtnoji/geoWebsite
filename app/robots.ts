import type { MetadataRoute } from "next";
import { AI_BOT_TOKENS } from "@/lib/crawlers";
import { DOMAIN } from "@/lib/site";

export const dynamic = "force-static";

/**
 * Explicit Allow groups for every major AI crawler (Cat 1). An explicit
 * per-bot allow is the point: it survives a later `*` policy change and is
 * what our own audit checks clients for.
 *
 * The roster comes from lib/crawlers.ts, which is also what the crawler log on
 * /our-score reports against. One list, so we can never publish traffic for a
 * bot we stopped allowing.
 */

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...AI_BOT_TOKENS.map((bot) => ({ userAgent: bot, allow: "/" })),
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${DOMAIN}/sitemap.xml`,
  };
}
