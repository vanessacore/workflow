"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate flex min-h-[100svh] w-full items-center overflow-hidden px-6 pt-32 pb-24 md:pt-40 md:pb-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/2 h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(180,170,255,0.18),_transparent_55%)] blur-3xl" />
        <div className="absolute left-1/2 top-[58%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(120,200,255,0.10),_transparent_55%)] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.18] mask-radial"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <motion.div
        style={reduce ? undefined : { y, opacity, scale }}
        className="relative mx-auto flex w-full max-w-6xl flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[11.5px] font-medium uppercase tracking-[0.22em] text-foreground/70 backdrop-blur-md"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-white/70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          Product Designer · Meta AI &amp; Wearables
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease, delay: 0.25 }}
          className="mt-8 max-w-5xl text-balance text-[clamp(2.75rem,8vw,7rem)] font-medium leading-[0.95] tracking-[-0.035em]"
        >
          <span className="text-gradient">Designing the </span>
          <span className="font-serif italic text-gradient-accent animate-shimmer">
            quiet&nbsp;intelligence
          </span>
          <span className="text-gradient"> that lives between us and our devices.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.5 }}
          className="mt-7 max-w-2xl text-pretty text-base leading-relaxed text-foreground/65 md:text-lg"
        >
          I&apos;m <span className="text-foreground">Vanessa Core</span> — a
          product designer at Meta shaping AI experiences and the next generation
          of wearables. I work at the seam where ambient intelligence meets the
          human body.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.75 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="#work"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-5 py-3 text-[13.5px] font-medium tracking-tight text-black transition-all hover:bg-white/95"
          >
            <span className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.6),_transparent_70%)] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            View selected work
            <Arrow />
          </Link>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-[13.5px] font-medium tracking-tight text-foreground/90 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/[0.06]"
          >
            Get in touch
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="mt-20 grid w-full max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm sm:grid-cols-4"
        >
          {[
            { k: "8+", v: "Years designing 0→1" },
            { k: "Meta", v: "AI · Reality Labs" },
            { k: "12", v: "Shipped products" },
            { k: "∞", v: "Prototypes burned" },
          ].map((it) => (
            <div
              key={it.v}
              className="flex flex-col items-center gap-1 bg-black/40 px-4 py-5 text-center"
            >
              <div className="text-xl font-medium tracking-tight text-foreground md:text-2xl">
                {it.k}
              </div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-foreground/45">
                {it.v}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 1.4 }}
        className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
      >
        <div className="flex flex-col items-center gap-2 text-[10.5px] uppercase tracking-[0.3em] text-foreground/40">
          <span>Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-px bg-gradient-to-b from-white/50 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="transition-transform duration-300 group-hover:translate-x-0.5"
    >
      <path
        d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
