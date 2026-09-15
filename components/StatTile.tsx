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
    <figure className="grid h-full items-center gap-x-5 gap-y-3 rounded-xl bg-white px-[26px] py-6 min-[440px]:grid-cols-[auto_minmax(0,1fr)] wide:gap-x-8 wide:px-10 wide:py-9">
      <p className="whitespace-nowrap text-[clamp(40px,2.778vw,64px)] font-semibold leading-none tracking-[-0.035em] text-ink">
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
