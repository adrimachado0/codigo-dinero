import Image from "next/image";

import type { PhotoSlot } from "@/shared/config/photos";
import { cn } from "@/shared/lib/cn";
import { Pill } from "@/shared/ui/pill";

const silhouetteFill = {
  wine: "fill-wine-silhouette", // hero, on the wine circle
  charcoal: "fill-silhouette", // final CTA, on the page background
  graphite: "fill-silhouette-strong", // mentor card, on #222
} as const;

export type PersonPhotoProps = {
  /** Slot from src/shared/config/photos.ts; `null`/omitted shows the silhouette. */
  photo?: PhotoSlot;
  sizes?: string;
  tone: keyof typeof silhouetteFill;
  className?: string;
  /** Placeholder label over the silhouette; `null` hides it (the mentor card has its own). */
  label?: string | null;
  labelClassName?: string;
};

/**
 * Photo slot of a client. Without a photo it shows the reference silhouette and the "Foto"
 * pill; with one it renders the transparent PNG through next/image.
 */
export function PersonPhoto({
  photo,
  sizes = "310px",
  tone,
  className,
  label = "Foto",
  labelClassName,
}: PersonPhotoProps) {
  return (
    <div className={cn("relative", className)}>
      {photo ? (
        <Image src={photo.src} alt={photo.alt} sizes={sizes} className="block h-auto w-full" />
      ) : (
        <>
          <svg
            viewBox="0 0 300 340"
            aria-hidden="true"
            focusable="false"
            className={cn("block h-auto w-full", silhouetteFill[tone])}
          >
            <circle cx="150" cy="104" r="62" />
            <path d="M18 340C28 238 88 200 150 200C212 200 272 238 282 340Z" />
          </svg>
          {label !== null && (
            <Pill
              className={cn(
                "absolute top-[66%] left-1/2 -translate-x-1/2 whitespace-nowrap",
                labelClassName,
              )}
            >
              {label}
            </Pill>
          )}
        </>
      )}
    </div>
  );
}
