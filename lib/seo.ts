import type { Metadata } from "next";
import { BRAND } from "@/lib/site";

/**
 * One builder for a page's title, description, canonical and social cards.
 *
 * WHY IT HAS TO EXIST, and why you must not hand-write `openGraph` on a page.
 * Next merges the `openGraph` key SHALLOWLY: a page that declares it replaces
 * the root's outright. Measured 2026-08-04 by adding `openGraph: { url }` to
 * /pricing alone, which silently dropped og:site_name, og:type AND og:image,
 * and downgraded twitter:card from `summary_large_image` to `summary` with no
 * twitter:image at all. Every link to that page would have previewed as a bare
 * text row on both networks, and nothing in the build would have said so.
 *
 * So the rule is: pages call this, pass their path once, and get the whole
 * block. The canonical and og:url come from the same argument and therefore
 * cannot disagree. `tests/geo.spec.ts` asserts that on every page.
 *
 * The image is referenced by its static path rather than by Next's
 * file-convention URL. The convention appends a cache-busting query
 * (`?opengraph-image=<hash>`) that only exists while Next owns the tag; once a
 * page overrides `openGraph` that hash is not available to us, and the export
 * writes the file to /opengraph-image.png regardless. Verified present in
 * out/ after every build.
 *
 * REGENERATE THE IMAGE WHEN THE BRAND CHANGES: scripts/make-brand-assets.py,
 * per CLAUDE.md. Nothing here can tell that it is stale.
 */

const OG_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  type: "image/png",
} as const;

export function pageMeta({
  title,
  description,
  path,
  /** Home only: the title stands alone rather than taking the `%s · Sable` template. */
  absoluteTitle = false,
  extraAlternates,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  extraAlternates?: Metadata["alternates"];
}): Metadata {
  /* What the templated <title> resolves to. og:title and twitter:title have to
     be given it explicitly: once a page declares openGraph, Next stops
     deriving them from the title template. */
  const social = absoluteTitle ? title : `${title} · ${BRAND}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path, ...extraAlternates },
    openGraph: {
      title: social,
      description,
      url: path,
      siteName: BRAND,
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: social,
      description,
      images: [OG_IMAGE],
    },
  };
}
