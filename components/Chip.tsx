/**
 * The label chip — the system's signature element. Libre Franklin 11.5px/500,
 * white on Berkeley Navy, 6×12 padding, .14em tracking; content is uppercase
 * by convention, and per the brand sheet the tracked label is the ONLY place
 * uppercase is allowed.
 *
 * Three tones, and the palette decides which is legal where:
 *
 *   solid   (default) navy fill, white text. The page's loud chip.
 *   outline hairline, navy text. Steps DOWN from solid — use for the second
 *           and third chip in a group so a stack does not read as blocks.
 *   sky     Sky fill, navy text. ON NAVY GROUNDS ONLY, at most once per page.
 *
 * The weir system's `gold` variant is gone with California gold. On paper this
 * palette has nothing louder than the navy fill, so emphasis steps down from
 * solid rather than up from it.
 */
export default function Chip({
  children,
  tone = "solid",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "solid" | "outline" | "sky";
  className?: string;
}) {
  const tones = {
    solid: "bg-ink text-white",
    outline: "border border-line-dark text-ink",
    sky: "bg-sky text-ink",
  } as const;

  return (
    <span
      className={`inline-block px-3 py-1.5 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
