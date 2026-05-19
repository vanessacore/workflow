"use client";

import Spline from "@splinetool/react-spline";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useMemo } from "react";

type Star = {
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  baseOpacity: number;
  twinkleOpacity: number;
};

function makeRand(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

// `sizeBias` controls how tiny the stars are. Lower = smaller. Far layers use
// the smallest stars; the closer foreground layer is allowed a few slightly
// brighter pixels but everything stays sub-pixel-feeling on a normal screen.
function seededStars(
  count: number,
  seed: number,
  opts: { sizeBias?: "tiny" | "small" | "near" } = {}
): Star[] {
  const rand = makeRand(seed);
  const bias = opts.sizeBias ?? "tiny";
  return Array.from({ length: count }, () => {
    const sizePick = rand();
    let size: number;
    if (bias === "tiny") {
      size = sizePick < 0.9 ? 1 : 1.25;
    } else if (bias === "small") {
      size = sizePick < 0.78 ? 1 : sizePick < 0.97 ? 1.25 : 1.5;
    } else {
      size = sizePick < 0.6 ? 1 : sizePick < 0.92 ? 1.25 : sizePick < 0.99 ? 1.5 : 1.75;
    }
    return {
      left: `${rand() * 100}%`,
      top: `${rand() * 100}%`,
      size,
      duration: 3.6 + rand() * 6.4,
      delay: rand() * 9,
      // Stars sit alongside the bright 95% dotted sphere, so they need
      // to read clearly against the dark background rather than being
      // a barely-visible texture.
      baseOpacity: 0.4 + rand() * 0.35,
      twinkleOpacity: 0.85 + rand() * 0.15,
    };
  });
}

export function Atmosphere() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  // Heavier spring smoothing so the scroll-driven parallax responds slowly.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 28,
    mass: 0.6,
  });

  // Three independent star fields so layered parallax reads as depth rather
  // than a single field sliding behind the sphere.
  const farStars = useMemo(() => seededStars(160, 1337, { sizeBias: "tiny" }), []);
  const midStars = useMemo(() => seededStars(90, 4242, { sizeBias: "small" }), []);
  const nearStars = useMemo(() => seededStars(44, 9001, { sizeBias: "near" }), []);

  // Pick 5 deterministic near-layer particles and attach dummy labels. Anchored
  // to the near star field so the labels track with their stars under parallax.
  const labeledParticles = useMemo(() => {
    const rand = makeRand(2222);
    const picks = new Set<number>();
    while (picks.size < 5) {
      picks.add(Math.floor(rand() * nearStars.length));
    }
    return Array.from(picks).map((idx, i) => ({
      star: nearStars[idx],
      text: `Work ${i + 1}`,
    }));
  }, [nearStars]);

  // Per-layer parallax: far moves the least, near the most. Vertical drift is
  // larger than horizontal so scrolling reads as descent through the field.
  const farY = useTransform(smooth, [0, 1], ["0%", "-4%"]);
  const farX = useTransform(smooth, [0, 1], ["0%", "1.5%"]);
  const midY = useTransform(smooth, [0, 1], ["0%", "-9%"]);
  const midX = useTransform(smooth, [0, 1], ["0%", "3%"]);
  const nearY = useTransform(smooth, [0, 1], ["0%", "-16%"]);
  const nearX = useTransform(smooth, [0, 1], ["0%", "5%"]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        // Shared base used to size both the gradient sphere and the Spline
        // canvas. Capped at the original 42rem on large displays, and scaled
        // down with vmin on smaller viewports so the sphere never overflows
        // the screen. Both layers derive from this single value so the
        // Spline mesh stays aligned with the gradient sphere body at every
        // screen size.
        ["--sphere-size" as string]: "min(42rem, 85vmin)",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.04),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(40,30,100,0.14),_transparent_55%)]" />

      <ParallaxLayer x={farX} y={farY} reduce={!!reduce}>
        <StarField stars={farStars} reduce={!!reduce} glow={false} />
      </ParallaxLayer>
      <ParallaxLayer x={midX} y={midY} reduce={!!reduce}>
        <StarField stars={midStars} reduce={!!reduce} glow={false} />
      </ParallaxLayer>
      <ParallaxLayer x={nearX} y={nearY} reduce={!!reduce}>
        <StarField stars={nearStars} reduce={!!reduce} glow />
        <ParticleLabels labels={labeledParticles} />
      </ParallaxLayer>

      <SplineSphere />

      <div className="absolute inset-0 grain opacity-[0.3] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.45)_85%,#000)]" />
      <div className="absolute inset-x-0 top-0 h-px hairline" />
    </div>
  );
}

function ParallaxLayer({
  children,
  x,
  y,
  scale,
  opacity,
  reduce,
}: {
  children: React.ReactNode;
  x?: MotionValue<string>;
  y?: MotionValue<string>;
  scale?: MotionValue<number>;
  opacity?: MotionValue<number>;
  reduce: boolean;
}) {
  const style = reduce
    ? undefined
    : ({ x, y, scale, opacity } as Record<string, MotionValue<string | number> | undefined>);
  return (
    <motion.div style={style} className="absolute inset-0 will-change-transform">
      {children}
    </motion.div>
  );
}

function SplineSphere() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {/*
        Canvas size is derived from the shared `--sphere-size` variable so
        the visible 3D mesh stays ~15% larger than the gradient sphere's
        visible body at every viewport size. The 80/42 multiplier matches
        the original fixed 80rem-canvas / 42rem-sphere ratio. The Spline
        scene renders its mesh near the canvas center, so the centered
        wrapper lands the visible content on the gradient sphere's center.
      */}
      <div
        className="relative"
        style={{
          width: "calc(var(--sphere-size) * 80 / 42)",
          height: "calc(var(--sphere-size) * 80 / 42)",
        }}
      >
        <Spline scene="https://prod.spline.design/x8loCVRSMhnir2Bk/scene.splinecode" />
      </div>
    </div>
  );
}

function ParticleLabels({
  labels,
}: {
  labels: { star: Star; text: string }[];
}) {
  return (
    <div className="absolute inset-0">
      {labels.map((l, i) => (
        <span
          key={i}
          className="absolute -translate-x-1/2 text-[10.5px] font-medium uppercase tracking-[0.22em] whitespace-nowrap text-white/80"
          style={{
            left: l.star.left,
            top: `calc(${l.star.top} + ${Math.max(l.star.size, 1) + 8}px)`,
            textShadow: "0 0 10px rgba(0,0,0,0.7)",
          }}
        >
          {l.text}
        </span>
      ))}
    </div>
  );
}

function StarField({
  stars,
  reduce,
  glow,
}: {
  stars: Star[];
  reduce: boolean;
  glow: boolean;
}) {
  return (
    <div className="absolute inset-0">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.baseOpacity,
            boxShadow:
              glow && s.size >= 1.25
                ? `0 0 ${s.size * 2.5}px rgba(255,255,255,0.7)`
                : undefined,
            animation: reduce
              ? undefined
              : `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            ["--star-min" as string]: s.baseOpacity.toString(),
            ["--star-max" as string]: s.twinkleOpacity.toString(),
          }}
        />
      ))}
    </div>
  );
}
