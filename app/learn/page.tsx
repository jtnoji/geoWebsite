import type { Metadata } from "next";
import Link from "next/link";
import Cta from "@/components/Cta";
import PageSchema from "@/components/PageSchema";
import { getAllArticles } from "@/lib/articles";
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

      {/* Left-aligned head and list, like every page in the Sable design: the
          titles and descriptions scan down a single edge. */}
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 md:py-20">
        <div data-reveal>
          <h1 className="display text-[clamp(34px,4.4vw,58px)] leading-[1.05] text-ink">
            Learn
          </h1>
          <p className="mt-5 max-w-[52ch] text-[16px] leading-[1.7] text-ink-soft">
            Plain answers to the questions business owners ask about AI search.
            Each article opens with the answer.
          </p>
        </div>

        <ul className="mt-12">
          {articles.map((article, i) => (
            <li
              key={article.slug}
              data-reveal
              style={delay(i * 90)}
              className="border-t border-line-dark"
            >
              <Link href={`/learn/${article.slug}/`} className="group block py-7">
                <h2 className="display text-[22px] leading-[1.25] text-ink">
                  {article.title}
                </h2>
                <p className="mt-2 text-[15px] leading-[1.65] text-ink-soft">
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
