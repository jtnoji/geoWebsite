import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { AI_USER_AGENTS, PAGES } from "./pages";

/**
 * Security regression suite.
 *
 * The header layer lives in vercel.json (a static export has no server, so
 * next.config.ts `headers()` is inert) and cannot be observed against the
 * local file server — those assertions read the config instead. The meta-CSP
 * layer IS enforced by the browser here, so the "no violations" tests are real
 * end-to-end checks: if scripts/harden-export.mjs ever emits a wrong hash,
 * hydration breaks and these fail.
 */

const ROOT = join(__dirname, "..");
const vercelJson = JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf8"));

const siteHeaders: Record<string, string> = Object.fromEntries(
  vercelJson.headers
    .find((rule: { source: string }) => rule.source === "/(.*)")
    .headers.map((h: { key: string; value: string }) => [h.key, h.value])
);

test.describe("headers (vercel.json)", () => {
  test("sets every header in the baseline set", () => {
    expect(siteHeaders["Strict-Transport-Security"]).toMatch(
      /max-age=(?:[3-9]\d{7}|\d{9,})/ // >= ~1 year
    );
    expect(siteHeaders["Strict-Transport-Security"]).toContain("includeSubDomains");
    expect(siteHeaders["X-Content-Type-Options"]).toBe("nosniff");
    expect(siteHeaders["X-Frame-Options"]).toBe("DENY");
    expect(siteHeaders["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(siteHeaders["Cross-Origin-Opener-Policy"]).toBe("same-origin");
    expect(siteHeaders["X-Permitted-Cross-Domain-Policies"]).toBe("none");
    for (const feature of ["camera", "microphone", "geolocation", "payment"]) {
      expect(siteHeaders["Permissions-Policy"]).toContain(`${feature}=()`);
    }
  });

  test("omits the headers OWASP marks deprecated", () => {
    for (const dead of ["X-XSS-Protection", "Expect-CT", "Public-Key-Pins"]) {
      expect(siteHeaders[dead]).toBeUndefined();
    }
  });

  test("header CSP locks down the directives that cannot use hashes", () => {
    const csp = siteHeaders["Content-Security-Policy"];
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'none'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).not.toContain("unsafe-eval");
    // The lead POST target must be the ONLY cross-origin connect destination.
    const connect = csp.match(/connect-src ([^;]+)/)![1].trim().split(/\s+/);
    expect(connect).toEqual(["'self'", "https://satjbyfjzrwocwwonsxz.supabase.co"]);
  });
});

for (const page of PAGES) {
  test.describe(page.path, () => {
    test("meta CSP pins inline scripts by hash, never 'unsafe-inline'", async ({
      request,
    }) => {
      const html = await (await request.get(page.path)).text();
      const meta = html.match(
        /<meta http-equiv="Content-Security-Policy" content="([^"]+)"/
      )?.[1];

      expect(meta, `${page.path} should carry a meta CSP`).toBeTruthy();
      const scriptSrc = meta!.match(/script-src ([^;]+)/)![1];
      expect(scriptSrc).not.toContain("unsafe-inline");
      expect(scriptSrc).not.toContain("unsafe-eval");
      expect(scriptSrc).toMatch(/'sha256-[A-Za-z0-9+/=]{44}'/);

      // Must precede the scripts it governs, or the browser ignores it.
      expect(html.indexOf("Content-Security-Policy")).toBeLessThan(
        html.indexOf("<script")
      );
      // frame-ancestors is header-only; in <meta> it is ignored with a warning.
      expect(meta).not.toContain("frame-ancestors");
    });

    test("loads with no CSP violation and no console error", async ({ page: pw }) => {
      const problems: string[] = [];
      pw.on("console", (msg) => {
        if (msg.type() === "error") problems.push(msg.text());
      });
      pw.on("pageerror", (err) => problems.push(String(err)));

      await pw.goto(page.path);
      await pw.waitForLoadState("networkidle");

      expect(problems, `${page.path} console`).toEqual([]);
    });

    test("still serves full content to AI crawlers", async ({ playwright }) => {
      // The headers added here are all browser-side; none may gate a bot (Cat 1).
      const ctx = await playwright.request.newContext({
        baseURL: test.info().project.use.baseURL,
        userAgent: AI_USER_AGENTS[0],
      });
      const res = await ctx.get(page.path);
      expect(res.status()).toBe(200);
      expect(await res.text()).toContain(page.mustContain[0]);
      await ctx.dispose();
    });
  });
}

test("hydration survives the hash-pinned CSP (mobile nav toggles)", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/");
  // aria-label flips to "Close menu" on open, so match on the stable attribute.
  const toggle = page.locator("header button[aria-expanded]");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  // A dead island would leave this collapsed — proof the inline bundle ran.
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByLabel("Mobile").getByRole("link", { name: "Pricing" })
  ).toBeVisible();
});

test("security.txt is valid RFC 9116 and not expired", async ({ request }) => {
  for (const path of ["/.well-known/security.txt", "/security.txt"]) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    const body = await res.text();

    expect(body).toMatch(/^Contact: /m);
    const expires = body.match(/^Expires: (.+)$/m)?.[1];
    expect(expires, `${path} needs an Expires field`).toBeTruthy();
    expect(
      new Date(expires!).getTime(),
      `${path} Expires has passed — refresh the disclosure contact`
    ).toBeGreaterThan(Date.now());
  }
});

test("no secret-shaped credential ships in the export", async ({ request }) => {
  const html = await (await request.get("/free-check/")).text();
  // The publishable key is meant to be public; a service_role JWT or an
  // sb_secret_ key never is. Fail loudly if one is ever pasted into lib/site.ts.
  expect(html).not.toMatch(/sb_secret_/);
  expect(html).not.toMatch(/service_role/);
  expect(html).not.toMatch(/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\./); // JWT
});
