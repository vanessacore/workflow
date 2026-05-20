"use client";

export default function Home() {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center overflow-hidden">
      {/*
        Responsive "Vanessa" wordmark.

        • Font-size scales fluidly between 150px and 200px in response to
          browser width (clamp min/max).
        • When the full word would still overflow the viewport at the
          minimum font-size, the wordmark is truncated:
            - >= 640px (sm+)        → "Vanessa"
            - 400px – 639px         → "Vanes"
            - < 400px (mobile)      → "V"
      */}
      <h1
        aria-label="Vanessa"
        className="pointer-events-none select-none font-serif italic leading-none tracking-tight text-gradient-accent animate-shimmer"
        style={{
          fontSize: "clamp(150px, 22vw, 200px)",
          whiteSpace: "nowrap",
        }}
      >
        <span className="hidden min-[640px]:inline">Vanessa</span>
        <span className="hidden min-[400px]:inline min-[640px]:hidden">
          Vanes
        </span>
        <span className="inline min-[400px]:hidden">V</span>
      </h1>
    </div>
  );
}
