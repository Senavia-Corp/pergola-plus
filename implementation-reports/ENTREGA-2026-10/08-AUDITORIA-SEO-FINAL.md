# 08 · Auditoría SEO final antes del cambio de dominio · 21-oct-2026 (cerrada el 23-oct)

> **23-oct:** desde el 21 no ha cambiado nada: `main` sigue en `7509dc9`, el DNS apunta a Webflow, Vercel no tiene dominio y siguen las mismas 2 variables, y el sitemap en vivo tiene las mismas 64 URL. Hoy se cerraron 3 comprobaciones que estaban en NO CORRIÓ, con OK del chat:
> - validator.schema.org: 0 errores;
> - Rich Results Test: confirma el error de `Product`;
> - licencia en DBPR: activa, a nombre de **DE HOME VENTURES LLC**.
>
> Las que quedan en NO CORRIÓ dependen de accesos o del día 0 (§7). El Shareable Link del deploy caducó el 22-oct.

Auditoría de solo lectura. No se cambió código, ni documentos de Sanity, ni configuración de Vercel o Sanity, ni DNS, ni cuentas de Google.

- **Código:** `main` en `7509dc9`, medido en el worktree `/Users/senavia/Sites/pp-nube` (`docs/auditoria-seo-final` = `main` + un commit de documentación).
- **Build de producción:** `PP_FUENTE=sanity PUBLIC_ES_PRODUCCION=1 PUBLIC_SITE_URL=https://www.pergolaplusflorida.com npm run build` → 218 páginas y 214 URL en el sitemap.
- **Build cerrado:** `PP_FUENTE=sanity npm run build`.
- **Deploy real:** `dpl_DEhurHvxPA2PpTNePrvAz4wUMpxC` (producción, `7509dc9`, READY), leído con un Shareable Link temporal, con OK del chat. Caduca el 22-oct a las 17:53. El enlace se reutilizó, no se creó uno nuevo.
- **Línea base:** https://www.pergolaplusflorida.com, el Webflow antiguo (sitio `63f3b8ea…`). Foto de sus 64 URL tomada hoy.
- **Anexo:** `08-anexo-titulos.md`, con el título, la descripción y el H1 propuestos para las 218 páginas.

---

## 1. Veredicto

**GO CON CONDICIONES.** El SEO del sitio nuevo está listo y es mucho mejor que el del sitio en vivo. Ninguna regresión de SEO impide el cambio.

Pero hoy no se puede cambiar el DNS. Hay seis condiciones, y ninguna es de SEO:

- formularios sin canal de entrega;
- sin analítica ni conversiones de Ads;
- la configuración del día del lanzamiento en Vercel;
- sin política de privacidad;
- términos en español sin revisión legal;
- sin secreto de Turnstile.

Por qué GO en lo que toca al SEO, con datos medidos hoy:

| | Webflow en vivo (hoy) | Sitio nuevo (`dist` de producción) |
|---|---|---|
| URL | 64 | 218 (109 EN + 109 ES) |
| `<link rel="canonical">` | **0 de 64** | 218 de 218, autorreferente |
| JSON-LD | **0 de 64** | 216 bloques que parsean, 9 tipos |
| hreflang | 0 | 109 parejas recíprocas con `x-default` |
| `<title>` duplicados | **23 páginas con «Pergola Plus»** | 0 |
| Descripción vacía | **31 de 64** | 0 de 218 |
| `og:image` | 0 | 218 (JPEG 1200×630 por documento) |
| Las 64 URL antiguas en el deploy real | — | 128/128 (sin y con barra) en ≤ 1 salto a 200, con canonical autorreferente en los 61 destinos |
| Puertas del repo | — | 26/26 en verde (`npm run check`, producción) |
| Rastreo (`crawl.mjs`) | — | 0 canonical mal, 0 hreflang sin recíproco, 0 H1 mal, 0 saltos de encabezado, 0 enlaces rotos, 0 títulos o descripciones duplicados |

Lo que no se puede perder al cambiar el DNS (§3.2):

- **La verificación de Search Console no se pierde**, si se respeta una condición. Está en dos registros DNS TXT (`google-site-verification=wSiY…` y `=P-vX…`), que no dependen de dónde se sirva la web. Solo se pierde si se cambian los nameservers o se borran esos TXT.
- **La medición sí se pierde el mismo día**: GTM, GA4, Google Ads y el píxel de conversión.

---

## 2. Bloqueantes (P0)

Ninguno es de código SEO. Los seis bloquean el lanzamiento por conversión, por medición o por motivos legales.

| # | Hallazgo | Evidencia | Dueño | Cambio exacto |
|---|---|---|---|---|
| P0-1 | **Los formularios devuelven 500**: no hay canal de entrega | Vercel `filter_project_envs`: en producción solo existen `PUBLIC_ES_PRODUCCION` y `PUBLIC_SITE_URL`. No hay `SMTP_*` ni `LEAD_WEBHOOK_URL` | Daniel (buzón y App Password) / Senavia | Vercel → `pergola-plus-preview` → Settings → Environment Variables (Production): `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` y `LEAD_NOTIFY_TO`, o solo `LEAD_WEBHOOK_URL`. Redeploy y un lead real de cada formulario (quote, contact, pie y estimador), en EN y ES |
| P0-2 | **Sin analítica ni conversiones.** El sitio en vivo lleva GTM-TKKRL526, G-HE8WG1NFV9, G-QT4LKRP0GZ y AW-11106946679 en las 64 URL. El nuevo, en 0 | Foto del sitio en vivo (`vivo.json`). `grep -rl googletagmanager src` → 0. La CSP de producción no permite `googletagmanager.com` ni `google-analytics.com` | Senavia + cliente (quién administra GTM y Ads) | 1) Etiqueta GTM en `src/layouts/BaseLayout.astro` (`<head>`, después del charset). 2) `scripts/rutas-vercel.mjs:130` (script-src), `:135` (connect-src) e img-src y frame-src: añadir `https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com`. 3) Banner de consentimiento (Consent Mode v2). 4) La conversión de Ads se dispara en `/thank-you/` y `/es/thank-you/`: hoy son la página de destino del 303 de `/api/lead`. Hay que comprobar en GTM qué disparador usa hoy la conversión de Ads |
| P0-3 | **Configuración de Vercel del lanzamiento** | `get_project`: `ssoProtection: all`, sin dominio propio, `PUBLIC_ES_PRODUCCION=0`. `PUBLIC_SITE_URL` (sensitive) hoy apunta al preview | Senavia | Pasos en orden en §6 |
| P0-4 | **No hay política de privacidad**, y los formularios recogen datos y el consentimiento de SMS | `/es/articles/privacy-policy/` dice en su descripción: «La política de privacidad está pendiente de publicarse». Borrador en `docs/politica-privacidad-borrador.md`, con 5 `[PENDIENTE]` | Cliente / abogado | Contestar los 5 puntos y publicar `legalPage-privacy-policy` en EN y ES. Quitar la regla provisional de `scripts/lib/transformar.mjs` |
| P0-5 | **Términos en español publicados sin revisión legal.** Arrastran los defectos del original («NOTICE TO Customer», «HomeCustomer», el paréntesis sin cerrar) | 06 · C9 | Cliente / abogado | Aprobación escrita, o vaciar `cuerpo.es` de `legalPage-terms-of-service`. Eso retira la página, su hreflang y su entrada del sitemap sin tocar código |
| P0-6 | **Turnstile sin secreto.** Los leads entran con `verificado:false`, y sin SMTP no llega nada | 07 · P0-3. `check:formularios` en verde con secretos de prueba | Daniel / Senavia | Cloudflare → Turnstile → widget del dominio `www.pergolaplusflorida.com` → `TURNSTILE_SECRET_KEY` en Vercel (Production) |

---

## 3. Hallazgos por rol

### 3.1 Rastreo, indexación y arquitectura

