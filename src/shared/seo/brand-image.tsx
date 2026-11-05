import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { qrGlyph } from "@/shared/ui/qr-glyph";

const root = process.cwd();

/** TTF instances for next/og (Satori can't read woff2). */
export async function loadBrandFonts() {
  const dir = join(root, "src/shared/seo/fonts");
  const [unbounded, lexend] = await Promise.all([
    readFile(join(dir, "unbounded-800.ttf")),
    readFile(join(dir, "lexend-500.ttf")),
  ]);
  return [
    { name: "Unbounded", data: unbounded, weight: 800 as const, style: "normal" as const },
    { name: "Lexend", data: lexend, weight: 500 as const, style: "normal" as const },
  ];
}

/**
 * A file read as a data URI, for <img> in next/og (PNG or SVG; Satori can't read WebP).
 * The caller reads it with a literal path, so the build only traces that file.
 */
export async function dataUri(file: Promise<Buffer>, type: "image/png" | "image/svg+xml") {
  return `data:${type};base64,${(await file).toString("base64")}`;
}

/**
 * The hero's QR tiling (same glyph, tile and opacity as `QrPattern`) as an SVG data URI:
 * Satori draws it through resvg, which supports <pattern>.
 */
export function qrBackground({ width, height }: { width: number; height: number }): string {
  const scale = 200 / qrGlyph.modules;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${String(width)}" height="${String(height)}"><defs><path id="g" d="${qrGlyph.path}"/><pattern id="p" x="${String(width / 2)}" y="-16" width="400" height="400" patternUnits="userSpaceOnUse"><use href="#g" transform="scale(${String(scale)})" fill="#FF2B2B" fill-opacity="0.045"/><use href="#g" transform="translate(200 200) scale(${String(scale)})" fill="#FF2B2B" fill-opacity="0.045"/></pattern></defs><rect width="100%" height="100%" fill="url(#p)"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
