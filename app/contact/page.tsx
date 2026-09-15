import type { Metadata } from "next";
import Link from "next/link";
import PageSchema from "@/components/PageSchema";
import { HEAD_SPLIT, SECTION } from "@/lib/layout";
import { delay } from "@/lib/reveal";
import { crumb } from "@/lib/schema";
import { EMAIL, OFFER_CTA } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Contact: email or book a 20-minute call",
  description:
    "Email us or book a 20-minute call with Josh. Prefer to see your numbers first? Start with the free AI visibility check.",
  path: "/contact/",
});

/**
 * Full width like every page (Josh, 2026-09-14). It used to sit centred in a
 * narrow column; the three ways to reach us now stand side by side from lg up,
 * so the page spans the screen.
 */
export default function Contact() {
  return (
    <div className={SECTION}>
      <PageSchema
        meta={metadata}
        path="/contact/"
        type="ContactPage"
        trail={[crumb("/contact/")]}
      />

      <div className={HEAD_SPLIT}>
        <h1
          data-reveal
          className="display text-[clamp(34px,4.4vw,96px)] leading-[1.05] text-ink"
        >
          Contact
        </h1>
        <p
          data-reveal
          style={delay(100)}
          className="max-w-[52ch] text-[clamp(16px,1.111vw,20px)] leading-[1.7] text-ink-soft"
        >
          The fastest route is a 20-minute call with Josh. No deck, just your
          questions and, if you&rsquo;ve run the free AI visibility check, your
          numbers.
        </p>
      </div>

      <div
        data-reveal="stagger"
        className="mt-14 grid gap-x-10 lg:grid-cols-3 wide:gap-x-16"
      >
        <section className="border-t border-line-dark py-7">
          <h2 className="text-[clamp(16px,1.111vw,20px)] font-semibold text-ink">Email</h2>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-2 inline-block text-[clamp(16px,1.111vw,20px)] font-medium text-ink hover:text-accent"
          >
            {EMAIL}
          </a>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            We reply within one business day.
          </p>
        </section>

        <section className="border-t border-line-dark py-7">
          <h2 className="text-[clamp(16px,1.111vw,20px)] font-semibold text-ink">
            Book a call
          </h2>
          <p className="mt-2 max-w-[48ch] text-sm leading-6 text-ink-soft">
            {/* Swap this block for the scheduling embed (Cal.com / Calendly)
                once the account is set up — same slot, no layout change. */}
            The scheduling link comes with launch. Until then, email us and
            we&rsquo;ll send times.
          </p>
        </section>

        <section className="border-t border-line-dark py-7">
          <h2 className="text-[clamp(16px,1.111vw,20px)] font-semibold text-ink">
            Prefer to see your numbers first?
          </h2>
          <p className="mt-2 max-w-[48ch] text-sm leading-6 text-ink-soft">
            Run the free AI visibility check. Your report lands in your inbox
            within 1–2 business days, no call required.
          </p>
          <Link href="/free-check/" className="btn btn-navy mt-4 px-5 py-3 text-[15px]">
            {OFFER_CTA}
          </Link>
        </section>
      </div>
    </div>
  );
}
