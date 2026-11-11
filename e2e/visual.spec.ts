import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { expect, test, type Page } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

/**
 * Visual regression against reference/ (served on :3001). Each section is captured in the
 * reference and in the app at the same width and compared with pixelmatch.
 * Run with: pnpm test:visual (Docker image → deterministic fonts and Chromium).
 */

const REFERENCE_URL = "http://localhost:3001/";
const THRESHOLD_PERCENT = 0.5;
const OUT_DIR = path.join("test-results", "visual");
const WIDTHS = [1440, 1024, 768, 390] as const;

type Section = { name: string; ref: string[]; app: string[] };

/**
 * Sections changed on purpose by the site owner after the reference: reported, not asserted.
 * `widths` limits it to the viewports where the change is visible.
 */
const INTENTIONAL: Record<string, { reason: string; widths?: number[] }> = {
  temas: { reason: "cintas con íconos de Lucide" },
  // Above 1432px the wine block now spans the full width instead of stopping at 1400px.
  inicio: { reason: "bloque del hero a todo el ancho", widths: [1440] },
  // "Solicitar por WhatsApp" keeps the 44px touch target (the design draws it at 40px).
  biblioteca: { reason: "enlaces de la biblioteca de 44px" },
};

/** Below 768px the page uses tighter gutters and section spacing than the reference. */
const MOBILE_WIDTH = 390;

function intentionalReason(section: string, width: number): string | undefined {
  if (width === MOBILE_WIDTH) return "márgenes y espaciado compactos en mobile";
  const entry = INTENTIONAL[section];
  if (!entry || (entry.widths && !entry.widths.includes(width))) return undefined;
  return entry.reason;
}

// In the app the reference's `section#inicio` is split into <header id="inicio"> and the
// hero <section id="hero"> inside <main>, so it is measured as the union of both.
const SECTIONS: Section[] = [
  { name: "inicio", ref: ["#inicio"], app: ["#inicio", "#hero"] },
  ...[
    'section[aria-label="EC MARKETS en números"]',
    "#para-quien",
    "#que-es",
    'section[aria-label="Aprende, analiza, opera"]',
    "#quien-soy",
    "#formacion",
    "#biblioteca",
    "#indicador",
    "#mercado",
    'section[aria-label="Temas"]',
    "#faq",
    "#contacto",
    "footer",
  ].map((selector) => ({ name: sectionName(selector), ref: [selector], app: [selector] })),
];

const MENU_SECTION: Section = {
  name: "menu-abierto",
  ref: ['nav[aria-label="Principal"]', "#cod-mobile-menu"],
  app: ['nav[aria-label="Principal"]', "#cod-mobile-menu"],
};

// Non-deterministic content: particle canvases and live market data. In the app the
// TradingView widgets (ticker lane, XAUUSD chart, market cards) don't load while motion is
// frozen; the design draws mockups in their place. They are masked whole (same boxes in both).
const MASKS = {
  ref: [
    "canvas",
    '[aria-label="Cotizaciones"] > :nth-child(2)',
    '[aria-label="Cotizaciones"] > :nth-child(3)',
    "#indicador .cod-ind-frame",
    '#mercado div[style*="flex: 1 1 320px"]',
  ],
  app: [
    "canvas",
    "[data-ticker-lane]",
    "#indicador [data-chart-frame]",
    "#mercado [data-market-card]",
  ],
};

function sectionName(selector: string): string {
  const label = /aria-label="([^"]+)"/.exec(selector)?.[1];
  return (label ?? selector.replace("#", "")).toLowerCase().replaceAll(/[^a-z0-9áéíóúñ]+/g, "-");
}

type Box = { x: number; y: number; width: number; height: number };

async function settle(page: Page) {
  await page.waitForLoadState("networkidle");
  // next/image is lazy: walk the page so images far below the fold load before capturing.
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    window.scrollTo(0, 0);
    await Promise.all(
      [...document.images].map((img) =>
        img.complete ? Promise.resolve() : img.decode().catch(() => undefined),
      ),
    );
    await document.fonts.ready;
  });
  await page.waitForTimeout(300);
}

async function unionBox(page: Page, selectors: string[]): Promise<Box> {
  return page.evaluate((sels) => {
    const rects = sels.map((s) => {
      const el = document.querySelector(s);
      if (!el) throw new Error(`Missing element: ${s}`);
      return el.getBoundingClientRect();
    });
    const left = Math.min(...rects.map((r) => r.left));
    const top = Math.min(...rects.map((r) => r.top));
    const right = Math.max(...rects.map((r) => r.right));
    const bottom = Math.max(...rects.map((r) => r.bottom));
    return {
      x: Math.round(left + window.scrollX),
      y: Math.round(top + window.scrollY),
      width: Math.round(right - left),
      height: Math.round(bottom - top),
    };
  }, selectors);
}

