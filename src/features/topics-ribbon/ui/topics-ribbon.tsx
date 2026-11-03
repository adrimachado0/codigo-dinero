import { Marquee } from "@/shared/ui/marquee";

import { topicsContent } from "../content";

/** Two crossed ribbons: cream (60 s, reversed) under red (40 s). */
export function TopicsRibbon() {
  return (
    <section
      aria-label={topicsContent.label}
      className="relative mt-22.5 h-[220px] overflow-hidden"
    >
      <Marquee
        duration={60}
        reverse
        className="absolute top-20.5 -left-[5%] w-[110%] rotate-3 border-y border-ink bg-cream text-ink"
        trackClassName="py-3 text-17 font-medium whitespace-nowrap"
      >
        <span className="pr-7">{topicsContent.creamRibbon}</span>
      </Marquee>
      <Marquee
        duration={40}
        className="absolute top-20 -left-[5%] w-[110%] -rotate-3 bg-accent text-ink"
        trackClassName="py-4 font-display text-22 font-extrabold whitespace-nowrap"
      >
        <span className="pr-8">{topicsContent.redRibbon}</span>
      </Marquee>
    </section>
  );
}
