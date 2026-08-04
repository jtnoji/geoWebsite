import { OFFER_TITLE, PRICING } from "@/lib/site";

/**
 * The three commercial options, in one place because two pages now render
 * them: /pricing in full, and the home page as the decision block.
 *
 * They lived inside app/pricing/page.tsx until 2026-08-03. Copying them onto
 * the home page would have been the third copy of a price on this site and the
 * first that could silently disagree with the other two.
 *
 * PRICES ARE STILL PLACEHOLDERS. `PRICING.audit` and `PRICING.retainer` are
 * "[$X]" in lib/site.ts and nothing here invents a number, an inclusion or a
 * guarantee to cover for that. The home page now surfaces those placeholders,
 * which raises the stakes on the launch swap: it is one file, but it is now
 * visible above the fold-and-a-half rather than only on /pricing.
 */
export type ServiceTier = {
  name: string;
  price: string;
  /** Shown under the price. Free tier only, where "no card" is the point. */
  priceNote?: string;
  description: string;
  /** What the tier includes. Confirmed inclusions only. */
  includes: readonly string[];
  note?: string;
  cta: { label: string; href: string };
  featured: boolean;
};

export const SERVICE_TIERS: readonly ServiceTier[] = [
  {
    name: OFFER_TITLE,
    price: "$0",
    priceNote: "No card, no call required",
    description:
      "The short report. Where you stand on all four engines, and who's named instead of you.",
    includes: [
      "Mention rate across four engines",
      "The competitors named instead of you",
      "Crawler access findings",
    ],
    cta: { label: "Run my free check", href: "/free-check/" },
    featured: false,
  },
  {
    name: "Full AI Visibility Audit",
    price: `${PRICING.audit} one-time`,
    description:
      "Full query set across all engines, sampled runs, judged answers, accuracy findings, and a site and off-site audit. You get a report and a walkthrough call.",
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
    description:
      "We work the roadmap ourselves: implement the fixes on your site and off it, then re-run the audit so you can see what each change did.",
    includes: [
      "Implementation on your site and off it",
      "The audit re-run on the same query set",
      "Before and after rates, new competitors and sources",
    ],
    /* Implementation is the newest part of the offering, so it says so rather
       than implying a running book of clients (website-plan §6, 2026-07-25). */
    note: "Now booking our first implementation clients.",
    cta: { label: "Book a call", href: "/contact/" },
    featured: false,
  },
];
