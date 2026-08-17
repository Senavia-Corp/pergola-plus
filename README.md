# Pergola Plus Florida

Sitio migrado desde Webflow a Astro. El CSS y el JS de Webflow
(`public/css/pergola-plus-florida.webflow.css`, `public/js/webflow.js`) se
conservan **verbatim**: `webflow.js` lleva dentro las interacciones IX2 del
sitio y los `data-w-id` del HTML son su llave. Borrar uno mata su animación sin
dar ningún error.

## La referencia de la auditoría vive en el repo

`scripts/auditar-paridad.mjs` compara las 99 páginas construidas contra las **100
capturas del sitio en vivo** que hay en `docs/vivo/`. Son irreemplazables: el
sitio en vivo puede cambiar o caerse, y sin ellas no hay forma de demostrar que
la migración cuadra.

Estuvieron en `/tmp`, en el scratchpad de una sesión que ya no existía. Seguían
ahí de milagro. Ahora están versionadas: 5,6 MB en disco, 1,1 comprimidos.

**Regla que salió de un incidente real:** `src/contenido-migrado/` es SALIDA
GENERADA de `scripts/lib/transformar.mjs`. Los fragmentos y el transformador
tienen que viajar **siempre en el mismo commit**. Editar un fragmento a mano
funciona hasta que alguien regenera y se lo lleva por delante — pasó con la
retirada del widget de Google Reviews, que hubo que rehacer dentro del
transformador (`ELFSIGHT_RESENAS`).

La puerta es `npm run check:generadores`. Cubre los **dos** modos de deriva:

| | Qué detecta | Caso real |
|---|---|---|
| **Fuente** | Un script lee de fuera del repo, o la fuente no está | Las capturas vivieron en `/tmp` y al traerlas se repuntó un script de cuatro |
| **Contenido** | Alguien editó salida generada a mano | Los 40 fragmentos del widget de Google Reviews |

Hacían falta las dos: una puerta que solo diffee fragmentos **no habría cazado
la primera**. Mientras `/tmp` existiera, el diff salía vacío y todo parecía
sano — y el reparto era el peor posible, porque la auditoría de paridad seguía
en verde leyendo del repo mientras regenerar quedaba imposible. Por eso la
puerta afirma de dónde ha leído antes de comparar nada, y por eso falla en vez
de pasar cuando no puede regenerar: una puerta que pasa porque no pudo
ejecutarse es peor que no tenerla.

## Las imágenes: el manifest tenía que ser reproducible y no lo era

`npm run check:imagenes` (sobre `dist/`, después de `npm run build`) demuestra que
todo lo que el sitio pinta está en local: las 560 del manifest presentes y con su
sha256, instaladas en `public/`, las 555 rutas que pide `dist/` resueltas en
disco y **cero referencias al CDN de Webflow**.

Salió de buscar una cosa y encontrar otra. `descargar-imagenes.mjs` encolaba
**una tarea por referencia** y la que llegaba primero se quedaba con el nombre,
el rol y el `alt`. Como 55 URLs están referenciadas dos o más veces y en **42 de
ellas una columna trae `alt` y la otra no** (`Img Feature 3` y `Gallery` apuntan
al mismo archivo; `Gallery` nunca trae `alt`), el `alt` de esas 42 salía a cara o
cruz. Medido: dos ejecuciones **idénticas**, sin tocar nada, daban 15 archivos
renombrados y 15 `alt` distintos. `altOriginal` bailaba entre 259 y 267.

Y era peor que un simple baile, porque se realimentaba: la caché de reanudación
lee del manifest anterior, así que el nombre que salía en una ejecución decidía
qué ruta era rápida en la siguiente. El resultado se estabilizaba solo hasta que
cualquier descarga nueva volvía a barajarlo, y entonces el cambio persistía.

No se vio antes porque **no rompe nada visible**: el sitio renderiza igual con
`alt=""`. Solo se nota en el manifest, que es justo lo que llevará el `alt` a
Sanity — es decir, se habría descubierto ya subido.

El arreglo es que la resolución no dependa del orden: las referencias a una misma
URL se funden **antes** de tocar la red y gana la que trae `alt` (a igualdad, el
rol más específico). Ahora tres ejecuciones seguidas dan `assets` idénticos byte
a byte, y `altOriginal` se queda fijo en **270** — tres más de los que había
comiteados, porque ya no se pierde ninguno en el sorteo.

