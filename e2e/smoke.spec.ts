import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("home", () => {
  test("responds with security headers", async ({ page }) => {
    const response = await page.goto("/");

    expect(response?.status()).toBe(200);
    const headers = response?.headers() ?? {};
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("camera=()");
    expect(headers["x-powered-by"]).toBeUndefined();
  });

  test("has the expected metadata and semantic structure", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page).toHaveTitle("Código Dinero · Formación en trading");
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description?.length).toBeGreaterThanOrEqual(150);
    expect(description?.length).toBeLessThanOrEqual(160);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "http://localhost:3000",
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /opengraph-image/,
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "es_AR");
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      "content",
      /twitter-image/,
    );
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    // Not production (SITE_ENV) → noindex.
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#0F0F0F");

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(
      "De cero a tu propio plan de trading: te guiamos en cada paso.",
    );
    for (const landmark of ["banner", "main", "contentinfo"]) {
      await expect(page.getByRole(landmark as "banner")).toHaveCount(1);
    }
    for (const id of [
      "inicio",
      "para-quien",
      "que-es",
      "quien-soy",
      "formacion",
      "biblioteca",
      "indicador",
      "mercado",
      "faq",
      "contacto",
    ]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    await expect(page.locator("#comunidad")).toHaveCount(0);
    await expect(page.locator("form")).toHaveCount(0);
  });

  test("uses formación, never academia or Escuela", async ({ page }) => {
    await page.goto("/");

    const text = await page.evaluate(
      () =>
        document.body.innerText +
        [...document.querySelectorAll("title, meta[content], script[type='application/ld+json']")]
          .map((el) => el.getAttribute("content") ?? el.textContent)
          .join(" "),
    );
    expect(text).not.toMatch(/academia|escuela/i);
  });

  test("publishes JSON-LD generated from the FAQ content", async ({ page }) => {
    await page.goto("/");

    const raw = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(raw ?? "{}") as {
      "@graph": { "@type": string; mainEntity?: unknown[] }[];
    };
    const types = data["@graph"].map((node) => node["@type"]);
    expect(types).toEqual(["EducationalOrganization", "WebSite", "FAQPage"]);
    const faq = data["@graph"].find((node) => node["@type"] === "FAQPage");
    expect(faq?.mainEntity).toHaveLength(await page.locator("#faq h3").count());
  });

  test("serves the generated metadata routes", async ({ request }) => {
    for (const [path, type] of [
      ["/opengraph-image", "image/png"],
      ["/twitter-image", "image/png"],
      ["/favicon.ico", "image/x-icon"],
      ["/icon.png", "image/png"],
      ["/apple-icon.png", "image/png"],
      ["/icons/icon-maskable-512.png", "image/png"],
      ["/robots.txt", "text/plain"],
      ["/sitemap.xml", "application/xml"],
      ["/manifest.webmanifest", "application/manifest+json"],
    ] as const) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
      expect(response.headers()["content-type"], path).toContain(type);
    }
  });
});

