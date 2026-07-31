-- Make the scheduled liveness probe (scripts/canary-leads.mjs) invisible.
-- Paste into the Supabase SQL editor of the project in lib/site.ts, AFTER
-- lead-email-alerts.sql. Idempotent.
--
-- ============================================================================
-- APPLY THIS *BEFORE* ENABLING .github/workflows/leads-canary.yml.
-- Without it the canary emails Abhi a fake lead every hour and spends 1 of the
-- 20 hourly Resend sends that real leads need.
-- ============================================================================
--
-- THE PROBLEM. A canary has to submit the REAL form to prove the real form
-- works, so it writes a real row to public.leads. That row then hits every
-- mechanism built for prospects:
--
--   1. the `lead_arrived` AFTER INSERT trigger mails a "New free check"
--      (lead-email-alerts.sql:257) -- 24 fake leads a day, and each one counts
--      against the hourly cap in send_lead_alert(), so a canary burst could
--      suppress the notification for an actual prospect;
--   2. record_lead_sla_breaches() selects `from public.leads where status =
--      'new'` (lead-email-alerts.sql:291-292) -- it reads the TABLE, not
--      leads_queue, so at 24h and 48h every unreaped canary row also mails an
--      "overdue lead" alert about a business that does not exist;
--   3. leads_queue fills with rows Josh has to learn to ignore, which is how a
--      queue stops being read.
--
-- WHAT THIS FILE CHANGES, AND WHAT IT DELIBERATELY DOES NOT.
-- It recreates ONE TRIGGER and adds ONE REAPER. It does not rewrite
-- notify_new_lead(), send_lead_alert(), record_lead_sla_breaches() or
-- leads_queue -- those have already drifted from git once (the recipient list
-- changed in commit 1f88724, and lead-alert-cap-fix.sql:90-96 warns about
-- exactly this), and replacing a function body wholesale to add one predicate
-- would silently revert whatever else has been changed live. A `create trigger`
-- carries no function body with it, so it cannot revert anything.
--
-- WHY THE MARKER IS `source` AND NOT A NEW `status`.
-- The obvious design -- tag canary rows with status = 'canary' so they fall out
-- of the SLA query for free -- CANNOT WORK HERE, and fails in a way that would
-- have looked like a broken form. The anon INSERT policy asserts
-- `status = 'new'` (harden-leads-rls.sql:57), and PostgreSQL evaluates RLS
-- WITH CHECK against the row as it stands AFTER BEFORE-INSERT triggers have
-- modified it. A BEFORE trigger setting status := 'canary' therefore makes the
-- policy reject the insert: the canary would report HTTP 403 forever and we
-- would go hunting for a key problem that does not exist. `status` is also
-- outside the column-scoped anon INSERT grant (harden-leads-rls.sql:78), so the
-- probe cannot set it directly either. `source` is inside that grant, is
-- already how attribution works, and needs no policy change at all.

-- ---------------------------------------------------------------------------
-- 1. Suppress the arrival email for probe rows.
-- ---------------------------------------------------------------------------
-- The string must equal LEAD_CANARY_SOURCE in lib/site.ts. It is repeated here
-- rather than read from anywhere because SQL has no import; if you change one,
-- change the other in the same commit.
--
-- `is distinct from` not `<>`: source is nullable and a real submission with no
-- ?src= code carries NULL. `NULL <> 'canary:leads-probe'` is NULL, not true, so
-- a WHEN clause using `<>` would skip the trigger for every organic lead and
-- silently stop all lead email -- the precise failure this canary exists to
-- catch, introduced by the canary.
drop trigger if exists lead_arrived on public.leads;
create trigger lead_arrived
  after insert on public.leads
  for each row
  when (new.source is distinct from 'canary:leads-probe')
  execute function public.notify_new_lead();

-- ---------------------------------------------------------------------------
-- 2. Reap probe rows before they can age into an SLA breach.
-- ---------------------------------------------------------------------------
-- This is what keeps problem (2) above from happening: no canary row survives
-- long enough to reach the 24h 'due' threshold, so record_lead_sla_breaches()
-- never sees one and needs no edit.
--
-- Retention is 90 minutes against an hourly probe on purpose -- the most recent
-- success stays visible in leads_queue as proof the insert path is alive, while
-- at most two rows ever exist at once. Deletes are safe: lead_alert_log.lead_id
-- is `on delete set null` (lead-email-alerts.sql:67) and lead_sla_events.lead_id
-- is `on delete cascade` (leads-visibility.sql:80).
create or replace function public.reap_canary_leads()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  removed integer;
begin
  delete from public.leads
  where source = 'canary:leads-probe'
    and created_at < now() - interval '90 minutes';
  get diagnostics removed = row_count;
  return removed;
end
$$;

-- security definer + the inherited public EXECUTE grant would let anon call a
-- function that deletes rows from leads. It only ever matches probe rows, but a
-- DELETE reachable from the browser key is not a thing this project ships.
revoke all on function public.reap_canary_leads() from public, anon, authenticated;

-- Every 15 minutes. Re-scheduling the same job name replaces it, so idempotent.
select cron.schedule(
  'reap-canary-leads',
  '*/15 * * * *',
  $cron$select public.reap_canary_leads();$cron$
);

-- ---------------------------------------------------------------------------
-- 3. OPTIONAL — hide probe rows from the queue entirely.
-- ---------------------------------------------------------------------------
-- NOT RUN BY DEFAULT, and not included above, because leads_queue exists in two
-- versions (leads-visibility.sql:104-120 and the wider one in
-- leads-dedup.sql:165-192) and this checkout cannot tell which is live. A
-- `create or replace view` with the wrong column list would drop website_host /
-- duplicate_of / is_repeat from Josh's queue.
--
-- With §2 applied there are at most two probe rows present at any time and they
-- say "CANARY -- automated liveness probe, ignore" in the business column, so
-- this is cosmetic. If you want it: dump the live definition, add the predicate
-- to it by hand, and re-run that.
--
--   select pg_get_viewdef('public.leads_queue', true);
--   -- then append to its WHERE clause (or add one):
--   --   where l.source is distinct from 'canary:leads-probe'

-- ---------------------------------------------------------------------------
-- 4. After applying.
-- ---------------------------------------------------------------------------
-- Confirm the trigger carries its condition (should print the WHEN clause):
--   select pg_get_triggerdef(oid) from pg_trigger where tgname = 'lead_arrived';
--
-- Confirm the reaper is scheduled:
--   select jobname, schedule, active from cron.job where jobname = 'reap-canary-leads';
--
-- Prove the suppression works end to end. Run the probe by hand, then check
-- that a row landed and NO alert was logged for it:
--   npm run canary:leads
--
--   select id, business, source, created_at from public.leads
--   where source = 'canary:leads-probe' order by created_at desc limit 3;
--
--   select count(*) from public.lead_alert_log
--   where created_at > now() - interval '5 minutes';   -- expect 0
--
-- Then confirm REAL leads still alert -- this file edits the trigger that mails
-- them, so a mistake here is silent lost email, which is worse than the problem
-- it fixes. The browser contract is unchanged, so both launch gates still pass:
--   npm run verify:leads
-- verify-leads-backend.mjs posts source = 'canary:leads-probe' too, so it no
-- longer mails a fake lead on every run; its row is reaped with the rest.
