import ArtifactCard from "./ArtifactCard";
import { FINDING_CHIP, type FindingTone } from "./FindingsPanel";
import {
  SAMPLE_BY_ENGINE,
  SAMPLE_BY_TYPE,
  SAMPLE_CITATIONS,
  SAMPLE_CLIENT,
  SAMPLE_CYCLE,
  SAMPLE_EXCERPTS,
  SAMPLE_FACT_FINDINGS,
  SAMPLE_LABEL,
  SAMPLE_MATRIX,
  SAMPLE_METHOD,
  SAMPLE_SHARE,
} from "@/lib/sample";

/**
 * One artifact per section of the report, for the /sample-report walkthrough
 * (Josh, 2026-09-16: "show the reader the page"). Together they are the whole
 * cycle report, in the order it prints: how often the business came up, its
 * share of the conversation, where in the buying journey it appears, which
 * engine named whom, what the engines read, what they got wrong, what they
 * actually said, the citation ledger, and how it was measured.
 *
 * Server components, inline SVG-free: every bar is a div, so all of it is in
 * the exported HTML with JavaScript off, and every figure is quotable text
 * beside its bar rather than a picture of a number.
 *
 * All figures come from the one illustrative cycle in lib/sample.ts and each
 * card says so. Nothing here is a real client.
 */

const pct = (part: number, whole: number) => Math.round((part / whole) * 100);
const n = (value: number) => value.toLocaleString("en-US");

/* The client is the bright note; the businesses beating it step down through
   the navy ramp, per the comparison rule in CLAUDE.md. */
const SHARE_FILL = ["bg-ink", "bg-accent", "bg-slate", "bg-cobalt", "bg-track"];

const SEVERITY_TONE: Record<string, FindingTone> = {
  Urgent: "risk",
  High: "caution",
  Medium: "note",
  Low: "note",
};

