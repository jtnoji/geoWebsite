import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

/**
 * Build-time markdown loader for /learn. Runs only in server components /
 * generateStaticParams, so everything lands in the exported HTML.
 */

const ARTICLES_DIR = path.join(process.cwd(), "content", "learn");

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO yyyy-mm-dd
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
  const html = marked.parse(content, { async: false });
  return {
    meta: { slug, title: data.title, description: data.description, date: data.date },
    html,
  };
}
