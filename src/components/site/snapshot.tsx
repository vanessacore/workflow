"use client";

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
        initial={reduce ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease, delay: 0.4 }}
        aria-label="A quick snapshot of Vanessa"
        className="liquid-glass pointer-events-auto relative w-full max-w-5xl overflow-hidden rounded-[28px]"
      >
        <span aria-hidden className="liquid-glass-sheen" />
        <span aria-hidden className="liquid-glass-noise" />

        <ul className="relative flex flex-col gap-3 p-5 sm:p-6 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-8 md:gap-y-3 md:p-7">
          {ENTRIES.map((e) => (
            <li
              key={e.period}
              className="flex flex-col gap-0.5 text-sm leading-snug text-foreground/85"
            >
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-foreground/50">
                {e.period}
              </span>
              <span className="text-foreground">
                <span className="font-medium">{e.org}</span>
                {e.detail ? (
                  <span className="text-foreground/60"> {e.detail}</span>
                ) : null}
                <span className="text-foreground/55">
                  , {e.location} · {e.span}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </motion.aside>
    </div>
  );
}
