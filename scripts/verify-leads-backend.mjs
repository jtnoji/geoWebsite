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
 * Inserts one clearly-marked test row; delete it from the Supabase dashboard.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const site = readFileSync(resolve(root, "lib/site.ts"), "utf8");
const url = site.match(/SUPABASE_URL\s*=\s*"([^"]+)"/)?.[1];
const key = site.match(/SUPABASE_PUBLISHABLE_KEY\s*=\s*\n?\s*"([^"]+)"/)?.[1];
if (!url || !key) {
  console.error("FAIL: could not read SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY from lib/site.ts");
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
  body: JSON.stringify({
    business: "TEST ROW — verify-leads-backend (safe to delete)",
    website: "https://example.com",
    area: "Berkeley, CA",
    description: "automated wiring check",
    email: "test@example.com",
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
const del = await fetch(`${endpoint}?email=eq.test@example.com`, {
  method: "DELETE", headers: { ...headers, Prefer: "return=representation" },
});
const delRows = del.ok ? await del.json().catch(() => []) : [];
record("DELETE blocked", !del.ok || delRows.length === 0, `HTTP ${del.status}, ${delRows.length ?? 0} row(s) deleted`);

// 4. UPDATE — must be blocked (0 rows affected or error)
const upd = await fetch(`${endpoint}?email=eq.test@example.com`, {
  method: "PATCH", headers: { ...headers, Prefer: "return=representation" },
  body: JSON.stringify({ business: "tampered" }),
});
const updRows = upd.ok ? await upd.json().catch(() => []) : [];
record("UPDATE blocked", !upd.ok || updRows.length === 0, `HTTP ${upd.status}, ${updRows.length ?? 0} row(s) updated`);

console.log(results.every(Boolean)
  ? "\nAll checks passed. Delete the TEST ROW lead from the Supabase dashboard."
  : "\nSome checks FAILED — fix before launch (see details above).");
process.exit(results.every(Boolean) ? 0 : 1);
