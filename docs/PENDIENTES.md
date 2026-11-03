# Pendientes

Todo lo que falta definir o implementar. Se actualiza en cada fase.

## Contenido (marcadores de la referencia, se mantienen tal cual en la UI)

- [ ] **Precio**: `[PRECIO] [por mes / pago único]` (FAQ 01).
- [ ] **Plataforma** de la Escuela: `[PLATAFORMA]` (FAQ 03).
- [ ] **Soporte**: `[CORREO o WHATSAPP DE SOPORTE]` y `[PLAZO]` de acreditación (FAQ 04).
- [ ] **Política de cancelación**: `[CONFIRMAR POLÍTICA]` y `[DÓNDE SE CANCELA]` (FAQ 05).
- [ ] **Reseñas reales**: `[Nombre del alumno]`, `[Ciudad]` y textos `[Reseña de un alumno: …]` (sección Comunidad, ×3).

## Links y datos

- [ ] Links de YouTube (canal, clases 01–04, clase destacada, "Ver la ruta de estudio"). Habilitan el JSON-LD `VideoObject`.
- [ ] Links de redes: YouTube, Instagram, TikTok, Telegram, X (footer y `sameAs` del JSON-LD).
- [ ] Link de partner de EC Markets ("Abrir cuenta").
- [ ] Destinos de los links del menú: Escuela, Calendario, Mercado, Equipo, Empezar.
- [ ] Dominio de producción (`NEXT_PUBLIC_SITE_URL`).
- [ ] Textos legales: Términos y condiciones, Política de privacidad, Aviso de riesgo.

## Assets

- [ ] Fotos de clientes (PNG con fondo transparente): hero, mentor (sección "Qué es") y CTA final. Se configuran en `src/shared/config/photos.ts`.
- [ ] Avatares opcionales de las reseñas.

## Integraciones

- [ ] Proveedor real de cotizaciones (hoy `SimulatedQuoteSource`; la etiqueta "Simulado" queda visible mientras tanto).
- [ ] Destino de los leads (hoy `ConsoleLeadRepository`).
- [ ] Rate limiting del formulario de leads.

## Técnico (por fase)

- [ ] **Fase 7**: crear `src/features/promo-video/remotion/index.ts` (entry point de Remotion). Los scripts `remotion:studio` y `remotion:render` ya apuntan ahí y fallan hasta entonces.
- [ ] **Fase 6**: animar `Marquee` (ticker 44 s, cintas 40 s y 60 s invertida) y los giros de `Starburst` con GSAP. Hoy `Marquee` solo arma la estructura duplicada para el loop sin costura.
- [ ] **Fase 7/8**: ampliar la CSP de `next.config.ts` si se suman orígenes externos (YouTube: `frame-src`, `img-src`; proveedor real de cotizaciones: `connect-src`).
- [ ] **Fase 8**: decidir HSTS y `upgrade-insecure-requests` al definir el hosting (hoy no se envían porque e2e corre en HTTP).
- [ ] **Fase 8**: completar la metadata (`metadataBase`, descripción, Open Graph, `robots` con `noindex` fuera de producción); `layout.tsx` hoy solo define el título.

## Decisiones técnicas registradas

- **Entorno 100% Docker**: no se instala nada en el host. Imagen `mcr.microsoft.com/playwright:v1.64.1-noble` (Node 26.13 LTS) más pnpm 12.16.1 y agent-browser 0.41.1. Al actualizar `@playwright/test`, hay que actualizar también el tag de la imagen base.
- **TypeScript 6.0.x en lugar de 7**: `typescript-eslint@8.72.1` declara `typescript >=4.8.4 <6.1.0`. Revisar cuando typescript-eslint soporte TS 7.
- **ESLint 9.39.x en lugar de 10**: la documentación de Next 16.4 dice que `eslint-config-next` soporta ESLint 10, pero `eslint-plugin-react`, `eslint-plugin-import` y `eslint-plugin-jsx-a11y` (que trae) todavía declaran `eslint ≤ 9`. `create-next-app@16.4.5` también instala `^9`.
- **Volúmenes de caché del contenedor**: `docker/Dockerfile` crea `/home/ubuntu/.pnpm-store` y `/home/ubuntu/.cache` como `ubuntu`. Sin eso, Docker crea los volúmenes como root y pnpm no puede escribir el store. Si un volumen viejo quedó como root: `docker compose down -v`.
- **CSP sin nonces** (en `next.config.ts`): los nonces obligan a renderizar en dinámico y la home tiene que quedar prerenderizada (guía `content-security-policy.md` de Next). Por eso `script-src` lleva `'unsafe-inline'`, y `'unsafe-eval'` solo en desarrollo.
- **Sin `vite-tsconfig-paths`**: Vite 8 resuelve los `paths` de tsconfig de forma nativa (`resolve.tsconfigPaths`). La guía de Vitest de Next todavía usa el plugin.
- **Reglas de arquitectura** con `eslint-plugin-boundaries` 7 (`boundaries/dependencies`, con `checkAllOrigins` para limitar `domain/` y `application/` a Zod). Las reglas `external`, `no-unknown` y `no-ignored` están deprecadas en la v7 y no se usan.
- **Tests de Playwright contra el build de producción** en el puerto 3100 (el 3000 es de `next dev`). `reference/` se sirve en el 3001.
- **Sin el preflight de Tailwind** (`src/app/globals.css`): la referencia no usa reset y depende de los estilos por defecto del navegador (`line-height: normal`, `content-box`, `svg`/`img` inline). Se importan solo `theme` y `utilities`, y la capa base replica los estilos globales del `<helmet>`. Verificado en el navegador: las primitivas miden exactamente lo mismo que en la referencia, incluidos los bordes `content-box` ("Abrir cuenta" 46 px, "Quiero sumarme" 50 px).
- **Tokens propios en `@theme`**: se resetean los namespaces de Tailwind que se reemplazan (colores, `text`, `leading`, `tracking`, radios, contenedores, sombras, blur), para que no se cuelen valores ajenos a la referencia. `src/shared/lib/cn.ts` registra los mismos tokens en `tailwind-merge`; si se agrega un token, hay que sumarlo en los dos lugares.
- **Pesos de las fuentes**: la documentación de `next/font` (16.4.5) dice que una fuente variable acepta un rango (`weight: '400 600'`), pero los tipos de la misma versión no lo permiten. Se usan arrays con los pesos exactos: Lexend 400/500/600 y Unbounded 600/800. Lexend 300 y 700 se cargan en la referencia, pero no se usan.
- **Accesibilidad de `SectionTitle`**: en la referencia, el nombre accesible queda pegado ("Nuestraformación") porque el espacio lo da el `gap`. Se agrega un espacio entre los dos `span`, que en flex no se ve.
- `pnpm-workspace.yaml` aprueba el build script de `esbuild` (lo usan Remotion y Vite). pnpm 12 bloquea los scripts que no están aprobados.
