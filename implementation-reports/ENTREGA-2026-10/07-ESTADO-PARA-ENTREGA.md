# Entrega 2026-10 · Qué falta para terminar · 21-oct-2026

> **Actualización 21-oct, tarde:**
> - PR #1, #2 y #3 fusionados: `main` está en `7509dc9` y el deploy de producción está en READY, verificado (218 páginas con `noindex`, robots bloqueante, 64/64 URL antiguas).
> - El deploy hook apunta a `main` (`sanity-production-main`, webhook «Vercel producción · main», probado de extremo a extremo). El hook viejo está revocado y el webhook viejo, desactivado.
> - El equipo de Vercel pasó a Pro, después de que las escrituras en masa en Sanity, con el webhook activo, agotaran el cupo de 100 deploys diarios de Hobby.
> - Por eso el bloqueante 1 y el P1 10 están **resueltos**.

Medido hoy sobre `entrega/cms-sanity-nube` (`8313f95`), el proyecto de Vercel `pergola-plus-preview` y el proyecto de Sanity `n0ct9t3k`. Todas las lecturas fueron de solo lectura.

## Veredicto

**Se puede entregar el código y el CMS para revisión. No se puede publicar todavía en el dominio real.**

El SEO técnico de las páginas está terminado y medido. Lo que bloquea el lanzamiento:

- **Ramas:** el trabajo no está en `main`.
- **Infraestructura:** SMTP, DNS y antibot.
- **Analítica:** el sitio nuevo no tiene la medición que tiene el sitio en vivo.
- **Textos legales:** la política de privacidad no existe y los términos en español no tienen revisión de abogado.

## 1. Lo que está terminado (con evidencia)

| Área | Estado | Evidencia |
|---|---|---|
| Puertas del repo | ✅ 26/26 | `npm run check` en producción, 21-oct (218 páginas) |
| Rastreo | ✅ | `crawl.mjs` sobre 218 páginas: 0 canonical mal, 0 hreflang sin recíproco, 0 sin x-default, 0 H1 mal, 0 saltos de encabezado, 0 enlaces rotos, 0 títulos ni descripciones duplicados |
| Sitemap | ✅ | 214 URL; las 4 `noindex` (404 y thank-you EN/ES) fuera |
| Imágenes | ✅ | 0 sin alt, 0 sin `width`/`height` |
| Datos estructurados | ✅ | 216/216 bloques JSON-LD parsean; `check:jsonld` y `check:og` en verde |
| Open Graph | ✅ | `og:image` por documento desde Sanity (JPEG 1200×630) en las 218 |
| Internacional | ✅ | 109 parejas EN/ES con hreflang recíproco (los términos en español, desde hoy) |
| Redirecciones | ✅ | 64/64 URL del Webflow en vivo con un solo salto a 200 (127/127 peticiones en el preview) |
| Modo cerrado | ✅ | 218/218 `noindex`, `robots.txt` bloqueante, sin sitemap, `llms.txt` ni RSS |
| robots.txt de producción | ✅ | 12 de 13 rastreadores verificados en documentación oficial; Bytespider sin página oficial |
| Rendimiento | ✅ con reservas | A11y, BP y SEO 100 en 32/32 filas; CLS 0 en las 32; rendimiento móvil 93–100 (condado 93, home 95). Ver §4 |
| Sanity | ✅ | esquema con 0 errores; Studio publicado con validaciones probadas; todos los campos con su valor (los que quedan vacíos lo están porque vacío es su valor: tabla C9 del informe 06) |
| Webhook Sanity → Vercel | ✅ | probado de extremo a extremo: crear, cambiar y borrar se ven en el preview |

## 2. Bloqueantes del lanzamiento (P0)

