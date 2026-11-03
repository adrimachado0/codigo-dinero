"use client";

import { useEffect, useRef, type ComponentProps } from "react";

import { createScene, drawScene, type SceneKind } from "@/shared/lib/particle-sphere";

export type ParticleSphereProps = Omit<ComponentProps<"canvas">, "ref" | "children"> & {
  kind: SceneKind;
};

const MAX_DPR = 2;
/** Frame the reference draws when motion is reduced. */
const STATIC_TIME = 6;

/**
 * Canvas port of the reference particle sphere ("hero") and sphere + price chart ("video").
 * Animates with requestAnimationFrame only while on screen; with reduced motion it draws a
 * single static frame and redraws on resize.
 */
export function ParticleSphere({ kind, className, ...props }: ParticleSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const scene = createScene(kind, Math.random);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = false;

    const draw = (t: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const W = Math.round(w * dpr);
      const H = Math.round(h * dpr);
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W;
        canvas.height = H;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawScene(ctx, scene, { kind, t, width: w, height: h });
    };

    const loop = (ms: number) => {
      draw(ms / 1000);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduce) draw(STATIC_TIME);
      else if (!raf) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible) start();
      else stop();
    });
    intersection.observe(canvas);

    const resize = new ResizeObserver(() => {
      if (reduce && visible) draw(STATIC_TIME);
    });
    resize.observe(canvas);

    return () => {
      stop();
      intersection.disconnect();
      resize.disconnect();
    };
  }, [kind]);

  return <canvas ref={canvasRef} className={className} {...props} />;
}
