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
    /* Re-pinned 2026-08-03 when the home page was rebuilt as a conversion
       page. Two of the old strings belonged to sections that no longer exist
       ("We measure your AI visibility. Properly."), so they were replaced with
       the new page's load-bearing copy rather than dropped: the proposition,
       the offer sentence, the sample-result claim, and a sourced stat. The
       count is unchanged on purpose, and so is the point of the test. */
    /* mustContain[0] is load-bearing beyond this file: geo.spec and
       security.spec both use it as the "did a crawler get real content"
       probe, so it has to be the page's headline proposition. */
    mustContain: [
      "Your customers are asking AI who to hire",
      "Sable measures where your business appears across ChatGPT",
      /* Capability one's heading. The wrapper h2 it replaced went away when
         each capability became its own full-bleed section, so this pins the
         sequence itself rather than a signpost above it. */
      "We ask what your customers ask.",
      /* The commercial options are on the home page now, so a crawler losing
         them is a real regression rather than a copy edit. */
      "Full AI Visibility Audit",
      "The shortlist got smaller",
      "of U.S. consumers used AI tools to find local businesses",
      "BrightLocal, 2026",
      /* The hero animation is CSS-only precisely so its questions and answers
         are in the raw bytes. If this ever fails, the hero has become a client
         component and a crawler is seeing an empty box. */
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
      "This is what you actually get.",
      "The prioritized fix list",
      "mention rate", // ArtifactCard header bars are lowercase mono
    ],
    schemaTypes: ["WebPage", "BreadcrumbList"],
  },
  {
    path: "/how-it-works/",
    mustContain: [
      "Measurement you can actually inspect.",
      "Ten runs, not one screenshot",
      "Five stages to the report, then the work",
      "What we won", // honesty heading; apostrophe HTML-escaped
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
