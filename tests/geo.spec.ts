import { test, expect, type APIRequestContext } from "@playwright/test";
import { AI_USER_AGENTS, PAGES, SITE_WIDE_SCHEMA } from "./pages";

/**
 * The dogfood mini-audit (scaffold §5). All checks run against the RAW HTML
 * response — no browser, no JavaScript — which is exactly how AI crawlers see
 * the site (Cat 2).
 */

function extractJsonLd(html: string): Record<string, unknown>[] {
  const blocks = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    ),
  ];
  return blocks.map((m) => JSON.parse(m[1]));
}

function extractTag(html: string, re: RegExp): string | undefined {
  return html.match(re)?.[1];
}

async function fetchHtml(request: APIRequestContext, path: string) {
  const res = await request.get(path);
  expect(res.status(), `${path} should return 200`).toBe(200);
  return res.text();
}

for (const page of PAGES) {
  test.describe(page.path, () => {
    test("raw HTML contains key copy without JavaScript", async ({ request }) => {
      const html = await fetchHtml(request, page.path);
      for (const copy of page.mustContain) {
        expect(html, `raw HTML of ${page.path} should contain "${copy}"`).toContain(copy);
      }
    });

    test("JSON-LD parses and includes expected @types", async ({ request }) => {
      const html = await fetchHtml(request, page.path);
      const blocks = extractJsonLd(html);
      const types = blocks.map((b) => b["@type"]);
      for (const expected of new Set([...SITE_WIDE_SCHEMA, ...page.schemaTypes])) {
        const wanted = [...SITE_WIDE_SCHEMA, ...page.schemaTypes].filter(
          (t) => t === expected
        ).length;
        const found = types.filter((t) => t === expected).length;
        expect(
          found,
          `${page.path}: expected ${wanted}× ${expected} JSON-LD, found ${found} (types present: ${types.join(", ")})`
        ).toBeGreaterThanOrEqual(wanted);
      }
    });

    test("responds with real content to AI-bot user agents", async ({ playwright }) => {
      for (const ua of AI_USER_AGENTS) {
        const ctx = await playwright.request.newContext({
          baseURL: test.info().project.use.baseURL,
          userAgent: ua,
        });
        const res = await ctx.get(page.path);
        expect(res.status(), `${page.path} as "${ua}"`).toBe(200);
        const html = await res.text();
        expect(html, `${page.path} as "${ua}" should serve real content`).toContain(
          page.mustContain[0]
        );
        await ctx.dispose();
      }
    });
  });
}

test("every page has a unique title ≤60 chars and description ≤155 chars", async ({
  request,
}) => {
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();

  for (const page of PAGES) {
    const html = await fetchHtml(request, page.path);
    const title = extractTag(html, /<title>([^<]+)<\/title>/);
    const description = extractTag(
      html,
      /<meta name="description" content="([^"]+)"/
    );

    expect(title, `${page.path} should have a <title>`).toBeTruthy();
    expect(description, `${page.path} should have a meta description`).toBeTruthy();
    expect(title!.length, `${page.path} title "${title}" ≤60 chars`).toBeLessThanOrEqual(60);
    expect(
      description!.length,
      `${page.path} description ≤155 chars`
    ).toBeLessThanOrEqual(155);
    expect(
      titles.has(title!),
      `${page.path} title "${title}" duplicates ${titles.get(title!)}`
    ).toBe(false);
    expect(
      descriptions.has(description!),
      `${page.path} description duplicates ${descriptions.get(description!)}`
    ).toBe(false);

    titles.set(title!, page.path);
    descriptions.set(description!, page.path);
  }
});

test("robots.txt allows every AI crawler and points at the sitemap", async ({
  request,
}) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
  const body = await res.text();
  for (const bot of [
    "GPTBot",
    "ClaudeBot",
    "Claude-SearchBot",
    "PerplexityBot",
    "Google-Extended",
    "Bingbot",
    "CCBot",
  ]) {
    expect(body, `robots.txt should name ${bot}`).toContain(`User-Agent: ${bot}`);
  }
  expect(body).toContain("Sitemap:");
  expect(body).not.toContain("Disallow: /");
});

test("sitemap.xml exists, parses, and covers every page", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const xml = await res.text();
  expect(xml).toContain("<urlset");
  const urlCount = (xml.match(/<loc>/g) ?? []).length;
  expect(urlCount, "sitemap should cover all pages + articles").toBeGreaterThanOrEqual(
    PAGES.length
  );
});
