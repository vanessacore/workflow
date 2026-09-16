"use client";

import { useEffect, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";

const SCENES = {
  sm: "https://prod.spline.design/zWAjf7IWbf-raUMt/scene.splinecode",
  md: "https://prod.spline.design/81Eh6xCCzgV28u2G/scene.splinecode",
  lg: "https://prod.spline.design/5-muhjCeP0bvpiyw/scene.splinecode",
} as const;

type Bucket = keyof typeof SCENES;

const MD_QUERY = "(min-width: 48rem)";
const LG_QUERY = "(min-width: 64rem)";

function readBucket(): Bucket {
  if (window.matchMedia(LG_QUERY).matches) return "lg";
  if (window.matchMedia(MD_QUERY).matches) return "md";
  return "sm";
}

export function SplineScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [bucket, setBucket] = useState<Bucket | null>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const update = () => setBucket(readBucket());
    update();

    const mqMd = window.matchMedia(MD_QUERY);
    const mqLg = window.matchMedia(LG_QUERY);
    mqMd.addEventListener("change", update);
    mqLg.addEventListener("change", update);
    return () => {
      mqMd.removeEventListener("change", update);
      mqLg.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="h-full w-full">
      {inView && bucket ? (
        <Spline
          key={bucket}
          scene={SCENES[bucket]}
          style={{ width: "100%", height: "100%", pointerEvents: "none" }}
        />
      ) : null}
    </div>
  );
}
