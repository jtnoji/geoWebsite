-- Hardening pass for the public /free-check insert path.
-- Paste into the Supabase SQL editor of the project in lib/site.ts, after
-- scripts/leads-table.sql. Idempotent: safe to re-run.
--
-- WHAT THIS FIXES
-- The original policy is `with check (true)`, and every column is unbounded
-- `text`. The publishable key is public by design, so anyone can POST to
-- /rest/v1/leads directly — bypassing the form, the honeypot, and the browser.
-- With `true` they can insert rows of arbitrary size, as fast as the API
-- allows, which runs up storage and buries real prospects in the queue.
--
-- Confirmed still enforced after this runs (probe with the publishable key):
--   GET    /rest/v1/leads -> 401 permission denied
--   DELETE /rest/v1/leads -> 401 permission denied
--   GET    /rest/v1/      -> 401 secret API key required

-- 1. Bound every attacker-controlled column. Limits are ~10x the longest
--    plausible real answer, so no legitimate submission is refused.
alter table public.leads
  drop constraint if exists leads_field_lengths,
  add constraint leads_field_lengths check (
    length(business)    between 1 and 200
    and length(website) between 4 and 500
    and length(area)    between 1 and 200
    and length(email)   between 3 and 320   -- RFC 5321 max
    and length(description) between 1 and 2000
    and (phone    is null or length(phone)    <= 40)
    and (source   is null or length(source)   <= 100)
    and (referrer is null or length(referrer) <= 500)
    and (notes    is null or length(notes)    <= 500)
  );

-- 2. Shape checks: an email that cannot receive a report and a website we
--    cannot fetch are both useless to the pipeline and cost API budget.
alter table public.leads
  drop constraint if exists leads_email_shape,
  add constraint leads_email_shape check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$');

alter table public.leads
  drop constraint if exists leads_website_shape,
  add constraint leads_website_shape check (website ~* '^https?://[^[:space:]]+$');

-- 3. Re-state the anon INSERT policy with the same bounds. Constraints alone
--    would be enough, but keeping them in the policy means a future
--    `alter table ... drop constraint` cannot silently reopen the hole.
drop policy if exists "anon can insert leads" on public.leads;
create policy "anon can insert leads"
  on public.leads for insert to anon
  with check (
    length(business) between 1 and 200
    and length(website) between 4 and 500
    and length(area) between 1 and 200
    and length(email) between 3 and 320
    and length(description) between 1 and 2000
    -- Queue-management columns are server-side only; the browser must never
    -- set them. `status` keeps its default so Josh's vetting state is safe.
    and status = 'new'
    and sent_at is null
    and teaser_url is null
    and audit_run_id is null
    -- `notes` is Josh's vetting field. Staff read it as authored by staff, so
    -- an anon-writable `notes` is a direct route to putting attacker text in
    -- front of the person triaging the queue.
    and notes is null
  );

-- 4. Anon keeps INSERT and nothing else, even if a policy is edited later, and
--    the INSERT is COLUMN-SCOPED to the fields the form actually posts.
--
--    Verified 2026-07-25 against the live project: without this, a plain
--    `grant insert on public.leads` let an anonymous caller POST
--    status='disqualified', notes, teaser_url, audit_run_id and sent_at and
--    get HTTP 201. Those are queue-management columns that staff read as
--    trusted, so a forged row can plant an attacker URL where Josh expects a
--    generated report link. The policy in §3 blocks this too; the grant is the
--    belt to that braces, because a grant cannot be bypassed by a policy edit.
revoke all on public.leads from anon;
grant insert (business, website, area, description, email, phone, source, referrer)
  on public.leads to anon;

-- 5. REMOVED 2026-07-27. This was a unique index on (email, minute) as a flood
--    brake. It was wrong twice over:
--
--    a) It does not run. `date_trunc('minute', timestamptz)` is STABLE, not
--       IMMUTABLE, because the result depends on the session TimeZone, and
--       Postgres refuses STABLE functions in an index expression:
--         ERROR: 42P17 functions in index expression must be marked IMMUTABLE
--
--    b) Worse, had it run it would have silently broken the product. The
--       post-submit phone opt-in in FreeCheckForm.tsx inserts a SECOND row with
--       the SAME email, from the confirmation screen, so inside the same
--       minute. That is a unique violation, and the client swallows the error
--       ("Non-blocking: the lead itself already landed"). Josh would simply
--       never receive phone numbers and would conclude nobody wanted a call.
--
--    It was also low value: a flood just varies the email address. Real rate
--    limiting needs to see the IP, which is the note below.

-- STILL OPEN (needs a decision, not SQL):
-- PostgREST has no per-IP rate limit on the free plan. If the form gets
-- abused, the fix is an Edge Function in front of the insert (it can see the
-- IP and rate-limit) or Cloudflare Turnstile on the form. Turnstile would add
-- a third-party script, so it needs a `script-src`/`connect-src` entry in
-- vercel.json — do not add it without updating the CSP or the form will
-- silently stop submitting.
