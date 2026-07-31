#!/usr/bin/env node
/**
 * verify-leads-backend.mjs — end-to-end check of the /free-check Supabase queue.
 * Run locally (needs network): `node scripts/verify-leads-backend.mjs`
 *
 * Reads SUPABASE_URL + SUPABASE_PUBLISHABLE_KEY from lib/site.ts and verifies,
 * using ONLY the browser-facing key:
 *   1. INSERT with the form's exact field names succeeds (201)   — form works
 *   2. SELECT is blocked or returns zero rows                    — leads can't be read
 *   3. DELETE is blocked                                         — leads can't be wiped
 *   4. UPDATE is blocked                                         — leads can't be altered
 * Inserts one clearly-marked test row tagged source = LEAD_CANARY_SOURCE, which
 * means scripts/lead-canary.sql suppresses its alert email and reaps it within
 * 90 minutes. Before that tag existed, every run of this script mailed Abhi a
 * fake lead and spent 1 of the 20 hourly Resend sends -- which is why it could
 * not be run routinely, and therefore why a dead key went unnoticed until
 * someone happened to check by hand.
 *
 * Needs network and writes to the live queue, so it is NOT part of `npm test`.
 * It is the pre-deploy gate: `npm run verify:leads`.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const site = readFileSync(resolve(root, "lib/site.ts"), "utf8");
const url = site.match(/SUPABASE_URL\s*=\s*"([^"]+)"/)?.[1];
const key = site.match(/SUPABASE_PUBLISHABLE_KEY\s*=\s*\n?\s*"([^"]+)"/)?.[1];
const canarySource = site.match(/LEAD_CANARY_SOURCE\s*=\s*\n?\s*"([^"]+)"/)?.[1];
if (!url || !key) {
  console.error("FAIL: could not read SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY from lib/site.ts");
  process.exit(1);
}
if (!canarySource) {
  console.error("FAIL: could not read LEAD_CANARY_SOURCE from lib/site.ts");
  process.exit(1);
}
const endpoint = `${url}/rest/v1/leads`;
const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
const results = [];
const record = (name, pass, detail) => {
  results.push(pass);
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};

// 1. INSERT — must succeed with the form's exact payload shape
const ins = await fetch(endpoint, {
  method: "POST",
  headers: { ...headers, Prefer: "return=minimal" },
  // `.invalid` is reserved by RFC 2606, so this row can never share a website
  // host or email with a real prospect and be mistaken for their earlier
  // submission by mark_duplicate_lead() (scripts/leads-dedup.sql). The old
  // payload used example.com, a host a real lead could plausibly carry.
  body: JSON.stringify({
    business: "TEST ROW — verify-leads-backend (auto-reaped)",
    website: "https://verify.leads-probe.invalid",
    area: "Berkeley, CA",
    description: "automated wiring check",
    email: "verify@leads-probe.invalid",
    source: canarySource,
  }),
});
record("INSERT (form submit)", ins.status === 201, `HTTP ${ins.status}${ins.status !== 201 ? " — check table columns vs form field names + RLS insert policy" : ""}`);

// 2. SELECT — must NOT return rows to the browser key
const sel = await fetch(`${endpoint}?select=*&limit=5`, { headers });
if (!sel.ok) {
  record("SELECT blocked", true, `HTTP ${sel.status}`);
} else {
  const rows = await sel.json();
  record("SELECT blocked", Array.isArray(rows) && rows.length === 0,
    rows.length > 0 ? `LEAK: ${rows.length} lead row(s) readable with the public key — add/fix RLS now` : "200 but zero rows visible");
}

// 3. DELETE — must be blocked (0 rows affected or error)
const del = await fetch(`${endpoint}?email=eq.verify@leads-probe.invalid`, {
  method: "DELETE", headers: { ...headers, Prefer: "return=representation" },
});
const delRows = del.ok ? await del.json().catch(() => []) : [];
record("DELETE blocked", !del.ok || delRows.length === 0, `HTTP ${del.status}, ${delRows.length ?? 0} row(s) deleted`);

// 4. UPDATE — must be blocked (0 rows affected or error)
const upd = await fetch(`${endpoint}?email=eq.verify@leads-probe.invalid`, {
  method: "PATCH", headers: { ...headers, Prefer: "return=representation" },
  body: JSON.stringify({ business: "tampered" }),
});
const updRows = upd.ok ? await upd.json().catch(() => []) : [];
record("UPDATE blocked", !upd.ok || updRows.length === 0, `HTTP ${upd.status}, ${updRows.length ?? 0} row(s) updated`);

console.log(results.every(Boolean)
  ? "\nAll checks passed. The TEST ROW is reaped automatically within 90 minutes\n" +
    "(reap-canary-leads); no dashboard cleanup needed once lead-canary.sql is applied."
  : "\nSome checks FAILED — fix before launch (see details above).");
process.exit(results.every(Boolean) ? 0 : 1);
