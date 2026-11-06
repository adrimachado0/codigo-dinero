import { IndicatorsPromo } from "@/features/indicators";
import { ArrowRightIcon, ArrowUpRightIcon, PlayIcon } from "@/shared/ui/icons";
import { Reveal } from "@/shared/ui/reveal";
import { SectionTitle } from "@/shared/ui/section-title";

import { trainingContent as content } from "../content";
import { CircularText } from "./circular-badge";

// Candles of the featured class: [x, wickTop, wickBottom, bodyTop, bodyHeight, bullish]
const CANDLES: [number, number, number, number, number, boolean][] = [
  [50, 250, 330, 268, 45, false],
  [90, 235, 300, 245, 42, true],
  [130, 205, 280, 215, 52, true],
  [170, 215, 285, 225, 44, false],
  [210, 180, 255, 190, 55, true],
  [250, 150, 225, 160, 52, true],
  [290, 160, 230, 168, 45, false],
  [330, 120, 195, 130, 55, true],
  [370, 95, 165, 103, 52, true],
];

function CandleChart() {
  return (
    <svg
      viewBox="0 0 400 420"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className="absolute top-0 left-0 size-full"
    >
      <path
        d="M0 70H400M0 140H400M0 210H400M0 280H400M0 350H400M80 0V420M160 0V420M240 0V420M320 0V420"
        stroke="#FFFFFF"
        strokeOpacity="0.05"
      />
      <g strokeWidth="2">
        {CANDLES.map(([x, y1, y2, top, height, bullish]) => {
          const color = bullish ? "#FF2B2B" : "#FFFFFF";
          const opacity = bullish ? undefined : 0.55;
          return (
            <g key={x}>
              <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeOpacity={opacity} />
              <rect
                x={x - 9}
                y={top}
                width="18"
                height={height}
                fill={color}
                fillOpacity={opacity}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function Training() {
  return (
    <section id="formacion" aria-labelledby="formacion-title" className="px-4 pt-25">
      <Reveal className="relative mx-auto box-border max-w-panel rounded-panel border border-white/6 bg-surface-300 px-[clamp(20px,4vw,56px)] py-[clamp(28px,4vw,56px)]">
        <div className="absolute top-14 left-0 hidden h-[150px] w-7.5 items-center justify-center rounded-r-tab bg-accent md:flex">
          <span className="-rotate-90 text-10 font-semibold tracking-caps-lg whitespace-nowrap text-ink uppercase">
            {content.tab}
          </span>
        </div>

        <div className="flex flex-wrap items-stretch gap-6">
          <div data-reveal className="min-w-0 flex-[1_1_300px] pl-3">
            <SectionTitle
              id="formacion-title"
              lead={content.titleLead}
              highlight={content.titleHighlight}
            />
            <p className="mt-4.5 mb-0 max-w-[360px] text-15 leading-relaxed text-fg-muted">
              {content.intro}
            </p>
            <div className="mt-7 flex max-w-[380px] flex-col gap-3">
              {content.resources.map((resource) => (
                <a
                  key={resource.number}
                  href={resource.href}
                  className="group flex min-h-[54px] items-center gap-4 rounded-full border border-white/32 pr-4.5 pl-5.5 text-15 text-white no-underline transition-[background-color,color,border-color] duration-300 hover:border-white hover:bg-white hover:text-ink"
                >
                  <span className="font-display text-14 font-semibold text-accent">
                    {resource.number}
                  </span>
                  <span className="flex-auto">{resource.label}</span>
                  <ArrowRightIcon className="transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              ))}
            </div>
          </div>

          <a
            href={content.featured.href}
            data-reveal
            className="group relative block min-h-[420px] min-w-0 flex-[1.1_1_300px] overflow-hidden rounded-card-lg border border-white/8 bg-canvas text-white no-underline"
          >
            <CandleChart />
            <div className="absolute top-[42%] left-1/2 -mt-[95px] -ml-[95px] size-[190px]">
              <CircularText text={content.featured.circularText} />
              <span className="absolute top-1/2 left-1/2 -mt-[38px] -ml-[38px] flex size-[76px] items-center justify-center rounded-full bg-accent text-ink transition-[scale,background-color] duration-300 group-hover:scale-110 group-hover:bg-white">
                <PlayIcon size={24} />
              </span>
            </div>
            <div className="absolute right-5.5 bottom-5.5 left-5.5">
              <p className="m-0 text-12 font-semibold tracking-caps-md text-accent uppercase">
                {content.featured.eyebrow}
              </p>
              <h3 className="mt-1.5 mb-0 text-20 leading-snug font-medium">
                {content.featured.title}
              </h3>
            </div>
          </a>

          <div data-reveal className="flex min-w-0 flex-[0.8_1_220px] flex-col gap-4">
            <a
              href={content.recordings.href}
              className="group flex min-h-[190px] flex-auto flex-col justify-between gap-8 rounded-tile bg-surface-600 p-5.5 text-white no-underline transition-colors duration-300 hover:bg-white hover:text-ink"
            >
              <span className="text-14 leading-normal text-fg-soft transition-colors duration-300 group-hover:text-ink-soft">
                {content.recordings.text}
              </span>
              <span className="flex items-end justify-between gap-3">
                <span className="text-18 leading-tight font-semibold">
                  {content.recordings.labelLines[0]}
                  <br />
                  {content.recordings.labelLines[1]}
                </span>
                <ArrowUpRightIcon className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
            <a
              href={content.library.href}
              className="group flex min-h-[190px] flex-auto flex-col justify-between gap-8 rounded-tile bg-accent p-5.5 text-ink no-underline transition-colors duration-300 hover:bg-ink hover:text-white"
            >
              <span className="text-14 leading-normal text-ink-soft transition-colors duration-300 group-hover:text-fg-soft">
                {content.library.text}
              </span>
              <span className="flex items-end justify-between gap-3">
                <span className="text-18 leading-tight font-semibold">
                  {content.library.labelLines[0]}
                  <br />
                  {content.library.labelLines[1]}
                </span>
                <span className="flex size-10.5 items-center justify-center rounded-full bg-white text-ink transition-colors duration-300 group-hover:bg-accent">
                  <ArrowUpRightIcon
                    size={20}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </span>
            </a>
          </div>
        </div>

        <IndicatorsPromo />
      </Reveal>
    </section>
  );
}
