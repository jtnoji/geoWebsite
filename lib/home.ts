/**
 * Home-page long-form content, added 2026-07-30 from the Claude Design update
 * to `Geo Website - Weir Style.dc.html` (project b92d21f9). The design turned
 * the home page from a five-section summary into a full explainer: the four
 * engines, the sources an answer is assembled from, the four technical
 * foundations, a before/after answer pair, who asks for this, the engagement
 * loop, and a six-question FAQ.
 *
 * Copy lives here rather than in JSX so it stays greppable against the copy
 * rules in CLAUDE.md (no em dashes, no guarantees, sourced numbers) and so the
 * FAQ list can feed both the visible H2s and the FAQPage JSON-LD.
 *
 * Two sections of the design are deliberately NOT here: "Measured change"
 * (three case-result cards) and "What clients say" (three testimonials). Both
 * are invented client evidence, which the sample-data honesty rule forbids.
 * They ship when a real cleared result and real quotes exist.
 */

import type { Faq } from "@/lib/schema";

export type EngineCard = {
  kicker: string;
  name: string;
  mode: string;
  body: string;
  signals: readonly string[];
};

/** The four surfaces we measure. Order matches lib/sample.ts SAMPLE_ROWS. */
export const ENGINES: readonly EngineCard[] = [
  {
    kicker: "Engine 01",
    name: "ChatGPT",
    mode: "Answer engine · conversational",
    body: "The largest single surface. ChatGPT answers from what the model absorbed in training and from what it retrieves when it decides to browse. That split matters. A business can be known well enough to appear without a search, or invisible in training but rescued by a live fetch. We run category questions with and without browsing, so you learn whether you are known or merely findable.",
    signals: ["Named in answer", "Source citation", "Follow-up depth"],
  },
  {
    kicker: "Engine 02",
    name: "Google AI Overviews",
    mode: "Sits above the organic results",
    body: "The AI paragraph Google prints above the blue links on a large share of commercial and informational queries. It draws on Google's own index, Business Profiles, and structured data, and it usually cites three to five pages. The business named there gets visibility that no position-one result underneath it receives. The page it cites is often one the owner never optimized for.",
    signals: ["AI Overview citation", "Rich result", "Local pack"],
  },
  {
    kicker: "Engine 03",
    name: "Perplexity",
    mode: "Real time and citation first",
    body: "Perplexity shows its sources on nearly every answer, which makes it the easiest engine to measure. It crawls continuously, weights recency heavily, and rewards citation diversity. A brand named across several independent sources outranks one named repeatedly on its own domain. It also uses a separate crawler, so a site can be visible to Google and absent here.",
    signals: ["Inline citation", "Recency weighting", "Source diversity"],
  },
  {
    kicker: "Engine 04",
    name: "Gemini",
    mode: "Knowledge graph and entity data",
    body: "Gemini leans on Google's knowledge graph, Search index, and structured entity data. Consistency decides the outcome. When your name, category, location, and service list agree across your site, your Business Profile, and your category's directories, Gemini treats you as an established entity. When they disagree it hedges, and hedging usually means omission.",
    signals: ["Entity graph", "Business Profile", "Structured data"],
  },
];

export type SourceCard = {
  /* Tailwind background class for the 11px legend dot. */
  swatch: string;
  /* Same hue at 12%, for the square the dot sits in. */
  swatchBox: string;
  name: string;
  body: string;
  note: string;
};

/**
 * Where an answer comes from. The swatches are legend marks, not accents —
 * see the --color-source-* note in globals.css.
 */
export const SOURCES: readonly SourceCard[] = [
  {
    swatch: "bg-ink",
    swatchBox: "bg-ink/12",
    name: "Review platforms",
    body: "Your Business Profile, the major review sites, and your industry's own review platforms are the most cited sources in local and service-category answers. Engines read the rating, the review volume, and the recency. Increasingly they read the review text itself, which is where the phrases that end up quoted in an answer come from.",
    note: "Why it matters: engines quote review text, not just the star rating.",
  },
  {
    swatch: "bg-accent",
    swatchBox: "bg-accent/12",
    name: "Directories and best-of lists",
    body: "When a customer asks for the best option in a category, engines lean on the ranked lists and comparison articles that already rank in Google for that phrase. If you are not on those lists, you cannot appear in the answer that summarizes them. If you are, the answer usually repeats the reason the list gave for including you.",
    note: "Why it matters: a best-of answer is a summary of these lists.",
  },
  {
    swatch: "bg-source-blue",
    swatchBox: "bg-source-blue/12",
    name: "Community threads",
    body: "Forum and community discussion reads as peer opinion, so it surfaces at high rates. We find where your category's buying conversations happen and whether your business appears in them at all. We also check whether what is said there is correct.",
    note: "Why it matters: engines read these as opinion, not advertising.",
  },
  {
    swatch: "bg-source-bronze",
    swatchBox: "bg-source-bronze/12",
    name: "Press and local media",
    body: "Earned editorial coverage carries weight beyond its link value. These publications sit in training data and get browsed often. The effect is that the engine meets your name next to expert context instead of next to your own marketing copy.",
    note: "Why it matters: training data weights established publications heavily.",
  },
];

