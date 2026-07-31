/**
 * Single source of truth for brand, domain, NAP, founders, pricing, and links.
 * When the real brand name / domain / prices land, they change HERE and nowhere else.
 */

export const BRAND = "[Brand]"; // placeholder until the name is picked

export const DOMAIN = "https://geo-website-sepia.vercel.app"; // interim: Vercel URL — swap when the real domain is bought

export const TAGLINE = "AI visibility measurement for your business";

export const EMAIL = "hello@example.com"; // placeholder

export const NAP = {
  businessName: BRAND,
  city: "Berkeley",
  region: "CA",
  country: "US",
} as const;

export const FOUNDERS = [
  {
    name: "Abhi Jinka",
    role: "Co-founder · built the measurement platform",
    linkedin: "https://www.linkedin.com/in/abhinavjinka/",
    bio: "Abhi built the measurement platform: the query runner, the sampling method, and the pipeline that grades every AI answer for presence, prominence, and accuracy. He started this because every 'AI rank tracker' he tested was measuring single-run noise and calling it data.",
  },
  {
    name: "Josh Noji",
    role: "Co-founder · works directly with every client",
    linkedin: "https://www.linkedin.com/in/joshuanoji/",
    bio: "Josh works with every client, from the first free check through the audit walkthrough. He started this after watching small businesses pay for SEO reports that never mentioned the AI answers their customers were reading.",
  },
] as const;

export const PRICING = {
  audit: "[$X]", // one-time Full AI Visibility Audit
  retainer: "[$X]/mo", // Ongoing GEO (implementation + re-measurement)
} as const;

/**
 * Manual-queue backend (scaffold §6, CLAUDE.md forms invariant): submissions
 * INSERT into the Supabase `leads` table. RLS allows anon INSERT only — the
 * publishable key below is the one browser-facing credential and cannot read
 * the queue back. While the key is unset the form validates and confirms
 * without POSTing, so the funnel stays testable.
 */
export const SUPABASE_URL = "https://satjbyfjzrwocwwonsxz.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_-eUBJsJhX_-TCJXvj8TeoQ_h7PGeQc7"; // browser-safe: RLS insert-only
export const FORM_ENDPOINT = `${SUPABASE_URL}/rest/v1/leads`;

/**
 * The `source` value that marks a row as an automated liveness probe rather
 * than a prospect. ONE writer of this string: `scripts/canary-leads.mjs` and
 * `scripts/verify-leads-backend.mjs` post it, and `scripts/lead-canary.sql`
 * matches on it to suppress the alert email and to reap the row.
 *
 * It is deliberately not a plausible `?src=` campaign code. The publishable
 * key is public, so anyone can POST this value and have their row hidden from
 * the queue — but anyone who wants their submission ignored can simply not
 * submit it, so that buys an attacker nothing. What the odd shape does buy is
 * that a REAL visitor can never arrive carrying it by accident, which is the
 * failure that would actually cost us a lead.
 *
 * Changing this string means changing lead-canary.sql in the same commit, or
 * the canary starts emailing Abhi a fake lead every hour.
 */
export const LEAD_CANARY_SOURCE = "canary:leads-probe";

/**
 * THE name of the primary offer. Six competing strings used to ship at once
 * ("Free check", "free AI check", "free visibility check", "Free AI Visibility
 * Check", "Get your free check", "Run my free check"), so a reader could not
 * tell whether the header button, the bottom bar and the closing CTA were the
 * same thing. They are.
 *
 * `OFFER_SHORT` exists only because the full name physically cannot fit in the
 * header pill beside the logo and the menu button at 390px. Both forms keep
 * the distinctive words ("free AI ... check") so they read as one offer.
 * Use the long form everywhere else, including every primary button.
 */
export const OFFER = "free AI visibility check";
export const OFFER_TITLE = "Free AI Visibility Check";
export const OFFER_SHORT = "Free AI check";
export const OFFER_CTA = "Get your free AI visibility check";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/how-it-works/", label: "How it works" },
  { href: "/sample-report/", label: "Sample report" },
  { href: "/pricing/", label: "Pricing" },
  { href: "/learn/", label: "Learn" },
  { href: "/about/", label: "About" },
] as const;

export const ALL_PAGES = [
  { href: "/", label: "Home" },
  { href: "/free-check/", label: OFFER_TITLE },
  { href: "/sample-report/", label: "Sample report" },
  { href: "/how-it-works/", label: "How it works" },
  { href: "/pricing/", label: "Pricing" },
  { href: "/learn/", label: "Learn" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
  { href: "/our-score/", label: "Our score" },
  { href: "/privacy/", label: "Privacy" },
] as const;

/**
 * The no-guarantees block, reused verbatim wherever honesty is stated.
 * Split into parts so HonestyBlock can render the pull-quote pattern (bold
 * ink opener, one accent phrase) without the visible text ever differing
 * from `body` — which is the exact concatenation of the parts.
 */
const HONESTY_PARTS = {
  opener: "Nobody controls what ChatGPT says",
  mid: ". Anyone who guarantees you a #1 spot in AI answers is selling something they can't deliver. ",
  accent: "What we deliver is the work, and honest measurement of what it changed",
  rest: ": where you stand, which fixes the evidence supports, and what moved after we made them. Our reports show sampled rates, because that's the only claim we can stand behind.",
} as const;

export const HONESTY_COPY = {
  heading: "What we won't promise",
  parts: HONESTY_PARTS,
  body: `${HONESTY_PARTS.opener}${HONESTY_PARTS.mid}${HONESTY_PARTS.accent}${HONESTY_PARTS.rest}`,
} as const;
