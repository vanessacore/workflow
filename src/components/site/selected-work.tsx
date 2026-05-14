"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section, SectionHeading } from "./section";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Project = {
  index: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  visual: ReactNode;
  accent: string;
};

const projects: Project[] = [
  {
    index: "01",
    year: "2025",
    title: "Aura",
    subtitle: "Ambient AI assistant",
    description:
      "A glanceable conversational layer across devices — quiet feedback loops that keep AI calm, not chatty.",
    tags: ["AI", "Multimodal", "Motion"],
    accent: "from-violet-400/40 via-fuchsia-300/20 to-transparent",
    visual: <AuraVisual />,
  },
  {
    index: "02",
    year: "2024",
    title: "Halo R1",
    subtitle: "AR smartglasses companion",
    description:
      "On-glass UI grammar for a translucent companion — peripheral typography, off-axis interactions, layered information.",
    tags: ["Wearables", "AR", "Industrial"],
    accent: "from-cyan-300/30 via-blue-300/20 to-transparent",
    visual: <HaloVisual />,
  },
  {
    index: "03",
    year: "2024",
    title: "Pulse",
    subtitle: "Wrist-worn neural input",
    description:
      "Micro-gestures translated into a tactile interaction language — a wearable that learns the rhythm of you.",
    tags: ["Neural", "Wearables", "Research"],
    accent: "from-rose-300/35 via-orange-300/15 to-transparent",
    visual: <PulseVisual />,
  },
  {
    index: "04",
    year: "2023",
    title: "Field Notes",
    subtitle: "On-device personal AI",
    description:
      "A privacy-first companion that captures the small things and weaves them into useful context, on-device only.",
    tags: ["AI", "Privacy", "Mobile"],
    accent: "from-emerald-300/25 via-teal-300/15 to-transparent",
    visual: <FieldNotesVisual />,
  },
];

export function SelectedWork() {
  return (
    <Section id="work">
      <Reveal>
        <SectionHeading
          eyebrow="Selected Work"
          title={
            <>
              <span className="text-gradient">A few pieces </span>
              <span className="font-serif italic text-foreground/85">
                I&apos;m proud of.
              </span>
            </>
          }
          description="Each project is a study in restraint — what to add, what to leave out, what to let the system feel for itself."
        />
      </Reveal>

      {/* Mobile: stacked rich cards. Desktop: compact 2x2 grid that fits one panel. */}
      <div className="mt-10 flex flex-col gap-6 md:hidden">
        {projects.map((p, i) => (
          <ProjectCard key={p.title} project={p} reverse={i % 2 === 1} />
        ))}
      </div>

      <div className="mt-8 hidden grid-cols-1 gap-4 md:grid md:grid-cols-2 md:gap-5 lg:mt-10">
        {projects.map((p, i) => (
          <ProjectTile key={p.title} project={p} index={i} />
        ))}
      </div>
    </Section>
  );
}

