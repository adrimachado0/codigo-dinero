import { photos } from "@/shared/config/photos";
import { PersonPhoto } from "@/shared/ui/person-photo";
import { Reveal } from "@/shared/ui/reveal";
import { Sparkle } from "@/shared/ui/sparkle";

import { leadContent } from "./content";
import { LeadForm } from "./lead-form";

const photo = photos.cta;

export function LeadCapture() {
  return (
    <section aria-label={leadContent.sectionLabel} className="px-6 pt-25">
      <Reveal
        self={false}
        className="mx-auto flex max-w-content flex-wrap items-end justify-between gap-8"
      >
        <div data-reveal className="max-w-[560px] flex-[1_1_420px] pb-15">
          <h2 className="m-0 text-cta leading-heading font-medium tracking-tight">
            {leadContent.title}
          </h2>
          <p className="mt-4.5 mb-0 text-15 leading-relaxed text-fg-muted">{leadContent.body}</p>
          <LeadForm labels={leadContent} />
        </div>
        <div data-reveal className="relative h-[380px] min-w-0 flex-[0_1_360px]">
          <Sparkle size={40} className="absolute top-7.5 left-2.5" />
          <PersonPhoto
            tone="charcoal"
            photo={photo}
            sizes="300px"
            className="absolute bottom-0 left-1/2 -ml-[150px] w-[300px]"
          />
        </div>
      </Reveal>
    </section>
  );
}
