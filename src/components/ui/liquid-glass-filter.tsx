/**
 * Global SVG <defs> for the "liquid glass" backdrop-filter.
 *
 * `backdrop-filter: url(#liquid-glass)` warps the pixels behind the element
 * by sampling a soft fractal-noise field and feeding it through
 * <feDisplacementMap>. The result is a real lens-style refraction — the
 * edges of the button warp the background, not just blur it.
 *
 * Chromium and Safari support url() backdrop-filters; Firefox does not,
 * so the matching `.glass-surface` utility in globals.css ships a plain
 * blur() fallback inside an @supports query.
 *
 * Two filters are defined:
 *   #liquid-glass        — resting / hover state
 *   #liquid-glass-active — stronger displacement while pressed (wobble)
 */

export function LiquidGlassFilter() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
    >
      <defs>
        <filter
          id="liquid-glass"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.018"
            numOctaves={2}
            seed={7}
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2.2" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale={52}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        <filter
          id="liquid-glass-active"
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02 0.026"
            numOctaves={2}
            seed={11}
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="1.6" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale={92}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
