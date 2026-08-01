import { test, expect, type APIRequestContext } from "@playwright/test";
import { AI_USER_AGENTS, PAGES, SITE_WIDE_SCHEMA } from "./pages";
import { AI_BOT_TOKENS } from "../lib/crawlers";
import { ORG_ID, SERVICE_ID, SITE_ID } from "../lib/schema";
import { DOMAIN } from "../lib/site";

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

/**
 * Raw HTML escapes text-node characters (`Why doesn&#x27;t ...`) while the same
 * string inside a JSON-LD block keeps the literal (`Why doesn't ...`). Comparing
 * the two without decoding fails on every title with an apostrophe.
 */
function decodeEntities(s: string): string {
  return s
    .replace(/&#x27;|&apos;|&#39;/g, "'")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x2F;/g, "/")
    .replace(/&amp;/g, "&");
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
  // Iterates the roster rather than a hardcoded list, so robots.txt and
  // lib/crawlers.ts cannot drift apart. That list is also what /our-score
  // publishes traffic against: publishing a number for a bot we quietly
  // stopped allowing is the unverifiable claim we audit clients for.
  for (const bot of AI_BOT_TOKENS) {
    expect(body, `robots.txt should name ${bot}`).toContain(`User-Agent: ${bot}`);
  }
  expect(body).toContain("Sitemap:");
  expect(body).not.toContain("Disallow: /");
});

/**
 * The roster must name the crawlers that fetch to ANSWER, not only the ones
 * that fetch to TRAIN. Shipping without these is invisible: `*: Allow: /`
 * still lets them in, so nothing breaks, and the explicit list silently stops
 * covering the bots that actually decide whether a page can be cited.
 */
test("robots.txt names the live-answer fetchers, not just training crawlers", async ({
  request,
}) => {
  const body = await (await request.get("/robots.txt")).text();
  for (const bot of [
    "OAI-SearchBot", // the index ChatGPT search cites from
    "ChatGPT-User", // the fetch a user's question triggers
    "Googlebot", // what AI Overviews actually read
    "Claude-User",
    "Perplexity-User",
  ]) {
    expect(body, `robots.txt should name ${bot}`).toContain(`User-Agent: ${bot}`);
  }
});

/**
 * Canonicals. Zero pages had one until 2026-07-31, because scaffold.md claimed
 * `metadataBase` emitted them and it does not — it only resolves relative
 * metadata URLs. Asserting the exact URL, not just the tag's presence, is what
 * makes this catch a copy-pasted path on a new page.
 */
test("every page declares its own canonical URL", async ({ request }) => {
  for (const page of PAGES) {
    const html = await fetchHtml(request, page.path);
    const canonical = extractTag(
      html,
      /<link rel="canonical" href="([^"]+)"/
    );
    expect(canonical, `${page.path} should have a canonical link`).toBeTruthy();
    expect(canonical, `${page.path} canonical points at the wrong URL`).toBe(
      `${DOMAIN}${page.path}`
    );
  }
});

/**
 * Snippet permissions. A company selling "get quoted in AI answers" should not
 * leave the quotable length at the engine's default cap.
 */
test("every page permits full-length snippets and large image previews", async ({
  request,
}) => {
  for (const page of PAGES) {
    const html = await fetchHtml(request, page.path);
    const robots = extractTag(html, /<meta name="robots" content="([^"]+)"/);
    expect(robots, `${page.path} should declare robots directives`).toBeTruthy();
    expect(robots, `${page.path} must stay indexable`).toContain("index");
    expect(robots, `${page.path} caps snippet length`).toContain("max-snippet:-1");
    expect(robots, `${page.path} caps image previews`).toContain(
      "max-image-preview:large"
    );
  }
});

/**
 * The graph has to resolve to ONE company. Two same-named, same-URL nodes with
 * no `@id` and no relation between them is an entity an engine cannot merge,
 * which is what this site shipped until 2026-07-31.
 */
test("the site-wide schema graph is @id-linked to one entity", async ({
  request,
}) => {
  const html = await fetchHtml(request, "/");
  const blocks = extractJsonLd(html);
  const byType = (t: string) => blocks.find((b) => b["@type"] === t);

  const organization = byType("Organization");
  const site = byType("WebSite");
  const svc = byType("ProfessionalService");

  expect(organization?.["@id"], "Organization needs a stable @id").toBe(ORG_ID);
  expect(site?.["@id"], "WebSite needs a stable @id").toBe(SITE_ID);
  expect(svc?.["@id"], "ProfessionalService needs a stable @id").toBe(SERVICE_ID);

  // WebSite is published by the Organization, and the service belongs to it.
  expect(site?.publisher, "WebSite should reference the Organization").toEqual({
    "@id": ORG_ID,
  });
  expect(
    svc?.parentOrganization,
    "ProfessionalService should reference the Organization, not restate it"
  ).toEqual({ "@id": ORG_ID });

  // The brand mark, so the entity has a logo to attach.
  expect(organization?.logo, "Organization should carry a logo").toMatchObject({
    "@type": "ImageObject",
  });
});

