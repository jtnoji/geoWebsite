export type Step = { title: string; body: string };

/**
 * Steps as joined bordered cells (mockup `.steps`): shared 1px line-dark
 * borders with no gaps, each cell headed by a full-width black mono number
 * tab (01/02/03 — black as punctuation).
 */
export default function StepList({ steps }: { steps: readonly Step[] }) {
  return (
    <ol className="grid md:grid-cols-3">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="border border-b-0 border-line-dark bg-white last:border-b md:border-b md:border-r-0 md:last:border-r"
      >
          <span className="block bg-ink px-3.5 py-1.5 font-mono text-[11px] text-white">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="px-4 pb-5 pt-4">
            <h3 className="text-base font-bold tracking-[-0.01em] text-ink">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-ink-soft">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
