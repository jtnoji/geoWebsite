"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SAMPLE_CLIENT } from "@/lib/sample";
import { FORM_ENDPOINT, OFFER, SUPABASE_PUBLISHABLE_KEY } from "@/lib/site";

/**
 * The ONE interactive island besides the nav toggle (scaffold §1 rule).
 * Submissions go to the manual-review queue (scaffold §6): POST to
 * FORM_ENDPOINT when configured. While the endpoint is unset the form still
 * validates and confirms, so the funnel is testable end-to-end.
 *
 * Invisible extras (leads-table.sql):
 * - `source`/`referrer` attribution: ?src= campaign code + document.referrer,
 *   read at submit time — never visible fields.
 * - Honeypot: a visually hidden "company website" field real users never see;
 *   if filled, we pretend to succeed and never POST.
 * - Post-submit phone ask: OPTIONAL, on the confirmation screen only — RLS is
 *   insert-only, so the opt-in lands as a second row Josh merges in the queue.
 */

const FIELDS = [
  { name: "business", label: "Business name", type: "text", placeholder: SAMPLE_CLIENT },
  { name: "website", label: "Website", type: "url", placeholder: "https://bluequarrygrowth.com" },
  { name: "area", label: "City / service area", type: "text", placeholder: "Berkeley, CA" },
] as const;

const INPUT_CLASS =
  "mt-1.5 w-full rounded-xl border border-line-dark bg-white px-3 py-2.5 text-base text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15";

type Lead = Record<string, FormDataEntryValue | null>;

/**
 * A hostname, or an http(s) URL to one. The `site` param is written straight
 * into a field the visitor is about to submit, so anything that is not clearly
 * a domain is dropped rather than cleaned up: a half-parsed value in a
 * prefilled field is worse than an empty one, because the visitor assumes we
 * put something correct there.
 */
const HOSTLIKE = /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/[^\s]*)?$/i;

/** `?site=` from the home hero's one-field form, normalised for `type=url`. */
function handedOverSite(): string | null {
  const raw = new URLSearchParams(window.location.search).get("site")?.trim();
  if (!raw || raw.length > 200 || !HOSTLIKE.test(raw)) return null;
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

async function postLead(lead: Lead): Promise<void> {
  if (!FORM_ENDPOINT || !SUPABASE_PUBLISHABLE_KEY) return;
  const res = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(lead),
  });
  if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
}

export default function FreeCheckForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [phoneStatus, setPhoneStatus] = useState<
    "idle" | "sending" | "done" | "error"
  >("idle");
  const submitted = useRef<Lead | null>(null);
  const websiteRef = useRef<HTMLInputElement>(null);

  /* Prefill runs after mount, never during render. This component is
     server-rendered into the static export, so reading location.search during
     render would hydrate a value the exported HTML does not contain. Writing
     .value on a real input keeps the field uncontrolled and editable. */
  useEffect(() => {
    const input = websiteRef.current;
    if (!input || input.value) return;
    const site = handedOverSite();
    if (site) input.value = site;
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = new FormData(e.currentTarget);

    // Honeypot: real users never see this field. Bots that fill it get a
    // convincing "success" and nothing is stored.
    if (form.get("company_website")) {
      setStatus("done");
      return;
    }
    form.delete("company_website");

    const data: Lead = Object.fromEntries(form.entries());
    // Invisible attribution (leads-table.sql): campaign code + referrer.
    data.source = new URLSearchParams(window.location.search).get("src");
    data.referrer = document.referrer || null;

    try {
      await postLead(data);
      submitted.current = data;
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  async function handlePhone(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const phone = new FormData(e.currentTarget).get("phone");
    if (!phone || !submitted.current) {
      setPhoneStatus("done");
      return;
    }
    setPhoneStatus("sending");
    try {
      // RLS is insert-only, so the opt-in is a second row (same email) that
      // the manual queue merges. A non-null `phone` IS the marker: the first
      // row never carries one.
      //
      // Deliberately does NOT set `notes`. That column is Josh's vetting field
      // and staff read it as staff-authored, so harden-leads-rls.sql keeps it
      // out of the anon grant. Sending it here would fail with 42501, and the
      // catch below would swallow it — the opt-in would break silently and
      // look like nobody wanted a call.
      await postLead({ ...submitted.current, phone });
    } catch {
      // Still non-blocking — the lead itself already landed — but say so.
      // Silently showing "Josh will call" after a failed write promises a call
      // nobody scheduled, and it is how a broken opt-in stays invisible: the
      // symptom is Josh concluding that nobody wants one.
      setPhoneStatus("error");
      return;
    }
    setPhoneStatus("done");
  }

  if (status === "done") {
    return (
      <div data-testid="free-check-confirmation" className="border-t-2 border-ink pt-6">
        <h2 className="display text-[27px] text-ink">
          Got it. We&rsquo;re running your check.
        </h2>
        <p className="mt-3 text-base leading-7 text-ink-soft">
          Your report will land in your inbox within 1–2 business days.
        </p>

        {phoneStatus === "error" ? (
          <p className="mt-6 text-sm font-medium leading-6 text-ink">
            We couldn&rsquo;t save that number, so reply to your report if
            you&rsquo;d like a call. Your check is running either way.
          </p>
        ) : phoneStatus === "done" ? (
          <p className="mt-6 text-sm leading-6 text-ink-soft">
            Noted. Josh will call once your report is ready.
          </p>
        ) : (
          <form onSubmit={handlePhone} className="mt-6 max-w-sm">
            <label htmlFor="phone" className="block text-sm font-semibold text-ink">
              Want Josh to walk you through the report? (optional)
            </label>
            <p className="mt-1 text-xs leading-5 text-ink-faint">
              Leave a number and he&rsquo;ll call once, when it&rsquo;s ready.
              No texts, no dialler, no sales calls otherwise.
            </p>
            <div className="mt-2 flex gap-2">
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="(510) 555-0100"
                className="w-full rounded-xl border border-line-dark bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                disabled={phoneStatus === "sending"}
                className="btn-solid shrink-0 px-4 py-2 text-xs disabled:opacity-60"
              >
                {phoneStatus === "sending" ? "…" : "Add"}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" data-testid="free-check-form">
      {/* Honeypot — visually hidden, excluded from a11y tree and tab order */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="company_website">Company website</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {FIELDS.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-semibold text-ink">
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            ref={field.name === "website" ? websiteRef : undefined}
            type={field.type}
            required
            placeholder={field.placeholder}
            className={INPUT_CLASS}
          />
        </div>
      ))}

      <div>
        <label htmlFor="description" className="block text-sm font-semibold text-ink">
          What do you do?
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          placeholder="B2B marketing for seed-stage startups: positioning, content, demand gen."
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@yourbusiness.com"
          className={INPUT_CLASS}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-solid w-full justify-center px-6 py-3 text-[13px] disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : `Run my ${OFFER}`}
      </button>

      {/* Notice at the point of collection. Kept to one sentence so it informs
          without reading as a legal wall; /privacy carries the detail. */}
      <p className="text-xs leading-5 text-ink-faint">
        We use these details only to run your check and email the report. No
        marketing list, no cookies, nothing sold.{" "}
        <Link href="/privacy/" className="font-semibold text-ink-soft hover:text-accent">
          How we handle your data
        </Link>
        .
      </p>

      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-ink">
          That didn&rsquo;t send. Email us instead and we&rsquo;ll run your
          check.
        </p>
      )}
    </form>
  );
}
