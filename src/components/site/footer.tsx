import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 text-sm text-foreground/45 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-white/90 to-white/30 text-black">
            <span className="font-serif text-[12px] italic leading-none">v</span>
          </span>
          <span className="text-foreground/60">Vanessa Core</span>
          <span className="text-foreground/25">·</span>
          <span>Designed &amp; built in the dark.</span>
        </div>
        <div className="flex items-center gap-6 text-[12.5px]">
          <span>© {new Date().getFullYear()}</span>
          <Link href="#top" className="transition-colors hover:text-foreground">
            Back to top ↑
          </Link>
        </div>
      </div>
    </footer>
  );
}
