import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomBar from "@/components/BottomBar";
import JsonLd from "@/components/JsonLd";
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
        <JsonLd data={org()} />
        <JsonLd data={professionalService()} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomBar />
      </body>
    </html>
  );
}
