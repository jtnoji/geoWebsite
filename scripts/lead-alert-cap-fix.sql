-- Fix: the hourly alert cap counts its own suppression rows.
-- Paste into the Supabase SQL editor of the project in lib/site.ts, AFTER
-- scripts/lead-email-alerts.sql. Idempotent.
--
-- THE BUG. send_lead_alert() caps sends at 20/hour because the publishable key
-- is public and PostgREST has no per-IP rate limit on the free plan, so the
-- insert path is otherwise a button for burning the Resend quota. Correct
-- motive. But the count is over EVERY row in lead_alert_log in the last hour
-- (lead-email-alerts.sql:127-129, no `kind` filter), and the suppression path
-- itself writes a row with kind='flood' (:132-134).
--
-- So the cap is self-feeding. Once tripped, every further attempt writes another
-- flood row, which keeps the count above the cap, which writes another flood
-- row. A burst of 20 real sends followed by a trickle of legitimate leads
-- suppresses ALL of them for a full hour and beyond -- and the suppressed ones
-- are exactly the leads a person is waiting on. The cap was meant to bound
-- spend; as written it bounds notification, indefinitely, under load.
--
-- THE FIX. Count only rows that represent an actual send attempt. flood rows are
-- a record of a NON-send and must not extend the window that produced them.
--
-- This replaces one function. It does not touch the trigger, the reconciler, the
-- cron jobs, or the recipient list.

create or replace function public.send_lead_alert(
  p_kind    text,
  p_lead_id uuid,
  p_subject text,
  p_body    text
)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  api_key      text;
  sender       text := 'onboarding@resend.dev';
  recipients   text[] := array['abhinavjinka@gmail.com'];
  hourly_cap   constant integer := 20;
  sent_recently integer;
  request_id   bigint;
begin
  -- Count ATTEMPTED SENDS only. `kind <> 'flood'` is the fix: a flood row
  -- records that we did not send, so counting it would let the cap sustain
  -- itself long after real volume subsided.
  select count(*) into sent_recently
  from public.lead_alert_log
  where created_at > now() - interval '1 hour'
    and kind <> 'flood';

  if sent_recently >= hourly_cap then
    insert into public.lead_alert_log (kind, lead_id, subject)
    values ('flood', p_lead_id, p_subject);
    return;
  end if;

  select decrypted_secret into api_key
  from vault.decrypted_secrets
  where name = 'RESEND_API_KEY';

  if api_key is null then
    insert into public.lead_alert_log (kind, lead_id, subject, error)
    values (p_kind, p_lead_id, p_subject, 'RESEND_API_KEY missing from vault');
    return;
  end if;

  select net.http_post(
    url     := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
                 'Authorization', 'Bearer ' || api_key,
                 'Content-Type',  'application/json'
               ),
    body    := jsonb_build_object(
                 'from',    sender,
                 'to',      to_jsonb(recipients),
                 'subject', p_subject,
                 'html',    p_body
               )
  ) into request_id;

  insert into public.lead_alert_log (kind, lead_id, subject, request_id)
  values (p_kind, p_lead_id, p_subject, request_id);
end;
$$;

revoke all on function public.send_lead_alert(text, uuid, text, text)
  from public, anon, authenticated;

-- ⚠️ BEFORE RUNNING: this file reproduces send_lead_alert() as documented in
-- scaffold.md §6b. If the live function has drifted from that description --
-- a changed sender, a second recipient once DOMAIN is verified with Resend, a
-- different vault key name -- diff it first and port ONLY the `kind <> 'flood'`
-- predicate rather than replacing the body wholesale:
--
--   select prosrc from pg_proc where proname = 'send_lead_alert';
--
-- Verify after: trip the cap in a scratch window and confirm the count stops
-- climbing once sends stop.
--   select kind, count(*) from public.lead_alert_log
--   where created_at > now() - interval '1 hour' group by kind;
