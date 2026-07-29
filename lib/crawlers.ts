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

/** UA token, matched case-insensitively against the request user agent. */
export const AI_BOTS = [
  { token: "GPTBot", label: "GPTBot", engine: "ChatGPT" },
  { token: "ClaudeBot", label: "ClaudeBot", engine: "Claude" },
  { token: "Claude-SearchBot", label: "Claude-SearchBot", engine: "Claude" },
  { token: "PerplexityBot", label: "PerplexityBot", engine: "Perplexity" },
  { token: "Google-Extended", label: "Google-Extended", engine: "Gemini" },
  { token: "Bingbot", label: "Bingbot", engine: "Bing / Copilot" },
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
