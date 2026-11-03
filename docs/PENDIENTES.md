# Pendientes

Todo lo que falta definir o implementar. Los marcadores se mantienen tal cual en la UI hasta tener el dato real; no se inventa contenido.

## Contenido (marcadores de la referencia)

- [ ] **Precio**: `[PRECIO] [por mes / pago único]` (FAQ 01). Archivo: `src/features/faq/content.ts`.
- [ ] **Plataforma** de la Escuela: `[PLATAFORMA]` (FAQ 03).
- [ ] **Soporte**: `[CORREO o WHATSAPP DE SOPORTE]` y `[PLAZO]` de acreditación (FAQ 04).
- [ ] **Política de cancelación**: `[CONFIRMAR POLÍTICA]` y `[DÓNDE SE CANCELA]` (FAQ 05).
- [ ] **Reseñas reales**: `[Nombre del alumno]`, `[Ciudad]` y los textos `[Reseña de un alumno: …]` (Comunidad, ×3). Archivo: `src/features/testimonials/content.ts`. Avatares opcionales en el mismo archivo.
- [ ] **Textos de estado del formulario** (no están en la referencia; se escribieron versiones neutras para confirmar): "Enviando…", "¡Gracias! Te escribiremos a tu correo.", "Demasiados intentos. Prueba de nuevo en unos minutos.", "No pudimos registrar tu correo. Inténtalo de nuevo.", y los errores de validación "Escribe tu correo electrónico." / "Revisa el formato de tu correo electrónico.". Archivos: `src/features/lead-capture/content.ts` y `domain/lead.ts`.
- [ ] **Textos legales**: Términos y condiciones, Política de privacidad, Aviso de riesgo (páginas y links del footer).

## Links y datos

Todos los `href="#"` son destinos sin definir (igual que en la referencia).

- [ ] **YouTube**: canal, clases 01–04, clase destacada y "Ver la ruta de estudio" (`src/features/training/content.ts`). Con URLs reales se puede agregar el JSON-LD `VideoObject` en `src/shared/seo/json-ld.tsx` (y sumar `i.ytimg.com` a `img-src` si se muestran miniaturas).
- [ ] **Redes**: YouTube, Instagram, TikTok, Telegram, X (`src/shared/config/site.ts`). Con URLs reales, `sameAs` del JSON-LD se completa solo (hoy se omite porque son `#`).
- [ ] **Partner EC Markets**: link de "Abrir cuenta" (hero) y `site.partner.href`.
- [ ] **Menú**: destinos de Escuela, Calendario, Mercado, Equipo y los dos "Empezar" (header y hero "Empezar ahora"), "Quiero sumarme".
- [ ] **Dominio de producción**: `NEXT_PUBLIC_SITE_URL` (hoy `http://localhost:3000` por defecto) y `SITE_ENV=production` en el deploy. Sin `SITE_ENV=production` el sitio sale con `noindex` y `robots.txt` bloquea todo.

## Assets

- [ ] **Fotos de clientes** (PNG con fondo transparente): hero, mentor y CTA final. Se configuran en `src/shared/config/photos.ts` (ver README).

## Integraciones

- [ ] **Proveedor real de cotizaciones** (hoy `SimulatedQuoteSource`; "Simulado" queda visible mientras tanto). Cómo enchufarlo: README, sección "Cómo cambiar el proveedor de cotizaciones". Opciones:
  - FX y metales (XAUUSD, XAGUSD, EURUSD, GBPUSD): Twelve Data (`/quote?symbol=XAU/USD,…`) o Finnhub (`forex/rates`).
  - Cripto (BTCUSD, ETHUSD): CoinGecko (`/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true`).
  - USDARS: una API de dólar argentino (por ejemplo DolarApi, `/v1/dolares/oficial`) y definir qué cotización mostrar.
  - Un adaptador compuesto puede combinar varios `QuoteSource` por símbolo. Conviene cachear del lado del servidor (respetando los límites de cada API) y mantener el polling del cliente en 3 s contra `/api/quotes`.
- [ ] **Destino de los leads** (hoy `ConsoleLeadRepository`, que solo loguea el correo enmascarado): CRM, email marketing o base de datos. Implementar `LeadRepository` y pasarle el contract test `leadRepositoryContract`. Registrar en `src/features/lead-capture/composition.ts`.
- [ ] **Rate limiting** del formulario (hoy `NoopRateLimiter`): implementar `RateLimiter`, por ejemplo con ventana deslizante en Upstash Redis por IP. Ya recibe la IP desde la Server Action.
- [ ] **Consentimiento y política de privacidad** para el formulario de correo, según el destino de los leads.

## Técnico

- [ ] **HSTS y `upgrade-insecure-requests`**: decidir al definir el hosting (hoy no se envían porque e2e corre en HTTP).
- [ ] **Rich Results Test de Google**: correrlo cuando haya una URL pública. Hoy el JSON-LD se valida estructuralmente (tests unitarios y e2e). Google limita los resultados enriquecidos de FAQ: el `FAQPage` es válido, pero el rich result no está garantizado.
- [ ] **Licencia de Remotion**: es gratuita para personas y empresas de hasta 3 empleados. Si Código Dinero supera ese tamaño, necesita una licencia de empresa (remotion.pro).
- [ ] **TypeScript 7 y ESLint 10**: actualizar cuando `typescript-eslint` y los plugins de `eslint-config-next` los soporten (ver decisiones).
- [ ] **Video**: el MP4 (`public/video/promo-codigo-dinero.mp4`, generado con `pnpm remotion:render`) no se versiona. Si se publica en YouTube, sumar el `VideoObject`.