De paso, dos cosas más que estaban rotas en silencio:

| | Qué pasaba |
|---|---|
| **Nombres de folleto** | Webflow encadena hashes al re-subir (`{nuevo}_{viejo}_...`) y codifica el nombre **dos veces** (`%2520`). Las 23 portadas se llamaban `cover-6942c032...-brochure-20cover.jpg` |
| **`rm -rf public/images`** | `instalar-assets.mjs` borraba el destino antes de copiar, y esa carpeta **sí está en git**: se llevaba por delante 20 archivos que no salen del export (`En.svg`, `Sp.svg`, `project-estimator.svg`, `Icon-*.svg`, variantes `-p-NNN`). Solo se salvaban por estar versionados |

El placeholder `plugins/Basic/assets/placeholder.60f9b1840c.svg` **ya devuelve 403
permanente**. Está internalizado en git, así que el sitio va; `instalar-assets.mjs`
ya no lo vuelve a pedir si el archivo está en disco. Es el aviso de que la
ventana para depender del CDN de Webflow está cerrándose de verdad.

## El shell (Nav y Footer) es código nuestro

`src/components/Nav.astro` y `src/components/Footer.astro` los generó en su día
`scripts/generar-shell.mjs` a partir del export de Webflow. **Ya no.** Desde el
rediseño del menú son de autoría propia y se editan a mano.

El script sigue ahí por trazabilidad, pero exige `--regenerar-shell` y avisa de
que sobrescribe: regenerar se llevaría por delante el rediseño, los enlaces
«View all», «Project Estimator» y la retirada de Elfsight.

El CSS del menú vive en `src/styles/menu.css`, importado desde `Nav.astro`.
Nunca se toca el CSS migrado de Webflow.

## El blog es código nuestro

`/resources/blog`, `/resources/blog/<categoría>` y `/post/<slug>` tampoco salen
de una captura del sitio en vivo. Leen los dos CSV del CMS en `src/data/` en
tiempo de build a través de `src/lib/blog.ts`, y de ahí salen las tarjetas, los
contadores por categoría, el RSS y el JSON-LD.

Los CSV están **dentro del repo** a propósito. `scripts/generar-detalle.mjs` los
lee de `~/Downloads`, y eso vale para un generador que se ejecuta a mano; como
entrada de build rompería el despliegue en Vercel, donde esa ruta no existe.

Los dos generadores siguen conociendo estas rutas y siguen escribiendo sus
fragmentos —son la única copia en el repo del markup original, útil para
diffear— pero **no sobrescriben las páginas**:

| Generador | Guarda | Qué protege |
|---|---|---|
| `generar-paginas.mjs` | `Set` `MANUALES` | `src/pages/resources/blog.astro` |
| `generar-detalle.mjs` | `paginaPropia: true` en `COLECCIONES` | `src/pages/post/[slug].astro` |

Saltárselas exige `--regenerar-manuales` en cualquiera de los dos, y eso borra el
rediseño. En `generar-detalle.mjs` la guarda es obligatoria por una razón
concreta: su plantilla es **una sola cadena compartida por las 8 colecciones**,
así que el JSON-LD y el anterior/siguiente del blog habrían caído también sobre
products, services, project, brands, countries, pergolas-contractors y articles.

El CSS vive en `src/styles/blog.css`. La puerta es `npm run check:blog`, que se
ejecuta sobre `dist/` después de `npm run build` y comprueba las cuentas por
categoría (9/6/3/2/1), que no queda ni un `opacity:0` en línea, que el RSS está
bien escapado y que **la animación de entrada sobrevive a la minificación**.

Esa última comprobación existe porque estuvo rota y en silencio. El minificador
fusionaba el atajo `animation` con `animation-timeline` en
`animation: .5s ease-out both pp-entrada view()`, y como `animation-timeline` no
forma parte de ese atajo en la especificación, el navegador tiraba la declaración
entera: `animation-name` quedaba en `none` y **las 22 entradas del listado no se
ejecutaban**. No se veía roto —el estado base es `opacity: 1`—, así que solo salió
midiendo el computed en el navegador. La regla usa ahora propiedades largas con
`animation-name` declarado aparte. **No volver al atajo.**

