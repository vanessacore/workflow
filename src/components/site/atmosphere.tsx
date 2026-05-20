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

// Every star is intentionally tiny — mostly 1px, with a rare 1.25px speck on
// the nearest layer to give a hint of depth. Deeper layers stay dimmer so the
// field reads as distant dust rather than a hero element.
function seededStars(
  count: number,
  seed: number,
  opts: { sizeBias?: "far" | "mid" | "near" } = {}
): Star[] {
  const rand = makeRand(seed);
  const bias = opts.sizeBias ?? "far";
  return Array.from({ length: count }, () => {
    const sizePick = rand();
    let size: number;
    if (bias === "far") {
      size = 1;
    } else if (bias === "mid") {
      size = sizePick < 0.96 ? 1 : 1.25;
    } else {
      size = sizePick < 0.88 ? 1 : 1.25;
    }
    const opacityFloor =
      bias === "far" ? 0.25 : bias === "mid" ? 0.35 : 0.5;
    const opacityRange =
      bias === "far" ? 0.25 : bias === "mid" ? 0.3 : 0.35;
    return {
      left: `${rand() * 100}%`,
      top: `${rand() * 100}%`,
      size,
      duration: 3.6 + rand() * 6.4,
      delay: rand() * 9,
      baseOpacity: opacityFloor + rand() * opacityRange,
      twinkleOpacity: 0.8 + rand() * 0.2,
    };
  });
}

// Three layers of tiny stars stacked back-to-front. The first entry is the
// deepest layer (drawn underneath); the last is closest to the viewer.
// `depth` is the max pixel translation when the cursor hits a viewport edge —
// deeper layers sweep more dramatically while the near layer barely budges,
// which sells the parallax illusion.
const LAYERS = [
  { count: 260, seed: 808,  bias: "far"  as const, depth: 64 },
  { count: 160, seed: 1337, bias: "mid"  as const, depth: 32 },
  { count: 90,  seed: 4242, bias: "near" as const, depth: 12 },
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
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
    >
      {layers.map((layer, i) => (
        <ParallaxLayer
          key={i}
          mx={smx}
          my={smy}
          depth={layer.depth}
          reduce={!!reduce}
        >
          <StarField stars={layer.stars} reduce={!!reduce} />
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
}: {
  stars: Star[];
  reduce: boolean;
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
