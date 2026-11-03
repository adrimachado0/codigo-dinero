import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Twelve-ray brand mark, same path as src/shared/ui/starburst.tsx (Satori needs plain SVG).
const STARBURST_PATH =
  "M30 24L46 24M29.2 27L43.1 35M27 29.2L35 43.1M24 30L24 46M21 29.2L13 43.1M18.8 27L4.9 35M18 24L2 24M18.8 21L4.9 13M21 18.8L13 4.9M24 18L24 2M27 18.8L35 4.9M29.2 21L43.1 13";

export function StarburstMark({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d={STARBURST_PATH} stroke={color} strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}

/** TTF instances for next/og (Satori can't read woff2). */
export async function loadBrandFonts() {
  const dir = join(process.cwd(), "src/shared/seo/fonts");
  const [unbounded, lexend] = await Promise.all([
    readFile(join(dir, "unbounded-800.ttf")),
    readFile(join(dir, "lexend-500.ttf")),
  ]);
  return [
    { name: "Unbounded", data: unbounded, weight: 800 as const, style: "normal" as const },
    { name: "Lexend", data: lexend, weight: 500 as const, style: "normal" as const },
  ];
}
