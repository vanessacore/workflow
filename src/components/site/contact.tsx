"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Section, Eyebrow } from "./section";
import { Reveal } from "./reveal";

const channels = [
  { label: "Email", value: "hello@vanessacore.design", href: "mailto:hello@vanessacore.design" },
  { label: "Read", value: "Notes & essays", href: "#" },
  { label: "Connect", value: "LinkedIn", href: "#" },
  { label: "Off-the-record", value: "Signal · @vanessa.42", href: "#" },
];

export function Contact() {
  return (
    <Section id="contact" className="pb-32 md:pb-40">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.02] p-8 backdrop-blur-sm md:p-16 lg:p-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-40 left-1/4 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,_rgba(180,160,255,0.18),_transparent_60%)] blur-3xl" />
          <div className="absolute -bottom-40 right-1/4 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(120,200,255,0.12),_transparent_60%)] blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.12] mask-radial"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="relative">
          <Reveal>
            <Eyebrow>Contact</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 max-w-4xl text-balance text-[clamp(2.25rem,6vw,5rem)] font-medium leading-[1.02] tracking-[-0.03em]">
              <span className="text-gradient">Have a hard problem </span>
              <span className="font-serif italic text-foreground/85">
                worth designing
              </span>
              <span className="text-gradient">?</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-foreground/60 md:text-lg">
              I take on a small number of collaborations each year — usually
              0→1 product work at the intersection of AI, hardware, and the
              body. If that sounds like you, write me a paragraph.
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
              className="mt-10 inline-block"
            >
              <Link
                href="mailto:hello@vanessacore.design"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-6 py-4 text-[14px] font-medium tracking-tight text-black transition-all"
              >
                <span className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.5),_transparent_70%)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                hello@vanessacore.design
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  <path
                    d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </motion.div>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative flex flex-col gap-2 bg-black/40 p-6 transition-colors hover:bg-black/20"
              >
                <div className="text-[10.5px] uppercase tracking-[0.22em] text-foreground/40">
                  {c.label}
                </div>
                <div className="flex items-center justify-between text-sm font-medium text-foreground/90">
                  <span>{c.value}</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    className="text-foreground/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-foreground"
                  >
                    <path
                      d="M2 10L10 2M10 2H4M10 2V8"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
