"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const quoteY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <Section id="philosophy">
      <div ref={ref} className="relative">
        <Reveal>
          <Eyebrow>Design Philosophy</Eyebrow>
        </Reveal>

        <motion.blockquote
          style={reduce ? undefined : { y: quoteY }}
          className="mt-8 max-w-5xl text-balance text-[clamp(2rem,5.5vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.025em]"
        >
          <Reveal>
            <span className="text-gradient">A product is what you keep </span>
            <span className="font-serif italic text-gradient-accent animate-shimmer">
              removing
            </span>
            <span className="text-gradient"> until it works.</span>
          </Reveal>
        </motion.blockquote>

        <Reveal delay={0.15}>
          <p className="mt-8 max-w-2xl text-pretty text-base leading-relaxed text-foreground/55 md:text-lg">
            Four tenets I return to. Less a method than a posture — the
            way I hold a problem before I touch it.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/8 bg-white/[0.02] backdrop-blur-sm sm:grid-cols-2">
          {tenets.map((t, i) => (
            <motion.div
              key={t.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.9,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative bg-black/40 p-8 md:p-10"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.05),_transparent_60%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              <div className="font-serif text-3xl italic text-foreground/40">
                {t.n}
              </div>
              <h3 className="mt-4 text-xl font-medium tracking-tight text-foreground md:text-2xl">
                {t.title}
              </h3>
              <p className="mt-3 max-w-md text-pretty text-[14.5px] leading-relaxed text-foreground/55">
                {t.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
