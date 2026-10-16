# Blog — SEO / GEO / AEO / AIO · octubre 2026

Empieza por [`00-resumen-ejecutivo.md`](00-resumen-ejecutivo.md).

| Fichero | Qué es |
|---|---|
| [`00-resumen-ejecutivo.md`](00-resumen-ejecutivo.md) | Qué se encontró, qué se corrigió y qué sigue abierto |
| [`01-arquitectura.md`](01-arquitectura.md) | Cómo se generan los 21 artículos y por qué el arreglo va donde va |
| `02-inventario-visual.csv` | Las 68 fotos de obra: proyecto, ciudad verificada, qué se ve, uso actual |
| `02b-fotos-nuevas-sin-incorporar.csv` | Las 148 de `public/photos/`, inventariadas y **no** incorporadas |
| `03-matriz-imagenes.csv` | Imagen a imagen: qué entra, qué sale, de qué obra y con qué `alt` en EN y ES |
| `04-auditoria-seo.csv` | Los 21 artículos **antes y después**, campo a campo |
| `05-enlaces-internos.csv` | Los 111 enlaces: origen, destino EN y ES, anchor, contexto y validación |
| [`06-geo-aeo-aio.md`](06-geo-aeo-aio.md) | Evaluación GEO, AEO y AIO |
| [`07-seo-tecnico.md`](07-seo-tecnico.md) | Canónicas, hreflang, sitemap, robots, datos estructurados, rendimiento, móvil |
| `08-scorecard.csv` | Puntuación por artículo antes/después, con la rúbrica declarada |
| [`09-recomendaciones-editoriales.md`](09-recomendaciones-editoriales.md) | Lo que necesita aprobación antes de tocarse, y la canibalización |
| [`10-validaciones.md`](10-validaciones.md) | Qué se ejecutó, qué salió y **qué NO se pudo comprobar** |
| [`11-plan-90-dias.md`](11-plan-90-dias.md) | Qué medir, dónde, cuándo, y qué no podrá atribuirse a este trabajo |

## Dónde está el «antes y después»

Repartido a propósito, en los tres sitios donde se puede comprobar:

- **Resumen** → tabla de `00-resumen-ejecutivo.md`.
- **Por artículo y campo a campo** → `04-auditoria-seo.csv` (columnas `*_antes` /
  `*_ahora`), generado leyendo el repositorio en el commit `25610d2` y el `dist/` de
  ahora. No está escrito a mano.
- **Puntuado** → `08-scorecard.csv`.

## Cómo leer la puntuación de `08-scorecard.csv`

Es una **herramienta interna de evaluación editorial**. No es un ranking de Google, de
Bing ni de ningún sistema generativo, no garantiza posicionamiento y no corresponde a
ninguna métrica oficial.

La rúbrica, declarada para que se pueda discutir:

- **Medido sobre el repositorio o sobre `dist/`:** `onpage_10`, `enlazado_5`,
  `tecnico_10`, `local_intl_5`, `elegibilidad_7`, `accesibilidad_5`, `multimodal_3`.
  Estos salen de datos, no de opinión.
- **Juicio editorial, aplicado igual a los 21:** `semantico_5`, `entidades_5`,
  `citabilidad_3`, `intencion_6`, `respuesta_6`, `cobertura_4`, `generativa_5`,
  `evidencia_7`, `experiencia_7`, `autoridad_3`. Varios no se mueven entre el antes y el
  después, y es correcto que no se muevan: **el texto no se ha reescrito**.
- **No evaluado:** nada que dependa de Search Console, Bing o GA4. No se reparte entre
  los demás ni se estima; está en `10-validaciones.md`.

Media de los 21: **67,7 → 90,2** sobre 100. Lo que falta para 100 son, casi todo, las
propuestas editoriales de `09` — que son del cliente, no técnicas.

## Qué se tocó en el código

| | |
|---|---|
| `scripts/lib/posts.mjs` | **nuevo** — la asignación completa, con su porqué y su autocomprobación |
| `scripts/lib/transformar.mjs` | paso `6g`, que llama a `recomponerPost()` |
| `src/contenido-migrado/post/*.html` | salida **regenerada** (21 ficheros), no editada a mano |
| `src/styles/blog.css` | tabla, CTA y el arreglo de contraste |
| `src/pages/es/post/[slug].astro` | mezcla `ALTS_ES` en el diccionario |
| `src/i18n/posts/aluminum-pergola-cost-…` | `.txt` y `.ts` regenerados: la tabla pasa de 1 cadena a 15 |
| `.claude/launch.json` | configuración que sirve `dist/client`, para poder verificar sobre lo construido |

Commits: `d416f16` (el trabajo) y `7fb7551` (el contraste del CTA y la forma de verlo).
