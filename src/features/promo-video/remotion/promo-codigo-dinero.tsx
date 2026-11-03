import { useEffect, useMemo, useRef, useState } from "react";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { ACCENT, createScene, drawScene } from "@/shared/lib/particle-sphere";
import { seededRandom } from "@/shared/lib/random";

export const PROMO_COMPOSITION = {
  id: "PromoCodigoDinero",
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 13 * 30,
} as const;

const FONT = "CodLexend, system-ui, sans-serif";
const DISPLAY_FONT = "CodUnbounded, system-ui, sans-serif";

const FONT_FACES = [
  { family: "CodLexend", file: "fonts/lexend-latin.woff2", weight: "100 900" },
  { family: "CodUnbounded", file: "fonts/unbounded-latin.woff2", weight: "200 900" },
];

/** Loads the site fonts (public/fonts) before rendering frames, in Studio, render and Player. */
function useCompositionFonts() {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    Promise.all(
      FONT_FACES.map(async ({ family, file, weight }) => {
        const face = await new FontFace(family, `url(${staticFile(file)})`, { weight }).load();
        document.fonts.add(face);
      }),
    ).then(
      () => {
        continueRender(handle);
      },
      (error: unknown) => {
        cancelRender(error);
      },
    );
  }, [handle]);
}

/** Particle sphere + glowing red price line, drawn deterministically for each frame. */
function SphereAndChart() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scene = useMemo(() => createScene("video", seededRandom(7)), []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawScene(ctx, scene, {
      kind: "video",
      // Starts mid-way so the price line is already drawing on the first frame.
      t: 2 + frame / fps,
      width,
      height,
      layout: { cx: width * 0.7, cy: height * 0.46, radius: height * 0.3 },
    });
  }, [frame, fps, width, height, scene]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}

export function PromoCodigoDinero() {
  useCompositionFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const title = spring({ frame: frame - 20, fps, config: { damping: 200 } });
  const subtitle = spring({ frame: frame - 45, fps, config: { damping: 200 } });
  const logo = interpolate(frame, [90, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#141414" }}>
      <SphereAndChart />
      <AbsoluteFill style={{ padding: 120, justifyContent: "flex-end", color: "#FFFFFF" }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 34,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: ACCENT,
            opacity: subtitle,
            transform: `translateY(${String((1 - subtitle) * 24)}px)`,
          }}
        >
          Academia de trading
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: DISPLAY_FONT,
            fontSize: 120,
            fontWeight: 800,
            lineHeight: 1,
            opacity: title,
            transform: `translateY(${String((1 - title) * 40)}px)`,
          }}
        >
          Código Dinero
        </div>
        <div
          style={{
            marginTop: 56,
            display: "flex",
            alignItems: "center",
            gap: 24,
            opacity: logo,
            fontFamily: FONT,
            fontSize: 26,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: ACCENT }}>Partner oficial</span>
          <span style={{ width: 2, height: 36, background: "rgba(255,255,255,0.3)" }} />
          <Img src={staticFile("brand/ecmarkets-logo.svg")} style={{ height: 64 }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