### La página del artículo

De cada fragmento migrado de `/post/<slug>` se aprovecha **solo el texto**
(`src/lib/articulo.ts`). La cabecera y la barra lateral se descartan a propósito:

- La cabecera traía `opacity:0` **en línea** y los posts no llevan bloque
  anti-FOUC — medido: 4 en línea, 0 bloques. Sin JavaScript, el `h1` y la imagen
  principal eran invisibles en los 21 artículos.
- La barra lateral eran 10 tarjetas **hardcodeadas e idénticas** en los 21 posts:
  7,9 KB de los 17 KB del fragmento y 210 enlaces internos casi duplicados. La
  sustituyen el índice y 3 relacionados de verdad, de la misma categoría.

El módulo además degrada a `h2` los `<h1>` que vienen dentro del cuerpo (había 3
en `aluminum-pergola-cost-boca-raton-vs-fort-lauderdale`, que con el de la página
hacían 4 en un mismo documento) y pone un `id` slug a cada encabezado, que es lo
que habilita el índice y los enlaces profundos.

Medidas de lectura, antes y después:

| | Antes | Ahora |
|---|---|---|
| Cuerpo | 14px | 18px |
| Interlineado | 1,5 | 1,7 |
| Caracteres por línea | 94 | 68 |
| `h2` | 40px, `margin-top: 0` | 28px, 70px de aire |
| Encabezados | `capitalize` forzado | tal cual se escribieron |

**Solo se generan rutas para las categorías con artículos** (5 de 9). Las tres
vacías dan 404, y es deliberado: una categoría sin artículos no es una sección
del sitio, es una fila del CMS. El caso claro es `service-areas` — el sitio ya
tiene **29 páginas reales de zonas** (`/about-us/where-we-work`, 3 de condado y
25 de ciudad), así que una página «Service Areas» sin contenido solo confunde,
aunque lleve `noindex`. Es data-driven: en cuanto el cliente publique en una de
las tres, su ruta aparece sola en el siguiente build.

Efecto secundario buscado: **no hay estado vacío** porque no puede alcanzarse.
Nadie llega nunca a un grid en blanco.

Tres cosas quedan pendientes del cliente en el CMS:

- **`Featured?` está en `true` en 10 de 21 posts**, así que no sirve para elegir
  destacado. El que manda es `Super Blog`, que marca uno solo. Convendría
  desmarcar los demás.
- **`Categories.Description` está vacío en las 9 filas.** Las entradillas de las
  5 categorías con artículos son copy provisional dentro de `src/lib/blog.ts`;
  en la Fase 3 se mueven a ese campo.
- **Cuatro filas sobran en `Categories`.** `view-all` es un control de interfaz
  metido en los datos, y `service-areas` pisa conceptualmente a las 29 páginas
  de ubicación. `commercial-projects` y `patio-hardscape-services` sí son temas
  de artículo plausibles, solo les falta contenido.

## La puerta: `npm run check`

Once comprobaciones encadenadas. Ninguna depende de que alguien se acuerde de
ejecutarla, y ninguna pasa por casualidad: todas fallan con código ≠ 0 y dicen en una
línea qué se rompió.

```bash
npm run check
```

| Puerta | Qué impide |
|---|---|
| `check:blog` | Que el minificador se coma `animation-timeline` y las entradas dejen de animarse |
| `check:enlaces` | Que vuelva un `href="#"` sin destino |
| `check:carruseles` | Que los slides 2..N vuelvan a ser inalcanzables |
| `check:imagenes` | Que el sitio pida una imagen que no está en local |
| `check:paridad` | Que se pierda un `data-w-id` y muera una animación en silencio |
| `check:generadores` | Que alguien edite salida generada a mano y la siguiente regeneración se lo lleve |
| `check:formularios` | Que un formulario deje de enviar, o que el endpoint acepte basura |
| `check:i18n` | Que se publique español a medias o un `hreflang` que miente |
| `check:seo` | Que vuelva un título duplicado, una canónica cruzada o un campo vacío del CMS |
| `check:paginas` | Que salga un `undefined` en pantalla o un enlace interno a un 404 |

