import type { StaticImageData } from "next/image";

import mentorPhoto from "./photos/mentor.webp";

export type PhotoSlot = { src: StaticImageData; alt: string } | null;

export type PhotoKey = "hero" | "mentor" | "cta";

/**
 * Client photos (transparent PNG/WebP). `null` shows the reference silhouette with the "Foto"
 * pill. To use a real photo, add the file to ./photos/ and import it, e.g.:
 *
 *   import heroPhoto from "./photos/hero.png";
 *   hero: { src: heroPhoto, alt: "Nombre Apellido, mentor de Código Dinero" },
 */
export const photos: Readonly<Record<PhotoKey, PhotoSlot>> = {
  /** Hero, over the wine circle. */
  hero: { src: mentorPhoto, alt: "Mentor de Código Dinero" },
  /** Mentor card in "¿Qué es Código Dinero?": same photo in black and white, decorative. */
  mentor: { src: mentorPhoto, alt: "" },
  /** Final CTA, next to the email form. */
  cta: null,
};
