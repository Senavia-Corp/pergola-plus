# 08 — Preflight de producción

Estado al cierre de esta fase: **NO LISTO PARA INDEXAR** por configuración de infraestructura, no por el código. El código está listo para desplegar en modo preview (noindex) ya; para indexar hace falta lo marcado BLOQUEADO.

## Dominios y entorno (lectura real del 18-oct-2026)

| Comprobación | Resultado | Estado |
|---|---|---|
| Dominio definitivo confirmado por escrito | `https://www.pergolaplusflorida.com` aparece como fallback en el código y en `.env.example`; sigue sirviendo el Webflow (`data-wf-site 63f3b8ea…`) | **BLOCKED** — confirmar titularidad/DNS |
| Proyecto Vercel | `pergola-plus-preview` (team senaviacorp), sin dominio propio, Node 24.x | PASS (lectura) |
| Deploy SHA = commit auditado | production `dpl_B1dcbupk…` = `6ab769b` | PASS |
| `PUBLIC_ES_PRODUCCION` | `=1` en **production** del proyecto preview → la URL `*.vercel.app` es indexable | **FAIL** (mientras no haya dominio real) |
| `PUBLIC_SITE_URL` | definida (sensitive) en production; el HTML servido canonicaliza a `pergola-plus-preview.vercel.app` | **FAIL** para producción real; coherente con lo que sirve |
| Variables en preview/branch | ninguna → builds de rama salen noindex (correcto) | PASS |
| Deployment Protection | SSO solo en URLs que no sean «custom domains»; `pergola-plus-preview.vercel.app` responde 200 sin SSO | **FAIL** para una copia que no debe indexarse |
| `x-robots-tag` | ausente en todas las respuestas | — |
| Canal de leads (SMTP o webhook) y `TURNSTILE_SECRET_KEY` | no visibles entre las variables de production (solo las dos PUBLIC_) → `/api/lead` devuelve 500 y los formularios no captan; Turnstile no se verifica | **FAIL** |

## HTTP real del deploy actual

```
GET /robots.txt   200  Allow: /  Disallow: /api/  Sitemap: https://pergola-plus-preview.vercel.app/sitemap.xml
GET /sitemap.xml  200
GET /resources/blog/rss.xml 200   (guid permanentes hacia la URL provisional)
GET /             200  canonical https://pergola-plus-preview.vercel.app/  sin <meta robots>  sin og:image
```

## Lo que el build hace por entorno (verificado en local sobre dist/)

| | `PUBLIC_ES_PRODUCCION=1` + `PUBLIC_SITE_URL=https://www.pergolaplusflorida.com` | sin ellas |
|---|---|---|
| `<meta name="robots">` | ausente salvo 4 páginas (`404`, `thank-you` EN/ES, `es/404`) con `noindex` a propósito | `noindex,nofollow` en las 217 |
| robots.txt | `Allow: /`, `Disallow: /api/`, `Sitemap:` | `Allow: /`, `Disallow: /api/`, SIN sitemap (rastreable para que el noindex se lea: GH-002) |
| sitemap.xml | 213 URL canónicas con alternates EN/ES; sin noindex ni 404/thank-you/api | no se escribe (se borra si existía) |
| RSS | sí | no, y sin `<link>` que lo anuncie |
| canonical/hreflang/JSON-LD | dominio real | `http://localhost:4321` (inofensivo) |
| Puerta | `PUBLIC_ES_PRODUCCION=1 npm run check:noindex` | `npm run check:noindex` |

(Cifras del build de producción simulada: ver `05-CRAWL-SEO-VALIDATION.csv` y `09-FINAL-SCORECARD.md`.)

## Checklist previa a release

- [ ] **Decidir A o B** (ver `10-ROLLBACK-AND-DEPLOYMENT-NOTES.md`). Mientras el dominio siga en Webflow: quitar `PUBLIC_ES_PRODUCCION` de production del proyecto preview y proteger `*.vercel.app`.
- [ ] Si la copia `*.vercel.app` ya ha sido indexada: dejarla ACCESIBLE y `noindex` hasta que Google la retire (no `Disallow`); pedir retirada temporal en GSC si se puede verificar la propiedad.
- [ ] Añadir el dominio definitivo en Vercel y en DNS; `PUBLIC_SITE_URL` exacto (con `www`, https); `PUBLIC_ES_PRODUCCION=1` SOLO en production.
- [ ] SMTP + `LEAD_NOTIFY_TO` o `LEAD_WEBHOOK_URL`; `TURNSTILE_SECRET_KEY` (el sitekey ya está en el markup de `quote` y `contact`).
- [ ] `git push` del commit de esta fase; comprobar que el build de Vercel pasa (`npm run build` incluye `rutas-vercel.mjs`).
- [ ] Tras el deploy, curl: `/robots.txt`, `/sitemap.xml`, `/`, `/es/`, `/products/cabanas/`, `/services/pavers/`, `/pergolas-contractors/miami-pergola-experts/`, `/post/hoa-rules-pergolas-south-florida/`, `/thank-you/`, `/es/404/`, `/es/no-existe/` (404 en español), `/deck-builders` (301), `/products/sukkha` (301). Registrar status, `cache-control`, `content-encoding`, canonical y `<meta robots>`.
- [ ] Lighthouse ×3 móvil/escritorio sin extensiones sobre el dominio real para home, producto, servicio, ciudad, post y home ES; comparar con `03-BEFORE-AFTER-LIGHTHOUSE.csv`.
- [ ] Rich Results Test sobre una URL de cada plantilla; validar tarjetas sociales (og:image 1200×630) con el depurador de Facebook/LinkedIn.
- [ ] Enviar el sitemap en GSC; a los 7–14 días revisar cobertura, páginas excluidas y CWV de campo.
- [ ] Un lead de prueba REAL por formulario (`quote`, `contact`, `footer`, `estimador`) EN y ES, acordado con el cliente, y confirmar recepción del aviso y del acuse.
