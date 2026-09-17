/**
 * Shared page fixture for the QA suite: every route, a copy string that must
 * exist in the RAW HTML (the JS-disabled check), and the JSON-LD @types
 * expected per the scaffold §3 table. Organization + WebSite +
 * ProfessionalService come from the root layout on every page; the WebPage (or
 * its subtype) and the BreadcrumbList come from components/PageSchema.tsx.
 */

export type PageSpec = {
  path: string;
  mustContain: string[];
  schemaTypes: string[]; // beyond SITE_WIDE_SCHEMA
};

export const SITE_WIDE_SCHEMA = ["Organization", "WebSite", "ProfessionalService"];

export const PAGES: PageSpec[] = [
  {
    path: "/",
    /* Re-pinned 2026-09-14 for the Sable redesign. The pricing tiers and the
       stage console left the home page, so their two strings were replaced
       with the new page's load-bearing copy rather than dropped: the lede, the
       first capability, and the comparison. The count is unchanged on purpose,
       and so is the point of the test. */
    /* mustContain[0] is load-bearing beyond this file: geo.spec and
       security.spec both use it as the "did a crawler get real content"
       probe, so it has to be the page's headline proposition. */
    mustContain: [
      "Your customers are asking AI who to hire",
      "We optimize your website, content, and brand presence",
      /* Capability one's heading: pins the capability sequence itself. */
      "See where you appear across AI search",
      "Built for AI search, not retrofitted to it",
      "The shortlist got smaller",
      "of U.S. consumers used AI tools to find local businesses",
      "BrightLocal, 2026",
      /* The hero's live customer questions are CSS-only precisely so every
         question and answer is in the raw bytes. If this ever fails, the panel
         has become a client component and a crawler is seeing an empty box. */
      "what is the best restaurant in my area?",
    ],
    // No BreadcrumbList: home is the root of every trail, so a one-rung
    // breadcrumb would say nothing.
    schemaTypes: ["WebPage"],
  },
  {
    path: "/free-check/",
    mustContain: [
      "What does AI say when customers ask about businesses like yours?",
      "Run my free AI visibility check",
      "you", // sanity
    ],
    schemaTypes: ["WebPage", "BreadcrumbList"],
  },
  {
    path: "/sample-report/",
    mustContain: [
      "The whole report", // the Sable head (2026-09-14)
      "The prioritized fix list",
      "mention rate", // ArtifactCard header bars are lowercase mono
      /* Deep in the walkthrough: proves the whole report ships as text, not
         as a picture of a report (2026-09-16). */
      "Statements that contradict the fact sheet",
      "what the engines actually said",
    ],
    schemaTypes: ["WebPage", "BreadcrumbList"],
  },
  {
    path: "/how-it-works/",
    mustContain: [
      "One system, running on", // the Sable hero (2026-09-14)
      "Five runs, not one screenshot",
      /* A stage that is not the default tab: it is hidden until chosen, so
         this proves every stage's copy ships in the raw HTML, not just the
         one on show. */
      "We find what keeps you out.",
      "What we won", // honesty heading; apostrophe HTML-escaped
      /* The Track stage's card, hidden until chosen: proves every stage's
         card ships in the raw HTML, not only the one on show. */
      "Same 25 answers, re-run",
    ],
    schemaTypes: ["WebPage", "BreadcrumbList", "FAQPage"],
  },
  {
    path: "/pricing/",
    mustContain: [
      "Free AI Visibility Check",
      "Full AI Visibility Audit",
      "Ongoing GEO",
      "Do you do the fixes too?",
    ],
    schemaTypes: ["WebPage", "BreadcrumbList", "Service", "Service", "FAQPage"],
  },
  {
    /* Added 2026-08-03 with the page itself. Every route on the site carries
       the same geo/security coverage, and a new page that skips it is a page
       nobody notices going dark to crawlers. */
    path: "/faq/",
    mustContain: [
      "The questions we get, answered directly.",
      "Can you guarantee ChatGPT will recommend me?",
      "No, and neither can anyone else.",
    ],
    schemaTypes: ["WebPage", "BreadcrumbList", "FAQPage"],
  },
  {
    path: "/learn/",
    mustContain: ["Learn", "What is GEO"],
    schemaTypes: ["CollectionPage", "BreadcrumbList"],
  },
  {
    path: "/learn/what-is-geo/",
    mustContain: ["GEO", "Generative Engine Optimization", "Josh Noji"],
    schemaTypes: ["WebPage", "BreadcrumbList", "Article"],
  },
  {
    path: "/learn/why-doesnt-chatgpt-mention-my-business/",
    mustContain: ["three measurable reasons", "Josh Noji"],
    schemaTypes: ["WebPage", "BreadcrumbList", "Article"],
  },
  {
    path: "/learn/which-sources-do-ai-engines-cite/",
    mustContain: ["consistent set of sources", "Abhi Jinka"],
    schemaTypes: ["WebPage", "BreadcrumbList", "Article"],
  },
  {
    path: "/learn/is-your-website-invisible-to-ai-crawlers/",
    mustContain: ["challenge pages", "Abhi Jinka"],
    schemaTypes: ["WebPage", "BreadcrumbList", "Article"],
  },
  {
    path: "/learn/ai-search-vs-traditional-seo/",
    mustContain: ["the answer replaced the list", "Josh Noji"],
    schemaTypes: ["WebPage", "BreadcrumbList", "Article"],
  },
  {
    path: "/about/",
    mustContain: ["Two founders", "Abhi", "Josh"],
    schemaTypes: ["AboutPage", "BreadcrumbList", "Person", "Person"],
  },
  {
    path: "/contact/",
    mustContain: ["Contact", "20-minute call"],
    schemaTypes: ["ContactPage", "BreadcrumbList"],
  },
  {
    path: "/our-score/",
    mustContain: [
      "We ran our own audit on this website",
      "Cat 1: Bot access",
      "Cat 6: Hygiene",
    ],
    schemaTypes: ["WebPage", "BreadcrumbList"],
  },
  {
    path: "/privacy/",
    mustContain: [
      "What does the free check collect?",
      "Does this site use cookies or trackers?",
      "How do I get my data deleted?",
    ],
    // No FAQPage here on purpose: these are a legal notice, not the site's FAQs.
    schemaTypes: ["WebPage", "BreadcrumbList"],
  },
];

/**
 * User agents the bot-access checks fetch as.
 *
 * Deliberately includes the LIVE-ANSWER fetchers, not just the training
 * crawlers: OAI-SearchBot and ChatGPT-User are what decide whether a page can
 * appear in a ChatGPT answer, and Googlebot is what AI Overviews read. A suite
 * that only tested GPTBot and Google-Extended was testing the bots that matter
 * least to the product.
 */
export const AI_USER_AGENTS = [
  "GPTBot/1.0 (+https://openai.com/gptbot)",
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot",
  "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
  "ClaudeBot/1.0 (+claudebot@anthropic.com)",
  "PerplexityBot/1.0 (+https://perplexity.ai/perplexitybot)",
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  "Mozilla/5.0 (compatible; Google-Extended)",
] as const;
