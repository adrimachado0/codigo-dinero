"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib/cn";

import { qrGlyph } from "./qr-glyph";

/** Side of the tile: QR / empty / QR in a 2×2 checkerboard, QRs touching at the corners. */
const TILE = 400;
const QR_SIZE = TILE / 2;
const SCALE = QR_SIZE / qrGlyph.modules;
/** Vertical start of the tile against the top of the wine block (design source). */
const TILE_Y = -16;
const OPACITY = 0.045;

type QrPatternProps = {
  /** Unique per page: ids of the SVG defs. */
  id: string;
  /**
   * The wine block is split in two (header + hero): the second part continues the tiling of
   * the `[data-qr-anchor]` element instead of starting a new one, so both look like one.
   */
  continued?: boolean;
  className?: string;
};

/**
 * Decorative QR tiling behind the content of the wine block (accent color, very low opacity).
 * Needs a `relative isolate` parent: it sits at z-index -1, over its background.
 */
export function QrPattern({ id, continued = false, className }: QrPatternProps) {
  const ref = useRef<SVGSVGElement>(null);
  const [offset, setOffset] = useState(0);

  useLayoutEffect(() => {
    const svg = ref.current;
    const anchor = continued ? document.querySelector("[data-qr-anchor]") : null;
    if (!svg || !anchor) return;
    const measure = () => {
      setOffset(svg.getBoundingClientRect().top - anchor.getBoundingClientRect().top);
    };
    measure();
    // The header grows when the mobile menu opens.
    const observer = new ResizeObserver(measure);
    observer.observe(anchor);
    return () => {
      observer.disconnect();
    };
  }, [continued]);

  const glyphId = `${id}-qr-glyph`;
  const patternId = `${id}-qr-grid`;
  return (
    <svg
      ref={ref}
      aria-hidden="true"
      focusable="false"
      className={cn("pointer-events-none absolute inset-0 -z-1 size-full text-accent", className)}
    >
      <defs>
        <path id={glyphId} d={qrGlyph.path} />
        <pattern
          id={patternId}
          x="50%"
          y={TILE_Y - offset}
          width={TILE}
          height={TILE}
          patternUnits="userSpaceOnUse"
        >
          <use
            href={`#${glyphId}`}
            transform={`scale(${String(SCALE)})`}
            fill="currentColor"
            fillOpacity={OPACITY}
          />
          <use
            href={`#${glyphId}`}
            transform={`translate(${String(QR_SIZE)} ${String(QR_SIZE)}) scale(${String(SCALE)})`}
            fill="currentColor"
            fillOpacity={OPACITY}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
