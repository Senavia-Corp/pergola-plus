# Validaciones — qué se ejecutó, qué salió y qué NO se pudo comprobar

Regla de este documento: **si una comprobación no se ejecutó, aquí pone NO EJECUTADO.**
Una puerta que se salta por falta de acceso falla ABIERTA, y contarla como verde es
peor que no tenerla.

---

## 1. Puertas del repositorio

`npm run check` — **salida 0**. Incluye `npm run build` y 20 comprobaciones sobre la
salida construida.

| Puerta | Resultado | Lo relevante para este encargo |
|---|---|---|
| `check:blog` | ✅ | 21 tarjetas en el DOM, 20 visibles en el índice, categorías vacías sin ruta |
| `check:enlaces` | ✅ | **ningún enlace sin destino** en 217 páginas (los 42 CTA eran encabezados, ahora son enlaces) |
| `check:carruseles` | ✅ | sin cambios |
| `check:marquee` | ✅ | sin cambios |
| `check:animaciones` | ✅ | sin cambios |
| `check:imagenes` | ✅ | las 515 rutas que pide `dist/` existen y están versionadas; ninguna difiere de su sha256; sin referencias al CDN de Webflow · **1 aviso**, ver §3 |
| `check:cta` | ✅ | fondos de CTA de ficha, sin cambios |
| `check:estimador` | ✅ | sin cambios |
| `check:paridad` | ✅ | informe versionado actualizado, ver §4 |
| `check:generadores` | ✅ | **regenerar no cambia nada**: la salida comiteada es la que producen los generadores |
| `check:formularios` | ✅ | sin cambios |
| `check:i18n` | ✅ | 98 % de nodos de texto traducidos; hreflang recíproco; ningún atributo visible en inglés en el cuerpo medido · ver §5 |
| `check:seo` | ✅ | **un solo `<h1>` por página** (217/217), canónicas, JSON-LD, `alt`, `width`/`height` · 49 avisos de copy del cliente |
| `check:paginas` | ✅ | **todo enlace interno lleva a una página que existe** — valida los 69 enlaces nuevos |
| `check:noindex` | ✅ | sin `noindex` indebido |
| `check:resenas` | ✅ | sin cambios |
| `check:iconos` | ✅ | sin cambios |
| `check:ritmo` | ✅ | sin cambios |
| `check:correo` | ✅ | sin cambios |

## 2. Comprobaciones propias sobre `dist/`

Medidas sobre el HTML construido, no sobre `npm run dev`.

| Medida | EN | ES |
|---|---|---|
| Imágenes en el cuerpo de los 21 | 40 | 40 |
| De ellas, generadas por IA (`/cms-img/blog/`) | **0** | **0** |
| `alt` vacíos | **0** | **0** |
| `alt` que siguen en inglés | — | **0** |
| Enlaces internos en el cuerpo | 111 | 111 |
| De ellos, apuntando al idioma equivocado | — | **0** |
| Bloques CTA con dos enlaces reales | 21 | 21 |
| `<h1>` dentro del cuerpo | **0** | **0** |

## 3. Revisión visual en navegador

Sobre la salida construida, servida desde `dist/client` (configuración
`pergola-plus-dist` en `.claude/launch.json`). **No se barrió el sitio**: se miraron
rutas concretas, que es lo que corresponde salvo petición expresa.

| Ruta | Ancho | Qué se comprobó | Resultado |
|---|---|---|---|
| `/post/aluminum-pergola-cost-…` | 1440 | tabla, jerarquía, CTA, índice lateral | 1 `<h1>`, 0 en cuerpo; tabla con 5 filas y `th[scope=row]`; CTA con sus dos destinos; los CTA ya **no** salen en el índice |
| `/post/aluminum-pergola-cost-…` | 1440 | carga real de imágenes | 1250×703 intrínsecos para 636×358 de display = **1,97×** |
| `/es/post/aluminum-pergola-cost-…` | 1440 | paridad | CTA, tabla, `alt` y los 5 enlaces internos, todo en español y apuntando a `/es/` |
| `/post/pergola-cost-south-florida` | 1440 | contraste del CTA | **8,08:1** en los dos botones |
| `/post/aluminum-pergola-cost-…` | 375 | móvil | **0 px de desborde** de página; la tabla hace scroll dentro de su región (544→343 px) y es alcanzable por teclado |

