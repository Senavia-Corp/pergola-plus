# Registro de decisiones automaticas

Decisiones tomadas sin preguntar, con su motivo. El orden es cronologico por fase.

---

## Fase 0 — La puerta

**Se commiteo trabajo previo que no era de esta tanda.** Al montar `npm run check`
habia 28 archivos sin commitear en el arbol: el arreglo del manifest de imagenes no
determinista, con su puerta `check:imagenes` ya escrita y en verde. Bloqueaba
`check:generadores`, que se niega a comparar salida generada mientras haya cambios
sueltos. Se commiteo aparte (`8ef696d`) para no mezclarlo, y despues se verifico que
regenerar no cambia nada — o sea, que el arreglo de reproducibilidad funciona.

**`check:imagenes` entra en la cadena.** No estaba en `npm run check` porque la
cadena no existia. Es una puerta real y en verde, asi que se registra.

---

## Fase 1 — Feedback del cliente

**Las imagenes del cliente van a `public/images/cliente/`, no a `public/cms-img/`.**
`cms-img` esta en `.gitignore` y la regenera `instalar-assets.mjs` desde
`assets-migracion/`: un archivo nuevo ahi desaparece en la siguiente regeneracion,
sin error. `public/images/` si esta versionado y ese script nunca borra.

**Un solo ancho y una sola relacion para las 12 fotos: 1250x703.** Es exactamente
lo que miden los heroes del CMS que sustituyen, y las 12 caen en cajas con
`object-fit:cover` y altura fija del CSS migrado, asi que la relacion intrinseca no
la ve nadie. Alternativa descartada: una relacion por slot, que son 12 casos
particulares para un resultado identico en pantalla.

**Recorte con `position:'attention'`, con dos excepciones medidas a ojo.**
`attention` premia la region con mas entropia, que en estas fotos suele ser cielo o
pared blanca. En `Sukkah.jpeg` (1024x1034 -> 1.78:1, recorte grande) se llevaba la
fachada del edificio y dejaba fuera el sukkah iluminado, que es el producto: va con
`south`. En `Forte Plus Hillsboro Estate.jpeg` subia hacia las palmeras: va con
`centre`. Las otras diez se revisaron una a una en una hoja de contactos.

**`Meith_Driveway 2.jpg` se queda con mucho cielo.** El original ya es 1.78:1, asi
que el recorte no quita nada: el encuadre es del cliente y recortarlo solo perderia
la entrada de coches, que es el tema. Se deja como esta.

**Del pergola de techo solido llegaron DOS fotos y solo hay un hueco.**
`Our Products Thumbnails/Solid Roof Pergola.jpg` (1080x1350, vertical) y
`Home Page/Solid Roof Pergolas.png` (1888x1166, horizontal). La ruta que sustituyen
la consumen tres cajas horizontales —tarjeta de 250px de alto en la home y en
`/products`, y el hero de la pagina—, asi que gana la horizontal por perder menos
recorte. La vertical queda sin usar y disponible si el cliente la prefiere.

**Los 3 «Featured Projects» nuevos no se crean como paginas.** `Boca Beach Sukkah`,
`Elan Polo Club` y `Jupiter Ocean Club` traen 8 fotos y CERO texto, y ninguno
coincide con los 10 slugs de `/project/`. `/project-gallery` es una rejilla de
tarjetas con titulo y extracto que enlazan a su pagina, no un lightbox donde soltar
fotos. Por el default «falta contenido para una pagina nueva -> no la crees», se
anotan como pendientes del cliente. Excepcion: `Boca Beach Sukkah/Sukkah.jpeg` es
byte a byte el mismo archivo que el thumbnail del producto, asi que esa si se usa.

**«Landscaping» se retira del menu en los dos idiomas.** No existe
`/services/landscaping` ni en el export ni en el vivo, y no hay contenido con el que
crearla. Era el ultimo `href="#"` vivo del sitio. Compartia imagen de vista previa
(`is-7`) con «Full Outdoor Remodel», asi que no deja ninguna preview huerfana. Su
`data-w-id` esta declarado en `PROPIAS_SHELL` de `auditar-paridad.mjs`, uno a uno y
con motivo: excluir el shell del recuento habria convertido el contador global en un
numero que ya no avisa de nada.

