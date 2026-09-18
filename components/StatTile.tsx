import type { Stat } from "@/lib/stats";

/**
 * A cited statistic (mockup/sable-site.dc.html, the two tiles under the shift
 * chart): a white tile, the figure large on the left, the sentence and its
 * named source beside it. The source links out wherever lib/stats.ts has a
 * URL, because every number on this site has to be checkable.
 *
 * The figure stacks above the sentence on narrow phones, where "3× fewer" at
 * 40px would otherwise squeeze the sentence into a one-word column.
 */
export default function StatTile({ stat }: { stat: Stat }) {
  return (
    <figure className="grid h-full items-center gap-x-5 gap-y-2.5 rounded-xl bg-white px-6 py-5 min-[420px]:grid-cols-[auto_minmax(0,1fr)] wide:gap-x-7 wide:px-8 wide:py-6">
      <p className="whitespace-nowrap text-[clamp(42px,3.1vw,60px)] font-semibold leading-none tracking-[-0.035em] text-ink">
        {stat.value}
      </p>
      <div>
        <blockquote className="text-[clamp(14.5px,1.007vw,18px)] leading-[1.55] text-ink-soft">
          {stat.text}
        </blockquote>
        <figcaption className="mt-[7px] font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
          {stat.url ? (
            <a
              href={stat.url}
              rel="noopener noreferrer"
              className="transition-colors hover:text-ink"
            >
              {stat.source}
            </a>
          ) : (
            stat.source
          )}
        </figcaption>
      </div>
    </figure>
  );
}