| Hallazgo | Evidencia | Sev. | Impacto | Dueño | Cambio exacto |
|---|---|---|---|---|---|
| Rastreo limpio en las 218 | `node scripts/perf/crawl.mjs` → `crawl-resumen.json`: 0 en las 15 métricas de fallo; 216/216 JSON-LD; ciudades con 8 entrantes como mínimo | ✅ | — | — | — |
| `robots.txt` de producción correcto: `Allow`, `Disallow: /api/`, `Sitemap` absoluto; buscadores IA (OAI-SearchBot, PerplexityBot, Claude-SearchBot…) permitidos; los de entrenamiento (GPTBot, ClaudeBot, Google-Extended, CCBot…) bloqueados | `dist/client/robots.txt` | ✅ | — | Cliente (política de IA) | Que el cliente confirme por escrito el bloqueo de los rastreadores de entrenamiento. Es una decisión de negocio (`astro.config.mjs:477`) |
| Modo cerrado correcto: `Disallow: /`, 218/218 con `noindex`, sin sitemap, `llms.txt` ni RSS | Build cerrado + `check:noindex` en verde; en el deploy real, `/sitemap.xml` y `/llms.txt` dan 404 | ✅ | — | — | — |
| El deploy sirve `x-robots-tag: noindex` | `curl -sI` al deploy. Lo añade Vercel a las URL de deployment (`*.vercel.app`), no al dominio propio | Info | Ninguno en el dominio | Senavia | Comprobar el día del lanzamiento que `https://www.pergolaplusflorida.com/` **no** lo lleva |
| **El `lastmod` del sitemap no es fiable**: las 214 URL dicen 21-oct, también los posts, cuyo JSON-LD dice `dateModified` de feb-2026 | `grep lastmod sitemap.xml`: 214 entre 14:59 y 15:07 del 21-oct. La marca `ultimaMigracion` (`src/data/sanity-migracion.json:3`) es de las 13:13, y las escrituras de completado del dataset (C8/C9, 350 documentos) son posteriores | P1 | Google deja de fiarse del `lastmod` si no cuadra con el contenido | Senavia | `src/data/sanity-migracion.json:3` → `"ultimaMigracion": "2026-10-21T15:07:02Z"`. Así solo cuentan las ediciones que vengan después. A medio plazo, que `astro.config.mjs:405` ignore los cambios de campos técnicos (`retocadaConIA`, `sinonimos`) |
| **El silo local está cortado en el condado.** Los 3 condados enlazan a 0 de sus ciudades y ninguna ciudad enlaza a su condado. Las migas van Home › Where We Work › Ciudad | `grep href="/pergolas-contractors/` en `/countries/broward…/` → 0; condados con 3–4 entrantes y marcas con 2–3 (`crawl.csv`) | P1 | Los condados son la página más fuerte para «pergola contractor broward county», y hoy están casi huérfanos | Senavia | 1) `src/pages/countries/[slug].astro`: bloque «Cities we serve in {Condado}» con las ciudades cuya referencia `condado` apunta a ese documento. 2) `src/pages/pergolas-contractors/[slug].astro:51`: migas Home › Where We Work › {Condado} › {Ciudad}, y enlace al condado en el bloque de ciudades vecinas (`enlazarCiudades`, `scripts/lib/transformar.mjs`). 3) Lo mismo en `/es/` |
| Marcas con 2–3 enlaces entrantes | `crawl.csv` | P2 | Bajo | Senavia | Enlazar cada marca desde la ficha de producto que la usa (Apollo y Equinox desde `motorized-louvered-pergolas`, Fenetex desde `motorized-screens`, Renaissance y FORTE desde `open-air` y `solid-roof`) |
| **Slugs de Webflow** (`/countries/` para condados, `/pergolas-contractors/miami-pergola-experts/`, `/about-us/about-us/`) | `docs/redirects.md` | P2 — **no migrar ahora** | Bajo: la keyword va en el título y el H1, y Google pesa poco el slug. Coste: 56 URL nuevas, 112 301 más, una cadena posible con los 64 del dominio y otro mes de reindexación justo encima del cambio de dominio | Senavia + cliente | Recomendación: **no tocarlos en el lanzamiento**. Si a los 3–6 meses Search Console va estable, se valora un único cambio: `/countries/*` → `/service-areas/{broward-county,miami-dade-county,palm-beach-county}/` (3+3 URL, 6 301 en `src/data/redirecciones-dominio.mjs`) y `/about-us/about-us/` → `/about-us/`. Las 25 ciudades se quedan como están: tienen enlaces entrantes del sitio en vivo con ese mismo slug |
| El peso del marcado de Webflow es despreciable | `analiza.mjs`: `data-w-id` = 0,9 % del HTML (home: 1,9 KB en bruto, 0,55 KB en gzip); `data-wf-*`: 17 KB en las 218; reglas `.w-*` en el CSS de la home: 13,6 KB | P2 | Ninguno en el rastreo; mínimo en el rendimiento | Senavia | No es una prioridad. El peso real del HTML es el CSS en línea (§3.6) |
| Cabeceras del deploy: HSTS `max-age=63072000; includeSubDomains; preload`, CSP bloqueante con 15 hashes, `nosniff`, `X-Frame-Options: DENY`, `br`, `_astro` con `immutable` 1 año, imágenes con `max-age=86400` y `stale-while-revalidate`; TTFB de unos 130 ms (iad1) | `curl -sI` al deploy | ✅ | — | — | — |
| 308 de barra final y 404 por idioma | `/products/cabanas` → 308; `/no-existe/` → 404 `lang=en`; `/es/no-existe/` → 404 `lang=es` | ✅ | — | — | — |
| Redirección apex ↔ www: no se puede probar hasta que exista el dominio | No hay dominio en el proyecto | NO CORRIÓ | — | Senavia | Paso 4 de §6 |

### 3.2 Migración desde el Webflow en vivo

Foto de las 64 URL del sitemap en vivo. Todas dan 200, ninguna tiene canonical ni JSON-LD, y llevan `lang="en-US"` sin hreflang. El enlazado interno del sitio en vivo no saca ninguna URL fuera de su sitemap.

| Hallazgo | Evidencia | Sev. | Impacto | Dueño | Cambio exacto |
|---|---|---|---|---|---|
| Las 64 URL: 27 iguales y 37 con 301. En el deploy real, 128/128 (sin y con barra) en ≤ 1 salto a 200, con canonical autorreferente en los 61 destinos | `urls-antiguas.tsv` (100 con 1 salto, 28 con 0); `check:urls-antiguas` en verde | ✅ | Se conserva la autoridad de las URL antiguas | — | Repetir la foto del sitemap en vivo el día antes del cambio (`docs/redirects.md`) |
| **Verificación de Search Console por DNS TXT**: `google-site-verification=wSiY…` y `=P-vX…`. La metaetiqueta del sitio en vivo está mal formada (`content="google-site-verification=P-vX…"`, con el prefijo) | `dig TXT pergolaplusflorida.com`; `<head>` del sitio en vivo | P0 de proceso | Si se cambian los nameservers o se borran los TXT, se pierden la propiedad y su historial | Senavia / quien tenga GoDaddy | **Dejar los NS en GoDaddy** (`ns33/ns34.domaincontrol.com`) y cambiar solo `A @` (hoy `198.202.211.1`, de Webflow) y `CNAME www` (hoy `cdn.webflow.com`). No tocar los TXT ni los MX de Google Workspace (`aspmx.l.google.com`…) |
| GTM, GA4 y Ads | Foto del sitio en vivo | P0-2 | Se pierden la medición y la puja inteligente de Ads | — | §2 |
| No hay datos estructurados que conservar: el sitio en vivo no tiene ninguno | `vivo.json`: `schema` vacío en las 64 | ✅ | El sitio nuevo solo suma | — | — |
| Títulos en vivo: las 10 de proyecto, las 8 de post y las 5 de marca se llaman «Pergola Plus». Las ciudades son casi iguales a las nuevas | `vivo.json` | Info | El sitio nuevo mejora 23 títulos | — | — |
| Enlaces entrantes probables: los 3 anuncios de Ads a `/aluminum-pergolas` ya tienen su 301. Las redes sociales apuntan a la home | `docs/redirects.md`; `siteSettings.redes` | P1 | — | Cliente | Al lanzar, pasar los destinos de los anuncios de Ads a las URL finales (`/products/`, `/products/motorized-louvered-pergolas/`), sin depender del 301 |

### 3.3 On-page y contenido

