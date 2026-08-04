import { FOUNDATIONS } from "@/lib/home";
import { SAMPLE_LABEL } from "@/lib/sample";

/**
 * The prioritized roadmap, as the product would render it: an ordered fix list
 * with the reason the order is what it is.
 *
 * IT REPLACES FoundationList ON THE HOME PAGE, and that is the point. The four
 * technical foundations were ~1400px of prose in a slot that was supposed to
 * show what a customer receives. The same four items, stated as a work queue
 * with their category and their position, say "you get a list you can hand to
 * a developer" at a glance. The long-form version still exists for the pages
 * that are there to explain rather than to sell.
 *
 * NOTHING HERE IS A PERFORMANCE CLAIM. No impact percentages, no effort
 * estimates, no "lifts you to #1": those would be invented numbers about
 * results, which is the one thing the honesty rules forbid outright. The only
 * ordering assertion is the one the site already makes in prose, that access
 * comes first because a blocked crawler makes the rest moot.
 */

const STATUS = ["Do first", "Then", "Then", "Then"] as const;

export default function RoadmapPanel() {
  return (
    <div className="surface surface-soft border border-line-dark bg-white">
      <div className="flex items-center justify-between gap-3 bg-ink px-4 py-2.5 font-mono text-[11px] text-white">
        <span>roadmap · prioritized</span>
        <span className="text-ink-dim">{`${FOUNDATIONS.length} items`}</span>
      </div>

      <ol>
        {FOUNDATIONS.map((item, i) => (
          <li
            key={item.kicker}
            className="grid grid-cols-[34px_minmax(0,1fr)] gap-x-4 border-t border-line px-4 py-4 first:border-t-0"
          >
            <span
              className={`display text-[22px] leading-none ${
                i === 0 ? "text-ink" : "text-ink-faint"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <span className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                  {item.kicker}
                </span>
                {/* The first item inverts. It is the only ranking statement on
                    the card and it earns a fill; the rest are quiet. */}
                <span
                  className={`px-2 py-[3px] font-mono text-[10px] font-semibold uppercase tracking-[0.12em] ${
                    i === 0
                      ? "bg-ink text-white"
                      : "bg-paper-dim text-ink-faint"
                  }`}
                >
                  {STATUS[i] ?? "Then"}
                </span>
              </div>
              <p className="mt-2 text-[14.5px] font-medium leading-[1.45] text-ink text-pretty">
                {item.title}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="border-t border-line px-4 py-2.5 font-mono text-[11px] text-ink-faint">
        {SAMPLE_LABEL}
      </p>
    </div>
  );
}
