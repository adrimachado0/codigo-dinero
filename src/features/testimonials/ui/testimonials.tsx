import { LinkButton } from "@/shared/ui/button";
import { SectionTitle } from "@/shared/ui/section-title";

import { testimonialsContent as content } from "../content";
import { TestimonialsCarousel } from "./testimonials-carousel";

export function Testimonials() {
  return (
    <section id="comunidad" aria-labelledby="comunidad-title" className="px-4 pt-27.5">
      <div className="mx-auto max-w-panel">
        <TestimonialsCarousel
          reviews={content.reviews}
          initialIndex={content.initialIndex}
          labels={{
            previous: content.previousLabel,
            next: content.nextLabel,
            carousel: content.carouselLabel,
          }}
          heading={
            <div className="flex-[1_1_380px]">
              <SectionTitle
                id="comunidad-title"
                lead={content.titleLead}
                highlight={content.titleHighlight}
              />
              <p className="mt-4 mb-0 max-w-[460px] text-15 leading-relaxed text-fg-muted">
                {content.intro}
              </p>
            </div>
          }
          joinLink={
            <LinkButton href={content.joinCta.href} tone="outline" size="lg" className="ml-1.5">
              {content.joinCta.label}
            </LinkButton>
          }
        />
      </div>
    </section>
  );
}
