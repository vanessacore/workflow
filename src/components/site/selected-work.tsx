"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
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
  href?: string;
  cta?: string;
};

const projects: Project[] = [
  {
    index: "01",
    year: "2022 —",
    title: "Meta",
    subtitle: "AI-native product",
    description:
      "Four years designing AI-native experiences at Meta. The work is confidential; the posture is the same — calm systems, tight collaboration, interfaces people can finish.",
    tags: ["AI", "Systems", "Confidential"],
    accent: "from-violet-400/40 via-fuchsia-300/20 to-transparent",
    visual: <MetaVisual />,
  },
  {
    index: "02",
    year: "2021",
    title: "Weee!",
    subtitle: "Continuous in-app NPS",
    description:
      "A feedback system that asked at the right moment — order confirmation and account — and earned 1k+ NPS responses a day, 10× the goal, with store ratings up ~200%.",
    tags: ["Ecommerce", "NPS", "Growth"],
    accent: "from-orange-300/35 via-amber-300/15 to-transparent",
    visual: <WeeeVisual />,
    href: "/work/weee-nps",
    cta: "Case study",
  },
  {
    index: "03",
    year: "2021",
    title: "Gilded",
    subtitle: "Digital gold trading",
    description:
      "End-to-end B2C and B2B for buying and holding real gold. Simplified signup, rebuilt purchase and assets, and visualized financial information for advisors and individuals.",
    tags: ["Fintech", "B2B", "Web"],
    accent: "from-amber-300/35 via-yellow-200/15 to-transparent",
    visual: <GildedVisual />,
  },
  {
    index: "04",
    year: "2020",
    title: "Pinpoint",
    subtitle: "0→1 diagnostic app",
    description:
      "Mobile experience for a 30-second Covid-19 antigen test, plus a site redesign that lifted investor and distributor inquiries 40% in a month.",
    tags: ["Biotech", "Mobile", "0→1"],
    accent: "from-cyan-300/30 via-blue-300/20 to-transparent",
    visual: <PinpointVisual />,
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
          description="Shipped work I can talk about in public — plus the current chapter at Meta, which stays inside the building."
        />
      </Reveal>

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

function ProjectCta({ project }: { project: Project }) {
  if (!project.href) {
    return (
      <span className="text-[11.5px] font-medium uppercase tracking-[0.16em] text-foreground/40">
        {project.cta ?? "Confidential"}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-foreground/75">
      {project.cta ?? "Case study"}
      <span className="relative h-px w-5 bg-white/30 transition-all group-hover:w-8 group-hover:bg-white/70" />
    </span>
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
          project.accent,
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
            <ProjectCta project={project} />
          </div>
        </div>
      </div>
      {project.href ? (
        <Link
          href={project.href}
          className="absolute inset-0 z-20"
          aria-label={`${project.title} case study`}
        />
      ) : null}
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
          project.accent,
        )}
      />
      <div className="pointer-events-none absolute inset-px rounded-[calc(1.5rem-1px)] bg-black/40" />

      <div
        className={cn(
          "relative grid grid-cols-1 gap-0",
          reverse && "[&>*:first-child]:order-2",
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
            <ProjectCta project={project} />
          </div>
        </div>
      </div>
      {project.href ? (
        <Link
          href={project.href}
          className="absolute inset-0 z-20"
          aria-label={`${project.title} case study`}
        />
      ) : null}
    </motion.article>
  );
}

function MetaVisual() {
  return (
    <div className="relative h-full w-full bg-[linear-gradient(135deg,#0a0a0f,#0f0a18_50%,#0a0810)]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-40 w-40 md:h-48 md:w-48">
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,#a78bfa66,#60a5fa55,#f0abfc44,#a78bfa66)] blur-2xl animate-pulse-soft" />
          <div className="absolute inset-3 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm" />
          <div className="absolute inset-7 rounded-full border border-white/10 bg-black/60" />
          <div className="absolute inset-[2.75rem] rounded-full bg-gradient-to-br from-white/95 to-white/30 shadow-[0_0_60px_rgba(180,160,255,0.55)]" />
        </div>
      </div>
      <CornerCrosshairs />
    </div>
  );
}

function WeeeVisual() {
  return (
    <div className="relative h-full w-full bg-[linear-gradient(135deg,#120a06,#1a0e08_55%,#0c0704)]">
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="w-full max-w-[11rem] rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-sm">
          <div className="text-[9px] uppercase tracking-[0.22em] text-foreground/45">
            How likely to recommend?
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[9px] text-foreground/40">0</span>
            <div className="relative h-1.5 flex-1 rounded-full bg-white/10">
              <div className="absolute inset-y-0 left-0 w-[78%] rounded-full bg-gradient-to-r from-orange-400/80 to-amber-200" />
              <div className="absolute top-1/2 left-[78%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
            </div>
            <span className="text-[9px] text-foreground/40">10</span>
          </div>
          <div className="mt-3 font-serif text-[18px] italic text-foreground/90">
            1,000+
            <span className="ml-1 text-[10px] not-italic uppercase tracking-[0.16em] text-foreground/45">
              / day
            </span>
          </div>
        </div>
      </div>
      <CornerCrosshairs />
    </div>
  );
}

function GildedVisual() {
  return (
    <div className="relative h-full w-full bg-[linear-gradient(135deg,#100c04,#161004_55%,#0a0804)]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-28 w-28 rounded-full border border-amber-200/30 bg-[radial-gradient(circle_at_30%_30%,#fde68a,#b45309_62%,#451a03)] shadow-[0_0_40px_rgba(251,191,36,0.35)]">
          <div className="absolute inset-[18%] rounded-full border border-amber-100/20" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-2xl italic text-amber-50/90">
            Au
          </div>
        </div>
      </div>
      <CornerCrosshairs />
    </div>
  );
}

function PinpointVisual() {
  return (
    <div className="relative h-full w-full bg-[linear-gradient(135deg,#070a10,#0a1018_50%,#06080c)]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-36 w-24 rounded-[1.4rem] border border-white/20 bg-black/50 p-2 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]">
          <div className="flex h-full flex-col rounded-[1rem] border border-white/10 bg-gradient-to-b from-cyan-950/80 to-black p-2">
            <div className="text-[7px] uppercase tracking-[0.2em] text-cyan-100/60">
              Result
            </div>
            <div className="mt-auto font-serif text-[13px] italic text-cyan-50">
              30s
            </div>
            <div className="text-[8px] text-cyan-100/50">antigen test</div>
          </div>
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