| Hallazgo | Evidencia | Sev. | Impacto | Dueño | Cambio exacto |
|---|---|---|---|---|---|
| **75 `<title>` de más de 60 caracteres** (29 de más de 70): 58 en EN y 17 en ES. Las 25 ciudades en EN llevan el mismo sufijo de 36 caracteres («\| Custom Aluminum & Louvered Roofs») | `paginas.json` | P1 | Google corta el título y la marca no se ve | Cliente | Las 218 propuestas están en el anexo: **75 → 0** de más de 60. Se cambian en Sanity, `seo.titulo.{en,es}` |
| **H1 sin la keyword** en home («Live Outdoors. Beautifully.»), marcas (solo el nombre: «Apollo»), productos («Cabanas», «Sukkah»), blog («blog & tips», en minúscula) y `/about-us/brands/` («Patio Cover Models Brands»). En ES, `/es/about-us/industries-we-serve/` dice «Comercial Pérgolas para empresas de Florida» (orden roto por un `<span>`) | `paginas.json` | P1 | El H1 es la señal on-page más fuerte después del título | Cliente | Anexo, columna H1. En la home se puede dejar el lema como antetítulo y llevar «Custom Pergolas & Louvered Roofs in South Florida» al H1 (decisión de diseño) |
| 41 descripciones fuera de 110–160 (37 en ES, la más corta de 76) | `paginas.json` | P2 | Fragmento pobre en la SERP en español | Cliente | Anexo: 41 → 14 (las 14 restantes son proyectos ES que hay que ampliar con datos del proyecto) |
| **Canibalización entre posts**: tres posts de «cómo hacer una pérgola» (`plan-pergola…`, `building-custom-pergola…`, `design-build-pergola-process…`); tres de normativa (`pergola-permit…`, `pergola-building-codes…`, `hoa-rules…`); dos de precio (`pergola-cost-south-florida`, `aluminum-pergola-cost-boca-raton-vs-fort-lauderdale`); cuatro de «ideas» (`luxury…`, `poolside…`, `waterfront…`, `modern-outdoor-living-trends…`) | Títulos y H1 del anexo | P1 | Varias URL compiten por la misma consulta y ninguna gana | Cliente (contenido) / Senavia (301) | 1) Fusionar `plan-pergola…` y `building-custom-pergola…` en `design-build-pergola-process…`, con 301 de las dos en `src/data/redirecciones-dominio.mjs` y su gemela `/es/`. 2) Diferenciar las de normativa por intención: el permiso (`pergola-permit`), el código del condado (`building-codes`) y la HOA, con enlaces cruzados. 3) `pergola-cost-south-florida` como pilar de precio, y el post de Boca/Fort Lauderdale enlazando a él |
| Canibalización entre producto, servicio y marca: «louvered roof» lo pelean `/products/motorized-louvered-pergolas/`, `/brands/apollo/`, `/brands/equinox/` y el título de las 25 ciudades; «custom pergola», la home, `/products/` y `/services/pergola-design-construction/` | Títulos actuales | P1 | — | Cliente | Mapa de intención (anexo): la home se queda con «pergola contractor south florida»; `/products/`, con «aluminum pergolas»; la ficha, con «motorized louvered pergola»; las marcas, con su nombre de marca; el servicio, con «custom pergola builder». Las ciudades dejan de llevar «Louvered Roofs» en el título |
| **Contenido duplicado entre ciudades**: un Jaccard medio de 0,84 entre las 28 páginas; un 25 % de texto propio por ciudad y un 10 % por condado; el mismo carrusel de 13 proyectos en las 25. Las 28 usan 10 `og:image` distintas (una la repiten 8 ciudades). **Coral Springs sigue con el hero `wf-placeholder.svg`**, que además es su LCP | `SEO-OPTIMIZATION/06` §2 (mismo contenido de Sanity); `grep fetchpriority` en `dist` | P1 | Riesgo de que Google las trate como «doorway pages». Hoy Miramar y Weston solo se distinguen por el nombre | Cliente (fotos y datos) / Senavia (código) | 1) Foto real de Coral Springs (Sanity `city-coral-springs-installation`, imagen del hero). 2) Que cada ciudad enseñe primero los proyectos de su ciudad o su condado: 6 ciudades tienen un proyecto propio (Boca Raton, Delray Beach ×3, Palm Beach Gardens, West Palm Beach, Jupiter y Wellington con Elan Polo Club). 3) 150–250 palabras locales por ciudad, con barrios, HOA, HVHZ en Miami-Dade y Broward, y su permiso municipal, con datos del cliente (`SEO-OPTIMIZATION/11` §A). 4) Las ciudades de Miami-Dade sin ningún proyecto (Aventura, Doral, Key Biscayne, Sunny Isles…): no crear más páginas así |
| **Huecos de keyword**: hay proyectos en Riviera Beach, Greenacres, Pompano Beach, Hillsboro Beach y Boca Beach, y esas ciudades no tienen página; no hay página de «patio cover» (la segunda consulta del sector tras «pergola»), aunque el sitio en vivo la tiene en el título de la home | Lista de proyectos frente a la de ciudades | P2 | Consultas con proyecto real detrás, sin página que las recoja | Cliente | Páginas de ciudad solo donde haya proyecto: Pompano Beach y Riviera Beach primero. «Patio covers» como sección de `/products/solid-roof-pergolas/`, o una página nueva |
| **E-E-A-T**: la licencia `CGC1539940` sale en las 218 páginas, pero no en el JSON-LD; «Years of Experience» en 105 páginas, sin año de fundación; los posts los firma la organización, sin persona ni fuentes; 28 reseñas de Google transcritas a mano (`siteSettings.resumenResenas`, 29-ago) | `grep CGC`; JSON-LD de los posts. **DBPR (23-oct):** `CGC1539940`, Certified General Contractor, «Current, Active», caduca el 31-08-2028. Titular: **DE HOME VENTURES LLC**, con el cualificador **Eilemberg Hochman, Daniel**. Dirección 980 N. Federal Hwy, Boca Raton, FL 33432, **sin suite**. «Pergola Plus» no aparece en el registro | P1 | Las señales de confianza en el sector de la construcción pesan (YMYL ligero). En Florida, el anuncio de un contratista tiene que corresponder a la entidad con licencia (F.S. 489.119): **el sitio anuncia «Pergola Plus Florida» con una licencia a nombre de DE Home Ventures LLC** | Cliente / abogado / Senavia | 1) Que el cliente o un abogado confirme que «Pergola Plus» es un nombre ficticio registrado (Sunbiz) de DE Home Ventures LLC y que figura en DBPR. Si no, registrarlo. 2) `src/lib/jsonld.ts:64` (`localBusiness`): `hasCredential` (`EducationalOccupationalCredential`, `credentialCategory: "license"`, `recognizedBy`: Florida DBPR) y `foundingDate`. 3) Página de autor (Daniel Eilemberg, o quien firme) y `author` `Person` en `src/pages/post/[slug].astro:98`. 4) Fuentes oficiales (Florida Building Code, condados) enlazadas en los posts de normativa |
| Alt de imágenes: 0 sin alt en las 218. Las copias del marquee tienen `alt=""` (correcto: son decorativas y repetidas). **Falta `og:image:alt` en las 218**, aunque el alt existe en Sanity (`seo.imagenOg.alt`). En **51 documentos el alt del og en español es el texto inglés** | `paginas.json`; GROQ `seo.imagenOg.alt.es == seo.imagenOg.alt.en` → 51 (las 25 ciudades, los 3 condados, 12 proyectos, 5 categorías y 6 páginas) | P2 | Accesibilidad de las tarjetas sociales; descuido visible en ES | Senavia (código) / cliente (textos) | 1) `src/layouts/BaseLayout.astro:216`: añadir `<meta property="og:image:alt">` y `twitter:image:alt` con el alt del idioma de la página. 2) Traducir los 51 `seo.imagenOg.alt.es` en Sanity |
| Nombres de fichero de las imágenes descriptivos (`gallery-aluminum-carport-builders-south-florida-01.avif`) | `sanity.imageAsset.originalFilename` | ✅ | — | — | — |
| **Español de España, no de Florida**, en textos visibles: «hormigón» ×238 (Florida dice «concreto»: hay 15), «vallado/valla» ×326 («cerca»), «coche» ×293 («auto»), «Contacte con» ×110 («Contáctenos»), «móvil» ×13 («celular»), «cerramiento» ×462 (en Florida se dice «screen enclosure»); «Boca Ratón» ×83 frente a «Boca Raton» ×135 en la misma web | Conteo sobre el texto de `/es/` (`dist`) | P1 | Las búsquedas en español del sur de Florida usan el léxico local; además suena extranjero al cliente hispano | Cliente (aprueba) / Senavia (aplica) | Glosario de reemplazos en Sanity (`secciones[*].textos[*].texto.es`, `faq`, `post.cuerpo.es`) y en `src/i18n/comun.es.ts`: hormigón → concreto; vallado/valla → cerca; entrada de coche → entrada de autos (o «driveway»); Contacte con → Contáctenos; móvil → celular; adoquinado → pavers (como se dice en Florida); Boca Ratón → Boca Raton (es el nombre oficial). Se aplica con un script y export previo, **con el webhook desactivado** (cada escritura lanza un deploy) |
| Cifras de los 21 posts en español sin validar; términos legales en traducción de cortesía | `docs/estado-final.md`; 07 · P1-3 | P1 / P0-5 | — | Cliente / abogado | — |

### 3.4 Datos estructurados

`check:jsonld` y `check:og` en verde. Tipos en el build: BreadcrumbList 214, Service 70, BlogPosting 42, FAQPage 36 (114 preguntas), Product 20, Blog 12, HomeAndConstructionBusiness 4, WebSite 2, CollectionPage 2.

