import {
  libraryRequestMessage,
  linkAttributes,
  whatsappLink,
  whatsappUrl,
} from "@/shared/config/links";
import { LinkButton } from "@/shared/ui/button";
import { WhatsAppIcon } from "@/shared/ui/icons";
import { Pill } from "@/shared/ui/pill";
import { Reveal } from "@/shared/ui/reveal";

import { libraryContent as content } from "../content";
import { BookCover, LibraryCover } from "./covers";

/** "Libro y biblioteca": the book (bought over WhatsApp) and the library grid. */
export function Library() {
  return (
    <section
      id="biblioteca"
      aria-labelledby="biblioteca-title"
      className="px-4 pt-18 md:px-6 md:pt-27.5"
    >
      <Reveal self={false} className="mx-auto max-w-content">
        <div className="flex flex-wrap items-center gap-x-16 gap-y-10">
          <div
            data-reveal
            className="relative box-border flex max-w-[460px] min-w-0 flex-[1_1_340px] justify-center overflow-hidden rounded-[32px] border border-white/6 bg-surface-300 px-4 py-11 md:px-6 md:py-16"
          >
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 -mt-[170px] -ml-[170px] size-[340px] rounded-full bg-wine shadow-[0_0_120px_rgba(255,43,43,0.18)]"
            />
            <BookCover cover={content.cover} />
          </div>

          <div data-reveal className="min-w-0 flex-[1.2_1_420px]">
            <p className="m-0 text-14 font-medium tracking-caps text-accent uppercase">
              {content.eyebrow}
            </p>
            <h2
              id="biblioteca-title"
              className="mt-3.5 mb-0 text-about leading-subheading font-medium"
            >
              {content.titleLead}{" "}
              <span className="block text-accent">{content.titleHighlight}</span>
            </h2>
            <p className="mt-5.5 mb-0 text-18 leading-[1.55] text-fg-quote">{content.lead}</p>
            <p className="mt-4 mb-0 text-15 leading-airy text-fg-muted">{content.body}</p>
            <div className="mt-5.5 flex flex-wrap gap-2.5">
              {content.chips.map((chip) => (
                <Pill key={chip} tone="outline" size="sm">
                  {chip}
                </Pill>
              ))}
            </div>
            <LinkButton
              {...linkAttributes(whatsappLink("book"))}
              className="mt-7 box-border min-h-13 justify-center gap-2.5 px-6 text-15"
            >
              <WhatsAppIcon />
              {content.buyCta}
            </LinkButton>
          </div>
        </div>

        <div data-reveal className="mt-18 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <h3 className="m-0 text-28 font-medium">{content.library.title}</h3>
          <p className="m-0 text-14 text-placeholder">{content.library.note}</p>
        </div>
        <ul className="mt-5.5 mb-0 grid list-none grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 p-0">
          {content.library.items.map((item) => (
            <li key={item.kind} data-reveal className="flex min-w-0 flex-col gap-3">
              <LibraryCover item={item} />
              <a
                {...linkAttributes({
                  href: whatsappUrl(libraryRequestMessage(item.title)),
                  external: true,
                  dataLink: "whatsapp-biblioteca",
                })}
                aria-label={`${content.library.requestCta}: ${item.kind}`}
                className="inline-flex min-h-11 items-center gap-2 text-14 font-medium text-white no-underline transition-colors duration-300 hover:text-accent"
              >
                <WhatsAppIcon size={16} />
                {content.library.requestCta}
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
