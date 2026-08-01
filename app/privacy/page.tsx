import type { Metadata } from "next";
import Link from "next/link";
import FaqSection from "@/components/FaqSection";
import PageSchema from "@/components/PageSchema";
import { delay } from "@/lib/reveal";
import { crumb, type Faq } from "@/lib/schema";
import { BRAND, EMAIL, NAP } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy: what we collect and why",
  description:
    "What the free check collects, who stores it, and how to have it deleted. No cookies, no trackers, nothing sold.",
  alternates: { canonical: "/privacy/" },
};

/**
 * DRAFT FOR FOUNDER REVIEW (2026-07-25). Every factual claim below was verified
 * against the code that ships:
 *   - fields come from FIELDS + the post-submit phone ask in FreeCheckForm.tsx
 *   - `source`/`referrer` are set in FreeCheckForm.tsx handleSubmit
 *   - the honeypot is deleted before the POST, never stored
 *   - the only network destination the BROWSER has is the Supabase project in
 *     lib/site.ts, which is also the only non-self origin in vercel.json
 *     `connect-src`. Supabase then posts the alert email to Resend server-side
 *     (scripts/lead-email-alerts.sql), which is why "who else can see my
 *     details" names three companies and `connect-src` still names one
 *   - no cookie, localStorage or sessionStorage use anywhere in the source
 *   - fonts are self-hosted by next/font, so there is no font CDN request
 *
 * The two RETENTION values below are business commitments, not observations.
 * They are the only numbers here that are not derived from the code, so they
 * need Josh's sign-off (and ideally counsel's) before launch. See
 * website-plan.md §6.
 */
const RETENTION_MONTHS = 12;
const DELETION_DAYS = 30;
const EFFECTIVE = "25 July 2026";

const POLICY: Faq[] = [
  {
    question: "What does the free check collect?",
    answer:
      "Five things you type: your business name, your website, your city or service area, a short description of what you do, and your email address. Nothing else is required.",
  },
  {
    question: "Is anything collected that I did not type?",
    answer:
      "Two things, both about how you arrived. If you followed a link with a campaign code in it, we store that code. We also store the address of the page that referred you, which your browser sends to every site you visit.",
  },
  {
    question: "What about the phone number you ask for afterwards?",
    answer:
      "That is optional and it is only asked after your check is already submitted. If you leave a number, Josh calls you once, when your report is ready. We do not text it, add it to a dialler, or use it for anything else.",
  },
  {
    question: "Why do you collect it?",
    answer:
      "To run your check and email you the report. Your website and description tell us which questions to ask the AI engines, and your city tells us where to ask them from.",
  },
  {
    question: "Does this site use cookies or trackers?",
    answer:
      "No cookies, and nothing that follows you from site to site. We count page views with Vercel Web Analytics, which stores no identifier on your device and builds no profile of you. Its script and our fonts are both served from our own domain, so loading a page contacts nobody else.",
  },
  {
    // Accurate as of the crawler-log build (scaffold.md 6c): the panel on
    // /our-score is dormant and no Log Drain exists, so nothing leaves Vercel.
    // ENABLING A DRAIN CHANGES THIS ANSWER. It sends every request log to a new
    // destination, which is a new subprocessor, so name it here in the same
    // commit and drop the last sentence.
    question: "Do you keep server logs?",
    answer:
      "Vercel records a standard request log when your browser asks for a page: your IP address, which page, and your browser's user agent. Every web server does this, and it is separate from the page-view count above. We do not forward those logs to anyone else, and we never use them to work out who you are. If that changes, for example to count which AI crawlers visit us, this page will name where they go before it happens.",
  },
  {
    // Resend was added 2026-07-30 with scripts/lead-email-alerts.sql. It is a
    // subprocessor: your submission is in the body of the alert email we send
    // ourselves. It is contacted by Supabase, never by your browser, so it is
    // NOT a `connect-src` entry in vercel.json. Any further destination for
    // this data gets named here in the same commit that adds it.
    question: "Who else can see my details?",
    answer:
      "Three companies, all acting as our infrastructure: Vercel hosts the site and counts page views, Supabase stores your submission, and Resend delivers the email that tells us your check arrived. We do not sell your details, share them with advertisers, or add you to a marketing list.",
  },
  {
    question: "How long do you keep it?",
    answer: `We keep your submission while you are a live prospect or a client. If you never become either, we delete it after ${RETENTION_MONTHS} months.`,
  },
  {
    question: "How do I get my data deleted?",
    answer: `Email ${EMAIL} and ask. We delete it within ${DELETION_DAYS} days and reply to confirm. You do not need an account and you do not need to explain why.`,
  },
  {
    question: "What do you do with my website address?",
    answer:
      "We fetch your public pages the way an AI crawler would, and we ask public AI engines questions about your business. We only ever look at what is already publicly visible.",
  },
];

export default function Privacy() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 md:py-20">
      <PageSchema meta={metadata} path="/privacy/" trail={[crumb("/privacy/")]} />

      {/* Head centres; the policy Q&A below stays left-aligned so the answers
          read as body copy (CLAUDE.md "Alignment"). */}
      <div data-reveal className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-ink">Privacy</h1>
        <p className="mt-5 text-base leading-7 text-ink-soft">
          {BRAND} runs AI visibility checks from {NAP.city}, {NAP.region}. The
          only personal information we hold is what you send through the free
          check. This page says exactly what that is, in the same plain
          language as the rest of the site.
        </p>
        <p className="mt-3 text-sm text-ink-faint">In effect since {EFFECTIVE}</p>
      </div>

      <div data-reveal style={delay(110)} className="mt-12">
        {/* withSchema={false}: FAQPage markup on a legal page would claim these
            are the site's FAQs. The visible copy is the whole point here. */}
        <FaqSection faqs={POLICY} withSchema={false} />
      </div>

      <div data-reveal className="mt-12 border-t-2 border-ink pt-6">
        <h2 className="text-2xl font-bold tracking-tight text-ink">
          Questions, or a request?
        </h2>
        <p className="mt-3 text-base leading-7 text-ink-soft">
          Email{" "}
          <a
            href={`mailto:${EMAIL}`}
            className="font-semibold text-ink hover:text-accent"
          >
            {EMAIL}
          </a>
          . If we change this policy, we change the date above and the page
          history is public in our repository.
        </p>
        <Link href="/contact/" className="btn-solid mt-6 inline-block px-5 py-2.5 text-sm">
          Contact us
        </Link>
      </div>
    </div>
  );
}