**MaestroShield enlaza al fabricante.** Es la unica de las 5 tarjetas de garantia
sin pagina de marca en el CMS, y su «Read More →» llevaba meses en `href="#"`. La
garantia de MaestroShield la da MaestroShield: se enlaza su sitio con
`target="_blank" rel="noopener"`. De paso se arreglo la comprobacion cruzada de
`check:enlaces`, que con `split('/').pop()` sobre una URL con barra final sacaba
cadena vacia y por tanto pasaba SIEMPRE.

**Los carruseles se arreglan, no se les quitan las flechas.** El punto pedia
«elimina o cablea» los botones sin funcion, y habia ~250. Quitarlos habria dejado 9
de cada 10 proyectos invisibles para siempre: el CSS migrado describe un carrusel
(slides en fila al 100% dentro de un contenedor con `overflow:clip`) que ya no tenia
quien lo moviera. Se cablean con scroll nativo. Detalle en el commit `aae34f5`.

**El scroll suave de las flechas no se pudo verificar en este entorno.** Este
Chrome automatizado no anima ningun scroll suave —falla igual con `snap:none`—
mientras `behavior:'auto'` siempre funciona. Se comprobo la logica propia con un
espia sobre `scrollBy`/`scrollTo`: deltas, paso medido y vuelta en los extremos,
correctos en los dos tipos de carrusel (1 slide por vista y 4). En navegadores sin
soporte de `smooth` la opcion se ignora y el salto es instantaneo, que sigue
funcionando.

**A los dropdowns no les faltaba nada.** Se auditaron por la queja de Daniel y
llego a haber un manejador de Escape propio; se quito. `webflow.js` ya trae Escape,
flechas, Home/End y Space/Enter, enlazados como `keydown.w-dropdown` sobre el
elemento `.w-dropdown`. La trampa: al estar enlazado ahi, Escape solo llega si el
evento burbujea desde dentro, asi que una sonda que despacha el `keydown` sobre
`document` informa de que no cierra cuando si cierra. El `focusout` de Webflow
tambien esta guardado contra el `relatedTarget: null` de iOS.

**Las capturas de pantalla no son fiables en esta sesion.** El panel del navegador
esta oculto, asi que las capturas salen en blanco y el viewport se mide 0x0 si no se
fuerza. Toda la verificacion visual se hace con sondas JS sobre geometria real y con
hojas de contactos generadas con sharp. El viewport 0x0 destapo de paso un bug
propio en el carrusel (paso 0 -> cuenta de puntos NaN -> paginacion borrada), asi
que el estorbo salio a cuenta.

---

## Fase 6 — QA de las 113 paginas

**`/about-us` era un 404 enlazado desde las 113 paginas.** El menu y el pie
apuntaban a `/about-us`, pero la pagina es `/about-us/about-us`. No lo veia ninguna
puerta: `check:enlaces` solo busca `href="#"`, y este enlace SI tenia destino — solo
que a ninguna parte. Corregidos los dos enlaces y anadido un 301 para quien lo tenga
guardado. La puerta que lo caza ahora es `check:paginas`.

**«No items found.» en 27 paginas era un falso positivo MIO.** Ese bloque va dentro
de `.w-dyn-hide`, que `webflow.css` marca `display:none !important`: es el
placeholder de coleccion vacia que Webflow deja siempre en el markup. La sonda leia
texto que nadie ve. Se arreglo la sonda, no el sitio. (Distinto es
`w-dyn-bind-empty`, que SI se ve y lo caza `check:seo` — eso era real y era la
politica de privacidad.)

**El area tactil se agranda con un pseudoelemento, no con padding.** WCAG 2.2 AA
(2.5.8) pide 24x24 px y a 320px habia 142 enlaces en 17-18 px de alto. El padding
habria movido el texto y cambiado la maquetacion de tarjetas que estan bien; el
pseudoelemento crece la zona sensible sin mover un pixel. Medido antes de elegir: el
hueco vertical minimo entre esos enlaces es 8 px y la ampliacion son 3 px por lado,
asi que quedan 2 px y ninguno se come el toque del vecino. Verificado despues: 0
solapes reales.

