"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  type MotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { CaseStudySlide } from "@/components/site/case-study-types";
import { cn } from "@/lib/utils";

type CaseStudyDeckProps = {
  slides: CaseStudySlide[];
};

// How long a single snap animation is allowed to take before we accept the
// next wheel/key/swipe input. Tuned to feel decisive but not sticky.
const SNAP_LOCK_MS = 750;
// Ignore wheel jitter below this magnitude — touchpad inertia trails off
// with many tiny deltas after a flick.
const WHEEL_MIN_DELTA = 4;
// Touch swipe distance needed to count as a slide change.
const TOUCH_THRESHOLD = 40;

export function CaseStudyDeck({ slides }: CaseStudyDeckProps) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  // The pagination indicators animate against this discrete index rather
  // than the raw scroll spring, so each dot has its own spring-driven
  // width/opacity transition that stays visible even when the user jumps
  // many slides at once (e.g. Home/End keys).
  const [activeIndex, setActiveIndex] = useState(0);

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

  useMotionValueEvent(smooth, "change", (v) => {
    const N = slides.length;
    const idx = Math.max(0, Math.min(N - 1, Math.round(v * (N - 1))));
    setActiveIndex((prev) => (prev === idx ? prev : idx));
  });

  // Page-snap controller. We hijack wheel/keyboard/touch on desktop and
  // animate window.scrollTo to one of N discrete scroll positions — one per
  // slide — so each input gesture moves exactly one slide instead of free
  // scrolling. The existing useScroll → useSpring → x chain still drives the
  // horizontal motion; it just gets fed discrete scroll targets now.
  const scrollToIndex = useCallback(
    (i: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const trackTop = window.scrollY + rect.top;
      const totalScroll = el.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const N = slides.length;
      const clamped = Math.max(0, Math.min(N - 1, i));
      const targetY = trackTop + (clamped / (N - 1)) * totalScroll;
      window.scrollTo({
        top: targetY,
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [reduce, slides.length],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const N = slides.length;
    const desktopMq = window.matchMedia("(min-width: 48rem)");
    const isDesktop = () => desktopMq.matches;

    const getCurrentIndex = () => {
      const el = trackRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const trackTop = window.scrollY + rect.top;
      const totalScroll = el.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return 0;
      const progress = (window.scrollY - trackTop) / totalScroll;
      return Math.max(0, Math.min(N - 1, Math.round(progress * (N - 1))));
    };

    let locked = false;
    let unlockTimer: number | undefined;
    const lock = () => {
      locked = true;
      if (unlockTimer) window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(
        () => {
          locked = false;
        },
        reduce ? 0 : SNAP_LOCK_MS,
      );
    };

    const advance = (delta: number) => {
      if (locked) return;
      const next = getCurrentIndex() + delta;
      scrollToIndex(next);
      lock();
    };

    const onWheel = (e: WheelEvent) => {
      if (!isDesktop()) return;
      // We are the entire page's content; always intercept on desktop so the
      // scroll always feels paged rather than free.
      e.preventDefault();
      if (locked) return;
      const delta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < WHEEL_MIN_DELTA) return;
      advance(Math.sign(delta));
    };

    const onKey = (e: KeyboardEvent) => {
      if (!isDesktop()) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (
        e.key === "ArrowRight" ||
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        e.key === " "
      ) {
        e.preventDefault();
        advance(1);
      } else if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowUp" ||
        e.key === "PageUp"
      ) {
        e.preventDefault();
        advance(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        if (!locked) {
          scrollToIndex(0);
          lock();
        }
      } else if (e.key === "End") {
        e.preventDefault();
        if (!locked) {
          scrollToIndex(N - 1);
          lock();
        }
      }
    };

    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (!isDesktop()) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!isDesktop()) return;
      const dx = touchStartX - e.changedTouches[0].clientX;
      const dy = touchStartY - e.changedTouches[0].clientY;
      const d = Math.abs(dy) > Math.abs(dx) ? dy : dx;
      if (Math.abs(d) < TOUCH_THRESHOLD) return;
      advance(d > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      if (unlockTimer) window.clearTimeout(unlockTimer);
    };
  }, [reduce, scrollToIndex, slides.length]);

  return (
    <div className="relative w-full">
      <TopBar total={slides.length} progress={smooth} />

      {/* The tall scroll track. Height = N * 100vh so we have enough scroll
          distance to traverse all slides while the inner stage stays sticky.
          The track height also gives us the N discrete scroll positions we
          snap between on each wheel/key/swipe input. */}
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
              <SlidePanel
                key={slide.index}
                slide={slide}
                order={i}
                slideCount={slides.length}
              />
            ))}
          </motion.div>

          {/* Parallax starfield rides on top of the slides with screen blend so
              bright pixels (stars) shine over dark slide backgrounds without
              muddying the text. Layers translate at different magnitudes and
              arc along a sin curve to mimic motion across a sphere's surface. */}
          <StarField progress={smooth} />

          <SlideIndicators
            count={slides.length}
            activeIndex={activeIndex}
            onSelect={scrollToIndex}
          />
        </div>
      </div>

      {/* Mobile fallback: stack the slides vertically with the same content
          so small screens don't get a hijacked-scroll experience. */}
      <div className="flex flex-col gap-0 md:hidden">
        {slides.map((slide, i) => (
          <MobileSlide
            key={slide.index}
            slide={slide}
            order={i}
            slideCount={slides.length}
          />
        ))}
      </div>
    </div>
  );
}

