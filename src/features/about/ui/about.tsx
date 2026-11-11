import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { Reveal } from "@/shared/ui/reveal";
import { Sparkle } from "@/shared/ui/sparkle";

import { aboutContent } from "../content";
import { BearIcon } from "./bear-icon";
import { BullIcon } from "./bull-icon";
import { CandleChart } from "./candle-chart";

/** Bull or bear with its label, outside the chart (below 1024px both go under it). */
function Animal({
  label,
  tone,
  children,
}: {
  label: string;
  tone: "buy" | "sell";
  children: ReactNode;
}) {
  return (
    <div
      data-reveal
      className="flex min-w-0 flex-[0_0_250px] flex-col items-center gap-3 max-lg:flex-[0_1_220px] max-md:flex-[1_1_0] max-md:gap-2"
    >
      {children}
      <span
        className={cn(
          "rounded-full px-3.5 py-[7px] text-12 font-bold tracking-caps-md whitespace-nowrap text-canvas uppercase max-md:px-[11px] max-md:py-1.5 max-md:text-10 max-md:tracking-caps-xs",
          tone === "buy" ? "bg-bull" : "bg-accent",
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function About() {
  return (
    <section
      id="que-es"
      aria-labelledby="que-es-title"
      className="relative px-4 pt-18 md:px-6 md:pt-27.5"
    >
      <Reveal self={false} className="mx-auto max-w-content">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div data-reveal className="max-w-[520px] flex-[1_1_380px]">
            <p className="m-0 text-14 font-medium tracking-caps text-accent uppercase">
              {aboutContent.eyebrow}
            </p>
            <h2
              id="que-es-title"
              className="mt-3.5 mb-0 text-about leading-subheading font-medium tracking-tight"
            >
              {aboutContent.title}
            </h2>
          </div>
          <p
            data-reveal
            className="m-0 max-w-[440px] flex-[1_1_340px] text-15 leading-loose text-fg-muted"
          >
            {aboutContent.body}
          </p>
        </div>

        <div className="mt-12 flex items-end gap-5.5 max-lg:flex-wrap max-lg:justify-between max-lg:gap-x-3 max-lg:gap-y-4.5">
          <Animal label={aboutContent.buyLabel} tone="buy">
            <BullIcon color="var(--color-bull)" className="block h-auto w-full" />
          </Animal>
          <div
            data-reveal
            className="relative min-w-0 flex-auto max-lg:order-first max-lg:flex-[1_1_100%]"
          >
            <Sparkle size={34} className="absolute -top-4 -left-3.5 z-2" />
            <div className="relative aspect-[800/480] overflow-hidden rounded-card border border-white/8 bg-surface-100">
              <CandleChart label={aboutContent.chartLabel} />
            </div>
          </div>
          <Animal label={aboutContent.sellLabel} tone="sell">
            <BearIcon color="var(--color-accent)" className="block h-auto w-[86%]" />
          </Animal>
        </div>
      </Reveal>
    </section>
  );
}
