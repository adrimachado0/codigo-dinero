# Pendientes

Todo lo que falta definir o implementar. Los marcadores se mantienen tal cual en la UI hasta tener el dato real; no se inventa contenido.

## Links (todos en `src/shared/config/links.ts`)

- [ ] **Número de WhatsApp**: `WHATSAPP_NUMBER` (hoy `549XXXXXXXXXX`). Un solo cambio actualiza todos los botones (`whatsappUrl()` arma `https://wa.me/<número>?text=<mensaje>`; los mensajes están en `whatsappMessages`).
- [ ] **Registro Partner/IB de EC Markets**: `links.partnerRegistration` (hoy `#`). Lo usan los 5 botones con `data-link="partner-ib-registro"`: "Empezar" (header y footer) y "Quiero aprender desde cero" (hero, "Traders novatos" y "Quién soy").
- [ ] **"Ver clases grabadas"** (Recursos): `links.recordedClasses` (hoy `#`).
- [ ] **Lista de reproducción del Curso Básico e Intermedio**: `links.youtubeCourse` (hoy el canal de YouTube).
- [ ] **Video del tutorial** "Cómo leer velas japonesas desde cero": `links.youtubeTutorial` (hoy el canal). Con la URL del video se puede sumar el JSON-LD `VideoObject` en `src/shared/seo/json-ld.tsx`.
- [ ] **Redes sin URL**: Telegram y X (`src/shared/config/site.ts`, `social`). Al cargarlas, el `sameAs` del JSON-LD las suma solo.
- [ ] **Menú**: destino de "Equipo".
- [ ] **Logo de EC Markets**: `site.partner.href`.
- [ ] **Dominio de producción**: en Vercel se toma solo (`VERCEL_ENV` y el dominio de producción del proyecto). Con un dominio propio, definir `NEXT_PUBLIC_SITE_URL` con ese dominio. Fuera de Vercel hay que definir `NEXT_PUBLIC_SITE_URL` y `SITE_ENV=production`: sin `production` el sitio sale con `noindex` y `robots.txt` bloquea todo.
- [ ] **Search Console y Bing Webmaster Tools**: verificar la propiedad (variables `GOOGLE_SITE_VERIFICATION` y `BING_SITE_VERIFICATION`) y enviar `https://<dominio>/sitemap.xml`.

## Contenido (marcadores del diseño)

- [ ] **Portadas reales de la biblioteca**: las 6 tarjetas son portadas de ejemplo con `[Título del recurso]` y la nota "Portadas de ejemplo: se reemplazan por las reales." (`src/features/library/content.ts`). El mensaje de WhatsApp de cada una toma su título.
- [ ] **Precio**: `[PRECIO] [por mes / pago único]` (FAQ 01). Archivo: `src/features/faq/content.ts`.
- [ ] **Plataforma** de la formación: `[PLATAFORMA]` (FAQ 03).
- [ ] **Soporte**: `[CORREO o WHATSAPP DE SOPORTE]` y `[PLAZO]` de acreditación (FAQ 04).
- [ ] **Política de cancelación**: `[CONFIRMAR POLÍTICA]` y `[DÓNDE SE CANCELA]` (FAQ 05).
- [ ] **Textos legales**: Términos y condiciones, Política de privacidad, Aviso de riesgo (páginas y links del footer).

## Assets

- [ ] **QR real del fondo del hero**: el QR es GENÉRICO, de prueba (copiado del lienzo de diseño, no apunta a nada). Para poner el real, cambiar solo `src/shared/ui/qr-glyph.ts` (path en unidades de módulo y cantidad de módulos por lado); `QrPattern` lo escala para que cada QR siga midiendo 200 × 200 px. Los tweaks del lienzo `qrStyle` e `qrIntensity` no se implementaron: quedan fijos en rojo e intensidad 1.
- [ ] **Foto del cierre en más resolución**: `angel-cierre.webp` mide 289 px de ancho y se muestra a 280 px; en pantallas de alta densidad se ve blanda. Ideal ≥ 560 px, recorte sin fondo.
- [ ] **Emblema del logo en alta resolución** (PNG cuadrado transparente, ideal ≥ 1024 px): el favicon y los íconos salen del emblema recortado del logo, que mide 160 px; los de 512 px (manifest, logo del JSON-LD) se ven algo blandos. Con el archivo nuevo, ajustar `EMBLEM` en `scripts/generate-icons.mjs` y correr `pnpm icons`.

## Técnico