export type Foundation = {
  kicker: string;
  title: string;
  /**
   * Body split around inline code spans. Even indexes are prose, odd indexes
   * render as `<code>` — cheaper than parsing markdown at build time and it
   * keeps the whole string greppable for the em-dash check.
   */
  parts: readonly string[];
};

/** The four technical foundations. #1 is ink-numbered: it is the usual cause. */
export const FOUNDATIONS: readonly Foundation[] = [
  {
    kicker: "Crawler access",
    title: "Can the AI crawlers reach you at all",
    parts: [
      "This is the first thing we check and the most common single point of failure. AI crawlers are separate from Googlebot: ",
      "GPTBot",
      ", ",
      "PerplexityBot",
      ", ",
      "ClaudeBot",
      " and Google's extended crawler each need their own permission. Many firewalls, CDNs, and bot-protection defaults block them silently while your Google rankings stay healthy. We check your ",
      "robots.txt",
      " directives and edge rules, fetch live as each agent, and name the ones that are refused.",
    ],
  },
  {
    kicker: "Rendering",
    title: "Whether the content survives without JavaScript",
    parts: [
      "Some crawlers run JavaScript, some do not, and some do it inconsistently. If your prices, services, hours, or descriptions are injected client side, an engine can see a page with no facts on it. We fetch your key pages the way each crawler does and compare what arrives against what a visitor sees.",
    ],
  },
  {
    kicker: "Structured data",
    title: "Facts stated in a form machines cannot misread",
    parts: [
      "Schema markup does not rank you. It removes ambiguity. ",
      "LocalBusiness",
      " or ",
      "Organization",
      " with ",
      "sameAs",
      " links, ",
      "FAQPage",
      " on pages that answer real questions, and accurate service and area coverage tell an engine what you are, what you are authoritative about, and which blocks of text are safe to quote. We audit what is present, what is malformed, and what is missing.",
    ],
  },
  {
    kicker: "Entity consistency",
    title: "The same business, described the same way, everywhere",
    parts: [
      "Engines assemble a picture of your business from many sources at once. When your name, address, categories, and service list agree across your site, your Business Profile, your category's directories, and your social profiles, you read as one established entity. When they disagree, the engine hedges, and hedging suppresses citation.",
    ],
  },
];

export type Situation = {
  title: string;
  body: string;
  answer: string;
};

/**
 * The prompt-bar demo (home, directly under the fold). A mock AI input that
 * types each question out, erases it, and types the next.
 *
 * The questions are deliberately generic consumer categories rather than our
 * own: the point of the section is the moment a customer asks, and a reader
 * recognises that moment faster in a hair salon than in a B2B agency. They are
 * illustrative examples, not sampled data, so the sample-data honesty rule
 * does not apply. Nothing here is a measurement.
 *
 * EACH ENTRY IS A WHOLE QUESTION, and the openings vary (Josh, 2026-08-03).
 * A fixed "what is the best" with only the category swapping was one shape of
 * question, and people do not ask in one shape. The alternating order is
 * taste, not a constraint: each question is erased to an empty bar before the
 * next is typed, so neighbours sharing an opening would look fine. It read as
 * more varied this way and there is no reason to give that up.
 *
 * THE QUESTION COUNT IS LOAD-BEARING. One shared CSS keyframe set drives all
 * six and each is delayed into its own slot, so the stops in globals.css cut
 * the loop into sixths. Adding or removing one means recutting those
 * percentages; PromptBar.tsx throws at build time if the two fall out of step.
 */
