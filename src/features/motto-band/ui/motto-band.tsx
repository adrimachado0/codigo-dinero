import { Fragment } from "react";

import { Sparkle } from "@/shared/ui/sparkle";

import { mottoContent } from "../content";

export function MottoBand() {
  return (
    <section aria-label={mottoContent.label} className="px-6 pt-27.5">
      <div className="mx-auto max-w-wide">
        <p className="m-0 flex flex-col flex-wrap items-center justify-center gap-0.5 font-display text-42 leading-heading font-extrabold tracking-snug md:flex-row md:gap-x-7 md:gap-y-2 md:text-motto">
          {mottoContent.words.map((word, index) => (
            <Fragment key={word}>
              {index > 0 && <Sparkle size={32} className="size-5.5 md:size-8" />}
              <span>{word}</span>
            </Fragment>
          ))}
        </p>
        <div className="mt-10 flex items-center gap-4.5">
          <span className="h-px flex-auto bg-white/30" />
          <Sparkle size={18} className="text-white" />
          <span className="h-px flex-auto bg-white/30" />
        </div>
      </div>
    </section>
  );
}
