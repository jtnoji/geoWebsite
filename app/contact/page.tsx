import type { Metadata } from "next";
import Link from "next/link";
import { EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact — email or book a 20-minute call",
  description:
    "Email us or book a 20-minute call with Josh. Prefer to see your numbers first? Start with the free AI visibility check.",
};

export default function Contact() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 md:py-20">
      <h1 className="text-4xl font-bold tracking-tight text-ink">Contact</h1>
      <p className="mt-5 text-base leading-7 text-ink-soft">
        The fastest route is a 20-minute call with Josh — no deck, just your
        questions and, if you&rsquo;ve run the free check, your numbers.
      </p>

      <div className="mt-12">
        <section className="border-t border-line-dark py-7">
          <h2 className="text-base font-semibold text-ink">Email</h2>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-2 inline-block text-base font-medium text-accent hover:text-accent-dark"
          >
            {EMAIL}
          </a>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            We reply within one business day.
          </p>
        </section>

        <section className="border-t border-line-dark py-7">
          <h2 className="text-base font-semibold text-ink">Book a call</h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {/* Swap this block for the scheduling embed (Cal.com / Calendly)
                once the account is set up — same slot, no layout change. */}
            Scheduling link coming with launch — until then, email us and
            we&rsquo;ll send times for a 20-minute call with Josh.
          </p>
        </section>

        <section className="border-t border-line-dark py-7">
          <h2 className="text-base font-semibold text-ink">
            Prefer to see your numbers first?
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Run the free visibility check — your report lands in your inbox
            within 1–2 business days, no call required.
          </p>
          <Link
            href="/free-check/"
            className="mt-4 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            Get your free AI visibility check
          </Link>
        </section>
      </div>
    </div>
  );
}
