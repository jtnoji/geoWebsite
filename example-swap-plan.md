# Example-Swap Plan — plumber → B2B marketing agency

Status: **APPLIED 2026-07-22** (Josh approved). Names below are the FINAL cast
after the collision check; delete this file once the build gate passes. Background: research/brainstorm in the session notes — the
agency example is more relatable across the audience-general site, the query
space demonstrably exists (agencies write "best AI agency" listicles that ARE
the citation battleground), and agencies are plausible future channel
partners. Delete this file when fully applied and verified.

## 0 · The scenario (single source of truth for the swap)

- **Fictional client:** Bluequarry Growth — a B2B marketing agency for
  seed-stage startups, Oakland, CA.
- **Fictional competitors named in answers:** Saltgrass Digital, Fathom &
  Reed, Pinelock Marketing.
- **Signature query:** `best b2b marketing agency for seed-stage startups`
- **PRE-FLIGHT: DONE** — web-searched 2026-07-22; no real agencies found under
  any of the four names (first candidate "Harborlight" collided and was
  replaced). Names must stay obviously invented; never use real agencies
  (legal posture: we put words in ChatGPT's mouth about these companies).
- **Numbers do NOT change.** SAMPLE_ROWS (2/0/3/1, competitor 8), n=32,
  "run 3/10", SAMPLE_LABEL, and every rate stay exactly as-is — this swap
  changes the story's costume, not its data, so no page can drift.
- **Real cited statistics are NOT examples.** The Yelp/local citation stats in
  the Learn articles and the stat tiles stay untouched — they're evidence,
  not scenario.

## 1 · lib/sample.ts (drives home, how-it-works, sample-report automatically)

- `SAMPLE_QUERY` → `"best b2b marketing agency for seed-stage startups"`
- Add to the same file (new consts, so future swaps stay one-file):
  `SAMPLE_CLIENT = "Bluequarry Growth"`,
  `SAMPLE_COMPETITORS = ["Saltgrass Digital", "Fathom & Reed", "Pinelock Marketing"]`,
  `SAMPLE_VERTICAL = "b2b marketing agency"`.
- Header comment: note the scenario + the no-real-names rule.

## 2 · app/page.tsx

- Hero answer card header: `chatgpt · "best b2b marketing agency for
  seed-stage startups"` (keep `run 3/10`).
- Answer body →: "For a seed-stage B2B startup, I'd look at
  **Saltgrass Digital**, **Fathom & Reed**, or **Pinelock Marketing**. All
  three have strong track records with early-stage companies…" (competitor
  names from SAMPLE_COMPETITORS, bolded as today).
- "Your business: not mentioned" callout — unchanged.
- "The shortlist got smaller" paragraph: swap the two example queries to
  `"best marketing agency for startups"` and keep `"which budgeting app
  should I use"` (second example preserves the audience-general signal).

## 3 · app/how-it-works/page.tsx

- ArtifactCard title: `query set: plumbing, berkeley` → `query set: b2b
  marketing agency` (keep `v1 · locked`).
- QUERY_CARD rows + tags — align tags with the roadmap's intent buckets
  (category / cost / comparison / brand):
  1. `"best b2b marketing agency for seed-stage startups"` · category
  2. `"how much should a startup spend on a marketing agency"` · cost
  3. `"marketing agency vs making your first marketing hire"` · comparison
  4. `"is [agency] worth it for a seed-stage company"` · brand
- Judge-verdict artifact (keep structure; swap the finding):
  - presence: "Mentioned, 2nd of 3 agencies named" (was businesses)
  - prominence: unchanged
  - accuracy: "1 error: answer says they only run paid ads; they run
    full-funnel including SEO and lifecycle" with flag chip
    `missing_or_invented_feature · high` (a real AccuracyFlagType from the
    judge — keeps site vocabulary aligned with the platform).
- §1 SECTIONS answer: "cost, comparison, \"is this business legit\"" →
  "cost, comparison, \"is this agency worth it\"" (keeps schema/visible sync —
  both render from SECTIONS).

## 4 · components/ReportPreview.tsx (feeds /sample-report)

- VerbatimCard body: "For a seed-stage B2B startup, well-regarded agencies
  include **Saltgrass Digital** and **Fathom & Reed**…" (title picks up
  SAMPLE_QUERY automatically). Keep "The client was not mentioned."
- SOURCE_CHECKS row 2: `Listed on the sources AI cites — "2 of 6
  directories"` → `"2 of 6 best-agency lists"` (agency battleground is
  listicles/directories like Clutch, not local directories).

## 5 · app/sample-report/page.tsx

- Intro: "a fictional Berkeley plumbing company" → "a fictional B2B marketing
  agency" (keep the honesty sentence verbatim).
- FIX_LIST item 2: "Get listed on the 4 missing directories AI actually
  cites" → "Get onto the 4 missing best-agency lists AI actually cites";
  its `why` → "The engines cited the same 6 lists across runs; the client
  appears on 2 of them."
- FIX_LIST items 1 and 3 unchanged (crawler unblocking + answer-first pages
  are vertical-neutral).

## 6 · components/FreeCheckForm.tsx (placeholders = what a visitor might type)

- business: `Acme Plumbing` → `Bluequarry Growth`
- website: `https://acmeplumbing.com` → `https://bluequarrygrowth.com`
- area: keep `Berkeley, CA` (grounds the NAP story locally; agency can be
  local too)
- description: `Residential plumbing: repairs, water heaters, repiping.` →
  `B2B marketing for seed-stage startups: positioning, content, demand gen.`
- ALTERNATIVE (founder call): keep the form placeholders on a *different*
  vertical than the hero to signal breadth. Default: match the agency.

## 7 · content/learn/why-doesnt-chatgpt-mention-my-business.md

- One sentence: `When an engine answers "best plumber in Berkeley"` →
  `When an engine answers "best marketing agency for startups"` (rest of the
  paragraph unchanged; the article's real citation stats stay).
- No other Learn article contains scenario copy — do not touch their real
  cited statistics (Yelp 3.4×, Reddit 21%, etc.).

## 8 · tests/funnel.spec.ts

- Form-fill fixture: description value → the new placeholder text (test is
  value-agnostic but keep fixtures on-scenario).
- Sweep `tests/pages.ts` for any asserted sample strings ("plumber",
  "Apex") and update to the new scenario strings.

## 9 · Validation gate (after applying)

1. `grep -ri "plumb\|Apex\|BayFlow\|Hartley\|Acme" app components lib content tests`
   → zero hits outside code comments.
2. `npm run build && npx playwright test && npm run lint` — green.
3. Visual pass on home + how-it-works + sample-report screenshots: answer
   card, query card, judge verdict all tell the agency story; numbers
   unchanged everywhere (2/10 callout, 8/10 competitor, n=32).
4. Live-site spot check after deploy: hero card + /sample-report intro.

## Open items before applying

- [ ] Founder sign-off on the scenario (Josh + Abhi)
- [ ] Name check: no real "Saltgrass Digital" / "Fathom & Reed" /
      "Pinelock Marketing" / "Bluequarry Growth" agencies of note (rename on
      collision)
- [ ] Decision: form placeholders match the agency (default) or stay on a
      second vertical for breadth
