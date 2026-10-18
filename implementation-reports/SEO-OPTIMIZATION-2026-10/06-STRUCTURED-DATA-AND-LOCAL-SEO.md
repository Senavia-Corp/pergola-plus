# 06 — Datos estructurados y SEO local

## 1. JSON-LD por plantilla (leído del HTML construido)

Todo el JSON-LD sale de `src/lib/jsonld.ts` (entidad `HomeAndConstructionBusiness` con `@id` estable `/#negocio`, migas desde la ruta, `Service`, `Product`, `FAQPage` solo con FAQs visibles) y de la plantilla del blog (`BlogPosting`). `check:seo` verifica que parsea en las 217 páginas; `scripts/informe-crawl.mjs` lista los tipos por URL en `05-CRAWL-SEO-VALIDATION.csv`.

| Plantilla | Tipos encontrados | Observación |
|---|---|---|
| Home EN/ES | `HomeAndConstructionBusiness` + `BreadcrumbList` | NAP, horario L–V 8–17, 3 condados `areaServed`, 4 `sameAs`. Mismo `@id` en los dos idiomas (es el mismo negocio). |
| Producto (10) | `Product` (+ `Brand`, `PropertyValue`), `FAQPage`, `BreadcrumbList` | Sin `offers`, sin precio, sin `aggregateRating`: correcto, no hay oferta publicada. `Product` aquí describe el producto, no promete rich result. |
| Servicio (7) | `Service` (+ `AdministrativeArea`), `FAQPage`, `BreadcrumbList` | `provider` = `@id` del negocio. |
| Ciudad (25) / Condado (3) | `Service` + `Place`, `BreadcrumbList` | `areaServed` = la ciudad/condado de la página. |
| Post (21) | `BlogPosting`, `Blog`, `WebPage`, `Organization`, `BreadcrumbList` | `dateModified` real alimenta el `lastmod` del sitemap. |
| Proyecto (13), Marca (5) | `BreadcrumbList` | Sin tipo propio; no se inventa `CreativeWork`/`Brand` sin datos. |
| FAQ | `CollectionPage`, `FAQPage` | 10 Q/A visibles. |

Veredicto: válido y honesto. Lo que falta a propósito y debe seguir faltando: `aggregateRating` (reseñas propias = inelegible para estrellas, riesgo de acción manual), `priceRange`/`offers` (no publicados), `geo` (no medido). **No se ha añadido ningún nodo nuevo** en esta fase.

Lo único que cambia en esta fase respecto a la entidad es que TODAS las páginas llevan ahora `og:image`/`twitter:image` (por defecto el fotograma del hero; las fichas con imagen propia la suya), lo que afecta a tarjetas sociales, no al JSON-LD.

Validación externa (Rich Results Test / Schema Validator) sobre URL pública: **NOT_RUN** — exige una URL del dominio definitivo. Queda en el preflight (08).

## 2. Las 25 páginas de ciudad y los 3 condados: similitud medida

Método: texto del `<main>` de cada página construida (sin nav ni pie), 3-shingles de palabras, índice de Jaccard por pares, y «plantilla común» = shingles presentes en las 28 páginas. Script en scratchpad `similitud.mjs` (reproducible sobre `dist/client`).

- Jaccard medio entre pares: 83.7
- Shingles comunes a las 28 páginas (plantilla): 743

Pares más parecidos:

| Página A | Página B | Jaccard |
|---|---|---:|
| /pergolas-contractors/palm-beach-contractors/ | /pergolas-contractors/west-palm-beach-contractors/ | 90.1 % |
| /pergolas-contractors/palm-beach-gardens/ | /pergolas-contractors/west-palm-beach-contractors/ | 89.9 % |
| /pergolas-contractors/miramar-installation/ | /pergolas-contractors/weston-pergola-solutions/ | 89.5 % |
| /pergolas-contractors/davie-installation/ | /pergolas-contractors/west-palm-beach-contractors/ | 89.4 % |
| /pergolas-contractors/cooper-city-pergola-installation/ | /pergolas-contractors/parkland-installation/ | 89.3 % |

Pares menos parecidos (ciudad frente a condado):

| Página A | Página B | Jaccard |
|---|---|---:|
| /pergolas-contractors/boynton-beach-contractors/ | /countries/broward-county-pergola-contractor/ | 68.2 % |
| /pergolas-contractors/boynton-beach-contractors/ | /countries/miami-dade-pergola-contractor/ | 68.2 % |
| /pergolas-contractors/aventura-pergola-builders/ | /countries/miami-dade-pergola-contractor/ | 68.0 % |

Contenido propio de cada página (lo que NO está en la plantilla):

