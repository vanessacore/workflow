"use client";

/**
 * Drop-in Spline replacement for the canvas-based DottedSphere in
 * `atmosphere.tsx`.
 *
 * To enable:
 *   1. `npm install` (the `@splinetool/react-spline` and
 *      `@splinetool/runtime` deps are already declared in package.json)
 *   2. In `atmosphere.tsx` swap the `<DottedSphere ... />` call for
 *      `<SplineSphere x={dotsX} y={dotsY} scale={dotsScale} reduce={!!reduce} />`
 *      (plus the matching import from "./spline-sphere"). The
 *      `scrollProgress` prop is not needed — Spline drives its own
 *      rotation inside the scene.
 *
 * The file is intentionally left unreferenced for now because the
 * Cursor Cloud agent VM cannot reach `registry.npmjs.org` to install
 * the Spline runtime, so wiring this in from the agent breaks the
 * build. Once the dep is installed locally (or via an env-setup agent
 * with the right network allowlist), the swap is a one-line change.
 */

import {
  motion,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

// Load Spline only on the client. The runtime ships a WebGL canvas plus the
// scene loader, neither of which can run during SSR.
const Spline = dynamic(
  () => import("@splinetool/react-spline").then((m) => m.default),
  { ssr: false, loading: () => null },
);

const SCENE_URL =
  "https://prod.spline.design/Wd4JDyAI5bMaIyzV/scene.splinecode";

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  x: MotionValue<string>;
  y: MotionValue<string>;
  scale: MotionValue<number>;
  reduce: boolean;
};

/**
 * Hero-section sphere rendered as a Spline 3D scene. Layout mirrors the
 * previous `DottedSphere`:
 *   - fixed-positioned in the page-wide atmosphere layer
 *   - scroll-driven parallax (x / y / scale come from the parent)
 *   - reduced-motion users get a static, centered render
 *
 * Sizing uses `vmin` clamped against a max in `rem` so the scene stays a
 * comfortable circle on phones, tablets, and large desktops without
 * overflowing the viewport.
 */
export function SplineSphere({ x, y, scale, reduce: reduceProp }: Props) {
  const systemReduce = useReducedMotion();
  const reduce = reduceProp || !!systemReduce;
  const [ready, setReady] = useState(false);

  const handleLoad = useCallback(() => {
    setReady(true);
  }, []);

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <motion.div
        style={reduce ? undefined : { x, y, scale }}
        className={[
          "relative will-change-transform",
          // Mobile: nearly fills the smaller viewport edge.
          "h-[min(92vmin,40rem)] w-[min(92vmin,40rem)]",
          // Tablet / small laptop.
          "md:h-[min(85vmin,50rem)] md:w-[min(85vmin,50rem)]",
          // Desktop: matches the prior 58rem sphere when there's room.
          "lg:h-[min(78vmin,58rem)] lg:w-[min(78vmin,58rem)]",
        ].join(" ")}
      >
        {/* Slow idle "breathing" composed on top of the scroll parallax so
            the scene never feels static while waiting between scroll events. */}
        <motion.div
          className="absolute inset-0"
          animate={reduce ? undefined : { scale: [1, 1.025, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Fade + zoom in once the scene finishes loading. */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={
              ready
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.94 }
            }
            transition={{ duration: 1.3, ease: EASE }}
          >
            <Spline
              scene={SCENE_URL}
              onLoad={handleLoad}
              style={{ width: "100%", height: "100%" }}
            />
          </motion.div>

          <SpherePlaceholder visible={!ready} reduce={reduce} />
        </motion.div>

        {/* Hide Spline's bottom-right "Built with Spline" watermark. The
            scene canvas paints through this transparent mask, but anything
            in the lower-right corner overlay (the watermark) is covered. */}
        <div
          aria-hidden
          className="absolute bottom-2 right-2 h-9 w-32 rounded-md bg-transparent"
          style={{
            // The site sits on a near-black background already, so painting
            // a matching swatch over the watermark keeps it invisible
            // without leaking any visible block.
            background:
              "linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(5,5,5,0.85) 35%, rgba(5,5,5,1) 100%)",
          }}
        />
      </motion.div>
    </div>
  );
}

/**
 * Soft loading shimmer shown while the Spline scene downloads. The shape is a
 * thin, slowly-rotating conic ring so the empty space reads as "something is
 * about to appear here" rather than "broken".
 */
function SpherePlaceholder({
  visible,
  reduce,
}: {
  visible: boolean;
  reduce: boolean;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="pointer-events-none absolute inset-0 grid place-items-center"
    >
      <motion.div
        className="h-2/3 w-2/3 rounded-full"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "conic-gradient(from 0deg, rgba(255,255,255,0.18), rgba(255,255,255,0) 55%, rgba(255,255,255,0.10))",
          maskImage:
            "radial-gradient(circle, transparent 38%, black 41%, black 44%, transparent 47%)",
          WebkitMaskImage:
            "radial-gradient(circle, transparent 38%, black 41%, black 44%, transparent 47%)",
        }}
      />
    </motion.div>
  );
}
