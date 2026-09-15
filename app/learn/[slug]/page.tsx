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
import { SECTION } from "@/lib/layout";
import { delay } from "@/lib/reveal";
import { BRAND } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

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
  const base = pageMeta({
    title: meta.title,
    description: meta.description,
    path: `/learn/${meta.slug}/`,
    extraAlternates: {
      types: {
        "application/rss+xml": [{ url: "/feed.xml", title: `${BRAND} · Learn` }],
      },
    },
  });
  /* Articles are `article`, not `website`: it is the one og:type distinction
     on this site that a social scraper acts on. */
  return { ...base, openGraph: { ...base.openGraph, type: "article" } };
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

      {/* Full width like every page (lib/layout.ts). From lg the title column
          sits beside the article and stays in view while it scrolls, so the
          page spans the screen while the body keeps a readable line length:
          prose stretched across a wide row is harder to read, not easier. */}
      <div
        className={`${SECTION} grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16 wide:gap-24`}
      >
        <div className="min-w-0 lg:sticky lg:top-[104px] lg:self-start">
          <Link
            href="/learn/"
            className="text-sm font-semibold text-ink hover:text-accent"
          >
            ← All articles
          </Link>
          <div data-reveal>
            <h1 className="display mt-4 text-[clamp(34px,3.2vw,64px)] leading-[1.1] text-ink text-pretty">
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
        </div>
        {/* The article body reveals as one block. Its HTML comes from
            lib/articles.ts, so there are no per-element hooks to stagger, and
            fading paragraphs in one by one would fight the act of reading.
            The attribute goes on a WRAPPER, never on .article itself: the
            raw-HTML test in geo.spec.ts locates the body with
            /<div class="article[^"]*">/ and asserts the markup inside carries
            no class= or style=. Extra attributes on that div break the match
            and silently blind a security check on untrusted markdown. The
            wrapper must hold the .article div and nothing else, because the
            same test ends the body at the first `</div></div>`. */}
        <div data-reveal style={delay(110)} className="min-w-0">
          <div
            className="article max-w-[72ch]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      <Cta />
    </>
  );
}
