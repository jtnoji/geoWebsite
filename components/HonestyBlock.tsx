import Chip from "./Chip";
import { HONESTY_COPY } from "@/lib/site";

/**
 * The no-guarantees pull-quote: solid navy chip label, 2px ink top rule,
 * 22px quote in the display serif with an ink opener and one emphasized ink
 * phrase, footer with the outline NO GUARANTEES chip. Copy renders verbatim
 * from HONESTY_COPY parts.
 *
 * Still always on a light ground, never a dark block. That rule predates this
 * palette and survives it: a navy panel would make the one paragraph that
 * admits the limits of the service into the loudest thing on the page, which
 * is exactly backwards. It earns attention from the rule and the serif.
 *
 * The heading chip was the page's ONE gold chip in the weir system. On paper
 * this palette has nothing louder than the navy fill, so the heading takes
 * solid and the footer chip steps down to outline.
 */
export default function HonestyBlock({ withLabel = true }: { withLabel?: boolean }) {
  const { heading, parts } = HONESTY_COPY;
  return (
    <aside className="max-w-[680px]">
      {withLabel && <Chip>{heading}</Chip>}
      <div className="mt-3.5 border-t-2 border-ink pt-5">
        <p className="display text-[22px] leading-[1.45] text-ink-soft">
          <b className="font-medium text-ink">{parts.opener}</b>
          {parts.mid}
          <em className="not-italic font-medium text-ink">{parts.accent}</em>
          {parts.rest}
        </p>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
          <Chip tone="outline" className="mr-2.5">
            No guarantees
          </Chip>
          Sampled rates · No theater
        </p>
      </div>
    </aside>
  );
}
