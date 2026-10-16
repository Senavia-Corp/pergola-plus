# GEO, AEO y AIO — evaluación de los 21 artículos

Una advertencia antes de nada, porque condiciona cómo hay que leer este documento:
**no existe un formato que garantice aparecer en AI Overviews, en ChatGPT Search ni en
Perplexity.** Nada de lo que hay aquí promete una citación. Lo que sí se puede hacer
—y es lo que se ha hecho— es quitar lo que descalifica una página como fuente y dejar
lo que la hace comprobable.

---

## GEO — el contenido como fuente verificable

### El problema que había, en una frase

Los 21 artículos ilustraban su contenido con **62 fotografías de obras que no existen**,
incluidos un análisis estructural y dos planos de permiso inventados. Para una empresa
cuyo argumento central es estar **con licencia** y calcular estructuras, eso no es un
detalle: es la propia página contradiciendo su afirmación de autoridad.

### 15.1 Entidades

Sin cambios, y estaban bien. La terminología de producto es consistente en los 21
artículos y coincide con las fichas del sitio: *FORTE*, *FORTE Plus*, *ECLIPSE*,
*louvered roof*, *motorized screens*, *privacy wall*, *cabana*, *carport*. Las ciudades
que se nombran existen todas como página propia (`/pergolas-contractors/<ciudad>`), y
ahora **cinco de ellas están enlazadas** desde el artículo de códigos, que es donde se
nombran una a una.

No se ha añadido ninguna ciudad ni ninguna entidad que el texto no dijera ya.

### 15.2 Claridad de marca

Verificado: los 21 artículos declaran `Pergola Plus Florida` como `author` y
`publisher` del `BlogPosting`, con la URL del sitio. No hay autor ficticio —no hay
campo de autor en ningún CSV del export, y la organización es un autor honesto—.

### 15.3 Experiencia de primera mano

Aquí está el cambio grande. **Antes:** la única evidencia real eran las 21 portadas.
**Ahora:** 40 fotografías de obra terminada en el cuerpo, de 13 proyectos, con ciudad
verificada y con ficha propia publicada en el sitio (`/project/<slug>`), que es
exactamente lo que hace comprobable una afirmación de experiencia.

Cobertura por ciudad de las 40:

| Ciudad | Fotos | Ciudad | Fotos |
|---|---|---|---|
| Delray Beach | 12 | Riviera Beach | 3 |
| Palm Beach Gardens | 6 | Boca Raton | 4 |
| West Palm Beach | 4 | Hillsboro Beach | 4 |
| Greenacres | 4 | Elan Polo Club (comercial) | 3 |

**Lo que NO se ha hecho:** convertir ninguna foto en un caso de estudio. Los `alt`
describen lo que se ve y nombran la ciudad **solo** cuando el proyecto la documenta.
Ningún artículo afirma que la obra de la foto sea un encargo del tipo que describe el
texto.

### 15.4 Evidencia y citaciones

Los 21 artículos hacen afirmaciones que **requieren fuente** y hoy no la llevan:
cargas de viento de 170–175+ mph, exigencias del Florida Building Code, requisitos de
HVHZ, profundidades de zapata, horquillas de precio, plazos de tramitación.

**No se ha añadido ni una sola fuente, y no se ha tocado ni una cifra.** Verificar cada
afirmación contra el Florida Building Code vigente y la documentación del fabricante es
trabajo editorial con responsabilidad legal, y hacerlo a ojo sería exactamente el fallo
que este encargo viene a cerrar. Está documentado como propuesta en `09`, con la lista
de afirmaciones y dónde habría que comprobarlas.

Lo que sí se ha hecho es **dejar de ilustrar esas afirmaciones con documentación
falsa**, que las empeoraba.

### 15.5 Ganancia de información

Lo que hace útil y original a estos artículos es la fotografía de obra propia, y ahora
está dentro del texto y no solo en la portada. El texto no se ha reescrito.

### 15.6 Aptitud para ser citado

Las explicaciones se entienden fuera de contexto. La mejora medible aquí es la **tabla
comparativa**: antes era un párrafo con 18 celdas pegadas
(`FactorBoca RatonFort LauderdaleAvg. Price Per Sq Ft$90–$150+…`), ilegible tanto para
una persona como para cualquier sistema que lo lea. Ahora es una `<table>` con
`<caption>`, `<th scope="col">` y `<th scope="row">`: cada dato sabe de qué columna y
de qué fila es.

---

## AEO — responder a la pregunta

### 16.1 y 16.2 Pregunta principal y calidad de la respuesta

La pregunta principal de cada artículo está en `04-auditoria-seo.csv`. **Los 21
responden a su pregunta principal** en el propio texto, y lo hacían antes: el contenido
editorial del cliente es correcto en intención y estructura. Ese no era el problema.

### 16.3 Estructura de la respuesta

| | Antes | Ahora |
|---|---|---|
| Artículos con jerarquía de encabezados correcta | 20 de 21 | **21 de 21** |
| Tablas legibles | 0 de 1 | **1 de 1** |
| Elementos que parecen clicables y no lo son | 42 | **0** |

