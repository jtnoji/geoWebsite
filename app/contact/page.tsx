import type { Metadata } from "next";
import Link from "next/link";
import PageSchema from "@/components/PageSchema";
import { delay } from "@/lib/reveal";
import { crumb } from "@/lib/schema";
import { EMAIL, OFFER_CTA } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact: email or book a 20-minute call",
  description:
    "Email us or book a 20-minute call with Josh. Prefer to see your numbers first? Start with the free AI visibility check.",
  alternates: { canonical: "/contact/" },
};

export default function Contact() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 text-center sm:px-8 md:py-20">
      <PageSchema
        meta={metadata}
        path="/contact/"
        type="ContactPage"
        trail={[crumb("/contact/")]}
      />
      <div data-reveal>
        <h1 className="text-4xl font-bold tracking-tight text-ink">Contact</h1>
        <p className="mt-5 text-base leading-7 text-ink-soft">
          The fastest route is a 20-minute call with Josh. No deck, just your
          questions and, if you&rsquo;ve run the free AI visibility check, your
          numbers.
        </p>
      </div>

      <div className="mt-12">
        <section data-reveal className="border-t border-line-dark py-7">
          <h2 className="text-base font-semibold text-ink">Email</h2>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-2 inline-block text-base font-medium text-ink hover:text-accent"
          >
            {EMAIL}
          </a>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            We reply within one business day.
          </p>
        </section>

        <section data-reveal style={delay(110)} className="border-t border-line-dark py-7">
          <h2 className="text-base font-semibold text-ink">Book a call</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {/* Swap this block for the scheduling embed (Cal.com / Calendly)
                once the account is set up — same slot, no layout change. */}
            The scheduling link comes with launch. Until then, email us and
            we&rsquo;ll send times.
          </p>
        </section>

        <section data-reveal style={delay(220)} className="border-t border-line-dark py-7">
          <h2 className="text-base font-semibold text-ink">
            Prefer to see your numbers first?
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Run the free AI visibility check. Your report lands in your inbox
            within 1–2 business days, no call required.
          </p>
          <Link
            href="/free-check/"
            className="btn-solid mt-4 px-5 py-2.5 text-sm"
          >
            {OFFER_CTA}
          </Link>
        </section>
      </div>
    </div>
  );
}