**`.link` queda fuera y `.link-2` dentro.** `.link` es un enlace dentro de una frase
(«Developed by Senavia Corp.») y la norma tiene excepcion explicita para esos.
`.link-2` lo excluí al principio por el mismo motivo y estaba equivocado: al medir
`/about-us/where-we-work` resulto que son los 24 enlaces del listado de ciudades,
que son navegacion en lista, no prosa.

**El logo de BBB dejaba un enlace SIN NOMBRE accesible.** El `<img>` es lo unico
dentro del enlace y venia con `alt=""`, asi que un lector de pantalla lo anunciaba
como «enlace» y ya, en las 113 paginas. El `alt` se queda vacio —el logo es
decorativo— y el nombre lo pone un `aria-label`. Le faltaba tambien `rel="noopener"`
teniendo `target="_blank"`.

**`document.hasFocus()` NO basta para verificar animaciones.** Medido en este
entorno: `hasFocus() === true` mientras `document.hidden === true` y
`visibilityState === 'hidden'`, con **0 frames de requestAnimationFrame en un
segundo entero**. Con rAF estrangulado, las animaciones de IX2 disparadas por scroll
no avanzan nunca y 14 elementos quedan en `opacity:0`, que se lee exactamente igual
que un fallo real.

La sonda fiable es contar frames de rAF, no preguntar por el foco. Y la verificacion
que SI se puede hacer con la pagina oculta es la del CABLEADO, que es deterministica:
en `/products/motorized-louvered-pergolas`, IX2 conoce los **32 de 32** `data-w-id`
de la pagina, con 200 eventos cargados, `data-wf-page` correcto, `w-mod-ix` puesto y
el disparador `SCROLL_INTO_VIEW` con su configuracion. La reproduccion visual queda
pendiente de comprobar en un navegador visible.

---

## Fase 7 — Cierre: dos decisiones del cliente, tomadas

Las dos se preguntaron explicitamente y estan contestadas. No son trabajo pendiente:
son decisiones tomadas, a la espera de un dato de terceros.

**La politica de privacidad NO se publica hasta que Daniel conteste.** Decision de
Sebastian, 17-ago-2026. La pagina se queda con el aviso honesto y la via de contacto
para ejercer derechos. El borrador completo espera en
`docs/politica-privacidad-borrador.md` con sus cinco `[PENDIENTE]`.

El motivo, para quien lea esto dentro de seis meses: una politica de privacidad es un
compromiso juridico con el visitante y con el regulador. El texto que hay descripe lo
que el sitio hace de verdad —eso se puede verificar leyendo el codigo— pero cuanto
tiempo se conservan los datos o si se comparten con terceros son hechos del NEGOCIO, y
publicarlos rellenados a ojo seria afirmar por escrito cosas que quiza no son ciertas.
Una pagina en blanco es un problema; una pagina que miente es otro peor.

**Los leads se quedan yendo solo al log hasta que haya URL de CRM o correo.** No hay
webhook disponible a dia de hoy. El endpoint ya hace POST del lead en JSON a
`LEAD_WEBHOOK_URL` en cuanto exista esa variable: no hace falta tocar codigo, ni
credenciales, solo la URL.

Mientras tanto la defensa es que sea imposible desplegar sin enterarse: cada build
imprime un aviso enmarcado y `check:formularios` comprueba que ese aviso sigue ahi.
Un aviso que alguien borra «porque hace ruido» es exactamente como se pierde esto de
vista.

---

## Español: dónde se paró, y por qué justo ahí

**17-ago-2026.** El sitio pasó de 1 página en español a **77**. Está traducido todo
menos el blog y el contrato de obra, y las dos exclusiones son deliberadas — ninguna
por haberse quedado sin tiempo.

