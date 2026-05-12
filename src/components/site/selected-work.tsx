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
    subtitle: "Ambient AI assistant for everyday rituals",
    description:
      "A glanceable conversational layer that lives across your devices. Designed the gesture vocabulary, latency-aware motion system, and the quiet feedback loops that make AI feel calm — not chatty.",
    tags: ["AI", "Multimodal", "Motion System"],
    accent: "from-violet-400/40 via-fuchsia-300/20 to-transparent",
    visual: <AuraVisual />,
  },
  {
    index: "02",
    year: "2024",
    title: "Halo R1",
    subtitle: "AR smartglasses companion",
    description:
      "Designed the on-glass UI grammar for a translucent companion: peripheral typography, off-axis interactions, and a layered information model that respects the world behind the lens.",
    tags: ["Wearables", "AR", "Industrial"],
    accent: "from-cyan-300/30 via-blue-300/20 to-transparent",
    visual: <HaloVisual />,
  },
  {
    index: "03",
    year: "2024",
    title: "Pulse",
    subtitle: "Wrist-worn neural input study",
    description:
      "Explored micro-gesture detection translated into a soft, tactile interaction language. Defined the latency budget, training rituals, and feedback choreography for a wearable that learns you.",
    tags: ["Neural Input", "Wearables", "Research"],
    accent: "from-rose-300/35 via-orange-300/15 to-transparent",
    visual: <PulseVisual />,
  },
  {
    index: "04",
    year: "2023",
    title: "Field Notes",
    subtitle: "On-device personal AI",
    description:
      "A privacy-first companion that captures the small things — voice scribbles, photos, fleeting thoughts — and quietly weaves them into useful context, on-device. No cloud, no anxiety.",
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

      <div className="mt-16 flex flex-col gap-6 md:mt-24 md:gap-10">
        {projects.map((p, i) => (
          <ProjectCard key={p.title} project={p} reverse={i % 2 === 1} />
        ))}
      </div>
    </Section>
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
          "relative grid grid-cols-1 gap-0 lg:grid-cols-12",
          reverse && "lg:[&>*:first-child]:order-2"
        )}
      >
        <div className="relative aspect-[16/10] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-[28rem]">
          {project.visual}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />
        </div>

        <div className="relative flex flex-col gap-5 p-8 md:p-10 lg:col-span-5 lg:p-12">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-foreground/40">
            <span>{project.index}</span>
            <span>{project.year}</span>
          </div>
          <div>
            <h3 className="text-2xl font-medium tracking-tight md:text-3xl">
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
          <div className="mt-auto pt-6">
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
        <div className="relative h-72 w-72 md:h-96 md:w-96">
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,#a78bfa66,#60a5fa55,#f0abfc44,#a78bfa66)] blur-2xl animate-pulse-soft" />
          <div className="absolute inset-6 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm" />
          <div className="absolute inset-12 rounded-full border border-white/10 bg-black/60" />
          <div className="absolute inset-[5.5rem] rounded-full bg-gradient-to-br from-white/95 to-white/30 shadow-[0_0_60px_rgba(180,160,255,0.55)]" />
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
          className="h-auto w-[78%] max-w-xl"
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
          <g
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1"
            strokeDasharray="2 4"
          >
            <line x1="180" y1="140" x2="180" y2="40" />
            <line x1="180" y1="40" x2="300" y2="40" />
          </g>
          <g fill="rgba(255,255,255,0.85)" fontFamily="ui-monospace, monospace" fontSize="9">
            <text x="306" y="44">FOV · 52°</text>
            <text x="306" y="58" fill="rgba(255,255,255,0.45)">peripheral type</text>
          </g>
        </svg>
      </div>
      <div className="absolute inset-x-0 bottom-10 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.3em] text-foreground/40">
        <span>Halo R1</span>
        <span className="h-px w-12 bg-white/10" />
        <span>On-glass UI</span>
      </div>
      <CornerCrosshairs />
    </div>
  );
}

function PulseVisual() {
  return (
    <div className="relative h-full w-full bg-[linear-gradient(135deg,#0d0808,#150a0a_55%,#080605)]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-64 w-64 md:h-80 md:w-80">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(244,114,182,0.25),_transparent_60%)] blur-2xl" />
          <div className="absolute inset-6 rounded-full border border-white/10" />
          <div className="absolute inset-14 rounded-full border border-white/10" />
          <div className="absolute inset-24 rounded-full border border-white/10" />
          {[...Array(6)].map((_, i) => {
            const a = (i / 6) * Math.PI * 2;
            const x = 50 + Math.cos(a) * 32;
            const y = 50 + Math.sin(a) * 32;
            return (
              <motion.div
                key={i}
                className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.7)]"
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
            className="absolute left-1/2 top-1/2 h-32 w-48 -translate-x-1/2 -translate-y-1/2"
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
      <div className="absolute inset-0 flex items-center justify-center px-8">
        <div className="relative w-full max-w-md">
          {[
            { t: "00:42", text: "the corner of 5th & Bond, light off the awning" },
            { t: "11:18", text: "remember to ask M about the framing — quiet, not loud" },
            { t: "16:04", text: "color study · oat, ash, the faintest blush" },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, rotate: 0 }}
              whileInView={{
                opacity: 1,
                y: i * 14,
                rotate: (i - 1) * 2,
              }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 1,
                delay: i * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mb-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]"
              style={{ marginLeft: `${i * 8}px` }}
            >
              <div className="flex items-center justify-between text-[10.5px] uppercase tracking-[0.22em] text-foreground/40">
                <span>note · {String(i + 1).padStart(2, "0")}</span>
                <span>{card.t}</span>
              </div>
              <div className="mt-2 font-serif text-[15px] italic leading-snug text-foreground/85">
                {card.text}
              </div>
              <div className="mt-3 flex gap-1">
                <span className="h-px flex-1 bg-white/10" />
                <span className="h-1 w-1 rounded-full bg-emerald-300/70" />
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
    <div aria-hidden className="pointer-events-none absolute inset-3 text-white/15">
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