| # | Qué | Por qué bloquea | Dueño | Acción |
|---|---|---|---|---|
| 1 | ~~**El trabajo no está en `main`**~~ **RESUELTO** (`7509dc9`) | Producción en Vercel sirve `main` (`7feee86`, 18-oct), sin rendimiento ni Sanity | Senavia | Fusionar en orden: PR #1 (`perf/100-cwv` → `main`), PR #2 (`nube` → `entrega/cms-sanity`) y uno nuevo `entrega/cms-sanity` → `main`. Cambiar después la rama del deploy hook a `main` |
| 2 | **SMTP sin configurar** | Sin `SMTP_*` ni `LEAD_WEBHOOK_URL`, `/api/lead` devuelve 500 y el visitante ve el teléfono: **los formularios no captan** | Daniel (buzón y App Password) / Senavia | Definir `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `LEAD_NOTIFY_TO` en Vercel (production), o `LEAD_WEBHOOK_URL`. Probar los 3 formularios EN/ES |
| 3 | **Antibot sin secreto** | Sin `TURNSTILE_SECRET_KEY` los leads entran `verificado:false`; el widget ya está montado en las 2 páginas de captación | Daniel / Senavia | Crear el secreto en Cloudflare Turnstile para el dominio y definirlo en Vercel |
| 4 | **DNS y dominio** | `www.pergolaplusflorida.com` sigue en el Webflow antiguo; el proyecto de Vercel no tiene dominio propio | Daniel (o acceso para `sebastian@senaviacorp.com`) | Añadir el dominio en Vercel y cambiar A/CNAME. Mismo día: `PUBLIC_SITE_URL` = dominio, `PUBLIC_ES_PRODUCCION=1`, quitar Vercel Authentication de producción y redeploy |
| 5 | **Analítica y Search Console** | El sitio en vivo lleva GTM `GTM-TKKRL526`, GA4 `G-HE8WG1NFV9` / `G-QT4LKRP0GZ`, Google Ads `AW-11106946679` y la verificación de Search Console. El nuevo no lleva **nada**: al cambiar el DNS se pierden la medición, las conversiones de Ads y, según el método, la verificación | Senavia + cliente | Montar GTM (o GA4 y Ads) con consentimiento y CSP actualizada, y mantener la verificación de Search Console (DNS TXT o etiqueta) antes del cambio |
| 6 | **Política de privacidad** | No existe: es un texto provisional. Los formularios recogen datos y los términos citan SMS (A2P 10DLC) | Cliente | Redactarla y publicarla en el CMS en los dos idiomas (`docs/estado-final.md`). Quitar la regla provisional de `scripts/lib/transformar.mjs` |
| 7 | **Términos en español sin revisión legal** | Publicados hoy como traducción de cortesía, por decisión en el chat. `docs/estado-final.md` decía: «Encargar a un abogado la versión española del contrato de obra, o dejarla en inglés. **No la traduzca nadie más.**» | Cliente / abogado | Que la apruebe un abogado antes del lanzamiento, o retirar `cuerpo.es` de `legalPage-terms-of-service`. Retirarlo quita la página `/es/` y su hreflang solo, sin tocar código |

## 3. Antes de 30 días (P1)

| # | Qué | Dueño | Acción |
|---|---|---|---|
| 1 | Errores del contrato en inglés: «NOTICE TO Customer» por «NOTICE TO OWNER» (aviso legal de la Ley de gravámenes de Florida), «HomeCustomer», un paréntesis sin cerrar, una frase sin sujeto en la limitación de responsabilidad, «topper form», «PERGOLA PLUS CORP» frente a «Pergola Plus Florida LLC» | Abogado / Daniel | Corregir el original y, con él, la versión española |
| 2 | 76 `<title>` de más de 60 caracteres (38 de más de 70): Google los corta | Cliente (es su copy) | Propuesta de títulos más cortos con aprobación escrita |
| 3 | Cifras de los 21 posts en español sin validar por el negocio | Cliente | Revisión de precios, plazos y cargas de viento |
| 4 | Revocar el token `migracion-nube-2026-10-21` (Editor, caduca el 19-nov) | Sebastian | sanity.io/manage → API → Tokens |
| 5 | El token `website_token_setting` tiene Access Manager, Editor y Deploy Studio, y **no caduca** | Sebastian | Confirmar si algo lo usa (el build no: lee el dataset público sin token); si no, revocarlo o rotarlo con el mínimo rol |
| 6 | Search Console tras el cambio: enviar `sitemap.xml`, pedir la indexación de home, productos y servicios, y vigilar 404 y cobertura 4 semanas (las 64 URL antiguas tienen 301) | Senavia | Con acceso a Search Console |
| 7 | Google Business Profile: credenciales de la API para el carrusel de reseñas (hoy el snapshot es manual) y NAP idéntico al del sitio y el JSON-LD | Cliente | Los 4 pasos de la cabecera de `scripts/traer-resenas.mjs` |
| 8 | Recorrer las animaciones en un navegador visible (home, producto, servicio, post) | Senavia | Pendiente desde `docs/estado-final.md` |
| 9 | Copy de los 3 proyectos nuevos (Boca Beach Sukkah, Elan Polo Club, Jupiter Ocean Club) y decisión sobre `/contact-us/get-services` | Cliente | — |
| 10 | ~~Webhook de Sanity a la rama del preview~~ **RESUELTO**: apunta a `main`. Ojo: cada publicación reconstruye producción, así que las escrituras en masa se hacen con el webhook desactivado | Senavia | — |
| 11 | RSS: no difundirlo hasta confirmar el dominio (los `<guid>` son permanentes) | Senavia | — |

## 4. Mejoras (P2)

- **Rendimiento móvil:**
  - LCP de 2,0 a 3,2 s en varias plantillas (condado 3,15 s, home 2,9 s);
  - «imágenes a mejorar» de las galerías (hasta 221 KB por página);
  - 180 imágenes del CMS sin uso (28 MB) en el repo.
  - Las cifras locales llevan ruido de CPU en móvil (`rtt` > 0,1 en 14–31 de 96 corridas).
- **Turnstile:** unos 750 KB externos en las 2 páginas de captación. Es el precio del antibot; se puede cargar al interactuar con el formulario.
- **Contenido local:** varias ciudades comparten la misma foto de portada y de og. Conviene foto propia por ciudad para diferenciarlas.
- **Sanity:** los campos `SIN_USO` (ocultos) y los antiguos que solo lee el código viejo se pueden retirar del dataset después de fusionar. El plan Free no tiene copias programadas: dejar un `sanity dataset export` periódico.
- **robots.txt:** Bytespider sigue «a verificar» (sin página oficial de ByteDance).

## 5. Plan del día del lanzamiento

1. ~~Fusionar la cadena de PRs a `main`~~ Hecho (`7509dc9`, READY). Si hay commits nuevos, confirmar que producción sirve el último.
2. Variables de producción en Vercel:
   - `SMTP_*` (o `LEAD_WEBHOOK_URL`);
   - `TURNSTILE_SECRET_KEY`;
   - `PUBLIC_SITE_URL=https://www.pergolaplusflorida.com`.
   `PUBLIC_ES_PRODUCCION` se queda en `0` hasta el paso 5.
