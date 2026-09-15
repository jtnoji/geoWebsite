/**
 * Home-page copy for the Sable redesign (2026-09-14), taken from the Claude
 * Design file `mockup/sable-site.dc.html`.
 *
 * Copy lives here rather than in JSX so it stays greppable against the copy
 * rules in CLAUDE.md (no em dashes, no guarantees, sourced numbers). Lines
 * softened from the design with Josh, and design lines held back because rules
 * forbid them, are listed in website-plan.md §6 and noted beside their lines
 * below.
 *
 * HOME_FAQS at the bottom is no longer home copy: it renders /faq and feeds
 * that page's FAQPage JSON-LD from the same array.
 */

import type { Capability } from "@/components/CapabilityRow";
import type { FindingRow } from "@/components/FindingsPanel";
import type { Faq } from "@/lib/schema";
import { SAMPLE_ROWS } from "@/lib/sample";
import { BRAND } from "@/lib/site";

/** The fold. The h1 is carried over unchanged from the previous home page. */
export const HERO = {
  heading: "Your customers are asking AI who to hire.",
  headingAccent: "Are you in the answer?",
  /* The design's lede, as drawn. It says what we do rather than what we
     measure, which has been the business since the Ongoing GEO decision
     (website-plan §6, 2026-07-25). "Appears more often" states the aim of the
     work, not a promised rate; it is flagged for Josh in website-plan §6. */
  lede: "We optimize your website, content, and brand presence so your company appears more often in ChatGPT, Google AI Overviews, and other AI search results.",
  secondary: "See how it works",
  /* The design said "results in 60 seconds". The queue is manual and the
     promise everywhere else on the site is 1–2 business days. */
  fineprint: "Free · no card · four engines · report in 1–2 business days",
  /* The design's "Trusted by" strip of placeholder client logos is not here.
     website-plan §2 rules out borrowed logos and unnamed "trusted by" copy
     until a real client result is cleared. This line is the credential we do
     have: nobody else in the category publishes an audit of themselves. */
  proof: "We ran this audit on our own site",
  sample: "View a sample report",
} as const;

/**
 * The live customer questions panel beside the fold (LiveAnswer). Restored
 * 2026-09-14 at Josh's request from the previous home page, in place of the
 * design's static before/after card: a query box types each question out, the
 * engine answers, and the answer names three businesses with the reader's
 * slot left empty.
 *
 * The questions are deliberately generic consumer categories rather than our
 * own: the point is the moment a customer asks, and a reader recognises that
 * moment faster in a hair salon than in a B2B agency. They are illustrative
 * examples, not sampled data. Nothing here is a measurement, which is why the
 * panel carries no rates.
 *
 * EACH ENTRY IS A WHOLE QUESTION, and the openings vary (Josh, 2026-08-03). A
 * fixed "what is the best" with only the category swapping was one shape of
 * question, and people do not ask in one shape.
 *
 * THE QUESTION COUNT IS LOAD-BEARING. One shared CSS keyframe set drives all
 * six and each is delayed into its own slot, so the stops in globals.css cut
 * the loop into sixths. LiveAnswer.tsx throws at build time if the two fall
 * out of step.
 */
export const PROMPT_DEMO = {
  label: "Live customer questions",
  /** ORDER IS THE CYCLE, and it alternates openings on purpose. Lowercase,
      because that is how people type into these things.

      THE NAMES ARE PLACEHOLDERS, DELIBERATELY. lib/sample.ts forbids putting
      words in a real company's mouth, and its invented names are verified
      against real businesses before shipping. Six consumer categories would
      need eighteen more of those, unverified, so the answers use the braced
      placeholder convention instead. */
  questions: [
    {
      q: "what is the best restaurant in my area?",
      engine: "ChatGPT",
      lead: "A few that come up often in {your city}:",
    },
    {
      q: "where should I get my hair done?",
      engine: "Google AI",
      lead: "Based on reviews and recent write-ups, the ones most often recommended:",
    },
    {
      q: "what is the best skincare for dry skin?",
      engine: "Perplexity",
      lead: "Most comparison guides point to the same three:",
    },
    {
      q: "which shoe brand is most comfortable?",
      engine: "Gemini",
      lead: "Named most consistently across the reviews I can see:",
    },
    {
      q: "what is the best gym for beginners?",
      engine: "ChatGPT",
      lead: "For someone starting out, I would look at:",
    },
    {
      q: "who does good plumbing near me?",
      engine: "Google AI",
      lead: "In {your city}, these come up the most:",
    },
  ],
  /** Every answer names three. The count is the argument: a shortlist has
      room for a handful, and the fourth slot is the reader's, drawn empty. */
  named: ["Competitor A", "Competitor B", "Competitor C"],
} as const;

