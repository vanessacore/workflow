"use client";

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

function seededStars(count: number, seed: number): Star[] {
  let state = seed >>> 0;
  const rand = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
  return Array.from({ length: count }, () => {
    const sizePick = rand();
    const size =
      sizePick < 0.72 ? 1 : sizePick < 0.94 ? 1.5 : sizePick < 0.99 ? 2 : 2.5;
    return {
      left: `${rand() * 100}%`,
      top: `${rand() * 100}%`,
      size,
      duration: 2.4 + rand() * 5.2,
      delay: rand() * 7,
      baseOpacity: 0.18 + rand() * 0.35,
      twinkleOpacity: 0.7 + rand() * 0.3,
    };
  });
}

// Multi-radial-gradient body of the sphere. Defined once and shared between
// the soft outer halo and the sharper inner highlight so the layers stay in
// sync as their positions/hues animate.
const SPHERE_GRADIENT =
  "radial-gradient(circle at 28% 30%, rgba(200,140,255,0.95), rgba(200,140,255,0) 48%)," +
  "radial-gradient(circle at 72% 32%, rgba(120,200,255,0.9), rgba(120,200,255,0) 50%)," +
  "radial-gradient(circle at 68% 74%, rgba(255,140,200,0.95), rgba(255,140,200,0) 50%)," +
  "radial-gradient(circle at 28% 70%, rgba(140,255,210,0.8), rgba(140,255,210,0) 52%)," +
  "radial-gradient(circle at 50% 50%, rgba(255,210,140,0.75), rgba(255,210,140,0) 62%)";

export function Atmosphere() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    mass: 0.4,
  });

  const stars = useMemo(() => seededStars(160, 1337), []);

  // Stars get a gentle parallax so the sphere reads as the foreground subject.
  const farY = useTransform(smooth, [0, 1], ["0%", "-6%"]);
  const farX = useTransform(smooth, [0, 1], ["0%", "3%"]);

  // Sphere zooms in and out across the scroll: a few alternating stops so the
  // viewer feels the orb pulse closer and further as they scroll.
  const sphereScale = useTransform(
    smooth,
    [0, 0.25, 0.5, 0.75, 1],
    [0.85, 1.55, 0.9, 1.75, 1.1]
  );
  const sphereY = useTransform(smooth, [0, 1], ["0%", "-9%"]);
  const sphereX = useTransform(smooth, [0, 1], ["0%", "4%"]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.04),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(40,30,100,0.14),_transparent_55%)]" />

      <ParallaxLayer x={farX} y={farY} reduce={!!reduce}>
        <StarField stars={stars} reduce={!!reduce} />
      </ParallaxLayer>

      <GradientSphere
        x={sphereX}
        y={sphereY}
        scale={sphereScale}
        reduce={!!reduce}
      />

      <div className="absolute inset-0 grain opacity-[0.3] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.45)_85%,#000)]" />
      <div className="absolute inset-x-0 top-0 h-px hairline" />
    </div>
  );
}

function GradientSphere({
  x,
  y,
  scale,
  reduce,
}: {
  x: MotionValue<string>;
  y: MotionValue<string>;
  scale: MotionValue<number>;
  reduce: boolean;
}) {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <motion.div
        style={reduce ? undefined : { x, y, scale }}
        className="relative h-[42rem] w-[42rem] will-change-transform"
      >
        {/* Soft halo layer — large, blurred, hue-cycling */}
        <motion.div
          className="absolute inset-[-18%] rounded-full"
          style={{
            background: SPHERE_GRADIENT,
            backgroundSize: "180% 180%",
          }}
          animate={
            reduce
              ? undefined
              : {
                  backgroundPosition: [
                    "0% 0%",
                    "100% 0%",
                    "100% 100%",
                    "0% 100%",
                    "0% 0%",
                  ],
                  filter: [
                    "hue-rotate(0deg) blur(72px)",
                    "hue-rotate(90deg) blur(72px)",
                    "hue-rotate(180deg) blur(72px)",
                    "hue-rotate(270deg) blur(72px)",
                    "hue-rotate(360deg) blur(72px)",
                  ],
                }
          }
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        />

        {/* Sharper inner highlight — same gradient, opposite drift, screen blend */}
        <motion.div
          className="absolute inset-[10%] rounded-full"
          style={{
            background: SPHERE_GRADIENT,
            backgroundSize: "220% 220%",
            mixBlendMode: "screen",
          }}
          animate={
            reduce
              ? undefined
              : {
                  backgroundPosition: [
                    "100% 100%",
                    "0% 100%",
                    "0% 0%",
                    "100% 0%",
                    "100% 100%",
                  ],
                  filter: [
                    "hue-rotate(0deg) blur(32px)",
                    "hue-rotate(-90deg) blur(32px)",
                    "hue-rotate(-180deg) blur(32px)",
                    "hue-rotate(-270deg) blur(32px)",
                    "hue-rotate(-360deg) blur(32px)",
                  ],
                }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />

        {/* Bright white outlined glow that fades in and out */}
        <motion.div
          className="absolute inset-[6%] rounded-full"
          animate={
            reduce
              ? { opacity: 0.55 }
              : {
                  opacity: [0.35, 1, 0.35],
                  boxShadow: [
                    "0 0 40px 0px rgba(255,255,255,0.18), 0 0 0 1px rgba(255,255,255,0.15) inset",
                    "0 0 140px 18px rgba(255,255,255,0.85), 0 0 0 2px rgba(255,255,255,0.95) inset",
                    "0 0 40px 0px rgba(255,255,255,0.18), 0 0 0 1px rgba(255,255,255,0.15) inset",
                  ],
                }
          }
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
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

function StarField({ stars, reduce }: { stars: Star[]; reduce: boolean }) {
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
              s.size >= 1.5
                ? `0 0 ${s.size * 2.5}px rgba(255,255,255,0.55)`
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
