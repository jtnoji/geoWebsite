/**
 * Artifact card: 1px line-dark border, NO radius/shadow, Berkeley-blue header
 * bar at 11px with a dim right slot. Data cards stay square-cornered — the
 * rounded, shadowed treatment is reserved for the product mockups (the hero
 * answer card), so measurement artifacts never read as marketing.
 */
export default function ArtifactCard({
  title,
  meta,
  children,
  footer,
  className = "",
}: {
  title: React.ReactNode;
  meta?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-line-dark bg-white ${className}`}>
      <div className="flex justify-between gap-3 bg-ink px-3.5 py-2 font-mono text-[11px] text-white">
        <span>{title}</span>
        {meta && <span className="text-ink-dim">{meta}</span>}
      </div>
      {children}
      {footer && (
        <div className="border-t border-line px-4 py-2.5 font-mono text-[11px] text-ink-faint">
          {footer}
        </div>
      )}
    </div>
  );
}
