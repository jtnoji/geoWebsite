import type { Metadata } from "next";
import Link from "next/link";
import Cta from "@/components/Cta";
import JsonLd from "@/components/JsonLd";
import PageSchema from "@/components/PageSchema";
import { article, crumb } from "@/lib/schema";
import {
  getArticleHtml,
  getArticleSlugs,
  type ArticleMeta,
} from "@/lib/articles";
import { delay } from "@/lib/reveal";
import { BRAND } from "@/lib/site";

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

/**
 * ONE metadata object per article, used by both `generateMetadata` (which fills
 * <title>, the meta description and the canonical) and `PageSchema` (which
 * fills the WebPage node). Building it twice would be a second copy of the
 * title and description, which is the drift this site's schema rule forbids.
 */
function articleMetadata(meta: ArticleMeta): Metadata {
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/learn/${meta.slug}/`,
      types: {
        "application/rss+xml": [{ url: "/feed.xml", title: `${BRAND} · Learn` }],
      },
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = getArticleHtml(slug);
  return articleMetadata(meta);
}

export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { meta, html } = getArticleHtml(slug);

  return (
    <>
      <PageSchema
        meta={articleMetadata(meta)}
        path={`/learn/${meta.slug}/`}
        trail={[crumb("/learn/"), { name: meta.title, path: `/learn/${meta.slug}/` }]}
      />
      <JsonLd
        data={article({
          title: meta.title,
          description: meta.description,
          slug: meta.slug,
          datePublished: meta.date,
          author: meta.author,
        })}
      />

      <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 md:py-20">
        <Link
          href="/learn/"
          className="text-sm font-semibold text-ink hover:text-accent"
        >
          ← All articles
        </Link>
        <div data-reveal>
          <h1 className="display mt-4 text-4xl font-bold leading-[1.1] tracking-tight text-ink">
            {meta.title}
          </h1>
          {/* The byline is not decoration. The Article JSON-LD credits
              meta.author as a Person, and this site's rule is that schema
              never states what the page does not show. Until 2026-07-31 the
              frontmatter carried an author, the page printed only a date, and
              the schema credited the Organization. All three now agree. */}
          <p className="mt-3 text-sm text-ink-faint">
            <time dateTime={meta.date}>{meta.date}</time> · {meta.author}
          </p>
        </div>
        {/* The article body reveals as one block. Its HTML comes from
            lib/articles.ts, so there are no per-element hooks to stagger, and
            fading paragraphs in one by one would fight the act of reading.
            The attribute goes on a WRAPPER, never on .article itself: the
            raw-HTML test in geo.spec.ts locates the body with
            /<div class="article[^"]*">/ and asserts the markup inside carries
            no class= or style=. Extra attributes on that div break the match
            and silently blind a security check on untrusted markdown. */}
        <div data-reveal style={delay(110)}>
          <div
            className="article mt-8"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      <Cta />
    </>
  );
}