Los dos CTA finales eran `<h3>` sin enlace. Además de no llevar a ninguna parte,
**entraban en el índice lateral como si fueran secciones del artículo**: un lector (o un
sistema) que leyera el índice veía «Schedule a Design Consultation» anunciada como una
sección y no la encontraba. Ahora son enlaces y han salido del índice.

### 16.4 FAQ

**No se han añadido FAQ, y es deliberado.** Google retiró los FAQ rich results en 2026;
añadir bloques de preguntas al blog para intentar recuperarlos sería optimizar para un
resultado que ya no existe. El sitio además ya tiene una biblioteca de preguntas real
(`/resources/faq`) con su propio contenido.

### 16.5 Límite de cambio editorial

Lo aplicado automáticamente se ha ceñido a lo que el encargo autoriza: jerarquía,
formato semántico, reparación de tabla, enlaces y presentación. **No se ha reescrito
ni un párrafo.** La voz del cliente está intacta.

---

## AIO — preparación para búsqueda generativa

### 17.1 Elegibilidad técnica

Comprobado sobre `dist/`, con las puertas del repositorio:

| Comprobación | Estado | Dónde se verifica |
|---|---|---|
| Una canónica por página, absoluta, autorreferencial | ✅ 21/21 | `check:seo` |
| Sin `noindex` indebido | ✅ | `check:noindex` |
| `hreflang` recíproco en/es y con el idioma correcto | ✅ 21/21 | `check:i18n` |
| Contenido principal en el HTML servido, sin JS | ✅ | `check:blog`, `check:paginas` |
| Enlaces internos alcanzables y existentes | ✅ | `check:paginas` |
| JSON-LD válido | ✅ | `check:seo` |
| `og:type: article` | ✅ 21/21 | `check:seo` |

**Lo que NO se afirma:** que estas páginas estén *indexadas*. Accesible, rastreable,
indexable e indexado son cuatro cosas distintas, y la cuarta solo la puede decir Search
Console. No hay acceso en esta sesión → **NO EJECUTADO**.

Nota de despliegue: el build sin `PUBLIC_ES_PRODUCCION=1` sirve `robots.txt` con
`Disallow: /` y no publica sitemap. Es deliberado y correcto —el dominio sigue sirviendo
el Webflow en vivo— pero significa que **hasta que no se despliegue con esa variable, no
hay nada que indexar**.

### 17.2 Estructura del contenido

Encabezados claros y coherentes, un solo `<h1>` por página, tabla legible, índice
lateral que ahora solo contiene secciones reales. No se han añadido microfragmentos ni
texto oculto para sistemas de IA: eso está expresamente prohibido en el encargo y no
funcionaría.

### 17.3 Query fan-out

Resumen por clase de consulta, sobre el contenido actual:

| Clase | Estado | Dónde |
|---|---|---|
| «cuánto cuesta una pérgola…» | **RESPONDIDA** | 2 artículos con horquillas y desglose |
| «¿hace falta permiso?» | **RESPONDIDA** | permit + building-codes |
| «¿qué exige mi HOA?» | **RESPONDIDA** | hoa-rules |
| «¿cuánto tarda?» | **RESPONDIDA** | how-long, con fases |
| «aluminio o madera» | **RESPONDIDA** | aluminum-vs-wood |
| «¿aguanta un huracán?» | **PARCIAL** | explica el principio; las cifras no llevan fuente |
| «¿qué garantía tiene?» | **FUERA DEL BLOG** | existe `/resources/warranties` |
| «¿cuánto sube el valor de mi casa?» | **NO RESPONDIDA** | se afirma de pasada, sin respaldo → ver `09` |

**No se han creado artículos nuevos** para cubrir huecos: el encargo lo prohíbe
expresamente para variantes menores, y los dos huecos reales necesitan datos que hay que
verificar antes de escribir.

### 17.4 Preparación multimodal

| | Antes | Ahora |
|---|---|---|
| Imágenes del cuerpo que muestran obra real | 0 de 62 | **40 de 40** |
| `alt` descriptivos escritos mirando la foto | 51 de 62 (sobre imágenes falsas) | **40 de 40** |
| `alt` vacíos | 11 | **0** |
| `alt` traducidos al español | 0 | **40** |
| `width`/`height` declarados (sin salto de layout) | sí | **sí** |
| `image` del `BlogPosting` resoluble | sí | **sí** |

Medido en la página construida: las fotografías se sirven a 1250 px para un display de
636 px, o sea **1,97×** — por encima del umbral de 1,5× que usa la auditoría de nitidez
del repositorio.

### 17.5 Visibilidad en IA

**NO EJECUTADO.** No hay acceso a Search Console, a Bing Webmaster Tools ni a GA4 en
esta sesión, y no se ha observado ninguna respuesta generativa real. No se inventa
ninguna cifra, ninguna citación y ninguna «posición en IA», que además no es una
métrica que exista. El plan para medirlo cuando haya acceso está en `11`.
