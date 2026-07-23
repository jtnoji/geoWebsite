import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomBar from "@/components/BottomBar";
import JsonLd from "@/components/JsonLd";
import ScrollReveal from "@/components/ScrollReveal";
import { org, professionalService } from "@/lib/schema";
import { BRAND, DOMAIN, TAGLINE } from "@/lib/site";

// Self-hosted at build time by next/font — no external CDN request, so the
// static export stays self-contained. Poppins has no weight above 700.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: `${BRAND} — ${TAGLINE}`,
    template: `%s — ${BRAND}`,
  },
  description:
    "We measure whether ChatGPT, Google AI, Gemini, and Perplexity mention your business — sampled rates, named competitors, and the sources behind the answers.",
  openGraph: {
    siteName: BRAND,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
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
        <JsonLd data={org()} />
        <JsonLd data={professionalService()} />
        <ScrollReveal />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomBar />
      </body>
    </html>
  );
}