export const PROBLEM = {
  eyebrow: "The problem",
  heading: "Your customers are searching differently",
  body: "People aren't just Googling anymore. They ask ChatGPT, Gemini and Perplexity which companies to trust, and the answer names three or four. Most brands have no idea whether they are one of them.",
  points: [
    {
      title: "You can't see it happening",
      body: "Rankings and traffic reports say nothing about whether a model named you in the paragraph a buyer read.",
    },
    {
      title: "The shortlist is shorter",
      body: "Ten blue links became three or four names. Being on page one no longer means being in the answer.",
    },
    {
      title: "Your competitors are already cited",
      body: "Whoever the model trusts today keeps getting recommended, and that advantage compounds every crawl.",
    },
  ],
} as const;

/**
 * The shift chart's own labels. The chart's numbers live in lib/stats.ts.
 *
 * The claim is deliberately narrower than "search is dying": one line is
 * buying that an AI agent influenced, the other is searches that still end in
 * a click. Nothing here says search VOLUME is falling, because it is not, and
 * that narrowness is binding on any copy that ever sits beside this chart.
 */
export const SEARCH_SHIFT_COPY = {
  eyebrow: "The shift, in two lines",
  projectionNote:
    "Solid is measured. Dashed is projection: 2027 is Forrester's own, 2028 is ours, and neither is a forecast we stand behind.",
} as const;

export const SOLUTION = {
  eyebrow: "The solution",
  /* The design said "Get your brand recommended by AI". The work gives an
     engine reasons to name you; whether it does is not ours to promise
     (softened with Josh, 2026-09-14). */
  heading: "Give AI a reason to",
  headingAccent: "name you",
  body: "Three things decide whether a model names you: what it can measure about you, what it can verify, and what it can cite. We work all three.",
} as const;

/** The measure panel is the canonical sample dataset, not a second copy of it. */
const VISIBILITY_ROWS: readonly FindingRow[] = SAMPLE_ROWS.map((row) => ({
  label: row.engine,
  bar: row.you / row.runs,
  value: `${row.you}/${row.runs}`,
  tone: row.you === 0 ? "risk" : "note",
}));

export const CAPABILITIES: readonly Capability[] = [
  {
    no: "01",
    name: "Measure",
    /* The design said "See exactly where you appear". "Exactly" is one of
       the filler intensifiers the voice rule cuts. */
    heading: "See where you appear across AI search",
    body: "Real buying questions for your category, run ten times each across four engines, scored the same way every month.",
    points: [
      "Mention rate per engine",
      "Share of voice against the names beating you",
      "The sources each answer was built from",
    ],
    panel: {
      title: "Visibility by engine",
      meta: "40 answers · illustrative example",
      rows: VISIBILITY_ROWS,
    },
  },
  {
    no: "02",
    name: "Optimize",
    heading: "Fix what keeps models from citing you",
    body: "Crawler access, structured data, entity clarity and the category pages models reach for when they answer.",
    points: [
      "Crawler and structured data audit",
      "Comparison and alternatives pages",
      "Entity and accuracy corrections",
    ],
    panel: {
      title: "Audit findings",
      meta: "12 open · illustrative example",
      rows: [
        {
          label: "GPTBot blocked in robots.txt",
          sub: "Site-wide · affects every answer",
          value: "Blocking",
          tone: "risk",
        },
        {
          label: "No comparison or alternatives page",
          sub: "Models cite competitors' instead",
          value: "High",
          tone: "caution",
        },
        {
          label: "Product schema missing on 38 pages",
          sub: "Blocks entity resolution",
          value: "High",
          tone: "caution",
        },
        {
          label: "Service area pages thin",
          sub: "Under 200 words each",
          value: "Medium",
          tone: "note",
        },
      ],
    },
  },
  {
    no: "03",
    name: "Grow",
    heading: "Earn the third-party sources that decide answers",
    /* Shipped as designed; "we get you into" is flagged for Josh in
       website-plan §6 as the other line nearest the no-guarantees rule. */
    body: "Models lean on a small set of trusted sites per category. We get you into the ones that matter and keep them current.",
    points: [
      "Source placement and digital PR",
      "Answer-shaped content production",
      "Monthly re-measurement on the same query set",
    ],
    panel: {
      title: "Sources behind your category",
      meta: "cited in 40 answers · illustrative example",
      rows: [
        {
          label: "industrypub.com",
          sub: "Cited in 22 answers",
          value: "You: absent",
          tone: "risk",
        },
        {
          label: "reviewsite.com",
          sub: "Cited in 17 answers",
          value: "You: listed",
          tone: "ok",
        },
        {
          label: "citylist.com",
          sub: "Cited in 11 answers",
          value: "You: outdated",
          tone: "caution",
        },
        {
          label: "yourdomain.com",
          sub: "Cited in 6 answers",
          value: "Owned",
          tone: "note",
        },
      ],
    },
  },
];

