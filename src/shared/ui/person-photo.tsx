import Image, { type StaticImageData } from "next/image";

import { cn } from "@/shared/lib/cn";
import { Pill } from "@/shared/ui/pill";

const silhouetteFill = {
  wine: "fill-wine-silhouette", // hero, on the wine circle
  charcoal: "fill-silhouette", // final CTA, on the page background
  graphite: "fill-silhouette-strong", // mentor card, on #222
} as const;

type PhotoSource =
  | {
      /** Transparent PNG of the person, configured in src/shared/config/photos.ts. */
      src: StaticImageData;
      alt: string;
      sizes?: string;
    }
  | { src?: undefined; alt?: undefined; sizes?: undefined };

export type PersonPhotoProps = PhotoSource & {
  tone: keyof typeof silhouetteFill;
  className?: string;
  /** Placeholder label over the silhouette; `null` hides it (the mentor card has its own). */
  label?: string | null;
  labelClassName?: string;
};

/**
 * Photo slot of a client. Without `src` it shows the reference silhouette and the "Foto"
 * pill; with `src` it renders the real photo through next/image.
 */
export function PersonPhoto({
  src,
  alt,
  sizes,
  tone,
  className,
  label = "Foto",
  labelClassName,
}: PersonPhotoProps) {
  return (
    <div className={cn("relative", className)}>
      {src ? (
        <Image src={src} alt={alt} sizes={sizes ?? "310px"} className="block h-auto w-full" />
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
