# Backlog del loop (auditor, línea base F0 · 23-oct-2026)

Medido sobre `49998bf` + las puertas de `scripts/seo-loop/`, con el build de producción (`PP_FUENTE=sanity PUBLIC_ES_PRODUCCION=1 PUBLIC_SITE_URL=https://www.pergolaplusflorida.com`) y el dataset publicado (405 documentos, 0 borradores). Logs en `/Users/senavia/Sites/pp-exports/loop-linea-base-2026-10-23/`.

Una fila por fallo o por grupo de fallos iguales: la medida, la puerta que lo comprueba y la fase que lo ataca. «Cliente» = depende de un dato o decisión del cliente: no se itera (§7), va a `05` o a `07`.

| # | Puerta | Medida en la línea base | Origen | Fase | Dónde |
|---|---|---|---|---|---|
| B-01 | J5 | 210 páginas sin `og:image:alt` | T10 | F1 | `src/layouts/BaseLayout.astro` |
| B-02 | J5 | 74 títulos fuera de 30–60; 41 descripciones fuera de 110–160 | C1, C8 | F2 | Borradores: `seo.titulo`, `seo.descripcion` |
| B-03 | J5 | 46 títulos y 89 descripciones sin la keyword del mapa | C1, C8 | F2 | Borradores |
| B-04 | J5 | 103 H1 sin la keyword (R1 y R8 exentos) | C2 | F2 | Borradores (texto del hero): propuesta, no publicado |
| B-05 | J5 | 35 páginas sin «South Florida», FL, ciudad o condado en title ni description | R6 | F2 | Borradores |
| B-06 | J6 | 55 alt con `alt.es` = `alt.en` (51 `seo.imagenOg.alt`, 3 `imagenCabecera.alt`, 1 blog) | C9 | F2 | Borradores |
| B-07 | J6 | 6 textos ES vacíos en `page-contact-us__get-in-touch` (nombre y alt de los 3 condados) | C8 | F3 | Borrador |
| B-08 | J6 | `seo.indexable` no lo lee el build (hoy coherente porque esos 5 documentos no tienen página) | T2 | F1 | `[slug].astro` → `BaseLayout` |
| B-09 | J7 | 20 `Product` sin offers/review/aggregateRating | T4 | F1 | `src/lib/jsonld.ts` |
| B-10 | J7 | 42 BlogPosting con `dateModified` < `datePublished` | T11 | F1 | `src/pages/post/[slug].astro`, `src/pages/es/post/[slug].astro` |
| B-11 | J7 | `author`/`publisher` redefinen el tipo del nodo `/#negocio`; validator.schema.org sin correr (B5) | T12 | F1 | `src/lib/blog.ts` |
| B-12 | J8 | Los 3 condados no enlazan a sus 25 ciudades; las 25 ciudades no enlazan a su condado; migas sin condado (EN y ES: 152 fallos) | T3 | F1 | `countries/[slug].astro`, `pergolas-contractors/[slug].astro`, `transformar.mjs` |
| B-13 | J9 | 42 posts con `lastmod` (21-oct) ≠ `dateModified` (feb-2026) | T5 | F1 | `src/data/sanity-migracion.json`, `astro.config.mjs` |
| B-14 | J10 | 1.936 términos del glosario en /es/ (hormigón 249, cerramiento 482, adoquín 280, cochera 233, vallado 177, entrada de coche 161, contacte con 108, Boca Ratón 84…) | C3 | F3 | Borradores + `src/i18n/*.es.ts` |
| B-15 | J11 | robots.txt bloquea los 6 rastreadores de entrenamiento (§0 los permite) | §0 | F1 | `astro.config.mjs` |
| B-16 | J11 | llms.txt sin 10 URL indexables (categorías del blog en ES y otras) | GEO | F6 | `src/lib/sanity/llms.mjs` |
| B-17 | J11 | 8 posts de normativa (4 EN + 4 ES) sin enlace a fuente oficial | C7 | F6 | Borradores `post.cuerpo` |
| B-18 | J12 | 56 ciudades y condados (EN+ES) sin pregunta H2/H3 con respuesta directa ≤ 60 palabras | AEO | F6 | Borradores `city`/`county` |
| B-19 | J13 | 33 ciudades con < 150 palabras propias; 19 sin cita oficial ni proyecto propio; Jaccard medio 0,845 (EN) y 0,846 (ES) | C5 | F5 | Borradores, fuentes públicas citadas |
| B-20 | J13 | Coral Springs (EN y ES) con hero `wf-placeholder` | C6 | F5 | Foto real del cliente o pendiente (cliente) |
| B-21 | J14 | 0 (el mapa no canibaliza) | C4 | — | — |
| B-22 | J16 | 0 diferencias (la línea base es la referencia) | R1–R13 | — | — |
| B-23 | J17 | NO CORRIÓ: no puede leer las variables de Vercel | §1 | — | B3 en `07-BLOQUEOS.md` (cliente: Sebastian) |
| B-24 | — | Canibalización de posts (3 de «cómo hacer una pérgola», normativa, precio) | C4 | F5 | Fusión con 301, como propuesta (R13) |
| B-25 | — | Pompano Beach y Riviera Beach sin página; sin página de patio covers | C10 | F5 | Propuesta en borrador + 301 si hace falta |

Pasan en la línea base: J1 (26/26), J2 (modo cerrado), J3 (0 en las 15 métricas), J4 (64 URL), J14, J15 (es la referencia), J16.