**`dist/` cambia de forma en cuanto hay UNA ruta de servidor**: los HTML pasan de
`dist/` a `dist/client/`. Bastó con añadir `/api/lead`. Las ocho puertas leían
`dist/*.html` y ninguna habría fallado — se habrían quedado sin ficheros que mirar y
habrían salido **en verde**. Por eso `scripts/lib/dist.mjs` lanza si no encuentra
HTML en ningún sitio: una puerta vacía es peor que una puerta roja.

## Formularios

Los tres postean a `POST /api/lead` (`src/pages/api/lead.ts`). La validación es de
**servidor** porque ahí está la frontera: la del navegador se la salta un `curl`.

**Funciona sin JavaScript**: POST nativo → `303` → `/thank-you`. Con JS se
intercepta, se reúnen todos los errores en un resumen enfocable y no recarga. Si esta
capa no carga, no se pierde ni un lead.

`entregarLead()` (`src/lib/lead.ts`) es la **única costura**: log NDJSON, archivo
local y webhook opcional. El correo transaccional queda fuera de alcance, con su
`TODO(correo)` en el sitio exacto. Si fallan los tres canales, `500` — al visitante
que ya escribió sus datos no se le dice «gracias» cuando no han llegado.

Dos trampas que costaron encontrarse y están documentadas en el código:

- **`data-turnstile-sitekey` mataba las dos páginas de captación.** `webflow.js` lo
  detecta, carga Turnstile y deja *todos* los formularios de la página en
  `w-form-loading` con el submit `disabled`, esperando un widget que este sitio no
  renderiza. El sitekey vive ahora en `.env.example`.
- **Astro trae protección CSRF de serie.** Un POST sin `Origin` recibe 403 antes de
  llegar al endpoint. Está fijado en `check:formularios` para que nadie lo apague sin
  darse cuenta.

## Idiomas

**El HTML migrado no se duplica.** `traducirHtml()` (`src/i18n/index.ts`) reutiliza el
markup del export y sustituye solo los nodos de texto —lo que hay entre `>` y `<`,
nunca atributos—, así que `data-w-id`, anti-FOUC, clases e imágenes quedan intactos y
las interacciones IX2 funcionan igual en español.

| Archivo | Qué |
|---|---|
| `rutas.mjs` | El mapa `TRADUCIDAS`. En `.mjs` porque lo leen el sitio **y** el build |
| `index.ts` | `idiomaDeRuta()`, `rutaEnIdioma()`, `traducirHtml()`, `esInvariante()` |
| `shell.ts` | rótulos de nav y pie en los dos idiomas |
| `paginas.es.ts` | registro de páginas ESTÁTICAS traducidas + sus diccionarios |
| `comun.es.ts` | lo que se repite en ~150 páginas (CTA, formularios, sellos) |
| `servicios.es.ts` · `productos.es.ts` · `ubicaciones.es.ts` · `marcas.es.ts` · `proyectos.es.ts` · `condados.es.ts` · `articulos.es.ts` | un registro por colección |

**Añadir una página traducida son dos líneas**: una entrada en el registro de su
colección y su ruta en `TRADUCIDAS`. Los metadatos (`wfPage`, anti-FOUC) salen del
mismo `_meta.json` / `_items.json` que generó la versión inglesa, así que no pueden
divergir. Una entrada sin ruta no rompe nada: la página simplemente no se genera.

**Lo compartido abarata lo siguiente.** Una página de ubicación tiene 138 cadenas y
solo **5** son suyas; el resto ya está en `comun.es.ts`. Cuando una cadena aparece en
más de una página, se mueve ahí — el build avisa por consola de cada cadena sin
traducir y `check:i18n` exige ≥98 % por página.

Estado: **78 páginas de 184.** Todo menos el blog (índice + 21 artículos + 5
categorías) y el contrato de obra; los dos motivos están en `docs/decisiones.md`. Lo que no está traducido **no existe en `/es/`, no
lleva `hreflang` y no entra en el sitemap**: media traducción publicada es peor que
ninguna. Medido: `hreflang="es"` en 154 de 184, y las 30 restantes son exactamente
esas dos cosas más los dos 404.

**La página de gracias existe en los dos idiomas** y el destino lo decide el servidor
a partir del campo `pagina` del envío, no del navegador. `check:formularios` envía uno
desde `/es/` y exige `/es/thank-you`.

