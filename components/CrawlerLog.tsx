import ArtifactCard from "./ArtifactCard";
import { AI_BOTS, hasCrawlerData, type CrawlerLog as Log } from "@/lib/crawlers";
import { CRAWLER_HITS } from "@/lib/crawler-hits";

/**
 * The published crawler log: how often each AI crawler actually fetched this
 * site. A measurement artifact, so it follows the artifact rules (square,
 * shadowless, mono figures) and never the product-mockup treatment.
 *
 * Renders NOTHING until real data is ingested. See lib/crawler-hits.ts.
 *
 * Server component: it renders copy and figures, so it cannot be a client
 * component, and the numbers must be in the raw HTML a crawler reads. There is
 * a pleasing symmetry in the crawlers being able to read the page that counts
 * them, and it is also the invariant the geo suite enforces.
 */
export default function CrawlerLog({ log = CRAWLER_HITS }: { log?: Log | null }) {
  if (!hasCrawlerData(log)) return null;

  const byToken = new Map(log.bots.map((b) => [b.token, b]));
  const total = log.bots.reduce((n, b) => n + b.requests, 0);
  const seen = log.bots.filter((b) => b.requests > 0).length;

  return (
    <ArtifactCard
      title="crawler log · this site"
      meta={`${log.from} to ${log.to}`}
      footer={log.source}
    >
      <div className="px-4 py-2">
        {AI_BOTS.map((bot) => {
          const hit = byToken.get(bot.token);
          const requests = hit?.requests ?? 0;
          const absent = requests === 0;
          return (
            <div
              key={bot.token}
              className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-b border-dashed border-line py-2.5 last:border-b-0"
            >
              <span className="min-w-0 font-mono text-[12.5px] text-ink">
                {bot.label}
                <span className="text-ink-faint"> · {bot.engine}</span>
              </span>
              <span
                className={`whitespace-nowrap font-mono text-[12.5px] font-semibold ${
                  absent ? "text-bad" : "text-ink"
                }`}
              >
                {absent ? "not seen" : `${requests.toLocaleString()} req`}
                {!absent && hit && hit.paths > 0 && (
                  <span className="font-normal text-ink-faint">
                    {" "}
                    · {hit.paths} path{hit.paths === 1 ? "" : "s"}
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
      <div className="border-t border-line px-4 py-2.5 font-mono text-[11px] text-ink-faint">
        {total.toLocaleString()} requests · {seen} of {AI_BOTS.length} crawlers seen
      </div>
    </ArtifactCard>
  );
}

/**
 * The card plus its heading, guarded once. Kept together so /our-score can
 * never render a heading over an empty card: both disappear or neither does.
 */
export function CrawlerLogSection({ log = CRAWLER_HITS }: { log?: Log | null }) {
  if (!hasCrawlerData(log)) return null;

  return (
    <section data-reveal className="mx-auto mt-16 max-w-3xl text-left">
      <h2 className="display text-2xl font-bold tracking-tight text-ink">
        Who actually crawled us
      </h2>
      <p className="mt-3 text-base leading-7 text-ink-soft">
        Analytics counts humans. AI crawlers never run JavaScript, so a beacon
        cannot see them. These counts come from server request logs.
      </p>
      <div className="mt-6">
        <CrawlerLog log={log} />
      </div>
    </section>
  );
}
