"use client";

import { Section, Eyebrow } from "./section";
import { Reveal, StaggerGroup, StaggerItem } from "./reveal";

const tags = [
  "Product Design",
  "AI-native UX",
  "0→1",
  "Research",
  "Prototyping",
  "Design Systems",
  "Growth loops",
  "Handoff & QA",
];

export function About() {
  return (
    <Section id="about">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow>About</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-balance text-3xl font-medium leading-[1.05] tracking-[-0.025em] sm:text-4xl md:text-5xl">
              <span className="text-gradient">A journalist who learned to </span>
              <span className="font-serif italic text-foreground/85">
                ship products
              </span>
              <span className="text-gradient">.</span>
            </h2>
          </Reveal>
        </div>

        <div className="space-y-6 lg:col-span-7">
          <Reveal delay={0.1}>
            <p className="text-pretty text-base leading-relaxed text-foreground/75 md:text-[17px]">
              I&apos;m Vanessa Hu — I go by Vanessa Core here — a product
              designer at Meta. I spent four years in economic journalism and
              communications before retraining in HCI at California College of
              the Arts. That path still shows up in the work: I listen first,
              then design the smallest system that changes a behavior.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-pretty text-base leading-relaxed text-foreground/55">
              Before Meta I led 0→1 and growth work across biotech, grocery
              ecommerce, and fintech — a Covid diagnostics app, Weee!&apos;s
              in-app feedback system (1k+ NPS responses a day), and Gilded&apos;s
              gold-trading experience. I care about research, clear handoff, and
              designs that survive contact with engineering.
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
            <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
              {[
                { k: "Now", v: "Product Designer · Meta" },
                { k: "Before", v: "Gilded · Weee! · Pinpoint" },
                { k: "Based", v: "San Francisco" },
                { k: "Trained", v: "CCA · MDes, HCI" },
              ].map((it) => (
                <div key={it.k} className="bg-black/40 p-4">
                  <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/40">
                    {it.k}
                  </div>
                  <div className="mt-1 text-[13.5px] font-medium text-foreground/90">
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
