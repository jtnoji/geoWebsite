import type { ReactNode } from "react";
import { FINDING_CHIP, type FindingTone } from "./FindingsPanel";
import {
  SAMPLE_ACCURACY_ERROR,
  SAMPLE_FIXES,
  SAMPLE_LABEL,
  SAMPLE_LOSING_QUERIES,
  SAMPLE_QUESTIONS,
  SAMPLE_RERUN_ROWS,
  SAMPLE_ROWS,
  SAMPLE_RUNS_TOTAL,
  SAMPLE_SOURCES,
  SAMPLE_VERTICAL,
} from "@/lib/sample";

/**
 * The card beside each stage of the /how-it-works console (StageTabs), so the
 * artifact always shows what its stage says (Josh, 2026-09-14): the questions
 * we ask on Measure, what keeps the business out on Diagnose, the fix list on
 * Improve, and the re-run on Track.
 *
 * Server components, and every card is in the exported HTML whichever stage
 * is on show. Every figure and fact comes from lib/sample.ts, the one
 * illustrative scenario the rest of the site shows, and every card carries its
 * label.
 */

function ConsoleCard({
  title,
  meta,
  children,
}: {
  title: string;
  meta: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-[14px] bg-frost text-ink">
      <div className="flex flex-wrap justify-between gap-x-3 gap-y-1 bg-frost-dim px-[22px] py-4 text-[14px] text-ink-soft">
        <span>{title}</span>
        <span className="text-[13.5px]">{meta}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        {children}
        <p className="mt-auto pt-[18px] text-[12.5px] text-ink-faint">{SAMPLE_LABEL}</p>
      </div>
    </div>
  );
}

const pct = (hits: number, of: number) => Math.round((hits / of) * 100);

