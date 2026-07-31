-- Email alerts for /free-check leads. Closes the open item in
-- scripts/leads-visibility.sql and scaffold.md §6b.
-- Paste into the Supabase SQL editor of the project in lib/site.ts, AFTER
-- leads-table.sql, harden-leads-rls.sql and leads-visibility.sql.
-- Idempotent: safe to re-run.
--
-- WHAT THIS FIXES
-- leads-visibility.sql made the queue readable but pushed nothing outbound, so
-- a lead that arrived while nobody was looking stayed invisible while
-- /free-check's confirmation screen had already promised a report in 1-2
-- business days. This sends mail when a lead lands, and again when one is
-- about to blow that promise.
--
-- PREREQUISITES. Both are manual, one-time, and neither belongs in git.
--
--   1. A Resend account. The real domain in lib/site.ts is still the interim
--      Vercel URL, so there is nothing to verify with Resend yet. Until there
--      is, `onboarding@resend.dev` is the only usable sender and Resend will
--      only deliver to the address that owns the account. BOTH recipients in
--      §4 must be verified on that account or one of them silently gets
--      nothing. When the real domain lands: verify it with Resend, change
--      `sender` in §4 to alerts@<domain>, and this limitation goes away.
--
--   2. The API key in Vault, never inline in this file:
--        select vault.create_secret('re_xxx', 'resend_api_key', 'Resend key for lead alerts');
--      Rotate later with:
--        select vault.update_secret(
--          (select id from vault.secrets where name = 'resend_api_key'), 're_yyy');
--
-- WHAT THIS DELIBERATELY IS NOT
-- Not a Database Webhook and not an Edge Function. Both are extra deploy
-- surface for one HTTP POST, and the webhook UI writes a trigger you cannot
-- read in git. Everything here is in this file.

-- ---------------------------------------------------------------------------
-- 1. pg_net. Available on the project, not previously installed.
-- ---------------------------------------------------------------------------
-- pg_net queues the request in a table and a background worker sends it, so
-- the call below is transactional: an INSERT that rolls back never mails, and
-- the trigger never waits on Resend while the visitor's form POST is open.
create extension if not exists pg_net;

-- If this errors with "schema net does not exist" on a later statement, the
-- extension landed in `extensions` on this project instead. Check with
--   select extnamespace::regnamespace from pg_extension where extname = 'pg_net';
-- and adjust the two net.http_post calls below.

-- ---------------------------------------------------------------------------
-- 2. THE DEFAULT-PRIVILEGE FOOTGUN AGAIN (leads-visibility.sql §0)
-- ---------------------------------------------------------------------------
-- Stock pg_default_acl grants ALL to anon and authenticated on every table
-- postgres creates in public. The table below is revoked explicitly, the same
-- way lead_sla_events is. Do not drop those revokes.

-- ---------------------------------------------------------------------------
-- 3. Send log. One row per attempt, so a failed alert is findable.
-- ---------------------------------------------------------------------------
-- pg_net is fire-and-forget: net.http_post returns a request id immediately
-- and the outcome lands in net._http_response later, where nothing looks at
-- it and Supabase deletes it after ~6 hours. An alert channel that fails
-- silently is worse than none, because you stop checking the queue by hand and
-- trust it instead. §7 reconciles this table against those responses.
create table if not exists public.lead_alert_log (
  id          bigint generated always as identity primary key,
  request_id  bigint,                 -- net.http_post's id; null when suppressed
  kind        text not null check (kind in ('new_lead','phone_optin','sla_due','sla_overdue','flood')),
  lead_id     uuid references public.leads(id) on delete set null,
  subject     text not null,
  sent_at     timestamptz not null default now(),
  -- filled in by reconcile_lead_alerts():
  checked_at  timestamptz,
  status_code integer,
  error       text
);

create index if not exists lead_alert_log_sent_at_idx on public.lead_alert_log (sent_at desc);

alter table public.lead_alert_log enable row level security;
revoke all on public.lead_alert_log from anon, authenticated, public;
grant select on public.lead_alert_log to leads_reader;

drop policy if exists "leads_reader can read alert log" on public.lead_alert_log;
create policy "leads_reader can read alert log"
  on public.lead_alert_log for select to leads_reader
  using (true);

-- ---------------------------------------------------------------------------
-- 4. The one send path. Recipients and sender live here and nowhere else.
-- ---------------------------------------------------------------------------
create or replace function public.send_lead_alert(
  p_kind    text,
  p_lead_id uuid,
  p_subject text,
  p_body    text
)
returns bigint
language plpgsql
security definer
set search_path = public, net, vault, extensions
as $fn$
declare
  -- Change recipients HERE. Both functions below call this one.
  recipients constant text[] := array['joshuanoji@gmail.com', 'abhinavjinka@gmail.com'];
  sender     constant text   := 'AI visibility alerts <onboarding@resend.dev>';
  -- Flood brake, see below.
  hourly_cap constant integer := 20;

  api_key    text;
  recent     integer;
  clean_subj text;
  req_id     bigint;