Lo que SÍ está: la home, los índices de productos y servicios, **las 10 fichas de
producto**, **las 7 de servicio**, **las 25 páginas de ubicación** con su índice, los
**3 condados**, las **5 marcas** con su índice, las **10 fichas de proyecto**, la
galería, las tres de contacto, la de gracias, sobre nosotros, opiniones, sectores,
preguntas frecuentes, garantías, el aviso de privacidad, **el calculador de
presupuesto** y el 404.

### 1. El blog no se traduce (índice + 21 artículos + 5 categorías)

Son **19.401 palabras** de contenido editorial que afirma cosas concretas: precios en
dólares, requisitos de permisos por municipio, cargas de viento, qué exige una
comunidad de propietarios. Una traducción sin revisar de ese material no es un cambio
de idioma, es **publicar afirmaciones nuevas** sobre normativa y dinero en nombre del
cliente.

La mecánica está montada y es barata: cada artículo son ~135 cadenas propias, y
añadirlo es un diccionario + su ruta en `TRADUCIDAS`. Lo que falta no es código: es
que alguien del negocio valide las cifras en español. Esa llamada es del cliente.

**Consecuencia visible, y es deliberada:** las tarjetas del blog SÍ salen en español
en las páginas traducidas (título y resumen), pero llevan al artículo en inglés. Se
mantiene así porque un resumen en español ayuda al lector a decidir si le interesa;
uno en inglés no ayuda a nadie. Cuando un artículo se traduzca, su tarjeta apuntará
sola a `/es/post/...` — el reescritor de enlaces solo manda a `/es/` lo que existe.

### 2. El contrato de obra (`/articles/terms-of-service`) no se traduce

4.554 palabras de un contrato vinculante que empieza diciendo *these terms and
conditions are not negotiable*. Publicar una versión en español sería publicar un
**segundo texto legal** que el cliente no ha aprobado y que, ante cualquier
discrepancia entre las dos versiones, habría que defender en un juzgado de Florida.
Un contrato lo traduce un abogado o no se traduce. Está escrito en
`src/i18n/articulos.es.ts`, junto al código, para que nadie lo «arregle» por
descuido.

El aviso de privacidad sí se tradujo, y no es incoherente: ese texto **no compromete
a nada**. Dice que la política está pendiente y da una vía de contacto para ejercer
derechos, y está enlazado desde el pie de todas las páginas y desde el consentimiento
de los formularios — justo donde se recogen datos de alguien que lee en español.

### 3. El calculador de presupuesto (`/project-estimator`) → HECHO

Era la única de las tres que era trabajo pendiente de verdad, y está cerrada. Se hizo
como tocaba y no duplicando la página: el cuerpo, la lógica y **las tarifas** viven
ahora en `src/components/Estimador.astro`, los rótulos en `src/i18n/estimador.ts`, y
las dos páginas son quince líneas cada una.

**Por qué así y no copiando el `.astro`.** Duplicar 634 líneas habría duplicado
también las ocho tarifas, y un precio en dos sitios es un precio que un día dirá dos
cosas distintas. La regla queda escrita en el propio componente: si el cliente sube
las tarifas, se tocan ahí y las dos páginas cambian a la vez.

Dos detalles que no son obvios y están comentados en el código:

- **El dinero se formatea en `en-US` también en español.** Son dólares en Florida:
  `$34,000` es como los escribe y los lee ahí todo el mundo. Con `es-ES` saldría
  `$34.000`, que a un vecino de Hialeah le parece otra cifra.
- **Las medidas se quedan en pies, no en metros.** Es la unidad con la que se
  contrata obra en Florida y la que aparece en el permiso.

Verificado en el navegador con los dos idiomas cargados: la misma configuración
—techo de lamas, 20 × 30 pies, cálculo estructural y zapatas— da **$71,000 – $105,000+
en las dos**, el recorte a 60 pies salta igual y avisa en el idioma que toca, y sin
JavaScript las dos sirven la tabla de tarifas.

### Cómo se sabe que no miente

`hreflang="es"` sale en **154 de 184** páginas. Las 30 que no lo llevan son
exactamente el blog entero (índice + 21 artículos + 5 categorías = 27), el contrato de
obra y los dos 404. No hay ni una página prometiendo una traducción que no exista, y
`check:i18n` lo vuelve a comprobar en cada build.

