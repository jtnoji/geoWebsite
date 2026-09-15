import type { Metadata } from "next";
import Link from "next/link";
import Cta from "@/components/Cta";
import PageSchema from "@/components/PageSchema";
import { getAllArticles } from "@/lib/articles";
import { HEAD_SPLIT, SECTION } from "@/lib/layout";
import { delay } from "@/lib/reveal";
import { crumb } from "@/lib/schema";
import { BRAND } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Learn: plain answers about AI search",
  description:
    "What GEO is, why ChatGPT doesn't mention your business, which sources AI engines cite, and what changed since traditional SEO.",
  path: "/learn/",
  // Feed discovery. `alternates` is replaced wholesale by a page-level export,
  // not deep-merged, so the feed link rides along with the canonical rather
  // than being declared separately.
  extraAlternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: `${BRAND} · Learn` }],
    },
  },
});

export default function Learn() {
  const articles = getAllArticles();

  return (
    <>
      {/* CollectionPage, not WebPage: this route's content IS the list. */}
      <PageSchema
        meta={metadata}
        path="/learn/"
        type="CollectionPage"
        trail={[crumb("/learn/")]}
      />

      {/* Full width like every page (lib/layout.ts): the head splits from
          1600px, and the articles lay out as a grid that fills the row, one to
          three across, each still reading down its own left edge. */}
      <div className={SECTION}>
        <div className={HEAD_SPLIT}>
          <h1
            data-reveal
            className="display text-[clamp(34px,4.4vw,96px)] leading-[1.05] text-ink"
          >
            Learn
          </h1>
          <p
            data-reveal
            style={delay(100)}
            className="max-w-[52ch] text-[clamp(16px,1.111vw,20px)] leading-[1.7] text-ink-soft"
          >
            Plain answers to the questions business owners ask about AI search.
            Each article opens with the answer.
          </p>
        </div>

        <ul className="mt-12 grid gap-x-10 md:grid-cols-2 wide:grid-cols-3 wide:gap-x-16">
          {articles.map((article, i) => (
            <li
              key={article.slug}
              data-reveal
              style={delay((i % 3) * 90)}
              className="border-t border-line-dark"
            >
              <Link href={`/learn/${article.slug}/`} className="group block py-7">
                <h2 className="display max-w-[28ch] text-[clamp(22px,1.528vw,30px)] leading-[1.25] text-ink">
                  {article.title}
                </h2>
                <p className="mt-2 max-w-[60ch] text-[clamp(15px,1.042vw,18px)] leading-[1.65] text-ink-soft">
                  {article.description}
                </p>
                <span className="mt-3 inline-block text-[15px] font-medium text-ink transition-colors group-hover:text-accent">
                  Read the answer →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Cta />
    </>
  );
}
