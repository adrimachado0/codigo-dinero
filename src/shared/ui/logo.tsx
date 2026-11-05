import Image from "next/image";

import { cn } from "@/shared/lib/cn";

import logo from "./brand/codigo-dinero-logo.png";

type LogoProps = {
  /** Rendered height in px (the width follows the aspect ratio). */
  height: number;
  /** Above the fold (header): preloaded from the <head>. */
  preload?: boolean;
  className?: string;
};

/**
 * Código Dinero logo (transparent PNG). Decorative: it always sits inside a link whose
 * aria-label carries the name.
 */
export function Logo({ height, preload = false, className }: LogoProps) {
  const width = Math.round((height * logo.width) / logo.height);
  return (
    <Image
      src={logo}
      alt=""
      width={width}
      height={height}
      preload={preload}
      // The design's exact PNG, scaled only by the browser: Next's resampling blurs the lettering.
      unoptimized
      className={cn("block w-auto", className)}
    />
  );
}