| Hallazgo | Evidencia | Sev. | Impacto | Dueño | Cambio exacto |
|---|---|---|---|---|---|
| **20 `Product` sin `offers`, `review` ni `aggregateRating`** | `src/lib/jsonld.ts:160`. **Confirmado en el Rich Results Test (23-oct, código de `/products/cabanas/`):** «Product snippets: 1 invalid item», con el fallo crítico «Either "offers", "review", or "aggregateRating" should be specified». Search Console marcará las 20 fichas igual | P1 | Errores visibles en Search Console y ningún resultado enriquecido posible | Senavia | Cambiar el `@type` de `producto()` a `Service` (o a `["Product","Service"]` sin pedir el resultado enriquecido), con `provider: refNegocio(site)` y `areaServed`. Lo más honesto: son instalaciones a medida, no productos con precio. Mantener `additionalProperty` |
| **42 BlogPosting con `dateModified` anterior a `datePublished`** (p. ej. `hoa-rules…`: publicado 23:00:35, modificado 22:51:04) | Recuento sobre el build; `src/pages/post/[slug].astro:91-92` y `src/pages/es/post/[slug].astro:112-113` | P2 | Fechas incoherentes; un validador lo puede avisar | Senavia | `dateModified: new Date(Math.max(post.publicado, post.actualizado)).toISOString()` en los dos ficheros |
| `author` y `publisher` como `Organization` con el mismo `@id` que el `HomeAndConstructionBusiness` (`/#negocio`) | JSON-LD del post | P2 | Dos tipos para un mismo nodo | Senavia | Referenciar solo `{"@id": ".../#negocio"}` en `author` y `publisher`, sin redefinir el tipo (`src/lib/blog.ts`, `organizacion()`) |
| Falta en la entidad: `image`, `geo`, `priceRange`, `hasCredential`, `foundingDate`. **`address` sin «Suite 110»**, que sí está en BBB y en `siteSettings.direccion.suite` | `localBusiness()` en `src/lib/jsonld.ts:64`; `siteSettings` | P1 | NAP incoherente con BBB y, seguramente, con GBP | Cliente (confirma la dirección) / Senavia | Ver §3.9. Si GBP muestra la suite, `siteSettings.direccion.suiteEnTodoElSitio = true` y `streetAddress` con «Suite 110». `image` = el og por defecto (JPEG) |
| Review y AggregateRating: **no añadirlos** | Las reseñas son de Google, transcritas: marcar en el propio sitio las reseñas de terceros como `aggregateRating` del negocio va contra las directrices de Google (*self-serving reviews*) | — | Evita una acción manual | — | Mantener sin ellos |
| `areaServed` por ciudad: ya es `City` con `containedInPlace` del condado y del estado | JSON-LD de la ciudad | ✅ | — | — | — |
| `sameAs` (4 redes) y `logo` PNG 512×512 | JSON-LD de la home | ✅ | — | Cliente | Añadir la URL de la ficha de Google (`siteSettings.resumenResenas.fichaGoogle`) y BBB a `siteSettings.redes` |
| Imagen del BlogPosting en AVIF | Las 42 | P2 | Google la acepta. El resto de plataformas que leen el JSON-LD, no siempre | Senavia | Usar el JPEG de `seo.imagenOg`, como en `og:image` (`src/pages/post/[slug].astro:89`) |
| **validator.schema.org (23-oct)**: home EN y ES, ficha (Cabanas), servicio (Pavers), ciudad (Miami), condado (Broward), post (HOA) y FAQ | `POST https://validator.schema.org/validate` con el HTML del `dist` de producción | ✅ **0 errores y 0 avisos** en las 8 | — | — | — |
| **Rich Results Test (23-oct, modo código)**: Product + FAQ + migas (Cabanas), y BlogPosting + migas (post HOA) | search.google.com/test/rich-results | Product 🔴 (T4); Articles ✅; Breadcrumbs ✅ | El FAQPage **no sale** como resultado elegible: desde 2023 Google solo muestra resultados enriquecidos de FAQ en sitios oficiales y de salud. El marcado no hace daño, pero no dará estrellas ni desplegables | Senavia | Mantener el `FAQPage` (lo leen otros motores e IA) sin esperar resultados enriquecidos. Repetir la prueba por URL el día 0 (paso 8 de §6) |

### 3.5 Internacional (EN/ES)

| Hallazgo | Evidencia | Sev. | Impacto | Dueño | Cambio exacto |
|---|---|---|---|---|---|
| 109 parejas recíprocas con `x-default`; `lang` y `og:locale` `es_US` / `en_US`, con su `og:locale:alternate`; selector de idioma en las 109 | `check:i18n` en verde; `crawl-resumen.json`; build: «7763 enlaces internos apuntados al español en 109 páginas» | ✅ | — | — | — |
| Un documento nuevo sin texto `es` sale en `/es/` **con el texto inglés**, porque `enIdioma` cae al EN (`src/lib/sanity/fuente.mjs:214`). Y el build de Vercel no ejecuta `check:i18n` (§3.7) | Código | P1 | Páginas ES medio en inglés en cuanto el cliente cree contenido | Senavia | Ver §3.7: que las puertas corran en el build de Vercel |
| **Keywords propias en español.** Hoy el ES es una traducción, con el léxico de España (§3.3) | — | P1 | Las búsquedas hispanas del sur de Florida mezclan las dos lenguas: «techo de aluminio», «pérgola precio», «carport», «screen enclosure», «pavers», «cotización» | Cliente / Senavia | Mapa de keywords ES con datos reales (Search Console del dominio a 4 semanas, o Ahrefs o Semrush, hoy sin acceso) y títulos ES por consulta, no por traducción. Primera tanda en el anexo (ciudades y servicios) |

### 3.6 Rendimiento y Core Web Vitals

Lighthouse 13.5, 3 corridas por plantilla y dispositivo (16 × 2 × 3 = 96 por superficie), mediana y nunca la mejor. 0 fallos de ejecución.

- **Local:** `dist` de producción servido por `scripts/perf/servir.mjs` con las cabeceras de `config.json`.
  - Se repitieron las 32 corridas con `diagnostics.rtt` > 0,1; quedan 25 que siguen con ruido de CPU (todas móviles).
  - Las medianas coinciden con las de C3 (06) al milisegundo en LCP: el modelo simulado es determinista y el ruido mueve 1 punto como mucho.
- **Deploy real** (`dpl_DEhur…`, con el Shareable Link): Vercel, `iad1`, medido desde Florida.
  - Aquí `rtt` vale unos 20 ms en las 96. Es la latencia real de red, no ruido: el umbral de 0,1 de la memoria del proyecto vale para localhost (0,02 ms).
  - **SEO = 0 en las 96, y es lo esperado:** el deploy está en modo cerrado, con `noindex`, `Disallow` y el `x-robots-tag` de Vercel. El SEO se lee en la columna local.

