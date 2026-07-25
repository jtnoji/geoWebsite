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

/**
 * Hidden-text gate. A GEO company must never ship text that AI crawlers read
 * but humans do not — that is the prompt-injection signature we flag in client
 * audits. `content/learn/*.md` is production copy that anyone with commit
 * access can edit, and `marked` passes raw HTML through by default, so
 * lib/articles.ts strips it at the boundary. These tests keep that honest.
 *
 * WHY RAW HTML AND NOT THE DOM: a browser-based version of this check is
 * structurally blind. React reconciles the DOM on hydration and silently
 * DELETES injected nodes, so `page.evaluate` reports a clean page while the
 * raw bytes still carry the payload — and crawlers read the raw bytes with JS
 * off. Verified 2026-07-25: a hidden <div> planted in a built page was absent
 * from the hydrated DOM and present in the response body. Check the bytes.
 */
const HIDING_STYLE = [
  /display\s*:\s*none/i,
  /visibility\s*:\s*hidden/i,
  /opacity\s*:\s*0(?![.\d])/i,
  /font-size\s*:\s*0/i,
  /text-indent\s*:\s*-\s*\d{3,}/i,
  /(?:left|top)\s*:\s*-\s*\d{3,}\s*px/i,
  /clip(?:-path)?\s*:\s*(?:rect\(\s*0|inset\(\s*50)/i,
  /(?:width|height)\s*:\s*0(?:px)?\s*[;"']/i,
];

/** The one deliberate off-screen element: the /free-check bot honeypot. */
const HONEYPOT = "company_website";

for (const page of PAGES) {
  test(`${page.path} ships no text hidden from humans but visible to crawlers`, async ({
    request,
  }) => {
    const html = await fetchHtml(request, page.path);
    const body = html.slice(html.indexOf("<body"));

    const offenders = [...body.matchAll(/style="([^"]*)"/g)]
      .filter((m) => HIDING_STYLE.some((re) => re.test(m[1])))
      .map((m) => body.slice(m.index, m.index + 220))
      .filter((snippet) => !snippet.includes(HONEYPOT))
      // Only care when the hidden element actually carries readable text.
      .filter((snippet) => /<[^>]+>\s*[A-Za-z][A-Za-z ,.'"-]{12,}/.test(snippet));

    expect(offenders, `${page.path} has crawler-visible hidden text`).toEqual([]);
  });
}

test("rendered articles carry no raw HTML from markdown", async ({ request }) => {
  const articles = PAGES.filter(
    (p) => p.path.startsWith("/learn/") && p.path !== "/learn/"
  );
  expect(articles.length, "expected article pages to test").toBeGreaterThan(0);

  for (const article of articles) {
    const html = await fetchHtml(request, article.path);
    const body =
      html.match(/<div class="article[^"]*">([\s\S]*?)<\/div><\/div>/)?.[1] ?? "";
    expect(body.length, `${article.path} article body should render`).toBeGreaterThan(200);

    // The sanitising renderer in lib/articles.ts drops every raw-HTML token, and
    // markdown itself emits no class or style attributes. So their ABSENCE is a
    // tight invariant: any occurrence means raw HTML got through.
    expect(body, `${article.path}: raw HTML leaked into the article`).not.toMatch(
      /<script|<iframe|<style|<svg|style=|class=|aria-hidden|on[a-z]+\s*=/i
    );
    expect(body, `${article.path}: unsafe URL scheme`).not.toMatch(
      /(?:href|src)="\s*(?:javascript|data|vbscript):/i
    );
  }
});

test("404 is custom, noindex, and still one click from /free-check", async ({ request }) => {
  const res = await request.get("/404.html");
  expect(res.status()).toBe(200);
  const html = await res.text();

  expect(html, "should not be Next's stock 404").not.toContain(
    "This page could not be found"
  );
  // &rsquo; in the JSX renders as the literal character, not an entity.
  expect(html).toContain("That page isn’t here.");
  // A dead URL must not compete in search or surface in an AI answer.
  expect(html).toMatch(/<meta name="robots" content="[^"]*noindex/);
  // The funnel rule applies here too: a mistyped URL is a real visitor.
  expect(html).toContain('href="/free-check/"');
});

test("404 is absent from the sitemap", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).not.toContain("/404");
});
