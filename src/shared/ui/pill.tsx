import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

/** Non-interactive labels: "Foto", "Partner oficial", FAQ topic chips. */
export const pillVariants = cva("inline-block rounded-full", {
  variants: {
    tone: {
      accent: "bg-accent text-ink",
      outline: "border border-solid border-white/32",
    },
    size: {
      xs: "px-3 py-1.5 text-12 font-medium", // 6px 12px
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
