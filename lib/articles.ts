import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Marked } from "marked";

/**
 * Build-time markdown loader for /learn. Runs only in server components /
 * generateStaticParams, so everything lands in the exported HTML.
 */

const ARTICLES_DIR = path.join(process.cwd(), "content", "learn");

/**
 * SECURITY: `content/learn/*.md` is production copy served to GPTBot,
 * ClaudeBot, PerplexityBot and CCBot, and anyone who can land a PR can edit it.
 * `marked` does NOT sanitize — by default it passes raw HTML straight through,
 * so a `<div style="position:absolute;left:-9999px">` in an article would be
 * invisible in review and in the browser, and fully readable by every crawler
 * we invite. That is the exact prompt-injection defect we would flag in a
 * client's audit, so the renderer below closes it at the boundary:
 *
 * - `html: () => ""` drops every raw HTML token, block and inline. Inline text
 *   inside a dropped tag survives as plain text, so nothing legitimate is lost.
 * - link/image hrefs must be http(s), mailto, root-relative or a fragment.
 *   `javascript:` and `data:text/html` degrade to plain text rather than
 *   rendering an active link.
 *
 * Everything markdown itself produces (headings, lists, emphasis, code, links)
 * is untouched. Enforced by the hidden-text gate in tests/geo.spec.ts.
 */
const SAFE_HREF = /^(https?:\/\/|mailto:|\/|#)/i;

const escapeAttr = (s: string) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const md = new Marked({
  renderer: {
    html: () => "",
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      if (!SAFE_HREF.test(href ?? "")) return text;
      // External citations open in a new tab; internal links stay same-tab.
      const external = /^https?:\/\//i.test(href);
      return (
        `<a href="${escapeAttr(href)}"` +
        (title ? ` title="${escapeAttr(title)}"` : "") +
        (external ? ` target="_blank" rel="noopener noreferrer"` : "") +
        `>${text}</a>`
      );
    },
    image({ href, title, text }) {
      if (!SAFE_HREF.test(href ?? "")) return escapeAttr(text ?? "");
      return (
        `<img src="${escapeAttr(href)}" alt="${escapeAttr(text ?? "")}"` +
        (title ? ` title="${escapeAttr(title)}"` : "") +
        `/>`
      );
    },
  },
});

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd (treated as "last updated")
  author: string;
};

export function getArticleSlugs(): string[] {
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getArticleMeta(slug: string): ArticleMeta {
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, `${slug}.md`), "utf8");
  const { data } = matter(raw);
  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    author: data.author,
  };
}

export function getAllArticles(): ArticleMeta[] {
  return getArticleSlugs()
    .map(getArticleMeta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticleHtml(slug: string): { meta: ArticleMeta; html: string } {
  const raw = fs.readFileSync(path.join(ARTICLES_DIR, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);
  const html = md.parse(content, { async: false }) as string;
  return {
    meta: {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      author: data.author,
    },
    html,
  };
}
