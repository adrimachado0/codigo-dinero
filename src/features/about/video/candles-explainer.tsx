import type { ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Series,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { CANDLE_WIDTH, CANDLES } from "../candles";
import { Candle } from "./candle";
import { colors, fonts } from "./theme";

/**
 * "Velas japonesas en 20 segundos": what a candle is, its four prices, bullish vs bearish and
 * how candles draw a trend. Shown in "¿Qué es Código Dinero?" through @remotion/player.
 */

const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 between two frames, eased. */
function progress(frame: number, from: number, to: number) {
  return interpolate(frame, [from, to], [0, 1], { ...clamp, easing: ease });
}

/** Fade out of a scene over its last 12 frames. */
function useSceneOut() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], clamp);
}

function Grid() {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.surface,
        backgroundImage: `linear-gradient(${colors.grid} 1px, transparent 1px), linear-gradient(90deg, ${colors.grid} 1px, transparent 1px)`,
        backgroundSize: "100px 100px",
      }}
    />
  );
}

function Heading({ children, frame }: { children: ReactNode; frame: number }) {
  const shown = progress(frame, 0, 18);
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        top: 70,
        opacity: shown,
        translate: `0 ${String((1 - shown) * 24)}px`,
      }}
    >
      <div
        style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 58, color: colors.white }}
      >
        {children}
      </div>
      <div
        style={{
          marginTop: 16,
          height: 6,
          width: 120 * progress(frame, 8, 30),
          background: colors.bear,
          borderRadius: 3,
        }}
      />
    </div>
  );
}

// Scene 1 ────────────────────────────────────────────────────────────────────────────────

const INTRO_CANDLES = [
  { high: 610, low: 760, open: 730, close: 650, bull: true },
  { high: 600, low: 740, open: 655, close: 715, bull: false },
  { high: 540, low: 720, open: 700, close: 580, bull: true },
  { high: 500, low: 650, open: 585, close: 530, bull: true },
  { high: 470, low: 620, open: 530, close: 590, bull: false },
  { high: 400, low: 600, open: 585, close: 430, bull: true },
];

function Intro() {
  const frame = useCurrentFrame();
  const out = useSceneOut();
  const title = progress(frame, 6, 32);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Grid />
      <div style={{ position: "absolute", left: 110, top: 190 }}>
        <span
          style={{
            display: "inline-block",
            opacity: progress(frame, 0, 14),
            background: colors.bear,
            color: "#111111",
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: 24,
            letterSpacing: "0.12em",
            padding: "10px 20px",
            borderRadius: 999,
          }}
        >
          CÓDIGO DINERO
        </span>
        <div
          style={{
            marginTop: 34,
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: 118,
            lineHeight: 1.05,
            color: colors.white,
            opacity: title,
            translate: `0 ${String((1 - title) * 40)}px`,
          }}
        >
          Velas
          <br />
          japonesas
        </div>
        <div
          style={{
            marginTop: 30,
            fontFamily: fonts.sans,
            fontSize: 46,
            color: colors.muted,
            opacity: progress(frame, 18, 40),
          }}
        >
          Cómo leer el precio en 20 segundos
        </div>
      </div>
      {INTRO_CANDLES.map((c, i) => (
        <Candle
          key={c.high}
          x={980 + i * 72}
          high={c.high}
          low={c.low}
          open={c.open}
          close={c.close}
          width={44}
          color={c.bull ? colors.bull : colors.bear}
          grow={progress(frame, 14 + i * 5, 34 + i * 5)}
        />
      ))}
    </AbsoluteFill>
  );
}

// Scene 2 ────────────────────────────────────────────────────────────────────────────────

const ANATOMY = { x: 430, high: 210, close: 340, open: 600, low: 770, width: 150 };

const PARTS = [
  { y: ANATOMY.high, label: "Máximo", note: "el precio más alto", at: 50 },
  { y: ANATOMY.close, label: "Cierre", note: "dónde terminó", at: 72 },
  { y: ANATOMY.open, label: "Apertura", note: "dónde empezó", at: 94 },
  { y: ANATOMY.low, label: "Mínimo", note: "el precio más bajo", at: 116 },
];

function PriceLabel({
  y,
  label,
  note,
  shown,
}: {
  y: number;
  label: string;
  note: string;
  shown: number;
}) {
  const lineStart = ANATOMY.x + ANATOMY.width / 2 + 24;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: lineStart,
          top: y - 1,
          height: 2,
          width: 150 * shown,
          background: "rgba(255,255,255,0.45)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: lineStart + 170,
          top: y - 32,
          opacity: shown,
          translate: `${String((1 - shown) * 20)}px 0`,
          fontFamily: fonts.sans,
          whiteSpace: "nowrap",
        }}
      >
        <div style={{ fontSize: 46, lineHeight: 1, fontWeight: 600, color: colors.white }}>
          {label}
        </div>
        <div style={{ marginTop: 8, fontSize: 34, color: colors.muted }}>{note}</div>
      </div>
    </>
  );
}

function Bracket({
  top,
  bottom,
  title,
  note,
  shown,
}: {
  top: number;
  bottom: number;
  title: string;
  note: string;
  shown: number;
}) {
  return (
    <div style={{ position: "absolute", left: 1060, top, height: bottom - top, opacity: shown }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 18,
          border: `4px solid ${colors.bear}`,
          borderLeft: 0,
          borderRadius: "0 12px 12px 0",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 44,
          top: "50%",
          translate: "0 -50%",
          fontFamily: fonts.sans,
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 38, color: colors.white }}
        >
          {title}
        </div>
        <div style={{ marginTop: 6, fontSize: 34, color: colors.muted }}>{note}</div>
      </div>
    </div>
  );
}