/** The four numbers that define the cycle, and the one sentence under them. */
export function CycleTopLine() {
  const urgent = SAMPLE_FACT_FINDINGS.filter((f) => f.severity === "Urgent").length;
  const figures = [
    { label: "Questions", value: n(SAMPLE_CYCLE.questions), note: SAMPLE_CYCLE.questionSet },
    {
      label: "Engines",
      value: String(SAMPLE_CYCLE.engines),
      note: SAMPLE_BY_ENGINE.map((row) => row.engine).join(" · "),
    },
    { label: "Runs", value: String(SAMPLE_CYCLE.runs), note: "Each question, each engine" },
    {
      label: "Answers read",
      value: n(SAMPLE_CYCLE.answers),
      note: `${n(SAMPLE_CYCLE.answers)} of ${n(SAMPLE_CYCLE.answers)} returned`,
    },
  ];

  return (
    <div>
      <dl className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
        {figures.map((figure) => (
          <div key={figure.label} className="min-w-0 border-t border-line-dark pt-4">
            <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-faint">
              {figure.label}
            </dt>
            <dd className="mt-2.5 text-[clamp(30px,2.4vw,44px)] font-semibold leading-none tracking-[-0.03em] text-ink">
              {figure.value}
            </dd>
            <dd className="mt-2 text-[13px] leading-[1.45] text-ink-faint">{figure.note}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-9 max-w-[76ch] text-[clamp(17px,1.25vw,22px)] leading-[1.6] text-ink">
        {`${SAMPLE_CLIENT} was named in `}
        <strong className="font-semibold">
          {`${n(SAMPLE_CYCLE.named)} of ${n(SAMPLE_CYCLE.answers)} answers`}
        </strong>
        {`. It holds ${pct(SAMPLE_CYCLE.named, SAMPLE_CYCLE.mentions)}% of every brand mention in its category, and ${SAMPLE_FACT_FINDINGS.length} statements contradict its fact sheet, ${urgent} of them urgent.`}
      </p>
    </div>
  );
}

/** Section one. The title carries "mention rate", which tests/pages.ts pins. */
export function VisibilityCard() {
  return (
    <ArtifactCard
      title={`mention rate · ${SAMPLE_CYCLE.questions} questions`}
      meta={`${n(SAMPLE_CYCLE.named)} of ${n(SAMPLE_CYCLE.answers)} answers`}
      footer={SAMPLE_LABEL}
    >
      <div className="px-5 pb-5 pt-[22px]">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <p className="text-[clamp(38px,3.4vw,54px)] font-light leading-none tracking-[-0.04em] text-ink">
            {`${pct(SAMPLE_CYCLE.named, SAMPLE_CYCLE.answers)}%`}
          </p>
          <p className="text-[14.5px] text-ink-soft">AI visibility, this cycle</p>
        </div>
        <ul className="mt-6">
          {SAMPLE_BY_ENGINE.map((row) => (
            <li
              key={row.engine}
              className="grid grid-cols-[98px_minmax(0,1fr)_76px] items-center gap-3 border-t border-line py-2.5 text-[14px] sm:grid-cols-[112px_minmax(0,1fr)_92px]"
            >
              <span className="text-ink">{row.engine}</span>
              <span
                aria-hidden="true"
                className="block h-1.5 overflow-hidden rounded-full bg-track"
              >
                <span
                  className="bar-fill block h-full rounded-full bg-cobalt"
                  style={{ width: `${pct(row.named, row.answers)}%` }}
                />
              </span>
              <span className="text-right tabular-nums text-ink-soft">
                {`${row.named}/${row.answers}`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ArtifactCard>
  );
}

/** Section two: one bar, split by who got named. */
export function ShareCard() {
  return (
    <ArtifactCard
      title="share of model"
      meta={`${n(SAMPLE_CYCLE.mentions)} brand mentions`}
      footer={SAMPLE_LABEL}
    >
      <div className="px-5 pb-5 pt-[22px]">
        {/* A hairline between segments: the third competitor and the client
            are a point apart, and two tints alone read as a tie. */}
        <div aria-hidden="true" className="flex h-8 gap-[2px] overflow-hidden rounded-[8px]">
          {SAMPLE_SHARE.map((row, i) => (
            <span
              key={row.name}
              className={SHARE_FILL[i] ?? "bg-track"}
              style={{ width: `${(row.mentions / SAMPLE_CYCLE.mentions) * 100}%` }}
            />
          ))}
        </div>
        <ul className="mt-5">
          {SAMPLE_SHARE.map((row, i) => (
            <li
              key={row.name}
              className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-4 border-t border-line py-2.5 text-[14px]"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 shrink-0 rounded-[3px] ${SHARE_FILL[i] ?? "bg-track"}`}
                />
                <span className={row.you ? "font-semibold text-ink" : "text-ink"}>
                  {row.name}
                </span>
              </span>
              <span className="tabular-nums text-ink-soft">{n(row.mentions)}</span>
              <span className="w-12 text-right font-semibold tabular-nums text-ink">
                {`${pct(row.mentions, SAMPLE_CYCLE.mentions)}%`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ArtifactCard>
  );
}

/** Section three: the split that explains the headline rate. */
export function JourneyCard() {
  return (
    <ArtifactCard
      title="visibility by question type"
      meta={`${SAMPLE_CYCLE.questions} questions, tagged`}
      footer={SAMPLE_LABEL}
    >
      <div className="px-5 pb-5 pt-[22px]">
        <ul className="flex flex-col gap-4">
          {SAMPLE_BY_TYPE.map((row) => (
            <li key={row.type}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="text-[14.5px] font-semibold text-ink">{row.type}</p>
                <p className="tabular-nums text-[13.5px] text-ink-soft">
                  {`${row.named} of ${row.answers} · ${pct(row.named, row.answers)}%`}
                </p>
              </div>
              <p className="mt-0.5 truncate text-[13px] text-ink-faint">{`“${row.example}”`}</p>
              <span
                aria-hidden="true"
                className="mt-2 block h-2 overflow-hidden rounded-full bg-track"
              >
                <span
                  className="bar-fill block h-full rounded-full bg-cobalt"
                  style={{ width: `${pct(row.named, row.answers)}%` }}
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ArtifactCard>
  );
}

/** Section four: the same mentions, brand by engine. */
export function MatrixCard() {
  return (
    <ArtifactCard
      title="brands × engines"
      meta="mentions per engine"
      footer={SAMPLE_LABEL}
    >
      <div className="overflow-x-auto px-5 pb-5 pt-[22px]">
        <table className="w-full min-w-[440px] border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-ink text-[11px] uppercase tracking-[0.1em] text-ink-faint">
              <th scope="col" className="py-2 pr-3 text-left font-normal">
                Brand
              </th>
              {SAMPLE_BY_ENGINE.map((engine) => (
                <th key={engine.engine} scope="col" className="px-2 py-2 text-right font-normal">
                  {engine.engine}
                </th>
              ))}
              <th scope="col" className="py-2 pl-2 text-right font-normal">
                All five
              </th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_MATRIX.map((row) => {
              const total = row.byEngine.reduce((sum, value) => sum + value, 0);
              return (
                <tr key={row.name} className="border-b border-line last:border-b-0">
                  <th
                    scope="row"
                    className={`py-2.5 pr-3 text-left ${row.you ? "font-semibold text-ink" : "font-normal text-ink-soft"}`}
                  >
                    {row.name}
                  </th>
                  {row.byEngine.map((value, i) => (
                    <td
                      key={SAMPLE_BY_ENGINE[i].engine}
                      className={`px-2 py-2.5 text-right tabular-nums ${row.you ? "bg-cobalt/[0.05] text-ink" : "text-ink-soft"}`}
                    >
                      {value}
                    </td>
                  ))}
                  <td
                    className={`py-2.5 pl-2 text-right font-semibold tabular-nums ${row.you ? "text-cobalt" : "text-ink"}`}
                  >
                    {n(total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ArtifactCard>
  );
}

/** Section five: what the engines were reading while they answered. */
export function CitationsCard() {
  const owned = SAMPLE_CITATIONS.top.find((row) => row.you);
  const most = SAMPLE_CITATIONS.top[0].citations;
  return (
    <ArtifactCard
      title="most-cited sources"
      meta={`${n(SAMPLE_CITATIONS.total)} citations · ${SAMPLE_CITATIONS.domains} domains`}
      footer={SAMPLE_LABEL}
    >
      <div className="px-5 pb-5 pt-[22px]">
        <ul>
          {SAMPLE_CITATIONS.top.map((row) => (
            <li
              key={row.domain}
              className="grid grid-cols-[minmax(0,1fr)_64px] items-center gap-x-4 border-t border-line py-2.5 text-[14px] first:border-t-0 first:pt-0"
            >
              <span className="min-w-0">
                <span className={row.you ? "font-semibold text-ink" : "text-ink"}>
                  {row.domain}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-track"
                >
                  <span
                    className={`bar-fill block h-full rounded-full ${row.you ? "bg-cobalt" : "bg-ink"}`}
                    style={{ width: `${pct(row.citations, most)}%` }}
                  />
                </span>
              </span>
              <span className="text-right tabular-nums text-ink-soft">{n(row.citations)}</span>
            </li>
          ))}
        </ul>
        <div aria-hidden="true" className="mt-6 flex h-6 overflow-hidden rounded-[6px]">
          {SAMPLE_CITATIONS.byType.map((row, i) => (
            <span
              key={row.type}
              className={SHARE_FILL[i] ?? "bg-track"}
              style={{ width: `${row.share * 100}%` }}
            />
          ))}
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-ink-soft">
          {SAMPLE_CITATIONS.byType.map((row, i) => (
            <li key={row.type} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-[2px] ${SHARE_FILL[i] ?? "bg-track"}`}
              />
              {`${row.type} ${Math.round(row.share * 100)}%`}
            </li>
          ))}
        </ul>
        {owned && (
          <p className="mt-5 text-[14px] leading-[1.6] text-ink-soft">
            {`Your own site was cited ${owned.citations} times: `}
            <strong className="font-semibold text-ink">
              {`${pct(owned.citations, SAMPLE_CITATIONS.total)}% of everything the engines read`}
            </strong>
            {". The rest is other people's pages describing you."}
          </p>
        )}
      </div>
    </ArtifactCard>
  );
}

/** Section six: contradictions of the fact sheet, by consequence. */
export function FactSheetCard() {
  const urgent = SAMPLE_FACT_FINDINGS.filter((f) => f.severity === "Urgent").length;
  return (
    <ArtifactCard
      title="statements that contradict the fact sheet"
      meta={`${SAMPLE_FACT_FINDINGS.length} open · ${urgent} urgent`}
      footer={SAMPLE_LABEL}
    >
      <ul className="px-5 pb-5 pt-[18px]">
        {SAMPLE_FACT_FINDINGS.map((finding) => (
          <li
            key={finding.statement}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 border-t border-line py-3 first:border-t-0 first:pt-0"
          >
            <div className="min-w-0">
              <p className="text-[14.5px] leading-[1.4] text-ink">{finding.statement}</p>
              <span className="mt-2 flex items-center gap-1.5">
                {finding.engines.map((seen, i) => (
                  <span
                    key={SAMPLE_BY_ENGINE[i].engine}
                    aria-hidden="true"
                    className={`h-1.5 w-5 rounded-full ${seen ? "bg-ink" : "bg-track"}`}
                  />
                ))}
                <span className="sr-only">
                  {`Seen on ${finding.engines.filter(Boolean).length} of ${SAMPLE_CYCLE.engines} engines.`}
                </span>
                <span className="ml-1.5 tabular-nums text-[13px] text-ink-faint">
                  {`${n(finding.answers)} of ${n(SAMPLE_CYCLE.answers)} answers`}
                </span>
              </span>
            </div>
            <span
              className={`whitespace-nowrap rounded-full px-3 py-1 text-[12.5px] font-semibold ${FINDING_CHIP[SEVERITY_TONE[finding.severity] ?? "note"]}`}
            >
              {finding.severity}
            </span>
          </li>
        ))}
      </ul>
    </ArtifactCard>
  );
}

/** Section seven: the answers themselves, picked by rule rather than by hand. */
export function ExcerptsCard() {
  return (
    <ArtifactCard
      title="what the engines actually said"
      meta="chosen by a fixed rule"
      footer={SAMPLE_LABEL}
    >
      <ul className="px-5 pb-5 pt-[18px]">
        {SAMPLE_EXCERPTS.map((excerpt) => (
          <li key={excerpt.rule} className="border-t border-line py-4 first:border-t-0 first:pt-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-[14.5px] font-semibold text-ink">{excerpt.rule}</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                {`${excerpt.engine} · ${excerpt.run}`}
              </p>
            </div>
            <p className="mt-1 text-[13px] text-ink-faint">
              {`“${excerpt.question}” · ${excerpt.type}`}
            </p>
            <blockquote className="mt-3 border-l-2 border-track pl-4 text-[14.5px] leading-[1.6] text-ink-soft">
              {`“${excerpt.text}”`}
            </blockquote>
            <p className="mt-2.5 text-[13px] text-ink-faint">
              {`${excerpt.note} Cited: ${excerpt.cited}`}
            </p>
          </li>
        ))}
      </ul>
    </ArtifactCard>
  );
}

/** Appendix one: every domain, so a claim about sources can be checked. */
export function LedgerCard() {
  return (
    <ArtifactCard
      title="citation ledger"
      meta={`top ${SAMPLE_CITATIONS.top.length} of ${SAMPLE_CITATIONS.domains}`}
      footer={SAMPLE_LABEL}
    >
      <div className="overflow-x-auto px-5 pb-5 pt-[22px]">
        <table className="w-full min-w-[420px] border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-ink text-[11px] uppercase tracking-[0.1em] text-ink-faint">
              <th scope="col" className="py-2 pr-3 text-left font-normal">
                Domain
              </th>
              <th scope="col" className="px-2 py-2 text-left font-normal">
                Type
              </th>
              <th scope="col" className="px-2 py-2 text-right font-normal">
                Citations
              </th>
              <th scope="col" className="px-2 py-2 text-right font-normal">
                Answers
              </th>
              <th scope="col" className="py-2 pl-2 text-right font-normal">
                Share
              </th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE_CITATIONS.top.map((row) => (
              <tr key={row.domain} className="border-b border-line last:border-b-0">
                <th
                  scope="row"
                  className={`py-2.5 pr-3 text-left ${row.you ? "font-semibold text-ink" : "font-normal text-ink"}`}
                >
                  {row.domain}
                </th>
                <td className="px-2 py-2.5 text-ink-faint">{row.type}</td>
                <td className="px-2 py-2.5 text-right tabular-nums text-ink-soft">
                  {n(row.citations)}
                </td>
                <td className="px-2 py-2.5 text-right tabular-nums text-ink-soft">
                  {n(row.answers)}
                </td>
                <td className="py-2.5 pl-2 text-right tabular-nums text-ink-soft">
                  {`${((row.citations / SAMPLE_CITATIONS.total) * 100).toFixed(1)}%`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ArtifactCard>
  );
}

/** Appendix two: the terms, the window, and what the numbers cannot say. */
export function MethodCard() {
  const rows = [
    { term: "Window", value: SAMPLE_CYCLE.window },
    { term: "Geography", value: SAMPLE_CYCLE.geography },
    { term: "Question set", value: SAMPLE_CYCLE.questionSet },
    {
      term: "Runs",
      value: `${SAMPLE_CYCLE.runs} per question, per engine, so ${n(SAMPLE_CYCLE.answers)} answers`,
    },
    ...SAMPLE_METHOD,
  ];
  return (
    <ArtifactCard title="how this was measured" meta="the appendix" footer={SAMPLE_LABEL}>
      <dl className="px-5 pb-5 pt-[18px]">
        {rows.map((row) => (
          <div
            key={row.term}
            className="grid gap-1 border-t border-line py-3 first:border-t-0 first:pt-0 sm:grid-cols-[132px_minmax(0,1fr)] sm:gap-4"
          >
            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint sm:pt-1">
              {row.term}
            </dt>
            <dd className="text-[14.5px] leading-[1.55] text-ink-soft">{row.value}</dd>
          </div>
        ))}
      </dl>
    </ArtifactCard>
  );
}