begin
  -- The publishable key is public by design and PostgREST has no per-IP rate
  -- limit on the free plan (harden-leads-rls.sql §5), so anyone can POST rows
  -- to /rest/v1/leads as fast as the API allows. Without a cap here, that is
  -- also a button for sending unlimited mail from our Resend account: the
  -- quota burns, Resend throttles us, and the ONE real lead in the flood is
  -- the mail that fails to send. Past the cap we stop mailing and record why.
  select count(*) into recent
  from public.lead_alert_log
  where sent_at > now() - interval '1 hour';

  if recent >= hourly_cap then
    insert into public.lead_alert_log (request_id, kind, lead_id, subject, error)
    values (null, 'flood', p_lead_id, p_subject,
            format('suppressed: %s alerts already sent in the last hour', recent));
    return null;
  end if;

  select decrypted_secret into api_key
  from vault.decrypted_secrets
  where name = 'resend_api_key';

  if api_key is null then
    raise exception 'vault secret resend_api_key is missing (see PREREQUISITES)';
  end if;

  -- Lead fields are attacker-controlled text. The body is sent as `text`, not
  -- `html`, so there is no markup to escape and nothing a business name can
  -- inject. The subject still gets control characters stripped and is bounded,
  -- because it becomes a mail header.
  clean_subj := left(regexp_replace(p_subject, '[[:cntrl:]]', ' ', 'g'), 180);

  select net.http_post(
    url     := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || api_key
    ),
    body    := jsonb_build_object(
      'from',    sender,
      'to',      to_jsonb(recipients),
      'subject', clean_subj,
      'text',    p_body
    ),
    timeout_milliseconds := 5000
  ) into req_id;

  insert into public.lead_alert_log (request_id, kind, lead_id, subject)
  values (req_id, p_kind, p_lead_id, clean_subj);

  return req_id;
end
$fn$;

-- security definer + the stock public EXECUTE grant would let anon send mail
-- from our account with arbitrary subject and body. Revoke it.
revoke all on function public.send_lead_alert(text, uuid, text, text)
  from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 5. Alert on arrival.
-- ---------------------------------------------------------------------------
create or replace function public.notify_new_lead()
returns trigger
language plpgsql
security definer
set search_path = public, net, vault, extensions
as $fn$
declare
  is_optin boolean;
  subj     text;
  body     text;
begin
  -- The post-submit phone opt-in inserts a SECOND row with the same email
  -- (FreeCheckForm.tsx handlePhone) because RLS is insert-only. A non-null
  -- phone IS the marker: the first row never carries one. Mailing it as a
  -- fresh lead would double-count the queue.
  is_optin := new.phone is not null;

  subj := case when is_optin
    then format('Phone opt-in: %s', new.business)
    else format('New free check: %s (%s)', new.business, new.area)
  end;

  body := case when is_optin then
    format(
      E'%s left a number for a walkthrough call.\n\n'
      'Phone:    %s\n'
      'Email:    %s\n'
      'Website:  %s\n\n'
      'This is the opt-in row, not a second lead. Merge it into the original '
      E'submission from the same email.\n\n'
      'Lead id:  %s',
      new.business, new.phone, new.email, new.website, new.id)
  else
    format(
      E'New /free-check submission.\n\n'
      'Business: %s\n'
      'Website:  %s\n'
      'Area:     %s\n'
      'Email:    %s\n'
      E'Does:     %s\n\n'
      'Source:   %s\n'
      E'Referrer: %s\n\n'
      'The confirmation screen has already promised a report in 1-2 business '
      E'days. Clock started %s UTC.\n\n'
      'Lead id:  %s\n'
      'Queue:    select * from public.leads_queue order by created_at desc;',
      new.business, new.website, new.area, new.email, new.description,
      coalesce(new.source, '(none)'), coalesce(new.referrer, '(direct)'),
      to_char(new.created_at at time zone 'UTC', 'YYYY-MM-DD HH24:MI'), new.id)
  end;

  perform public.send_lead_alert(
    case when is_optin then 'phone_optin' else 'new_lead' end,
    new.id, subj, body);

  return new;
exception when others then
  -- THE ALERT MUST NEVER COST US THE LEAD. Without this handler, a missing
  -- vault secret, a revoked key or a pg_net hiccup raises inside the INSERT
  -- transaction, PostgREST returns 500, and FreeCheckForm's catch shows "That
  -- didn't send" to a prospect whose details we then do not have. Losing the
  -- email is survivable; losing the lead is not.
  raise warning 'notify_new_lead failed for %: %', new.id, sqlerrm;
  insert into public.lead_alert_log (request_id, kind, lead_id, subject, error)
  values (null, 'flood', new.id, 'alert failed at insert time', sqlerrm);
  return new;
end
$fn$;

revoke all on function public.notify_new_lead() from public, anon, authenticated;

drop trigger if exists lead_arrived on public.leads;
create trigger lead_arrived
  after insert on public.leads
  for each row execute function public.notify_new_lead();

