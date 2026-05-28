"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

type Entry = {
  period: string;
  org: string;
  detail: string;
  location: string;
  span: string;
};

const ENTRIES: Entry[] = [
  {
    period: "2017 — present",
    org: "Meta",
    detail: "(facebook)",
    location: "NYC",
    span: "8 yrs 7 mos",
  },
  {
    period: "2011 — 2017",
    org: "DIRECTV",
    detail: "(AT&T)",
    location: "NYC",
    span: "6 yrs",
  },
  {
    period: "2004 — 2010",
    org: "Web dev / design",
    detail: "",
    location: "Seoul",
    span: "5 yrs",
  },
];

export function Snapshot() {
  const reduce = useReducedMotion();

  return (
    <div
      className="
        pointer-events-none fixed inset-x-0 bottom-0 z-20
        flex justify-center
        px-4 pb-4
        sm:px-6 sm:pb-6
        md:px-10 md:pb-8
      "
    >
      <motion.aside
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease, delay: 0.4 }}
        aria-label="A quick snapshot of Vanessa"
        className="
          pointer-events-auto relative w-full max-w-5xl
          overflow-hidden rounded-2xl
          border border-white/10
          bg-white/[0.04]
          shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]
          backdrop-blur-xl backdrop-saturate-150
        "
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-white/[0.02]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />

        <div className="relative flex flex-col gap-4 p-5 sm:p-6 md:flex-row md:items-center md:gap-6 md:p-7">
          <div className="flex flex-1 flex-col gap-1">
            <span className="text-[10.5px] font-medium uppercase tracking-[0.28em] text-foreground/50">
              Quick snapshot
            </span>
            <h2 className="text-lg font-medium tracking-tight text-foreground md:text-xl">
              A few chapters so far.
            </h2>
          </div>

          <ul
            className="
              flex flex-1 flex-col gap-3
              md:flex-row md:flex-wrap md:gap-x-6 md:gap-y-2
              md:border-l md:border-white/10 md:pl-6
            "
          >
            {ENTRIES.map((e) => (
              <li
                key={e.period}
                className="flex flex-col gap-0.5 text-sm leading-snug text-foreground/80"
              >
                <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-foreground/45">
                  {e.period}
                </span>
                <span className="text-foreground">
                  <span className="font-medium">{e.org}</span>
                  {e.detail ? (
                    <span className="text-foreground/55"> {e.detail}</span>
                  ) : null}
                  <span className="text-foreground/45">
                    , {e.location} · {e.span}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center md:self-stretch md:border-l md:border-white/10 md:pl-6">
            <Link
              href="/timeline"
              className="
                group inline-flex items-center gap-2
                rounded-full border border-white/15 bg-white/[0.06]
                px-4 py-2.5 text-[12.5px] font-medium tracking-tight text-foreground
                backdrop-blur-md
                transition-all
                hover:border-white/25 hover:bg-white/[0.10]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40
              "
            >
              View Timeline
              <svg
                width="13"
                height="13"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden
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
            </Link>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