test("loads live quotes and TradingView widgets without CSP violations or console errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) => {
      console.error(`CSP ${event.violatedDirective} ${event.blockedURI}`);
    });
  });

  await page.goto("/");
  // Scroll through the page so every lazy widget (chart, mini charts, quotes) loads.
  for (const id of ["indicador", "mercado"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${id} [data-tv-widget] iframe`).first()).toBeAttached({
      timeout: 15_000,
    });
  }
  // The header strip fills with live prices from /api/quotes.
  await expect(page.locator("[data-ticker-lane]").first()).toContainText(/\d+[.,]\d+/, {
    timeout: 15_000,
  });
  await page.waitForTimeout(1000);

  expect(errors).toEqual([]);
});

test("the candlestick video plays with the site's controls, without CSP errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) => {
      console.error(`CSP ${event.violatedDirective} ${event.blockedURI}`);
    });
  });
  await page.goto("/");
  // The Player loads when its frame nears the viewport.
  await page.locator("#que-es [data-video-card]").scrollIntoViewIfNeeded();
  const video = page.getByRole("region", { name: "Video: cómo leer velas japonesas" });

  await video.getByRole("button", { name: "Reproducir video" }).click();
  await expect(video.getByRole("button", { name: "Pausar video" })).toBeVisible();
  await expect
    .poll(async () => Number(await video.getByRole("slider").inputValue()), { timeout: 10_000 })
    .toBeGreaterThan(30);
  expect(errors).toEqual([]);
});

test("sign-up buttons go to EC Markets in a new tab", async ({ page }) => {
  await page.goto("/");

  // Hero, a profile card and "Quién soy" each have both buttons.
  for (const [dataLink, href] of [
    ["ec-markets-cuenta", "https://sales.ecmarkets.com/PL/2/VUHHE"],
    ["ec-markets-ib", "https://ib.ecmarkets.com/PL/2/JQER5"],
  ] as const) {
    const buttons = page.locator(`a[data-link="${dataLink}"]`);
    await expect(buttons).toHaveCount(3);
    for (const button of await buttons.all()) {
      await expect(button).toHaveAttribute("href", href);
      await expect(button).toHaveAttribute("target", "_blank");
      await expect(button).toHaveAttribute("rel", "noopener noreferrer");
    }
  }
});

test("WhatsApp buttons open a chat with the design's message", async ({ page }) => {
  await page.goto("/");
  const message = async (selector: string) => {
    const href = (await page.locator(selector).first().getAttribute("href")) ?? "";
    return new URL(href).searchParams.get("text");
  };

  // "Empezar" (header and footer).
  await expect(page.locator('a[data-link="whatsapp-empezar"]')).toHaveCount(2);
  expect(await message('header a[data-link="whatsapp-empezar"]')).toBe(
    "Hola Ángel, quiero empezar con Código Dinero.",
  );
  expect(await message('#contacto a[data-link="whatsapp-novato"]')).toBe(
    "Hola Ángel, estoy empezando desde cero y quiero coordinar una sesión.",
  );
  expect(await message('#contacto a[data-link="whatsapp-ib"]')).toBe(
    "Hola Ángel, lidero una comunidad y quiero coordinar una sesión como IB.",
  );
  // The library grid is hidden for now (only the book).
  await expect(page.locator('#biblioteca a[data-link="whatsapp-biblioteca"]')).toHaveCount(0);
  await expect(page.locator('#biblioteca a[data-link="whatsapp-libro"]')).toHaveCount(2);
  await expect(page.locator("#contacto")).toContainText(
    "Se abre WhatsApp con tu consulta lista para enviar.",
  );
  for (const link of await page.locator('a[href^="https://wa.me/"]').all()) {
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
});

test("profile and resource links point to the right places", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.locator("#para-quien").getByRole("link", { name: "Conocer el indicador" }),
  ).toHaveAttribute("href", "#indicador");
  const nav = page.getByRole("navigation", { name: "Principal" });
  await expect(nav.getByRole("link", { name: "Formación" })).toHaveAttribute(
    "href",
    "https://www.ecmarkets.com/ec-academy/",
  );
  await expect(nav.getByRole("link", { name: "Mercado" })).toHaveAttribute("href", "#mercado");
  await expect(
    page.locator("#formacion").getByRole("link", { name: /Síguenos en TikTok/ }),
  ).toHaveAttribute("href", "https://www.tiktok.com/@gonzalezbrothers.xau");
  await expect(nav.getByRole("link", { name: "Nosotros" })).toHaveAttribute("href", "#quien-soy");
  const footer = page.getByRole("contentinfo");
  await expect(footer.getByRole("link", { name: "Telegram" })).toHaveCount(0);
  await expect(footer.getByRole("link", { name: "X", exact: true })).toHaveCount(0);
});

test("legal links download the PDFs", async ({ page, request }) => {
  await page.goto("/");
  const legal = page.getByRole("navigation", { name: "Legal" }).getByRole("link");

  await expect(legal).toHaveCount(3);
  for (const link of await legal.all()) {
    await expect(link).toHaveAttribute("download", "");
    const href = (await link.getAttribute("href")) ?? "";
    const response = await request.get(href);
    expect(response.status(), href).toBe(200);
    expect(response.headers()["content-type"], href).toContain("application/pdf");
  }
});

test("quotes API answers with validated quotes", async ({ request }) => {
  const response = await request.get("/api/quotes");
  expect(response.status()).toBe(200);

  // Live data: some instruments may be missing if the provider is down, never malformed.
  const body = (await response.json()) as { quotes: { symbol: string; price: number }[] };
  for (const quote of body.quotes) {
    expect(quote.symbol).toMatch(/^[A-Z]{6}$/);
    expect(quote.price).toBeGreaterThan(0);
  }
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("menu opens, closes with Escape and returns focus", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Abrir menú" });

    await button.click();
    await expect(page.locator("#cod-mobile-menu")).toBeVisible();
    await expect(page.getByRole("button", { name: "Cerrar menú" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    await page.locator("#cod-mobile-menu a").first().focus();
    await page.keyboard.press("Escape");
    await expect(page.locator("#cod-mobile-menu")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Abrir menú" })).toBeFocused();
  });

  test("menu closes when a link is clicked", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Abrir menú" }).click();
    await page.locator("#cod-mobile-menu").getByRole("link", { name: "Inicio" }).click();
    await expect(page.locator("#cod-mobile-menu")).toHaveCount(0);
  });
});

for (const width of [1440, 390]) {
  test(`no serious or critical axe violations at ${String(width)}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      // Third-party TradingView iframes: their content isn't ours to fix.
      .exclude("[data-tv-widget]")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(
      blocking.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`),
    ).toEqual([]);
  });
}
