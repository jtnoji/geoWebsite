import type { Metadata } from "next";
import Cta from "@/components/Cta";
import JsonLd from "@/components/JsonLd";
import { person } from "@/lib/schema";
import { FOUNDERS, NAP } from "@/lib/site";

export const metadata: Metadata = {
  title: "About: two founders measuring, not guessing",
  description:
    "Abhi built the measurement platform. Josh works with every client. Berkeley, CA. We measure, we do the work, and we sell no guarantees.",
};

export default function About() {
  return (
    <>
      {FOUNDERS.map((f) => (
        <JsonLd key={f.name} data={person(f)} />
      ))}

      <div className="mx-auto max-w-2xl px-5 py-16 sm:px-8 md:py-20">
        {/* Head centres; the founder bios below stay left-aligned, because
            centring multi-line body copy hurts readability. */}
        <div className="text-center">
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-ink">
          Two founders, measuring the thing everyone else is guessing about.
          Then doing something about it.
        </h1>
        <p className="mt-5 text-base leading-7 text-ink-soft">
          We&rsquo;re based in {NAP.city}, {NAP.region}. One of us builds the
          measurement platform, the other sits with every client who uses it.
          We started this because &ldquo;how visible am I in AI answers?&rdquo;
          deserves a measured answer, not a sales pitch. Now we work the fix
          list too, and measure what it changed.
        </p>
        </div>

        <div className="mt-14">
          {FOUNDERS.map((f) => (
            <section key={f.name} className="border-t border-line-dark py-8 last:pb-0">
              <h2 className="text-2xl font-bold tracking-tight text-ink">{f.name}</h2>
              <p className="mt-1 text-sm text-ink-faint">{f.role}</p>
              <p className="mt-4 text-base leading-7 text-ink-soft">{f.bio}</p>
              <a
                href={f.linkedin}
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-semibold text-ink hover:text-accent"
              >
                {f.name} on LinkedIn ↗
              </a>
            </section>
          ))}
        </div>
      </div>

      <Cta centered secondaryLabel="Book a call" secondaryHref="/contact/" />
    </>
  );
}