Para saber cuánto queda de una página antes de empezarla:

```bash
npm run extraer -- --resumen
```

Y para no transcribir claves a mano —que es donde se cuela el espacio fino de no
separación que deja la línea en inglés—:

```bash
npm run extraer -- src/contenido-migrado/services/pavers.html --esqueleto
```

Una cadena que no esté en el diccionario **se queda en inglés** (degradado visible, no
roto) y el build la lista por consola. Correos, teléfonos, direcciones y marcas no
cuentan como ausencia: no es lo mismo un olvido que algo que no se traduce.

El selector vive en el nav: escritorio a la derecha de los CTA, móvil en la barra
superior junto a la hamburguesa. Las banderas van **inline** en `Nav.astro`;
`public/images/En.svg` y `Sp.svg` NO se usan porque no llevan `<style>` ni `fill` y se
verían negras.

## Terceros

Queda **uno**: jQuery, que `webflow.js` necesita para existir. Cero peticiones a
Google para ver la página.

- **Inter va autoalojada** (`npm run fuentes`). Antes se cargaba con `webfont.js` de
  `ajax.googleapis.com`, en el `<head>` y sin `defer`: un tercero que bloquea el
  render, ~20 KB de JS antes de pintar nada, y solo entonces la fuente desde otro
  dominio.
- **OnceHub va tras una fachada diferida** (`src/components/Agenda.astro`). Su
  contenedor mide 0 px hasta que inyecta su iframe, así que la fachada reserva los
  550 px: diferir sin reservar habría empeorado el salto, no arreglado.

## Las reseñas de Google: el sitio las prometía y no tenía ninguna

`/about-us/testimonials` se titula «Client Reviews», dice «Real reviews. Real
craftsmanship. Proven results.»… y **estaba vacía**. El único contenido que tuvo
fue el widget de Elfsight, cuya API devuelve `WIDGET_DISABLED` desde antes de la
migración. Llevaba tiempo muerto en las 40 páginas que lo incrustaban y nadie se
enteró, porque **un widget vacío no da error**.

Ahora hay un carrusel propio, renderizado en el servidor. La diferencia que
importa no es estética: el texto de un widget vive dentro de un iframe de otro
dominio, o sea **invisible para los buscadores y para las respuestas de IA**. Es
justo el valor que se busca al publicar reseñas, más que el adorno.

**No hay ni una reseña inventada, y el JSON arranca vacío.** No es un descuido:
en este repo no existe ninguna reseña real de la que partir —el widget nunca metió
texto en el HTML— y una reseña falsa en el sitio de un contratista no es un
detalle de maquetación. Con la lista vacía, el componente **no renderiza nada**:
ni carrusel vacío, ni «aún no hay reseñas», ni relleno.

| Pieza | Qué |
|---|---|
| `src/data/reviews-google.json` | El snapshot. Se versiona |
| `src/lib/reviews.ts` | `getReviews()`, **el único punto de sustitución** |
| `scripts/traer-resenas.mjs` | El fetch a Google Business Profile. `npm run resenas` |
| `src/components/ReseñasGoogle.astro` | El carrusel |
| `src/i18n/resenas.ts` | Los rótulos, en los dos idiomas |
| `src/lib/resenas-rutas.mjs` | En qué rutas va. Lo leen el build **y** el sitio |

### Por qué Business Profile y no la Places API

Parecía el atajo obvio y no lo es. Verificado en la documentación:

| | Places API | Business Profile API |
|---|---|---|
| Cuántas reseñas | **máximo 5** | todas |
| Guardar el contenido | **prohibido** por su política; solo el `place_id` está exento | son contenido del propio negocio |
| Respuesta del dueño | no la da | `reviewReply` |
| Coste | SKU Enterprise + Atmosphere | cuota del perfil propio |

Es decir: un `reviews-google.json` comiteado con datos de Places sería justo el
patrón que su política prohíbe, **y** solo traería 5 reseñas. Con el perfil propio
leído por su dueño, ninguna de las dos cosas aplica.

### El fetch no vive en el build

`getReviews()` lee el snapshot y nada más. Quien habla con Google es
`scripts/traer-resenas.mjs`, que se ejecuta a mano y comitea el resultado.

