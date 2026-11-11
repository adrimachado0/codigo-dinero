import type { StaticImageData } from "next/image";

import heroPhoto from "./photos/angel-hero.webp";
import mentorPhoto from "./photos/mentor.webp";

export type PhotoSlot = { src: StaticImageData; alt: string } | null;

export type PhotoKey = "hero" | "mentor" | "cta";

/**
 * Client photos. Cut-outs (hero, contact) are transparent WebP; `null` shows the reference
 * silhouette with the "Foto" pill. To change one, add the file to ./photos/ and import it.
 */
export const photos: Readonly<Record<PhotoKey, PhotoSlot>> = {
  /** Hero, over the wine circle (cut-out). */
  hero: { src: heroPhoto, alt: "Ángel Jesús González, fundador de Código Dinero" },
  /** "Quién soy": same photo in black and white. Pending: confirm it is Ángel González. */
  mentor: { src: mentorPhoto, alt: "Ángel González, mentor de Código Dinero" },
  /** Final CTA, next to the email form. */
  cta: null,
};
