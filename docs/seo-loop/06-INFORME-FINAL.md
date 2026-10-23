# Informe final del loop SEO · Pergola Plus Florida (23-oct-2026)

Rama `seo/loop-optimizacion`, worktree `pp-loop`. Especificación: `00-ESPECIFICACION-LOOP.md`. Detalle de cada fase en `iteraciones/00.md` a `06.md`.

## Estado frente a «Done» (§4)

| Criterio | Estado |
|---|---|
| J1–J17 en verde en dos corridas seguidas del juez | **Hecho.** 18/18 (J0–J17) en las dos corridas, sobre `e64eb67`, con el árbol limpio y un juez independiente en cada una |
| PR fusionado | Pendiente de la fusión en `main`: PR abierto al cerrar este informe |
| Release preparada | No hay Releases en el plan Free (B4). El contenido fue a borradores, y la sesión principal publicó los 184 por orden de Sebastian (`iteraciones/05.md`). El sitio servido los mostrará con el deploy de la fusión |
| `06-INFORME-FINAL.md` | Este documento |

## Avance del juez

| Momento | Puertas en verde |
|---|---|
| Juez de F1 | 7 / 18 |
| Juez de F2 | 9 / 18 |
| Juez de F5/F6 | 15 / 18 (J0 y J7 por orden de llegada de firmas y J7 nuevo; J15 en una celda) |
| **F7, corrida 1** | **18 / 18** |
| **F7, corrida 2** | **18 / 18** |

## Qué se hizo

- **F0 · Línea base y puertas.**
  - Puertas J5–J17 y `juez.mjs`.
  - Vacíos permitidos.
  - Mapa de keywords: 214 URL y 16 SERP; SEOptimer quedó limitado (B1, B2).
  - Glosario del español de Florida.
  - Línea base: builds, crawl y Lighthouse ×3.
- **F1 · Técnico** (T1–T5, T10–T13, T16, T17):
  - robots según §0 (rastreadores de IA permitidos, Bytespider bloqueado);
  - `Service` en vez de `Product`;
  - entidad por `@id`;
  - `noindex` desde Sanity;
  - silo condado › ciudad con migas de pan;
  - Turnstile al primer foco;
  - vista previa SERP en el Studio;
  - las puertas en el build de Vercel.
- **F2 · Textos SEO.**
  - Títulos, descripciones y H1 en EN y ES, con el mapa de keywords.
  - El H1 de las 6 fichas de producto se respeta como lo pidió el cliente (excepción R4).
- **F3 · Español de Florida.**
  - Glosario aplicado a 157 borradores de Sanity y a 469 textos de `src/i18n`.
  - J10: de 1936 apariciones a 0.
- **F4 · Entidad.**
  - `sameAs` con 6 perfiles, ficha de Google y BBB incluidas.
  - `image` del negocio.
- **F5 · Contenido local.**
  - 25 ciudades y 3 condados con una sección propia, en EN y en español de Florida:
    - una pregunta con su respuesta corta;
    - el departamento de permisos, el portal y el requisito local;
    - las fuentes oficiales verificadas (`evidencia/fuentes-oficiales-2026-10-23.json`);
    - los proyectos propios donde los hay.
  - Coral Springs: el hero y la intro con fotos reales del cliente.
  - J13: 0 fallos, con un Jaccard medio entre ciudades de 0,647 en EN y 0,644 en ES.
- **F6 · GEO / AEO.**
  - Fuentes oficiales en los 4 posts de normativa, EN y ES.
  - `llms.txt` con las categorías.
  - J11 y J12: 90 de 90 páginas con pregunta y respuesta directa.
- **F7 · Cierre.**
  - J7 con el vocabulario de schema.org 30.1 en local.
  - J15 estable en `contacto-quote` (la foto LCP pasa de 188 a 87 KB).
  - Dos corridas del juez a 18/18.
  - Conflictos al día y correo de cierre en borrador.

## Rendimiento (Lighthouse, Perf, mediana; línea base → F7)

En escritorio, las 16 plantillas siguen en 99–100. En móvil:

| Plantilla | Base | F7 |
|---|---|---|
| condado | 93 | **97** |
| ciudad | 96 | **98** |
| home | 95 | 96 |
| home-es | 95 | 95 |
| post | 99 | 100 |
| blog-indice | 98 | 99 |
| blog-categoria | 99 | 98 |
| proyecto | 97 | 97 |
| servicio | 98 | 98 |
| El resto (7) | 99–100 | 99–100 |

A11y, BP y SEO siguen en 100 en todas las plantillas (contacto, BP 96 por Turnstile en local, como prevé J15) y CLS en 0. Las cifras de la F7 son medianas de las 3 corridas, ruidosas incluidas; J15 decide con sus propias reglas.

## Pendiente

**Del cliente.** El proyecto está en pausa hasta que respondan al correo de cierre (B6):
- Accesos: DNS, Search Console como Owner y credenciales SMTP por un canal seguro.
- El chat con IA: sin respuesta antes del 30-oct-2026, cuenta como un no.
- «Keep» o «Alternative» para el H1 de la home (X1), los nombres de producto como H1 (X8) y el vídeo del hero (X12).
- El sí o el no para firmar los posts (X7).

**De Senavia, ya decidido** (sección de decisiones del `05`):
- **Teléfono (561) 292-5054** como principal en `siteSettings`. Cambia el NAP de J16: línea base nueva, firmada.
- **Fusión de posts** con 301 (X10).
- **Páginas nuevas** de Pompano Beach, Riviera Beach y Patio Covers (X11), con contenido local como las demás.
- **Desplegar el esquema y el Studio desde `main`.** El campo `local` ya tiene contenido publicado en 28 documentos.
- **Añadir al registro 01** las 22 peticiones no registradas (`evidencia/peticiones-daniel-2026-10-23.json`). El fichero es de Senavia y el loop no lo edita.

**Técnico, sin hacer:**
- T18: imágenes sin uso. Lo impide una puerta fijada.
- El tipo `redirect` de Sanity (T16). Choca con `check:sanity-cobertura`.
- T14: CSS común con caché.

**Datos sin respaldo:**
- La norma de materiales de Key Biscayne. Se citó solo como «confirmar con BZP».
- Las capturas y adjuntos de los correos que no se pudieron leer.

**Keywords:** sin volumen de búsqueda en español (B1). Se recalibra con Search Console a las 4 semanas del lanzamiento.

## Notas para quien siga

- El contenido publicado en Sanity va por delante del sitio servido hasta el deploy de la fusión.
- La sesión principal pausó y reactivó el webhook «Vercel producción · main» durante la publicación. No hubo entregas.
- Para juzgar de nuevo, el juez saca antes una foto de Vercel con el conector MCP (`pp-exports/loop-juez/vercel-snapshot.json`, sin valores) y libera el 4351. `check:formularios` deja ahí un `astro dev` vivo.
