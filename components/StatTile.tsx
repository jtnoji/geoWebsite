import type { Stat } from "@/lib/stats";

/** Editorial stat (v2): heavy top rule, big number, sentence, named source. */
export default function StatTile({ stat }: { stat: Stat }) {
  return (
    <figure className="border-t-2 border-ink pt-4">
      <p className="text-4xl font-[650] tracking-tight text-ink">{stat.value}</p>
      <blockquote className="mt-2 max-w-[17rem] text-sm leading-6 text-ink-soft">
        {stat.text}
      </blockquote>
      <figcaption className="mt-2.5 text-xs text-ink-faint">
        {stat.url ? (
          <a href={stat.url} target="_blank" rel="noopener noreferrer" className="hover:text-ink-soft">
            {stat.source}
          </a>
        ) : (
          stat.source
        )}
      </figcaption>
    </figure>
  );
}
