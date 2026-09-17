import { OFFER_TITLE, PRICING } from "@/lib/site";

/**
 * The three commercial options, in one place so no price on the site can
 * silently disagree with another. /pricing renders them.
 *
 * PRICES ARE STILL PLACEHOLDERS. `PRICING.audit` and `PRICING.retainer` are
 * "[$X]" in lib/site.ts and nothing here invents a number, an inclusion or a
 * guarantee to cover for that.
 */
export type ServiceTier = {
  name: string;
  price: string;
  /** The one line under the price. */
  priceNote: string;
  description: string;
  /** What the tier includes. Confirmed inclusions only. */
  includes: readonly string[];
  cta: { label: string; href: string };
  featured: boolean;
};

export const SERVICE_TIERS: readonly ServiceTier[] = [
  {
    name: OFFER_TITLE,
    price: "$0",
    priceNote: "No card, no call required",
    description:
      "The short report. Where you stand on all five engines, and who's named instead of you.",
    includes: [
      "Mention rate across five engines",
      "The competitors named instead of you",
      "Crawler access findings",
    ],
    cta: { label: "Run my free check", href: "/free-check/" },
    featured: false,
  },
  {
    name: "Full AI Visibility Audit",
    price: `${PRICING.audit} one-time`,
    priceNote: "Report and a walkthrough call",
    description:
      "Full query set across all engines, sampled runs, judged answers, accuracy findings, and a site and off-site audit.",
    includes: [
      "Full query set, sampled and judged",
      "Accuracy checked against your facts",
      "Site and off-site audit",
      "Prioritized roadmap and a walkthrough call",
    ],
    cta: { label: "Book a call", href: "/contact/" },
    featured: true,
  },
  {
    name: "Ongoing GEO",
    price: PRICING.retainer,
    /* Implementation is the newest part of the offering, so it says so rather
       than implying a running book of clients (website-plan §6, 2026-07-25). */
    priceNote: "Now booking our first implementation clients",
    description:
      "We work the roadmap ourselves: implement the fixes on your site and off it, then re-run the audit so you can see what each change did.",
    includes: [
      "Implementation on your site and off it",
      "The audit re-run on the same query set",
      "Before and after rates, new competitors and sources",
    ],
    cta: { label: "Book a call", href: "/contact/" },
    featured: false,
  },
];

/** The /pricing head, from the Sable design (2026-09-14). */
export const PRICING_COPY = {
  eyebrow: "Services and pricing",
  heading: "Start free.",
  headingAccent: "Pay when you want the whole picture.",
  body: "The free check is a real measurement, not a teaser with the numbers held back. The paid tiers add depth, the roadmap, and the work itself.",
  /* The previous head's promise, kept under the tiers: the design dropped it,
     and it is the line that says no price buys a ranking. */
  honesty:
    "Every tier reports sampled rates with named sources. None of them, at any price, promises rankings.",
} as const;
