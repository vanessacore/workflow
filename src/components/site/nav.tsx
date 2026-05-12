"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

const links = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#philosophy", label: "Philosophy" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[padding,background,backdrop-filter] duration-500",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-[min(1200px,calc(100%-1.5rem))] items-center justify-between rounded-full border border-white/5 px-4 py-2.5 transition-all duration-500",
          scrolled
            ? "bg-black/55 backdrop-blur-xl shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]"
            : "bg-white/[0.02] backdrop-blur-md"
        )}
      >
        <Link
          href="#top"
          className="group flex items-center gap-2.5 pl-1.5 text-sm font-medium tracking-tight"
        >
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-white/90 to-white/40 text-black shadow-[0_0_24px_rgba(255,255,255,0.25)]">
            <span className="font-serif text-[14px] leading-none italic">v</span>
            <span className="absolute inset-0 rounded-full ring-1 ring-white/30" />
          </span>
          <span className="hidden text-foreground/90 sm:inline">
            Vanessa <span className="text-foreground/50">Core</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="relative rounded-full px-3 py-1.5 text-[13px] text-foreground/65 transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="#contact"
            className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[12.5px] font-medium tracking-tight text-foreground/90 transition-all hover:border-white/20 hover:bg-white/[0.08] md:inline-flex"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Open for select work
          </Link>

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] md:hidden"
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1">
              <span
                className={cn(
                  "h-px w-4 bg-white transition-transform",
                  open && "translate-y-[3px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "h-px w-4 bg-white transition-transform",
                  open && "-translate-y-[3px] -rotate-45"
                )}
              />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 w-[min(1200px,calc(100%-1.5rem))] overflow-hidden rounded-3xl border border-white/5 bg-black/70 p-2 backdrop-blur-xl md:hidden"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm text-foreground/80 hover:bg-white/5 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
