"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { RefObject } from "react";

import { isMotionFrozen } from "@/shared/lib/motion";

gsap.registerPlugin(useGSAP);

type LoopAnimation = gsap.core.Tween | gsap.core.Timeline;

/**
 * Runs an infinite GSAP animation on `ref`, pauses it while the element is off screen and
 * reverts everything on unmount (useGSAP context). Always on (see shared/lib/motion.ts).
 */
export function useLoopAnimation<T extends Element>(
  ref: RefObject<T | null>,
  /** Returns the animation, or `null` when this instance should stay static. */
  create: (element: T) => LoopAnimation | null,
) {
  useGSAP(() => {
    const element = ref.current;
    if (!element || isMotionFrozen()) return;
    const animation = create(element);
    if (!animation) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) animation.play();
      else animation.pause();
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  });
}

/** Continuous 360° rotation, as the reference `codSpin` keyframes. */
export function spin(element: Element, seconds: number): LoopAnimation {
  return gsap.to(element, {
    rotation: 360,
    duration: seconds,
    ease: "none",
    repeat: -1,
    transformOrigin: "50% 50%",
  });
}
