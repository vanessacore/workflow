"use client";

import { Section, Eyebrow } from "./section";
import { Reveal, StaggerGroup, StaggerItem } from "./reveal";

const tags = [
  "Product Design",
  "AI Interfaces",
  "Wearables",
  "Prototyping",
  "Motion",
  "Design Systems",
  "Industrial",
  "Research",
];

export function About() {
  return (
    <Section id="about">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow>About</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance text-3xl font-medium leading-[1.05] tracking-[-0.025em] sm:text-4xl md:text-5xl">
              <span className="text-gradient">Designing for moments </span>
              <span className="font-serif italic text-foreground/85">
                that disappear
              </span>
              <span className="text-gradient"> into life.</span>
            </h2>
          </Reveal>
        </div>

        <div className="space-y-8 lg:col-span-7">
          <Reveal delay={0.1}>
            <p className="text-pretty text-lg leading-relaxed text-foreground/75">
              I&apos;m a product designer at Meta working across AI and the
              next generation of wearables. My practice sits between the cinematic
              and the intimate — building interfaces that feel inevitable, like
              they were always there, waiting for you.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-pretty text-base leading-relaxed text-foreground/55">
              I started in industrial design, moved through software, and now
              spend most of my time prototyping the seam between hardware,
              gesture, voice and intelligence. I believe the best technology
              is the kind you forget you&apos;re using.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="pt-2">
              <div className="mb-3 text-[11px] uppercase tracking-[0.22em] text-foreground/40">
                Practice
              </div>
              <StaggerGroup className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <StaggerItem key={t}>
                    <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-foreground/75 backdrop-blur-md transition-colors hover:border-white/20 hover:text-foreground">
                      {t}
                    </span>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
              {[
                { k: "Now", v: "Senior Product Designer · Meta" },
                { k: "Before", v: "Apple · IDEO · Frog" },
                { k: "Based", v: "Brooklyn / SF" },
                { k: "Speaks", v: "Design, prototypes, gesture" },
              ].map((it) => (
                <div
                  key={it.k}
                  className="bg-black/40 p-5"
                >
                  <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/40">
                    {it.k}
                  </div>
                  <div className="mt-1.5 text-sm font-medium text-foreground/90">
                    {it.v}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
