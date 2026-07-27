#!/usr/bin/env node
/**
 * verify-leads-hardening.mjs — is scripts/harden-leads-rls.sql actually applied?
 * Run: node scripts/verify-leads-hardening.mjs
 *
 * Uses ONLY the publishable key from lib/site.ts, i.e. exactly what an attacker
 * holds. Reads nothing (anon has no SELECT), so the only way to observe the
 * policy is to attempt writes.
 *
 * CREATES NO ROWS, in either state. The trick: every probe also sets
 * `status` to an invalid enum value. The original leads-table.sql already has
 * `check (status in ('new','vetted',...))`, so the row is rejected no matter
 * what — but the ERROR CODE distinguishes the two worlds:
 *
 *   23514 leads_status_check  -> anon may write `status`. NOT hardened.
 *   42501 permission denied   -> the grant is column-scoped. Hardened.
 *
 * The length probe only runs once the column probe has passed, because an
 * over-long insert against an unhardened table would succeed and store
 * megabytes. Fail fast, never pollute.
 */

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const site = readFileSync(resolve(root, "lib/site.ts"), "utf8");
const url = site.match(/SUPABASE_URL\s*=\s*"([^"]+)"/)?.[1];
const key = site.match(/SUPABASE_PUBLISHABLE_KEY\s*=\s*\n?\s*"([^"]+)"/)?.[1];
if (!url || !key) {
  console.error("FAIL: could not read Supabase URL / publishable key from lib/site.ts");
  process.exit(1);
}

const endpoint = `${url}/rest/v1/leads`;
const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
};

const base = {
  business: "hardening-probe",
  website: "https://example.com",
  area: "x",
  description: "x",
  email: "probe@example.com",
};

async function post(body) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let code = null;
  try {
    code = JSON.parse(text).code;
  } catch {
    /* non-JSON body */
  }
  return { status: res.status, code, text: text.slice(0, 200) };
}

const results = [];
const check = (name, pass, detail) => {
  results.push(pass);
  console.log(`  ${pass ? "PASS" : "FAIL"}  ${name}`);
  if (detail) console.log(`        ${detail}`);
};

console.log(`\nprobing ${url} with the shipped publishable key\n`);

// 1. Read path. Must stay denied; this is the only breach that is a
//    notification event, so it is checked first and every time.
{
  const res = await fetch(`${endpoint}?select=*&limit=1`, { headers });
  check(
    "anon cannot READ leads",
    res.status === 401 || res.status === 403,
    `GET -> ${res.status} (401/403 expected; 200 would be CRITICAL)`
  );
}

// 2. Column-scoped INSERT grant. The probe is rejected either way.
const col = await post({ ...base, status: "__probe_invalid__" });
const columnScoped = col.code === "42501";
check(
  "anon cannot write queue columns (status/notes/teaser_url/audit_run_id)",
  columnScoped,
  columnScoped
    ? "42501 permission denied for column — grant is scoped"
    : `${col.code} ${col.text} — harden-leads-rls.sql §4 not applied`
);

// 3. Length bounds. Skipped while unhardened: a 100KB insert would SUCCEED
//    and store the row, which is the very abuse we are testing for.
if (!columnScoped) {
  console.log(
    "  SKIP  length bounds — would create a 100KB row while unhardened.\n" +
      "        Re-run after applying harden-leads-rls.sql."
  );
  results.push(false);
} else {
  const long = await post({
    ...base,
    description: "A".repeat(100_000),
    status: "__probe_invalid__",
  });
  check(
    "over-long field values are refused",
    long.status >= 400,
    `POST 100KB description -> ${long.status} ${long.code ?? ""}`
  );
}

const ok = results.every(Boolean);
console.log(
  `\n${ok ? "OK — leads backend is hardened." : "NOT HARDENED — apply scripts/harden-leads-rls.sql (see website-plan.md §6)."}\n`
);
process.exit(ok ? 0 : 1);
