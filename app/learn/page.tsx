import type { Metadata } from "next";
import Link from "next/link";
import Cta from "@/components/Cta";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Learn: plain answers about AI search visibility",
  description:
    "What GEO is, why ChatGPT doesn't mention your business, which sources AI engines cite, and what actually changed since traditional SEO.",
};

export default function Learn() {
  const articles = getAllArticles();

  return (
    <>
      <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 md:py-20">
        <h1 className="text-4xl font-bold tracking-tight text-ink">Learn</h1>
        <p className="mt-5 text-base leading-7 text-ink-soft">
          Plain answers to the questions business owners actually ask about AI
          search. Each article opens with the answer, not a wind-up.
        </p>

        <ul className="mt-12">
          {articles.map((article) => (
            <li key={article.slug} className="border-t border-line-dark">
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

      <Cta />
    </>
  );
}
