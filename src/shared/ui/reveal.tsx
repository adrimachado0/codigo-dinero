"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, type ReactNode } from "react";

import { isMotionFrozen } from "@/shared/lib/motion";

gsap.registerPlugin(useGSAP);

/**
 * Container that rises and fades in the first time it scrolls into view, followed by its
 * `[data-reveal]` descendants in a stagger. Transforms and opacity only (no CLS).
 * Stays static if it is already on screen at load (no flash) or when motion is frozen.
 */
export function Reveal({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element || isMotionFrozen()) return;
      if (element.getBoundingClientRect().top < window.innerHeight) return;

      const items = element.querySelectorAll("[data-reveal]");
      const timeline = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        .from(element, { y: 40, autoAlpha: 0, duration: 0.7 })
        .from(items, { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, 0.15);
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          timeline.play();
          observer.disconnect();
        },
        { rootMargin: "0px 0px -15% 0px" },
      );
      observer.observe(element);
      return () => {
        observer.disconnect();
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
