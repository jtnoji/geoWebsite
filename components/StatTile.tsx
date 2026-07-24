import type { Stat } from "@/lib/stats";

/** Split `text` around the one bolded phrase (the bold ration). */
function BodyWithBold({ text, bold }: { text: string; bold?: string }) {
  if (!bold || !text.includes(bold)) return <>{text}</>;
  const [before, after] = text.split(bold, 2);
  return (
    <>
      {before}
      <b className="font-bold text-ink">{bold}</b>
      {after}
    </>
  );
}

/**
 * Editorial stat (mockup `.stat`): 2px ink top rule, 36px/700 number, 14px
 * body with one bolded phrase, source line in mono 11px uppercase faint.
 */
export default function StatTile({ stat }: { stat: Stat }) {
  return (
    <figure className="border-t-2 border-ink pt-4">
      <p className="text-4xl font-bold tracking-[-0.03em] text-ink">{stat.value}</p>
      <blockquote className="mt-1.5 max-w-[270px] text-sm leading-6 text-ink-soft">
        <BodyWithBold text={stat.text} bold={stat.bold} />
      </blockquote>
      <figcaption className="mt-2.5 font-mono text-[11px] uppercase text-ink-faint">
        {stat.url ? (
          <a href={stat.url} rel="noopener noreferrer" className="hover:text-ink-soft">
            {stat.source}
          </a>
        ) : (
          stat.source
        )}
      </figcaption>
    </figure>
  );
}