Si el fetch viviera dentro del build, una caída de Google o un refresh token
caducado **tumbaría el despliegue**. Con el snapshot, lo peor que pasa es que las
reseñas sean de ayer. Es el mismo criterio que ya usan las fuentes y las imágenes:
el despliegue no depende de que un tercero conteste.

Y nunca desde el navegador del visitante: eso publicaría el token, metería un
tercero en un sitio que está en «cero peticiones a Google» y dejaría el texto
fuera del HTML, que es lo único que se quería conseguir.

### Las reseñas NO se traducen, y eso rompía `check:i18n`

Un testimonio traducido por nosotros ya no es lo que escribió esa persona. Salen
en su idioma original en las dos versiones del sitio; solo se traducen los
rótulos.

Pero `check:i18n` cuenta como «sin traducir» todo nodo de prosa con palabras
funcionales inglesas y exige ≥98% por página. Las reseñas inglesas dentro de
`/es/` tumbaban la puerta **por hacer lo correcto**.

El arreglo no es una exención: `nodos()` aparta los subárboles que declaran un
`lang` **explícito y distinto** al de la página. Y declararlo no es un truco para
esquivar la puerta — es lo que necesita un lector de pantalla para cambiar de voz;
sin `lang` lee una reseña inglesa con fonética española. **Para librarse del
recuento hay que hacer antes lo correcto.** Un párrafo que se quedó en inglés por
olvido no lleva `lang` y sigue contando.

Dos guardas alrededor, porque el recorte busca el cierre equilibrado a mano:

- La puerta **comprueba su propia maquinaria** con 10 casos antes de usarla. Si el
  recorte se descontrolara y se comiera medio documento, la cobertura saldría del
  100% midiendo cuatro nodos: verde por no tener nada que comprobar.
- Y falla si la exención aparta más del 35% del texto de una página.

De paso salieron a la luz dos casos legítimos que ya existían: los enlaces del
selector de idioma (`<a href="/es/" lang="en">English</a>`), que se colaban dentro
del margen del 2%.

### Sin `schema.org/Review` ni `AggregateRating`

**A propósito.** El markup de reseñas sobre uno mismo es INELEGIBLE para las
estrellas del SERP según la política de Google y expone a acción manual. Las
estrellas ya salen solas desde la ficha de Business Profile.
`src/lib/jsonld.ts` ya documentaba esta decisión antes del carrusel.

### Dónde va, y por qué cada sitio necesita una vía distinta

`src/pages/` es **salida generada**. Pegar el componente a mano en `index.astro`
funciona hasta que alguien regenera —y mientras tanto `check:generadores` falla.
Es literalmente lo que pasó con la retirada del widget de Elfsight: 40 fragmentos
editados a mano que un `node generar-paginas.mjs` deshizo.

| Ruta | Vía |
|---|---|
| `/`, `/about-us/testimonials`, `/contact-us/get-in-touch` | plantilla de `generar-paginas.mjs`, leyendo `CON_RESENAS` |
| sus tres gemelas en `/es/` | `src/pages/es/[...ruta].astro`, misma lista |
| `/es/` (home) | edición directa: es de autoría propia |
| `/project-estimator` y `/es/project-estimator` | edición directa: son de autoría propia |

Ocho rutas. **No se esparce por las 107**: repetir el bloque en todas lo convierte
en decorado que nadie lee.

`npm run check:carruseles` cubre el carrusel nuevo: exige que llegue a las ocho
rutas con el contrato de Finsweet entero y que **el texto viaje en el HTML
servido**. Con el snapshot vacío no exige markup —el componente no renderiza a
propósito— y lo dice en vez de callarse.

### Y destapó un fallo en el código compartido

`Carrusel.astro` daba la vuelta al principio cuando el salto **se pasaría** del
final. Si el tramo que queda es más corto que un paso, eso es cierto desde el
primer clic: la flecha volvía al principio una y otra vez y **los últimos slides
no se alcanzaban nunca** — el mismo fallo que el componente vino a arreglar,
entrando por la puerta de atrás. Medido: 4 reseñas con 3 a la vista dan un paso de
419 px sobre un recorrido de 411.

Los 127 carruseles migrados nunca lo pisaron porque su `maximo` es múltiplo exacto
del `paso` (8550/950, 1824/304). Ahora se da la vuelta cuando **ya se está** en el
extremo y, si no, se avanza recortando: para ellos el comportamiento es idéntico.

