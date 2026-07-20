/**
 * Artifact card (mockup `.card`): 1px line-dark border, NO radius/shadow,
 * black header bar in mono 11px with a dim right slot. One of the few places
 * black may fill — label-sized header bar only, never the body.
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
        {meta && <span className="text-[#8d96a3]">{meta}</span>}
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