| Plantilla | Disp. | Perf local (3 corridas) | Perf deploy (3 corridas) | A11y | BP (local/deploy) | SEO local | LCP ms local → deploy | CLS máx local / deploy | TBT ms deploy | KB | KB imágenes a mejorar |
|---|---|---|---|---|---|---|---|---|---|---|---|
| home | mobile | 95/95/95 | 99/99/99 | 100 | 100/100 | 100 | 2928 → 1955 | 0 / **0,012** | 48 | 460 | 9 |
| home | desktop | 100/100/100 | 100/100/100 | 100 | 100/100 | 100 | 583 → 454 | 0 / 0,001 | 0 | 715 | 127 |
| home-es | mobile | 95/95/96 | 99/99/99 | 100 | 100/100 | 100 | 2853 → 1847 | 0 / **0,016** | 0 | 461 | 9 |
| home-es | desktop | 100/100/100 | 100/100/100 | 100 | 100/100 | 100 | 583 → 460 | 0 / 0,002 | 0 | 716 | 126 |
| productos-indice | mobile | 99/99/99 | 98/100/100 | 100 | 100/100 | 100 | 2026 → 1582 | 0 / 0 | 0 | 398 | 0 |
| productos-indice | desktop | 100/100/100 | 100/100/100 | 100 | 100/100 | 100 | 522 → 477 | 0 / 0,002 | 0 | 688 | 174 |
| producto | mobile | 99/99/99 | 100/100/100 | 100 | 100/100 | 100 | 2177 → 1562 | 0 / 0,001 | 0 | 283 | 28 |
| producto | desktop | 100/100/100 | 100/100/100 | 100 | 100/100 | 100 | 584 → 515 | 0 / 0,009 | 0 | 374 | 17 |
| servicios-indice | mobile | 99/99/99 | 100/100/100 | 100 | 100/100 | 100 | 2026 → 1618 | 0 / 0 | 0 | 437 | 22 |
| servicios-indice | desktop | 100/100/100 | 100/100/100 | 100 | 100/100 | 100 | 423 → 412 | 0 / 0 | 0 | 656 | 209 |
| servicio | mobile | 98/98/98 | 100/99/100 | 100 | 100/100 | 100 | 2329 → 1787 | 0 / 0 | 32 | 585 | 47 |
| servicio | desktop | 100/100/100 | 100/100/100 | 100 | 100/100 | 100 | 483 → 413 | 0 / 0,005 | 0 | 692 | 63 |
| ciudad | mobile | 96/97/97 | 99/100/100 | 100 | 100/100 | 100 | 2627 → 1791 | 0 / 0,001 | 35 | 605 | 110 |
| ciudad | desktop | 99/99/99 | 100/100/100 | 100 | 100/100 | 100 | 862 → 617 | 0 / 0 | 0 | 731 | **221** |
| condado | mobile | **93/94/93** | 99/99/97 | 100 | 100/100 | 100 | **3152** → 2038 | 0 / 0,001 | 34 | 597 | 92 |
| condado | desktop | 100/100/100 | 100/100/100 | 100 | 100/100 | 100 | 742 → 538 | 0 / 0,002 | 0 | 592 | 192 |
| proyecto | mobile | 97/97/97 | 100/100/100 | 100 | 100/100 | 100 | 2627 → 1729 | 0 / 0,008 | 0 | 364 | 60 |
| proyecto | desktop | 100/100/100 | 100/100/100 | 100 | 100/100 | 100 | 762 → 639 | 0 / 0,001 | 0 | 594 | 177 |
| galeria | mobile | 99/99/99 | 98/100/99 | 100 | 100/100 | 100 | 2026 → 1848 | 0 / 0 | 4 | 449 | 38 |
| galeria | desktop | 100/100/100 | 100/100/100 | 100 | 100/100 | 100 | 583 → 506 | 0 / 0,002 | 0 | 738 | 120 |
| post | mobile | 99/99/99 | 97/100/100 | 100 | 100/100 | 100 | 1876 → 1640 | 0 / 0 | 9 | 175 | 0 |
| post | desktop | 100/100/100 | 100/100/100 | 100 | 100/100 | 100 | 482 → 468 | 0 / 0,002 | 0 | 209 | 0 |
| blog-indice | mobile | 99/98/98 | 100/100/100 | 100 | 100/100 | 100 | 2253 → 1584 | 0 / 0 | 0 | 433 | 0 |
| blog-indice | desktop | 100/100/100 | 100/100/100 | 100 | 100/100 | 100 | 482 → 420 | 0 / 0,003 | 0 | 492 | 21 |
| blog-categoria | mobile | 98/98/98 | 100/100/100 | 100 | 100/100 | 100 | 2402 → 1859 | 0 / 0 | 0 | 432 | 0 |
| blog-categoria | desktop | 100/100/100 | 100/100/100 | 100 | 100/100 | 100 | 503 → 453 | 0 / 0 | 0 | 474 | 52 |
| faq | mobile | 100/100/100 | 100/100/100 | 100 | 100/100 | 100 | 1651 → 1550 | 0 / 0 | 0 | 148 | 0 |
| faq | desktop | 100/100/100 | 100/100/100 | 100 | 100/100 | 100 | 382 → 421 | 0 / 0 | 0 | 148 | 0 |
| contacto-quote | mobile | 95/99/99 | **90/94/94** | 100 | **96/96** | 100 | 1802 → **3054** | 0 / 0,004 | 0 | 1064 | 133 |
| contacto-quote | desktop | 100/100/100 | 100/100/100 | 100 | **96/96** | 100 | 602 → 761 | 0 / 0 | 0 | 1059 | 112 |
| estimador | mobile | 99/99/99 | 99/100/100 | 100 | 100/100 | 100 | 2178 → 1521 | 0 / 0 | 34 | 356 | 126 |
| estimador | desktop | 100/100/100 | 100/100/100 | 100 | 100/100 | 100 | 443 → 452 | 0 / 0 | 0 | 356 | 79 |

Lectura:

- **El deploy real va mejor que la simulación local** en LCP móvil (≈ −0,6 a −1,1 s). El LCP móvil queda entre 1,5 y 2,0 s en 15 de 16 plantillas: la «deuda» de 2–3 s de los informes previos es del modelo local, no de Vercel. La excepción es el contacto (3,05 s, por Turnstile).
- **A11y 100 en las 192 corridas.** BP 100 salvo contacto (96: `TurnstileError 600010`, porque el sitekey no admite el host `*.vercel.app` ni `localhost`). Debería desaparecer en el dominio autorizado: comprobarlo el día 0.
- **CLS en el deploy:** 0,012 en la home y 0,016 en la home ES, en móvil. Muy por debajo de 0,1, pero en local era 0.
  - Home: `section.hero-video-main … div.w-layout-blockcontainer`.
  - Home ES: `section.products … div.header-products > div`.
  - Con red real, algo del hero y de la cabecera de productos se pinta antes de su estado final. Con `scripts/perf/cls-estimador.mjs` adaptado a esas dos rutas se reproduce de forma determinista (P2).
- **«Imágenes a mejorar»:** ciudad en escritorio (221 KB), servicios-índice (209), condado (192), proyecto (177) y productos-índice (174). Son las rejillas de galería y de tarjetas.

| Hallazgo | Evidencia | Sev. | Impacto | Dueño | Cambio exacto |
|---|---|---|---|---|---|
| **El CSS en línea pesa el 38–50 % del HTML** (home: 80 KB de 209 KB; post: 62 de 123) y se descarga en cada página, sin caché. Sin uso en cada página, un 11–15 % | `analiza.mjs`; la home pesa 39 KB en gzip, y 22 KB sin el CSS | P2 | En una segunda visita se repiten unos 17 KB en gzip por página | Senavia | Probar con sonda y diff: CSS común en `/_astro/base.[hash].css` (caché `immutable`) + CSS crítico de la página en línea. Lo decide el diff visual (`scripts/perf/diff-visual.mjs`) |
| FAQ: 346 KB de HTML (65 KB en gzip) | `paginas.json` | P2 | — | Senavia | Paginar por tema o cargar las respuestas largas bajo demanda. Las 249 preguntas en un solo HTML no ayudan al rastreo |
| 180 imágenes del CMS sin uso (28,1 MB) en `public/cms-img` | `check:imagenes` (AVISO) | P2 | Peso del repo y del deploy, no de la página | Cliente (es su histórico) / Senavia | Moverlas a `assets-migracion/` (fuera de `public/`) con su manifiesto |
| Galerías con «imágenes a mejorar» (hasta 221 KB por página) | 06 · C3 | P2 | LCP en móvil | Senavia | `sizes` real de las rejillas de galería en `scripts/lib/transformar.mjs` (`responsivizarImagenes`) |
| Turnstile, unos 750 KB externos en `/contact-us/get-a-quote/` y su gemela | `src/components/PaginaContacto.astro:107` | P2 | LCP y TBT de las páginas de captación | Senavia | Cargar `api.js` al primer `focus` del formulario (render explícito con `turnstile.render`) |
| Speed Insights y Web Analytics de Vercel (Pro) desactivados | No hay paquete `@vercel/speed-insights` en el repo | P1 | CWV de campo desde el primer día; Search Console tarda 28 días | Senavia | Activarlos en el panel (Speed Insights → Enable) y añadir `@vercel/speed-insights` al layout. Ajustar la CSP: `connect-src` + `/_vercel/speed-insights/*` (mismo origen). Ojo con el banner de consentimiento |

### 3.7 Sanity como CMS de SEO

`check:sanity-esquema` (0 errores, 139 avisos), `check:sanity-cobertura` y `check:sanity-fidelidad` en verde. Dataset: 869 documentos, 0 borradores; 112 con `seo`, todos con `titulo.en`, `descripcion.en` e `imagenOg` con alt.

