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
    await expect(page).toHaveTitle("Código Dinero · Academia de trading");
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
      "indicadores",
      "comunidad",
      "faq",
      "contacto",
    ]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
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

test("loads and plays without CSP violations or console errors", async ({ page }) => {
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
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Reproducir video de presentación" }).click();
  await expect(page.getByLabel("Video de presentación de Código Dinero")).toBeVisible();
  await page.waitForTimeout(500);

  expect(errors).toEqual([]);
});

test("quotes API returns a validated simulated snapshot", async ({ request }) => {
  const response = await request.get("/api/quotes");
  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-store");

  const body = (await response.json()) as { simulated: boolean; quotes: { symbol: string }[] };
  expect(body.simulated).toBe(true);
  expect(body.quotes.map((q) => q.symbol)).toEqual([
    "XAUUSD",
    "XAGUSD",
    "BTCUSD",
    "ETHUSD",
    "EURUSD",
    "GBPUSD",
    "USDARS",
  ]);
});

test("ticker keeps the 'Simulado' label visible", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("region", { name: "Cotizaciones" }).getByText("Simulado"),
  ).toBeVisible();
});

test("lead form validates and reports success accessibly", async ({ page }) => {
  await page.goto("/");
  const name = page.getByLabel("Tu nombre");
  const email = page.getByLabel("Tu correo electrónico");
  const profile = page.getByLabel("Tu perfil");
  const submit = page.getByRole("button", { name: "Coordinar sesión" });
  const status = page.locator("#cod-lead-status");

  await submit.click();
  await expect(status).toHaveText("Escribe tu nombre.");
  await expect(name).toHaveAttribute("aria-invalid", "true");

  await name.fill("Ana Pérez");
  await email.fill("no-es-un-correo");
  await submit.click();
  await expect(status).toHaveText("Revisa el formato de tu correo electrónico.");
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(name).not.toHaveAttribute("aria-invalid");

  await email.fill("ana@example.com");
  await profile.selectOption({ label: "Lidero una comunidad / soy IB" });
  await submit.click();
  await expect(status).toHaveText("¡Gracias! Te escribiremos a tu correo.");
  await expect(status).toHaveAttribute("role", "status");
});

test("profile CTAs lead to the contact form and the indicators block", async ({ page }) => {
  await page.goto("/");
  const audience = page.locator("#para-quien");

  await expect(audience.getByRole("article")).toHaveCount(3);
  await expect(audience.getByRole("link", { name: "Ver planes de indicadores" })).toHaveAttribute(
    "href",
    "#indicadores",
  );
  for (const label of ["Quiero aprender desde cero", "Sumarme como Partner / IB"]) {
    await expect(page.locator("#hero").getByRole("link", { name: label })).toHaveAttribute(
      "href",
      "#contacto",
    );
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
      // Dimmed (non-current) reviews: the reference's 45% opacity is kept on purpose. They are
      // aria-hidden and fall under WCAG 1.4.3's inactive-component exception.
      .exclude('#testimonials-track > [aria-hidden="true"]')
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
