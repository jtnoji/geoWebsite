/**
 * Post-build hardening pass over `out/` (runs from `npm run build`).
 *
 * WHY THIS EXISTS
 * The static export is served by Vercel's CDN, so all security headers come
 * from `vercel.json` — `next.config.ts` `headers()` does nothing under
 * `output: 'export'` (Next lists Headers as unsupported for static export).
 *
 * The header CSP has to carry `script-src 'unsafe-inline'`, because Next
 * inlines its hydration/flight payload as ~8 <script> blocks per page (138
 * distinct blocks across the site) and a static export has no request cycle
 * in which to mint a nonce.
 *
 * So this script adds a SECOND, stricter CSP as a <meta http-equiv> in each
 * page, listing the sha256 of that page's own inline scripts instead of
 * 'unsafe-inline'. A browser enforces every policy it is given, so the
 * effective script-src becomes the intersection: our build's inline scripts
 * (hash matches both policies) run, and anything injected later (matches the
 * header's 'unsafe-inline' but no hash) is blocked. The header still covers
 * non-HTML responses, which a <meta> tag cannot reach.
 *
 * The meta policy is DERIVED from vercel.json rather than written out again,
 * so the two can never drift. `tests/security.spec.ts` asserts the invariants.
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, mkdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "out");

/** Directives the CSP spec ignores inside <meta http-equiv>; keep them header-only. */
const META_INVALID = new Set(["frame-ancestors", "report-uri", "report-to", "sandbox"]);

/** Every inline <script> (any type, including ld+json — CSP governs those too). */
const INLINE_SCRIPT = /<script(?![^>]*\ssrc=)([^>]*)>([\s\S]*?)<\/script>/g;

/**
 * Shapes of inline script this build is allowed to emit. Anything else fails
 * the build instead of being hashed.
 *
 * WHY THIS IS FAIL-CLOSED: without it, this script hashes whatever inline
 * scripts it finds and writes them into the allowlist — so a <script> planted
 * upstream (e.g. through the markdown pipeline) would be inspected, hashed,
 * and granted a CSP exemption by the very control meant to stop it. Hashing
 * only works if the input set is vetted, so the input set is pinned here.
 */
const ALLOWED_INLINE = [
  // Next.js flight payload + runtime bootstrap.
  /^\(self\.__next_f\s*=\s*self\.__next_f\s*\|\|\s*\[\]\)/,
  /^self\.__next_f\.push\(/,
  // The scroll-reveal failsafe in app/layout.tsx (the one hand-written inline
  // script on the site). Pinned by its opening statement.
  /^\(function\(\)\{var d=document\.documentElement;d\.classList\.add\('js-reveal'\)/,
];

/** ld+json is data, not code — but it must be parseable and must not break out. */
function checkJsonLd(body, page) {
  if (body.includes("<")) {
    throw new Error(
      `${page}: JSON-LD contains a raw "<" — components/JsonLd.tsx must escape it as \\u003c`
    );
  }
  try {
    JSON.parse(body);
  } catch (err) {
    throw new Error(`${page}: JSON-LD does not parse (${err.message})`);
  }
}

function assertVetted(attrs, body, page) {
  if (/application\/ld\+json/.test(attrs)) return checkJsonLd(body, page);
  if (ALLOWED_INLINE.some((re) => re.test(body.trim()))) return;
  throw new Error(
    `${page}: unrecognised inline <script> — refusing to add it to the CSP allowlist.\n` +
      `  attrs: ${attrs.trim() || "(none)"}\n` +
      `  starts: ${body.trim().slice(0, 120)}\n` +
      `  If this is a legitimate new build output, add its shape to ALLOWED_INLINE ` +
      `in scripts/harden-export.mjs. If you did not expect it, treat it as an injection.`
  );
}

function walk(dir, ext, found = []) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path, ext, found);
    else if (entry.endsWith(ext)) found.push(path);
  }
  return found;
}

function headerCsp() {
  const config = JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf8"));
  const csp = config.headers
    ?.flatMap((rule) => rule.headers)
    .find((h) => h.key === "Content-Security-Policy")?.value;
  if (!csp) throw new Error("vercel.json has no Content-Security-Policy header");
  return csp;
}

/** Header CSP -> meta CSP: swap script-src's 'unsafe-inline' for this page's hashes. */
function metaCsp(headerPolicy, hashes) {
  return headerPolicy
    .split(";")
    .map((directive) => directive.trim())
    .filter(Boolean)
    .filter((directive) => !META_INVALID.has(directive.split(/\s+/)[0]))
    .map((directive) =>
      directive.startsWith("script-src ")
        ? `script-src 'self' ${hashes.map((h) => `'sha256-${h}'`).join(" ")}`
        : directive
    )
    .join("; ");
}

const policy = headerCsp();
const pages = walk(OUT, ".html");
let totalHashes = 0;

for (const page of pages) {
  const html = readFileSync(page, "utf8");

  const hashes = [
    ...new Set(
      [...html.matchAll(INLINE_SCRIPT)].map((m) => {
        // Vet BEFORE hashing: an unvetted script must never reach the allowlist.
        assertVetted(m[1], m[2], page);
        return createHash("sha256").update(m[2], "utf8").digest("base64");
      })
    ),
  ];
  totalHashes += hashes.length;

  const tag = `<meta http-equiv="Content-Security-Policy" content="${metaCsp(
    policy,
    hashes
  ).replace(/"/g, "&quot;")}"/>`;

  // First thing in <head>, so the policy is in force before any script parses.
  if (!html.includes("<head>")) throw new Error(`no <head> in ${page}`);
  writeFileSync(page, html.replace("<head>", `<head>${tag}`), "utf8");
}

// RFC 9116 wants security.txt at /.well-known/; mirror the route-handler copy
// there so both the canonical and legacy locations resolve.
const securityTxt = join(OUT, "security.txt");
mkdirSync(join(OUT, ".well-known"), { recursive: true });
writeFileSync(join(OUT, ".well-known", "security.txt"), readFileSync(securityTxt));

console.log(
  `hardened ${pages.length} pages with meta CSP (${totalHashes} script hashes) ` +
    `+ /.well-known/security.txt`
);
