import ArtifactCard from "./ArtifactCard";
import RuleEyebrow from "./RuleEyebrow";
import StatTile from "./StatTile";
import { ATTRIBUTION_ROWS, REVENUE_COPY } from "@/lib/home";
import { delay } from "@/lib/reveal";
import { ATTRIBUTION_NOTE, REVENUE_STATS } from "@/lib/stats";

/**
 * "What the shift is worth": the size of the channel on the left, and why the
 * reader cannot see their own share of it on the right.
 *
 * SERVER COMPONENT. It renders copy and sourced numbers, so the CLAUDE.md
 * invariant applies: every figure must exist in the exported HTML with
 * JavaScript off.
 *
 * The three figures are all McKinsey and all describe the market, never the
 * reader's own loss. The refusal line under them is the point of the section
 * rather than a disclaimer on it, which is why it sits in ink beside the
 * numbers instead of in faint type underneath. See the REVENUE_COPY comment in
 * lib/home.ts before softening it.
 */
export default function RevenueAtStake() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24">
        <div
          data-reveal
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <RuleEyebrow>{REVENUE_COPY.eyebrow}</RuleEyebrow>
            <h2 className="display mt-4 max-w-[620px] text-[clamp(33px,4.4vw,52px)] leading-[1.1] text-ink text-pretty">
              {REVENUE_COPY.heading}
            </h2>
          </div>
          <p className="max-w-[380px] pb-2 text-[15.5px] leading-[1.7] text-ink-soft">
            {REVENUE_COPY.lede}
          </p>
        </div>

        <div className="mt-12 grid gap-11 md:grid-cols-[6fr_5fr] md:items-start md:gap-16">
          <div>
            {/* Three tiles from one study. The stat row higher up the page uses
                the same tile at three-across; here they stack, because the
                argument is cumulative rather than three separate facts. */}
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-1">
              {REVENUE_STATS.map((stat, i) => (
                <div key={stat.value} data-reveal style={delay(i * 110)}>
                  <StatTile stat={stat} />
                </div>
              ))}
            </div>
            <p
              data-reveal
              style={delay(330)}
              className="mt-9 max-w-[480px] border-l-2 border-ink pl-5 text-[15.5px] font-medium leading-[1.7] text-ink"
            >
              {REVENUE_COPY.refusal}
            </p>
          </div>

          <div data-reveal style={delay(160)}>
            <ArtifactCard
              title={REVENUE_COPY.artifactTitle}
              meta={REVENUE_COPY.artifactMeta}
              footer={
                <>
                  {ATTRIBUTION_NOTE.value} {ATTRIBUTION_NOTE.text}{" "}
                  <a
                    href={ATTRIBUTION_NOTE.url}
                    rel="noopener noreferrer"
                    className="uppercase hover:text-ink"
                  >
                    {ATTRIBUTION_NOTE.source}
                  </a>
                </>
              }
            >
              <dl>
                {ATTRIBUTION_ROWS.map((row) => (
                  <div
                    key={row.event}
                    className="flex items-baseline justify-between gap-4 border-b border-line px-4 py-3.5 last:border-b-0"
                  >
                    <dt
                      className={`text-[14.5px] leading-[1.45] ${
                        row.seen ? "text-ink-faint" : "font-medium text-ink"
                      }`}
                    >
                      {row.event}
                    </dt>
                    {/* The two unrecorded rows invert to a navy fill: a finding
                        that demands attention steps UP, and this is the loudest
                        one on the page after the hero's "not mentioned" flag. */}
                    <dd
                      className={`shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] ${
                        row.seen
                          ? "text-ink-faint"
                          : "bg-ink px-2.5 py-1 text-white"
                      }`}
                    >
                      {row.status}
                    </dd>
                  </div>
                ))}
              </dl>
            </ArtifactCard>

            {REVENUE_COPY.closing.map((paragraph, i) => (
              <p
                key={paragraph}
                className={`max-w-[440px] text-[15.5px] leading-[1.7] text-ink-soft ${
                  i === 0 ? "mt-7" : "mt-4"
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
