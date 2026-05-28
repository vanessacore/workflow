"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

type Slide = {
  index: string;
  eyebrow: string;
  title: string;
  italic?: string;
  body: string;
  meta?: { label: string; value: string }[];
  accent: string;
};

const slides: Slide[] = [
  {
    index: "00",
    eyebrow: "Case Study · 01",
    title: "Aura —",
    italic: "an assistant that listens before it speaks.",
    body: "A glanceable, ambient AI companion designed to disappear into the rhythm of the day. This is the long-form story behind the system — the constraints, the prototypes, and the quiet decisions that shaped it.",
    meta: [
      { label: "Role", value: "Lead Product Designer" },
      { label: "Year", value: "2024 — 2025" },
      { label: "Team", value: "4 designers · 11 engineers" },
      { label: "Platform", value: "iOS · watchOS · Glass" },
    ],
    accent: "from-violet-400/30 via-fuchsia-300/15 to-transparent",
  },
  {
    index: "01",
    eyebrow: "Context",
    title: "The brief —",
    italic: "make AI feel less like a stage, more like a room.",
    body: "Most assistants demand a spotlight: wake words, modal screens, a stack of confirmations. We were asked to design the opposite — a companion that earns trust by getting out of the way, surfacing only what matters, and never breaking the moment.",
    meta: [
      { label: "Constraint", value: "Sub-200ms response" },
      { label: "Constraint", value: "On-device first" },
      { label: "North star", value: "Calm > clever" },
    ],
    accent: "from-indigo-400/25 via-violet-300/15 to-transparent",
  },
  {
    index: "02",
    eyebrow: "Discovery",
    title: "Six weeks of —",
    italic: "shadowing the in-between moments.",
    body: "We followed 22 people through their mornings, commutes, and quiet evenings. The findings were unromantic and useful: people don't want to talk to their devices, they want their devices to already know. The opportunity lived in the seam between intention and action.",
    meta: [
      { label: "Interviews", value: "22 participants" },
      { label: "Diary studies", value: "14 days" },
      { label: "Cities", value: "SF · NYC · Tokyo" },
    ],
    accent: "from-cyan-300/25 via-blue-300/15 to-transparent",
  },
  {
    index: "03",
    eyebrow: "Process",
    title: "Prototyping —",
    italic: "the texture of a presence.",
    body: "We built 30+ prototypes — most of them threw away. The ones that survived weren't the cleverest; they were the ones that let silence happen. We tuned latency, animation curves, and haptic grammar until the assistant felt less like a tool and more like a quiet roommate.",
    meta: [
      { label: "Prototypes", value: "32 explorations" },
      { label: "User tests", value: "9 rounds" },
      { label: "Survivors", value: "3 patterns" },
    ],
    accent: "from-emerald-300/25 via-teal-300/15 to-transparent",
  },
  {
    index: "04",
    eyebrow: "Solution",
    title: "A system that —",
    italic: "leans into ambient detail.",
    body: "The final design is a three-layer system: a passive ambient ring, a glanceable transient surface, and a focused conversational mode. Each layer is opt-in — you escalate up the stack only when you need to. Most interactions never leave the first layer.",
    meta: [
      { label: "Layers", value: "Ambient · Glance · Focus" },
      { label: "Components", value: "18 new patterns" },
      { label: "Motion specs", value: "47 documented" },
    ],
    accent: "from-amber-300/25 via-orange-300/15 to-transparent",
  },
  {
    index: "05",
    eyebrow: "Outcome",
    title: "Quiet wins —",
    italic: "and what we'd do again.",
    body: "Pilot users completed flows 38% faster while reporting lower cognitive load. More importantly, retention curves told a different story — people kept coming back not because the AI was impressive, but because it was forgettable in the best possible way.",
    meta: [
      { label: "Task completion", value: "+38% faster" },
      { label: "Self-reported calm", value: "+62%" },
      { label: "30-day retention", value: "84%" },
    ],
    accent: "from-rose-300/25 via-pink-300/15 to-transparent",
  },
];

