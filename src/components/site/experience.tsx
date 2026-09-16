"use client";

import { motion } from "framer-motion";
import { Section, SectionHeading } from "./section";
import { Reveal } from "./reveal";

const timeline = [
  {
    year: "2022",
    org: "Meta",
    role: "Product Designer",
    blurb:
      "Designing AI-native product experiences. Four years shipping with cross-functional partners — the details stay inside the building; the craft is systems, restraint, and interfaces people can finish.",
    chips: ["AI-native", "Systems", "0→1 & 1→n"],
  },
  {
    year: "2021",
    org: "Gilded",
    role: "Product Designer",
    blurb:
      "End-to-end B2C and B2B for a digital gold-trading startup. Redesigned signup and the purchase / assets experience, visualized financial information, and ran design education for engineering and QA.",
    chips: ["Fintech", "B2B + B2C", "Handoff"],
  },
  {
    year: "2021",
    org: "Weee!",
    role: "Product Designer",
    blurb:
      "Designed the in-app feedback system — continuous NPS, product and delivery ratings, and app-store review prompts. Hit 1k+ NPS responses a day (10× the goal) and lifted store ratings ~200% in three months.",
    chips: ["NPS", "Growth", "Ecommerce"],
  },
  {
    year: "2020",
    org: "Pinpoint Science",
    role: "Product Designer",
    blurb:
      "0→1 mobile app for a 30-second Covid-19 antigen test. Redesigned the company site and helped lift investor and distributor inquiries by 40% in a month.",
    chips: ["Biotech", "0→1", "Mobile"],
  },
];

const pillars = [
  {
    title: "Research that changes the brief",
    body: "At Weee! and Gilded I used interviews and usability findings to pick the interaction — slider over a number list, simplified signup over more pitch — not to decorate a decided spec.",
  },
  {
    title: "Handoff as a design material",
    body: "I write QA guidelines and run sessions for engineering. A mock that can't be implemented cleanly isn't finished.",
  },
  {
    title: "Impact you can count",
    body: "1k+ daily NPS responses. 10× a leadership goal. Store ratings up 200%. Website inquiries up 40%. I design for the number and the feeling.",
  },
];

export function Experience() {
  return (
    <Section id="experience">
      <Reveal>
        <SectionHeading
          eyebrow="Experience"
          title={
            <>
              <span className="text-gradient">Seven years of shipping </span>
              <span className="font-serif italic text-foreground/85">
                across AI, commerce, and health.
              </span>
            </>
          }
          description="From a 0→1 diagnostics app to Meta. One thread: make the next action obvious, then get out of the way."
        />
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-8 md:mt-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <ol className="relative ml-2 border-l border-white/10 pl-7">
            {timeline.map((t, i) => (
              <motion.li
                key={t.year + t.org}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative pb-5 last:pb-0 md:pb-6"
              >
                <span className="absolute -left-[33px] top-1.5 flex h-3 w-3 items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-white/15 blur-[6px]" />
                  <span className="relative h-2 w-2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
                </span>
                <div className="flex items-baseline gap-3 text-[10.5px] uppercase tracking-[0.22em] text-foreground/45">
                  <span className="text-foreground/80">{t.year}</span>
                  <span className="h-px flex-1 bg-white/5" />
                  <span>{t.org}</span>
                </div>
                <h3 className="mt-1.5 text-base font-medium tracking-tight text-foreground md:text-lg">
                  {t.role}
                </h3>
                <p className="mt-1.5 max-w-xl text-pretty text-[13px] leading-relaxed text-foreground/60 md:text-[13.5px]">
                  {t.blurb}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {t.chips.map((c) => (
                    <span
                      key={c}
                      className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10.5px] text-foreground/70"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-5">
          <div className="space-y-3">
            <Reveal>
              <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/40">
                How I work
              </div>
            </Reveal>
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={0.1 + i * 0.08}>
                <div className="group relative overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] p-3.5 backdrop-blur-sm transition-colors hover:border-white/15 md:p-4">
                  <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[radial-gradient(circle,_rgba(180,160,255,0.18),_transparent_60%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                  <div className="flex items-start gap-2.5">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.7)]" />
                    <div>
                      <div className="text-[13.5px] font-medium text-foreground">
                        {p.title}
                      </div>
                      <p className="mt-1 text-[12px] leading-relaxed text-foreground/55">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
