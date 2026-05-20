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

// Layers stacked back-to-front. The first entry is the deepest (least mouse
// response); the last entry is the closest to the viewer (most response).
// `depth` is the max pixel translation applied when the cursor reaches an
// edge of the viewport. Foreground layers shift far more than background
// layers to read as depth.
const LAYERS = [
  { count: 220, seed: 808,  bias: "tiny"  as const, depth: 4,  glow: false },
  { count: 140, seed: 1337, bias: "tiny"  as const, depth: 10, glow: false },
  { count: 80,  seed: 4242, bias: "small" as const, depth: 22, glow: false },
  { count: 36,  seed: 9001, bias: "near"  as const, depth: 48, glow: true  },
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

// Picks 5 deterministic points on the visible dotted sphere body, draws a
// highlighted "particle" anchor at each, a short leader line, and a label
// outside the sphere. Hovering a label scales it up and triggers a continuous
// wiggle so the annotation feels alive.
function SphereParticleLabels({ reduce }: { reduce: boolean }) {
  const items = useMemo(() => {
    const rand = makeRand(7777);
    return Array.from({ length: 5 }, (_, i) => {
      // Evenly distribute base angles around the sphere, then jitter each
      // by ~+/-20deg so the placement reads as "picked" rather than uniform.
      const baseAngle = (i / 5) * Math.PI * 2 - Math.PI / 2;
      const angle = baseAngle + (rand() - 0.5) * 0.7;
      // 0.40-0.47 of the box puts the anchor on the visible dotted sphere
      // body (the dotted ball occupies the central ~50% of --sphere-size).
      const radius = 0.4 + rand() * 0.07;
      return { angle, radius, text: `Work ${i + 1}` };
    });
  }, []);

  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: "var(--sphere-size)", height: "var(--sphere-size)" }}
    >
      {items.map((p, i) => {
        const cxPct = 50 + Math.cos(p.angle) * p.radius * 100;
        const cyPct = 50 + Math.sin(p.angle) * p.radius * 100;
        const outDx = Math.cos(p.angle);
        const outDy = Math.sin(p.angle);
        return (
          <ParticleLabel
            key={i}
            cxPct={cxPct}
            cyPct={cyPct}
            outDx={outDx}
            outDy={outDy}
            text={p.text}
            reduce={reduce}
          />
        );
      })}
    </div>
  );
}

function ParticleLabel({
  cxPct,
  cyPct,
  outDx,
  outDy,
  text,
  reduce,
}: {
  cxPct: number;
  cyPct: number;
  outDx: number;
  outDy: number;
  text: string;
  reduce: boolean;
}) {
  // Hover state is driven by the text span (small precise hit target) but the
  // animation runs on the outer motion wrapper so the dot, leader line, and
  // text all scale + wiggle together as a single annotation.
  const [hovered, setHovered] = useState(false);

  // Distance from the anchor particle dot to the start of the label, along
  // the outward radial direction. The leader line spans this distance.
  const leaderPx = 22;
  const labelGapPx = 5;
  const lineAngleRad = Math.atan2(outDy, outDx);
  const labelOnRight = outDx >= 0;

  const animate = hovered
    ? reduce
      ? { scale: 1.5, x: 0, y: 0, rotate: 0 }
      : {
          scale: 1.55,
          x: [0, -1.8, 2.4, -1.2, 1.6, 0],
          y: [0, 1.4, -2.0, 1.7, -1.1, 0],
          rotate: [0, -1.6, 2.0, -1.0, 1.2, 0],
        }
    : { scale: 1, x: 0, y: 0, rotate: 0 };

  const transition =
    hovered && !reduce
      ? {
          scale: { duration: 0.22, ease: "easeOut" as const },
          x: { duration: 1.1, repeat: Infinity, ease: "easeInOut" as const },
          y: { duration: 1.35, repeat: Infinity, ease: "easeInOut" as const },
          rotate: { duration: 1.05, repeat: Infinity, ease: "easeInOut" as const },
        }
      : { duration: 0.28, ease: "easeOut" as const };

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${cxPct}%`,
        top: `${cyPct}%`,
        // Scale + wiggle pivot on the anchor point so the dot stays glued to
        // its particle while the rest of the annotation grows outward.
        transformOrigin: "0% 50%",
      }}
      animate={animate}
      transition={transition}
    >
      {/* Highlighted particle dot anchored on the sphere surface. */}
      <span
        aria-hidden
        className="absolute block h-[4px] w-[4px] rounded-full bg-white"
        style={{
          left: 0,
          top: 0,
          transform: "translate(-50%, -50%)",
          boxShadow:
            "0 0 10px rgba(255,255,255,0.95), 0 0 22px rgba(180,200,255,0.7)",
        }}
      />
      {/* Leader line from the particle outward toward the label. */}
      <span
        aria-hidden
        className="absolute block h-px bg-white/40"
        style={{
          left: 0,
          top: 0,
          width: `${leaderPx}px`,
          transformOrigin: "0% 50%",
          transform: `rotate(${lineAngleRad}rad)`,
        }}
      />
      {/* Position wrapper for the text. The label span is the hover trigger
          via pointer-events:auto; the outer motion wrapper handles the actual
          scale + wiggle for the whole assembly. */}
      <div
        className="absolute"
        style={{
          left: `${outDx * (leaderPx + labelGapPx)}px`,
          top: `${outDy * (leaderPx + labelGapPx)}px`,
          transform: labelOnRight
            ? "translateY(-50%)"
            : "translate(-100%, -50%)",
        }}
      >
        <motion.span
          className="pointer-events-auto inline-block cursor-pointer select-none whitespace-nowrap text-[10.5px] font-medium uppercase tracking-[0.22em] text-white/85"
          style={{ textShadow: "0 0 10px rgba(0,0,0,0.75)" }}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
        >
          {text}
        </motion.span>
      </div>
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