function ProjectTile({ project, index }: { project: Project; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.article
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex h-[clamp(11rem,26vh,15rem)] overflow-hidden rounded-2xl border border-white/5 bg-white/[0.015] backdrop-blur-sm transition-colors duration-700 hover:border-white/15"
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity duration-700 group-hover:opacity-100",
          project.accent
        )}
      />
      <div className="pointer-events-none absolute inset-px rounded-[calc(1rem-1px)] bg-black/45" />

      <div className="relative z-10 grid w-full grid-cols-5">
        <div className="relative col-span-2 overflow-hidden">
          <div className="absolute inset-0 scale-[0.95] transition-transform duration-700 group-hover:scale-[1]">
            {project.visual}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent" />
        </div>

        <div className="relative col-span-3 flex flex-col gap-2 p-4 md:p-5">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-foreground/40">
            <span>{project.index}</span>
            <span>{project.year}</span>
          </div>
          <h3 className="text-base font-medium tracking-tight leading-tight md:text-[17px]">
            <span className="text-foreground">{project.title}</span>
            <span className="ml-1.5 text-foreground/35">—</span>
            <span className="ml-1.5 font-serif italic text-foreground/70">
              {project.subtitle}
            </span>
          </h3>
          <p className="text-pretty text-[12.5px] leading-relaxed text-foreground/60 line-clamp-3">
            {project.description}
          </p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-foreground/65"
                >
                  {t}
                </span>
              ))}
            </div>
            <button
              type="button"
              className="group/btn inline-flex items-center gap-1.5 text-[11.5px] font-medium text-foreground/75 transition-colors hover:text-foreground"
            >
              Case study
              <span className="relative h-px w-5 bg-white/30 transition-all group-hover/btn:w-8 group-hover/btn:bg-white/70" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectCard({
  project,
  reverse,
}: {
  project: Project;
  reverse: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.015] backdrop-blur-sm transition-colors duration-700 hover:border-white/10"
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity duration-700 group-hover:opacity-100",
          project.accent
        )}
      />
      <div className="pointer-events-none absolute inset-px rounded-[calc(1.5rem-1px)] bg-black/40" />

      <div
        className={cn(
          "relative grid grid-cols-1 gap-0",
          reverse && "[&>*:first-child]:order-2"
        )}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          {project.visual}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
        </div>

        <div className="relative flex flex-col gap-5 p-8">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-foreground/40">
            <span>{project.index}</span>
            <span>{project.year}</span>
          </div>
          <div>
            <h3 className="text-2xl font-medium tracking-tight">
              <span className="text-foreground">{project.title}</span>
              <span className="ml-2 text-foreground/40">—</span>
              <span className="ml-2 font-serif italic text-foreground/70">
                {project.subtitle}
              </span>
            </h3>
          </div>
          <p className="text-pretty text-[15px] leading-relaxed text-foreground/60">
            {project.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-foreground/70"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-auto pt-4">
            <button
              type="button"
              className="group/btn inline-flex items-center gap-2 text-[13px] font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              Case study
              <span className="relative h-px w-8 bg-white/30 transition-all group-hover/btn:w-12 group-hover/btn:bg-white/70" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function AuraVisual() {
  return (
    <div className="relative h-full w-full bg-[linear-gradient(135deg,#0a0a0f,#0f0a18_50%,#0a0810)]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-40 w-40 md:h-48 md:w-48">
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,#a78bfa66,#60a5fa55,#f0abfc44,#a78bfa66)] blur-2xl animate-pulse-soft" />
          <div className="absolute inset-3 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm" />
          <div className="absolute inset-7 rounded-full border border-white/10 bg-black/60" />
          <div className="absolute inset-[2.75rem] rounded-full bg-gradient-to-br from-white/95 to-white/30 shadow-[0_0_60px_rgba(180,160,255,0.55)]" />
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-white/15"
              initial={{ scale: 0.6, opacity: 0.6 }}
              animate={{ scale: 1.05, opacity: 0 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 1,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      </div>
      <CornerCrosshairs />
    </div>
  );
}

function HaloVisual() {
  return (
    <div className="relative h-full w-full bg-[linear-gradient(135deg,#070a10,#0a1018_50%,#06080c)]">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 600 360"
          className="h-auto w-[85%] max-w-xs"
          fill="none"
        >
          <defs>
            <linearGradient id="lens" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#67e8f9" stopOpacity="0.15" />
              <stop offset="1" stopColor="#3b82f6" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="frame" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(255,255,255,0.85)" />
              <stop offset="1" stopColor="rgba(255,255,255,0.25)" />
            </linearGradient>
          </defs>
          <path
            d="M60 180 Q300 60 540 180"
            stroke="url(#frame)"
            strokeWidth="1.2"
            fill="none"
          />
          <rect
            x="80"
            y="140"
            rx="60"
            ry="60"
            width="200"
            height="100"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.2"
            fill="url(#lens)"
          />
          <rect
            x="320"
            y="140"
            rx="60"
            ry="60"
            width="200"
            height="100"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.2"
            fill="url(#lens)"
          />
          <path
            d="M280 190 L320 190"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.2"
          />
          <g opacity="0.85">
            <circle cx="180" cy="190" r="2" fill="#67e8f9" />
            <circle cx="420" cy="190" r="2" fill="#67e8f9" />
          </g>
        </svg>
      </div>
      <CornerCrosshairs />
    </div>
  );
}

function PulseVisual() {
  return (
    <div className="relative h-full w-full bg-[linear-gradient(135deg,#0d0808,#150a0a_55%,#080605)]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-36 w-36 md:h-44 md:w-44">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(244,114,182,0.25),_transparent_60%)] blur-2xl" />
          <div className="absolute inset-3 rounded-full border border-white/10" />
          <div className="absolute inset-7 rounded-full border border-white/10" />
          <div className="absolute inset-12 rounded-full border border-white/10" />
          {[...Array(6)].map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            const x = Math.round((50 + Math.cos(a) * 32) * 100) / 100;
            const y = Math.round((50 + Math.sin(a) * 32) * 100) / 100;
            return (
              <motion.div
                key={i}
                className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.7)]"
                style={{ left: `${x}%`, top: `${y}%` }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  delay: i * 0.18,
                  ease: "easeInOut",
                }}
              />
            );
          })}
          <svg
            className="absolute left-1/2 top-1/2 h-20 w-32 -translate-x-1/2 -translate-y-1/2"
            viewBox="0 0 200 80"
            fill="none"
          >
            <path
              d="M0 40 L40 40 L55 20 L75 60 L95 30 L115 50 L135 40 L200 40"
              stroke="rgba(255,200,200,0.8)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <CornerCrosshairs />
    </div>
  );
}

function FieldNotesVisual() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[linear-gradient(135deg,#06100c,#08120e_55%,#040806)]">
      <div className="absolute inset-0 flex items-center justify-center px-5">
        <div className="relative w-full max-w-[12rem]">
          {[
            { t: "00:42", text: "5th & Bond, light off the awning" },
            { t: "11:18", text: "quiet, not loud — the framing" },
            { t: "16:04", text: "oat, ash, the faintest blush" },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12, rotate: 0 }}
              whileInView={{
                opacity: 1,
                y: i * 8,
                rotate: (i - 1) * 2,
              }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 1,
                delay: i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mb-2 rounded-xl border border-white/10 bg-white/[0.04] p-2.5 backdrop-blur-sm shadow-[0_16px_32px_-16px_rgba(0,0,0,0.8)]"
              style={{ marginLeft: `${i * 6}px` }}
            >
              <div className="flex items-center justify-between text-[8.5px] uppercase tracking-[0.22em] text-foreground/40">
                <span>note · {String(i + 1).padStart(2, "0")}</span>
                <span>{card.t}</span>
              </div>
              <div className="mt-1 font-serif text-[11px] italic leading-snug text-foreground/85">
                {card.text}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <CornerCrosshairs />
    </div>
  );
}

function CornerCrosshairs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-2 text-white/15">
      {[
        "left-0 top-0",
        "right-0 top-0 rotate-90",
        "right-0 bottom-0 rotate-180",
        "left-0 bottom-0 -rotate-90",
      ].map((pos) => (
        <svg
          key={pos}
          className={`absolute h-3 w-3 ${pos}`}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M0 0 H6 M0 0 V6" stroke="currentColor" strokeWidth="1" />
        </svg>
      ))}
    </div>
  );
}
