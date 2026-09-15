import Chip from "./Chip";
import { HONESTY_COPY } from "@/lib/site";

/**
 * The no-guarantees pull-quote: a navy chip label, a 2px ink rule, the quote
 * with an ink opener and one emphasized ink phrase, and a footer with the
 * outline NO GUARANTEES chip. Copy renders verbatim from HONESTY_COPY parts.
 *
 * Always on a light ground, never a dark band. A dark panel would make the one
 * paragraph that admits the limits of the service into the loudest thing on
 * the page, which is exactly backwards. It earns attention from the rule and
 * the size.
 */
export default function HonestyBlock({ withLabel = true }: { withLabel?: boolean }) {
  const { heading, parts } = HONESTY_COPY;
  return (
    <aside className="max-w-[680px]">
      {withLabel && <Chip>{heading}</Chip>}
      <div className="mt-3.5 border-t-2 border-ink pt-5">
        <p className="text-[19px] leading-[1.6] text-ink-soft">
          <b className="font-semibold text-ink">{parts.opener}</b>
          {parts.mid}
          <em className="font-semibold not-italic text-ink">{parts.accent}</em>
          {parts.rest}
        </p>
        <p className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-faint">
          <Chip tone="outline">No guarantees</Chip>
          Sampled rates · No theater
        </p>
      </div>
    </aside>
  );
}