## Decisiones técnicas registradas

- **Entorno 100% Docker**: no se instala nada en el host. Imagen `mcr.microsoft.com/playwright:v1.64.1-noble` (Node 26.13 LTS) más pnpm 12.16.1 y agent-browser 0.41.1. Al actualizar `@playwright/test`, hay que actualizar también el tag de la imagen base. CI usa la misma imagen.
- **TypeScript 6.0.x en lugar de 7**: `typescript-eslint@8.72.1` declara `typescript >=4.8.4 <6.1.0`.
- **ESLint 9.39.x en lugar de 10**: la documentación de Next 16.4 dice que `eslint-config-next` soporta ESLint 10, pero `eslint-plugin-react`, `eslint-plugin-import` y `eslint-plugin-jsx-a11y` (que trae) todavía declaran `eslint ≤ 9`.
- **Volúmenes de caché del contenedor**: `docker/Dockerfile` crea `/home/ubuntu/.pnpm-store` y `/home/ubuntu/.cache` como `ubuntu`; si no, Docker los crea como root y pnpm no puede escribir. Si un volumen viejo quedó como root: `docker compose down -v`.
- **CSP sin nonces** (`next.config.ts`): los nonces obligan a renderizar en dinámico y la home tiene que quedar prerenderizada. `script-src` lleva `'unsafe-inline'`, y `'unsafe-eval'` solo en desarrollo. Zod corre en modo `jitless` (`src/shared/lib/zod-csp.ts`) para no disparar violaciones de CSP con su detección de `Function("")`. `media-src` admite `data:` porque el Player de Remotion desbloquea el autoplay con un audio silencioso embebido. El e2e falla si aparece cualquier violación de CSP (carga y reproducción del video incluidas).
- **Sin `vite-tsconfig-paths`**: Vite 8 resuelve los `paths` de tsconfig de forma nativa (`resolve.tsconfigPaths`).
- **Reglas de arquitectura** con `eslint-plugin-boundaries` 7 (`boundaries/dependencies`, con `checkAllOrigins` para limitar `domain/` y `application/` a Zod). Los tests y los `*.contract.ts` quedan fuera de las reglas.
- **Tests de Playwright contra el build de producción** en el puerto 3100 (el 3000 es de `next dev`). `reference/` se sirve en el 3001.
- **Sin el preflight de Tailwind** (`src/app/globals.css`): la referencia depende de los estilos por defecto del navegador. Se importan solo `theme` y `utilities`, y la capa base replica los estilos globales de la referencia. Consecuencia: **no usar `border-solid`**, porque activa el borde en los cuatro lados con el ancho por defecto (3 px). Las utilidades `border-*` de Tailwind 4 ya fijan el estilo del lado que corresponde.
- **Fuentes**: los mismos binarios que carga la referencia desde Google Fonts CSS (Lexend v26 y Unbounded v12, subset latino, eje `wght` variable), en `public/fonts/` y servidos con `next/font/local`. `next/font/google` baja otra revisión cuyos anchos difieren ~4% y rompía el pixel match. Sin fallback métrico (`adjustFontFallback: false`), así la cadena de fuentes es idéntica a la de la referencia. Remotion usa los mismos archivos. La imagen OG usa TTF (`src/shared/seo/fonts/`), porque Satori no lee woff2.
- **Tokens propios en `@theme`**: se resetean los namespaces de Tailwind que se reemplazan. `src/shared/lib/cn.ts` registra los mismos tokens en `tailwind-merge`; si se agrega un token, hay que sumarlo en los dos lugares.
- **Ticker y prerender**: el HTML prerenderizado muestra un snapshot inicial determinista (simulación con semilla fija). TanStack Query se monta recién después de hidratar, porque lee el reloj y eso bloquea el prerender con Cache Components. `/api/quotes` usa `connection()` y se ejecuta en cada request.
- **Estructura del hero**: la `section#inicio` de la referencia se divide en `div#inicio > header` (landmark banner: nav, menú y ticker) y `section#hero` dentro de `main` (h1 y resto). Visualmente es el mismo bloque; la regresión visual mide la unión de los dos.
- **Accesibilidad frente a la referencia** (sin cambios visuales salvo el último punto):
  - `SectionTitle` agrega un espacio entre palabras para el nombre accesible ("Nuestra formación" y no "Nuestraformación").
  - El logo se llama "COD, Código Dinero: ir al inicio", así incluye el texto visible (WCAG 2.5.3).
  - Las reseñas atenuadas (opacidad 0,45) quedan con `aria-hidden` y fuera del chequeo de axe: excepción de WCAG 1.4.3 para componentes inactivos. Lighthouse desktop las cuenta igual (Accesibilidad 96 en desktop, 100 en móvil, donde están ocultas).
  - El número de la pregunta abierta de la FAQ usa `#FF3636` (`accent-raised`) en lugar de `#FF2B2B` sobre `#202020`: 4,53:1 contra 4,37:1, para cumplir AA. La diferencia visual queda muy por debajo del umbral de 0,5%.
  - El botón de play del video dice "Reproducir video de presentación" (la referencia agregaba "(próximamente)", pero ahora el video existe).
  - El input de correo muestra el foco en el contorno del formulario (`focus-within`); la referencia lo anulaba con `outline: none`.
- **Fotos**: `PersonPhoto` recibe el slot de `src/shared/config/photos.ts`. Sin foto, muestra la silueta y la pastilla "Foto".
- `pnpm-workspace.yaml` aprueba el build script de `esbuild` (lo usan Remotion y Vite). pnpm 12 bloquea los scripts que no están aprobados.
