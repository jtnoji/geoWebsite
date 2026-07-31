-- Duplicate DETECTION for /free-check submissions.
-- Paste into the Supabase SQL editor of the project in lib/site.ts, AFTER
-- leads-table.sql, harden-leads-rls.sql and leads-visibility.sql. Idempotent.
--
-- ============================================================================
-- THIS MARKS DUPLICATES. IT DOES NOT REJECT THEM. That is the whole design.
-- ============================================================================
--
-- The first draft of this file used partial unique indexes on email and host.
-- Rejecting the insert turned out to be wrong on every axis at once:
--
--   * A unique violation aborts the INSERT, so the AFTER INSERT alert trigger
--     never fires (lead-email-alerts.sql:257). No row, no lead_alert_log entry,
--     no email -- while the owner sees the confirmation screen. A real prospect
--     disappears and nobody is told. That is the exact silent-failure mode this
--     codebase argues against in lead-email-alerts.sql:58-62.
--   * It needs a form change (409 must read as success), and that change does
--     NOT close the enumeration oracle it creates -- the publishable key is
--     public, so anyone can POST directly and read the 409 themselves.
--   * It breaks verify-leads-backend.mjs, which inserts a fixed
--     test@example.com row, asserts 201, and cannot clean up after itself
--     because its DELETE probe is blocked by RLS by design.
--   * A host key is not an owner key. Two SMBs on facebook.com/<page>,
--     *.wixsite.com or sites.google.com share a host, and the second would be
--     rejected as a duplicate of a completely unrelated business.
--
-- Marking costs none of that. The insert always succeeds, the alert always
-- fires, the form is untouched, the verify scripts still pass, there is no
-- oracle, and a shared-host false positive is a flag a human can overrule
-- instead of a lead that never arrived.
--
-- And the real spend guard was never here anyway: compute is spent in the
-- PLATFORM project, and `uq_factsheet_jobs_inflight` in
-- geoPromptRunner/data/schema_factsheets.sql is what stops a second audit
-- being paid for. This file's job is to make the queue legible.

-- ---------------------------------------------------------------------------
-- 1. One host-normalizing function, used by BOTH the column and the trigger.
-- ---------------------------------------------------------------------------
-- Not a registrable domain: that needs the public suffix list, which SQL has no
-- business doing. Python does the real normalization (registered_domain) before
-- any money is spent; this is the queue-legibility version.
--
-- The 'i' flag is REQUIRED, not stylistic. leads_website_shape uses `~*`
-- (harden-leads-rls.sql:41), so `HTTPS://Example.com/x` is a legal `website`.
-- Without 'i' the pattern would not match, regexp_replace would return the
-- input unchanged, and the host would be the whole URL -- a different key from
-- the same site typed in lowercase, i.e. a dedup rule that silently does not
-- dedup.
--
-- IMMUTABLE is required by the generated column below, and is honest here:
-- lower() and the 4-arg regexp_replace are both immutable.
create or replace function public.lead_host(website text)
returns text
language sql
immutable
strict
as $$
  select lower(regexp_replace(website, '^https?://(www\.)?([^/:?#]+).*$', '\2', 'i'))
$$;

revoke all on function public.lead_host(text) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. The derived host, stored.
-- ---------------------------------------------------------------------------
-- The anon INSERT policy names columns individually and the INSERT grant is
-- column-scoped (harden-leads-rls.sql:47-79), so a generated column breaks
-- neither -- Postgres forbids inserting into one, and nothing in the policy
-- references it.
alter table public.leads
    add column if not exists website_host text
    generated always as (public.lead_host(website)) stored;

create index if not exists idx_leads_website_host on public.leads (website_host);

-- ---------------------------------------------------------------------------
-- 3. The duplicate pointer, and the trigger that fills it.
-- ---------------------------------------------------------------------------
alter table public.leads
    add column if not exists duplicate_of uuid references public.leads (id) on delete set null;

comment on column public.leads.duplicate_of is
    'Earliest prior initial submission with the same email or website host. '
    'Set server-side by mark_duplicate_lead(); anon has no INSERT grant on it. '
    'NULL means first contact. Detection only -- nothing is blocked.';