| Hallazgo | Evidencia | Sev. | Impacto | Dueño | Cambio exacto |
|---|---|---|---|---|---|
| Campos SEO por documento: `seo.titulo`, `seo.descripcion` y `seo.imagenOg` (los lee el build: `itemDe`, `src/lib/sanity/fuente.mjs:200`). Avisos de longitud (60 y 160) y del alt obligatorio | `studio/schemas/objetos.ts:145-181` | ✅ | — | — | — |
| **`seo.indexable` («Visible en buscadores») no lo lee el build**: el editor lo apaga y la página sigue indexable y en el sitemap | `grep -rn indexable src scripts/lib astro.config.mjs` → solo `BaseLayout.astro:151` (la variable de entorno). Hoy vale `false` en 5 documentos | P1 | Un editor cree que ha sacado una página de Google y no es así | Senavia | En cada `[slug].astro` y en las estáticas, pasar `noindex={doc?.seo?.indexable === false}` a `BaseLayout`. El sitemap ya excluye las páginas con `noindex` (`astro.config.mjs:422`) |
| **El build de Vercel no ejecuta ninguna puerta**: `"build"` = `instantanea` + `astro build` + `rutas-vercel`. Cada publicación en Sanity va directa a producción sin `check:seo`, `check:i18n`, `check:jsonld` ni `check:enlaces`. No hay CI (sin `.github/workflows`) | `package.json:10` | P1 | Un documento roto (enlace, alt, ES vacío) se publica sin avisar | Senavia | Script `build:vercel` = `build` + las puertas rápidas sin red (`check:seo`, `check:noindex`, `check:i18n`, `check:jsonld`, `check:og`, `check:canonicos`, `check:enlaces`, `check:urls-antiguas`) y fijarlo como Build Command en Vercel. Si falla, Vercel no promueve el deploy y sigue el anterior |
| Faltan: canonical personalizado, previsualización SERP y redirecciones gestionadas desde el CMS | Esquema | P2 | `slugFijo` (`studio/schemas/objetos.ts:366`) es de solo lectura **solo en los documentos migrados**. En uno nuevo, el editor puede cambiar el slug después de publicarlo y la URL vieja da 404, sin 301 | Senavia | 1) Tipo `redirect` (`desde`, `hasta`, `permanente`) que lea `scripts/rutas-vercel.mjs` junto a `redirecciones-dominio.mjs`. 2) Vista previa SERP (título y descripción cortados a 580 px) como componente de entrada del objeto `seo`. 3) Canonical personalizado: no hace falta, todas las páginas son únicas |
| 80 avisos «Field 'retocadaConIA' does not exist on type 'imagenCuerpo'» | `check:sanity-esquema` | P2 | El editor ve «campo desconocido» en las imágenes del cuerpo de los posts | Senavia | Añadir `retocadaConIA` al tipo `imagenCuerpo` en `studio/schemas/objetos.ts`, o retirar el campo de esos 80 objetos (con export previo y el webhook desactivado) |
| Flujo del editor: una ciudad nueva se pinta con `plantilla-city` y entra sola en el sitemap, hreflang y `enlazarCiudades` (`src/pages/pergolas-contractors/[slug].astro:20-22`); cambiar una foto la descarga el build (`instantanea.mjs`) y genera AVIF y derivados; el HTML usa 0 URL de `cdn.sanity.io` | Código; `grep -c cdn.sanity.io dist` → 0 | ✅ en código | — | — | **NO CORRIÓ de extremo a extremo** (crear y publicar escribe en producción). Se probó el 21-oct en C5 con `prueba-nube-webhook` |
| Webhooks: «Vercel producción · main» entrega bien (201 a las 18:45 y 18:49 UTC); «Vercel preview · entrega/cms-sanity-nube» sigue en la lista, con sus envíos cancelados | `npx sanity hook list` y `hook logs` | P2 | Ruido; si alguien lo reactiva, construye una rama muerta | Senavia | Borrarlo en sanity.io/manage → API → Webhooks |
| Tokens: `website_token_setting` (Access Manager, Deploy Studio, Editor; **no caduca**) y `migracion-nube-2026-10-21` (Editor, caduca el 20-nov) | `npx sanity tokens list` | P1 | Un token de administración sin caducidad y sin uso conocido: el build lee el dataset público sin token | Sebastian | Revocar los dos en sanity.io/manage → API → Tokens. Si algo usa el primero, rotarlo con rol Viewer |
| Miembros: 2 administradores (Daniel y Sebastian) + los 2 robots. CORS: solo `http://localhost:3333` (el Studio alojado no lo necesita) | `npx sanity users list`, `cors list` | ✅ | — | — | — |
| **Dataset público**: expone 869 documentos. Sin datos personales de leads (los leads no van a Sanity), con nombre y texto de 28 reseñas (ya públicas en Google), teléfonos y correo públicos. 0 assets con EXIF o geolocalización | GROQ `count(*)`, `metadata.location` → 0 | ✅ | — | — | Mantenerlo así. No guardar nunca leads ni notas internas en este dataset |
| **Sin copias de seguridad** (plan Free) | `npx sanity backup list production` → «No backups found» | P1 | Un borrado en masa no tiene vuelta atrás salvo los exports locales | Senavia | Tarea semanal: `npx sanity dataset export production pp-AAAA-MM-DD.tar.gz` a un almacenamiento fuera del Mac (Drive o Blob), o pasar a Growth |

### 3.8 Vercel e infraestructura

| Hallazgo | Evidencia | Sev. | Impacto | Dueño | Cambio exacto |
|---|---|---|---|---|---|
| Proyecto `pergola-plus-preview` (team `senaviacorp`, Pro), Node 24.x, rama de producción `main`, último deploy de producción `7509dc9` READY | `get_project`, `list_deployments` | ✅ | — | — | — |
| Variables de producción: solo `PUBLIC_ES_PRODUCCION=0` (con comentario) y `PUBLIC_SITE_URL` (sensitive). En preview, ninguna | `filter_project_envs` | P0-1/3/6 | — | Senavia | §6 |
| Protección: `ssoProtection: all`; contraseña desactivada; sin IP de confianza | `get_project` | P0-3 | Con SSO en `all`, el dominio propio también exige iniciar sesión | Senavia | Paso 5 de §6: `ssoProtection` → «Standard Protection» (protege solo las URL de deployment, no el dominio) |
| Firewall: sin configuración propia | `get_firewall_config` → 404 «Config not found» | P2 | `/api/lead` sin límite de peticiones; Turnstile es la única barrera | Senavia | Regla de rate limit en `/api/lead` (p. ej. 10 por minuto e IP) en Vercel Firewall |
| El nombre del proyecto es `pergola-plus-preview`, y va a servir producción | — | P2 | Confusión operativa | Senavia | Renombrarlo después del lanzamiento (Settings → General). No cambia las URL del dominio |
| Formularios: con P0-1 abierto, el visitante ve un error con el teléfono. Para Google no cambia nada (el endpoint es POST y está fuera de `robots.txt`), pero se pierden conversiones y la señal de Ads | `docs/estado-final.md` | P0-1 | — | — | — |

### 3.9 SEO local

| Hallazgo | Evidencia | Sev. | Impacto | Dueño | Cambio exacto |
|---|---|---|---|---|---|
| **NAP incoherente entre fuentes.** El sitio dice «Pergola Plus Florida, 980 N Federal Hwy, Boca Raton, FL 33432», sin suite, con (561) 710-8363 y (561) 292-5054. BBB lista «**Pergola Plus Corp.**, 980 N Federal Hwy **STE 110**». Facebook es «Pergola-Plus-Corp». Los términos dicen «PERGOLA PLUS CORP» y «Pergola Plus Florida LLC» | `siteSettings`; búsqueda web (BBB, Lantern); 06 · C9 | P1 | Las citas incoherentes debilitan la ficha local | Cliente | Fijar un NAP canónico (razón social, nombre comercial, suite sí o no, un teléfono principal) y aplicarlo en GBP, BBB, Facebook, Houzz, Yelp y Angi, en el sitio (`siteSettings.direccion.suiteEnTodoElSitio`, `telefonoPrincipal`) y en el JSON-LD |
| **La suite 110 de 980 N Federal Hwy la anuncia un proveedor de oficinas virtuales** | Búsqueda web: Alliance Virtual Offices, «980 N Federal Hwy Suite 110» | P1 (riesgo) | Google no acepta una oficina virtual como dirección visible de un GBP: riesgo de suspensión de la ficha | Cliente | Confirmar si es una oficina con personal en horario. Si no lo es, configurar GBP como negocio de área de servicio (dirección oculta) y quitar `address` del JSON-LD, dejando `areaServed` |
| Google Business Profile: categoría, servicios, enlace y reseñas | Sin acceso | **NO CORRIÓ** | — | Cliente | Dar acceso de administrador a `sebastian@senaviacorp.com`. Categoría principal recomendada: «Pergola contractor» o «Patio enclosure supplier» (a validar en la ficha); el enlace al sitio, con UTM; credenciales de la API para `scripts/traer-resenas.mjs` |
| Citas: no se encontraron perfiles de Yelp, Houzz ni Angi en una búsqueda; BBB sí, sin valoración visible | Búsqueda web | P2 | — | Cliente | Reclamar Houzz (clave en el sector), Yelp y Angi con el NAP canónico |
| Páginas de ciudad frente a la zona de servicio real | §3.3 | P1 | — | Cliente | Confirmar en qué ciudades se trabaja de verdad. Las de Miami-Dade, sin un solo proyecto, son las más débiles |

---

## 4. Backlog de optimización (P1 y P2), por impacto

### 4.1 Técnico · aprueba Senavia

