import { SAMPLE_LABEL } from "@/lib/sample";

/**
 * The before/after answer pair: the same question, one business absent and one
 * named. Square-cornered with a blue header bar (the ArtifactCard treatment)
 * rather than the rounded, shadowed product-mockup treatment — the hero answer
 * card is the page's one product mockup and this must not compete with it.
 *
 * The braced tokens are placeholders on purpose: the reader substitutes their
 * own category and city, which is also why the pair carries the illustrative
 * label rather than posing as a captured run.
 */
function Card({
  status,
  named,
  query,
  children,
  sources,
  verdict,
}: {
  status: string;
  named: boolean;
  query: string;
  children: React.ReactNode;
  sources: React.ReactNode;
  verdict: string;
}) {
  return (
    <div
      className={`surface surface-soft flex flex-col border bg-white ${
        named ? "border-ink" : "border-line-dark"
      }`}
    >
      <div className="flex justify-between gap-3 bg-ink px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.06em] text-white">
        <span>{status}</span>
        <span className={named ? "text-white/85" : "text-white/45"}>run 4/10</span>
      </div>
      <div className="flex flex-1 flex-col gap-4 px-[22px] pb-6 pt-[22px]">
        <p className="text-[12.5px] text-ink-faint">{query}</p>
        <p className="text-[15px] leading-[1.65] text-ink-soft">{children}</p>
        <div className="border-t border-line pt-4">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            Sources cited
          </p>
          <p className="mt-2 text-[13px] text-ink-soft">{sources}</p>
        </div>
        <div
          className={`mt-auto inline-flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium ${
            named ? "bg-ink text-white" : "bg-paper-dim text-bad"
          }`}
        >
          {/* Presence is a filled dot on a navy fill; absence is a hollow ring
              on paper. This palette carries loss with tone and shape, never a
              second hue — see the --color-bad note in globals.css. */}
          <span
            aria-hidden="true"
            className={`h-2 w-2 rounded-full ${
              named ? "bg-white" : "border border-bad"
            }`}
          />
          {verdict}
        </div>
      </div>
    </div>
  );
}

export default function AnswerCompare() {
  return (
    <>
      <div className="grid gap-7 md:grid-cols-2">
        <Card
          status="Not cited"
          named={false}
          query="&ldquo;best {your category} near me&rdquo;"
          sources="reviewsite.com · citylist.com · competitora.com"
          verdict="Your business: not mentioned"
        >
          Based on reviews and reputation, I&rsquo;d recommend{" "}
          <b className="font-semibold text-ink">Competitor A</b>,{" "}
          <b className="font-semibold text-ink">Competitor B</b>, or{" "}
          <b className="font-semibold text-ink">Competitor C</b>. All three are
          well reviewed for residential work in the area&hellip;
        </Card>
        <Card
          status="Cited and named first"
          named
          query="&ldquo;best {your category} near me&rdquo; · identical query"
          sources={
            <>
              <b className="font-semibold text-ink">yourdomain.com</b> ·
              reviewsite.com · industrypub.com
            </>
          }
          verdict="Named in 7 of 10 runs"
        >
          For {"{category}"} in {"{city}"} I&rsquo;d suggest{" "}
          <b className="border-b-2 border-ink font-semibold text-ink">
            Your Business
          </b>
          , known for {"{specialization}"}, along with{" "}
          <b className="font-semibold text-ink">Competitor A</b>. Your Business
          is noted for {"{the specific thing your pages say}"}&hellip;
        </Card>
      </div>
      <p className="mx-auto mt-8 max-w-[720px] border border-line-dark bg-white px-7 py-6 text-center text-base leading-[1.65] text-ink-soft">
        The business on the right is not ranking for more keywords. It is{" "}
        <b className="font-semibold text-ink">
          appearing in more of the places the decision gets made
        </b>
        , and the difference is measurable, repeatable, and mostly structural.
      </p>
      <p className="mt-3.5 text-center font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-faint">
        {SAMPLE_LABEL} · braces stand for your category, city, and
        specialization
      </p>
    </>
  );
}