-- Hosts where a shared host does NOT mean a shared business. Without this,
-- every SMB whose "website" is a Facebook page or a Wix subdomain would point
-- at the first one ever submitted.
create or replace function public.is_shared_host(host text)
returns boolean
language sql
immutable
strict
as $$
  select host in (
    'facebook.com', 'instagram.com', 'linkedin.com', 'nextdoor.com',
    'yelp.com', 'google.com', 'sites.google.com', 'business.site',
    'wixsite.com', 'squarespace.com', 'weebly.com', 'godaddysites.com',
    'wordpress.com', 'blogspot.com', 'shopify.com', 'square.site',
    'linktr.ee', 'carrd.co'
  )
$$;

revoke all on function public.is_shared_host(text) from public, anon, authenticated;

create or replace function public.mark_duplicate_lead()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  host text;
begin
  -- BEFORE INSERT: NEW.website_host is not populated yet (STORED generated
  -- columns are computed after BEFORE triggers), so compute it with the same
  -- function the column uses. One writer of the rule.
  host := public.lead_host(new.website);

  select l.id into new.duplicate_of
  from public.leads l
  where l.phone is null                      -- ignore the phone opt-in's second row
    and l.duplicate_of is null               -- always point at the ORIGINAL
    and (
      lower(l.email) = lower(new.email)
      or (not public.is_shared_host(host) and l.website_host = host)
    )
  order by l.created_at
  limit 1;

  return new;
exception
  when others then
    -- Never cost a lead. Same rule as notify_new_lead(): a duplicate marker is
    -- a convenience, and a convenience must not be able to 500 the INSERT and
    -- show a real prospect "That didn't send."
    return new;
end;
$$;

revoke all on function public.mark_duplicate_lead() from public, anon, authenticated;

drop trigger if exists lead_mark_duplicate on public.leads;
create trigger lead_mark_duplicate
  before insert on public.leads
  for each row execute function public.mark_duplicate_lead();

create index if not exists idx_leads_duplicate_of on public.leads (duplicate_of)
    where duplicate_of is not null;

-- ---------------------------------------------------------------------------
-- 4. Surface it in the queue Josh reads.
-- ---------------------------------------------------------------------------
-- STANDALONE `create or replace view` on purpose. Re-running the whole of
-- leads-visibility.sql to pick up the new columns would silently revert the SLA
-- email wiring that lead-email-alerts.sql layered on top of
-- record_lead_sla_breaches() (leads-visibility.sql:133-136 vs
-- lead-email-alerts.sql:264-271).
--
-- Column list mirrors leads-visibility.sql:104-120 exactly, plus website_host,
-- duplicate_of and is_repeat. security_invoker stays true so leads_reader's RLS
-- policy is what grants access, not view ownership.
create or replace view public.leads_queue
with (security_invoker = true) as
select
  l.id,
  l.created_at,
  now() - l.created_at as age,
  l.status,
  case
    when l.status <> 'new' then 'worked'
    when now() - l.created_at > interval '48 hours' then 'overdue'
    when now() - l.created_at > interval '24 hours' then 'due'
    else 'ok'
  end as sla_state,
  l.business,
  l.website,
  l.website_host,
  l.duplicate_of,
  (l.duplicate_of is not null) as is_repeat,
  l.area,
  l.description,
  l.email,
  l.phone,
  l.source,
  l.referrer,
  l.notes,
  l.sent_at,
  l.teaser_url
from public.leads l;

revoke all on public.leads_queue from anon, authenticated, public;
grant select on public.leads_queue to leads_reader;

-- ---------------------------------------------------------------------------
-- 5. After applying.
-- ---------------------------------------------------------------------------
-- Nothing about the browser contract changed, so both launch gates should still
-- pass unmodified -- run them and confirm, because that is the point of a gate:
--   node scripts/verify-leads-backend.mjs
--   node scripts/verify-leads-hardening.mjs
--
-- Read the queue as leads_reader:
--   select business, website_host, is_repeat, age, sla_state
--   from public.leads_queue order by created_at desc;
--
-- OPTIONAL, NOT INCLUDED: downgrading the alert email for a repeat. It would
-- mean editing notify_new_lead() in lead-email-alerts.sql, and a duplicate that
-- arrives with no notification is a lead nobody looks at. Better to see it and
-- know it is a repeat than not to see it.