function SlidePanel({
  slide,
  order,
  slideCount,
}: {
  slide: CaseStudySlide;
  order: number;
  slideCount: number;
}) {
  return (
    <section
      aria-label={`Slide ${order + 1} of ${slideCount}: ${slide.title}`}
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
            {String(order + 1).padStart(2, "0")} / {String(slideCount).padStart(2, "0")}
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

function MobileSlide({
  slide,
  order,
  slideCount,
}: {
  slide: CaseStudySlide;
  order: number;
  slideCount: number;
}) {
  return (
    <section
      className="relative flex min-h-[100svh] w-full items-center px-6 py-24"
      aria-label={`Slide ${order + 1} of ${slideCount}: ${slide.title}`}
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
        Back to home
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
  activeIndex,
  onSelect,
}: {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="absolute inset-x-0 bottom-8 z-20 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Indicator
          key={i}
          index={i}
          isActive={i === activeIndex}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

// Inactive dots are 8px circles; the active dot scales to a 32px pill via
// its own spring. The flex container's gap-4 keeps a constant 16px between
// dots, and because each dot animates its width independently the row
// reflows its x-positions smoothly as widths change.
const DOT_INACTIVE_WIDTH = 8;
const DOT_ACTIVE_WIDTH = 32;
const DOT_SPRING = { type: "spring", stiffness: 360, damping: 32, mass: 0.9 } as const;

function Indicator({
  index,
  isActive,
  onSelect,
}: {
  index: number;
  isActive: boolean;
  onSelect: (index: number) => void;
}) {
  return (
    <button
      type="button"
      aria-label={`Go to slide ${index + 1}`}
      aria-current={isActive ? "true" : undefined}
      onClick={() => onSelect(index)}
      className="group inline-flex items-center justify-center py-3 cursor-pointer"
    >
      <motion.span
        aria-hidden
        initial={false}
        animate={{
          width: isActive ? DOT_ACTIVE_WIDTH : DOT_INACTIVE_WIDTH,
          opacity: isActive ? 1 : 0.4,
        }}
        transition={DOT_SPRING}
        className="block h-2 rounded-full bg-white group-hover:opacity-100"
      />
    </button>
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

// Parallax starfield. Four depth layers traverse different horizontal
// distances (closer = more) and arc along a sin curve (closer = larger arc)
// so the cumulative path length resembles a slice of motion along a sphere
// rather than a flat translate. Star positions are seeded so SSR and client
// produce identical markup; per-star twinkle is driven by a CSS keyframe so
// it costs nothing on the scroll path.
type StarLayerConfig = {
  count: number;
  travelVw: number;
  arcAmpVh: number;
  sizePx: number;
  baseOpacity: number;
  glowPx: number;
  twinkleSec: [number, number];
  seed: number;
};

// Tuned so the layer-to-layer deltas are visible at a glance. The closest
// layer travels ~60vw across the full deck (≈12vw between adjacent slides)
// and arcs ~10vh through the midpoint; the farthest barely budges.
const STAR_LAYERS: StarLayerConfig[] = [
  { count: 22, travelVw: 60, arcAmpVh: 10, sizePx: 3.2, baseOpacity: 1.0, glowPx: 4, twinkleSec: [2.6, 4.4], seed: 0x9e3779 },
  { count: 44, travelVw: 32, arcAmpVh: 5.5, sizePx: 2.1, baseOpacity: 0.9, glowPx: 2, twinkleSec: [3.8, 6.2], seed: 0x517cc1 },
  { count: 80, travelVw: 14, arcAmpVh: 2.8, sizePx: 1.35, baseOpacity: 0.7, glowPx: 0.7, twinkleSec: [5, 9], seed: 0xb5297a },
  { count: 140, travelVw: 4, arcAmpVh: 0.8, sizePx: 0.85, baseOpacity: 0.55, glowPx: 0, twinkleSec: [7, 13], seed: 0x0a3d62 },
];

type Star = {
  xPct: number;
  yPct: number;
  opacity: number;
  delay: number;
  duration: number;
};

// Deterministic 32-bit hash → [0,1). Used so star positions are identical on
// server and client (no hydration mismatch) and stable across renders.
function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateStars(layer: StarLayerConfig): Star[] {
  const rand = mulberry32(layer.seed);
  const [tMin, tMax] = layer.twinkleSec;
  // xPct spans 0..100 of a 200vw-wide layer centered on the viewport, so
  // stars exist across the full -50vw..+150vw band. That keeps the visible
  // 0..100vw window populated as the layer translates horizontally without
  // leaving an obvious empty edge.
  return Array.from({ length: layer.count }, () => ({
    xPct: rand() * 100,
    yPct: rand() * 100,
    opacity: layer.baseOpacity * (0.55 + rand() * 0.45),
    delay: -rand() * tMax,
    duration: tMin + rand() * (tMax - tMin),
  }));
}

function StarField({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ mixBlendMode: "screen" }}
    >
      {STAR_LAYERS.map((layer, i) => (
        <StarLayer
          key={i}
          layer={layer}
          progress={progress}
          reduce={!!reduce}
        />
      ))}
    </div>
  );
}

function StarLayer({
  layer,
  progress,
  reduce,
}: {
  layer: StarLayerConfig;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const stars = useMemo(() => generateStars(layer), [layer]);

  // Camera pans right through the scene, so stars drift left. Each layer's
  // travel is its own depth-scaled fraction of total progress.
  const x = useTransform(
    progress,
    [0, 1],
    reduce ? ["0vw", "0vw"] : ["0vw", `-${layer.travelVw}vw`],
  );
  // Sphere-style arc: y peaks (negative = up) at the midpoint of the scroll
  // range and returns to 0 at both ends. Closer layers arc more.
  const y = useTransform(progress, (p) =>
    reduce ? "0vh" : `${-Math.sin(p * Math.PI) * layer.arcAmpVh}vh`,
  );

  return (
    <motion.div
      // 200vw-wide layer centered on the viewport (-50vw .. +150vw). The
      // layer translates by at most ~60vw in either direction, so the
      // visible 0..100vw window is always covered by stars instead of
      // showing an empty band on the side the layer is sliding away from.
      className="absolute inset-y-0 will-change-transform"
      style={{ x, y, left: "-50vw", right: "-50vw" }}
    >
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.xPct}%`,
            top: `${s.yPct}%`,
            width: `${layer.sizePx}px`,
            height: `${layer.sizePx}px`,
            opacity: s.opacity,
            boxShadow:
              layer.glowPx > 0
                ? `0 0 ${layer.glowPx}px rgba(255,255,255,0.9)`
                : undefined,
            animation: reduce
              ? undefined
              : `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            // Custom-property bounds the existing `twinkle` keyframe reads.
            ["--star-min" as string]: `${(s.opacity * 0.25).toFixed(3)}`,
            ["--star-max" as string]: `${Math.min(1, s.opacity * 1.25).toFixed(3)}`,
          }}
        />
      ))}
    </motion.div>
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
