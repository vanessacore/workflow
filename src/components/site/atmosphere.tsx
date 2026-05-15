"use client";

import Spline from "@splinetool/react-spline";
import type { Application } from "@splinetool/runtime";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useCallback, useEffect, useMemo } from "react";

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

const SPHERE_GRADIENT =
  "radial-gradient(circle at 28% 30%, rgba(200,140,255,0.95), rgba(200,140,255,0) 48%)," +
  "radial-gradient(circle at 72% 32%, rgba(120,200,255,0.9), rgba(120,200,255,0) 50%)," +
  "radial-gradient(circle at 68% 74%, rgba(255,140,200,0.95), rgba(255,140,200,0) 50%)," +
  "radial-gradient(circle at 28% 70%, rgba(140,255,210,0.8), rgba(140,255,210,0) 52%)," +
  "radial-gradient(circle at 50% 50%, rgba(255,210,140,0.75), rgba(255,210,140,0) 62%)";

// Default zoom sits in the middle of the range so users can zoom both in and out.
const ZOOM_DEFAULT = 0.35;

export function Atmosphere() {
  const reduce = useReducedMotion();

  // User-driven interaction state. zoom is normalised 0..1 across the full
  // travel from "way out" to "right up against the camera".
  const zoom = useMotionValue(ZOOM_DEFAULT);

  // Spring smoothing so wheel "kicks" feel weighty rather than instant.
  // Slightly under-damped for a tactile feel.
  const smoothZoom = useSpring(zoom, {
    stiffness: 70,
    damping: 22,
    mass: 0.55,
  });

  useEffect(() => {
    if (reduce) return;

    const clamp = (v: number) => Math.min(1, Math.max(0, v));

    function onWheel(e: WheelEvent) {
      // Soak up wheel events so the page never tries to scroll — there's
      // nothing to scroll to and we want every tick to drive zoom instead.
      e.preventDefault();
      // Normalise across mouse wheels (large discrete deltas) and trackpads
      // (small continuous deltas, also pinch-zoom which arrives with ctrlKey).
      const raw = e.deltaY;
      const magnitude = Math.min(Math.abs(raw) * 0.0018 + 0.004, 0.07);
      // Up-scroll (deltaY < 0) means zoom in.
      const step = -Math.sign(raw) * magnitude;
      zoom.set(clamp(zoom.get() + step));
    }

    // We always want the wheel handler to be non-passive so we can preventDefault.
    window.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
    };
  }, [reduce, zoom]);

  // Three independent star fields so layered parallax reads as depth rather
  // than a single field sliding behind the sphere.
  const farStars = useMemo(() => seededStars(160, 1337, { sizeBias: "tiny" }), []);
  const midStars = useMemo(() => seededStars(90, 4242, { sizeBias: "small" }), []);
  const nearStars = useMemo(() => seededStars(44, 9001, { sizeBias: "near" }), []);

  // Per-layer zoom response: the farther a layer is, the less it scales.
  // Far stars barely budge; near stars track the camera more closely.
  const farScale = useTransform(smoothZoom, [0, 1], [0.94, 1.12]);
  const midScale = useTransform(smoothZoom, [0, 1], [0.9, 1.22]);
  const nearScale = useTransform(smoothZoom, [0, 1], [0.85, 1.4]);

  // Sphere depth parallax. The gradient sphere sits "behind" the Spline mesh,
  // so its scale travels through a tighter range — when the camera pushes in,
  // the Spline mesh balloons while the gradient halo grows only modestly.
  // When the camera pulls back, the Spline mesh shrinks more aggressively, so
  // the gradient ends up looking comparatively larger.
  const sphereScale = useTransform(smoothZoom, [0, 1], [0.82, 1.18]);
  const dotsScale = useTransform(smoothZoom, [0, 1], [0.55, 1.9]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.04),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(40,30,100,0.14),_transparent_55%)]" />

      <ParallaxLayer scale={farScale} reduce={!!reduce}>
        <StarField stars={farStars} reduce={!!reduce} glow={false} />
      </ParallaxLayer>
      <ParallaxLayer scale={midScale} reduce={!!reduce}>
        <StarField stars={midStars} reduce={!!reduce} glow={false} />
      </ParallaxLayer>
      <ParallaxLayer scale={nearScale} reduce={!!reduce}>
        <StarField stars={nearStars} reduce={!!reduce} glow />
      </ParallaxLayer>

      <GradientSphere scale={sphereScale} reduce={!!reduce} />

      <SplineSphere scale={dotsScale} reduce={!!reduce} />

      <div className="absolute inset-0 grain opacity-[0.3] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.45)_85%,#000)]" />
      <div className="absolute inset-x-0 top-0 h-px hairline" />
    </div>
  );
}

function GradientSphere({
  scale,
  reduce,
}: {
  scale: MotionValue<number>;
  reduce: boolean;
}) {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {/* Outer wrapper: user-driven zoom (scale). */}
      <motion.div
        style={reduce ? undefined : { scale }}
        className="relative h-[42rem] w-[42rem] will-change-transform"
      >
        {/* Inner wrapper: subtle continuous breathing while idle. Composes
            multiplicatively with the user-driven scale on the parent. */}
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
  scale,
  reduce,
}: {
  children: React.ReactNode;
  scale?: MotionValue<number>;
  reduce: boolean;
}) {
  const style = reduce
    ? undefined
    : ({ scale } as Record<string, MotionValue<number> | undefined>);
  return (
    <motion.div style={style} className="absolute inset-0 will-change-transform">
      {children}
    </motion.div>
  );
}

// Spline scene that replaces the previous canvas-based dotted sphere.
// The scene drives its own internal rotation; the user-driven rotation we
// apply here is a Z-axis spin on the wrapper, layered on top of that.
const SPLINE_SCENE_URL =
  "https://prod.spline.design/Wd4JDyAI5bMaIyzV/scene.splinecode";

function SplineSphere({
  scale,
  reduce,
}: {
  scale: MotionValue<number>;
  reduce: boolean;
}) {
  // Force the Spline canvas to render with a transparent clear color so the
  // gradient sphere + starfield behind it remain visible. See the long-form
  // explanation in the previous revision: setBackgroundColor only swaps one
  // opaque color for another, so we reach through to the internal scene +
  // renderer to null the background and clear with alpha=0.
  const handleLoad = useCallback((app: Application) => {
    type ColorLike = { r: number; g: number; b: number };
    type RendererLike = {
      setClearColor?: (color: number, alpha: number) => void;
      setClearAlpha?: (alpha: number) => void;
    };
    type SceneLike = {
      background?: unknown;
      fog?: unknown;
    };
    const internal = app as unknown as {
      _scene?: SceneLike;
      _renderer?: RendererLike;
      scene?: SceneLike;
      renderer?: RendererLike;
    };
    const scene = internal._scene ?? internal.scene;
    const renderer = internal._renderer ?? internal.renderer;
    if (scene) {
      const sceneRecord = scene as SceneLike & Record<string, unknown>;
      sceneRecord.background = null;
      sceneRecord["spline.activeSceneBackground"] = null;
      sceneRecord["spline.activeBackgroundColor"] = {
        r: 0,
        g: 0,
        b: 0,
      } satisfies ColorLike;
    }
    if (renderer) {
      renderer.setClearColor?.(0x000000, 0);
      renderer.setClearAlpha?.(0);
    }
  }, []);

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {/* Sized so the visible 3D mesh inside the Spline scene reads as
          slightly larger than the 42rem gradient sphere it floats over. */}
      <motion.div
        style={reduce ? undefined : { scale }}
        className="relative h-[68rem] w-[68rem] will-change-transform"
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
