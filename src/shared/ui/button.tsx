import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

/**
 * Pill-shaped actions of the reference. Box sizing is left to the browser default on
 * purpose: some reference outlines are content-box (border adds to min-height) and one
 * is border-box ("Ver formación"); callers add `box-border` where the reference does.
 */
export const buttonVariants = cva(
  [
    "inline-flex items-center rounded-full font-sans text-14 no-underline",
    // Hover/focus: lifts 2px and swaps to white; pressing sinks it back.
    "transition-[background-color,color,border-color,box-shadow,translate] duration-300 ease-out",
    "hover:-translate-y-0.5 focus-visible:-translate-y-0.5 active:translate-y-0 active:duration-100",
    "disabled:pointer-events-none",
  ],
  {
    variants: {
      tone: {
        solid:
          "bg-accent font-semibold text-ink hover:bg-white hover:text-ink hover:shadow-[0_10px_28px_-8px_rgba(255,43,43,0.75)] focus-visible:bg-white",
        outline:
          "border border-white/32 font-medium text-white hover:border-white hover:bg-white hover:text-ink hover:shadow-[0_10px_28px_-10px_rgba(255,255,255,0.45)]",
        "outline-soft":
          "border border-white/28 font-normal text-white hover:border-white hover:bg-white hover:text-ink hover:shadow-[0_10px_28px_-10px_rgba(255,255,255,0.45)]",
        "outline-strong":
          "border-[1.5px] border-white/55 font-medium text-white hover:border-white hover:bg-white hover:text-ink hover:shadow-[0_10px_28px_-10px_rgba(255,255,255,0.45)]",
      },
      size: {
        nav: "px-5 py-3", // header "Empezar": padding 12px 20px, no min-height
        md: "min-h-11 px-5", // 44px
        lg: "min-h-12 px-5.5", // 48px
      },
    },
    defaultVariants: { tone: "solid", size: "md" },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export type ButtonProps = ComponentProps<"button"> & ButtonVariantProps;

export function Button({ tone, size, className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn("cursor-pointer border-0", buttonVariants({ tone, size }), className)}
      {...props}
    />
  );
}

export type LinkButtonProps = ComponentProps<"a"> & ButtonVariantProps;

export function LinkButton({ tone, size, className, ...props }: LinkButtonProps) {
  return <a className={cn(buttonVariants({ tone, size }), className)} {...props} />;
}
