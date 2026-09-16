"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SplineScene } from "./spline-scene";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] w-full items-end overflow-hidden md:h-full md:min-h-screen"
    >
      <div className="pointer-events-none absolute inset-0 z-0 [&_canvas]:pointer-events-none">
        <SplineScene />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/2 bg-gradient-to-t from-black via-black/55 to-transparent"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6 pb-24 pt-32 text-center md:items-start md:px-12 md:pb-20 md:text-left lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.15 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3.5 py-1.5 text-[11.5px] font-medium uppercase tracking-[0.22em] text-foreground/75 backdrop-blur-md"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-white/70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
          </span>
          Product Designer · Meta · San Francisco
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.35 }}
          className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-foreground/70 md:text-lg"
        >
          I design AI-native products people actually finish using — from
          0→1 diagnostics and fintech to in-app systems that moved business
          metrics by an order of magnitude.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.55 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-3 md:justify-start"
        >
          <Link
            href="#work"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-5 py-3 text-[13.5px] font-medium tracking-tight text-black transition-all hover:bg-white/95"
          >
            View selected work
            <Arrow />
          </Link>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-5 py-3 text-[13.5px] font-medium tracking-tight text-foreground/90 backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/[0.06]"
          >
            Get in touch
          </Link>
        </motion.div>
      </div>
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
