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
  useCallback,
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

const SNAP_LOCK_MS = 750;
const WHEEL_MIN_DELTA = 4;
const TOUCH_THRESHOLD = 40;

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
    [0, count > 1 ? -((count - 1) * 100) / count : 0],
  );
  const x = useTransform(xPercent, (v) => `${v}%`);

  const scrollToIndex = useCallback(
    (i: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const trackTop = window.scrollY + rect.top;
      const totalScroll = el.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const clamped = Math.max(0, Math.min(count - 1, i));
      const targetY =
        count <= 1 ? trackTop : trackTop + (clamped / (count - 1)) * totalScroll;
      window.scrollTo({
        top: targetY,
        behavior: reduce ? "auto" : "smooth",
      });
    },
    [count, reduce],
  );

  useEffect(() => {
    if (typeof window === "undefined" || count <= 1) return;

    const desktopMq = window.matchMedia("(min-width: 48rem)");
    const isDesktop = () => desktopMq.matches;

    const getCurrentIndex = () => {
      const el = ref.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const trackTop = window.scrollY + rect.top;
      const totalScroll = el.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return 0;
      const progress = (window.scrollY - trackTop) / totalScroll;
      return Math.max(0, Math.min(count - 1, Math.round(progress * (count - 1))));
    };

    let locked = false;
    let unlockTimer: number | undefined;
    const lock = () => {
      locked = true;
      if (unlockTimer) window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(
        () => {
          locked = false;
        },
        reduce ? 0 : SNAP_LOCK_MS,
      );
    };

    const advance = (delta: number) => {
      if (locked) return;
      scrollToIndex(getCurrentIndex() + delta);
      lock();
    };

    const onWheel = (e: WheelEvent) => {
      if (!isDesktop()) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inTrack = rect.top <= 0 && rect.bottom >= window.innerHeight;
      if (!inTrack) return;
      e.preventDefault();
      if (locked) return;
      const delta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < WHEEL_MIN_DELTA) return;
      advance(Math.sign(delta));
    };

    const onKey = (e: KeyboardEvent) => {
      if (!isDesktop()) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (
        e.key === "ArrowRight" ||
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        e.key === " "
      ) {
        e.preventDefault();
        advance(1);
      } else if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowUp" ||
        e.key === "PageUp"
      ) {
        e.preventDefault();
        advance(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        if (!locked) {
          scrollToIndex(0);
          lock();
        }
      } else if (e.key === "End") {
        e.preventDefault();
        if (!locked) {
          scrollToIndex(count - 1);
          lock();
        }
      }
    };

    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (!isDesktop()) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!isDesktop()) return;
      const dx = touchStartX - e.changedTouches[0].clientX;
      const dy = touchStartY - e.changedTouches[0].clientY;
      const d = Math.abs(dy) > Math.abs(dx) ? dy : dx;
      if (Math.abs(d) < TOUCH_THRESHOLD) return;
      advance(d > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      if (unlockTimer) window.clearTimeout(unlockTimer);
    };
  }, [count, reduce, scrollToIndex]);

  return (
    <>
      <div className="flex flex-col md:hidden">
        {items.map((child, i) => (
          <div key={panels[i]?.id ?? i} className="w-full">
            {child}
          </div>
        ))}
      </div>

      <ScrollHashRouter panels={panels} scrollToIndex={scrollToIndex} />
      <div
        ref={ref}
        className="relative hidden md:block"
        style={{ height: `${count * 100}vh` }}
      >
        <div className="sticky top-0 h-screen w-screen overflow-hidden">
          <motion.div
            style={
              reduce
                ? { width: `${count * 100}vw` }
                : { x, width: `${count * 100}vw` }
            }
            className="flex h-full"
          >
            {items.map((child, i) => (
              <section
                key={panels[i]?.id ?? i}
                aria-label={panels[i]?.label}
                className="relative z-10 h-screen w-screen flex-shrink-0 overflow-hidden"
              >
                {child}
              </section>
            ))}
          </motion.div>

          <PanelIndicator
            panels={panels}
            progress={scrollYProgress}
            reduce={!!reduce}
            onSelect={scrollToIndex}
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
  onSelect,
}: {
  panels: ShowcasePanel[];
  progress: MotionValue<number>;
  reduce: boolean;
  onSelect: (index: number) => void;
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
            onSelect={onSelect}
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
  onSelect,
}: {
  index: number;
  count: number;
  panel: ShowcasePanel;
  progress: MotionValue<number>;
  reduce: boolean;
  onSelect: (index: number) => void;
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
      onClick={(e) => {
        if (window.matchMedia("(min-width: 48rem)").matches) {
          e.preventDefault();
          onSelect(index);
          history.replaceState(null, "", `#${panel.id}`);
        }
      }}
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
      className="pointer-events-none absolute right-8 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 text-[10.5px] uppercase tracking-[0.3em] text-foreground/45 lg:flex"
    >
      <span className="[writing-mode:vertical-rl] rotate-180">
        Scroll · next slide
      </span>
      <motion.div
        animate={reduce ? undefined : { x: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="h-px w-10 bg-gradient-to-r from-transparent via-white/60 to-transparent"
      />
    </motion.div>
  );
}

function ScrollHashRouter({
  panels,
  scrollToIndex,
}: {
  panels: ShowcasePanel[];
  scrollToIndex: (index: number) => void;
}) {
  useEffect(() => {
    function jump(id: string) {
      const idx = panels.findIndex((p) => p.id === id);
      if (idx < 0) return false;
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (!isDesktop) return false;
      scrollToIndex(idx);
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
      if (jump(id)) {
        e.preventDefault();
        e.stopPropagation();
        history.replaceState(null, "", `#${id}`);
      }
    }

    function onHashChange() {
      const id = window.location.hash.slice(1);
      if (id) jump(id);
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", onHashChange);

    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      if (id) {
        requestAnimationFrame(() => jump(id));
      }
    }

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [panels, scrollToIndex]);

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
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-px hairline-vertical" />
      <div className="relative z-10 mx-auto w-full max-w-6xl">{children}</div>
    </div>
  );
}