---

## La página de gracias tenía que existir en los dos idiomas

Un visitante que rellena un formulario **en español** y aterriza en una página de
gracias **en inglés** se queda sin saber qué pasa después, en el único momento en que
ya ha dado sus datos y no puede hacer nada más.

`/es/thank-you` es una `.astro` escrita a mano, no contenido migrado — como su gemela
inglesa. El destino lo decide el SERVIDOR a partir del campo `pagina` del envío, que
es el único dato que dice de qué versión del sitio salió: ni la cabecera del
navegador ni el idioma del sistema sirven, porque quien navega en `/es/` puede tener
el navegador en inglés. Con JavaScript, el endpoint devuelve el destino en el JSON
(`gracias`) y el cliente lo obedece; sin JavaScript, es el `303`.

`check:formularios` envía uno desde `/es/` y exige `/es/thank-you`. Sin esa
comprobación, cualquier cambio en el endpoint devolvería a los leads en español a la
página inglesa sin que saltara nada.

---

## Las reseñas de Google: Business Profile, no Places

**Decidido sin preguntar dos veces porque la alternativa era inviable, no peor.**

La Places API parecía el atajo. No sirve, por tres motivos que están en su propia
documentación: devuelve **un máximo de 5 reseñas**, su política **prohíbe cachear o
almacenar su contenido** (solo el `place_id` está exento) y `reviews` cae en el SKU
Enterprise + Atmosphere. Un `src/data/reviews-google.json` comiteado y servido en
SSG con datos de Places es *exactamente* el patrón que esa política prohíbe.

Las reseñas del perfil propio, leídas por su dueño a través de Business Profile, son
contenido del negocio: no arrastran esa restricción, salen todas, y además traen la
respuesta del dueño (`reviewReply`), que Places no da.

**El JSON arranca vacío y se queda vacío hasta que alguien ejecute el fetch.** No
había ninguna reseña real de la que partir: el widget de Elfsight nunca metió texto
en el HTML y su API lleva devolviendo `WIDGET_DISABLED` desde antes de la migración.
Con la lista vacía el componente **no renderiza nada** —ni carrusel vacío, ni «aún no
hay reseñas»— que es lo mismo que hace el listado del blog con las categorías sin
artículos: no hay estado vacío porque no puede alcanzarse.

**El enlace «leer esta reseña en Google» apunta a la lista, no a la reseña.** La API
de GBP no devuelve un permalink por reseña: `review.name` es un identificador
interno, no una URL pública. Inventarse un enlace que parezca funcionar sería peor
que esto, porque el visitante hace clic justamente para comprobar que la reseña es
real.

## `check:i18n` contaba las reseñas en inglés como «sin traducir»

Las reseñas **no se traducen**: un testimonio reescrito por el vendedor deja de ser
un testimonio. Pero la puerta cuenta como pendiente todo nodo de prosa con palabras
funcionales inglesas y exige ≥98% por página, así que las reseñas inglesas dentro de
`/es/` la tumbaban **por hacer lo correcto**.

El arreglo no es una exención: `nodos()` aparta los subárboles con un atributo `lang`
**explícito y distinto** al de la página. Y declararlo no es un truco para esquivar
la puerta — es lo que necesita un lector de pantalla para cambiar de voz. **Para
librarse del recuento hay que hacer antes lo correcto.** Un párrafo que se quedó en
inglés por olvido no lleva `lang` y sigue contando, que es lo que la puerta persigue.

Se le pusieron dos guardas, porque el recorte busca el cierre equilibrado a mano y un
fallo ahí haría que la puerta saliera en verde por no tener nada que medir —la misma
familia de fallo que las capturas en `/tmp` y que los HTML mudándose a `dist/client/`:

- La puerta **comprueba su propia maquinaria** con 10 casos antes de usarla. El que
  importa es un `<div>` dentro de otro `<div>`: buscar el primer `</div>` es lo que
  sale solo, y dejaría medio documento fuera.
- Falla si la exención aparta más del 35% del texto de una página.

