import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

export type MarqueeProps = ComponentProps<"div"> & {
  /** Classes of the moving track (padding, font, …). */
  trackClassName?: string;
};

/**
 * Seamless loop structure: the content is rendered twice side by side, so translating the
 * track by −50% lands exactly on the start. The copy is hidden from assistive tech.
 * The motion itself (GSAP, reduced motion, offscreen pause) is added in phase 6.
 */
export function Marquee({ children, className, trackClassName, ...props }: MarqueeProps) {
  return (
    <div className={cn("overflow-hidden", className)} {...props}>
      <div data-marquee-track="" className={cn("flex w-max", trackClassName)}>
        <div className="flex">{children}</div>
        <div className="flex" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