function Anatomy() {
  const frame = useCurrentFrame();
  const out = useSceneOut();
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Grid />
      <Heading frame={frame}>Anatomía de una vela</Heading>
      <Candle {...ANATOMY} color={colors.bull} grow={progress(frame, 12, 44)} />
      {PARTS.map((part) => (
        <PriceLabel key={part.label} {...part} shown={progress(frame, part.at, part.at + 18)} />
      ))}
      <Bracket
        top={ANATOMY.close}
        bottom={ANATOMY.open}
        title="Cuerpo"
        note="apertura → cierre"
        shown={progress(frame, 145, 165)}
      />
      <div
        style={{
          position: "absolute",
          left: 1060,
          top: 650,
          opacity: progress(frame, 175, 195),
          fontFamily: fonts.sans,
        }}
      >
        <div
          style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 38, color: colors.white }}
        >
          Mechas
        </div>
        <div style={{ marginTop: 6, fontSize: 34, color: colors.muted }}>
          hasta el máximo
          <br />y el mínimo
        </div>
      </div>
    </AbsoluteFill>
  );
}

// Scene 3 ────────────────────────────────────────────────────────────────────────────────

function Side({
  x,
  color,
  title,
  text,
  bullish,
  shown,
}: {
  x: number;
  color: string;
  title: string;
  text: string;
  bullish: boolean;
  shown: number;
}) {
  return (
    <div style={{ position: "absolute", left: x, top: 0, width: 640, height: 900, opacity: shown }}>
      <Candle
        x={130}
        high={250}
        low={690}
        open={bullish ? 590 : 330}
        close={bullish ? 330 : 590}
        width={120}
        color={color}
        grow={shown}
      />
      <div
        style={{ position: "absolute", left: 250, top: 330, width: 380, fontFamily: fonts.sans }}
      >
        <div style={{ fontSize: 34, color, fontWeight: 600 }}>{bullish ? "▲" : "▼"}</div>
        <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 60, color }}>
          {title}
        </div>
        <div style={{ marginTop: 18, fontSize: 38, lineHeight: 1.35, color: colors.white }}>
          {text}
        </div>
      </div>
    </div>
  );
}

function BullBear() {
  const frame = useCurrentFrame();
  const out = useSceneOut();
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Grid />
      <Heading frame={frame}>¿Quién ganó?</Heading>
      <Side
        x={90}
        color={colors.bull}
        title="Alcista"
        text="Cierra por encima de la apertura: ganaron los compradores."
        bullish
        shown={progress(frame, 10, 34)}
      />
      <Side
        x={790}
        color={colors.bear}
        title="Bajista"
        text="Cierra por debajo de la apertura: ganaron los vendedores."
        bullish={false}
        shown={progress(frame, 40, 64)}
      />
    </AbsoluteFill>
  );
}

// Scene 4 ────────────────────────────────────────────────────────────────────────────────

// The site's candle chart (800 × 480 units) stretched over the plot area.
const PLOT = { left: 110, top: 190, width: 1280, height: 600 };
const sx = PLOT.width / 800;
const sy = PLOT.height / 480;

function Trend() {
  const frame = useCurrentFrame();
  const brand = progress(frame, 88, 108);
  return (
    <AbsoluteFill>
      <Grid />
      <Heading frame={frame}>Juntas muestran la tendencia</Heading>
      {CANDLES.map(([x, wickTop, wickBottom, bodyTop, bodyHeight, bullish], i) => (
        <Candle
          key={x}
          x={PLOT.left + x * sx}
          high={PLOT.top + wickTop * sy}
          low={PLOT.top + wickBottom * sy}
          open={PLOT.top + (bullish ? bodyTop + bodyHeight : bodyTop) * sy}
          close={PLOT.top + (bullish ? bodyTop : bodyTop + bodyHeight) * sy}
          width={CANDLE_WIDTH * sx}
          color={bullish ? colors.bull : colors.bear}
          grow={progress(frame, 10 + i * 2, 22 + i * 2)}
        />
      ))}
      <AbsoluteFill
        style={{
          opacity: brand,
          background: "linear-gradient(to top, rgba(15,15,15,0.96) 30%, rgba(15,15,15,0))",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 90,
            textAlign: "center",
            translate: `0 ${String((1 - brand) * 24)}px`,
          }}
        >
          <div
            style={{
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 72,
              color: colors.white,
            }}
          >
            Código Dinero
          </div>
          <div style={{ marginTop: 14, fontFamily: fonts.sans, fontSize: 34, color: colors.muted }}>
            Aprende <span style={{ color: colors.bear }}>✦</span> Analiza{" "}
            <span style={{ color: colors.bear }}>✦</span> Opera
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

export function CandlesExplainer() {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: colors.canvas }}>
      <Series>
        <Series.Sequence name="Intro" durationInFrames={3 * fps}>
          <Intro />
        </Series.Sequence>
        <Series.Sequence name="Anatomía" durationInFrames={8 * fps}>
          <Anatomy />
        </Series.Sequence>
        <Series.Sequence name="Alcista y bajista" durationInFrames={5 * fps}>
          <BullBear />
        </Series.Sequence>
        <Series.Sequence name="Tendencia" durationInFrames={4 * fps}>
          <Trend />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
}