export const STEPS = {
  eyebrow: "How it works",
  /* The design said "From invisible to recommended in three steps". The steps
     are a routine we run, not a route to a result (softened with Josh,
     2026-09-14). */
  heading: "Three steps, repeated every month",
  steps: [
    {
      no: "01",
      name: "Audit",
      body: "We measure where your brand appears today across ChatGPT, Gemini, Perplexity and Google AI Overviews, and trace every answer back to its sources.",
    },
    {
      no: "02",
      name: "Execute",
      body: "We optimize your site, your content and your off-site authority, in the order that moves answer share fastest.",
    },
    {
      no: "03",
      name: "Measure",
      /* "Exactly" cut, per the voice rule. */
      body: "We re-run the identical query set each month, so you see what each change did rather than a vanity chart.",
    },
  ],
} as const;

export const SERVICES = {
  eyebrow: "What you get",
  heading: "Everything we handle",
  body: "One team for the measurement and the work. You don't need a second agency for the on-site fixes.",
  items: [
    "AI visibility tracking",
    "Technical SEO",
    "Structured data and schema",
    "Entity and brand disambiguation",
    "Content strategy",
    "Answer-shaped content production",
    "Source placement and digital PR",
    "Accuracy monitoring",
    "Competitor answer tracking",
    "Monthly reporting",
  ],
} as const;

export type ComparisonRow = {
  label: string;
  /** `true` renders a tick, `false` a cross, a string renders as written. */
  us: boolean | string;
  agency: boolean | string;
};

export const COMPARISON: {
  eyebrow: string;
  heading: string;
  rival: string;
  rows: readonly ComparisonRow[];
} = {
  eyebrow: `Why ${BRAND}`,
  heading: "Built for AI search, not retrofitted to it",
  rival: "Traditional SEO agency",
  rows: [
    { label: "Google SEO", us: true, agency: true },
    { label: "AI answer tracking", us: true, agency: "Sometimes" },
    { label: "Per-engine mention rate", us: true, agency: false },
    { label: "Sampled runs, not screenshots", us: true, agency: false },
    { label: "Source placement", us: true, agency: "Add-on" },
    { label: "Implementation on your site", us: true, agency: "Add-on" },
    { label: "Same query set re-run monthly", us: true, agency: false },
  ],
};

export const CLOSING = {
  heading: "See where your brand stands in",
  headingAccent: "AI search",
  body: "We'll analyze how your company appears across ChatGPT, Gemini, Perplexity and Google AI Overviews, and show you the biggest opportunities.",
  fineprint: "Free · no card · no commitment",
} as const;

/**
 * The FAQ. Renders the visible questions AND the FAQPage JSON-LD on /faq
 * through FaqSection, so the two can never drift (the Cat 5 check).
 *
 * Two questions overlap /pricing's FAQ by design: they are the two things
 * people ask on both pages. The answers are kept consistent between them.
 */
export const HOME_FAQS: Faq[] = [
  {
    question: "Can you guarantee ChatGPT will recommend me?",
    answer:
      "No, and neither can anyone else. Nobody controls what these systems say. We measure where you stand, identify the gaps that have evidence behind them, and re-measure so you can see whether the work changed anything.",
  },
  {
    question: "How is this different from an SEO audit?",
    answer:
      "An SEO audit tells you about rankings on a results page. This measures whether you are named inside a generated answer. That draws on a different set of sources, uses different crawlers, and can go wrong while your rankings stay excellent.",
  },
  {
    question: "Why run the same question ten times?",
    answer:
      "Because these systems are non-deterministic. Ask the same question twice and you can get two different shortlists. One run is a coin flip. A rate across ten runs is a measurement you can compare against next month.",
  },
  {
    question: "How long until anything changes?",
    answer:
      "Crawler and accuracy fixes can show up in a re-measure within a few weeks, because they remove a hard blocker. Presence gaps that depend on off-site sources take longer, typically six to sixteen weeks, and sometimes not at all.",
  },
  {
    question: "Is the free check a real report or a teaser?",
    answer:
      "It is a real, shortened report: verbatim answers, mention rates per engine, the competitors named instead of you, the sources cited, and the crawler-access findings. It is smaller in question count, not redacted.",
  },
  {
    question: "What do you need from me to start?",
    answer:
      "Your business name, website, service area, and a plain description of what you do. That is enough to build a first question set. If you have a fact sheet or price list, accuracy scoring gets sharper.",
  },
];
