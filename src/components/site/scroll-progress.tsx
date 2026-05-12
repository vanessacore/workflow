"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.2,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px origin-left bg-gradient-to-r from-white/0 via-white/70 to-white/0"
    />
  );
}
