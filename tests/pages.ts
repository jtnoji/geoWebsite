/**
 * Shared page fixture for the QA suite: every route, a copy string that must
 * exist in the RAW HTML (the JS-disabled check), and the JSON-LD @types
 * expected per the scaffold §3 table. Organization + ProfessionalService come
 * from the root layout on every page.
 */

export type PageSpec = {
  path: string;
  mustContain: string[];
  schemaTypes: string[]; // beyond the site-wide Organization + ProfessionalService
};

export const SITE_WIDE_SCHEMA = ["Organization", "ProfessionalService"];

export const PAGES: PageSpec[] = [
  {
    path: "/",
    mustContain: [
      "When someone asks AI for a recommendation, does it say your name?",
      "The shortlist got smaller",
      "We measure it. Properly.",
      "What we won", // "What we won't promise" — apostrophe rendered as &rsquo;
      "of U.S. consumers used AI tools to find local businesses",
      "BrightLocal, 2026",
    ],
    schemaTypes: [],
  },
  {
    path: "/free-check/",
    mustContain: [
      "What does AI say when customers ask about businesses like yours?",
      "Run my free check",
      "you", // sanity
    ],
    schemaTypes: [],
  },
  {
    path: "/sample-report/",
    mustContain: [
      "This is what you actually get.",
      "The prioritized fix list",
      "mention rate", // ArtifactCard header bars are lowercase mono
    ],
    schemaTypes: [],
  },
  {
    path: "/how-it-works/",
    mustContain: [
      "Measurement you can actually inspect.",
      "Why do you run every question ten times?",
      "How do you judge the answers?",
      "Can you guarantee results?",
      "Every audit, same five stages",
    ],
    schemaTypes: ["FAQPage"],
  },
  {
    path: "/pricing/",
    mustContain: [
      "Free Visibility Check",
      "Full AI Visibility Audit",
      "Ongoing Measurement",
      "Do you do the fixes too?",
    ],
    schemaTypes: ["Service", "Service", "FAQPage"],
  },
  {
    path: "/learn/",
    mustContain: ["Learn", "What is GEO"],
    schemaTypes: [],
  },
  {
    path: "/learn/what-is-geo/",
    mustContain: ["GEO", "Generative Engine Optimization"],
    schemaTypes: ["Article"],
  },
  {
    path: "/learn/why-doesnt-chatgpt-mention-my-business/",
    mustContain: ["three measurable reasons"],
    schemaTypes: ["Article"],
  },
  {
    path: "/learn/which-sources-do-ai-engines-cite/",
    mustContain: ["consistent set of sources"],
    schemaTypes: ["Article"],
  },
  {
    path: "/learn/is-your-website-invisible-to-ai-crawlers/",
    mustContain: ["challenge pages"],
    schemaTypes: ["Article"],
  },
  {
    path: "/learn/ai-search-vs-traditional-seo/",
    mustContain: ["the answer replaced the list"],
    schemaTypes: ["Article"],
  },
  {
    path: "/about/",
    mustContain: ["Two founders", "Abhi", "Josh"],
    schemaTypes: ["Person", "Person"],
  },
  {
    path: "/contact/",
    mustContain: ["Contact", "20-minute call"],
    schemaTypes: [],
  },
  {
    path: "/our-score/",
    mustContain: [
      "We ran our own audit on this website",
      "Cat 1 · Bot access",
      "Cat 6 · Hygiene",
    ],
    schemaTypes: [],
  },
];

export const AI_USER_AGENTS = [
  "GPTBot/1.0 (+https://openai.com/gptbot)",
  "ClaudeBot/1.0 (+claudebot@anthropic.com)",
  "PerplexityBot/1.0 (+https://perplexity.ai/perplexitybot)",
  "Mozilla/5.0 (compatible; Google-Extended)",
] as const;
