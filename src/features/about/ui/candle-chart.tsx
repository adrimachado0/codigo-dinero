"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

import { isMotionFrozen } from "@/shared/lib/motion";

import { CANDLE_WIDTH, CANDLES } from "../candles";

gsap.registerPlugin(useGSAP);

// Light candles close up, red ones close down (same colors as the design).
const UP = "#E6E6E6";
const DOWN = "#FF2B2B";

/**
 * Candlestick chart of the design. The first time it scrolls into view the candles grow
 * from their middle, left to right; it stays static when it is already on screen at load,
 * with "reduce motion" or when motion is frozen (visual tests).
 */
export function CandleChart({ label }: { label: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg || isMotionFrozen()) return;
      if (svg.getBoundingClientRect().top < window.innerHeight) return;

      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const timeline = gsap.timeline({ paused: true }).from(svg.querySelectorAll("g"), {
          scaleY: 0,
          opacity: 0,
          transformOrigin: "50% 50%",
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.035,
          clearProps: "transform,opacity",
        });
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry?.isIntersecting) return;
            timeline.play();
            observer.disconnect();
          },
          { rootMargin: "0px 0px -15% 0px" },
        );
        observer.observe(svg);
        return () => {
          observer.disconnect();
        };
      });
      return () => {
        media.revert();
      };
    },
    { scope: ref },
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 800 480"
      role="img"
      aria-label={label}
      className="absolute top-0 left-0 size-full"
    >
      <path
        d="M0 80H800M0 160H800M0 240H800M0 320H800M0 400H800M100 0V480M200 0V480M300 0V480M400 0V480M500 0V480M600 0V480M700 0V480"
        stroke="#FFFFFF"
        strokeOpacity="0.05"
      />
      {CANDLES.map(([x, wickTop, wickBottom, bodyTop, bodyHeight, bullish]) => {
        const color = bullish ? UP : DOWN;
        return (
          <g key={x}>
            <line x1={x} y1={wickTop} x2={x} y2={wickBottom} stroke={color} strokeWidth="2" />
            <rect
              x={x - CANDLE_WIDTH / 2}
              y={bodyTop}
              width={CANDLE_WIDTH}
              height={bodyHeight}
              fill={color}
            />
          </g>
        );
      })}
    </svg>
  );
}
