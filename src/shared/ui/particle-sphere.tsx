"use client";

import { useEffect, useRef, type ComponentProps } from "react";

import { isMotionFrozen } from "@/shared/lib/motion";
import { createScene, drawScene, type SceneKind } from "@/shared/lib/particle-sphere";

export type ParticleSphereProps = Omit<ComponentProps<"canvas">, "ref" | "children"> & {
  kind: SceneKind;
  /** The sphere turns toward the cursor and nearby dots move away from it. */
  interactive?: boolean;
};

const MAX_DPR = 2;
/** Frame drawn when motion is frozen (visual tests): same as the reference's static frame. */
const STATIC_TIME = 6;
/** Extra pointer area around the canvas (px) where the effect still applies. */
const POINTER_MARGIN = 40;

/**
 * Canvas port of the reference particle sphere ("hero") and sphere + price chart ("video").
 * Animates with requestAnimationFrame only while on screen.
 */
export function ParticleSphere({
  kind,
  interactive = false,
  className,
  ...props
}: ParticleSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const scene = createScene(kind, Math.random);
    const frozen = isMotionFrozen();
    let raf = 0;
    let visible = false;

    // Cursor state: `target` follows the mouse, `current` eases toward it every frame.
    const target = { x: 0, y: 0, strength: 0, spin: 0, tilt: 0 };
    const current = { ...target };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside =
        x > -POINTER_MARGIN &&
        y > -POINTER_MARGIN &&
        x < rect.width + POINTER_MARGIN &&
        y < rect.height + POINTER_MARGIN;
      target.strength = inside ? 1 : 0;
      if (!inside) return;
      target.x = x;
      target.y = y;
      // -1..1 from the center: the sphere turns up to ~0.9 rad sideways and 0.35 rad up/down.
      target.spin = (x / rect.width - 0.5) * 1.8;
      target.tilt = (y / rect.height - 0.5) * 0.7;
    };
    const onPointerLeave = () => {
      target.strength = 0;
    };

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
      drawScene(ctx, scene, {
        kind,
        t,
        width: w,
        height: h,
        ...(interactive && { pointer: current }),
      });
    };

    const ease = (from: number, to: number, k: number) => from + (to - from) * k;
    const loop = (ms: number) => {
      current.x = ease(current.x, target.x, 0.18);
      current.y = ease(current.y, target.y, 0.18);
      current.strength = ease(current.strength, target.strength, 0.08);
      current.spin = ease(current.spin, target.strength ? target.spin : 0, 0.04);
      current.tilt = ease(current.tilt, target.strength ? target.tilt : 0, 0.04);
      draw(ms / 1000);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (frozen) draw(STATIC_TIME);
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
      if (frozen && visible) draw(STATIC_TIME);
    });
    resize.observe(canvas);

    if (interactive && !frozen) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      stop();
      intersection.disconnect();
      resize.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [kind, interactive]);

  return <canvas ref={canvasRef} className={className} {...props} />;
}
