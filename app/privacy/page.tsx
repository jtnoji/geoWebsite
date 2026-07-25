import type { Metadata } from "next";
import Link from "next/link";
import FaqSection from "@/components/FaqSection";
import { type Faq } from "@/lib/schema";
import { BRAND, EMAIL, NAP } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy: what we collect and why",
  description:
    "What the free check collects, who stores it, and how to have it deleted. No cookies, no trackers, nothing sold.",
};

/**
 * DRAFT FOR FOUNDER REVIEW (2026-07-25). Every factual claim below was verified
 * against the code that ships:
 *   - fields come from FIELDS + the post-submit phone ask in FreeCheckForm.tsx
 *   - `source`/`referrer` are set in FreeCheckForm.tsx handleSubmit
 *   - the honeypot is deleted before the POST, never stored
 *   - the only network destination is the Supabase project in lib/site.ts,
 *     which is also the only non-self origin in vercel.json `connect-src`
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
      "No. This site sets no cookies, runs no analytics, and loads no third-party scripts. Fonts are served from our own domain rather than a font CDN, so nothing about your visit reaches anyone else.",
  },
  {
    question: "Who else can see my details?",
    answer:
      "Two companies, both acting as our infrastructure: Vercel hosts the site, and Supabase stores the submission. We do not sell your details, share them with advertisers, or add you to a marketing list.",
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
      {/* Head centres; the policy Q&A below stays left-aligned so the answers
          read as body copy (CLAUDE.md "Alignment"). */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-ink">Privacy</h1>
        <p className="mt-5 text-base leading-7 text-ink-soft">
          {BRAND} runs AI visibility checks from {NAP.city}, {NAP.region}. The
          only personal information we hold is what you send through the free
          check. This page says exactly what that is, in the same plain
          language as the rest of the site.
        </p>
        <p className="mt-3 text-sm text-ink-faint">In effect since {EFFECTIVE}</p>
      </div>

      <div className="mt-12">
        {/* withSchema={false}: FAQPage markup on a legal page would claim these
            are the site's FAQs. The visible copy is the whole point here. */}
        <FaqSection faqs={POLICY} withSchema={false} />
      </div>

      <div className="mt-12 border-t-2 border-ink pt-6">
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
