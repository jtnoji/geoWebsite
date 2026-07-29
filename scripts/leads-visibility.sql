-- Lead visibility + SLA tracking for the /free-check manual queue.
-- Paste into the Supabase SQL editor of the project in lib/site.ts, after
-- scripts/leads-table.sql and scripts/harden-leads-rls.sql.
-- Idempotent: safe to re-run.
--
-- WHAT THIS FIXES
-- Nothing told anyone a lead had arrived. The form POSTs real rows, but there
-- was no trigger, no webhook, and no read path: `anon` is INSERT-only by
-- design, so the browser key cannot read the queue back, and the Supabase
-- project is not on the founders' shared account. A lead submitted during a
-- pitch was invisible, while /free-check's confirmation screen promises a
-- report in 1-2 business days.
--
-- This script does NOT send anything outbound (no pg_net, no webhook). That is
-- deliberate and temporary: leads stay in Supabase for now. What it adds is
--   1. a way to READ the queue safely (leads_reader role + leads_queue view)
--   2. a durable record of WHICH leads blew the 1-2 day promise (pg_cron)
-- When a push channel is chosen, only record_lead_sla_breaches() changes.

-- ---------------------------------------------------------------------------
-- 0. THE DEFAULT-PRIVILEGE FOOTGUN (read this before adding any table)
-- ---------------------------------------------------------------------------
-- This project carries Supabase's stock default privileges:
--   pg_default_acl -> anon=arwdDxtm, authenticated=arwdDxtm, service_role=...
-- Every table, view and sequence created by `postgres` in `public` is
-- therefore granted ALL to `anon` and `authenticated` the moment it exists.
-- That is where the `authenticated` grants on public.leads came from -- not
-- from anything in leads-table.sql or harden-leads-rls.sql, which never
-- mention that role. RLS is what has been holding the line.
--
-- Consequence: any new table added to this project starts life fully exposed
-- and is safe only by RLS accident. Every object below is explicitly revoked.

-- ---------------------------------------------------------------------------
-- 1. Close the inherited `authenticated` grants on leads.
-- ---------------------------------------------------------------------------
-- Inert today (RLS is on and there is no policy for `authenticated`, so it
-- denies), but it is a standing grant waiting for someone to add a permissive
-- policy and silently expose every prospect email. anon's grant is already
-- pinned to the 8 form columns by harden-leads-rls.sql §4; leave it alone.
revoke all on public.leads from authenticated;

-- ---------------------------------------------------------------------------
-- 2. A read-only login role. The queue must be readable WITHOUT the postgres
--    superuser connection string.
-- ---------------------------------------------------------------------------
-- Reading a lead is a routine daily act; it must not require the credential
-- that can also drop the table. Password is set out-of-band (see README note
-- at the bottom) so it never lands in git.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'leads_reader') then
    -- Placeholder password. ALTER ROLE ... PASSWORD it immediately after.
    create role leads_reader login password 'CHANGE_ME_BEFORE_USE';
  end if;
end $$;

comment on role leads_reader is
  'Read-only queue access for /free-check leads. SELECT via RLS policy only; no INSERT/UPDATE/DELETE, no DDL.';

grant usage on schema public to leads_reader;
grant select on public.leads to leads_reader;

-- Authorization lives in RLS, not in the view. This matters: the view below
-- would otherwise run with its owner's rights and bypass RLS entirely, so a
-- stray grant on the view would leak the whole table. With a real SELECT
-- policy the base table stays protected no matter what happens to the view.
drop policy if exists "leads_reader can read leads" on public.leads;
create policy "leads_reader can read leads"
  on public.leads for select to leads_reader
  using (true);

