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

type Sphere = {
  className: string;
  background: string;
  duration: number;
  delay: number;
  amp: number;
};

function Spheres({
  spheres,
  reduce,
}: {
  spheres: Sphere[];
  reduce: boolean;
}) {
  return (
    <>
      {spheres.map((s, i) => (
        <div key={i} className={s.className}>
          <motion.div
            animate={
              reduce
                ? undefined
                : {
                    scale: [1, 1 + s.amp, 1],
                    opacity: [0.35, 1, 0.35],
                  }
            }
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-full w-full rounded-full blur-3xl"
            style={{ background: s.background }}
          />
        </div>
      ))}
    </>
  );
}

export function Atmosphere() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    mass: 0.4,
  });

  const stars = useMemo(() => seededStars(160, 1337), []);

  const nearScale = useTransform(smooth, [0, 1], [1, 1.9]);
  const nearY = useTransform(smooth, [0, 1], ["0%", "-22%"]);
  const nearX = useTransform(smooth, [0, 1], ["0%", "12%"]);
  const nearOpacity = useTransform(smooth, [0, 0.5, 1], [1, 0.75, 0.55]);

  const midScale = useTransform(smooth, [0, 1], [1, 1.4]);
  const midY = useTransform(smooth, [0, 1], ["0%", "-12%"]);
  const midX = useTransform(smooth, [0, 1], ["0%", "-9%"]);

  const farY = useTransform(smooth, [0, 1], ["0%", "-6%"]);
  const farX = useTransform(smooth, [0, 1], ["0%", "3%"]);

  const revealOpacity = useTransform(smooth, [0, 0.15, 0.5, 1], [0, 0.55, 1, 1]);
  const revealScale = useTransform(smooth, [0, 1], [0.7, 1.25]);

  const nearSpheres: Sphere[] = [
    {
      className:
        "absolute left-1/2 top-[-12%] h-[64rem] w-[64rem] -translate-x-1/2",
      background:
        "radial-gradient(circle, rgba(160,140,255,0.32), rgba(160,140,255,0) 62%)",
      duration: 7,
      delay: 0,
      amp: 0.22,
    },
    {
      className: "absolute left-[-14%] top-[32%] h-[42rem] w-[42rem]",
      background:
        "radial-gradient(circle, rgba(80,180,255,0.28), rgba(80,180,255,0) 62%)",
      duration: 8,
      delay: 1.2,
      amp: 0.25,
    },
    {
      className:
        "absolute right-[-14%] bottom-[-10%] h-[52rem] w-[52rem]",
      background:
        "radial-gradient(circle, rgba(255,120,200,0.26), rgba(255,120,200,0) 62%)",
      duration: 9,
      delay: 2.4,
      amp: 0.24,
    },
  ];

  const midSpheres: Sphere[] = [
    {
      className: "absolute left-[12%] top-[18%] h-[26rem] w-[26rem]",
      background:
        "radial-gradient(circle, rgba(120,200,255,0.32), rgba(120,200,255,0) 60%)",
      duration: 6,
      delay: 0.5,
      amp: 0.3,
    },
    {
      className: "absolute right-[18%] top-[58%] h-[30rem] w-[30rem]",
      background:
        "radial-gradient(circle, rgba(255,180,140,0.28), rgba(255,180,140,0) 60%)",
      duration: 7.5,
      delay: 1.8,
      amp: 0.28,
    },
  ];

  const revealSpheres: Sphere[] = [
    {
      className: "absolute right-[6%] top-[8%] h-[30rem] w-[30rem]",
      background:
        "radial-gradient(circle, rgba(255,210,140,0.34), rgba(255,210,140,0) 60%)",
      duration: 7,
      delay: 0.3,
      amp: 0.3,
    },
    {
      className: "absolute left-[8%] bottom-[6%] h-[36rem] w-[36rem]",
      background:
        "radial-gradient(circle, rgba(140,255,210,0.34), rgba(140,255,210,0) 60%)",
      duration: 9,
      delay: 1.2,
      amp: 0.28,
    },
    {
      className:
        "absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2",
      background:
        "radial-gradient(circle, rgba(200,150,255,0.36), rgba(200,150,255,0) 60%)",
      duration: 6,
      delay: 0,
      amp: 0.35,
    },
    {
      className: "absolute right-[26%] bottom-[14%] h-[22rem] w-[22rem]",
      background:
        "radial-gradient(circle, rgba(120,160,255,0.34), rgba(120,160,255,0) 60%)",
      duration: 8.5,
      delay: 2.6,
      amp: 0.32,
    },
    {
      className: "absolute left-[28%] top-[10%] h-[18rem] w-[18rem]",
      background:
        "radial-gradient(circle, rgba(255,140,180,0.32), rgba(255,140,180,0) 60%)",
      duration: 7,
      delay: 1.5,
      amp: 0.3,
    },
  ];

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

      <ParallaxLayer
        x={midX}
        y={midY}
        scale={midScale}
        reduce={!!reduce}
      >
        <Spheres spheres={midSpheres} reduce={!!reduce} />
      </ParallaxLayer>

      <ParallaxLayer
        x={nearX}
        y={nearY}
        scale={nearScale}
        opacity={nearOpacity}
        reduce={!!reduce}
      >
        <Spheres spheres={nearSpheres} reduce={!!reduce} />
      </ParallaxLayer>

      <ParallaxLayer
        scale={revealScale}
        opacity={revealOpacity}
        reduce={!!reduce}
      >
        <Spheres spheres={revealSpheres} reduce={!!reduce} />
      </ParallaxLayer>

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
