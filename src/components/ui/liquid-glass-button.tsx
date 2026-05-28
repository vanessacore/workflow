"use client";

/**
 * LiquidGlassButton — an animated wrapper around the shadcn <Button> with
 * variant="glass". Adds:
 *   • Magnetic hover (button drifts gently toward the cursor)
 *   • Press squish (scale + Y nudge on tap)
 *   • Wobble-on-press (swaps to the stronger #liquid-glass-active filter
 *     while the pointer is held down)
 *   • Cursor-tracked specular highlight (radial gradient follows mouse)
 *
 * The base refraction + sheen sweep + inner highlight come from the
 * `glass` variant in src/components/ui/button.tsx, so this wrapper only
 * layers on motion concerns.
 *
 * Requires <LiquidGlassFilter /> to be mounted once at the root.
 */

import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentProps<typeof Button>;

export interface LiquidGlassButtonProps
  extends Omit<ButtonProps, "variant"> {
  /** Maximum pixels the button drifts toward the cursor. Default 6. */
  magneticStrength?: number;
}

export function LiquidGlassButton({
  className,
  children,
  magneticStrength = 6,
  onPointerMove,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
  size = "lg",
  ...props
}: LiquidGlassButtonProps) {
  const ref = React.useRef<HTMLButtonElement | null>(null);
  const [pressed, setPressed] = React.useState(false);
  const reduceMotion = useReducedMotion();

  // Magnetic offset — eased with a spring for natural drift.
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const springX = useSpring(offsetX, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(offsetY, { stiffness: 220, damping: 18, mass: 0.4 });
  // Press scale.
  const scale = useSpring(1, { stiffness: 380, damping: 22, mass: 0.5 });

  // Cursor-relative specular highlight (CSS vars consumed by the
  // radial-gradient overlay below).
  const px = useMotionValue(50);
  const py = useMotionValue(50);
  const highlight = useMotionTemplate`radial-gradient(120px circle at ${px}% ${py}%, rgba(255,255,255,0.14), transparent 60%)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    onPointerMove?.(e);
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) / (r.width / 2);
    const dy = (e.clientY - cy) / (r.height / 2);
    offsetX.set(Math.max(-1, Math.min(1, dx)) * magneticStrength);
    offsetY.set(Math.max(-1, Math.min(1, dy)) * magneticStrength);
    px.set(((e.clientX - r.left) / r.width) * 100);
    py.set(((e.clientY - r.top) / r.height) * 100);
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLButtonElement>) => {
    onPointerLeave?.(e);
    offsetX.set(0);
    offsetY.set(0);
    px.set(50);
    py.set(50);
    setPressed(false);
    scale.set(1);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    onPointerDown?.(e);
    setPressed(true);
    scale.set(reduceMotion ? 1 : 0.96);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    onPointerUp?.(e);
    setPressed(false);
    scale.set(1);
  };

  return (
    <motion.div
      style={{ x: springX, y: springY, scale, display: "inline-flex" }}
    >
      <Button
        ref={ref}
        variant="glass"
        size={size}
        data-pressed={pressed ? "true" : "false"}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className={cn("relative", className)}
        {...props}
      >
        {/* Cursor-tracked specular smudge — sits above the variant's
            inner-highlight pseudo-element but below the label. */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/button:opacity-100"
          style={{ backgroundImage: highlight, mixBlendMode: "screen" }}
        />
        <span className="relative z-10 inline-flex items-center gap-1.5">
          {children}
        </span>
      </Button>
    </motion.div>
  );
}
