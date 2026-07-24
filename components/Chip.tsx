/**
 * The label chip — the system's signature element. Poppins 12px/600, white on
 * Berkeley blue, 6×12 padding, .06em tracking; content is uppercase by
 * convention.
 * `gold` variant (ink on California gold): at most ONE per page — it marks
 * loss/absence or the honesty block.
 */
export default function Chip({
  children,
  gold = false,
  className = "",
}: {
  children: React.ReactNode;
  gold?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-block px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.06em] ${
        gold ? "bg-gold text-ink" : "bg-ink text-white"
      } ${className}`}
    >
      {children}
    </span>
  );
}
