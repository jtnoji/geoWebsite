import Chip from "./Chip";
import { HONESTY_COPY } from "@/lib/site";

/**
 * The no-guarantees pull-quote: gold chip label (the page's ONE gold chip),
 * 2px ink top rule, 21px/500 quote with bold ink opener and one emphasized
 * ink phrase. Always on a light ground — never a dark block. Copy renders
 * verbatim from HONESTY_COPY parts. The old bottom chip row was removed
 * (label + body + tagline all restated the same idea — say it once, well).
 */
export default function HonestyBlock({ withLabel = true }: { withLabel?: boolean }) {
  const { heading, parts } = HONESTY_COPY;
  return (
    <aside className="max-w-[680px]">
      {withLabel && <Chip gold>{heading}</Chip>}
      <div className="mt-3.5 border-t-2 border-ink pt-5">
        <p className="text-[21px] font-medium leading-[1.45] tracking-[-0.02em] text-ink-soft">
          <b className="font-bold text-ink">{parts.opener}</b>
          {parts.mid}
          <em className="not-italic font-bold text-ink">{parts.accent}</em>
          {parts.rest}
        </p>
      </div>
    </aside>
  );
}
