"use client";

import { useRef, useState } from "react";
import { FORM_ENDPOINT, SUPABASE_PUBLISHABLE_KEY } from "@/lib/site";

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
  { name: "business", label: "Business name", type: "text", placeholder: "Bluequarry Growth" },
  { name: "website", label: "Website", type: "url", placeholder: "https://bluequarrygrowth.com" },
  { name: "area", label: "City / service area", type: "text", placeholder: "Berkeley, CA" },
] as const;

const INPUT_CLASS =
  "mt-1.5 w-full rounded-xl border border-line-dark bg-white px-3 py-2.5 text-base text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15";

type Lead = Record<string, FormDataEntryValue | null>;

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
  const [phoneStatus, setPhoneStatus] = useState<"idle" | "sending" | "done">("idle");
  const submitted = useRef<Lead | null>(null);

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
      // the manual queue merges. notes marks it for Josh.
      await postLead({
        ...submitted.current,
        phone,
        notes: "phone follow-up opt-in (post-submit)",
      });
    } catch {
      // Non-blocking: the lead itself already landed.
    }
    setPhoneStatus("done");
  }

  if (status === "done") {
    return (
      <div data-testid="free-check-confirmation" className="border-t-2 border-ink pt-6">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          Got it. We&rsquo;re running your check.
        </h2>
        <p className="mt-3 text-base leading-7 text-ink-soft">
          Your report will land in your inbox within 1–2 business days.
        </p>

        {phoneStatus === "done" ? (
          <p className="mt-6 text-sm leading-6 text-ink-soft">
            Noted. Josh will call once your report is ready.
          </p>
        ) : (
          <form onSubmit={handlePhone} className="mt-6 max-w-sm">
            <label htmlFor="phone" className="block text-sm font-semibold text-ink">
              Want Josh to walk you through the report? (optional)
            </label>
            <p className="mt-1 text-xs leading-5 text-ink-faint">
              Leave a number and he&rsquo;ll call when it&rsquo;s ready. No
              sales calls otherwise.
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
        {status === "submitting" ? "Submitting…" : "Run my free check"}
      </button>

      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-bad">
          Something went wrong sending your details. Please email us instead and
          we&rsquo;ll run your check.
        </p>
      )}
    </form>
  );
}
