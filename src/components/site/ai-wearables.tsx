"use client";

import { motion } from "framer-motion";
import { Section, SectionHeading } from "./section";
import { Reveal } from "./reveal";

const timeline = [
  {
    year: "2025",
    org: "Meta · AI",
    role: "Senior Product Designer",
    blurb:
      "Leading the design of an ambient, multimodal assistant across smartglasses, mobile, and home. Defining the gesture vocabulary, latency-aware motion, and the quiet feedback loops for AI on the body.",
    chips: ["Multimodal AI", "Smartglasses", "Motion"],
  },
  {
    year: "2023",
    org: "Meta · Reality Labs",
    role: "Product Designer · Wearables",
    blurb:
      "Designed on-glass UI grammar, off-axis interaction patterns, and the industrial language for a research wearable program. Shipped a neural input prototype with the brain–computer team.",
    chips: ["AR", "Neural Input", "Industrial"],
  },
  {
    year: "2021",
    org: "Apple · Health",
    role: "Product Designer",
    blurb:
      "Worked on the soft edges of health — moments where a watch becomes a companion, not a clinician. Led design for two unreleased experiments in passive sensing.",
    chips: ["Health", "Sensing", "Watch"],
  },
  {
    year: "2018",
    org: "IDEO · Frog",
    role: "Industrial &amp; Interaction Designer",
    blurb:
      "Cut my teeth on consumer hardware, hospitality robotics, and a generation of speculative wearables that never made the lab door — but taught me everything.",
    chips: ["Industrial", "Speculative", "Hardware"],
  },
];

const pillars = [
  {
    title: "AI that listens before it speaks",
    body:
      "Designing assistants that earn attention through restraint — anticipating less, observing more, intervening only when it matters.",
  },
  {
    title: "Hardware as choreography",
    body:
      "Buttons, gestures, glances. A wearable is a body language. I design the rhythm before the resolution.",
  },
  {
    title: "Privacy as a design material",
    body:
      "On-device by default, legibly. Trust isn't a setting — it's the shape of the product.",
  },
];

export function AiWearables() {
  return (
    <Section id="experience">
      <Reveal>
        <SectionHeading
          eyebrow="AI · Wearables"
          title={
            <>
              <span className="text-gradient">Eight years at the edge of </span>
              <span className="font-serif italic text-foreground/85">
                ambient intelligence.
              </span>
            </>
          }
          description="From industrial design studios to Meta's Reality Labs, my work has tracked a single thread: how technology leaves the screen and joins the body."
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
                  {t.role.replace(/&amp;/g, "&")}
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
                What I&apos;m known for
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