| Página | Palabras en main | Shingles propios | % propio |
|---|---:|---:|---:|
| /pergolas-contractors/aventura-pergola-builders/ | 1284 | 265 | 26 % |
| /pergolas-contractors/boca-raton-pergola-contractor/ | 1281 | 265 | 26 % |
| /pergolas-contractors/boynton-beach-contractors/ | 1277 | 260 | 26 % |
| /pergolas-contractors/cooper-city-pergola-installation/ | 1275 | 259 | 26 % |
| /pergolas-contractors/coral-gables/ | 1272 | 257 | 26 % |
| /pergolas-contractors/coral-springs-installation/ | 1274 | 257 | 26 % |
| /pergolas-contractors/davie-installation/ | 1270 | 254 | 25 % |
| /pergolas-contractors/delray-beach-contractors/ | 1275 | 254 | 25 % |
| /pergolas-contractors/doral-pergola-builders/ | 1268 | 253 | 25 % |
| /pergolas-contractors/fort-lauderdale-installation/ | 1272 | 251 | 25 % |
| /pergolas-contractors/hollywood-pergola-installation/ | 1270 | 251 | 25 % |
| /pergolas-contractors/jupiter-contractors/ | 1270 | 254 | 25 % |
| /pergolas-contractors/key-biscayne-pergola-builders/ | 1268 | 251 | 25 % |
| /pergolas-contractors/miami-beach-pergola-design/ | 1272 | 256 | 26 % |
| /pergolas-contractors/miami-pergola-experts/ | 1271 | 253 | 25 % |
| /pergolas-contractors/miramar-installation/ | 1263 | 248 | 25 % |
| /pergolas-contractors/palm-beach-contractors/ | 1265 | 246 | 25 % |
| /pergolas-contractors/palm-beach-gardens/ | 1266 | 246 | 25 % |
| /pergolas-contractors/parkland-installation/ | 1264 | 248 | 25 % |
| /pergolas-contractors/pembroke-pines-pergola-installation/ | 1267 | 250 | 25 % |
| /pergolas-contractors/royal-palm-beach-contractors/ | 1269 | 250 | 25 % |
| /pergolas-contractors/sunny-isles-beach-pergola-builders/ | 1268 | 244 | 25 % |
| /pergolas-contractors/wellington-contractors/ | 1264 | 248 | 25 % |
| /pergolas-contractors/west-palm-beach-contractors/ | 1268 | 247 | 25 % |
| /pergolas-contractors/weston-pergola-solutions/ | 1264 | 248 | 25 % |
| /countries/broward-county-pergola-contractor/ | 1009 | 86 | 10 % |
| /countries/miami-dade-pergola-contractor/ | 1005 | 87 | 10 % |
| /countries/palm-beach-county-pergola-contractor/ | 998 | 79 | 10 % |

### Lectura

- Las 25 ciudades comparten el **74–75 %** de su texto: mismo bloque de servicios, mismo «why choose», mismo proceso, mismas FAQ y el mismo carrusel de proyectos. Lo propio (~25 %) es el hero (H1/intro con el nombre de la ciudad), el antetítulo y el título/description del CMS.
- Los 3 condados están aún más cerca de la plantilla (**~10 % propio**).
- Esto **no demuestra penalización ni doorway**: son páginas de área de servicio con intención local real y títulos del CMS escritos a mano. Pero sí mide que hoy la diferencia entre Weston y Miramar es el nombre y poco más, y que el carrusel «proyectos recientes» enseña los mismos 13 proyectos en las 25.

### Lo que se hizo y lo que no

- Hecho: la medición anterior; el `og:image` por defecto; el aviso de idioma correcto; `Service`+`Place` conservados.
- **NO hecho a propósito (CONTENT BLOCKED: VERIFICATION REQUIRED):** contenido local por ciudad. Sin una lista verificada de proyectos ejecutados por municipio, permisos/normativa citables y fotos atribuibles, cualquier texto nuevo sería inventado. La matriz y los campos exactos que hacen falta están en `11-REMAINING-EDITORIAL-VERIFICATION.md`.
- Recomendación técnica cuando llegue el contenido: enlazar desde cada ciudad SOLO los proyectos del mismo municipio o condado (los `_items.json` de `project/` ya traen la ciudad en el slug: Boca Raton, Delray Beach, Pompano, Jupiter, West Palm Beach, Hillsboro Beach, Riviera Beach, Greenacres, Palm Beach Gardens, Elan Polo Club), y consolidar en el condado las ciudades sin un solo proyecto verificable.

## 3. NAP y entidad

Publicado en el sitio y en el JSON-LD: Pergola Plus Florida · 980 N Federal Hwy, Boca Raton, FL 33432 · +1 561 710 8363 · info@pergolaplusflorida.com · L–V 08:00–17:00 · Miami-Dade, Broward y Palm Beach. **No verificado desde el repo**: Google Business Profile, licencia (el copy dice «Licensed» sin número), citaciones locales. Ver 11.
