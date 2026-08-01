import type { Metadata } from "next";
import JsonLd from "./JsonLd";
import { breadcrumbs, webPage, type Crumb, type PageType } from "@/lib/schema";

/**
 * The per-page WebPage node, plus its BreadcrumbList.
 *
 * WHY IT TAKES THE `metadata` OBJECT. The site's rule is that schema can never
 * drift from visible text, enforced by feeding both from one data structure
 * (the FaqSection pattern). A WebPage node's `name` and `description` are the
 * page's title and meta description, so this component is handed the page's own
 * `export const metadata` rather than a second copy of those strings. Passing
 * literals here would reintroduce exactly the drift the rule exists to stop.
 *
 * `name` is the page title WITHOUT the ` · [Brand]` suffix that layout.tsx's
 * title template appends. That suffix is a browser-tab affordance, not part of
 * the page's name, and metadata.title is the string the page actually declares.
 */

function resolveTitle(title: Metadata["title"]): string {
  if (typeof title === "string") return title;
  if (title && typeof title === "object") {
    if ("absolute" in title && typeof title.absolute === "string") {
      return title.absolute;
    }
    if ("default" in title && typeof title.default === "string") {
      return title.default;
    }
  }
  return "";
}

export default function PageSchema({
  meta,
  path,
  type,
  trail = [],
}: {
  meta: Metadata;
  /** Canonical path, with the trailing slash, e.g. "/pricing/". */
  path: string;
  type?: PageType;
  /** Rungs BELOW Home. Empty on the home page, which needs no breadcrumb. */
  trail?: readonly Crumb[];
}) {
  const name = resolveTitle(meta.title);
  const description = typeof meta.description === "string" ? meta.description : "";

  return (
    <>
      <JsonLd data={webPage({ name, description, path, type })} />
      {trail.length > 0 ? <JsonLd data={breadcrumbs(trail)} /> : null}
    </>
  );
}
