/**
 * The label chip: a mono, tracked, uppercase pill (mockup/sable-site.dc.html,
 * the capability pills). Content is uppercase by CSS, so the raw HTML keeps
 * the words in their natural case.
 *
 * Three tones:
 *
 *   solid   (default) navy fill, white text.
 *   outline white fill, a track-coloured hairline, soft ink text. The design's
 *           capability pill.
 *   sky     Sky fill, night text. ON DARK GROUNDS ONLY, like every use of Sky.
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
    outline: "border border-track bg-white text-ink-soft",
    sky: "bg-sky text-night",
  } as const;

  return (
    <span
      className={`inline-block rounded-full px-3.5 py-1.5 font-mono text-[10.5px] font-medium uppercase tracking-[0.16em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
