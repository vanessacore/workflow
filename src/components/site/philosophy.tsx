"use client";

import { motion } from "framer-motion";
import { Section, Eyebrow } from "./section";
import { Reveal } from "./reveal";

const tenets = [
  {
    n: "I.",
    title: "Inevitability over invention.",
    body:
      "The best products feel discovered, not designed. I work toward the version of a feature that, once seen, seems like the only one that could have existed.",
  },
  {
    n: "II.",
    title: "Calm beats clever.",
    body:
      "Cleverness is a tax on attention. I design for the quiet competence of a tool that doesn't ask for applause.",
  },
  {
    n: "III.",
    title: "Motion is meaning.",
    body:
      "Every transition is an explanation. I treat easing curves and timing as part of the product copy.",
  },
  {
    n: "IV.",
    title: "The body is the canvas.",
    body:
      "When the screen disappears, design becomes posture, gesture, and breath. I study the wearer as carefully as the wearable.",
  },
];

export function Philosophy() {
  return (
    <Section id="philosophy">
      <div className="relative">
        <Reveal>
          <Eyebrow>Design Philosophy</Eyebrow>
        </Reveal>

        <blockquote className="mt-6 max-w-5xl text-balance text-[clamp(1.875rem,4.5vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.025em]">
          <Reveal>
            <span className="text-gradient">A product is what you keep </span>
            <span className="font-serif italic text-gradient-accent animate-shimmer">
              removing
            </span>
            <span className="text-gradient"> until it works.</span>
          </Reveal>
        </blockquote>

        <Reveal delay={0.15}>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-foreground/55">
            Four tenets I return to. Less a method than a posture — the
            way I hold a problem before I touch it.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] backdrop-blur-sm sm:grid-cols-2 md:mt-10">
          {tenets.map((t, i) => (
            <motion.div
              key={t.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.9,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative bg-black/40 p-6 md:p-7"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.05),_transparent_60%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              <div className="font-serif text-2xl italic text-foreground/40">
                {t.n}
              </div>
              <h3 className="mt-2 text-lg font-medium tracking-tight text-foreground md:text-xl">
                {t.title}
              </h3>
              <p className="mt-2 max-w-md text-pretty text-[13px] leading-relaxed text-foreground/55 md:text-[13.5px]">
                {t.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
