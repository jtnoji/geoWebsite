-- leads table for /free-check submissions (manual queue — scaffold.md §6)
-- Paste into the Supabase SQL editor of the project in lib/site.ts.
-- Idempotent-ish: guards included where Postgres allows them.

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  -- the five fields FreeCheckForm.tsx POSTs (names must match exactly):
  business    text not null,
  website     text not null,          -- the teaser pipeline's input URL
  area        text not null,          -- city / service area (local query sets)
  description text not null,          -- "what do you do?" (helps the resolver)
  email       text not null,          -- where the report gets sent
  phone       text,                   -- OPTIONAL, asked post-submit only ("walk you
                                      -- through the report") — never a required form
                                      -- field. Manual dial only, never SMS (see
                                      -- geoPromptRunner docs/gtm-legal-readiness.md)
  -- invisible attribution (hidden inputs — never visible fields):
  source      text,                   -- ?src= campaign code from cold-email links
  referrer    text,                   -- document.referrer (google / chatgpt / linkedin)
  -- queue management (server-side only; the form never sends these):
  created_at  timestamptz not null default now(),
  status      text not null default 'new'
              check (status in ('new','vetted','teaser_sent','converted','disqualified')),
  notes       text,                   -- vetting notes (Josh)
  sent_at     timestamptz,            -- when the teaser was emailed (SLA tracking)
  teaser_url  text,                   -- where the generated teaser lives
  audit_run_id text                   -- platform run id if converted to paid audit
);

-- RLS: the browser's publishable key may INSERT and nothing else.
alter table public.leads enable row level security;

drop policy if exists "anon can insert leads" on public.leads;
create policy "anon can insert leads"
  on public.leads for insert to anon
  with check (true);

-- Deliberately NO select/update/delete policies for anon: a readable leads
-- table would expose every prospect's email to anyone with the site's JS.
-- Dashboard/service-role access is unaffected (bypasses RLS).

-- Belt-and-braces: anon keeps only the INSERT grant even if policies change.
revoke select, update, delete on public.leads from anon;

-- After running this, verify from a dev machine:
--   node scripts/verify-leads-backend.mjs
