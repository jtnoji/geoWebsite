import { getAllArticles } from "@/lib/articles";
import { BRAND, DOMAIN } from "@/lib/site";

export const dynamic = "force-static";

/**
 * RSS 2.0 feed for /learn.
 *
 * A Route Handler rather than a file in `public/`, for the same reason
 * `app/security.txt/route.ts` is one: the brand and domain come from
 * lib/site.ts, so the launch swap stays a one-file change, and the item list
 * comes from the same `getAllArticles()` that renders the /learn index and
 * fills the sitemap. One source, three surfaces.
 *
 * Why a feed when the site deliberately ships no llms.txt: the objection to
 * llms.txt is that nothing consumes it, so publishing one is theater we would
 * flag in a client audit. RSS is the opposite case. It is a thirty-year-old
 * format with real consumers, and it costs one static file.
 *
 * No `<lastBuildDate>`. It would change on every deploy whether or not an
 * article did, which is the same fabricated-freshness problem that keeps
 * `lastModified` off the static pages in app/sitemap.ts.
 */

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** "2026-07-21" -> "Tue, 21 Jul 2026 00:00:00 GMT" (RFC 822, as RSS wants). */
function rfc822(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toUTCString();
}

export function GET() {
  const items = getAllArticles()
    .map((a) => {
      const url = `${DOMAIN}/learn/${a.slug}/`;
      return [
        "    <item>",
        `      <title>${xmlEscape(a.title)}</title>`,
        `      <link>${xmlEscape(url)}</link>`,
        `      <guid isPermaLink="true">${xmlEscape(url)}</guid>`,
        `      <pubDate>${rfc822(a.date)}</pubDate>`,
        `      <dc:creator>${xmlEscape(a.author)}</dc:creator>`,
        `      <description>${xmlEscape(a.description)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
    "  <channel>",
    `    <title>${xmlEscape(BRAND)} · Learn</title>`,
    `    <link>${xmlEscape(`${DOMAIN}/learn/`)}</link>`,
    "    <description>Plain answers about AI search: how engines pick which businesses to name, and how to measure it.</description>",
    "    <language>en-us</language>",
    `    <atom:link href="${xmlEscape(`${DOMAIN}/feed.xml`)}" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