Se esperó un **estado** (imágenes `complete`, dos `requestAnimationFrame`), no un número
de milisegundos: la misma página ha dado medidas distintas por esperar por reloj.

### Un fallo encontrado así, y corregido

`.pp-prosa a` pintaba todo enlace del cuerpo con `var(--primary)` y le pisaba el blanco
al botón primario del CTA nuevo: color y fondo quedaban en el mismo `rgb(58,84,91)`.
Contraste **1:1**, texto invisible, enlace clicable. Un botón negro y mudo al final de
los 21 artículos.

**Ninguna puerta lo vio y ninguna podía verlo**: `check:enlaces` mira que haya destino,
`check:seo` mira que haya `alt` y `title`. Ninguna mide contraste. Corregido en
`7fb7551` acotando la regla con `:not(.w-button)`; medido después: 8,08:1.

## 4. Lo que se movió y no es un fallo

**`docs/auditoria-paridad.json`** cambia en los 21 posts: ~9 palabras menos por
artículo. Causa exacta: al dejar de ser `<h3>`, los dos CTA salen del índice lateral.
La divergencia con el sitio en vivo es **deliberada** — el Webflow sigue sirviendo las
imágenes de IA y los CTA muertos.

**`check:imagenes` avisa de 164 imágenes del CMS que no pide ninguna página** (27,4 MB).
De ellas, **93 son las imágenes de IA del blog** que acaban de quedarse sin uso
(17,0 MB). Siguen versionadas y siguen desplegándose. **No se han borrado**: eliminar 93
ficheros versionados es decisión del cliente, y la puerta ya las reporta.

## 5. Un resto que la propia puerta declara

`check:i18n` informa de **211 cadenas únicas en inglés en atributos de `/es/`**, fuera
de su alcance, de las cuales 557 apariciones caen bajo `/es/post`. **Son anteriores a
este encargo** (menú mega, pie, tarjetas de relacionados) y no incluyen los `alt` de las
40 fotografías, que sí están traducidos. La propia puerta dice que cerrarlo «es una
tanda propia».

---

## NO EJECUTADO

Esto es lo que **no** se ha comprobado, y por qué. Nada de esto se ha estimado.

| Qué | Por qué | Qué haría falta |
|---|---|---|
| Indexación real de las 21 URLs | Accesible ≠ rastreable ≠ indexable ≠ **indexado** | Search Console |
| Core Web Vitals de campo (LCP, INP, CLS reales) | Necesitan datos de usuario | CrUX / Search Console |
| Puntuación Lighthouse | No se ejecutó; no se inventa | Ejecutarlo sobre el deploy |
| Validación externa del JSON-LD | No se pasó por la herramienta de Google ni por schema.org | Hacerlo sobre una URL pública |
| Visibilidad en AI Overviews / AI Mode | No hay acceso, y una citación observada no garantiza la siguiente | Search Console (rendimiento de búsqueda generativa) |
| AI Performance de Bing | No hay acceso | Bing Webmaster Tools |
| Sesiones, leads y conversiones | No hay acceso | GA4 |
| Volúmenes y dificultad de keyword | No hay herramienta conectada; el análisis de este informe es **cualitativo** | Ahrefs / Semrush / GSC |
| Comportamiento del sitemap en producción | El build de esta sesión **no** es de producción: sin `PUBLIC_ES_PRODUCCION=1` no se publica sitemap y `robots.txt` lleva `Disallow: /` | Un deploy con esa variable |

## Lo que NO se hizo, a propósito

- No se desplegó. El proyecto está en Vercel bajo la cuenta de Senavia y **no se ha
  tocado**: ni deploy, ni variables, ni configuración.
- No se silenció ninguna validación ni se modificó ningún script para ocultar un fallo.
- No se reescribió el texto de ningún artículo.
- No se tocó `dateModified` para simular contenido reciente.
- No se cambiaron slugs, ni se borraron artículos, ni se crearon redirects.
- No se comitearon `public/photos/` (1,6 GB, sin versionar) ni
  `docs/prompt-blog-imagenes-seo.md`: son trabajo preexistente, ajeno a este encargo.
