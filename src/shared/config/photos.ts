import type { StaticImageData } from "next/image";

export type PhotoSlot = { src: StaticImageData; alt: string } | null;

export type PhotoKey = "hero" | "mentor" | "cta";

/**
 * Client photos (transparent PNGs). `null` shows the reference silhouette with the "Foto"
 * pill. To use a real photo, add the PNG next to this file and import it, e.g.:
 *
 *   import heroPhoto from "./photos/hero.png";
 *   hero: { src: heroPhoto, alt: "Nombre Apellido, mentor de Código Dinero" },
 */
export const photos: Readonly<Record<PhotoKey, PhotoSlot>> = {
  /** Hero, over the wine circle. */
  hero: null,
  /** Mentor card in "¿Qué es Código Dinero?". */
  mentor: null,
  /** Final CTA, next to the email form. */
  cta: null,
};
