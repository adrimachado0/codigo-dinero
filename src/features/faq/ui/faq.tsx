import { Pill } from "@/shared/ui/pill";
import { Reveal } from "@/shared/ui/reveal";
import { SectionTitle } from "@/shared/ui/section-title";

import { faqContent as content } from "../content";
import { FaqAccordion } from "./faq-accordion";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="px-4 pt-20">
      <Reveal className="mx-auto box-border flex max-w-panel flex-wrap items-start gap-x-14 gap-y-10 rounded-panel border border-white/6 bg-surface-300 p-[clamp(28px,4vw,56px)]">
        <div data-reveal className="max-w-[380px] flex-[1_1_280px]">
          <SectionTitle
            id="faq-title"
            lead={content.titleLead}
            highlight={content.titleHighlight}
          />
          <p className="mt-4.5 mb-0 text-15 leading-relaxed text-fg-muted">{content.intro}</p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {content.topics.map((topic) => (
              <Pill key={topic} tone="outline" size="sm">
                {topic}
              </Pill>
            ))}
          </div>
        </div>
        <FaqAccordion items={content.items} initialOpen={content.initialOpen} />
      </Reveal>
    </section>
  );
}
