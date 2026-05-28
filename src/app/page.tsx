"use client";

import { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";

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

export default function Home() {
  const [bucket, setBucket] = useState<Bucket | null>(null);

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

  return (
    <div className="fixed inset-0 z-10 overflow-hidden">
      {bucket && (
        <Spline
          key={bucket}
          scene={SCENES[bucket]}
          style={{ width: "100%", height: "100%" }}
        />
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-12 z-20 flex justify-center gap-4">
        <div className="pointer-events-auto flex items-center gap-4">
          <LiquidGlassButton size="lg" className="px-6 text-base tracking-wide">
            Enter Portfolio
          </LiquidGlassButton>
          <LiquidGlassButton
            size="lg"
            className="px-6 text-base tracking-wide"
          >
            Get in Touch
          </LiquidGlassButton>
        </div>
      </div>
    </div>
  );
}
