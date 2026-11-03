import { Lexend, Unbounded } from "next/font/google";

// Only the weights the reference uses (see docs/PENDIENTES.md about weight ranges).
export const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-lexend",
});

// Logo "COD", numbers 01–06, the motto band and the red ribbon.
export const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["600", "800"],
  display: "swap",
  variable: "--font-unbounded",
});
