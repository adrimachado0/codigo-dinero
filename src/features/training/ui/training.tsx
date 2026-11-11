import Image from "next/image";

import { externalLinkProps, linkAttributes, links } from "@/shared/config/links";
import { photos } from "@/shared/config/photos";
import { ArrowRightIcon, ArrowUpRightIcon, PlayIcon, YouTubeIcon } from "@/shared/ui/icons";
import { Reveal } from "@/shared/ui/reveal";
import { SectionTitle } from "@/shared/ui/section-title";

import { trainingContent as content } from "../content";
import { CircularText } from "./circular-badge";

const tutorialPhoto = photos.tutorial;

export function Training() {
  return (
    <section
      id="formacion"
      aria-labelledby="formacion-title"
      className="px-3 pt-18 md:px-4 md:pt-25"
    >
      <Reveal className="relative mx-auto box-border max-w-panel rounded-panel border border-white/6 bg-surface-300 px-4 py-6 md:px-[clamp(20px,4vw,56px)] md:py-[clamp(28px,4vw,56px)]">
        <div className="absolute top-14 left-0 hidden h-[150px] w-7.5 items-center justify-center rounded-r-tab bg-accent md:flex">
          <span className="-rotate-90 text-10 font-semibold tracking-caps-lg whitespace-nowrap text-ink uppercase">
            {content.tab}
          </span>
        </div>

        <div className="flex flex-wrap items-stretch gap-6">
          <div data-reveal className="min-w-0 flex-[1_1_300px] md:pl-3">
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
                  {...linkAttributes({ ...resource, external: Boolean(resource.dataLink) })}
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
            href={links.youtubeTutorial}
            data-link="youtube-tutorial"
            {...externalLinkProps}
            data-reveal
            className="group relative block min-h-[420px] min-w-0 flex-[1.1_1_300px] overflow-hidden rounded-card-lg border border-white/8 bg-canvas text-white no-underline"
          >
            {tutorialPhoto && (
              <Image
                src={tutorialPhoto.src}
                alt={tutorialPhoto.alt}
                fill
                sizes="(max-width: 767px) 100vw, 420px"
                className="object-cover object-[55%_30%] [filter:grayscale(1)_contrast(1.1)_brightness(0.8)] transition-transform duration-500 group-hover:scale-105"
              />
            )}
            {/* Red tint over the black-and-white photo, then a dark fade for the text. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-accent opacity-55 mix-blend-color"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-[55%] bg-linear-to-t from-[rgba(10,10,10,0.94)] to-[rgba(10,10,10,0)]"
            />
            <div className="absolute top-3.5 right-3.5 size-31">
              <CircularText text={content.featured.circularText} />
              <span className="absolute top-1/2 left-1/2 -mt-7 -ml-7 flex size-14 items-center justify-center rounded-full bg-accent text-ink transition-[scale,background-color] duration-300 group-hover:scale-110 group-hover:bg-white">
                <PlayIcon size={20} />
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
              href={links.recordedClasses}
              data-link="youtube-clases-grabadas"
              {...externalLinkProps}
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
              href={links.youtubeCourse}
              data-link="youtube-curso-basico-intermedio"
              {...externalLinkProps}
              className="group flex min-h-[190px] flex-auto flex-col justify-between gap-8 rounded-tile bg-accent p-5.5 text-ink no-underline transition-colors duration-300 hover:bg-ink hover:text-white"
            >
              <span className="inline-flex items-center gap-2 text-12 font-bold tracking-caps-md uppercase">
                <YouTubeIcon />
                {content.course.tag}
              </span>
              <span className="flex items-end justify-between gap-3">
                <span className="text-18 leading-tight font-bold">
                  {content.course.labelLines[0]}
                  <br />
                  {content.course.labelLines[1]}
                  <br />
                  {content.course.labelLines[2]}
                </span>
                <span className="flex size-10.5 flex-none items-center justify-center rounded-full bg-white text-accent transition-transform duration-300 group-hover:scale-110">
                  <PlayIcon size={18} />
                </span>
              </span>
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
