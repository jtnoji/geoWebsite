/**
 * The black label chip — the system's signature element (mockup `.chip`).
 * Mono 12px/600, white on ink, 6×12 padding, .06em tracking; content is
 * uppercase by convention (pass it uppercased or rely on the class).
 * `red` variant: at most ONE red chip per page (red = loss/absence only).
 */
export default function Chip({
  children,
  red = false,
  className = "",
}: {
  children: React.ReactNode;
  red?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-block px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.06em] text-white ${
        red ? "bg-bad" : "bg-ink"
      } ${className}`}
    >
      {children}
    </span>
  );
}