-- ---------------------------------------------------------------------------
-- 6. Alert when a lead is about to blow the promise.
-- ---------------------------------------------------------------------------
-- REPLACES the version in leads-visibility.sql §5, which only recorded events.
-- Same thresholds, same idempotency (unique (lead_id, level)) — that unique
-- constraint is now also what stops the hourly job re-mailing the same lead
-- every hour forever. Only newly inserted events are mailed.
--
-- NOTE: re-running leads-visibility.sql after this will silently revert the
-- emails, because it recreates this function without them. That warning is
-- also written at the top of leads-visibility.sql §5.
create or replace function public.record_lead_sla_breaches()
returns integer
language plpgsql
security definer
set search_path = public, net, vault, extensions
as $fn$
declare
  ev       record;
  inserted integer := 0;
begin
  for ev in
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
    ),
    ins as (
      insert into public.lead_sla_events (lead_id, level, age_at_record)
      select id, lvl, age from candidates where lvl is not null
      on conflict (lead_id, level) do nothing
      returning lead_id, level, age_at_record
    )
    select ins.level, ins.age_at_record, l.id, l.business, l.email, l.website, l.created_at
    from ins join public.leads l on l.id = ins.lead_id
  loop
    inserted := inserted + 1;
    perform public.send_lead_alert(
      'sla_' || ev.level,
      ev.id,
      format('%s: %s has been waiting %s',
             upper(ev.level), ev.business,
             case when ev.level = 'overdue' then '48 hours' else '24 hours' end),
      format(
        E'This lead is still status=new.\n\n'
        'Business: %s\n'
        'Email:    %s\n'
        'Website:  %s\n'
        'Arrived:  %s UTC\n'
        E'Waiting:  %s\n\n'
        'The /free-check confirmation screen promised a report in 1-2 business '
        E'days.\n\n'
        'Lead id:  %s',
        ev.business, ev.email, ev.website,
        to_char(ev.created_at at time zone 'UTC', 'YYYY-MM-DD HH24:MI'),
        justify_interval(ev.age_at_record), ev.id)
    );
  end loop;

  return inserted;
end
$fn$;

revoke all on function public.record_lead_sla_breaches() from public, anon, authenticated;

-- Unchanged from leads-visibility.sql; restated so this file is self-contained.
select cron.schedule(
  'record-lead-sla-breaches',
  '0 * * * *',
  $cron$select public.record_lead_sla_breaches();$cron$
);

-- ---------------------------------------------------------------------------
-- 7. Did the mail actually send? Reconcile against pg_net's responses.
-- ---------------------------------------------------------------------------
-- net._http_response is pruned after ~6 hours, so this runs every 5 minutes.
-- A row in lead_alert_log with status_code 200-299 was accepted by Resend.
-- Anything else is a delivery failure you would otherwise never see.
create or replace function public.reconcile_lead_alerts()
returns integer
language plpgsql
security definer
set search_path = public, net, extensions
as $fn$
declare
  updated integer;
begin
  update public.lead_alert_log a
  set checked_at  = now(),
      status_code = r.status_code,
      error       = case
        when r.status_code between 200 and 299 then null
        when r.timed_out then 'timed out'
        else coalesce(r.error_msg, left(r.content, 300))
      end
  from net._http_response r
  where r.id = a.request_id
    and a.checked_at is null;

  get diagnostics updated = row_count;

  -- Older than the retention window and still unchecked: the response was
  -- pruned before we looked. Mark it rather than leaving it ambiguous forever.
  update public.lead_alert_log
  set checked_at = now(),
      error = 'no response recorded (pg_net response pruned before reconcile)'
  where checked_at is null
    and request_id is not null
    and sent_at < now() - interval '6 hours';

  return updated;
end
$fn$;

revoke all on function public.reconcile_lead_alerts() from public, anon, authenticated;

select cron.schedule(
  'reconcile-lead-alerts',
  '*/5 * * * *',
  $cron$select public.reconcile_lead_alerts();$cron$
);

-- ---------------------------------------------------------------------------
-- AFTER RUNNING THIS
-- ---------------------------------------------------------------------------
-- 1. Store the key (§ PREREQUISITES 2) if you have not already.
-- 2. Send yourself a test alert. This writes a lead_alert_log row and nothing
--    to leads:
--      select public.send_lead_alert('new_lead', null, 'Alert test',
--        'If this arrives, the lead alert path works.');
-- 3. Wait a minute, then confirm Resend accepted it:
--      select sent_at, kind, subject, status_code, error
--      from public.lead_alert_log order by sent_at desc limit 10;
--    status_code 200 = sent. 401 = bad or missing key. 403 = the sender or
--    recipient is not verified on the Resend account (see PREREQUISITES 1).
-- 4. Check the schedules exist:
--      select jobname, schedule, active from cron.job;
--
-- ROUTINE CHECK: any lead_alert_log row with a non-null `error` is an alert
-- that did NOT arrive. The lead is still safe in `leads` either way.
--   select * from public.lead_alert_log where error is not null order by sent_at desc;
