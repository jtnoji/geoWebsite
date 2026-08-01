import type { Metadata } from "next";
import Link from "next/link";
import Cta from "@/components/Cta";
import PageSchema from "@/components/PageSchema";
import { getAllArticles } from "@/lib/articles";
import { delay } from "@/lib/reveal";
import { crumb } from "@/lib/schema";
import { BRAND } from "@/lib/site";

export const metadata: Metadata = {
  title: "Learn: plain answers about AI search",
  description:
    "What GEO is, why ChatGPT doesn't mention your business, which sources AI engines cite, and what changed since traditional SEO.",
  alternates: {
    canonical: "/learn/",
    // Feed discovery. `alternates` is replaced wholesale by a page-level
    // export, not deep-merged, so the canonical and the feed link have to be
    // declared together here rather than split across layout and page.
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: `${BRAND} · Learn` }],
    },
  },
};

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

      <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 md:py-20">
        {/* Head centres; the article list below stays left-aligned so the
            titles and descriptions scan down a single edge. */}
        <div data-reveal className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-ink">Learn</h1>
          <p className="mt-5 text-base leading-7 text-ink-soft">
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
                <h2 className="text-xl font-bold tracking-tight text-ink">
                  {article.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {article.description}
                </p>
                <span className="mt-3 inline-block text-sm font-semibold text-ink group-hover:text-accent">
                  Read the answer →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Cta centered />
    </>
  );
}
