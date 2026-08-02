import { FOUNDATIONS } from "@/lib/home";

/**
 * The four technical foundations, as one bordered list with a numeral rail.
 * Numeral 1 is full-strength ink and the rest are ghosted: crawler access is
 * the failure we find most often, so the page says so typographically instead
 * of claiming a rate we have not published a source for. (It was gold before
 * this palette; a tone step carries the same emphasis without a second hue.)
 *
 * Odd indexes of `parts` render as inline code — see the Foundation type.
 */
export default function FoundationList() {
  return (
    <ol className="list-none border border-line-dark bg-white">
      {FOUNDATIONS.map((f, i) => (
        <li
          key={f.kicker}
          className="grid grid-cols-[62px_1fr] border-t border-line-dark first:border-t-0 sm:grid-cols-[82px_1fr]"
        >
          <span
            aria-hidden="true"
            className={`display flex items-start justify-center border-r border-line py-6 text-[38px] leading-none ${
              i === 0 ? "text-ink" : "text-[rgba(14,35,64,0.16)]"
            }`}
          >
            {i + 1}
          </span>
          <div className="flex flex-col gap-2.5 px-6 pb-7 pt-6">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-accent">
              {f.kicker}
            </p>
            <h3 className="text-[19px] font-medium tracking-[-0.01em] text-ink text-pretty">
              {f.title}
            </h3>
            <p className="text-[14.5px] leading-[1.7] text-ink-soft text-pretty">
              {f.parts.map((part, p) =>
                p % 2 === 1 ? (
                  <code
                    key={p}
                    className="bg-paper-dim px-1.5 py-0.5 font-mono text-[12.5px] text-accent"
                  >
                    {part}
                  </code>
                ) : (
                  part
                )
              )}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
