import { LinkButton } from "@/shared/ui/button";
import { ArrowRightIcon } from "@/shared/ui/icons";
import { Pill } from "@/shared/ui/pill";

import { indicatorsContent as content } from "../content";

// [x, wickTop, wickBottom, bodyTop, bodyHeight, bullish]
const CANDLES: [number, number, number, number, number, boolean][] = [
  [30, 150, 205, 162, 32, false],
  [62, 140, 190, 148, 30, true],
  [94, 120, 172, 128, 34, true],
  [126, 128, 176, 136, 30, false],
  [158, 104, 156, 112, 34, true],
  [190, 86, 136, 94, 32, true],
  [222, 94, 142, 102, 30, false],
  [254, 70, 122, 78, 34, true],
  [286, 56, 104, 62, 32, true],
  [318, 62, 112, 70, 32, false],
  [350, 40, 92, 48, 34, true],
  [382, 26, 76, 34, 32, true],
];

/** Candles with the indicator line, its slower average (dashed) and the buy signals. */
function IndicatorChart({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 420 240" role="img" aria-label={label} className="block h-auto w-full">
      <path d="M0 60H420M0 120H420M0 180H420" stroke="#FFFFFF" strokeOpacity="0.06" />
      <g strokeWidth="2">
        {CANDLES.map(([x, y1, y2, top, height, bullish]) => {
          const color = bullish ? "#FF2B2B" : "#FFFFFF";
          const opacity = bullish ? undefined : 0.5;
          return (
            <g key={x}>
              <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeOpacity={opacity} />
              <rect
                x={x - 7}
                y={top}
                width="14"
                height={height}
                fill={color}
                fillOpacity={opacity}
              />
            </g>
          );
        })}
      </g>
      <polyline
        points="30,190 62,176 94,160 126,156 158,140 190,124 222,118 254,104 286,90 318,84 350,70 382,54"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.2"
      />
      <polyline
        points="30,200 62,192 94,182 126,176 158,166 190,154 222,146 254,136 286,124 318,116 350,104 382,92"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.45"
        strokeWidth="2"
        strokeDasharray="5 5"
      />
      <path d="M94 196l-7 10h14z" fill="#FFFFFF" />
      <path d="M254 138l-7 10h14z" fill="#FFFFFF" />
      <circle cx="382" cy="54" r="5" fill="#FFFFFF" />
    </svg>
  );
}

/** Red block at the end of the resources panel (#indicadores). */
export function IndicatorsPromo() {
  return (
    <div
      id="indicadores"
      data-reveal
      className="mt-6 flex flex-wrap items-center gap-x-12 gap-y-8 rounded-card-lg bg-accent p-5 text-ink md:p-[clamp(24px,3.5vw,44px)]"
    >
      <div className="min-w-0 flex-[1_1_380px]">
        <Pill tone="ink" size="tag" caps>
          {content.tag}
        </Pill>
        <h3 className="mt-4.5 mb-0 text-feature leading-compact font-semibold tracking-tight">
          {content.title}
        </h3>
        <p className="mt-3.5 mb-0 text-16 leading-relaxed text-ink-soft">{content.body}</p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {content.plans.map((plan) => (
            <Pill key={plan} tone="outline-ink" size="chip">
              {plan}
            </Pill>
          ))}
        </div>
        <LinkButton
          href={content.cta.href}
          tone="ink"
          className="group mt-6.5 min-h-[50px] gap-2.5 px-6 text-15"
        >
          {content.cta.label}
          <ArrowRightIcon className="transition-transform duration-300 group-hover:translate-x-1" />
        </LinkButton>
      </div>
      <div className="box-border min-w-0 flex-[1_1_360px] rounded-tile bg-ink p-3 md:p-4.5">
        <IndicatorChart label={content.chartLabel} />
      </div>
    </div>
  );
}
