#!/usr/bin/env node
/**
 * ingest-crawler-hits.mjs — turn Vercel access logs into the published crawler
 * log on /our-score.
 *
 *   node scripts/ingest-crawler-hits.mjs <logs.ndjson> [more.ndjson ...]
 *   cat logs.ndjson | node scripts/ingest-crawler-hits.mjs -
 *
 * Rewrites lib/crawler-hits.ts. Run `npm run build && npm test` after.
 *
 * WHY A FILE AND NOT AN API CALL
 * The site is a static export, so there is no request cycle in which to fetch
 * anything: the numbers have to be baked in at build time. That is also the
 * honest shape for this data, because the committed file is a dated artifact
 * someone can diff, rather than a number that silently changes under a claim.
 *
 * WHERE THE INPUT COMES FROM
 * A pure static export emits NO Vercel runtime logs (verified 2026-07-29: the
 * runtime-log API returns zero rows for this project, and that is structural,
 * not retention). CDN access logs are the only place a crawler page fetch
 * appears, and reaching them needs a Log Drain, which is Pro and above.
 * Configure the drain to deliver NDJSON, then point this script at it.
 *
 * Accepts any NDJSON whose records carry a user agent, a path and a timestamp,
 * under any of the common Vercel/CDN spellings — the drain schema has moved
 * around, and guessing one spelling would fail silently and publish zeroes.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Read the roster straight out of lib/crawlers.ts so this script and the site
// can never disagree about which bots exist.
const rosterSrc = readFileSync(resolve(root, "lib/crawlers.ts"), "utf8");
const TOKENS = [...rosterSrc.matchAll(/\{\s*token:\s*"([^"]+)"/g)].map((m) => m[1]);
if (TOKENS.length === 0) {
  console.error("FAIL: could not read AI_BOTS out of lib/crawlers.ts");
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("usage: node scripts/ingest-crawler-hits.mjs <logs.ndjson> [...]  (or - for stdin)");
  process.exit(1);
}

const raw = args
  .map((a) => (a === "-" ? readFileSync(0, "utf8") : readFileSync(resolve(a), "utf8")))
  .join("\n");

/** Pull the first present key from a record, case-insensitively and nested. */
const pick = (obj, keys) => {
  for (const k of keys) {
    const hit = Object.keys(obj).find((o) => o.toLowerCase() === k.toLowerCase());
    if (hit && obj[hit] != null && obj[hit] !== "") return obj[hit];
  }
  // one level of nesting (proxy.userAgent, request.path, ...)
  for (const v of Object.values(obj)) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const nested = pick(v, keys);
      if (nested != null) return nested;
    }
  }
  return null;
};

const UA_KEYS = ["userAgent", "user_agent", "ua", "http_user_agent"];
const PATH_KEYS = ["path", "requestPath", "url", "uri", "pathname"];
const TIME_KEYS = ["timestamp", "time", "date", "datetime", "@timestamp"];

const stats = new Map(TOKENS.map((t) => [t, { requests: 0, paths: new Set(), lastSeen: null }]));
let parsed = 0;
let skipped = 0;
let earliest = null;
let latest = null;

for (const line of raw.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed) continue;
  let rec;
  try {
    rec = JSON.parse(trimmed);
  } catch {
    skipped++;
    continue;
  }
  parsed++;

  let ua = pick(rec, UA_KEYS);
  if (Array.isArray(ua)) ua = ua[0];
  if (typeof ua !== "string") continue;

  const token = TOKENS.find((t) => ua.toLowerCase().includes(t.toLowerCase()));
  if (!token) continue;

  const path = pick(rec, PATH_KEYS);
  const tsRaw = pick(rec, TIME_KEYS);
  // Vercel drains emit epoch millis as a number; ISO strings also appear.
  const ts = typeof tsRaw === "number" ? new Date(tsRaw) : tsRaw ? new Date(tsRaw) : null;
  const day = ts && !Number.isNaN(ts.valueOf()) ? ts.toISOString().slice(0, 10) : null;

  const s = stats.get(token);
  s.requests++;
  if (typeof path === "string") {
    // Strip origin and query so /learn/x?a=1 and /learn/x count once.
    const clean = path.replace(/^https?:\/\/[^/]+/, "").split("?")[0];
    s.paths.add(clean || "/");
  }
  if (day) {
    if (!s.lastSeen || day > s.lastSeen) s.lastSeen = day;
    if (!earliest || day < earliest) earliest = day;
    if (!latest || day > latest) latest = day;
  }
}

const bots = TOKENS.map((token) => {
  const s = stats.get(token);
  return { token, requests: s.requests, paths: s.paths.size, lastSeen: s.lastSeen };
});
const total = bots.reduce((n, b) => n + b.requests, 0);

console.log(`parsed ${parsed} record(s)${skipped ? `, skipped ${skipped} unparseable` : ""}`);
for (const b of bots) {
  console.log(`  ${b.requests.toString().padStart(6)}  ${b.token}${b.paths ? ` (${b.paths} paths)` : ""}`);
}

if (total === 0) {
  console.error(
    "\nFAIL: no requests matched any roster bot. Nothing written.\n" +
      "Either the window genuinely has no crawler traffic, or the drain's field\n" +
      "names are not among the ones this script looks for. Check one raw record\n" +
      "before assuming the former: publishing zeroes we did not measure would be\n" +
      "worse than publishing nothing."
  );
  process.exit(1);
}

const out = `import type { CrawlerLog } from "./crawlers";

/**
 * GENERATED FILE. Do not hand-edit.
 * Written by \`node scripts/ingest-crawler-hits.mjs\`.
 *
 * \`null\` means no crawler log has been ingested yet, and the panel on
 * /our-score renders nothing.
 */
export const CRAWLER_HITS: CrawlerLog | null = ${JSON.stringify(
  {
    from: earliest,
    to: latest,
    source: "Vercel CDN access logs, aggregated by scripts/ingest-crawler-hits.mjs",
    bots,
  },
  null,
  2
)};
`;

writeFileSync(resolve(root, "lib/crawler-hits.ts"), out);
console.log(`\nwrote lib/crawler-hits.ts — ${total} crawler request(s), ${earliest} to ${latest}`);
console.log("next: npm run build && npm test, and update /privacy if this is the first ingest");