async function capture(page: Page, selectors: string[], masks: string[]): Promise<PNG> {
  const clip = await unionBox(page, selectors);
  const buffer = await page.screenshot({
    fullPage: true,
    clip,
    animations: "disabled",
    caret: "hide",
    mask: masks.map((m) => page.locator(m)),
    maskColor: "#FF00FF",
  });
  return PNG.sync.read(buffer);
}

/** Compares two captures; size mismatch counts every non-overlapping pixel as different. */
function compare(ref: PNG, app: PNG, file: string): number {
  const width = Math.max(ref.width, app.width);
  const height = Math.max(ref.height, app.height);
  const pad = (img: PNG) => {
    const out = new PNG({ width, height });
    out.data.fill(0);
    PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0);
    return out;
  };
  const a = pad(ref);
  const b = pad(app);
  const diff = new PNG({ width, height });
  const different = pixelmatch(a.data, b.data, diff.data, width, height, { threshold: 0.1 });
  writeFileSync(file, PNG.sync.write(diff));
  return (different / (width * height)) * 100;
}

type Row = {
  width: number;
  section: string;
  diffPercent: number;
  refSize: string;
  appSize: string;
  intentional?: string;
};

async function compareSections(
  refPage: Page,
  appPage: Page,
  width: number,
  sections: Section[],
): Promise<Row[]> {
  mkdirSync(OUT_DIR, { recursive: true });
  const rows: Row[] = [];
  for (const section of sections) {
    const ref = await capture(refPage, section.ref, MASKS.ref);
    const app = await capture(appPage, section.app, MASKS.app);
    const base = path.join(OUT_DIR, `${String(width)}-${section.name}`);
    writeFileSync(`${base}-ref.png`, PNG.sync.write(ref));
    writeFileSync(`${base}-app.png`, PNG.sync.write(app));
    const diffPercent = compare(ref, app, `${base}-diff.png`);
    const intentional = intentionalReason(section.name, width);
    rows.push({
      width,
      section: section.name,
      diffPercent: Math.round(diffPercent * 1000) / 1000,
      refSize: `${String(ref.width)}x${String(ref.height)}`,
      appSize: `${String(app.width)}x${String(app.height)}`,
      ...(intentional && { intentional }),
    });
  }
  return rows;
}

function report(rows: Row[], name: string) {
  console.table(
    rows.map((r) => ({
      ...r,
      ok: r.intentional ? "cambio intencional" : r.diffPercent <= THRESHOLD_PERCENT ? "✓" : "✗",
    })),
  );
  writeFileSync(path.join(OUT_DIR, `${name}.json`), JSON.stringify(rows, null, 2));
  for (const row of rows.filter((r) => !r.intentional)) {
    expect
      .soft(
        row.diffPercent,
        `${String(row.width)}px · ${row.section} (${row.refSize} vs ${row.appSize})`,
      )
      .toBeLessThanOrEqual(THRESHOLD_PERCENT);
  }
}

async function openBoth(page: Page, width: number) {
  // The app's decorative motion always runs: freeze it so captures are its first frame.
  await page.addInitScript(() => {
    Object.assign(window, { __FREEZE_MOTION__: true });
  });
  const refPage = await page.context().newPage();
  for (const p of [page, refPage]) await p.setViewportSize({ width, height: 900 });
  await Promise.all([page.goto("/"), refPage.goto(REFERENCE_URL)]);
  await Promise.all([settle(page), settle(refPage)]);
  return refPage;
}

for (const width of WIDTHS) {
  test(`sections match the reference at ${String(width)}px`, async ({ page }) => {
    test.setTimeout(120_000);
    const refPage = await openBoth(page, width);

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect.soft(scrollWidth, "no horizontal scroll").toBeLessThanOrEqual(width);

    report(await compareSections(refPage, page, width, SECTIONS), `report-${String(width)}`);
  });
}

test("open mobile menu matches the reference at 390px", async ({ page }) => {
  const refPage = await openBoth(page, 390);
  for (const p of [page, refPage]) {
    await p.getByRole("button", { name: "Abrir menú" }).click();
    await p.locator("#cod-mobile-menu").waitFor();
    // Move the pointer away so the burger's hover state isn't captured.
    await p.mouse.move(0, 800);
    await p.waitForTimeout(400);
  }
  report(await compareSections(refPage, page, 390, [MENU_SECTION]), "report-390-menu");
});
