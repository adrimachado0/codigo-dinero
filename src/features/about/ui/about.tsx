import { PromoVideoCard } from "@/features/promo-video";
import { Reveal } from "@/shared/ui/reveal";
import { Sparkle } from "@/shared/ui/sparkle";

import { aboutContent } from "../content";

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

        {/* The mentor card moved to "Quién soy": the video spans the full width. */}
        <div className="mt-12 flex flex-wrap items-end gap-4.5">
          <div data-reveal className="relative min-w-0 flex-[1.75_1_460px]">
            <Sparkle size={34} className="absolute -top-4 -left-3.5 z-2" />
            <PromoVideoCard />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
