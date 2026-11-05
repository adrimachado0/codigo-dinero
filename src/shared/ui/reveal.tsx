"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, type ReactNode } from "react";

import { isMotionFrozen } from "@/shared/lib/motion";

gsap.registerPlugin(useGSAP);

/** Inline styles the reveal leaves behind; cleared at the end so no transform lingers. */
const REVEAL_PROPS = "transform,translate,rotate,scale,opacity";

type RevealProps = {
  className?: string;
  /** Also animate the container itself (panels, cards); `false` animates only its items. */
  self?: boolean;
  children: ReactNode;
};

/**
 * Container that rises and fades in the first time it scrolls into view, followed by its
 * `[data-reveal]` descendants in a stagger. Transforms and opacity only (no CLS).
 * Stays static if it is already on screen at load (no flash) or when motion is frozen.
 */
export function Reveal({ className, self = true, children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element || isMotionFrozen()) return;
      if (element.getBoundingClientRect().top < window.innerHeight) return;

      // Opacity, not `visibility`: hidden content must stay focusable and in the a11y tree.
      const items = element.querySelectorAll("[data-reveal]");
      const timeline = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      if (self) {
        timeline.from(element, { y: 40, opacity: 0, duration: 0.7, clearProps: REVEAL_PROPS });
      }
      if (items.length > 0) {
        timeline.from(
          items,
          { y: 24, opacity: 0, duration: 0.6, stagger: 0.08, clearProps: REVEAL_PROPS },
          self ? 0.15 : 0,
        );
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          timeline.play();
          observer.disconnect();
        },
        { rootMargin: "0px 0px -15% 0px" },
      );
      // Keyboard focus arriving before the scroll: show everything at once.
      const onFocusIn = () => {
        timeline.progress(1);
        observer.disconnect();
      };
      observer.observe(element);
      element.addEventListener("focusin", onFocusIn, { once: true });
      return () => {
        observer.disconnect();
        element.removeEventListener("focusin", onFocusIn);
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