## Nitidez de las imágenes

`check:imagenes` demuestra que la imagen **existe**. No dice nada de si se ve
bien. Una foto de 525×350 pintada en una tarjeta de 400 px pasa esa puerta y se ve
blanda en cualquier pantalla retina, porque a DPR 2 esa tarjeta pide 800 px reales
y solo hay 525.

`npm run auditar:nitidez` mide eso. Corre sobre `dist/` después de `npm run build`
y marca cuatro cosas: **sub-resolución** (px intrínsecos < 1,5 × px de display
real), **blanda** (varianza del Laplaciano baja: tiene los píxeles pero no el
detalle, porque alguien la escaló antes que nosotros), **sobrecomprimida**
(bytes/px anormalmente bajo) y **bloques JPEG**.

Dos honestidades sobre el método, escritas en el propio informe:

- Los umbrales de «blanda» y «sobrecomprimida» salen del **percentil del propio
  corpus**, no de una constante inventada: la varianza del Laplaciano depende del
  contenido, y un cielo liso puntúa bajo aunque esté perfecto.
- La marca de **bloques JPEG casi no aplica aquí**: solo 2 de las 471 imágenes
  servidas son JPEG. AVIF no usa bloques 8×8, así que buscarlos en un corpus 99%
  AVIF sería teatro. Se mide donde corresponde y se dice cuántas son.

**Playwright es devDependency de ese script y de ningún otro, y NO está en
`npm run check`.** El tamaño de display es una propiedad del layout: depende del
CSS, del viewport y de dónde cae la imagen, así que no se puede deducir del HTML.
Pero la puerta sigue sin navegador, que es lo que dice `comprobar-carruseles.mjs`
y sigue siendo cierto: la auditoría es una herramienta, no una puerta.

### Las dos clases de imagen tienen fuentes de verdad distintas

Es lo que hay que entender antes de sustituir ninguna:

| | `/images/*` | `/cms-img/*` |
|---|---|---|
| En git | **SÍ** (165 archivos, 13 MB) | NO |
| Fuente de verdad | el export de Webflow, **fuera del repo** | `assets-migracion/content/` + `manifest.json` |
| En el manifest | solo 57 iconos/logos | 503 entradas con `sha256`/`bytes`/`width`/`height` |
| Qué hace `instalar-assets.mjs` | **copia el export encima** | `rm -rf` y copia del staging |

De ahí sale la trampa: sustituir una foto en `public/images/` y ya **la revierte el
siguiente `instalar-assets.mjs`**, en silencio, sin error y sin ninguna diferencia
visible salvo que se mire el píxel. Es la misma clase de fallo que el `rm -rf
public/images` que se llevaba `En.svg`.

Por eso las regeneradas se anotan en `assets-migracion/regeneradas.json`:
`instalar-assets.mjs` **salta** esas rutas al copiar, y `check:imagenes` comprueba
que lo que hay en disco sigue teniendo el `sha256` anotado. Si alguien las pisa por
otra vía, la puerta **falla a gritos** en vez de que la mejora se pierda callando.

### El manifest: solo cuatro campos, nunca el `alt`

Al sustituir una imagen de `/cms-img/` se actualizan **`sha256`, `bytes`, `width`
y `height`** y nada más. `alt`, `altDerivado`, `altGenerado`, `sourceUrls`,
`usedIn`, `file`, `role` y `subject` no se tocan **jamás**: ese manifest ya tuvo el
bug de no-determinismo que sorteaba a cara o cruz el `alt` de 42 imágenes, y no se
vio durante semanas porque no rompe nada visible.

### El upscale se hace con IA y se desconfía de él

Higgsfield no expone la API de upscale en nuestro plan, así que la generación es
un paso manual. El código hace que sea mecánico y, sobre todo, **filtra la vuelta**:

```bash
npm run auditar:nitidez        # mide y saca informe.md + cola-higgsfield.json
npm run preparar:higgsfield    # deja los originales en ~/Downloads/higgsfield-in/
#   … el paso manual en higgsfield.ai; los resultados a ~/Downloads/higgsfield-out/
npm run integrar:higgsfield    # juzga y genera comparativas. NO escribe
#   … mirar auditoria-imagenes/comparativas/ una a una
node scripts/integrar-higgsfield.mjs --aplicar
```

