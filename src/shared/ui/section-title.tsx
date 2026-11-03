import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

export type SectionTitleProps = Omit<ComponentProps<"h2">, "children"> & {
  /** Plain words before the highlight, e.g. "Nuestra". */
  lead: string;
  /** Word on the red tag rotated −2°, e.g. "formación". */
  highlight: string;
};

/** h2 of the formación, comunidad and FAQ sections. */
export function SectionTitle({ lead, highlight, className, ...props }: SectionTitleProps) {
  return (
    <h2
      className={cn("m-0 flex flex-wrap items-center gap-2.5 text-section font-medium", className)}
      {...props}
    >
      <span>{lead}</span>
      {/* Whitespace for the accessible name ("Nuestra formación"); flex ignores it visually. */}{" "}
      <span className="inline-block -rotate-2 rounded-tag bg-accent px-3.5 pt-0.5 pb-1 text-ink">
        {highlight}
      </span>
    </h2>
  );
}
