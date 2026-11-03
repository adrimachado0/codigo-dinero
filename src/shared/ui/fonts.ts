import localFont from "next/font/local";

/*
 * Same binaries the reference loads from Google Fonts CSS (Lexend v26, Unbounded v12, latin
 * subset, variable wght axis). next/font/google downloads a different revision whose
 * advance widths differ by ~4%, which breaks the pixel match. Self-hosted via next/font/local
 * (preload, no layout shift from swapping files). No metric fallback, so the font stack is
 * exactly the reference's: glyphs outside latin (✦ ▲ ▼) come from the same system font.
 */
export const lexend = localFont({
  src: "../../../public/fonts/lexend-latin.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-lexend",
  adjustFontFallback: false,
});

// Logo "COD", numbers 01–06, the motto band and the red ribbon.
export const unbounded = localFont({
  src: "../../../public/fonts/unbounded-latin.woff2",
  weight: "200 900",
  display: "swap",
  variable: "--font-unbounded",
  adjustFontFallback: false,
});