Efecto secundario: salieron a la luz dos casos legítimos que ya existían y se colaban
dentro del margen del 2% — los enlaces del selector de idioma
(`<a href="/es/" lang="en">English</a>`).

## Auditoría de nitidez: umbrales por percentil, y una marca que casi no aplica

**Los umbrales de «blanda» y «sobrecomprimida» salen del percentil del propio
corpus,** no de una constante. La varianza del Laplaciano depende del contenido: un
cielo liso puntúa bajo aunque el archivo esté perfecto. Una constante habría marcado
las fotos de cielo y dejado pasar las de textura mal escaladas.

**La marca de bloques JPEG casi no aplica aquí y el informe lo dice.** De las 471
imágenes rasterizadas que sirve el sitio, **solo 2 son JPEG**. AVIF no usa bloques
8×8, así que buscarlos en un corpus 99% AVIF sería inflar la cobertura del informe
sin medir nada.

**El factor mínimo es 1,5× y no 2×.** El ideal en retina es 2×, pero con ese umbral
fallarían casi todas las imágenes de 1250 px del CMS, y una lista donde falla todo no
sirve para priorizar nada. El píxel *objetivo* que se pide a Higgsfield sí es 2×.

**Playwright entra como devDependency pero NO en `npm run check`.** El tamaño de
display es una propiedad del layout y no se puede deducir del HTML: hace falta un
navegador. Pero la razón por la que `comprobar-carruseles.mjs` no lo trae —«~300 MB y
un navegador más que mantener»— sigue siendo cierta para una *puerta*. La auditoría
es una herramienta que se ejecuta a mano.

**La auditoría aborta toda petición externa.** No es una optimización: sin eso no
termina. Cada página carga jQuery desde `d3e54v103j8qbb.cloudfront.net` y el
navegador se queda esperándolo. Medido: 26 minutos con los procesos de Chromium al
**0% de CPU** —parados, no trabajando— y ni una página medida. Y no falsea nada,
porque el tamaño de display sale del CSS, que es todo local; sin jQuery no arranca
IX2 y los elementos anti-FOUC se quedan en `opacity:0`, pero la opacidad no cambia
`getBoundingClientRect()`.

## Las imágenes regeneradas necesitaban un registro, no solo un archivo nuevo

`public/images/` tiene **dos fuentes en conflicto**: está versionada en git (165
archivos) *y* `instalar-assets.mjs` copia el export de Webflow encima en cada
ejecución. Sustituir ahí una foto regenerada y ya sería una regresión latente: la
siguiente ejecución la revierte **en silencio**, sin error y sin ninguna diferencia
visible salvo que se mire el píxel. Es la misma clase de fallo que el
`rm -rf public/images` que se llevaba `En.svg`.

Por eso hay `assets-migracion/regeneradas.json`: `instalar-assets.mjs` salta esas
rutas y `check:imagenes` comprueba que lo que hay en disco sigue teniendo el `sha256`
anotado. Se compara contra ese hash y no contra «es distinta del export», porque una
tercera versión tampoco vale.

**Del manifest solo se tocan cuatro campos**: `sha256`, `bytes`, `width` y `height`.
El `alt` no se toca jamás — ese manifest ya tuvo el bug de no-determinismo que
sorteaba a cara o cruz el `alt` de 42 imágenes y no se vio durante semanas porque no
rompe nada visible.

**Se sustituye en AVIF y con el mismo nombre.** El sitio sirve AVIF de archivo único
con `<img src>` plano —cero `<picture>`, cero `srcset` propio—, así que añadir un
WebP de respaldo obligaría a inyectar `<picture>` en markup migrado verbatim y a
reescribir `check:paridad`. La recodificación apunta además al mismo bytes/px del
archivo que sustituye: subir la resolución no es excusa para triplicar el peso.

## La flecha «siguiente» no llegaba al último slide cuando el tramo final era corto

Lo destapó el carrusel de reseñas y **estaba en el código compartido**, no en él.

`Carrusel.astro` daba la vuelta al principio cuando el salto **se pasaría** del final:

```js
if (destino > maximo() + 1) return caja.scrollTo({ left: 0 });
```

