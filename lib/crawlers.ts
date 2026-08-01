/**
 * The AI crawler roster and the shape of the published crawler log.
 *
 * WHY THIS FILE EXISTS
 * Vercel Web Analytics counts humans only: a JS beacon cannot see an AI
 * crawler, because crawlers never execute JavaScript (CLAUDE.md, analytics
 * invariant). So the one question this company is built to answer about its
 * own site, "is GPTBot actually fetching us", is the one thing the site could
 * not see. Answering it needs request logs, and this is the data layer for
 * publishing them.
 *
 * The roster lives HERE and app/robots.ts imports it, not the other way round.
 * The list of bots we explicitly allow and the list we report traffic for must
 * be the same list. If they drift, /our-score publishes a number for a bot we
 * quietly stopped allowing, which is exactly the kind of unverifiable claim we
 * audit clients for.
 */

/**
 * UA token, matched case-insensitively against the request user agent.
 *
 * WIDENED 2026-07-31, and the reason matters more than the additions.
 *
 * The original roster (GPTBot, ClaudeBot, Claude-SearchBot, PerplexityBot,
 * Google-Extended, Bingbot, CCBot) was a list of TRAINING crawlers. Not one of
 * the bots that fetches a page in order to answer a question someone is asking
 * right now was on it:
 *
 *   - GPTBot trains models. `OAI-SearchBot` builds the index ChatGPT search
 *     cites from, and `ChatGPT-User` is the fetch that happens when a user's
 *     question sends ChatGPT to a URL. Those two decide whether a page can show
 *     up in a ChatGPT answer; GPTBot does not.
 *   - `Google-Extended` is a training/grounding opt-out token. It is not a
 *     fetcher and has no crawl behaviour of its own. AI Overviews and AI Mode
 *     read what plain `Googlebot` fetched, which the old list never named.
 *   - Same split at Anthropic (Claude-User), Perplexity (Perplexity-User),
 *     Apple (Applebot / Applebot-Extended) and Mistral (MistralAI-User).
 *
 * `User-Agent: *  Allow: /` did permit all of them, so nothing was blocked.
 * The point of the explicit per-bot list is that it survives a later change to
 * the `*` group, and that it is the same list /our-score publishes traffic
 * against. A roster that omits OAI-SearchBot cannot report on the crawler that
 * actually decides ChatGPT visibility, which is the product.
 *
 * Deliberately NOT here: Bytespider, Diffbot, Timpibot, YouBot. They feed no
 * answer surface a US local business is measured in, so listing them would pad
 * the /our-score table with rows that mean nothing. `*` still allows them.
 */
export const AI_BOTS = [
  // OpenAI: train / index / live fetch are three different bots.
  { token: "GPTBot", label: "GPTBot", engine: "ChatGPT (training)" },
  { token: "OAI-SearchBot", label: "OAI-SearchBot", engine: "ChatGPT (search)" },
  { token: "ChatGPT-User", label: "ChatGPT-User", engine: "ChatGPT (browsing)" },
  // Anthropic.
  { token: "ClaudeBot", label: "ClaudeBot", engine: "Claude (training)" },
  { token: "Claude-SearchBot", label: "Claude-SearchBot", engine: "Claude (search)" },
  { token: "Claude-User", label: "Claude-User", engine: "Claude (browsing)" },
  // Perplexity.
  { token: "PerplexityBot", label: "PerplexityBot", engine: "Perplexity" },
  { token: "Perplexity-User", label: "Perplexity-User", engine: "Perplexity (browsing)" },
  // Google: Googlebot is what AI Overviews read. Google-Extended is a
  // grounding/training opt-out token, kept so an allow stays explicit.
  { token: "Googlebot", label: "Googlebot", engine: "Google AI Overviews" },
  { token: "Google-Extended", label: "Google-Extended", engine: "Gemini (grounding)" },
  { token: "Google-CloudVertexBot", label: "Google-CloudVertexBot", engine: "Vertex AI" },
  // Microsoft.
  { token: "Bingbot", label: "Bingbot", engine: "Bing / Copilot" },
  // Apple.
  { token: "Applebot", label: "Applebot", engine: "Siri / Spotlight" },
  { token: "Applebot-Extended", label: "Applebot-Extended", engine: "Apple Intelligence" },
  // The rest of the answer surfaces.
  { token: "meta-externalagent", label: "meta-externalagent", engine: "Meta AI" },
  { token: "Amazonbot", label: "Amazonbot", engine: "Alexa" },
  { token: "DuckAssistBot", label: "DuckAssistBot", engine: "DuckDuckGo" },
  { token: "MistralAI-User", label: "MistralAI-User", engine: "Le Chat" },
  { token: "cohere-ai", label: "cohere-ai", engine: "Cohere" },
  // Corpus everyone downstream trains on.
  { token: "CCBot", label: "CCBot", engine: "Common Crawl" },
] as const;

/** The tokens app/robots.ts writes Allow groups for. */
export const AI_BOT_TOKENS = AI_BOTS.map((b) => b.token);

export type CrawlerBotHits = {
  /** Must be one of AI_BOTS[].token. */
  token: string;
  /** Total requests from this bot in the window. */
  requests: number;
  /** Distinct paths it fetched. A bot hitting one path is not crawling us. */
  paths: number;
  /** ISO date of its most recent request, or null if it never came. */
  lastSeen: string | null;
};

export type CrawlerLog = {
  /** Inclusive ISO dates bounding the window the counts cover. */
  from: string;
  to: string;
  /** Where the numbers came from, printed verbatim under the panel. */
  source: string;
  /** One entry per roster bot, including the ones with zero requests. */
  bots: CrawlerBotHits[];
};

/**
 * True when there is a real window with at least one real request in it.
 *
 * The panel renders nothing when this is false. A crawler log is only worth
 * publishing if it is measured: a "coming soon" box on the page whose whole
 * argument is "measurement you can inspect" argues against itself, and
 * placeholder counts would be inventing data about third-party crawlers.
 */
export function hasCrawlerData(log: CrawlerLog | null): log is CrawlerLog {
  return !!log && log.bots.some((b) => b.requests > 0);
}
