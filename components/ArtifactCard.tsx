/**
 * Artifact card: a white panel with a navy header strip in mono, the way the
 * Sable design draws a report page (mockup/sable-site.dc.html, the sample
 * report preview). Same 16px radius and card shadow as every other panel.
 *
 * The Berkeley rule that data cards stay square and shadowless went with that
 * system. What keeps measurement out of the marketing register now is the mono
 * type, the run counts beside every rate, and the illustrative label on every
 * sample.
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
    <div className={`overflow-hidden rounded-2xl bg-white shadow-card ${className}`}>
      <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 bg-ink px-5 py-3 font-mono text-[11px] text-white">
        <span className="min-w-0">{title}</span>
        {meta && <span className="text-white/65">{meta}</span>}
      </div>
      {children}
      {footer && (
        <div className="border-t border-line px-5 py-3 font-mono text-[11px] text-ink-faint">
          {footer}
        </div>
      )}
    </div>
  );
}
