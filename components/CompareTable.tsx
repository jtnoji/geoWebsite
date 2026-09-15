import { COMPARISON } from "@/lib/home";
import { BRAND } from "@/lib/site";

/**
 * "Why Sable" (mockup/sable-site.dc.html): us against a traditional SEO
 * agency, row by row. A real <table>, not a grid of divs, so the row and
 * column headers are announced with each cell and a crawler reads it as the
 * comparison it is.
 *
 * Our column carries a faint cobalt tint from its header to the last row, so
 * the eye can run straight down it. The home page sets the table in a white
 * card, and the tint is measured for white. The card has no vertical padding
 * of its own: the header and the last row carry that space, so the tint runs
 * to the card's top and bottom edges instead of stopping short of them.
 *
 * The tick and the cross are aria-hidden glyphs with the words beside them for
 * screen readers.
 */
function Mark({ value }: { value: boolean | string }) {
  if (typeof value === "string") return <>{value}</>;
  return (
    <>
      <span aria-hidden="true">{value ? "✓" : "✕"}</span>
      <span className="sr-only">{value ? "Yes" : "No"}</span>
    </>
  );
}

/* Cobalt at 5% on white. The cobalt ticks on it measure 4.57:1. */
const OURS = "bg-cobalt/[0.05]";

/* The card's top padding, carried by the header row so the tint starts at the
   card's edge. The last row carries the bottom padding the same way. */
const HEAD_CELL = "pb-3.5 pt-5 sm:pt-7 wide:pt-10";

export default function CompareTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[300px] border-collapse text-[clamp(15.5px,1.076vw,19.5px)]">
        <thead>
          <tr className="border-b border-ink">
            <th scope="col" className={`w-[46%] text-left font-normal ${HEAD_CELL}`}>
              <span className="sr-only">Capability</span>
            </th>
            <th
              scope="col"
              className={`${OURS} ${HEAD_CELL} px-2 text-center text-[clamp(15px,1.042vw,19px)] font-semibold text-ink`}
            >
              {BRAND}
            </th>
            <th
              scope="col"
              className={`${HEAD_CELL} px-2 text-center text-[clamp(15px,1.042vw,19px)] font-normal text-ink-faint`}
            >
              {COMPARISON.rival}
            </th>
          </tr>
        </thead>
        <tbody data-reveal="stagger">
          {COMPARISON.rows.map((row) => (
            <tr
              key={row.label}
              className="border-b border-line last:border-b-0 [&:last-child>*]:pb-6 wide:[&:last-child>*]:pb-9"
            >
              <th scope="row" className="py-[15px] pr-3 text-left font-normal text-ink">
                {row.label}
              </th>
              <td className={`${OURS} py-[15px] text-center font-semibold text-cobalt`}>
                <Mark value={row.us} />
              </td>
              <td className="py-[15px] text-center text-ink-faint">
                <Mark value={row.agency} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