Se rechaza sin integrar si la relación de aspecto cambia más de un 1%, si no llega
a 1,8× los píxeles, si la nitidez no sube, o si el **SSIM** contra el original
reescalado baja del umbral. Se usa SSIM y no una diferencia de píxeles porque un
upscale legítimo cambia *todos* los píxeles —de eso se trata—; lo que tiene que
sobrevivir es la estructura local.

**Lo que ese filtro NO puede hacer, dicho claro:** el SSIM caza que le hayan
cambiado la composición a la foto, no que la pérgola tenga ahora cinco postes en
vez de cuatro. Eso es un cambio local en pocos píxeles y la estructura global apenas
se mueve. Por eso el script genera los montajes antes/después y por eso hay que
mirarlos uno a uno antes de `--aplicar`. Quien se salte ese paso no está protegido
por nada. Una foto bonita que ya no es la casa del cliente no sirve.

**Sale en AVIF, con el mismo nombre.** El sitio sirve AVIF de archivo único con
`<img src>` plano —cero `<picture>`, cero `srcset` propio—, así que cambiar de
formato obligaría a inyectar `<picture>` en markup migrado verbatim y a reescribir
`check:paridad`. Y la recodificación apunta al mismo bytes/px del archivo que
sustituye: subir la resolución no es excusa para triplicar el peso de la página.

### Después de sustituir, este orden

`transformar.mjs` **hornea `width`/`height` desde `img-dim.json` en tiempo de
generación**. Si cambian los píxeles y no se regenera, `check:generadores` falla:

```bash
npm run medir:imagenes
node scripts/generar-paginas.mjs && node scripts/generar-detalle.mjs
npm run build && npm run check
```

## Estado y pendientes

`docs/estado-final.md` — qué quedó hecho, qué decisiones se tomaron y qué falta,
con nombre y apellidos de quién depende cada cosa.
`docs/decisiones.md` — el registro de decisiones automáticas, incluidas las que
resultaron ser errores de medición propios.

---

## Comandos

| Comando | Qué hace |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo. **Es singleton**: si ya hay uno, `astro dev` no levanta otro, informa de dónde está y termina |
| `npm run build` | Construye a `dist/client/` + la función de `/api/lead` en `.vercel/output/` |
| `npm run check` | **La puerta.** Build + las diez comprobaciones |
| `npm run extraer -- --resumen` | Cuánto queda por traducir, por colección |
| `npm run medir:imagenes` | Remide `public/` y actualiza `src/lib/img-dim.json` (tras añadir imágenes) |
| `npm run auditar:nitidez` | Mide nitidez y sub-resolución de las 471 imágenes. **Necesita `npm run build` antes** |
| `npm run preparar:higgsfield` | Deja el lote y las instrucciones en `~/Downloads/higgsfield-in/` |
| `npm run integrar:higgsfield` | Juzga lo devuelto y saca comparativas. Con `--aplicar` escribe |
| `npm run resenas` | Trae las reseñas de Google Business Profile y reescribe el snapshot |
| `npm run fuentes` | Rebaja Inter de Google a `public/fonts/` |
| `npm run imagenes:cliente` | Reprocesa las fotos del cliente desde `~/Downloads` |

`npm run preview` **no funciona**: el adaptador de Vercel no trae servidor de
preview y muere con *«Preview server process exited before becoming ready»*. Para
ejecutar el endpoint en local se usa `npm run dev`, que corre el mismo
`src/pages/api/lead.ts`.

### Regenerar contenido migrado

```bash
node scripts/generar-paginas.mjs     # las 17 estáticas
node scripts/generar-detalle.mjs     # las 83 de detalle
```

Las dos respetan las páginas de autoría propia (`/resources/blog`, `/thank-you`,
`/post/[slug]`). Pisarlas de verdad exige `--regenerar-manuales`, que es
**destructivo** y se lleva el rediseño por delante.

## Documentación

- `docs/estado-final.md` — qué quedó hecho, qué falta y de quién depende
- `docs/decisiones.md` — decisiones automáticas, con su motivo
- `docs/fase0-hallazgos.md` — el pre-vuelo de la migración
- `docs/redirects.md` — el mapa de 301