export default function CaseStudy1Page() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  // We map the page's vertical scroll across the full height of the track
  // into a horizontal translation of the slide row. Each slide occupies one
  // viewport width, so we travel -(N-1) * 100vw in total.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    mass: 0.4,
  });

  const x = useTransform(
    reduce ? scrollYProgress : smooth,
    [0, 1],
    ["0vw", `-${(slides.length - 1) * 100}vw`],
  );

  return (
    <div className="relative w-full">
      <TopBar total={slides.length} progress={smooth} />

      {/* The tall scroll track. Height = N * 100vh so we have enough scroll
          distance to traverse all slides while the inner stage stays sticky. */}
      <div
        ref={trackRef}
        className="relative hidden md:block"
        style={{ height: `${slides.length * 100}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <motion.div
            style={{ x, width: `${slides.length * 100}vw` }}
            className="flex h-full will-change-transform"
          >
            {slides.map((slide, i) => (
              <SlidePanel key={slide.index} slide={slide} order={i} />
            ))}
          </motion.div>

          <SlideIndicators count={slides.length} progress={smooth} />
        </div>
      </div>

      {/* Mobile fallback: stack the slides vertically with the same content
          so small screens don't get a hijacked-scroll experience. */}
      <div className="flex flex-col gap-0 md:hidden">
        {slides.map((slide, i) => (
          <MobileSlide key={slide.index} slide={slide} order={i} />
        ))}
      </div>
    </div>
  );
}

function SlidePanel({ slide, order }: { slide: Slide; order: number }) {
  return (
    <section
      aria-label={`Slide ${order + 1} of ${slides.length}: ${slide.title}`}
      className="relative flex h-full w-screen flex-shrink-0 items-center justify-center px-16 lg:px-24"
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-70",
          slide.accent,
        )}
      />
      <div className="pointer-events-none absolute inset-0 bg-black/55" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14] mask-radial"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <CornerMarks />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-12 gap-10">
        <div className="col-span-12 flex items-start gap-4 text-[11px] uppercase tracking-[0.28em] text-foreground/45 lg:col-span-12">
          <span className="font-mono text-foreground/70">{slide.index}</span>
          <span className="h-px w-12 translate-y-[7px] bg-white/15" />
          <span>{slide.eyebrow}</span>
          <span className="ml-auto font-mono text-foreground/40">
            {String(order + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <h2 className="text-balance text-[clamp(2.5rem,5.5vw,5rem)] font-medium leading-[0.98] tracking-[-0.035em]">
            <span className="text-gradient">{slide.title}</span>
            {slide.italic && (
              <>
                {" "}
                <span className="font-serif italic text-gradient-accent">
                  {slide.italic}
                </span>
              </>
            )}
          </h2>
          <p className="mt-8 max-w-2xl text-pretty text-base leading-relaxed text-foreground/65 md:text-[15.5px] lg:text-base">
            {slide.body}
          </p>
        </div>

        {slide.meta && slide.meta.length > 0 && (
          <div className="col-span-12 lg:col-span-4">
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 backdrop-blur-md">
              <div className="text-[10.5px] uppercase tracking-[0.28em] text-foreground/45">
                Details
              </div>
              <dl className="mt-4 flex flex-col gap-3">
                {slide.meta.map((m) => (
                  <div
                    key={`${m.label}-${m.value}`}
                    className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-2 last:border-b-0 last:pb-0"
                  >
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-foreground/45">
                      {m.label}
                    </dt>
                    <dd className="text-right text-[13px] text-foreground/85">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function MobileSlide({ slide, order }: { slide: Slide; order: number }) {
  return (
    <section
      className="relative flex min-h-[100svh] w-full items-center px-6 py-24"
      aria-label={`Slide ${order + 1}: ${slide.title}`}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60",
          slide.accent,
        )}
      />
      <div className="pointer-events-none absolute inset-0 bg-black/60" />

      <div className="relative z-10 w-full">
        <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.28em] text-foreground/45">
          <span className="font-mono text-foreground/70">{slide.index}</span>
          <span className="h-px w-8 bg-white/15" />
          <span>{slide.eyebrow}</span>
        </div>
        <h2 className="mt-5 text-balance text-[clamp(2rem,9vw,3rem)] font-medium leading-[1] tracking-[-0.03em]">
          <span className="text-gradient">{slide.title}</span>
          {slide.italic && (
            <>
              {" "}
              <span className="font-serif italic text-gradient-accent">
                {slide.italic}
              </span>
            </>
          )}
        </h2>
        <p className="mt-5 text-pretty text-[15px] leading-relaxed text-foreground/65">
          {slide.body}
        </p>
        {slide.meta && (
          <dl className="mt-6 grid grid-cols-1 gap-2 rounded-2xl border border-white/8 bg-white/[0.02] p-4 backdrop-blur-md">
            {slide.meta.map((m) => (
              <div
                key={`${m.label}-${m.value}`}
                className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-2 last:border-b-0 last:pb-0"
              >
                <dt className="text-[10.5px] uppercase tracking-[0.18em] text-foreground/45">
                  {m.label}
                </dt>
                <dd className="text-right text-[12.5px] text-foreground/85">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

function TopBar({
  total,
  progress,
}: {
  total: number;
  progress: ReturnType<typeof useSpring>;
}) {
  const current = useTransform(progress, (v) => {
    const idx = Math.min(total, Math.max(1, Math.round(v * (total - 1)) + 1));
    return String(idx).padStart(2, "0");
  });
  const totalStr = String(total).padStart(2, "0");

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-10">
      <Link
        href="/"
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 text-[11.5px] font-medium uppercase tracking-[0.22em] text-foreground/75 backdrop-blur-md transition-colors hover:border-white/25 hover:text-foreground"
      >
        <BackArrow />
        Index
      </Link>
      <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-foreground/65 backdrop-blur-md md:inline-flex">
        <span className="font-mono text-foreground/85">
          <motion.span>{current}</motion.span>
        </span>
        <span className="h-px w-6 bg-white/20" />
        <span className="font-mono text-foreground/45">{totalStr}</span>
      </div>
    </div>
  );
}

function SlideIndicators({
  count,
  progress,
}: {
  count: number;
  progress: ReturnType<typeof useSpring>;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Indicator key={i} index={i} count={count} progress={progress} />
      ))}
    </div>
  );
}

function Indicator({
  index,
  count,
  progress,
}: {
  index: number;
  count: number;
  progress: ReturnType<typeof useSpring>;
}) {
  // Each dot lights up when the scroll progress is within its slice.
  const start = (index - 0.5) / (count - 1);
  const end = (index + 0.5) / (count - 1);
  const opacity = useTransform(progress, (v) =>
    v >= start && v <= end ? 1 : 0.25,
  );
  const scale = useTransform(progress, (v) =>
    v >= start && v <= end ? 1.4 : 1,
  );
  return (
    <motion.span
      style={{ opacity, scale }}
      className="block h-1 w-6 rounded-full bg-white"
    />
  );
}

function CornerMarks() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-4 text-white/15 md:inset-8"
    >
      {[
        "left-0 top-0",
        "right-0 top-0 rotate-90",
        "right-0 bottom-0 rotate-180",
        "left-0 bottom-0 -rotate-90",
      ].map((pos) => (
        <svg
          key={pos}
          className={cn("absolute h-3 w-3", pos)}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M0 0 H8 M0 0 V8" stroke="currentColor" strokeWidth="1" />
        </svg>
      ))}
    </div>
  );
}

function BackArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
      <path
        d="M11 7H3m0 0l3.5-3.5M3 7l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
