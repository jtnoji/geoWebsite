"use client";

import { useEffect, useState } from "react";
import { FORM_ENDPOINT, SUPABASE_PUBLISHABLE_KEY } from "@/lib/site";

/**
 * The ONE interactive island besides the nav toggle (scaffold §1 rule).
 * Submissions go to the manual-review queue (scaffold §6): POST to
 * FORM_ENDPOINT when configured. While the endpoint is unset the form still
 * validates and confirms, so the funnel is testable end-to-end.
 */

const FIELDS = [
  { name: "business", label: "Business name", type: "text", placeholder: "Acme Plumbing" },
  { name: "website", label: "Website", type: "url", placeholder: "https://acmeplumbing.com" },
  { name: "area", label: "City / service area", type: "text", placeholder: "Berkeley, CA" },
] as const;

const INPUT_CLASS =
  "mt-1.5 w-full rounded-md border border-line-dark bg-white px-3 py-2.5 text-base text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15";

export default function FreeCheckForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  // Attribution, captured client-side into hidden inputs (leads-table.sql):
  // `source` = the ?src= campaign code on cold-email links; `referrer` = where
  // the visitor came from (google / chatgpt / linkedin). Filled after mount so
  // the server-rendered HTML stays stable.
  const [source, setSource] = useState("");
  const [referrer, setReferrer] = useState("");

  useEffect(() => {
    setSource(new URLSearchParams(window.location.search).get("src") ?? "");
    setReferrer(document.referrer);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    // Store blanks as NULL rather than empty strings in the nullable columns.
    for (const key of ["source", "referrer"]) {
      if (!data[key]) delete data[key];
    }
    try {
      if (FORM_ENDPOINT && SUPABASE_PUBLISHABLE_KEY) {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div
        data-testid="free-check-confirmation"
        className="border-t-2 border-ink pt-6"
      >
        <h2 className="text-2xl font-bold tracking-tight text-ink">
          Got it — we&rsquo;re running your check.
        </h2>
        <p className="mt-3 text-base leading-7 text-ink-soft">
          Your report will land in your inbox within 1–2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" data-testid="free-check-form">
      <input type="hidden" name="source" value={source} readOnly />
      <input type="hidden" name="referrer" value={referrer} readOnly />

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
          placeholder="Residential plumbing — repairs, water heaters, repiping."
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
        className="w-full rounded-md bg-accent px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Run my free check"}
      </button>

      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-bad">
          Something went wrong sending your details — please email us instead and
          we&rsquo;ll run your check.
        </p>
      )}
    </form>
  );
}