export const PROMPT_DEMO = {
  eyebrow: "The question",
  heading: "This is where your customer starts.",
  body: "They ask once and take the answer. The businesses it names get the shortlist, and the rest never come up.",
  /** ORDER IS THE CYCLE, and it alternates openings on purpose. Lowercase,
      because that is how people type into these things. */
  questions: [
    "what is the best restaurant in my area?",
    "where should I get my hair done?",
    "what is the best skincare for dry skin?",
    /* "the most comfortable" was 25px wider than any other question at 360px
       and set the slot width for all six on its own. People drop the article
       when they type anyway. */
    "which shoe brand is most comfortable?",
    "what is the best gym for beginners?",
    "who does good plumbing near me?",
  ],
  caption:
    "Your customers ask questions like these every day. We measure what the answer says.",
} as const;

/**
 * The product surface under the fold: one answer, then what forty of them add
 * up to. Copy is NEW (2026-08-03) and needs Josh's sign-off before launch per
 * the copy rule in CLAUDE.md; it is written to the existing voice (two clauses
 * max, no em dashes, no guarantees, rates never ranks).
 */
export const SHOWCASE_COPY = {
  eyebrow: "What the report shows",
  heading: "One answer is an anecdote. Forty is a position.",
  body: "The card is a single run. The table beside it is the same question asked forty times, which is the number your competitors are being judged on.",
} as const;

/** Who asks for this. Three entry points, each with what we do about it. */
export const SITUATIONS: readonly Situation[] = [
  {
    title: "You rank on Google. You are absent from AI answers.",
    body: "Your SEO works. You hold page one for the phrases that matter. Then a customer mentions they asked ChatGPT for a recommendation in your category and your name never came up. You are winning the old game while the new one runs without you, with no way to see how far behind you are.",
    answer:
      "We start with a baseline, so you know the rate per engine before you spend anything on fixing it.",
  },
  {
    title: "Your competitors are being recommended. You are not.",
    body: "You have already noticed. A prospect found a competitor through Perplexity. Another said an AI named three companies in your category and you were not among them. What you do not know is why them, which sources produced it, or what it costs you in leads that would have been free.",
    answer:
      "We identify who is named instead of you, and which sources put them there.",
  },
  {
    title: "You are building something new and want the baseline.",
    body: "No legacy problem to unwind. You are establishing a brand now, and businesses that appear in AI answers early compound that position for years. You want the measurement in place from the start, not reconstructed in eighteen months.",
    answer:
      "We set the baseline and the question set now, so every later number has something to compare against.",
  },
];

/**
 * The search-shift chart section (second screen). The claim is deliberately
 * narrower than "search is dying": one line is people adopting AI answers, the
 * other is clicks leaving Google, and the section says only what the two
 * measured series support. The numbers themselves live in lib/stats.ts.
 *
 * The tone sharpened 2026-08-03 (Josh) to say plainly that agentic search is
 * the present tense, not a coming channel. The narrowness did not move with
 * it: nothing here says search volume is falling, because it is not, and
 * "the click that used to reach you" is the one thing the second series
 * measures.
 */
export const SEARCH_SHIFT_COPY = {
  eyebrow: "The shift, in two lines",
  heading: "Agentic search is not coming. It is already here.",
  body: [
    "One line is your customers moving to AI answers. The other is the click that used to reach you, and both bend faster every year.",
    "This is where your category gets decided now. Every answer that leaves your name out is a customer you never hear from.",
  ],
  projectionNote:
    "Solid is measured. Dashed is projection: 2027 is Forrester's own, 2028 is ours, and neither is a forecast we stand behind.",
} as const;

/**
 * "What the shift is worth" (home, after the shortlist section). Renders
 * through RevenueAtStake with the three McKinsey figures in lib/stats.ts.
 *
 * The section exists to answer a question people ask in sales calls: what is
 * absence costing me. It sizes the channel and then refuses the second half of
 * the question, because a per-business loss figure cannot be computed from
 * outside the business and cannot be computed honestly from inside it either.
 * That refusal is the section, not a hedge attached to it. If a later edit
 * turns this into "you are losing $X a month", it has become the thing the
 * honesty block on this same page says nobody should sell.
 */
