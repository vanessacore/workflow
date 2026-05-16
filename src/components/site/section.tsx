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
        // On mobile we want the traditional vertical rhythm;
        // on md+ the section sits inside a 100vh horizontal panel
        // and uses flex-centered layout with tighter padding.
        !bare &&
          "px-6 py-28 md:flex md:h-full md:min-h-screen md:items-center md:px-12 md:py-20 lg:px-20",
        className
      )}
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl">{children}</div>
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
        "flex flex-col gap-4",
        align === "center" && "items-center text-center"
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className={cn(
          "text-balance text-3xl font-medium tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl lg:text-[3.25rem]",
          "text-gradient"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-pretty text-base leading-relaxed text-foreground/60 md:text-[15.5px]",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
