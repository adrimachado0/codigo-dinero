@AGENTS.md

# Código Dinero — landing (Next.js)

Landing de Código Dinero (academia de trading, partner oficial de EC Markets). Réplica pixel perfect de `reference/`. El brief completo está en `PROMPT.md`; lo pendiente, en `docs/PENDIENTES.md`.

## Entorno

- **Todo corre en Docker. No se instala nada en el host** (ni Node, ni pnpm, ni navegadores, ni CLIs globales).
- Imagen: `docker/Dockerfile` (base `mcr.microsoft.com/playwright:v1.64.1-noble`, Node 26 LTS, pnpm, agent-browser). Servicios en `compose.yaml`:
  - `app`: comandos puntuales → `docker compose run --rm app pnpm <script>`.
  - `dev`: `next dev` en http://localhost:3000 (además expone 3001 para `reference/` y 3002 para Remotion Studio) → `docker compose up -d dev`.
- El repo vive en el filesystem de WSL (`/home/adriel/codigo-dinero`). Desde Claude Code (Windows), invoca Docker a través de WSL: `wsl.exe -d Ubuntu-26.04 --cd /home/adriel/codigo-dinero -- docker compose ...`. No uses la ruta `\\wsl.localhost` como contexto de Docker.
- `agent-browser` (skill `next-dev-loop`) vive en el contenedor y su daemon es persistente: úsalo con `docker compose exec dev agent-browser ...` contra `http://localhost:3000`, nunca con `run --rm`.
- Los hooks de Git (Husky) se ejecutan en el host y delegan en el contenedor (`docker compose run --rm -T app ...`).
- Skills del proyecto: `docker compose run --rm app bash docker/install-skills.sh` (versiones en `skills-lock.json`).
- Gestor de paquetes: **pnpm**. Versiones exactas fijadas en `package.json`.
- Antes de usar cualquier API de Next, lee la documentación instalada en `node_modules/next/dist/docs/` (referenciada desde `AGENTS.md`). Si choca con `PROMPT.md`, manda la documentación instalada y se avisa.

## Arquitectura

```
src/
  app/        # Solo enrutamiento y composición (capa delgada)
  features/   # Una carpeta por sección/feature
  shared/     # ui/ (primitivas), lib/ (cn, utils), config/ (site, env, photos), seo/
```

Estructura interna de una feature (solo las capas que necesite):

- `domain/`: entidades, value objects, esquemas Zod, puertos. TS puro: sin React ni Next, solo Zod.
- `application/`: casos de uso. Dependen solo de `domain`.
- `infrastructure/`: adaptadores que implementan puertos.
- `ui/`: componentes y hooks de React.
- `composition.ts`: raíz de composición (elige adaptador según env).
- `content.ts`: copy tipado y validado con Zod al cargar el módulo.
- `index.ts`: API pública de la feature.

Las secciones puramente visuales solo tienen `ui/` + `content.ts`. No sobreingenierizar.

## Reglas de dependencia (las hace cumplir `eslint-plugin-boundaries`)

- `ui → application → domain`; `infrastructure → domain`. `domain` no importa nada externo salvo Zod.
- Entre features, solo vía `index.ts`. Prohibidos los imports profundos.
- `shared` nunca importa de `features`. Cualquier feature puede importar de `shared`.
- `app/` solo compone features y llama a casos de uso.

## Convenciones

- Código, nombres y commits en inglés. Textos de UI en español, **exactos** a la referencia.
- No inventar contenido. Los marcadores (`[PRECIO]`, `[Nombre del alumno]`, `[PLATAFORMA]`, `[CONFIRMAR POLÍTICA]`, …) se mantienen tal cual y se listan en `docs/PENDIENTES.md`.
- Nada de TODOs sueltos: todo pendiente va a `docs/PENDIENTES.md`.
- Tailwind v4 con tokens en `@theme`; variantes con `cva`; clases combinadas con `cn` (`clsx` + `tailwind-merge`). Responsive con `md:`/`lg:`, sin `!important`.
- Toda animación respeta `prefers-reduced-motion`, se pausa fuera de pantalla y se limpia al desmontar (`useGSAP`).
- El `h1` del hero es el LCP: no se anima su entrada.
- Commits con Conventional Commits (commitlint).

## Comandos

Todos se corren en el contenedor: `docker compose run --rm app <comando>` (o `exec dev` si `dev` está levantado).

| Comando                                         | Qué hace                                                                     |
| ----------------------------------------------- | ---------------------------------------------------------------------------- |
| `pnpm dev`                                      | Servidor de desarrollo (Turbopack)                                           |
| `pnpm build` / `pnpm start`                     | Build y servidor de producción                                               |
| `pnpm lint`                                     | ESLint (incluye reglas de arquitectura)                                      |
| `pnpm typecheck`                                | Type-check estricto                                                          |
| `pnpm format` / `pnpm format:check`             | Prettier (con orden de clases de Tailwind)                                   |
| `pnpm test`                                     | Vitest (unitarios, componentes, contract tests)                              |
| `pnpm test:coverage`                            | Vitest con cobertura (umbral 90% en `domain/` y `application/`)              |
| `pnpm test:e2e`                                 | Playwright e2e + axe                                                         |
| `pnpm test:visual`                              | Regresión visual contra `reference/` (pixelmatch, umbral ≤ 0.5% por sección) |
| `pnpm remotion:studio` / `pnpm remotion:render` | Studio de Remotion / render MP4 a `public/video/`                            |

## Skills del proyecto

- `next-dev-loop`: verificar en el navegador después de cada cambio.
- GSAP (`gsap-*`) al animar; Remotion al trabajar el video.
- `vercel-react-best-practices`, `web-design-guidelines`: revisión de React/UI.
- `seo`, `core-web-vitals`, `seo-audit`: fase de SEO y rendimiento.

## Checklist de PR

- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` en verde, sin warnings ignorados.
- [ ] `pnpm test:e2e` y `pnpm test:visual` en verde (≤ 0.5% por sección en 1440, 1024, 768 y 390; sin scroll horizontal).
- [ ] Sin imports que violen las reglas de dependencia.
- [ ] Textos idénticos a la referencia; marcadores intactos y listados en `docs/PENDIENTES.md`.
- [ ] Accesibilidad: foco visible, targets ≥ 44px, `aria-*` correctos, 0 violaciones serias/críticas de axe.
- [ ] Animaciones con reduced motion, pausa fuera de pantalla y cleanup.
- [ ] Sin CLS: dimensiones reservadas para todo lo que carga después.