test("every page's WebPage node is part of the site and matches its title", async ({
  request,
}) => {
  for (const page of PAGES) {
    const html = await fetchHtml(request, page.path);
    const blocks = extractJsonLd(html);
    const node = blocks.find((b) =>
      ["WebPage", "AboutPage", "ContactPage", "CollectionPage"].includes(
        String(b["@type"])
      )
    );

    expect(node, `${page.path} should emit a WebPage node`).toBeTruthy();
    expect(node?.url, `${page.path} WebPage url`).toBe(`${DOMAIN}${page.path}`);
    expect(node?.isPartOf, `${page.path} WebPage should be part of the site`).toEqual({
      "@id": SITE_ID,
    });

    // PageSchema is fed the page's own metadata object, so its name is the
    // page title minus the " · [Brand]" suffix the layout template appends.
    // If someone hand-types a name instead, this catches it.
    const title = decodeEntities(extractTag(html, /<title>([^<]+)<\/title>/) ?? "");
    expect(
      title,
      `${page.path}: WebPage name "${node?.name}" is not in <title> "${title}"`
    ).toContain(String(node?.name));
  }
});

/**
 * E-E-A-T: articles are written by a named founder. The markdown frontmatter
 * has carried `author` since the articles were written, but until 2026-07-31
 * the schema credited the Organization and the page rendered no byline at all.
 * Schema must never state what the page does not show, so this checks both.
 */
test("articles are credited to a named person, visibly and in schema", async ({
  request,
}) => {
  const articles = PAGES.filter(
    (p) => p.path.startsWith("/learn/") && p.path !== "/learn/"
  );
  expect(articles.length, "expected article pages to test").toBeGreaterThan(0);

  for (const page of articles) {
    const html = await fetchHtml(request, page.path);
    const node = extractJsonLd(html).find((b) => b["@type"] === "Article");
    const author = node?.author as Record<string, unknown> | undefined;

    expect(author?.["@type"], `${page.path} author should be a Person`).toBe("Person");
    expect(author?.["@id"], `${page.path} author needs a stable @id`).toContain(
      "/about/#"
    );
    expect(node?.dateModified, `${page.path} needs a dateModified`).toBeTruthy();
    expect(node?.mainEntityOfPage, `${page.path} should link its WebPage node`).toEqual(
      { "@id": `${DOMAIN}${page.path}#webpage` }
    );

    // The visible byline, in the raw bytes a crawler reads.
    const name = String(author?.name);
    const body = html.slice(html.indexOf("<body"));
    expect(body, `${page.path}: schema credits ${name} but the page shows no byline`).toContain(name);
  }
});

test("the /learn feed exists, is valid RSS, and lists every article", async ({
  request,
}) => {
  const res = await request.get("/feed.xml");
  expect(res.status()).toBe(200);
  const xml = await res.text();

  expect(xml).toContain('<rss version="2.0"');
  expect(xml).toContain(`<link>${DOMAIN}/learn/</link>`);

  const articles = PAGES.filter(
    (p) => p.path.startsWith("/learn/") && p.path !== "/learn/"
  );
  for (const page of articles) {
    expect(xml, `feed should list ${page.path}`).toContain(
      `<guid isPermaLink="true">${DOMAIN}${page.path}</guid>`
    );
  }

  // Unescaped markup in a title would break every reader that parses this.
  const titles = [...xml.matchAll(/<title>([\s\S]*?)<\/title>/g)].map((m) => m[1]);
  expect(titles.length).toBeGreaterThan(articles.length); // channel + items
  for (const t of titles) {
    expect(t, `feed title is not XML-escaped: ${t}`).not.toMatch(/[<>]/);
  }
});

test("/learn links the feed for discovery", async ({ request }) => {
  const html = await fetchHtml(request, "/learn/");
  expect(html).toMatch(
    /<link[^>]+rel="alternate"[^>]+type="application\/rss\+xml"[^>]*>/
  );
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
