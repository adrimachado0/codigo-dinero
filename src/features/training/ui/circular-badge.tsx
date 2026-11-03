"use client";

import { useId, useRef } from "react";

import { spin, useLoopAnimation } from "@/shared/ui/use-loop-animation";

/** Text running around a circle, spinning every 20 s (reference codSpin). */
export function CircularText({ text }: { text: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const pathId = useId();
  useLoopAnimation(ref, (svg) => spin(svg, 20));

  return (
    <svg
      ref={ref}
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
      className="absolute top-0 left-0 size-full"
    >
      <defs>
        <path id={pathId} d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
      </defs>
      <text fill="#FFFFFF" fontSize="12" letterSpacing="3.4" className="font-sans">
        <textPath href={`#${pathId}`}>{text}</textPath>
      </text>
    </svg>
  );
}
