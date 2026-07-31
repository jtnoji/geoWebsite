#!/usr/bin/env node
/**
 * canary-leads.mjs — scheduled liveness probe for the /free-check lead path.
 * Run: `npm run canary:leads` (hourly in .github/workflows/leads-canary.yml)
 *
 * WHY THIS EXISTS. A broken form is invisible. When the publishable key stops
 * working, PostgREST returns 401, the INSERT never happens, so there is no row,
 * no lead_alert_log entry and no email -- while FreeCheckForm still shows the
 * prospect "Thanks, your report is on the way." Every failure mode of the lead
 * path is silent by construction, and the only reason we found the last one was
 * that someone ran the verify script by hand. This closes that.
 *
 * WHY IT READS THE KEY OFF THE LIVE SITE, not lib/site.ts. Checking the repo's
 * key proves the repo is fine, which is not the question -- a prospect uses the
 * key in the JavaScript Vercel is actually serving. Those differ whenever a
 * deploy is stale, a build was misconfigured, or a key was rotated in Supabase
 * but not shipped. Extracting the credential the browser would really use is
 * what makes this a canary and not a second copy of verify-leads-backend.mjs.
 *
 * WHAT IT ASSERTS.
 *   1. /free-check is reachable and still ships a Supabase URL + publishable key
 *   2. INSERT with that key succeeds (201)          -- the form works
 *   3. SELECT with that key returns no rows         -- RLS has not regressed
 * Any failure exits non-zero, which fails the workflow, which mails the repo
 * owner. Exit code 0 is the only "the form works" signal.
 *
 * The row it writes carries source = LEAD_CANARY_SOURCE, which
 * scripts/lead-canary.sql uses to suppress the alert email and reap the row.
 * WITHOUT THAT SQL APPLIED, EVERY RUN EMAILS A FAKE LEAD AND BURNS 1 OF THE
 * 20/HOUR RESEND CAP THAT REAL LEADS NEED. Apply it before scheduling this.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const site = readFileSync(resolve(root, "lib/site.ts"), "utf8");
const read = (name) =>
  site.match(new RegExp(`${name}\\s*=\\s*\\n?\\s*"([^"]+)"`))?.[1];

// The site under test. Overridable so a Vercel preview URL can be probed
// before promoting it to production (CLAUDE.md: run the suite against the
// preview first). Defaults to the production DOMAIN in lib/site.ts.
const target = (process.env.CANARY_TARGET || read("DOMAIN") || "").replace(/\/$/, "");
const canarySource = read("LEAD_CANARY_SOURCE");
const repoKey = read("SUPABASE_PUBLISHABLE_KEY");

const failures = [];
const record = (name, pass, detail) => {
  if (!pass) failures.push(name);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};
const die = (msg) => {
  console.error(`\nCANARY FAILED — ${msg}`);
  process.exit(1);
};

if (!target) die("no CANARY_TARGET and no DOMAIN in lib/site.ts");
if (!canarySource) die("LEAD_CANARY_SOURCE missing from lib/site.ts");
console.log(`Probing ${target}/free-check\n`);

// ---------------------------------------------------------------------------
// 1. Pull the credential the browser would actually use.
// ---------------------------------------------------------------------------
// The key is a module constant in a client component, so it may land inline in
// the RSC flight payload OR only in a /_next/static chunk depending on how Next
// splits the build. Scan the HTML first, then the chunks it references. Never
// fall back to lib/site.ts: silently testing the repo's key instead of the
// deployed one would turn a red canary green, which is worse than no canary.
const KEY_RE = /sb_publishable_[A-Za-z0-9_-]{20,}|eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/;
const URL_RE = /https:\/\/[a-z0-9]{16,}\.supabase\.co/;

let page;
try {
  const res = await fetch(`${target}/free-check`, {
    headers: { "user-agent": "geoWebsite-leads-canary" },
  });
  if (!res.ok) die(`GET ${target}/free-check returned HTTP ${res.status}`);
  page = await res.text();
} catch (err) {
  die(`GET ${target}/free-check threw: ${err.message}`);
}

// The `?dpl=...` suffix is Vercel's, not Next's, and it is not optional to
// handle: with a pattern anchored on a trailing `.js` this matched ZERO chunks
// against the real deployment, the scan fell through to the HTML alone, and the
// canary reported "the form cannot submit at all" on a perfectly healthy site.
// Verified 2026-07-31 against the live export: the key is present ONLY in the
// chunks, never in the HTML, so this fallback is what makes the probe work.
let haystack = page;
const chunks = [...page.matchAll(/["'](\/_next\/static\/[^"']+?\.js(?:\?[^"']*)?)["']/g)]
  .map((m) => m[1])
  // The RSC flight payload embeds these paths inside an escaped JS string, so
  // some matches carry a trailing backslash and 404. Harmless but noisy.
  .filter((p) => !p.includes("\\"))
  .filter((v, i, a) => a.indexOf(v) === i);

if (!KEY_RE.test(haystack) || !URL_RE.test(haystack)) {
  const bodies = await Promise.all(
    chunks.map((c) =>
      fetch(`${target}${c}`)
        .then((r) => (r.ok ? r.text() : ""))
        .catch(() => "")
    )
  );
  haystack += bodies.join("\n");
}

const liveKey = haystack.match(KEY_RE)?.[0];
const liveUrl = haystack.match(URL_RE)?.[0];
record(
  "deployed page ships Supabase credentials",
  Boolean(liveKey && liveUrl),
  liveKey && liveUrl
    ? `${liveUrl} (scanned page + ${chunks.length} chunk(s))`
    : "no publishable key / project URL found in the served HTML or JS — the form cannot submit at all"
);
if (!liveKey || !liveUrl) die("cannot probe the insert path without the deployed key");

// Not a failure on its own: a deploy in flight legitimately serves the previous
// key for a few minutes. It is logged because when the INSERT below fails, this
// line is usually the reason.
if (repoKey && liveKey !== repoKey) {
  console.log(
    "NOTE  deployed key differs from lib/site.ts — the live site is running a " +
      "different build than this checkout"
  );
}

// ---------------------------------------------------------------------------
// 2. The real thing: submit the form the way a prospect's browser would.
// ---------------------------------------------------------------------------
const endpoint = `${liveUrl}/rest/v1/leads`;
const headers = {
  apikey: liveKey,
  Authorization: `Bearer ${liveKey}`,
  "Content-Type": "application/json",
};

// `.invalid` is reserved by RFC 2606 and can never be a real business, so a
// canary row can never collide with a prospect's website host or email and be
// mistaken for their duplicate by mark_duplicate_lead() (scripts/leads-dedup.sql).
const stamp = new Date().toISOString();
let ins;
try {
  ins = await fetch(endpoint, {
    method: "POST",
    headers: { ...headers, Prefer: "return=minimal" },
    body: JSON.stringify({
      business: "CANARY — automated liveness probe, ignore",
      website: "https://canary.leads-probe.invalid",
      area: "Berkeley, CA",
      description: `Scheduled probe of the /free-check insert path at ${stamp}.`,
      email: "canary@leads-probe.invalid",
      source: canarySource,
    }),
  });
} catch (err) {
  die(`POST ${endpoint} threw: ${err.message}`);
}
const insBody = ins.status === 201 ? "" : await ins.text().catch(() => "");
record(
  "INSERT (form submit)",
  ins.status === 201,
  ins.status === 201
    ? "HTTP 201"
    : `HTTP ${ins.status} — the live form is DROPPING LEADS RIGHT NOW. ${insBody.slice(0, 300)}`
);

// ---------------------------------------------------------------------------
// 3. RLS regression guard. The same key must not be able to read the queue.
// ---------------------------------------------------------------------------
const sel = await fetch(`${endpoint}?select=id&limit=5`, { headers });
if (!sel.ok) {
  record("SELECT blocked", true, `HTTP ${sel.status}`);
} else {
  const rows = await sel.json().catch(() => []);
  record(
    "SELECT blocked",
    Array.isArray(rows) && rows.length === 0,
    rows.length > 0
      ? `LEAK: ${rows.length} lead row(s) readable with the PUBLIC key — every prospect email is exposed, fix RLS now`
      : "200 but zero rows visible"
  );
}

console.log(
  failures.length === 0
    ? "\nCanary green. The live /free-check path accepts submissions and leaks nothing."
    : `\nCANARY FAILED — ${failures.join(", ")}`
);
process.exit(failures.length === 0 ? 0 : 1);