Parece razonable y no lo es. Si el tramo que queda por recorrer es **más corto que un
paso**, «se pasaría» es cierto desde el primer clic, así que la flecha volvía al
principio una y otra vez y **los últimos slides no se alcanzaban nunca**. Es
exactamente el fallo que este componente vino a arreglar, colándose por la puerta de
atrás.

Medido en la home, 4 reseñas con 3 a la vista: paso 419 px, recorrido total 411 px.
La cuarta tarjeta era inalcanzable con las flechas.

**Por qué no había saltado antes:** los 127 carruseles migrados tienen `maximo`
múltiplo exacto de `paso` —medido: 8550/950 y 1824/304—, así que su último salto cae
justo y nunca se pasa. Ninguno tenía tramo corto.

Ahora se da la vuelta cuando **ya se está** en el extremo, y en cualquier otro caso se
avanza recortando a los extremos: avanzar lo que queda es mejor que no avanzar. Para
los 127 carruseles migrados el comportamiento es idéntico (con múltiplos exactos las
dos condiciones coinciden).

De paso se quitó el `padding` horizontal de la lista de reseñas, que era lo que metía
esos 8 px de descuadre. La sombra de las tarjetas respira ahora con el padding
**vertical**, que no toca el eje que se desplaza.

## Verificar el carrusel en el panel oculto daba TODO roto estando bien

El panel del navegador de la sesión estaba oculto. Medido dentro de la página:
`visibilityState: "hidden"`, **0 callbacks de `requestAnimationFrame` y 0 de
`ResizeObserver` en 600 ms**, e `innerWidth: 0`.

Consecuencias, todas falsos negativos:

- Los puntos del carrusel los pinta un `ResizeObserver` → nunca se pintaban. Salía
  «1 punto para 4 slides» **en los carruseles migrados también**, que no se habían
  tocado.
- Con `innerWidth: 0` toda la maquetación colapsa: los slides medían 0 px de ancho y
  el paso salía 24 px (solo el hueco entre tarjetas).
- El scroll suave no anima en una página que no renderiza, así que un clic «no movía
  nada».

Es el gemelo del fallo ya documentado —la pestaña sin foco congela rAF y hace que el
bug salga en **verde**—; aquí pasa al revés y hace que lo sano salga en **rojo**. Las
dos versiones nacen de lo mismo: **medir en una página que no está renderizando**.

La verificación real se hizo con Chromium headless, que sí ejecuta los pasos de
renderizado, y con clics de verdad (`page.click`, no `dispatchEvent`): 4 rutas × 2
viewports, comprobando que los puntos se repintan, que el punto activo sigue al
scroll, que las flechas llegan al último píxel y que en los extremos dan la vuelta.

## La métrica de nitidez daba 0,0 en toda imagen con canal alfa

Un fallo mío, encontrado leyendo el informe: varias fotos reales salían con nitidez
**exactamente 0,0**, que no es un valor plausible para una fotografía.

Causa: `sharp().convolve()` devuelve el buffer **entero a cero** cuando la imagen
lleva canal alfa. Medido: `motorized-louvered.avif` (4 canales) daba min 0, max 0,
media 0; `screen-enclosure.avif`, la misma foto sin alfa, daba media 6,83.

Es el peor tipo de fallo posible en una auditoría: **no da error, produce un número
plausible, y ese número manda trabajo manual sobre imágenes que están bien**. Sin
mirar el informe con desconfianza habría acabado en una lista de decenas de fotos
«blandas» que no lo eran.

El arreglo es `.removeAlpha()` antes de `convolve`, en las tres funciones que lo usan
(`auditar-nitidez.mjs` y las dos de `integrar-higgsfield.mjs`). En el integrador el
mismo fallo habría hecho que toda imagen con alfa suspendiera el «la nitidez no subió»
pasara lo que pasara.

De paso, la pasada de navegador se cachea en `auditoria-imagenes/display.json`: son
~15 minutos y solo cambia si cambia el CSS o el markup, mientras que los umbrales se
retocan a menudo. Con `--remedir` se rehace, y hay que usarlo después de tocar la
maquetación: una caché silenciosa que se queda vieja mide el sitio de anteayer.
