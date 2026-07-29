import type { Metadata } from "next";
import Link from "next/link";
import Cta from "@/components/Cta";
import JsonLd from "@/components/JsonLd";
import { article } from "@/lib/schema";
import { getArticleHtml, getArticleSlugs } from "@/lib/articles";
import { delay } from "@/lib/reveal";

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = getArticleHtml(slug);
  return { title: meta.title, description: meta.description };
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
      <JsonLd
        data={article({
          title: meta.title,
          description: meta.description,
          slug: meta.slug,
          datePublished: meta.date,
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
          <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight text-ink">
            {meta.title}
          </h1>
          <p className="mt-3 text-sm text-ink-faint">
            <time dateTime={meta.date}>{meta.date}</time>
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
