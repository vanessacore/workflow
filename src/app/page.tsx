"use client";

import Spline from "@splinetool/react-spline";

export default function Home() {
  return (
    <div className="fixed inset-0 z-10 overflow-hidden">
      <Spline
        scene="https://prod.spline.design/zWAjf7IWbf-raUMt/scene.splinecode"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
