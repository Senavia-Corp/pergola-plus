# Blog de Pergola Plus — SEO / GEO / AEO / AIO

**16-oct-2026** · 21 artículos · inglés y español · commits `d416f16` y `7fb7551`

---

## Lo que había que mirar y lo que apareció

El encargo daba por conocido un defecto: *«Necesidad de sustituir las imágenes por
fotografías reales»*. Al abrirlo, ese defecto era más concreto y más grave de lo que
sugería la frase.

Las **21 portadas ya eran fotografía real** desde agosto de 2026 (commit `25610d2`),
que dejó anotado: «Las imágenes del cuerpo de los artículos siguen siendo IA: quedan
fuera de este cambio». Lo que seguía pendiente, y es lo que se ha hecho ahora, son las
**62 imágenes del cuerpo**.

Se inspeccionaron las 62 una a una en hoja de contactos — nunca por el nombre del
fichero. Son sintéticas sin margen de duda: vigas de aluminio fundidas con madera
flotando sobre una piscina, collages partidos «antes/después», bases de poste con
pernos que no sujetan nada, vegetación clonada. Y tres de ellas son peores que el
resto:

| Imagen | Artículo | Qué era |
|---|---|---|
| `inline-wind-load-engineering-documentation-pergola` | pergola-building-codes-broward-palm-beach | Collage inventado de diagramas de carga de viento y análisis estructural |
| `inline-custom-pergola-engineering-plans-florida` | pergola-permit-south-florida | Plano de permiso inventado |
| `inline-pergola-design-build-installation-detail-plan` | design-build-pergola-process-south-florida | Plano de obra inventado |

Un contratista **con licencia** publicando documentación de ingeniería y permisos que
no existen no es un problema de estética. Es el hallazgo principal de esta auditoría.

---

## Qué se ha corregido

| Defecto | Antes | Ahora |
|---|---|---|
| Imágenes generadas por IA en el cuerpo | 62 | **0** |
| Fotografía real en el cuerpo | 0 | **40**, de 13 obras con ciudad verificada |
| Huecos sin fotografía honesta | — | **22 retirados**, no rellenados |
| Enlaces internos contextuales | 0 en 21/21 | **69** (3–5 por artículo) |
| CTA finales enlazados | 0 de 42 | **42** |
| `<h1>` dentro del cuerpo | 3 | **0** |
| Tabla comparativa legible | no (18 celdas pegadas en un `<p>`) | **sí**, `<table>` semántica |
| `alt` vacíos | 11 | **0** |
| Paridad ES de todo lo anterior | — | **completa** y verificada |

Las 20 puertas del repositorio pasan (`npm run check`, salida 0), incluida
`check:generadores`, que regenera y compara: la salida comiteada es exactamente la que
producen los generadores.

---

## Las dos decisiones que hay que conocer

### 1. La fotografía sale de las obras publicadas, no de `public/photos/`

`public/photos/` trae **148 fotografías reales** sin versionar. Se inventariaron las
148 (ver `02b`), y una buena parte **coincide visualmente** con obras ya publicadas.
Pero coincidir no es constar: ninguna lleva proyecto ni ciudad documentados.

Las reglas del encargo son explícitas —«No uses una foto de Pompano Beach como
representación documental de una obra en Boca Raton»— así que las 40 que entran salen
de `public/cms-img/projects/`: 13 obras con **proyecto y ciudad verificados**, ya
optimizadas y ya versionadas. Donde no había foto honesta, el hueco se quitó.

Las 148 siguen siendo material de valor y enseñan cosas que las 68 publicadas no
tienen (detalle de lamas abiertas, cortinas motorizadas en funcionamiento, pérgolas de
madera real, cerramientos de mosquitera). Incorporarlas necesita una cosa que no está
en el repositorio: **que el cliente diga de qué obra y de qué ciudad es cada una.**

### 2. Fort Lauderdale no tiene obra fotografiada

El artículo que compara Boca Raton con Fort Lauderdale no puede ilustrar la segunda
ciudad: no hay ni una obra fotografiada allí. Se ilustra con Hillsboro Beach —mismo
condado (Broward), misma exposición costera— y **el `alt` dice la ciudad real**. En
ningún sitio se rotula una foto como Fort Lauderdale.

---

## Lo que sigue abierto

1. **10 miniaturas de IA siguen vivas en las 25 páginas de ciudad.** Fuera de los 21
   artículos, pero el mismo defecto: `/pergolas-contractors/*` pinta una banda de blog
   con miniaturas antiguas generadas por IA. Son 10 ficheros en 25 páginas
   comerciales. Es el primer pendiente.
2. **93 imágenes de IA quedan huérfanas en el repositorio** (17,0 MB en
   `public/cms-img/blog/`). Ya no las pide ninguna página, pero siguen desplegándose y
   son accesibles por URL. No se han borrado: eliminar 93 ficheros versionados es una
   decisión del cliente, y `check:imagenes` ya las reporta.
3. **Sin datos de rendimiento.** No hay acceso a Search Console, Bing Webmaster ni
   GA4 en esta sesión. Todo lo que dependía de ellos está marcado **NO EJECUTADO**, no
   estimado. El plan de medición está en `11`.
4. **Propuestas editoriales sin aplicar** (`09`): el texto de los 21 artículos no se ha
   reescrito, por diseño. Lo que pide redacción nueva está documentado y pendiente de
   aprobación.

---

## Entregables

| | |
|---|---|
| `01-arquitectura.md` | Cómo se generan los 21 artículos y por qué el arreglo va donde va |
| `02-inventario-visual.csv` | Las 68 fotos de obra, con ciudad verificada y qué se ve |
| `02b-fotos-nuevas-sin-incorporar.csv` | Las 148 de `public/photos/`, inventariadas |
| `03-matriz-imagenes.csv` | Qué entra, qué sale y por qué, imagen a imagen |
| `04-auditoria-seo.csv` | Los 21 artículos, antes y después, campo a campo |
| `05-enlaces-internos.csv` | Los 111 enlaces, con origen, destino y validación |
| `06-geo-aeo-aio.md` | Evaluación GEO, AEO y AIO |
| `07-seo-tecnico.md` | Canónicas, hreflang, sitemap, robots, datos estructurados |
| `08-scorecard.csv` | Puntuación por artículo, antes y después, con su rúbrica |
| `09-recomendaciones-editoriales.md` | Lo que necesita aprobación antes de tocarse |
| `10-validaciones.md` | Qué se ejecutó, qué salió y qué NO se pudo comprobar |
| `11-plan-90-dias.md` | Qué medir, dónde y cuándo |
