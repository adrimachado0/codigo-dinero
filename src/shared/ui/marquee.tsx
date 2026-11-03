"use client";

import gsap from "gsap";
import { useRef, type ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";
import { useLoopAnimation } from "@/shared/ui/use-loop-animation";

export type MarqueeProps = ComponentProps<"div"> & {
  /** Classes of the moving track (padding, font, …). */
  trackClassName?: string;
  /** Seconds per loop (reference: ticker 44, red ribbon 40, cream ribbon 60). */
  duration: number;
  /** Moves left-to-right, like the reference's `reverse` cream ribbon. */
  reverse?: boolean;
};

/**
 * Seamless loop: the content is rendered twice side by side, so translating the track by
 * −50% lands exactly on the start. The copy is hidden from assistive tech.
 */
export function Marquee({
  children,
  className,
  trackClassName,
  duration,
  reverse = false,
  ...props
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useLoopAnimation(trackRef, (track) =>
    gsap.fromTo(
      track,
      { xPercent: reverse ? -50 : 0 },
      { xPercent: reverse ? 0 : -50, duration, ease: "none", repeat: -1 },
    ),
  );

  return (
    <div className={cn("overflow-hidden", className)} {...props}>
      <div ref={trackRef} data-marquee-track="" className={cn("flex w-max", trackClassName)}>
        <div className="flex">{children}</div>
        <div className="flex" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
