"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { PlayIcon } from "@/shared/ui/icons";
import { ParticleSphere } from "@/shared/ui/particle-sphere";

import { promoVideoContent } from "../content";

// Remotion's Player only loads after the user asks for the video: no cost for LCP/TBT.
const PromoPlayer = dynamic(() => import("./promo-player"), { ssr: false });

const captionBars = [
  { width: "w-2.25", opacity: "" },
  { width: "w-1.25", opacity: "opacity-80" },
  { width: "w-0.75", opacity: "opacity-60" },
  { width: "w-0.5", opacity: "opacity-40" },
];

/** Video card: animated canvas as poster; the red button starts the Player. */
export function PromoVideoCard() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative h-[260px] overflow-hidden rounded-card border border-white/8 bg-surface-100 md:h-[380px]">
      {playing ? (
        <PromoPlayer labels={promoVideoContent} />
      ) : (
        <>
          <ParticleSphere
            kind="video"
            role="img"
            aria-label={promoVideoContent.posterLabel}
            className="absolute inset-0 block size-full"
          />
          <button
            type="button"
            aria-label={promoVideoContent.playLabel}
            onClick={() => {
              setPlaying(true);
            }}
            className="absolute top-[44%] left-1/2 flex size-17.5 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-0 bg-accent p-0 text-ink"
          >
            <PlayIcon />
          </button>
          <div className="absolute right-5.5 bottom-5.5 left-5.5 flex items-stretch gap-1.25">
            <div className="bg-accent py-3 pr-5.5 pl-6.5 text-13 leading-caps font-semibold tracking-caps-sm text-ink uppercase">
              {promoVideoContent.caption}
            </div>
            {captionBars.map((bar) => (
              <div key={bar.width} className={`${bar.width} bg-accent ${bar.opacity}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
