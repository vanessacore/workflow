"use client";

import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ShowcasePanel = {
  id: string;
  label: string;
};

export function HorizontalShowcase({
  panels,
  children,
}: {
  panels: ShowcasePanel[];
  children: ReactNode;
}) {
  const items = Children.toArray(children).filter(isValidElement);
  const count = items.length;

  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const xPercent = useTransform(
    scrollYProgress,
    [0, 1],
    [0, count > 1 ? -((count - 1) * 100) / count : 0]
  );
  const x = useTransform(xPercent, (v) => `${v}%`);

  return (
    <>
      {/* Mobile: traditional stacked vertical layout — sections already own their ids */}
      <div className="flex flex-col md:hidden">
        {items.map((child, i) => (
          <div key={i} className="w-full">
            {child}
          </div>
        ))}
      </div>

      {/* Desktop: vertical scroll mapped to horizontal motion */}
      <ScrollHashRouter panels={panels} />
      <div
        ref={ref}
        className="relative hidden md:block"
        style={{ height: `${count * 100}vh` }}
      >
        <div className="sticky top-0 h-screen w-screen overflow-hidden">
          <motion.div
            style={reduce ? { width: `${count * 100}vw` } : { x, width: `${count * 100}vw` }}
            className="flex h-full"
          >
            {items.map((child, i) => (
              <section
                key={i}
                aria-label={panels[i]?.label}
                className="relative h-screen w-screen flex-shrink-0 overflow-hidden"
              >
                {child}
              </section>
            ))}
          </motion.div>

          <PanelIndicator
            panels={panels}
            progress={scrollYProgress}
            reduce={!!reduce}
          />

          <ScrollHint reduce={!!reduce} progress={scrollYProgress} />
        </div>
      </div>
    </>
  );
}

function PanelIndicator({
  panels,
  progress,
  reduce,
}: {
  panels: ShowcasePanel[];
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 flex justify-center px-6">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/8 bg-black/45 px-1.5 py-1.5 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.7)]">
        {panels.map((p, i) => (
          <PanelTick
            key={p.id}
            index={i}
            count={panels.length}
            panel={p}
            progress={progress}
            reduce={reduce}
          />
        ))}
      </div>
    </div>
  );
}

function PanelTick({
  index,
  count,
  panel,
  progress,
  reduce,
}: {
  index: number;
  count: number;
  panel: ShowcasePanel;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const proximity = useTransform(progress, (v) => {
    if (count <= 1) return 1;
    const current = v * (count - 1);
    return Math.max(0, 1 - Math.abs(current - index));
  });
  const dotScale = useTransform(proximity, [0, 1], [1, 1.6]);
  const dotOpacity = useTransform(proximity, [0, 1], [0.45, 1]);
  const labelOpacity = useTransform(proximity, [0.55, 1], [0, 1]);
  const labelWidth = useTransform(proximity, [0.55, 1], [0, 110]);

  return (
    <Link
      href={`#${panel.id}`}
      aria-label={`Jump to ${panel.label}`}
      className="group relative flex items-center gap-2 rounded-full px-2 py-1.5 transition-colors hover:bg-white/[0.04]"
    >
      <motion.span
        style={reduce ? undefined : { scale: dotScale, opacity: dotOpacity }}
        className="block h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]"
      />
      <motion.span
        style={reduce ? undefined : { opacity: labelOpacity, maxWidth: labelWidth }}
        className="overflow-hidden whitespace-nowrap text-[10.5px] uppercase tracking-[0.22em] text-foreground/80"
      >
        {panel.label}
      </motion.span>
    </Link>
  );
}

function ScrollHint({
  progress,
  reduce,
}: {
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const unsub = progress.on("change", (v) => {
      setHidden(v > 0.04);
    });
    return () => unsub();
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.6 }}
      className="pointer-events-none absolute right-8 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-3 text-[10.5px] uppercase tracking-[0.3em] text-foreground/45"
    >
      <span className="[writing-mode:vertical-rl] rotate-180">Scroll · drift right</span>
      <motion.div
        animate={reduce ? undefined : { x: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="h-px w-10 bg-gradient-to-r from-transparent via-white/60 to-transparent"
      />
    </motion.div>
  );
}

function ScrollHashRouter({ panels }: { panels: ShowcasePanel[] }) {
  useEffect(() => {
    function scrollToPanel(id: string) {
      const idx = panels.findIndex((p) => p.id === id);
      if (idx < 0) return false;
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (!isDesktop) return false; // let native scrolling handle mobile
      const target = idx * window.innerHeight;
      window.scrollTo({ top: target, behavior: "smooth" });
      return true;
    }

    function onClick(e: MouseEvent) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const path = e.composedPath();
      let anchor: HTMLAnchorElement | null = null;
      for (const el of path) {
        if (el instanceof HTMLAnchorElement) {
          anchor = el;
          break;
        }
      }
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const id = href.slice(1);
      if (!id) return;
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (!isDesktop) return; // mobile: let native scroll work
      if (panels.findIndex((p) => p.id === id) < 0) return;
      // Capture phase: pre-empt Next.js Link / native anchor handling
      e.preventDefault();
      e.stopPropagation();
      scrollToPanel(id);
      history.replaceState(null, "", `#${id}`);
    }

    function onHashChange() {
      const id = window.location.hash.slice(1);
      if (id) scrollToPanel(id);
    }

    // Capture phase so we intercept BEFORE Next.js Link's own click handler.
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", onHashChange);

    // Honor initial hash on load (defer until after layout)
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      if (id) {
        requestAnimationFrame(() => {
          if (panels.some((p) => p.id === id)) {
            const isDesktop = window.matchMedia("(min-width: 768px)").matches;
            if (isDesktop) {
              const idx = panels.findIndex((p) => p.id === id);
              window.scrollTo({ top: idx * window.innerHeight });
            }
          }
        });
      }
    }

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [panels]);

  return null;
}

export function PanelFrame({
  children,
  className,
  align = "center",
}: {
  children: ReactNode;
  className?: string;
  align?: "center" | "start";
}) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full overflow-hidden px-6 pt-24 pb-20 md:px-12 md:pt-28 md:pb-24 lg:px-20",
        align === "center" ? "items-center" : "items-start",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-px hairline-vertical" />
      <div className="relative z-10 mx-auto w-full max-w-6xl">{children}</div>
    </div>
  );
}
