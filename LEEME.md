# Cómo usar este paquete

Requisito: **Docker** (Docker Desktop con integración WSL, o Docker Engine). No hace falta instalar Node ni nada más en el host: todo corre en el contenedor definido en `docker/Dockerfile` y `compose.yaml`.

1. La carpeta del proyecto se llama `codigo-dinero/` y tiene que quedar así:

   ```
   codigo-dinero/
     PROMPT.md
     reference/
   ```

2. Abre una terminal en `codigo-dinero/` y ejecuta `claude`.
3. Escribe: `Lee @PROMPT.md y ejecútalo.`
4. Claude trabaja por fases y se detiene al final de cada una. Revisa lo que hizo y responde "seguí" para que continúe.
5. Al terminar la Fase 0 te va a pedir que reinicies Claude Code para que cargue las skills. Haz `/exit` y vuelve a entrar con `claude` desde `codigo-dinero/`.

Comandos útiles:

```bash
docker compose build app                    # construir la imagen
docker compose up -d dev                    # next dev en http://localhost:3000
docker compose run --rm app pnpm <script>   # lint, typecheck, test, build…
```

Para ver el diseño de referencia, abre `reference/index.html` en el navegador. Necesitas internet para que carguen las tipografías.
