"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

type TimelineItem = {
  period: string;
  org: string;
  detail?: string;
  location: string;
  span: string;
  description: string;
};

const TIMELINE: TimelineItem[] = [
  {
    period: "2017 — present",
    org: "Meta",
    detail: "(facebook)",
    location: "NYC",
    span: "8 yrs 7 mos",
    description:
      "Product design across AI experiences and next-generation wearables. Working at the seam where ambient intelligence meets the human body.",
  },
  {
    period: "2011 — 2017",
    org: "DIRECTV",
    detail: "(AT&T)",
    location: "NYC",
    span: "6 yrs",
    description:
      "Designed entertainment products and cross-screen experiences for millions of subscribers through the AT&T era.",
  },
  {
    period: "2004 — 2010",
    org: "Web dev / design",
    location: "Seoul",
    span: "5 yrs",
    description:
      "Early career building and designing for the web in Seoul — where the craft and curiosity began.",
  },
];

export default function TimelinePage() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate min-h-[100svh] w-full px-6 pt-32 pb-24 md:px-12 md:pt-36 lg:px-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/3 h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(180,170,255,0.12),_transparent_55%)] blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="mb-10"
        >
          <Link
            href="/"
            className="liquid-glass group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-3.5 py-1.5 text-[11.5px] font-medium uppercase tracking-[0.22em] text-foreground/80 transition-[transform,color] duration-300 hover:text-foreground active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <span aria-hidden className="liquid-glass-sheen" />
            <span aria-hidden className="liquid-glass-noise" />
            <span className="relative inline-flex items-center gap-2">
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              >
                <path
                  d="M11 7H3m0 0l3.5-3.5M3 7l3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </span>
          </Link>
        </motion.div>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
          className="text-balance text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1] tracking-[-0.03em]"
        >
          <span className="text-gradient">A </span>
          <span className="font-serif italic text-gradient-accent">
            timeline
          </span>
          <span className="text-gradient"> of the work.</span>
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.25 }}
          className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-foreground/65"
        >
          A few chapters, in order. The threads connecting AI, wearables, and
          the everyday interfaces in between.
        </motion.p>

        <ol className="relative mt-14 border-l border-white/10 pl-8">
          {TIMELINE.map((item, i) => (
            <motion.li
              key={item.period}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.4 + i * 0.12 }}
              className="relative pb-12 last:pb-0"
            >
              <span
                aria-hidden
                className="absolute -left-[33px] top-1.5 grid h-4 w-4 place-items-center"
              >
                <span className="absolute inset-0 rounded-full bg-white/10 blur-md" />
                <span className="relative h-2 w-2 rounded-full bg-white/90 shadow-[0_0_0_3px_rgba(255,255,255,0.08)]" />
              </span>

              <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-foreground/45">
                {item.period} · {item.span}
              </div>
              <h2 className="mt-2 text-xl font-medium tracking-tight text-foreground md:text-2xl">
                {item.org}
                {item.detail ? (
                  <span className="text-foreground/55"> {item.detail}</span>
                ) : null}
                <span className="text-foreground/40"> · {item.location}</span>
              </h2>
              <p className="mt-3 max-w-xl text-pretty text-[15px] leading-relaxed text-foreground/65">
                {item.description}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
