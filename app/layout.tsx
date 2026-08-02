import type { Metadata } from "next";
import { Cormorant_Garamond, Libre_Franklin } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomBar from "@/components/BottomBar";
import JsonLd from "@/components/JsonLd";
import ScrollReveal from "@/components/ScrollReveal";
import { org, professionalService, website } from "@/lib/schema";
import { BRAND, DOMAIN, TAGLINE } from "@/lib/site";

// Self-hosted at build time by next/font — no external CDN request, so the
// static export stays self-contained. A CDN <link> would break that.
//
// Two families, per the Berkeley brand sheet §05: Libre Franklin carries body,
// labels and data; Cormorant Garamond is display only (h1/h2 and editorial
// figures, via the `.display` rule in globals.css). Weights are deliberately
// short — the sheet uses 400/500 throughout and never goes bold, so 600 is
// here only for the few data cells that predate it. Cormorant runs small for
// its point size, hence 300/400 rather than the sans's range.
const franklin = Libre_Franklin({
  variable: "--font-franklin",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: `${BRAND}: ${TAGLINE}`,
    template: `%s · ${BRAND}`,
  },
  description:
    "We measure whether ChatGPT, Google AI, Gemini, and Perplexity mention your business: sampled rates, named competitors, and the sources behind the answers.",
  openGraph: {
    siteName: BRAND,
    type: "website",
  },
  /**
   * Snippet permissions, stated rather than defaulted.
   *
   * Engines cap how much of a page they will quote unless told otherwise, and
   * a company whose product is "get quoted in AI answers" should not be
   * shipping the default cap on its own pages. `-1` means no limit.
   *
   * This is index/follow for the whole site. `app/not-found.tsx` overrides it
   * with noindex, which geo.spec.ts asserts: a dead URL must never compete in
   * search or surface in an AI answer.
   */
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${franklin.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {/* Arms the scroll-reveal hidden state before first paint, so
            above-the-fold sections never flash in at full opacity and then
            drop to hidden on hydration. Synchronous and first in <body> on
            purpose. The failsafe strips the class if ScrollReveal never mounts
            — a JS error must never leave the copy invisible. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var d=document.documentElement;d.classList.add('js-reveal');" +
              "window.__revealFailsafe=setTimeout(function(){d.classList.remove('js-reveal')},2500)})()",
          }}
        />
        {/* The three site-wide entity nodes, @id-linked: WebSite is published
            by Organization, and ProfessionalService names Organization as its
            parent. Per-page WebPage nodes hang off SITE_ID from PageSchema. */}
        <JsonLd data={org()} />
        <JsonLd data={website()} />
        <JsonLd data={professionalService()} />
        <ScrollReveal />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomBar />
        {/* Vercel Web Analytics. Cookieless and first-party: the script and the
            beacon both live under /_vercel/insights on our own origin, so the
            CSP's `script-src 'self'` and `connect-src 'self'` already cover it
            and no directive changes.

            It measures HUMANS ONLY. It is a JS beacon, and AI crawlers do not
            execute JavaScript (Vercel + MERJ, 500M GPTBot fetches, zero JS
            executions — cited in content/learn/is-your-website-invisible-to-ai-crawlers.md).
            So this answers "did visitors convert", never "is GPTBot fetching
            us". That second question needs request logs, not a beacon.

            Gated on VERCEL, which only Vercel's builder sets. /_vercel/insights
            exists solely on Vercel's edge, so in a local build the script 404s
            on every page load: it took the Playwright suite from 44s to 11
            minutes of waiting on a request that can never succeed, and a gate
            that slow is a gate people stop running. Production is unaffected;
            the branch resolves at build time, so nothing ships to decide it. */}
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