3. Analítica (GTM/GA4/Ads) y la verificación de Search Console desplegadas y comprobadas en el preview.
4. Dominio en Vercel, cambio de DNS (A/CNAME) y certificado emitido.
5. `PUBLIC_ES_PRODUCCION=1`, quitar Vercel Authentication de producción y redeploy.
6. Comprobar en el dominio:
   - `robots.txt` con `Allow` y `Sitemap`;
   - `sitemap.xml` con 214 URL;
   - canonical al dominio;
   - las 64 URL antiguas con `curl -sI`;
   - un formulario de cada tipo que llegue por correo;
   - Turnstile que bloquea sin token.
7. Search Console: enviar el sitemap y pedir la indexación de las principales. Vigilar cobertura y 404 durante 4 semanas.
8. Deploy hook de Sanity apuntando a `main` y una publicación de prueba.

## 6. Lo que no se pudo medir y qué acceso falta

| Qué | Falta |
|---|---|
| Cobertura e indexación reales, CWV de campo (CrUX) | Search Console del dominio |
| Conversiones actuales y su configuración | GA4 / GTM / Google Ads |
| NAP y categorías de Google Business Profile | GBP |
| DNS actual del dominio | Registrador o Webflow |
| Envío real de correo | Credenciales SMTP |

## 7. Siguiente paso

La auditoría final, completa, está en `docs/PROMPT-AUDITORIA-SEO-ENTREGA.md`: sitio, Vercel, Sanity y el Webflow en vivo como línea base, sin las restricciones heredadas de Webflow. Su entregable irá en `08-AUDITORIA-SEO-FINAL.md`. Ya se puede ejecutar: `main` está fusionado. Tiene que ser antes del cambio de DNS.
