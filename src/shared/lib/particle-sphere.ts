type RandomFn = () => number;

/**
 * Particle sphere of the hero, ported 1:1 from the reference (makeSphere, makeDust,
 * drawScene in reference/design-source.dc.html). Pure functions over a 2D context.
 */

type SpherePoint = { x: number; y: number; z: number; s: number; s2: number; dust: boolean };
type DustPoint = { x: number; y: number; v: number; a: number; hi: boolean; sz: number };

export type SceneState = { pts: SpherePoint[]; dust: DustPoint[] };

export const ACCENT = "#FF2B2B";

function makeSphere(rings: number, maxPer: number, random: RandomFn): SpherePoint[] {
  const pts: SpherePoint[] = [];
  for (let k = 0; k < rings; k++) {
    const th = (Math.PI * (k + 0.5)) / rings;
    const y = Math.cos(th);
    const r = Math.sin(th);
    const n = Math.max(6, Math.round(r * maxPer));
    for (let j = 0; j < n; j++) {
      const ph = (j / n) * Math.PI * 2 + k * 0.37;
      pts.push({
        x: Math.cos(ph) * r,
        y,
        z: Math.sin(ph) * r,
        s: random(),
        s2: random(),
        dust: random() < 0.16,
      });
    }
  }
  return pts;
}

function makeDust(n: number, random: RandomFn): DustPoint[] {
  const out: DustPoint[] = [];
  for (let i = 0; i < n; i++) {
    out.push({
      x: random(),
      y: random(),
      v: 0.2 + random() * 0.8,
      a: random(),
      hi: random() < 0.55,
      sz: random(),
    });
  }
  return out;
}

export function createScene(random: RandomFn): SceneState {
  return { pts: makeSphere(44, 60, random), dust: makeDust(110, random) };
}

export type DrawOptions = {
  /** Seconds since start. */
  t: number;
  /** CSS-pixel size of the drawing area. */
  width: number;
  height: number;
  accent?: string;
  /**
   * Cursor interaction (hero): extra rotation/tilt of the sphere (radians) and a point that
   * pushes nearby dots away. `strength` 0..1 fades the effect in and out.
   */
  pointer?: { x: number; y: number; strength: number; spin: number; tilt: number };
};

/** Radius (px) around the cursor where dots get pushed away, and the max push. */
const REPEL_RADIUS = 120;
const REPEL_DUST = 26;
const REPEL_SPHERE = 14;

/** Offset that pushes (x, y) away from the cursor, fading with distance. */
function repel(x: number, y: number, pointer: DrawOptions["pointer"], force: number) {
  if (!pointer || pointer.strength <= 0) return [0, 0] as const;
  const dx = x - pointer.x;
  const dy = y - pointer.y;
  const dist = Math.hypot(dx, dy);
  if (dist >= REPEL_RADIUS || dist === 0) return [0, 0] as const;
  const k = (1 - dist / REPEL_RADIUS) ** 2 * force * pointer.strength;
  return [(dx / dist) * k, (dy / dist) * k] as const;
}

export function drawScene(ctx: CanvasRenderingContext2D, scene: SceneState, opts: DrawOptions) {
  const { t, width: w, height: h, accent = ACCENT } = opts;
  ctx.clearRect(0, 0, w, h);
  const dot = "#FFFFFF";
  const dustCol = accent;
  const R = Math.min(w * 0.38, h * 0.42);
  const cx = w * 0.5;
  const cy = h * 0.62;
  for (const p of scene.dust) {
    const xx = (((p.x - t * 0.006 * p.v) % 1) + 1) % 1;
    const yy = p.y + Math.sin(t * 0.5 + p.a * 6.28) * 0.01;
    const tw = 0.5 + 0.5 * Math.sin(t * 1.3 + p.a * 20);
    ctx.globalAlpha = (p.hi ? 0.55 : 0.2) * tw;
    ctx.fillStyle = p.hi ? dustCol : dot;
    const sz = 0.9 + p.sz * 1.3;
    const [ox, oy] = repel(xx * w, yy * h, opts.pointer, REPEL_DUST);
    ctx.fillRect(xx * w + ox, yy * h + oy, sz, sz);
  }
  const rot = t * 0.16 + (opts.pointer?.spin ?? 0);
  const cr = Math.cos(rot);
  const sr = Math.sin(rot);
  const tl = -0.32 + (opts.pointer?.tilt ?? 0);
  const ct = Math.cos(tl);
  const stl = Math.sin(tl);
  ctx.fillStyle = dot;
  for (const p of scene.pts) {
    const x = p.x * cr + p.z * sr;
    const z0 = -p.x * sr + p.z * cr;
    const y = p.y * ct - z0 * stl;
    const z = p.y * stl + z0 * ct;
    const d = Math.max(0, -x - 0.1);
    const wob = 0.5 + 0.5 * Math.sin(t * 0.7 + p.s * 6.283);
    const spread = d * d * (0.8 + 1.1 * wob) * (0.5 + p.s);
    const px = x - spread * 1.25;
    const py = y + (p.s2 - 0.5) * spread * 1.1;
    const [ox, oy] = repel(cx + px * R, cy + py * R, opts.pointer, REPEL_SPHERE);
    const sx = cx + px * R + ox;
    const sy = cy + py * R + oy;
    if (sx < -4 || sx > w + 4 || sy < -4 || sy > h + 4) continue;
    const light = Math.max(0, x * 0.78 - y * 0.18 + z * 0.6);
    if (p.dust && d > 0.08) {
      ctx.fillStyle = dustCol;
      ctx.globalAlpha = Math.min(0.9, d * 1.5) * (0.4 + 0.6 * wob);
      ctx.fillRect(sx, sy, 1.8, 1.8);
      ctx.fillStyle = dot;
      continue;
    }
    let a: number;
    let sz: number;
    if (z >= 0) {
      a = 0.18 + 0.82 * light;
      sz = 1.1 + 1.3 * light;
    } else {
      a = 0.05 + 0.08 * (1 + z);
      sz = 0.9;
    }
    a *= 1 - Math.min(0.85, d * 0.95);
    ctx.globalAlpha = a;
    ctx.fillRect(sx - sz / 2, sy - sz / 2, sz, sz);
  }
  ctx.globalAlpha = 1;
}
