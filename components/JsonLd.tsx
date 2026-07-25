/**
 * Renders a JSON-LD block from a server component into the raw HTML.
 *
 * `<` is escaped to its < JSON escape (still valid JSON, byte-identical
 * meaning to a parser). Without it, any schema value containing the literal
 * text `</script>` would close this element early and everything after it
 * would parse as HTML — the standard JSON-in-HTML injection. Most fields here
 * are constants from lib/site.ts, but article titles and descriptions come
 * from markdown frontmatter in content/learn, so the sink is reachable by
 * anyone who can add a file there.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
