import type { StaticImageData } from "next/image";

import closingPhoto from "./photos/angel-cierre.webp";
import mentorPhoto from "./photos/angel-ec-rojo.jpg";
import standPhoto from "./photos/angel-ec-stand.jpg";
import heroPhoto from "./photos/angel-hero.webp";
import tutorialPhoto from "./photos/angel-holograma.jpg";
import moneyExpoPhoto from "./photos/angel-money-expo.jpg";

export type PhotoSlot = { src: StaticImageData; alt: string } | null;

export type PhotoKey = "hero" | "mentor" | "stand" | "moneyExpo" | "tutorial" | "cta";

/**
 * Photos of Ángel. Cut-outs (hero, contact) are transparent WebP; `null` shows the reference
 * silhouette with the "Foto" pill. To change one, add the file to ./photos/ and import it.
 */
export const photos: Readonly<Record<PhotoKey, PhotoSlot>> = {
  /** Hero, over the wine circle (cut-out). */
  hero: { src: heroPhoto, alt: "Ángel Jesús González, fundador de Código Dinero" },
  /** "Quién soy", main photo (cover). */
  mentor: { src: mentorPhoto, alt: "Ángel Jesús González frente al logo de EC Markets" },
  /** "Quién soy", event cards (cover). */
  stand: { src: standPhoto, alt: "Ángel Jesús González en el stand de EC Markets" },
  moneyExpo: { src: moneyExpoPhoto, alt: "Ángel Jesús González en Money Expo Argentina" },
  /** "Tutorial" card of Recursos, tinted red (decorative: the card has its own title). */
  tutorial: { src: tutorialPhoto, alt: "" },
  /** Contact section (cut-out). */
  cta: { src: closingPhoto, alt: "Ángel Jesús González" },
};
