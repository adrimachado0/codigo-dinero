"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { isMotionFrozen } from "@/shared/lib/motion";

import type { PlayerLabels } from "./candles-player";

// Remotion's Player only loads when the frame gets near the viewport: no cost for LCP/TBT.
const CandlesPlayer = dynamic(() => import("./candles-player"), { ssr: false });

/**
 * "Velas japonesas en 20 segundos" (Remotion) inside the frame of "¿Qué es Código Dinero?".
 * Not loaded while motion is frozen (visual tests).
 */
export function CandlesVideo({ labels }: { labels: PlayerLabels }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || isMotionFrozen()) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: "400px" },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {near && <CandlesPlayer labels={labels} />}
    </div>
  );
}