/** Measure: the questions we ask, and how many times each one runs. */
export function QuestionsCard() {
  const engines = SAMPLE_ROWS.length;
  const runs = SAMPLE_ROWS[0].runs;
  return (
    <ConsoleCard title={`Question set · ${SAMPLE_VERTICAL}`} meta="locked per cycle">
      <ul>
        {SAMPLE_QUESTIONS.map(({ q, tag }) => (
          <li
            key={q}
            className="flex items-baseline justify-between gap-3 border-b border-dashed border-line-dark py-2.5 first:pt-0"
          >
            <span className="min-w-0 text-[14.5px] leading-[1.45] text-ink">{`“${q}”`}</span>
            <span className="shrink-0 rounded-full bg-note-bg px-2.5 py-0.5 font-mono text-[10px] tracking-[0.08em] text-note">
              {tag}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[14px] leading-[1.5] text-ink-soft">
        {"Each question runs "}
        <strong className="font-semibold text-ink">{`${runs} times on ${engines} engines`}</strong>
        {`, so ${runs * engines} answers apiece.`}
      </p>
    </ConsoleCard>
  );
}

/* Every count here is read from lib/sample.ts; the sample report and the
   Judging section on /how-it-works state the same facts. */
const FINDINGS: readonly { label: string; sub: string; value: string; tone: FindingTone }[] = [
  {
    label: "AI crawlers blocked at the firewall",
    sub: "GPTBot and PerplexityBot get challenge pages",
    value: "Blocking",
    tone: "risk",
  },
  {
    label: "Missing from the sources AI cites",
    sub: `Listed on ${SAMPLE_SOURCES.listed} of the ${SAMPLE_SOURCES.cited} the engines use`,
    value: "High",
    tone: "caution",
  },
  {
    label: `No page for ${SAMPLE_LOSING_QUERIES} losing questions`,
    sub: "A competitor's page is quoted instead",
    value: "High",
    tone: "caution",
  },
  {
    label: "An inaccurate answer",
    sub: `ChatGPT ${SAMPLE_ACCURACY_ERROR}`,
    value: "Error",
    tone: "risk",
  },
];

/** Diagnose: what keeps the business out of the answer. */
export function FindingsCard() {
  return (
    <ConsoleCard title="Audit findings" meta={`${FINDINGS.length} open`}>
      <ul className="flex flex-col gap-2">
        {FINDINGS.map((row) => (
          <li
            key={row.label}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[10px] bg-white px-3.5 py-2.5"
          >
            <div className="min-w-0">
              <p className="text-[14.5px] leading-[1.35] text-ink">{row.label}</p>
              <p className="mt-0.5 text-[13px] leading-[1.4] text-ink-faint">{row.sub}</p>
            </div>
            <span
              className={`whitespace-nowrap rounded-full px-3 py-1 text-[12.5px] font-semibold ${FINDING_CHIP[row.tone]}`}
            >
              {row.value}
            </span>
          </li>
        ))}
      </ul>
    </ConsoleCard>
  );
}

/** Improve: the fix list, in the order the evidence ranks it. */
export function FixesCard() {
  return (
    <ConsoleCard title="Roadmap" meta="evidence-ranked">
      <ol className="flex flex-col gap-2">
        {SAMPLE_FIXES.map((item, i) => (
          <li
            key={item.fix}
            className="grid grid-cols-[26px_minmax(0,1fr)_auto] items-center gap-3 rounded-[10px] bg-white px-3.5 py-3"
          >
            <span className="font-mono text-[12px] text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="min-w-0 text-[14.5px] leading-[1.4] text-ink">{item.fix}</p>
            <span className="whitespace-nowrap rounded-full bg-note-bg px-2.5 py-1 text-[12px] font-semibold text-note">
              {item.where}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-[14px] leading-[1.5] text-ink-soft">
        Each one ties back to a finding in the data.
      </p>
    </ConsoleCard>
  );
}

/** Track: the same questions run again, with what moved and what did not. */
export function RerunCard() {
  const before = SAMPLE_RERUN_ROWS.reduce((n, row) => n + row.before, 0);
  const after = SAMPLE_RERUN_ROWS.reduce((n, row) => n + row.after, 0);
  return (
    <ConsoleCard title={`Same ${SAMPLE_RUNS_TOTAL} answers, re-run`} meta="run 1 → run 2">
      <div className="mb-[18px] flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
        <p className="text-[clamp(34px,3.2vw,46px)] font-light leading-none tracking-[-0.04em] text-ink">
          {`${pct(before, SAMPLE_RUNS_TOTAL)}% → ${pct(after, SAMPLE_RUNS_TOTAL)}%`}
        </p>
        <p className="text-[15px] text-ink-soft">
          {"named in "}
          <strong className="font-semibold">
            {`${before} → ${after} of ${SAMPLE_RUNS_TOTAL} answers`}
          </strong>
        </p>
      </div>
      <ul>
        {SAMPLE_RERUN_ROWS.map((row) => (
          <li
            key={row.engine}
            className="grid grid-cols-[88px_minmax(0,1fr)_52px] items-center gap-3.5 py-[7px] sm:grid-cols-[96px_minmax(0,1fr)_52px]"
          >
            <span className="text-[14.5px] text-ink">{row.engine}</span>
            {/* Run one in ink, and what run two added in cobalt on top of it. */}
            <span aria-hidden="true" className="flex h-1 overflow-hidden rounded-full bg-track">
              <span
                className="block h-full bg-ink"
                style={{ width: `${pct(Math.min(row.before, row.after), row.runs)}%` }}
              />
              <span
                className="block h-full bg-cobalt"
                style={{ width: `${pct(Math.max(row.after - row.before, 0), row.runs)}%` }}
              />
            </span>
            <span className="text-right text-[13.5px] text-ink-soft">
              {`${row.before} → ${row.after}`}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[13px] leading-[1.5] text-ink-soft">
        Dark is run one. Blue is what run two added.
      </p>
    </ConsoleCard>
  );
}
