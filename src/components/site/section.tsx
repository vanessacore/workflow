import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  children,
  className,
  bare = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  bare?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full",
        !bare && "px-6 py-28 md:py-36 lg:py-44",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px hairline" />
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/65 backdrop-blur-md",
        className
      )}
    >
      <span className="h-1 w-1 rounded-full bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center"
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className={cn(
          "text-balance text-4xl font-medium tracking-[-0.02em] text-foreground sm:text-5xl md:text-6xl",
          "text-gradient"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-pretty text-base leading-relaxed text-foreground/60 md:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
