import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

export const containerVariants = cva("mx-auto", {
  variants: {
    size: {
      shell: "max-w-shell", // 1400: hero shell, footer
      panel: "max-w-panel", // 1240: formación, comunidad, FAQ
      wide: "max-w-wide", // 1200: motto band
      content: "max-w-content", // 1100: qué es, CTA
      nav: "max-w-nav", // 1040: nav, ticker, stats
      narrow: "max-w-narrow", // 1000: hero title
    },
  },
  defaultVariants: { size: "content" },
});

export type ContainerProps = ComponentProps<"div"> & VariantProps<typeof containerVariants>;

export function Container({ size, className, ...props }: ContainerProps) {
  return <div className={cn(containerVariants({ size }), className)} {...props} />;
}