-- ---------------------------------------------------------------------------
-- 3. SLA event log. One row per lead per escalation level, forever.
-- ---------------------------------------------------------------------------
-- Separate table rather than a column on `leads` so the insert path, the anon
-- policy and the column-scoped anon grant are all untouched.
create table if not exists public.lead_sla_events (
  id            bigint generated always as identity primary key,
  lead_id       uuid not null references public.leads(id) on delete cascade,
  level         text not null check (level in ('due','overdue')),
  recorded_at   timestamptz not null default now(),
  age_at_record interval not null,
  unique (lead_id, level)   -- makes the cron job idempotent
);

alter table public.lead_sla_events enable row level security;

-- Undo the default-privilege grant from §0. Without this, anon can read and
-- write the SLA log.
revoke all on public.lead_sla_events from anon, authenticated, public;
grant select on public.lead_sla_events to leads_reader;

drop policy if exists "leads_reader can read sla events" on public.lead_sla_events;
create policy "leads_reader can read sla events"
  on public.lead_sla_events for select to leads_reader
  using (true);

-- ---------------------------------------------------------------------------
-- 4. The queue view: what a human needs to triage, in reading order.
-- ---------------------------------------------------------------------------
-- security_invoker = true keeps the view honest -- it reads with the caller's
-- rights, so §2's RLS policy is what grants access, not view ownership.
create or replace view public.leads_queue
with (security_invoker = true) as
select
  l.id,
  l.created_at,
  now() - l.created_at as age,
  l.status,
  case
    when l.status <> 'new'                             then 'worked'
    when now() - l.created_at >= interval '48 hours'   then 'overdue'
    when now() - l.created_at >= interval '24 hours'   then 'due'
    else 'ok'
  end as sla_state,
  l.business, l.website, l.area, l.email, l.phone,
  l.description, l.source, l.referrer, l.notes,
  l.sent_at, l.teaser_url
from public.leads l;

revoke all on public.leads_queue from anon, authenticated, public;
grant select on public.leads_queue to leads_reader;

-- ---------------------------------------------------------------------------
-- 5. The cron job: record every lead that blows the promise.
-- ---------------------------------------------------------------------------
-- Thresholds are wall-clock hours, not business days. That is intentionally
-- conservative: a Friday-evening lead flags on Sunday rather than Tuesday, and
-- flagging early is the safe direction for a promise we made in public.
create extension if not exists pg_cron;

create or replace function public.record_lead_sla_breaches()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted integer;
begin
  with candidates as (
    select
      l.id,
      now() - l.created_at as age,
      case
        when now() - l.created_at >= interval '48 hours' then 'overdue'
        when now() - l.created_at >= interval '24 hours' then 'due'
      end as lvl
    from public.leads l
    where l.status = 'new'
  )
  insert into public.lead_sla_events (lead_id, level, age_at_record)
  select id, lvl, age from candidates where lvl is not null
  on conflict (lead_id, level) do nothing;

  get diagnostics inserted = row_count;
  return inserted;
end
$$;

-- security definer + a public EXECUTE grant would let anon run this. It does
-- not leak data (returns a count) but it has no business being callable.
revoke all on function public.record_lead_sla_breaches() from public, anon, authenticated;

-- Hourly. Re-scheduling the same job name replaces it, so this is idempotent.
select cron.schedule(
  'record-lead-sla-breaches',
  '0 * * * *',
  $$select public.record_lead_sla_breaches();$$
);

-- ---------------------------------------------------------------------------
-- AFTER RUNNING THIS
-- ---------------------------------------------------------------------------
--   alter role leads_reader password '<generated>';   -- never commit it
--
-- Then read the queue with that role, NOT with postgres:
--   select * from public.leads_queue order by created_at desc;
--   select * from public.lead_sla_events order by recorded_at desc;
--
-- STILL OPEN (a decision, not SQL): nothing is pushed anywhere. Someone has to
-- look. The 1-2 business day promise on /free-check is only as good as that
-- habit. Wiring a real channel means pg_net (available, not installed) plus a
-- destination URL, called from record_lead_sla_breaches() and from an AFTER
-- INSERT trigger on leads.
