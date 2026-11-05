import { PromoVideoCard } from "@/features/promo-video";
import { photos } from "@/shared/config/photos";
import { CandlesIcon } from "@/shared/ui/icons";
import { PersonPhoto } from "@/shared/ui/person-photo";
import { Pill } from "@/shared/ui/pill";
import { Reveal } from "@/shared/ui/reveal";
import { Sparkle } from "@/shared/ui/sparkle";

import { aboutContent } from "../content";

const mentor = photos.mentor;

export function About() {
  return (
    <section id="que-es" aria-labelledby="que-es-title" className="relative px-6 pt-27.5">
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

        <div className="mt-12 flex flex-wrap items-end gap-4.5">
          <div data-reveal className="relative min-w-0 flex-[1.75_1_460px]">
            <Sparkle size={34} className="absolute -top-4 -left-3.5 z-2" />
            <PromoVideoCard />
          </div>
          <div
            data-reveal
            className="relative h-[440px] min-w-0 flex-[1_1_260px] overflow-hidden rounded-card bg-surface-600"
          >
            <PersonPhoto
              tone="graphite"
              photo={mentor}
              label={null}
              sizes="(max-width: 767px) 92vw, 400px"
              className={
                mentor
                  ? "absolute top-8 left-1/2 w-[92%] -translate-x-1/2"
                  : "absolute bottom-0 left-1/2 w-[82%] -translate-x-1/2"
              }
              imageClassName="[filter:grayscale(1)_contrast(1.05)]"
            />
            <CandlesIcon className="absolute top-6.5 right-6.5 text-accent" />
            {!mentor && (
              <Pill className="absolute top-6.5 left-5.5">{aboutContent.mentorLabel}</Pill>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
