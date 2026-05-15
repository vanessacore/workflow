"use client";

import Spline from "@splinetool/react-spline";
import type { Application } from "@splinetool/runtime";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useCallback, useMemo } from "react";

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

  // Per-layer parallax: far moves the least, near the most. Vertical drift is
  // larger than horizontal so scrolling reads as descent through the field.
  const farY = useTransform(smooth, [0, 1], ["0%", "-4%"]);
  const farX = useTransform(smooth, [0, 1], ["0%", "1.5%"]);
  const midY = useTransform(smooth, [0, 1], ["0%", "-9%"]);
  const midX = useTransform(smooth, [0, 1], ["0%", "3%"]);
  const nearY = useTransform(smooth, [0, 1], ["0%", "-16%"]);
  const nearX = useTransform(smooth, [0, 1], ["0%", "5%"]);

  // Sphere parallax: monotonic, smooth scale + slow drift. No bouncy
  // multi-stop curve — scroll pushes the sphere forward steadily.
  const sphereScale = useTransform(smooth, [0, 1], [0.92, 1.35]);
  const sphereY = useTransform(smooth, [0, 1], ["0%", "-7%"]);
  const sphereX = useTransform(smooth, [0, 1], ["0%", "3%"]);

  // The dotted sphere is its own layer that parallaxes a touch more
  // aggressively than the gradient — it sits in front of it.
  const dotsScale = useTransform(smooth, [0, 1], [0.95, 1.5]);
  const dotsY = useTransform(smooth, [0, 1], ["0%", "-11%"]);
  const dotsX = useTransform(smooth, [0, 1], ["0%", "5%"]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
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
      </ParallaxLayer>

      <GradientSphere
        x={sphereX}
        y={sphereY}
        scale={sphereScale}
        reduce={!!reduce}
      />

      <SplineSphere
        x={dotsX}
        y={dotsY}
        scale={dotsScale}
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
      {/* Outer wrapper: scroll-driven parallax (translate + scale). */}
      <motion.div
        style={reduce ? undefined : { x, y, scale }}
        className="relative h-[42rem] w-[42rem] will-change-transform"
      >
        {/* Inner wrapper: subtle continuous breathing while idle. Composes
            multiplicatively with the scroll-driven scale on the parent. */}
        <motion.div
          className="absolute inset-0"
          animate={reduce ? undefined : { scale: [1, 1.035, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Soft halo layer — large, blurred, hue-cycling very slowly. */}
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
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          />

          {/* Sharper inner highlight — same gradient, opposite drift, even
              slower hue cycle so the two layers cross-fade gradually. */}
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
            transition={{ duration: 110, repeat: Infinity, ease: "linear" }}
          />

          {/* Soft outlined glow that breathes very slowly. The amplitude is
              intentionally narrow so it never punches; just a long swell. */}
          <motion.div
            className="absolute inset-[6%] rounded-full"
            animate={
              reduce
                ? { opacity: 0.55 }
                : {
                    opacity: [0.5, 0.78, 0.5],
                    boxShadow: [
                      "0 0 60px 4px rgba(255,255,255,0.22), 0 0 0 1px rgba(255,255,255,0.18) inset",
                      "0 0 110px 14px rgba(255,255,255,0.5), 0 0 0 1.5px rgba(255,255,255,0.55) inset",
                      "0 0 60px 4px rgba(255,255,255,0.22), 0 0 0 1px rgba(255,255,255,0.18) inset",
                    ],
                  }
            }
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
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

// Spline scene that replaces the previous canvas-based dotted sphere.
// The scene drives its own rotation, so we only need to layer the
// scroll-driven parallax transform from the parent on top.
const SPLINE_SCENE_URL =
  "https://prod.spline.design/Wd4JDyAI5bMaIyzV/scene.splinecode";

function SplineSphere({
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
  // Clear the scene's baked background once Spline finishes loading so
  // the canvas is transparent and the gradient sphere + starfield behind
  // it remain visible.
  const handleLoad = useCallback((app: Application) => {
    app.setBackgroundColor("rgba(0,0,0,0)");
  }, []);

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {/* Container matches the previous dotted-sphere footprint so the
          Spline canvas sits in the same place in the composition. */}
      <motion.div
        style={reduce ? undefined : { x, y, scale }}
        className="relative h-[58rem] w-[58rem] will-change-transform"
      >
        <Spline scene={SPLINE_SCENE_URL} onLoad={handleLoad} />
      </motion.div>
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
