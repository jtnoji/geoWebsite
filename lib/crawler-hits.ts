import type { CrawlerLog } from "./crawlers";

/**
 * GENERATED FILE. Do not hand-edit.
 * Rewritten wholesale by `node scripts/ingest-crawler-hits.mjs <logs.ndjson>`.
 *
 * `null` means no crawler log has been ingested yet, and the panel on
 * /our-score renders nothing. It stays null until a Vercel Log Drain exists:
 * this site is a static export, so it emits no runtime logs at all, and CDN
 * access logs (the only place a GPTBot page fetch appears) need a Log Drain on
 * a Pro plan. See scaffold.md 6c for the setup.
 *
 * Never fill this in by hand with estimates. The panel's entire value is that
 * the numbers are measured, and they are numbers about third parties.
 */
export const CRAWLER_HITS: CrawlerLog | null = null;
