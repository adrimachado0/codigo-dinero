"use client";

import { useRef, type SVGProps } from "react";

import { cn } from "@/shared/lib/cn";
import { spin, useLoopAnimation } from "@/shared/ui/use-loop-animation";

export type StarburstProps = Omit<SVGProps<SVGSVGElement>, "children" | "ref"> & {
  size?: number;
  strokeWidth?: number;
  /** Seconds per turn (reference: logo 24, hero ornament 30). Static when omitted. */
  spinSeconds?: number;
};

/** Twelve-ray brand mark (logo, hero ornament, favicon). Color comes from `currentColor`. */
export function Starburst({
  size = 48,
  strokeWidth = 3,
  spinSeconds,
  className,
  ...props
}: StarburstProps) {
  const ref = useRef<SVGSVGElement>(null);

  useLoopAnimation(ref, (svg) => (spinSeconds ? spin(svg, spinSeconds) : null));

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className={cn("text-accent", className)}
      {...props}
    >
      <path d="M30 24L46 24M29.2 27L43.1 35M27 29.2L35 43.1M24 30L24 46M21 29.2L13 43.1M18.8 27L4.9 35M18 24L2 24M18.8 21L4.9 13M21 18.8L13 4.9M24 18L24 2M27 18.8L35 4.9M29.2 21L43.1 13" />
    </svg>
  );
}
