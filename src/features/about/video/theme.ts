/** Look of the candlestick video: the site's palette and fonts. */
export const colors = {
  canvas: "#0F0F0F",
  surface: "#141414",
  white: "#FFFFFF",
  muted: "#BDBDBD",
  grid: "rgba(255,255,255,0.05)",
  /** Buy side: same green as the bull next to the video. */
  bull: "#20C46B",
  /** Sell side: the brand red, as the bear. */
  bear: "#FF2B2B",
} as const;

// On the site the fonts come from next/font (CSS variables); in Studio and renders the variables
// are unset, so each one falls back to the family loaded in video/index.ts.
export const fonts = {
  sans: "var(--font-lexend, Lexend), system-ui, sans-serif",
  display: "var(--font-unbounded, Unbounded), sans-serif",
} as const;

/** 5:3, like the frame of "¿Qué es Código Dinero?" (800 × 480). */
export const CANDLES_VIDEO = {
  id: "VelasJaponesas",
  width: 1500,
  height: 900,
  fps: 30,
  durationInFrames: 600,
} as const;