| # | Sev. | Cambio | Fichero:línea o ajuste | Impacto | Riesgo |
|---|---|---|---|---|---|
| T1 | P1 | Puertas en el build de Vercel (`build:vercel`) | `package.json:10` + Vercel → Build Command | Alto: protege cada publicación | Un fallo bloquea el deploy, que es lo que se quiere |
| T2 | P1 | `seo.indexable` leído por el build | `[slug].astro` de cada tipo → `noindex` de `BaseLayout` | Alto | Bajo |
| T3 | P1 | Silo de condado: lista de ciudades en el condado, enlace ciudad → condado y migas con el condado | `src/pages/countries/[slug].astro`, `src/pages/pergolas-contractors/[slug].astro:51`, `scripts/lib/transformar.mjs` (`enlazarCiudades`), lo mismo en `/es/` | Alto (local) | Cambio visible pequeño: el cliente lo ve |
| T4 | P1 | `Product` → `Service` en las fichas | `src/lib/jsonld.ts:136-178` | Medio: evita 20 errores en Search Console | Bajo |
| T5 | P1 | `lastmod` fiable: mover la marca | `src/data/sanity-migracion.json:3` → `2026-10-21T15:07:02Z` | Medio | Ninguno |
| T6 | P1 | `hasCredential`, `foundingDate`, `image` y suite (según §3.9) en la entidad | `src/lib/jsonld.ts:64-93` | Medio (E-E-A-T) | Solo con datos confirmados |
| T7 | P1 | Speed Insights y Web Analytics | Panel de Vercel + layout + CSP (`scripts/rutas-vercel.mjs:130-135`) | Medio | Consentimiento |
| T8 | P1 | Copia semanal del dataset | Tarea programada `sanity dataset export` | Alto si pasa algo | — |
| T9 | P1 | Revocar los 2 tokens y borrar el webhook viejo | sanity.io/manage | Seguridad | — |
| T10 | P2 | `og:image:alt` y `twitter:image:alt` | `src/layouts/BaseLayout.astro:216-217` | Bajo | — |
| T11 | P2 | `dateModified` ≥ `datePublished` | `src/pages/post/[slug].astro:92`, `src/pages/es/post/[slug].astro:113` | Bajo | — |
| T12 | P2 | `author` y `publisher` por `@id` | `src/lib/blog.ts` (`organizacion`) | Bajo | — |
| T13 | P2 | Turnstile al primer `focus` | `src/components/PaginaContacto.astro:107` | Medio en las páginas de captación | Probar el antibot con los secretos de prueba (`check:formularios`) |
| T14 | P2 | CSS común en un fichero con caché | `scripts/lib/transformar.mjs` (unión del CSS) | Bajo y medio | Diff visual de las 218 |
| T15 | P2 | Rate limit de `/api/lead` | Vercel Firewall | Spam | — |
| T16 | P2 | Tipo `redirect` en Sanity y vista previa SERP | `studio/schemas`, `scripts/rutas-vercel.mjs` | Medio a largo plazo | — |
| T17 | P2 | `retocadaConIA` en `imagenCuerpo` | `studio/schemas/objetos.ts` | Bajo | — |
| T18 | P2 | Sacar las 180 imágenes sin uso de `public/` | `public/cms-img` → `assets-migracion/` | Deploy más ligero | `check:imagenes` |
| T19 | P2 | FAQ por temas | `src/pages/resources/faq/` | Bajo | Cambio visible |
| T20 | P2 | Renombrar el proyecto de Vercel | Settings → General | Operativo | — |

### 4.2 Texto y diseño visible · aprueba el cliente

| # | Sev. | Cambio | Dónde | Impacto |
|---|---|---|---|---|
| C1 | P1 | 75 títulos a ≤ 60 caracteres, con la keyword delante | Anexo → Sanity `seo.titulo` | Alto: CTR |
| C2 | P1 | H1 con la keyword en home, marcas, productos, blog y `/about-us/brands/`, y el H1 roto de `/es/about-us/industries-we-serve/` | Anexo → Sanity, textos del hero | Alto |
| C3 | P1 | Glosario del español de Florida (concreto, cerca, auto, Contáctenos, celular, pavers, Boca Raton) | Sanity + `src/i18n/comun.es.ts` | Alto en ES |
| C4 | P1 | Fusionar los 3 posts de «cómo hacer una pérgola» y diferenciar los de normativa y precio | Sanity `post` + 301 en `src/data/redirecciones-dominio.mjs` | Medio-alto |
| C5 | P1 | Contenido local por ciudad (150–250 palabras con datos reales) y proyectos de la propia ciudad primero | Sanity `city.secciones` | Alto en local |
| C6 | P1 | Foto real del hero de Coral Springs | Sanity `city-coral-springs-installation` | Medio (hoy es un cuadro gris) |
| C7 | P1 | Autor con nombre en los posts y fuentes oficiales en los de normativa | Sanity `post` + página de autor | Medio (E-E-A-T) |
| C8 | P2 | 41 descripciones a 110–160 | Anexo → Sanity `seo.descripcion` | Bajo-medio |
| C9 | P2 | Traducir los 51 `seo.imagenOg.alt.es` | Sanity | Bajo |
| C10 | P2 | Páginas nuevas solo donde haya proyecto: Pompano Beach y Riviera Beach; y «patio covers» | Sanity `city`, `product` | Medio |
| C11 | P2 | Slugs `/countries/` → `/service-areas/`, a los 3–6 meses, no en el lanzamiento | §3.1 | Bajo |
| C12 | P2 | Validar las cifras de los 21 posts en español | Sanity `post.cuerpo.es` | Confianza |

### 4.3 Legal y cuentas

| # | Sev. | Qué | Dueño |
|---|---|---|---|
| L1 | P0 | Política de privacidad EN/ES (P0-4) | Cliente / abogado |
| L2 | P0 | Términos ES aprobados o retirados (P0-5) | Cliente / abogado |
| L3 | P1 | Corregir el original inglés de los términos («NOTICE TO OWNER», «homeowner», el paréntesis, la frase sin sujeto, «PERGOLA PLUS CORP» frente a «Pergola Plus Florida LLC») | Abogado |
| L4 | P1 | NAP canónico y la suite 110 (§3.9) | Cliente |
| L5 | P1 | Acceso a Search Console, GA4, GTM, Ads y GBP para `sebastian@senaviacorp.com` | Cliente |
| L6 | P1 | ~~Confirmar la licencia en DBPR~~ Verificada el 23-oct: activa hasta el 31-08-2028, **a nombre de DE HOME VENTURES LLC**. Confirmar que «Pergola Plus» / «Pergola Plus Florida» está registrado como nombre ficticio de esa LLC y vinculado a la licencia (F.S. 489.119), y usar la razón social correcta en los términos (hoy dicen «PERGOLA PLUS CORP» y «Pergola Plus Florida LLC») | Cliente / abogado |
| L7 | P2 | Política de rastreadores de IA (entrenamiento bloqueado) aprobada por escrito | Cliente |

---

## 5. Puertas y comprobaciones

| Comprobación | Resultado | Causa o nota |
|---|---|---|
| `npm run build` (producción) | ✅ | 218 páginas, 214 URL en el sitemap, CSP con 15 hashes |
| `npm run check` (26 puertas, producción, `PUERTO_FORMULARIOS=4351`) | ✅ 26/26, exit 0 | Avisos: 46 títulos fuera de 30–65 (`check:seo`); 180 imágenes sin uso (`check:imagenes`); 139 avisos de esquema |
| `check:sanity-fidelidad` | ✅ | Como en C2, no compara «propias, faqs, blog» (editados a propósito después de la marca) |
| Build cerrado + `check:noindex` | ✅ | 218/218 `noindex`, `Disallow: /`, sin sitemap, `llms.txt` ni RSS |
| `crawl.mjs` | ✅ | 0 fallos en las 15 métricas |
| JSON-LD (recuento propio) | 🔴 2 hallazgos | 20 `Product` sin `offers` (T4); 42 `dateModified` < `datePublished` (T11) |
| HTML servido = build | ✅ | 5 plantillas: solo cambia el host |
| 64 URL antiguas en el deploy (128 peticiones) | ✅ 128/128 | ≤ 1 salto, canonical autorreferente |
| Cabeceras del deploy | ✅ | HSTS, CSP, caché, `br`, 308, 404 por idioma |
| Lighthouse ×3, 16 plantillas, local y deploy | ✅ con reserva | 192 corridas, 0 fallos. Local: 25 de 96 siguen con `rtt` > 0,1 tras repetirlas (CPU de este Mac); las medianas coinciden con C3. Deploy: SEO 0 a propósito (modo cerrado) |
| Foto del Webflow en vivo (64 URL) | ✅ | `vivo.json` |
| DNS actual (A, CNAME, NS, TXT, MX) | ✅ | `dig` |
| Vercel: proyecto, variables, dominios, deploys | ✅ | Conector, solo lectura |
| Vercel: firewall | ✅ (sin configuración) | 404 «Config not found» |
| Sanity: dataset público, campos SEO, alt del og | ✅ con hallazgos | §3.7 |
| Sanity: hooks, tokens, miembros, CORS, copias | ✅ con hallazgos | CLI con la sesión de Sebastian |
| Studio publicado: campos SEO y avisos | ✅ con hallazgo | Chrome del usuario, `city-coral-springs-installation`, solo lectura. La pestaña SEO avisa del título de más de 60; están la imagen al compartir con su alt y su procedencia, y el interruptor «Visible en buscadores», que el build no lee (T2). 0 borradores (`npx sanity documents query`). La plantilla inicial no se volvió a probar: crear un documento escribe en el dataset (se probó en C1) |
| validator.schema.org (8 plantillas) | ✅ | 0 errores y 0 avisos (23-oct, con OK del chat) |
| Rich Results Test (modo código) | 🔴 1 / ✅ 2 | Product no válido (T4); Articles y Breadcrumbs válidos. Por URL, el día 0 |
| Licencia en DBPR | ✅ con hallazgo | CGC1539940 activa, a nombre de DE HOME VENTURES LLC (L6) |
| Search Console, GA4, GTM, Ads y GBP | **NO CORRIÓ** | Sin acceso (L5) |
| Flujo del editor de extremo a extremo (crear, cambiar una foto, publicar) | **NO CORRIÓ** | Escribe en producción y lanza un deploy; la auditoría no escribe. Probado el 21-oct en C5 |
| Redirección apex ↔ www y certificado | **NO CORRIÓ** | No hay dominio en el proyecto |
| Envío real de un lead | **NO CORRIÓ** | Sin SMTP (P0-1) |
| Keywords con volumen (EN y ES) | **NO CORRIÓ** | Ahrefs sin autorizar (`/mcp`) y sin Search Console. El mapa del anexo es por intención, sin volumen |

