"use client";

import gsap from "gsap";
import { useRef } from "react";

import { cn } from "@/shared/lib/cn";
import { useLoopAnimation } from "@/shared/ui/use-loop-animation";

/** "Live" red dot: opacity 1 → 0.25 → 1 every 1.6 s (reference codPulse). */
export function PulseDot({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useLoopAnimation(ref, (dot) =>
    gsap.to(dot, { opacity: 0.25, duration: 0.8, ease: "sine.inOut", yoyo: true, repeat: -1 }),
  );
  return <span ref={ref} className={cn("size-1.75 flex-none rounded-full bg-accent", className)} />;
}
