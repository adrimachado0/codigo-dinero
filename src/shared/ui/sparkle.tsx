import type { SVGProps } from "react";

import { cn } from "@/shared/lib/cn";

export type SparkleProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: number };

/** Four-point star (✦) used as ornament. Color comes from `currentColor` (accent by default). */
export function Sparkle({ size = 24, className, ...props }: SparkleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn("text-accent", className)}
      {...props}
    >
      <path
        d="M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
