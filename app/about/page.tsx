import type { Metadata } from "next";
import Link from "next/link";
import Beams from "@/components/Beams";
import Cta from "@/components/Cta";
import Eyebrow from "@/components/Eyebrow";
import JsonLd from "@/components/JsonLd";
import PageSchema from "@/components/PageSchema";
import { HEAD_SPLIT, SECTION, SECTION_X } from "@/lib/layout";
import { delay } from "@/lib/reveal";
import { crumb, person } from "@/lib/schema";
import { BRAND, EMAIL, FOUNDERS, NAP } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "About: two founders measuring, not guessing",
  description:
    "Abhi built the measurement platform. Josh works with every client. Berkeley, CA. We measure, we do the work, and we sell no guarantees.",
  path: "/about/",
});

/**
 * Rebuilt 2026-09-14 from the Sable design (mockup/sable-site.dc.html): a dark
 * hero with the story on the left and a booking panel on the right.
 *
 * THE DESIGN'S PANEL WAS A FORM (name, work email, domain, goal). Nothing on
 * the backend accepts one, and a form that swallows submissions is worse than
 * no form, so it is a panel that sends people to /contact instead (Josh). The
 * lead path is untouched.
 *
 * The founders section below is kept from the previous page, because the two
 * Person nodes above must describe people the page visibly shows.
 */
export default function About() {
  return (
    <>
      <PageSchema
        meta={metadata}
        path="/about/"
        type="AboutPage"
        trail={[crumb("/about/")]}
      />
      {FOUNDERS.map((f) => (
        <JsonLd key={f.name} data={person(f)} />
      ))}

      <section data-hero="dark" className="relative overflow-hidden bg-night text-white">
        <Beams variant="page" />
        <div
          className={`relative ${SECTION_X} grid items-start gap-14 pb-20 pt-32 md:pb-[110px] md:pt-[150px] lg:grid-cols-2 wide:gap-24`}
        >
          {/* The copy cascades in, then lifts away and dims as the hero
              scrolls off (`hero-copy`, globals.css "Scroll depth"). */}
          <div data-reveal="stagger" className="hero-copy min-w-0">
            <Eyebrow onDark>About</Eyebrow>
            <h1 className="display mt-6 max-w-[16ch] text-[clamp(38px,4.8vw,104px)] leading-[1.04] text-white text-pretty">
              {"We measure first, "}
              <span className="text-sky">then we do the work</span>
            </h1>
            <p className="mt-6 max-w-[50ch] text-[clamp(16px,1.111vw,20px)] leading-[1.7] text-white/88">
              {BRAND} is a small team working on one problem: getting businesses
              named in the answers their customers read. We run the same query
              set every month, publish what moved, and implement the fixes
              ourselves when you want us to.
            </p>
            <p className="mt-5 max-w-[50ch] text-[clamp(16px,1.111vw,20px)] leading-[1.7] text-white/88">
              We ran the audit on{" "}
              <Link
                href="/our-score/"
                className="border-b border-white/40 transition-colors hover:border-white"
              >
                our own site
              </Link>{" "}
              before we sold it to anyone.
            </p>
            <div className="mt-8 flex flex-col items-start gap-2.5">
              <a
                href={`mailto:${EMAIL}`}
                className="text-[clamp(16px,1.111vw,20px)] text-white transition-colors hover:text-sky"
              >
                {EMAIL}
              </a>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/70">
                Now booking our first implementation clients
              </p>
            </div>
          </div>

          <div
            data-reveal="scale"
            style={delay(120)}
            className="min-w-0 rounded-2xl bg-frost p-7 text-ink sm:p-8 wide:p-10"
          >
            <h2 className="text-[20px] font-medium text-ink">Book a call</h2>
            <p className="mt-3 text-[15px] leading-[1.65] text-ink-soft">
              The fastest route is a 20-minute call with Josh. No deck, just
              your questions and, if you&rsquo;ve run the free AI visibility
              check, your numbers.
            </p>
            <dl className="mt-6 flex flex-col gap-[18px]">
              <div>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-faint">
                  Email
                </dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${EMAIL}`}
                    className="text-[15px] text-ink transition-colors hover:text-accent"
                  >
                    {EMAIL}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-faint">
                  Based in
                </dt>
                <dd className="mt-2 text-[15px] text-ink">
                  {NAP.city}, {NAP.region}
                </dd>
              </div>
            </dl>
            <Link
              href="/contact/"
              className="btn btn-mono btn-cobalt mt-7 w-full py-[15px] text-[11.5px]"
            >
              {"Book a call "}
              <span aria-hidden="true">→</span>
            </Link>
            <p className="mt-3 text-center text-[13px] text-ink-faint">
              We reply within one business day.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className={SECTION}>
          <div className={HEAD_SPLIT}>
            <div data-reveal className="min-w-0">
              <Eyebrow>The founders</Eyebrow>
              <h2 className="display mt-6 max-w-[26ch] text-[clamp(30px,3.6vw,76px)] leading-[1.08] text-ink text-pretty">
                Two founders, measuring the thing everyone else is guessing
                about. Then doing something about it.
              </h2>
            </div>
            <p
              data-reveal
              style={delay(100)}
              className="max-w-[56ch] text-[clamp(16px,1.111vw,20px)] leading-[1.7] text-ink-soft"
            >
              We&rsquo;re based in {NAP.city}, {NAP.region}. One of us builds
              the measurement platform, the other sits with every client who
              uses it.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 wide:gap-6">
            {FOUNDERS.map((f, i) => (
              <article
                key={f.name}
                data-reveal
                style={delay(i * 110)}
                className="flex min-w-0 flex-col rounded-2xl bg-white p-7 sm:p-8 wide:p-10"
              >
                <h3 className="display text-[clamp(26px,1.806vw,36px)] leading-tight text-ink">
                  {f.name}
                </h3>
                <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">
                  {f.role}
                </p>
                <p className="mt-5 max-w-[64ch] text-[clamp(16px,1.111vw,20px)] leading-[1.7] text-ink-soft">
                  {f.bio}
                </p>
                <a
                  href={f.linkedin}
                  rel="noopener noreferrer"
                  className="mt-6 self-start border-b border-line-dark pb-0.5 text-[15px] font-medium text-ink transition-colors hover:border-ink"
                >
                  {f.name} on LinkedIn ↗
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Cta secondaryLabel="Book a call" secondaryHref="/contact/" />
    </>
  );
}