- [ ] **Movimiento y accesibilidad**: por decisión del dueño, las animaciones decorativas (cintas, giros, esfera) ignoran "reducir movimiento" del sistema. La entrada de las velas de "¿Qué es Código Dinero?" sí lo respeta (pedido explícito). Riesgos: incomoda a personas sensibles al movimiento (WCAG 2.3.3, AAA), y el contenido que se mueve solo durante más de 5 s debería poder pausarse (WCAG 2.2.2, nivel A). Si se quiere cumplir AA, la solución más simple es un botón "Pausar animaciones" (por ejemplo, en el footer).
- [ ] **TradingView**: los widgets gratuitos llevan el logo de TradingView y la atribución "Gráfico de XAUUSD por TradingView". Sacarlos requiere una licencia de TradingView.
- [ ] **HSTS y `upgrade-insecure-requests`**: decidir al definir el hosting (hoy no se envían porque e2e corre en HTTP).
- [ ] **Rich Results Test de Google**: correrlo cuando haya una URL pública. Hoy el JSON-LD se valida estructuralmente (tests unitarios y e2e). Google limita los resultados enriquecidos de FAQ: el `FAQPage` es válido, pero el rich result no está garantizado.
- [ ] **TypeScript 7 y ESLint 10**: actualizar cuando `typescript-eslint` y los plugins de `eslint-config-next` los soporten (ver decisiones).

## Decisiones técnicas registradas

- **Entorno 100% Docker**: no se instala nada en el host. Imagen `mcr.microsoft.com/playwright:v1.64.1-noble` (Node 26.13 LTS) más pnpm 12.16.1 y agent-browser 0.41.1. Al actualizar `@playwright/test`, hay que actualizar también el tag de la imagen base. CI usa la misma imagen.
- **TypeScript 6.0.x en lugar de 7**: `typescript-eslint@8.72.1` declara `typescript >=4.8.4 <6.1.0`.
- **ESLint 9.39.x en lugar de 10**: la documentación de Next 16.4 dice que `eslint-config-next` soporta ESLint 10, pero `eslint-plugin-react`, `eslint-plugin-import` y `eslint-plugin-jsx-a11y` (que trae) todavía declaran `eslint ≤ 9`.
- **Volúmenes de caché del contenedor**: `docker/Dockerfile` crea `/home/ubuntu/.pnpm-store` y `/home/ubuntu/.cache` como `ubuntu`; si no, Docker los crea como root y pnpm no puede escribir. Si un volumen viejo quedó como root: `docker compose down -v`.
- **Solo front**: sin backend, CMS ni formularios. Compras y solicitudes abren WhatsApp con el mensaje armado; los registros van al link Partner/IB. Se quitaron el formulario de contacto (server action, `next-safe-action`), la ruta `/api/quotes` con su mercado simulado y TanStack Query, y el video de Remotion.
- **CSP sin nonces** (`next.config.ts`): los nonces obligan a renderizar en dinámico y la home tiene que quedar prerenderizada. `script-src` lleva `'unsafe-inline'` y `https://s3.tradingview.com` (scripts de los widgets), y `'unsafe-eval'` solo en desarrollo. `frame-src` admite solo los iframes de TradingView. Zod corre en modo `jitless` (`src/shared/lib/zod-csp.ts`) para no disparar violaciones de CSP con su detección de `Function("")`. El e2e falla si aparece cualquier violación de CSP con los widgets cargados.
- **Widgets de TradingView** (`src/shared/ui/tradingview-widget.tsx`): un componente por tipo (Advanced Chart, Mini Chart, Market Quotes, Ticker Tape) sobre un cargador común que inyecta el script oficial cuando el marco se acerca a la pantalla. El alto lo reserva siempre el marco (sin CLS) y nada carga antes del LCP. Los iframes llevan `color-scheme: light`: la página es oscura y los documentos de TradingView claros, y con esquemas distintos Chrome pinta un fondo blanco opaco detrás del iframe. Los símbolos están en `src/shared/config/markets.ts`.
- **Sin `vite-tsconfig-paths`**: Vite 8 resuelve los `paths` de tsconfig de forma nativa (`resolve.tsconfigPaths`).
- **Arquitectura simple**: se probó una versión con capas, puertos y adaptadores (`domain/`, `application/`, `infrastructure/`) y se aplanó a pedido del usuario, porque costaba leerla. `eslint-plugin-boundaries` solo controla que entre secciones se use el `index.ts`, y que `shared/` no importe de `features/`.
- **Referencia v4**: `reference/index.html` es el render standalone de la página "Principal v4" (`project/Main-v4.dc.html`) del lienzo de diseño, generado con `node scripts/build-reference.mjs` desde `reference/design-source.dc.html` (la fuente v4 tal cual): plantilla + lógica del artboard, assets locales en lugar de `/_blob/…` y sin las notas "Vista de diseño…". El intérprete del formato está en `reference/dc-runtime.js`. Las versiones anteriores quedan en el historial de Git.
- **Tests de Playwright contra el build de producción** en el puerto 3100 (el 3000 es de `next dev`). `reference/` se sirve en el 3001.
- **Regresión visual y datos en vivo**: con `__FREEZE_MOTION__` los widgets de TradingView no cargan; en la comparación se enmascaran entera la cinta del header, el marco del gráfico de XAUUSD y las tarjetas de mercado (en la referencia, sus maquetas). Sus marcos miden lo mismo que en el diseño: el del gráfico sigue las proporciones del artboard en cada corte (≈ 525 px en 1440, 459 px en 768, 378 px en 390) y las tarjetas, 412 px.
- **Sin el preflight de Tailwind** (`src/app/globals.css`): la referencia depende de los estilos por defecto del navegador. Se importan solo `theme` y `utilities`, y la capa base replica los estilos globales de la referencia. Consecuencia: **no usar `border-solid`**, porque activa el borde en los cuatro lados con el ancho por defecto (3 px). Las utilidades `border-*` de Tailwind 4 ya fijan el estilo del lado que corresponde.
- **Fuentes**: los mismos binarios que carga la referencia desde Google Fonts CSS (Lexend v26 y Unbounded v12, subset latino, eje `wght` variable), en `public/fonts/` y servidos con `next/font/local`. `next/font/google` baja otra revisión cuyos anchos difieren ~4% y rompía el pixel match. Sin fallback métrico (`adjustFontFallback: false`), así la cadena de fuentes es idéntica a la de la referencia. La imagen OG usa TTF (`src/shared/seo/fonts/`), porque Satori no lee woff2.
- **Tokens propios en `@theme`**: se resetean los namespaces de Tailwind que se reemplazan. `src/shared/lib/cn.ts` registra los mismos tokens en `tailwind-merge`; si se agrega un token, hay que sumarlo en los dos lugares (los últimos: `bull` y `gold`).
- **Estructura del hero**: la `section#inicio` de la referencia se divide en `div#inicio > header` (landmark banner: nav, menú y ticker) y `section#hero` dentro de `main` (h1 y resto). Visualmente es el mismo bloque; la regresión visual mide la unión de los dos. La foto del hero se precarga (`preload`), porque a 420 px compite con el h1 por el LCP.
- **Accesibilidad frente a la referencia** (sin cambios visuales salvo donde se indica):
  - `SectionTitle` agrega un espacio entre palabras para el nombre accesible ("Nuestros recursos" y no "Nuestrosrecursos").
  - El logo se llama "Código Dinero, ir al inicio", así incluye el texto visible (WCAG 2.5.3).
  - El número de la pregunta abierta de la FAQ usa `#FF3636` (`accent-raised`) en lugar de `#FF2B2B` sobre `#202020`: 4,53:1 contra 4,37:1, para cumplir AA.
  - "Solicitar por WhatsApp" de la biblioteca mide 44 px (el diseño, 40 px) y su nombre accesible suma el tipo de recurso ("Solicitar por WhatsApp: Guía"). La regresión visual lo reporta como cambio intencional.
  - Las pestañas Metales / Cripto / Forex son un `tablist` con flechas; un `::after` lleva el área táctil a 44 px sin cambiar la pastilla.
  - axe excluye el contenido de los iframes de TradingView (de terceros).
