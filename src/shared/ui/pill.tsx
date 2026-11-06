import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

/** Non-interactive labels: "Foto", "Partner oficial", FAQ topic chips, profile tags. */
export const pillVariants = cva("inline-block rounded-full", {
  variants: {
    tone: {
      accent: "bg-accent text-ink",
      ink: "bg-ink text-white",
      outline: "border border-white/32",
      "outline-accent": "border border-accent text-accent",
      "outline-ink": "border-[1.5px] border-ink",
    },
    size: {
      xs: "px-3 py-1.5 text-12 font-medium", // 6px 12px
      tag: "px-3 py-[7px] text-12 font-medium", // 7px 12px
      chip: "px-3.5 py-[7px] text-14 font-medium", // 7px 14px
      sm: "px-4 py-2 text-14 font-normal", // 8px 16px
    },
    caps: {
      true: "font-semibold tracking-caps uppercase",
      false: "",
    },
  },
  defaultVariants: { tone: "accent", size: "xs", caps: false },
});

export type PillProps = ComponentProps<"span"> & VariantProps<typeof pillVariants>;

export function Pill({ tone, size, caps, className, ...props }: PillProps) {
  return <span className={cn(pillVariants({ tone, size, caps }), className)} {...props} />;
}
