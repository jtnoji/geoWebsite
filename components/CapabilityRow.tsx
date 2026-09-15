import FindingsPanel, { type FindingRow } from "./FindingsPanel";
import { SECTION_X } from "@/lib/layout";
import { delay } from "@/lib/reveal";

export type Capability = {
  no: string;
  name: string;
  heading: string;
  body: string;
  points: readonly string[];
  panel: { title: string; meta: string; rows: readonly FindingRow[] };
};

/**
 * One home capability (mockup/sable-site.dc.html, "The solution"): a numbered
 * pill, a heading, a sentence, three points, and the product panel that shows
 * the thing the copy claims. Rows alternate which side the panel sits on from
 * md up. On phones the copy always comes first, because a panel read before
 * its heading is a picture with no caption.
 */
export default function CapabilityRow({
  capability,
  flip,
}: {
  capability: Capability;
  flip: boolean;
}) {
  const { no, name, heading, body, points, panel } = capability;
  return (
    <div className={`${SECTION_X} py-9 md:py-11`}>
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14 wide:gap-24">
        <div data-reveal className={`min-w-0 ${flip ? "md:order-2" : ""}`}>
          <p className="inline-block rounded-full border border-track bg-white px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-soft">
            {`${no} · ${name}`}
          </p>
          <h3 className="display mt-5 max-w-[17ch] text-[clamp(26px,2.8vw,58px)] leading-[1.1] text-ink text-pretty">
            {heading}
          </h3>
          <p className="mt-4 max-w-[44ch] text-[clamp(16.5px,1.146vw,20.5px)] leading-[1.75] text-ink-faint">
            {body}
          </p>
          <ul data-reveal="stagger" className="mt-[22px] flex flex-col gap-2.5">
            {points.map((point) => (
              <li
                key={point}
                className="grid grid-cols-[18px_minmax(0,1fr)] items-start gap-2.5 text-[clamp(15.5px,1.076vw,19.5px)] leading-[1.55] text-ink"
              >
                {/* In em, so the dot stays on the first line as the type grows. */}
                <span
                  aria-hidden="true"
                  className="mt-[0.58em] h-1.5 w-1.5 rounded-full bg-cobalt"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>
        {/* The panel arrives from its own side of the row and settles in
            scale as it scrolls in (`depth-in`). Not the `scale` reveal: that
            would animate the same property as depth-in. */}
        <div
          data-reveal={flip ? "left" : "right"}
          style={delay(120)}
          className={`depth-in min-w-0 rounded-[22px] bg-paper-dim p-3 sm:p-[26px] ${
            flip ? "md:order-1" : ""
          }`}
        >
          <FindingsPanel {...panel} />
        </div>
      </div>
    </div>
  );
}
