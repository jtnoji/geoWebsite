import { COMPARISON } from "@/lib/home";
import { BRAND } from "@/lib/site";

/**
 * "Why Sable" (mockup/sable-site.dc.html): us against a traditional SEO
 * agency, row by row. A real <table>, not a grid of divs, so the row and
 * column headers are announced with each cell and a crawler reads it as the
 * comparison it is.
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

export default function CompareTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[340px] border-collapse text-[clamp(15.5px,1.076vw,19.5px)]">
        <thead>
          <tr className="border-b border-ink">
            <th scope="col" className="w-[46%] pb-3.5 text-left font-normal">
              <span className="sr-only">Capability</span>
            </th>
            <th
              scope="col"
              className="pb-3.5 text-center text-[clamp(15px,1.042vw,19px)] font-semibold text-ink"
            >
              {BRAND}
            </th>
            <th
              scope="col"
              className="pb-3.5 text-center text-[clamp(15px,1.042vw,19px)] font-normal text-ink-faint"
            >
              {COMPARISON.rival}
            </th>
          </tr>
        </thead>
        <tbody data-reveal="stagger">
          {COMPARISON.rows.map((row) => (
            <tr key={row.label} className="border-b border-line">
              <th scope="row" className="py-[15px] pr-3 text-left font-normal text-ink">
                {row.label}
              </th>
              <td className="py-[15px] text-center font-semibold text-cobalt">
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
