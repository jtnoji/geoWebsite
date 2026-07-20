/**
 * JSON-LD builders. Emitted from SERVER components only, so every schema block
 * lands in the raw exported HTML (Cat 5 requires it present without JS).
 *
 * Rule: builders take the SAME data structures the visible components render,
 * so schema can never drift from visible text.
 */

import { BRAND, DOMAIN, EMAIL, NAP, FOUNDERS } from "./site";

type JsonLdObject = Record<string, unknown>;

export function org(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND,
    url: DOMAIN,
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: NAP.city,
      addressRegion: NAP.region,
      addressCountry: NAP.country,
    },
    founder: FOUNDERS.map((f) => ({
      "@type": "Person",
      name: f.name,
      sameAs: f.linkedin,
    })),
  };
}

export function professionalService(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: BRAND,
    url: DOMAIN,
    email: EMAIL,
    description:
      "AI visibility measurement: we measure whether ChatGPT, Google AI, Gemini, and Perplexity mention your business, who is named instead, and which sources drive the answers.",
    address: {
      "@type": "PostalAddress",
      addressLocality: NAP.city,
      addressRegion: NAP.region,
      addressCountry: NAP.country,
    },
    areaServed: "US",
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
    name: f.name,
    jobTitle: f.role,
    sameAs: f.linkedin,
    worksFor: { "@type": "Organization", name: BRAND, url: DOMAIN },
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
    provider: { "@type": "Organization", name: BRAND, url: DOMAIN },
    ...(s.price ? { offers: { "@type": "Offer", price: s.price } } : {}),
  };
}

export function article(a: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    url: `${DOMAIN}/learn/${a.slug}/`,
    datePublished: a.datePublished,
    author: { "@type": "Organization", name: BRAND, url: DOMAIN },
    publisher: { "@type": "Organization", name: BRAND, url: DOMAIN },
  };
}
