import type { CSSProperties } from "react";

/**
 * One candlestick in pixels: the wick spans low → high, the body open → close. `grow`
 * (0..1) draws it from its middle, so scenes can animate it frame by frame.
 */
export function Candle({
  x,
  high,
  low,
  open,
  close,
  width,
  color,
  grow = 1,
  style,
}: {
  x: number;
  high: number;
  low: number;
  open: number;
  close: number;
  width: number;
  color: string;
  grow?: number;
  style?: CSSProperties;
}) {
  const bodyTop = Math.min(open, close);
  const bodyHeight = Math.max(Math.abs(open - close), 3);
  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: high,
        width,
        height: low - high,
        scale: `1 ${String(grow)}`,
        opacity: Math.min(1, grow * 1.5),
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: Math.max(3, width / 12),
          translate: "-50% 0",
          background: color,
          borderRadius: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: bodyTop - high,
          height: bodyHeight,
          background: color,
          borderRadius: Math.min(8, width / 8),
        }}
      />
    </div>
  );
}
