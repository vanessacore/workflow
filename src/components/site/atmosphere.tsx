"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useMemo } from "react";

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

// `sizeBias` controls how tiny the stars are. Lower = smaller. Deep layers use
// the smallest stars; closer layers are allowed a few slightly brighter pixels
// but everything stays sub-pixel-feeling on a normal screen.
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
      baseOpacity: 0.4 + rand() * 0.35,
      twinkleOpacity: 0.85 + rand() * 0.15,
    };
  });
}

// Layers stacked back-to-front. The first entry is the deepest layer (drawn
// underneath everything else); the last entry is the closest to the viewer.
// `depth` is the max pixel translation applied when the cursor reaches an
// edge of the viewport. Per design intent, the deeper (lower) layers shift
// more dramatically while the closer layers shift only a little — the
// background sweeps while the foreground stars feel almost pinned.
const LAYERS = [
  { count: 220, seed: 808,  bias: "tiny"  as const, depth: 56, glow: false },
  { count: 140, seed: 1337, bias: "tiny"  as const, depth: 28, glow: false },
  { count: 80,  seed: 4242, bias: "small" as const, depth: 12, glow: false },
  { count: 36,  seed: 9001, bias: "near"  as const, depth: 4,  glow: true  },
];

export function Atmosphere() {
  const reduce = useReducedMotion();

  // Raw cursor position, normalized to [-1, 1] across the viewport.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Spring-smoothed so the field glides rather than snaps with each pointer
  // sample. Lower stiffness / higher damping = slower, calmer drift.
  const smx = useSpring(mx, { stiffness: 50, damping: 18, mass: 0.5 });
  const smy = useSpring(my, { stiffness: 50, damping: 18, mass: 0.5 });

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mx.set((e.clientX / w) * 2 - 1);
      my.set((e.clientY / h) * 2 - 1);
    };
    const onLeave = () => {
      mx.set(0);
      my.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [mx, my, reduce]);

  const layers = useMemo(
    () =>
      LAYERS.map((l) => ({
        ...l,
        stars: seededStars(l.count, l.seed, { sizeBias: l.bias }),
      })),
    []
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {layers.map((layer, i) => (
        <ParallaxLayer
          key={i}
          mx={smx}
          my={smy}
          depth={layer.depth}
          reduce={!!reduce}
        >
          <StarField stars={layer.stars} reduce={!!reduce} glow={layer.glow} />
        </ParallaxLayer>
      ))}
    </div>
  );
}

function ParallaxLayer({
  children,
  mx,
  my,
  depth,
  reduce,
}: {
  children: React.ReactNode;
  mx: MotionValue<number>;
  my: MotionValue<number>;
  depth: number;
  reduce: boolean;
}) {
  // Negated translation: stars shift opposite to the cursor so it reads as
  // "looking around" through a 3D field rather than the cursor dragging the
  // stars with it.
  const x = useTransform(mx, (v) => `${-v * depth}px`);
  const y = useTransform(my, (v) => `${-v * depth}px`);
  return (
    <motion.div
      style={reduce ? undefined : { x, y }}
      className="absolute inset-0 will-change-transform"
    >
      {children}
    </motion.div>
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