- **Cambios de diseño posteriores a la referencia** (pedidos por el dueño; la regresión visual los reporta como "cambio intencional" sin fallar):
  - cintas de temas con un ícono de Lucide por tema (`src/features/topics-ribbon/content.ts`);
  - el bloque vino del header y del hero ocupa todo el ancho (`max-w-full`), y por eso a 1440 px difiere de la referencia;
  - por debajo de 768 px los márgenes y el espaciado son más compactos que en la referencia: secciones abiertas a 16 px (en lugar de 24), cajas (header/hero, Recursos, Indicador, Mercado, FAQ, footer) a 12 px del borde con padding interno compacto, tarjetas a 20 px, respuestas de la FAQ a todo el ancho y 72 px entre secciones (en lugar de 100–110). Desde 768 px no cambia nada. Por eso la regresión visual a 390 px solo reporta (no falla);
  - hovers: pastilla deslizante en el nav, botones que suben y pasan a blanco, bloques de formación y redes del footer que invierten colores; la esfera del hero reacciona al cursor.
- **Fotos**: `src/shared/config/photos.ts` centraliza las fotos de Ángel (recortes sin fondo del hero y del cierre, fotos de "Quién soy", eventos y tutorial). `PersonPhoto` muestra la silueta y la pastilla "Foto" si un slot queda en `null`.
- `pnpm-workspace.yaml` aprueba el build script de `esbuild` (lo usa Vite). pnpm 12 bloquea los scripts que no están aprobados.
