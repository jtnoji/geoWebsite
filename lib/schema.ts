/**
 * JSON-LD builders. Emitted from SERVER components only, so every schema block
 * lands in the raw exported HTML (Cat 5 requires it present without JS).
 *
 * Rule: builders take the SAME data structures the visible components render,
 * so schema can never drift from visible text.
 *
 * THE GRAPH IS @id-LINKED (2026-07-31). Before this, `org()` and
 * `professionalService()` emitted two nodes with the same name and the same
 * url, no `@id` on either and no relation between them: an engine reading the
 * page had two candidate entities and no way to tell they are one company.
 * Every node that refers to the company now points at `ORG_ID` instead of
 * restating its name, and the founders carry stable `@id`s so the Person
 * inside `org()` and the Person on /about resolve to one entity.
 */

import { ALL_PAGES, BRAND, DOMAIN, EMAIL, NAP, FOUNDERS } from "./site";

type JsonLdObject = Record<string, unknown>;

/**
 * Stable node identities. Fragment `@id`s on the site root, which is the
 * convention every consumer already understands, and which survives the domain
 * swap because DOMAIN is the single source of truth.
 */
export const ORG_ID = `${DOMAIN}/#organization`;
export const SITE_ID = `${DOMAIN}/#website`;
export const SERVICE_ID = `${DOMAIN}/#service`;

/** A founder's node identity, derived from the name so it cannot be typo'd. */
export function personId(name: string): string {
  return `${DOMAIN}/about/#${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  addressLocality: NAP.city,
  addressRegion: NAP.region,
  addressCountry: NAP.country,
} as const;

export function org(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: BRAND,
    url: DOMAIN,
    email: EMAIL,
    // The generated brand mark from scripts/make-brand-assets.py. Re-running
    // that script when the brand name lands updates the image this points at,
    // and this URL does not change.
    logo: { "@type": "ImageObject", url: `${DOMAIN}/icon.png` },
    address: POSTAL_ADDRESS,
    founder: FOUNDERS.map((f) => ({
      "@type": "Person",
      "@id": personId(f.name),
      name: f.name,
      sameAs: f.linkedin,
    })),
    // NO `sameAs` here on purpose. It belongs on the company's own profiles,
    // and the company has none yet (website-plan.md §6 open item). The
    // founders' LinkedIn URLs are theirs, not the org's, and an invented
    // profile URL is worse than an absent one.
  };
}

/**
 * The site itself as an entity, so page nodes have something to be `isPartOf`.
 *
 * No `potentialAction: SearchAction`. There is no site search, and claiming one
 * would be exactly the sort of schema-that-describes-nothing this company flags
 * in client audits.
 */
export function website(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: BRAND,
    url: DOMAIN,
    inLanguage: "en-US",
    publisher: { "@id": ORG_ID },
  };
}

export function professionalService(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": SERVICE_ID,
    name: BRAND,
    url: DOMAIN,
    email: EMAIL,
    description:
      "AI visibility measurement: we measure whether ChatGPT, Google AI, Gemini, and Perplexity mention your business, who is named instead, and which sources drive the answers.",
    address: POSTAL_ADDRESS,
    areaServed: "US",
    // Resolves the duplicate-entity problem: this node and ORG_ID are the same
    // company, and this says so rather than leaving an engine to guess.
    parentOrganization: { "@id": ORG_ID },
    // No `telephone`, `priceRange` or `geo`: there is no business phone line
    // and prices are still [$X] (website-plan.md §6). Cat 4 stays partially
    // open until those exist. Do not fill them with plausible values.
  };
}

export type Faq = { question: string; answer: string };

export function faq(faqs: readonly Faq[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function person(f: {
  name: string;
  role: string;
  linkedin: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId(f.name),
    name: f.name,
    jobTitle: f.role,
    sameAs: f.linkedin,
    worksFor: { "@id": ORG_ID },
  };
}

export function service(s: {
  name: string;
  description: string;
  price?: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    description: s.description,
    provider: { "@id": ORG_ID },
    areaServed: "US",
    ...(s.price ? { offers: { "@type": "Offer", price: s.price } } : {}),
  };
}

/** One rung of a BreadcrumbList: the visible label and the path it points at. */
export type Crumb = { name: string; path: string };

/**
 * Trail from the site root to the current page. Always starts at Home, so
 * callers pass only the rungs below it.
 *
 * The last rung keeps its `item` URL. Omitting it on the current page is also
 * valid, but every rung having one is simpler to assert against and is what
 * the canonical URL for that page already says.
 */
export function breadcrumbs(trail: readonly Crumb[]): JsonLdObject {
  const rungs: Crumb[] = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: rungs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${DOMAIN}${c.path}`,
    })),
  };
}

/**
 * The breadcrumb rung for a known route, labelled from `ALL_PAGES`.
 *
 * Pages call this instead of typing a label, so a breadcrumb can never name a
 * page something the nav does not. Throws on an unknown path rather than
 * emitting a rung with a guessed name: this runs at build time, so a bad path
 * fails `npm run build` instead of shipping.
 */
export function crumb(path: string): Crumb {
  const page = ALL_PAGES.find((p) => p.href === path);
  if (!page) throw new Error(`crumb(): no ALL_PAGES entry for "${path}"`);
  return { name: page.label, path };
}

/** WebPage subtypes we use. Anything else should just be "WebPage". */
export type PageType = "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";

/**
 * The per-page node. `components/PageSchema.tsx` builds this from the page's
 * own `metadata` export, so the name and description here are the same strings
 * that render into `<title>` and `<meta name="description">` — there is no
 * second copy to drift.
 */
export function webPage(p: {
  name: string;
  description: string;
  path: string;
  type?: PageType;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": p.type ?? "WebPage",
    "@id": `${DOMAIN}${p.path}#webpage`,
    url: `${DOMAIN}${p.path}`,
    name: p.name,
    description: p.description,
    inLanguage: "en-US",
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
  };
}

export function article(a: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  author: string;
}): JsonLdObject {
  const url = `${DOMAIN}/learn/${a.slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    url,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    datePublished: a.datePublished,
    // lib/articles.ts documents `date` as "treated as last updated", so the two
    // are the same value by definition. Emitting a different dateModified would
    // be inventing an edit history.
    dateModified: a.datePublished,
    inLanguage: "en-US",
    // The named founder from the markdown frontmatter, NOT the Organization.
    // Until 2026-07-31 this credited the company while the frontmatter carried
    // a person, and the page showed no byline at all — so the fix was as much
    // about rendering the byline as about the schema. `@id` ties the byline to
    // the same Person node /about and org() use.
    author: { "@type": "Person", "@id": personId(a.author), name: a.author },
    publisher: { "@id": ORG_ID },
  };
}