---

## 6. Plan del día del lanzamiento y de las 4 semanas siguientes

### Día −1

1. Repetir la foto del sitemap en vivo: `curl -s https://www.pergolaplusflorida.com/sitemap.xml`. **Comprobación:** las mismas 64 URL que `docs/redirects.md`. Si hay alguna nueva, añadir su 301 en `src/data/redirecciones-dominio.mjs`.
2. Exportar el dataset: `npx sanity dataset export production pp-lanzamiento.tar.gz`. **Comprobación:** el SHA-256 apuntado.
3. P0-2 terminado en `main`: GTM, consentimiento y CSP. **Comprobación:** en el deploy, Tag Assistant ve GTM-TKKRL526 y la consola no da errores de CSP.
4. Bajar el TTL de `A @` y `CNAME www` a 300 s en GoDaddy. **Comprobación:** `dig` muestra el TTL nuevo.

### Día 0 (en este orden)

1. **Variables en Vercel (Production):** `SMTP_*` o `LEAD_WEBHOOK_URL`, `LEAD_NOTIFY_TO`, `TURNSTILE_SECRET_KEY` y `PUBLIC_SITE_URL=https://www.pergolaplusflorida.com`. `PUBLIC_ES_PRODUCCION` se queda en `0`. **Comprobación:** `filter_project_envs` muestra las claves.
2. **Dominio en Vercel:** añadir `www.pergolaplusflorida.com` (principal) y `pergolaplusflorida.com` → 308 a `www`. **Comprobación:** el panel muestra los registros que pide.
3. **DNS en GoDaddy:** `A @` → la IP que dé Vercel y `CNAME www` → `cname.vercel-dns.com` (o el valor del panel). **No tocar NS, TXT ni MX.** **Comprobación:** `dig +short www.pergolaplusflorida.com` y `dig TXT` (siguen los dos `google-site-verification`) y `dig MX` (sigue Google).
4. **Certificado:** esperar a que Vercel lo emita. **Comprobación:** `curl -sI https://www.pergolaplusflorida.com/` da 200 con `server: Vercel`, y `curl -sI https://pergolaplusflorida.com/` da 308 a `https://www.…/`.
5. **Abrir:** `PUBLIC_ES_PRODUCCION=1`; Deployment Protection → Standard Protection (ya no `all`); redeploy de `main`. **Comprobación:** el deploy está en READY y el dominio no pide iniciar sesión.
6. **Comprobaciones en el dominio:**
   - `/robots.txt` con `Allow` y `Sitemap: https://www.pergolaplusflorida.com/sitemap.xml`;
   - `/sitemap.xml` con 214 `<loc>`;
   - `curl -sI /` **sin** `x-robots-tag`;
   - canonical de `/` = `https://www.pergolaplusflorida.com/`;
   - las 64 URL antiguas, sin y con barra (el bucle de `urls-antiguas.tsv`): 128/128 en ≤ 1 salto a 200.
7. **Formularios:** un lead real por formulario (quote, contact, pie y estimador) en EN y ES. Llegan el aviso y el acuse; `quote` sin token de Turnstile → 400. **Comprobación:** 8 correos y la conversión de Ads registrada en GTM Preview.
8. **Search Console** (propiedad de dominio ya verificada por TXT): enviar el sitemap; inspeccionar y pedir la indexación de `/`, `/es/`, `/products/`, `/services/`, las 3 de condado y las 10 fichas. Rich Results Test de una URL por tipo (home, ficha, ciudad, post, FAQ). **Comprobación:** el sitemap «Correcto» y 0 errores críticos en las pruebas.
9. **Sanity:** una publicación de prueba (un cambio de texto inocuo) con el webhook de `main`. **Comprobación:** deploy READY y el cambio en el dominio.
10. **Google Ads:** cambiar los destinos finales de los anuncios a las URL nuevas.

### Semana 1

- A diario: Search Console → Páginas (404 y «Rastreada, sin indexar») y Vercel → Runtime Errors de `/api/lead`. **Comprobación:** ningún 404 de las URL antiguas. Si aparece alguno, su 301 en `redirecciones-dominio.mjs`.
- GA4 en tiempo real y conversiones de Ads frente a la semana anterior.
- Dar de baja el sitio Webflow `63f3b8ea…` solo después de comprobar que nada se sirve desde él (no antes de la semana 4).
- Hacer T5 y T9 (marca de `lastmod`, tokens y webhook viejo).

### Semana 2

- T1 (puertas en el build de Vercel), T2 (`seo.indexable`) y T4 (`Service`).
- Search Console → Mejoras: FAQ, migas y fragmentos de producto (deberían desaparecer con T4).
- Speed Insights: LCP p75 en móvil por ruta.

### Semana 3

- C1 y C2 (títulos y H1) por tandas, empezando por las 25 ciudades. **Con el webhook desactivado** para la tanda y un solo redeploy al final.
- T3 (silo de condado).

### Semana 4

- Informe: cobertura (214 enviadas frente a indexadas), consultas EN/ES, CTR antes y después de C1, CWV de campo (Speed Insights y el informe de Search Console si ya tiene datos).
- Decidir C4 (fusión de posts) con los datos de consultas reales.
- Revisar que no quede tráfico en URL del Webflow viejo y dar de baja ese sitio.

---

## 7. Lo que no se pudo medir y qué acceso hace falta

| Qué | Por qué no | Acceso que falta |
|---|---|---|
| Cobertura, consultas y CWV de campo actuales | Sin Search Console | Propietario o usuario completo de la propiedad `pergolaplusflorida.com` |
| Conversiones actuales, disparadores de GTM y objetivos de Ads | Sin GA4, GTM ni Ads | Lectura en GTM-TKKRL526, en las dos propiedades GA4 y en AW-11106946679 |
| NAP, categoría y reseñas de GBP | Sin GBP | Administrador de la ficha (`maps.app.goo.gl/jsRrfKeuB4SJDSFP8`) |
| Volumen de keywords EN/ES | Ahrefs sin autorizar | Autorizar el conector de Ahrefs con `/mcp`, o Semrush |
| Rich Results en una URL pública | El deploy está tras SSO | El dominio abierto (día 0, paso 8) |
| Entrega real de leads | Sin SMTP | Credenciales (P0-1) |
| Apex/www y certificado | Sin dominio en Vercel | Día 0, pasos 2–4 |
| Si la suite 110 es una oficina virtual | Solo hay indicios públicos | Respuesta del cliente |

## Evidencia

Fuera del repo, en `/Users/senavia/Sites/pp-exports/auditoria-seo-08-2026-10-21/` (193 MB):

- `vivo.json`: foto de las 64 URL del sitio en vivo;
- `paginas.json`: título, descripción, H1, locales, peso y marcado de las 218 páginas;
- `crawl-prod/`: `crawl.csv` y `crawl-resumen.json`;
- `urls-antiguas.tsv`: las 128 peticiones al deploy;
- `lh-local/` y `lh-vercel/`: las 192 corridas con sus CSV de medianas. En las del deploy, la cookie de acceso está tachada;
- `check-prod.log` y `noindex-cerrado.log`;
- los scripts: `foto-vivo.mjs`, `analiza.mjs` y `propuestas.mjs`, que genera el anexo. Se ejecutan con `node <script> …`; las rutas de entrada van en la cabecera de cada uno.
