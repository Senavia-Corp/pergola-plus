# 10 — Reversión y notas de despliegue

## Reversión local

Todo el trabajo está en commits locales sobre `main` (ver `git log` desde `6ab769b`). **No se ha hecho push ni deploy.**

| Qué revertir | Cómo | Efecto |
|---|---|---|
| Todo el trabajo | `git revert <sha-del-commit>` (o `git reset --soft 6ab769b` si aún no se ha compartido) y `npm run build` | Vuelve byte a byte al estado auditado |
| Solo el vídeo diferido / poster | quitar el paso **4m** de `scripts/lib/transformar.mjs` y regenerar (`node scripts/generar-paginas.mjs`) | El hero vuelve al `background-image` JPEG y al MP4 inmediato |
| Solo el `srcset` de las fotos del cliente | quitar el bloque `srcset` del paso **4d** y regenerar; los `-NNN.avif` pueden quedarse (no estorban) | Vuelve a servir el master de 2500 px |
| Solo `defer`/jQuery local | restaurar los dos `<script>` de `BaseLayout.astro` (el `src` de CloudFront está en el comentario) | Vuelve al tercero bloqueante |
| Solo las fuentes | `git checkout 6ab769b -- public/fonts src/styles/fuentes.css` y los dos `preload` del layout | Vuelven los 10 ficheros |
| Solo el robots de preview | `astro.config.mjs` (`Allow: /` → `Disallow: /`) y `scripts/comprobar-noindex.mjs` | Vuelve al preview no rastreable |
| Solo los logs del endpoint | `git checkout 6ab769b -- src/lib/lead.ts` | Vuelve a volcar el lead entero en logs (no recomendado) |

Cada pieza es independiente: ninguna depende de otra para construir.

## Qué hace falta para desplegar (requiere autorización; NO ejecutado)

1. **Decidir el destino del proyecto Vercel `pergola-plus-preview`.** Hoy su target *production* sirve `pergola-plus-preview.vercel.app` con `PUBLIC_ES_PRODUCCION=1` y `PUBLIC_SITE_URL` apuntando a esa URL: una copia indexable del sitio. Dos salidas coherentes:
   - **A (recomendada mientras el dominio siga en Webflow):** quitar `PUBLIC_ES_PRODUCCION` (o ponerla ≠ `1`) en production → el build sale `noindex`, sin sitemap ni RSS, robots rastreable (esta fase), canonicals a `localhost` si además falta `PUBLIC_SITE_URL`. Y activar **Deployment Protection** (password o Vercel Authentication) para las URLs `*.vercel.app`.
   - **B (lanzamiento):** apuntar el DNS de `www.pergolaplusflorida.com` al proyecto, añadir el dominio en Vercel, dejar `PUBLIC_ES_PRODUCCION=1` y `PUBLIC_SITE_URL=https://www.pergolaplusflorida.com` SOLO en production, y en preview ninguna de las dos. Pedir a Google que recrawlee y, si la copia `*.vercel.app` ya está indexada, mantenerla accesible con `noindex` hasta que desaparezca (no bloquearla con robots).
2. Variables de leads en production: `SMTP_HOST/PORT/USER/PASS` + `LEAD_NOTIFY_TO` **o** `LEAD_WEBHOOK_URL`; y `TURNSTILE_SECRET_KEY`. Sin canal el endpoint devuelve 500 a propósito.
3. `git push origin main` → Vercel construye con `npm run build` (incluye `scripts/rutas-vercel.mjs`). Node 24.x en el proyecto: compatible con `engines >=22.12`.
4. Tras el deploy: curl de `/robots.txt`, `/sitemap.xml`, `/`, `/es/`, una ficha de cada plantilla, `/thank-you/`, `/es/404/` (status, `x-robots-tag`, `<meta robots>`, canonical) y Lighthouse limpio ×3. Checklist completa en `08-PRODUCTION-PREFLIGHT.md`.

## Rollback en Vercel

Vercel conserva los deployments anteriores: *Instant Rollback* al `dpl_B1dcbupkaVwFomgrnBzgwdjWF5Vc` (el del commit auditado) desde el panel. Los assets nuevos (`/images/cliente/*-NNN.avif`, poster, vídeo móvil, jQuery local) son ficheros estáticos adicionales: un rollback no deja referencias rotas porque el HTML viejo no los pide.
