/**
 * Single source of truth for brand, domain, NAP, founders, pricing, and links.
 * When the real brand name / domain / prices land, they change HERE and nowhere else.
 */

export const BRAND = "[Brand]"; // placeholder until the name is picked

export const DOMAIN = "https://example.com"; // placeholder until the domain is picked

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
    name: "Abhi",
    role: "Co-founder — built the measurement platform",
    linkedin: "https://www.linkedin.com/in/abhi-placeholder",
    bio: "Abhi built the measurement platform: the query runner, the sampling methodology, and the judging pipeline that grades every AI answer for presence, prominence, and accuracy. He started this because every 'AI rank tracker' he tested was measuring single-run noise and calling it data.",
  },
  {
    name: "Josh",
    role: "Co-founder — works directly with every client",
    linkedin: "https://www.linkedin.com/in/josh-placeholder",
    bio: "Josh works directly with every client, from the first free check through the audit walkthrough. He started this after watching small businesses pay for SEO reports that never once mentioned the AI answers their customers were actually reading.",
  },
] as const;

export const PRICING = {
  audit: "[$X]", // one-time Full AI Visibility Audit
  retainer: "[$X]/mo", // Ongoing Measurement
} as const;

/**
 * Where FreeCheckForm POSTs submissions (manual-queue backend, scaffold §6).
 * Empty string = not wired yet; the form validates and shows the confirmation
 * state so the funnel works end-to-end while the queue backend is chosen
 * (Formspree URL or Supabase insert endpoint).
 */
export const FORM_ENDPOINT = "";

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
  { href: "/free-check/", label: "Free AI Visibility Check" },
  { href: "/sample-report/", label: "Sample report" },
  { href: "/how-it-works/", label: "How it works" },
  { href: "/pricing/", label: "Pricing" },
  { href: "/learn/", label: "Learn" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
  { href: "/our-score/", label: "Our score" },
] as const;

/**
 * The no-guarantees block, reused verbatim wherever honesty is stated.
 * Split into parts so HonestyBlock can render the pull-quote pattern (bold
 * ink opener, one accent phrase) without the visible text ever differing
 * from `body` — which is the exact concatenation of the parts.
 */
const HONESTY_PARTS = {
  opener: "Nobody controls what ChatGPT says",
  mid: " — anyone who guarantees you a #1 spot in AI answers is selling something they can't deliver. ",
  accent: "What we deliver is measurement",
  rest: ": where you stand, how it changes over time, and which fixes have evidence behind them. Our reports show sampled rates with honest uncertainty, because that's the only claim that survives contact with how these systems actually behave.",
} as const;

export const HONESTY_COPY = {
  heading: "What we won't promise",
  parts: HONESTY_PARTS,
  body: `${HONESTY_PARTS.opener}${HONESTY_PARTS.mid}${HONESTY_PARTS.accent}${HONESTY_PARTS.rest}`,
} as const;
