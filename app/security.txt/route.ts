import { DOMAIN, EMAIL } from "@/lib/site";

export const dynamic = "force-static";

/**
 * RFC 9116 disclosure contact. A Route Handler (not a file in `public/`) so the
 * address and domain come from lib/site.ts like everything else — the launch
 * swap stays a one-file change.
 *
 * `scripts/harden-export.mjs` mirrors the built file to /.well-known/security.txt,
 * which is the canonical location; this path is the RFC's legacy fallback.
 *
 * Expires is deliberately short (RFC 9116 §2.5.5 recommends < 1 year): a stale
 * file is worse than none, so this should be bumped whenever the contact is
 * reviewed. tests/security.spec.ts fails once it is in the past.
 */
const EXPIRES = "2027-07-25T00:00:00.000Z";

export function GET() {
  const body = [
    `Contact: mailto:${EMAIL}`,
    `Expires: ${EXPIRES}`,
    `Canonical: ${DOMAIN}/.well-known/security.txt`,
    "Preferred-Languages: en",
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
