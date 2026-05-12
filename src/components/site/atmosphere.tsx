export function Atmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.04),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(80,60,180,0.10),_transparent_55%)]" />

      <div className="absolute -top-40 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(160,140,255,0.10),_transparent_60%)] blur-3xl animate-drift" />
      <div className="absolute top-1/3 -left-40 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,_rgba(80,180,255,0.08),_transparent_60%)] blur-3xl animate-drift-slow" />
      <div className="absolute bottom-0 right-0 h-[50rem] w-[50rem] translate-x-1/3 translate-y-1/3 rounded-full bg-[radial-gradient(circle,_rgba(255,120,200,0.07),_transparent_60%)] blur-3xl animate-drift" />

      <div className="absolute inset-0 grain opacity-[0.35] mix-blend-overlay" />

      <div className="absolute inset-x-0 top-0 h-px hairline" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.4)_85%,#000)]" />
    </div>
  );
}