export const REVENUE_COPY = {
  eyebrow: "What the shift is worth",
  heading: "The money moves. The invoice never arrives.",
  lede: "Buying decisions are being made inside answers now, and the spending is following them there. What does not follow is any record of the ones you lost.",
  artifactTitle: "what your analytics can see",
  artifactMeta: "per answer",
  closing: [
    "A lost click leaves a gap in a report. A lost answer leaves nothing, because the visit it would have produced never happened and the customer never knew your name to search for it.",
    "So we go and ask the engines directly, on a schedule, and score what comes back. That is the only version of this number that exists.",
  ],
  refusal:
    "We will not quote you a dollar figure for what absence has cost you. It cannot be computed honestly, and the vendors publishing one are estimating your revenue and calling it research.",
} as const;

export type AttributionRow = {
  event: string;
  status: string;
  /** True when the reader's own reporting would show it. */
  seen: boolean;
};

/**
 * The artifact for the section above: four things that happen, and whether
 * the reader could ever see them. Absence here is a FLAGGED FAILURE, not a
 * comparison, so the unseen rows step UP to full ink and the recorded ones
 * step down (CLAUDE.md, "Absence has two directions").
 */
export const ATTRIBUTION_ROWS: readonly AttributionRow[] = [
  { event: "A click from a Google result", status: "recorded", seen: true },
  { event: "A click from an AI answer", status: "often filed as direct", seen: true },
  { event: "An AI answer that named you", status: "not recorded", seen: false },
  {
    event: "An AI answer that named a competitor",
    status: "not recorded",
    seen: false,
  },
];

export type EngagementStep = {
  phase: string;
  title: string;
  body: string;
};

/** What happens after the report lands. Renders on the full-bleed blue band. */
export const ENGAGEMENT: readonly EngagementStep[] = [
  {
    phase: "Baseline",
    title: "Your numbers before anything changes",
    body: "We agree the question set with you, using the phrases your customers use rather than keyword-tool output. Then we run every question repeatedly across all four engines and score presence, prominence, and accuracy against a fact sheet you approve.",
  },
  {
    phase: "Diagnosis",
    title: "Why the answer looks the way it does",
    body: "For every question where you are absent, we record who was named instead and which sources the engine cited. Patterns emerge fast. The same handful of domains and the same two or three structural gaps explain most of the absence.",
  },
  {
    phase: "Fixes",
    title: "A list ordered by evidence, not by effort",
    body: "You get a prioritized list. Each item names the engine it should affect and the reason we expect it to. Crawler and accuracy problems come first, because they are binary and cheap. Nothing is on the list because it is standard practice.",
  },
  {
    phase: "Re-measure",
    title: "The same questions, scored the same way",
    body: "Six to ten weeks later we re-run the identical question set. Same phrasing, same run count, same scoring. That is the only way to tell a real change from the ordinary run-to-run noise these systems produce.",
  },
  {
    phase: "Tracking",
    title: "A number that moves, monthly",
    body: "Ongoing measurement turns visibility into a metric you can put in a board pack: mention rate by engine, share of voice against named competitors, accuracy, and the source list as it shifts.",
  },
];

/** What the free report contains. Feeds the blue half of the free-check panel. */
export const REPORT_CONTENTS: readonly { name: string; body: string }[] = [
  {
    name: "Verbatim answers",
    body: "The text each engine returned, per run, unedited.",
  },
  {
    name: "Mention rate",
    body: "Named in how many of how many runs, broken out by engine.",
  },
  {
    name: "Competitor set",
    body: "The businesses named instead of you, by name and frequency.",
  },
  {
    name: "Cited sources",
    body: "Which domains each engine leaned on to build the answer.",
  },
  {
    name: "Access findings",
    body: "Which AI crawlers your site accepts, refuses, or partly blocks.",
  },
];

/**
 * Home FAQ. Renders the visible questions AND the FAQPage JSON-LD through
 * FaqSection, so the two can never drift (the Cat 5 check).
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

/**
 * The two figures beside the FAQ. Neither is a research statistic, so neither
 * needs a lib/stats.ts source line: 10x is our own sampling protocol (see
 * /how-it-works §2) and 0 is the no-guarantees posture stated as a number.
 */
export const FAQ_FIGURES: readonly {
  value: string;
  label: string;
  body: string;
  accent?: boolean;
}[] = [
  {
    value: "10×",
    label: "Runs per question, per engine",
    body: "Every question is asked repeatedly on every engine, because a single answer is noise. The report states run counts wherever a rate appears.",
  },
  {
    value: "0",
    label: "Guarantees offered",
    accent: true,
    body: "No ranking promises, no guaranteed placements, no claims about what an engine will say next month. Measurement and evidence only.",
  },
];
