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

> **Corregido despues:** el ancho paso a **2500x1406**. Copiar el 1250 del CMS viejo
> convirtio su limite en el limite de las fotos NUEVAS, con originales de hasta
> 4996x3747 y cajas que se pintan a 1440 px (2880 en retina). La relacion no cambia.
> Ver «Las fotos del cliente no necesitaban IA, necesitaban dejar de tirar pixeles».

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

**«Patio Remodeling» pasa a ser «Full Outdoor Remodel», y su URL con el.** El nombre
ya venia del cliente —el asset del handoff se llama `Our Services Thumbnails/Full
Outdoor Remodel.JPEG`— y estaba aplicado al menu y a `/services`, pero NO al contenido:
se pinchaba «Full Outdoor Remodel» y se aterrizaba en una pagina titulada «Patio
Remodeling». Con el renombrado el servicio ademas ensancha su alcance del patio al
exterior completo, apoyandose solo en lo que Pergola Plus ya presta (adoquinado,
entradas de coche, hormigon, decks, vallado, pergolas y cortinas motorizadas): no se
inventa ningun servicio, cada uno tiene su propia ficha en `/services`. En espanol es
«Remodelacion exterior integral», no «reforma»: el publico es de Florida, no de Espana.

Es la PRIMERA URL viva del sitio original que cambia de ruta, y por eso obligo a tres
cosas que conviene recordar. Una, renombrar tambien su captura del vivo
(`docs/vivo/services__full-outdoor-remodel.html`), porque el slug de las paginas de
detalle sale del NOMBRE DE FICHERO de la captura (`generar-detalle.mjs`) y no de
ninguna configuracion; el contenido de esa captura sigue siendo el del sitio en vivo,
que continua sirviendo la URL vieja. Dos, dos redirects 301, uno por idioma. Tres,
mover el tema en `src/data/faqs.ts`: `FaqFichaEnlace.astro` lanza si el tema no esta en
`TEMAS_FICHA`, asi que el build falla ruidosamente si se olvida — eso esta bien.

**Las imagenes de ese servicio NO se renombran.** Siguen en
`public/cms-img/services/patio-remodeling/` y con «patio-remodel» en el nombre.
Renombrarlas arrastraria `img-map.json`, `img-dim.json`, el manifest, `cta-slots.mjs` y
`transformar.mjs`, y sobre todo `public/css/pergola-plus-florida.webflow.css:5518`, que
pide `url('../images/patio-remodeling-project-south-florida.avif')`: **ninguna puerta
escanea los `url()` del CSS**, asi que ahi quedaria un 404 invisible. El nombre de
fichero de una imagen no mueve el ranking; el `alt` si, y ese si se reescribio entero.
El precio de no renombrar es una linea de alias en `PORTADAS` (`transformar.mjs`),
porque esa clave se deriva de la ruta de la imagen y ya no coincide con la de la pagina.

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

**17-ago-2026.** El sitio pasó de 1 página en español a **105**. Hoy está traducido **todo el sitio salvo el
contrato de obra**, que es la única exclusión que queda y es deliberada.

Lo que SÍ está: la home, los índices de productos y servicios, **las 10 fichas de
producto**, **las 7 de servicio**, **las 25 páginas de ubicación** con su índice, los
**3 condados**, las **5 marcas** con su índice, las **10 fichas de proyecto**, la
galería, las tres de contacto, la de gracias, sobre nosotros, opiniones, sectores,
preguntas frecuentes, garantías, el aviso de privacidad, **el calculador de
presupuesto** y el 404.

### 1. El blog → TRADUCIDO (21 artículos), con una herramienta de por medio

Se planteó primero como riesgo y no como trabajo pendiente: son **19.401 palabras**
que afirman precios en dólares, requisitos de permiso por municipio y cargas de
viento. Sebastian lo pidió igualmente, y está hecho: **los 21 artículos, el índice y
las 5 categorías**.

**Sigue siendo cierto lo que motivaba la reserva**, y por eso queda escrito: nadie del
negocio ha validado todavía las cifras en español. Las horquillas de precio, los
plazos de permiso y las velocidades de viento se han traspasado **literales** —no se
ha convertido ni redondeado ni un número, ni se ha pasado a metros lo que el original
da en pies— precisamente para que revisarlas sea comparar dos columnas.

**Cómo se hizo, y por qué importa el cómo.** `traducirHtml()` indexa por la cadena
inglesa EXACTA. Transcribir a mano 2.700 claves es donde se cuela el error que no da
error: el espacio fino de no separación, una comilla tipográfica que parece recta, un
`&amp;` escrito `&`. La entrada no casa, la frase sale en inglés y no lo avisa nadie.

Así que las claves **no se escriben**: las extrae `scripts/emparejar-traduccion.mjs`
del propio fragmento y las empareja con un `.txt` de traducciones, una por línea y en
orden. Si los dos lados no tienen el mismo número de líneas, **se para** y dice dónde
—un desfase de una línea traduciría el resto del artículo con el texto de otra frase,
y eso sí pasaría las puertas: son cadenas válidas, solo que en el sitio que no es—.

Para cambiar una traducción se edita `src/i18n/posts/<slug>.txt` y se regenera. El
`.ts` es salida generada y lleva el aviso arriba.

Dos decisiones más dentro del blog:

- **Las tarjetas de un artículo sin traducir enlazan al inglés.** Mientras se traducía
  de dos en dos, `rutaPost()` mandaba al inglés lo que aún no existía en `/es/`.
  `check:paginas` fue quien lo pilló, apuntando a un `/es/post/...` que no se
  generaba. Hoy ya no aplica —están los 21— pero la regla se queda: es lo que hace
  que cada paso intermedio sea publicable.
- **`wordCount` del JSON-LD es el del original.** Lo contó el CMS sobre el texto
  inglés y aquí no se recalcula: es el mismo artículo, y poner otro número inventado
  sería peor.

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

`hreflang="es"` sale en **208 de 211** páginas. Las 3 que no lo llevan son el contrato
de obra y los dos 404. No hay ni una página prometiendo una traducción que no exista, y
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

## Las fotos del cliente no necesitaban IA, necesitaban dejar de tirar píxeles

El pipeline llevaba las 12 fotos de Daniel a 1250x703 **teniendo originales de hasta
4996x3747**. El número salió de los heroes del CMS que sustituyen, así que el límite
del CMS viejo se convirtió en el límite de las fotos nuevas. La auditoría lo marcó:
esas cajas se pintan a 1440 px en escritorio —2880 en retina— y servíamos 1250.

Objetivo unificado **2500x1406**, la misma relación y el doble de píxeles. No llega a
los 2880 ideales a propósito: por encima de 2500 varias fotos ya no tienen píxeles
reales que dar.

**Cinco se rehicieron sin IA.** Solo había que dejar de reducir. **Siete no daban
2500 en el recorte del sitio** y pasaron por Topaz (Higgsfield). De esas siete,
**cuatro tenían el original más pequeño que lo publicado** —796x548 para un hueco
donde servíamos 1250—: quien las amplió fue este repo, no el cliente.

**La fuente de las siete es `~/Downloads/hf-topaz/<slug>.png`, y el script la
prefiere al original.** No es comodidad. Si `optimizar-imagenes-cliente.mjs` leyera
siempre el original, la siguiente ejecución las reescalaría con Lanczos desde la foto
pequeña —en silencio, sin error y sin hueco— y se perdería el trabajo. Con la
preferencia, `npm run imagenes:cliente` reproduce las doce tal cual están. Se
comprobó: tres de las cinco sin IA salen **byte a byte idénticas** al volver a correr.

**`public/images/cliente/` NO va a `regeneradas.json`.** Ese registro existe porque
`instalar-assets.mjs` copia `EXPORT/images/` encima de `public/images/`. Comprobado:
el export **no tiene `images/cliente/`** ni ningún fichero que colisione con los 12
slugs, y `copiarDir` no borra el destino. No hay reversión posible que anotar, y
`sha256Export` no significaría nada. La reproducibilidad la da `IMAGENES_CLIENTE`.

**Techo de 300 KB por foto, bajando la calidad y no el tamaño.** Ocho de las doce
salen en la home. A q62 fijo alguna se iba a medio mega, así que se prueba
`[62, 56, 50, 44, 38]` y gana la primera que no pase del techo. El tamaño es lo que
arregla la nitidez; la calidad solo cuesta artefactos que a 2500 px casi no se ven.
Resultado en la home: **851 KB -> 1768 KB** en 8 fotos, todas `loading="lazy"`, con
4x los píxeles. Cuatro necesitaron bajar de 62 (a 56, 50 y 44).

## La regla «la nitidez tiene que subir un 10%» rechazaba los upscales buenos

`integrar-higgsfield.mjs` exigía `MEJORA_MINIMA = 1.10` a todo lo que volviera. Con
Topaz eso rechaza restauraciones buenas, y salió midiendo: `cover-miami-dade`, de
1024x1024 a 2048x2048, daba nitidez **3558 -> 2713 (-23,7%)** con SSIM 0,961 y a 1:1
era visiblemente mejor.

Eran **dos** efectos, y ninguno es pérdida de detalle real:

**1. Topaz denoisea.** La varianza del Laplaciano no distingue grano de textura:
contaba el ruido de compresión del original como si fuera detalle.

**2. La medida estaba sesgada.** `nitidez()` normaliza a 512 px antes de medir. Una
imagen de 2500 px bajada a 512 promedia ~5x5 píxeles por muestra y una de 1250 px
promedia ~2x2, así que **la grande llega al medidor más suavizada por pura aritmética
del remuestreo**, tenga el detalle que tenga. El sesgo crece con el factor y siempre
penaliza al upscale.

Los dos arreglos son distintos y hacen falta los dos:

**Al sesgo se le quita la causa, no se le sube el umbral.** `nitidez(buf, aTamano)`
lleva los dos lados al tamaño final antes de medir, así que recorren la misma cadena
de remuestreo y lo que queda es detalle. Medido en `forte-plus`: 3034 -> 2051 (68%,
«se hundió») pasó a 2752 -> 2040 (75%, pasa). Siete puntos que no eran de la foto,
eran del método. **Trampa que costó una iteración:** sharp admite **un solo `resize`
por pipeline** —el segundo pisa al primero sin dar error—, así que encadenarlos dejó
la medida idéntica de sesgada pero con un comentario diciendo que no lo estaba. Va en
una pasada aparte, y hay un control: medir con `aTamano` igual al tamaño propio tiene
que dar exactamente lo mismo que sin él.

**El umbral pasa a dos tramos, según por qué se marcó la imagen** (`exigenciaNitidez`):

- **`BLANDA` -> sigue pidiendo +10%.** Es la única marca que *afirma* que a la foto le
  falta micro-textura, y el upscale existe justo para recuperarla. Hace falta el
  margen porque «que no baje» no basta: medido, un Lanczos 2x que no añade ni un
  detalle pasaba con 241,1 -> 241,4 (+0,1%, ruido de medida).
- **`SUB-RESOLUCION`, `SOBRECOMPRIMIDA`, `BLOQUES JPEG` -> solo que no se hunda
  (>=70%).** No dicen nada del detalle: dicen que faltan píxeles o bitrate. Pedirles
  una subida de nitidez es pedirles algo que nadie diagnosticó.

Lo que **no** se tocó: relación de aspecto, factor de aumento y SSIM. Esos tres cazan
la alucinación, que es el riesgo caro — una foto bonita que ya no es la casa del
cliente no sirve.

**Una excepción nombrada, no un umbral más flojo.** `custom-pergolas-and-patio-covers`
se queda en +1,4% con la regla ya corregida. Su `BLANDA` es un falso positivo de
**contenido**: es una casa blanca minimalista y ~70% del cuadro es pared lisa y
cristal oscuro, el mismo efecto que ya está documentado aquí para las fotos de cielo
(«un cielo liso puntúa bajo aunque el archivo esté perfecto»). Su defecto real es el
otro motivo, `SOBRECOMPRIMIDA` (0,063 B/px, 28% de la mediana), y ese sí lo arregla:
54 KB -> 176 KB. Comprobado a 1:1 antes de decidir: las lamas de la pérgola, los
marcos de las correderas y las tablillas de la silla se resuelven en la nueva y se
emborronan en la vieja. Va en `SALTAN_NITIDEZ`, con el motivo y los números, **y el
script sigue avisando en cada ejecución de que esa foto se saltó la reja**. Mover el
umbral habría afectado a las 12 y a las ~106 de la cola del CMS; esto afecta a una.

**Las siete se revisaron a ojo, una a una**, en los montajes de
`auditoria-imagenes/comparativas/`: mismo número de postes y de lamas, mismos muebles,
ningún rótulo inventado. El SSIM (0,859-0,953) caza un recorte cambiado; no caza un
poste de más. Ese filtro sigue siendo el ojo.

## El hero de louvered se sustituyó por una imagen generada, decisión del cliente

`MOTORIZED LOUVERED .png` era **796x548**, la más pequeña de las doce, y ni con Topaz
x4 pasaba de una nitidez de **328** cuando la mediana del sitio es 3002. Se veía blanda
en un hero que se pinta a 1440 px (2880 en retina), y no había forma de arreglarlo:
redimensionar no inventa detalle, y el detalle no estaba en el origen.

El cliente aportó una imagen **generada** del mismo montaje (17-ago-2026). Pasada por
Topaz x2 y al pipeline normal: **328 -> 1707** al mismo tamaño, 5,2x.

**Va por la rama de «original», no por la de upscale, y es a propósito.** La reja de
SSIM existe para cazar que una IA le cambie la casa a una *restauración*; aquí la
sustitución es deliberada, así que la suspendería con razón. Tratarla como fuente
nueva es lo que describe lo que de verdad pasó.

**Queda dicho porque importa:** esto es la web de un contratista y esa foto ocupa un
hueco de obra propia. No es una restauración de la foto de Daniel, es una imagen
nueva. La original y su Topaz siguen en `~/Downloads/hf-topaz/descartados/` y volver
atrás es cambiar una línea de `IMAGENES_CLIENTE`.

**El basename se conserva exacto.** `rutaCliente()` saca la ruta pública del nombre del
fichero: llamarlo «(regenerada por el cliente).png» produjo
`/images/cliente/motorized-louvered-regenerada-por-el-cliente.avif`, que dejaba el AVIF
viejo huérfano y cambiaba el markup de cuatro ficheros generados por nada. La
procedencia va en la carpeta (`regeneradas/`), no en el nombre.

## La tarjeta de producto recorta otro 28%, y eso decide el encuadre

El sukkah salía con el remate superior de la pérgola cortado. La causa no era solo
nuestro recorte: **son dos recortes encadenados**.

1. El original es 1024x1034, casi cuadrado. Llevarlo a 1.778 tira **458 de 1034
   filas** (44%), y la ventana estaba en `south` (top=458).
2. La tarjeta de producto tiene una caja de **617x250 (2.47:1)** con
   `object-fit:cover`. Contra una imagen de 1.778 eso se come **otro 28% del alto**,
   14% arriba y 14% abajo. El visitante solo ve la banda central del 72%.

Sumadas, la estructura quedaba fuera. **La lección es que el encuadre hay que
elegirlo mirando la banda que la tarjeta enseña, no el archivo entero**: se
recortaron cuatro candidatas (top=458/424/400/370) ya reducidas a esa banda y se
eligió a ojo. Gana **top=400**: entra el remate completo y siguen dentro las mesas,
los faroles y el suelo. `370` ya mete demasiada fachada.

**Se subió a Topaz el original ENTERO (4096x4136), no el recorte.** Cuesta lo mismo
—2 créditos— y deja el reencuadre como un `extract` local: el siguiente ajuste no
gasta otro upscale. El recorte publicado sale de `hf-topaz/sukkah-completa.png` en
`top=1600, alto=2304`.

**El SSIM lo suspendió, y tenía razón en lo que medía.** Da 0,356 porque compara
contra el AVIF ya publicado, y al mover la ventana lo que mide es un
**desplazamiento**, no una invención. Esa referencia deja de valer en cuanto cambia
el encuadre. La que sí vale es el original, y ahí los números son claros:

| | contra su ventana del original |
|---|---|
| publicado viejo (top=458) | SSIM **0,851** |
| nuevo (top=400) | SSIM **0,844** |

Misma fidelidad a la fuente. Va en `REENCUADRADAS` con esa verificación escrita, y la
regla de esa lista es explícita: **si no puedes escribir el número contra el original,
no metas la imagen ahí**. El script avisa en cada ejecución de que ese encuadre se
saltó la reja.

## El FAQ de ficha a dos columnas: la clase propia no es cosmética

El cliente pidió el FAQ de productos y servicios a dos columnas, con la imagen de
referencia a la izquierda. Dos cosas decidieron cómo se hizo.

**No se tocan los 17 fragmentos.** `src/contenido-migrado/` es salida generada y
`check:generadores` regenera y compara: una edición a mano falla la puerta y el
siguiente `node scripts/generar-detalle.mjs` la revierte en silencio. El cambio vive
en `scripts/lib/transformar.mjs` (paso 6d), que es el mismo sitio donde acabó la
retirada del widget de Elfsight por esta misma razón.

**El componente FAQ está en más sitios de los que se ve.** Medido sobre `dist/`:
`.section-faq-page` sí es exclusivo de las 17 fichas (34 páginas con el español),
pero `.faq_item` sale también en `/resources/faq` y `.wrapper-faq` en
`/resources/faq` y `/resources/warranties`. Y la lista ni siquiera se llama igual
dentro de las 17: `.div-block-10` en productos, `.wrapper-faq` en servicios. Estilar
cualquiera de esas clases a pelo habría partido dos páginas que nadie estaba mirando.
Por eso el transformador marca el contenedor con `.pp-faq-2col` —clase propia, solo
donde él la pone— y `src/styles/faq.css` cuelga entero de ella. La columna derecha se
selecciona por posición (`> *:not(.pp-faq-media)`), no por nombre, precisamente
porque ese nombre cambia entre colecciones.

**La imagen es la portada del CMS** (`/cms-img/<colección>/<slug>/cover-*`). Las 17
existían, traían el `alt` redactado en `img-map.json` y no se usaban en ninguna de las
211 páginas: la migración las había dejado fuera. El `width`/`height` no se escribe,
lo pone `dimensionarImagenes()` sobre `dist/` al cerrar el build.

Dos detalles que costaron una medición cada uno:

- **Tres filas, no dos.** La foto se ve a su relación natural (504x672 en una ficha
  vertical) y abarca las dos filas de texto, que suman 384. Ese exceso se repartía
  entre ambas y abría 170 px de hueco muerto entre el subtítulo y la primera
  pregunta. Con `grid-template-rows: auto auto 1fr` la holgura cae en una tercera fila
  vacía y el texto queda pegado arriba.
- **En móvil la caja necesita altura definida.** Con `max-height` y el hijo en
  `height:100%`, una foto que aún no ha pintado dejaba la columna en 0 px —medido a
  390 en el servidor de desarrollo, donde los `width`/`height` todavía no están—.

`.pp-faq-2col.w-container` va con doble clase a propósito: con una sola empata en
especificidad con `.w-layout-blockcontainer` y con el clearfix `::before/::after` de
`.w-container`, y quién gana dependería del orden en que salgan la hoja propia y el
export de Webflow. Un empate no es una regla.

El acordeón sigue siendo de IX2 (eventos `e-37`/`e-38` sobre `.faq_trigger`): dentro
de `.faq_item` no se cambió una sola clase, y `check:animaciones` afirma que los 90
eventos que no son entrada siguen intactos. Verificado con un clic real en las tres
anchuras: la respuesta abre en las 17.

## El hero de la home baja al pie: el video era el contenido y el texto lo tapaba

Centrado, el bloque del hero ocupaba de y=363 a y=556 sobre un video de 834 px —el
tercio central justo, que es donde estan la casa, la pergola y la piscina—. El texto
no competia con el fondo: competia con el argumento de venta.

Ahora va abajo a la izquierda, exactamente como el hero de las 17 fichas de detalle
(`.wrapper-hero-product`). Medido a 1440: el bloque arranca en y=593, empieza en x=95
—la misma linea vertical que el h1 de producto, porque los dos cuelgan del `.container`
de 1250— y deja 48 px hasta el marquee de logos. El eje horizontal no hubo que
calcularlo: bastaba con quitarle a `.hero-block-video` el margen izquierdo automatico.

**El velo pasa de plano a degradado.** Webflow ponia un 55% de negro UNIFORME sobre
todo el video: pagaba contraste en la imagen entera para dar legibilidad a un texto
que solo ocupaba el centro. Ahora el peso esta donde esta el texto (0,72 abajo) y la
franja central se queda en 0,15, que es lo que deja verse el video. Arriba no hace
falta casi nada: los primeros 85 px los tapa la barra de navegacion, que es opaca
(`rgb(58,84,91)`).

El 0,72 sale de una cuenta, no del ojo: blanco sobre negro al 72% encima del fotograma
mas claro (sRGB ~0,85) da un compuesto de ~0,24 y **9,8:1**. Con 0,45 daria 4,5:1
clavado, y un video cambia de fotograma. Verificado despues sobre pixeles reales del
build —recortando la banda del parrafo y midiendo su luminancia media— sale un suelo
de **6,5:1 a 6,7:1** en escritorio y **5,4:1** en movil. Es un suelo y no un techo: el
promedio incluye los propios pixeles blancos del texto, asi que el fondo real esta mas
oscuro.

**El parrafo, en dos lineas parejas.** A 880 px partia donde le venia: 122 caracteres
en la primera y `Florida living.` —15— solo en la segunda. El tope de 660 px son ~91
caracteres a esta fuente: lo justo para que los dos idiomas quepan en dos lineas
(149 caracteres en ingles, 178 en español) sin que ninguno se vaya a tres. Quien las
iguala es `text-wrap: balance`; el tope solo garantiza «dos lineas», no «dos lineas
del mismo largo». Medido: 501/454 px en ingles y 649/589 en español, 9% de diferencia
en los dos.

Nada de esto aplica por debajo de 768 px. En un movil de 390 el parrafo mide 358 px de
ancho: dos lineas pedirian 5 px por caracter. Ahi parte donde toque y el bloque sigue
abajo, dejando libre el 48% superior del video.

## Las tres relaciones de las portadas: la sección se veía distinta en cada página

Al pasar el FAQ a dos columnas la foto se dejó a su relación natural, y eso hacía que
cada ficha se viera de una forma. Medidas las 17: **tres relaciones distintas en el
origen** —0,75 en nueve productos (938x1250), 1,00 en siete (1250x1250) y 1,04 en
`pergola-design-construction`—. A 1440 daban columnas de 672, 504 y 491 px de alto
contra un texto que siempre mide entre 416 y 464. Una página salía cuadrada, otra
colgaba 256 px por debajo de la última pregunta, y ninguna cuadraba con la de al lado.

**Ahora la altura la manda el texto, no el archivo.** La foto abarca la columna
entera con `align-self: stretch` y `object-fit: cover` absorbe el recorte. Medidas las
17 después: desfase arriba y abajo **0 px en todas**, y la relación de la caja pasa a
1,10–1,31 —apaisada, nunca cuadrada— vengan de donde vengan los píxeles. También con
una respuesta abierta: la columna de texto crece y la foto crece con ella, que es
justo cuando alguien está mirando.

Tres trampas, cada una encontrada de una forma distinta:

- **`aspect-ratio` sobre la caja deriva el ANCHO.** Era el primer intento de poner un
  suelo a la altura. Con la altura ya definida por el grid, Chrome usa la relación al
  revés: la caja de 504 px se fue a 576 y se comió la columna del texto. La sonda no
  lo cazó porque solo medía el alto; la captura sí. El suelo acabó siendo
  `min-height: 320px`, que no toca el ancho, y quien impide que la imagen infle las
  filas es sacarla del flujo (`position: absolute` dentro de una caja `relative`): así
  no aporta altura y las filas las mide solo el texto.
- **Las filas vacías cobran `row-gap`.** Con `1fr auto auto 1fr` y `row-gap: 2rem` hay
  tres huecos y dos caen en las filas vacías: la foto salía 64 px más alta que el
  texto y sobresalía 32 por arriba y 32 por abajo. Simétrico, pero no a ras. El hueco
  pasó a ser el `margin-top` del hijo que lo necesita.
- **Y ese margen se lo comía una regla anterior.** Había un `margin-top: 0` sobre
  `.div-block-10`/`.wrapper-faq` —puesto cuando el `row-gap` daba la separación— que
  empataba en especificidad con el nuevo y ganaba por orden. El subtítulo quedó
  tocando el borde de la primera pregunta. Se retiró.

Las filas siguen siendo cuatro (`1fr auto auto 1fr`) aunque hoy las dos `1fr` midan
cero: son las que centran el texto si una ficha futura trae dos preguntas y el
`min-height` de la foto pasa a mandar.

## Un fondo de CTA por producto: lo que la puerta mide y lo que no puede medir

Las 201 páginas cerraban con la **misma** foto de piscina y pérgola: los 106 bloques
`.call-to-action-footer` de los fragmentos son byte a byte idénticos. La página que
vende carports se despedía enseñando otra cosa. Los 17 productos y servicios pasan a
tener el suyo; los **79** fragmentos restantes se quedan con el genérico, que es lo
correcto para un post o una página de marca.

**El reparto sale del disco, no de una lista escrita a mano.** `CTA_POR_RUTA` se
construye leyendo `public/images/cta/`. Eso hace que las tandas parciales funcionen
solas —lo que aún no se ha generado no está, no entra en el mapa y esa página se
queda con el genérico— y que un slug rechazado vuelva al genérico sin que nadie tenga
que acordarse de borrar una línea. Un mapa a mano puede nombrar una imagen que no
existe y dejar 201 páginas pidiendo un 404; éste no puede mentir.

### `sharp().stats()` IGNORA las operaciones del pipeline

La puerta mide el rectángulo central 46% x 55%, que es donde va el titular. Escrita de
la forma obvia —`sharp(f).extract(centro).stats()`— **mide la imagen entera**, porque
`stats()` opera sobre la imagen de ENTRADA y descarta el pipeline en silencio. Medido
sobre el fondo de producción:

| | media |
|---|---|
| `sharp(f).extract(esquina 100x100).stats()` | 147,70 |
| `sharp(f).stats()` | 147,70 ← idéntico |
| `sharp(buffer ya recortado).stats()` | 160,21 ← el recorte real |

Es la misma familia que el `convolve()` con canal alfa ya documentado más arriba: no
da error, produce un número plausible, y ese número aprueba o suspende imágenes por
motivos que no tienen nada que ver con lo que se creía estar midiendo. El recorte se
materializa con `.toBuffer()`, y hay un `autocomprobar()` que lo demuestra: una imagen
negra con el rectángulo central exacto en blanco tiene que dar media ~255; si el
recorte se ignora sale ~64. **190 puntos de separación**, imposible de confundir.

### El mínimo de 3000 px es de lo que VUELVE, no de lo que se publica

Se piden 3000 px de ancho a Higgsfield para tener píxeles de sobra al recortar a
2.55:1 y bajar al master de 2400. Aplicar esa misma regla al master publicado lo
suspende siempre —mide 2400 a propósito—, y eso dejaba `npm run check` en rojo
permanente en cuanto entrara la primera imagen buena. Lo destapó la propia puerta
suspendiendo su propia salida. `juzgar()` recibe ahora el mínimo que toca en cada
lado: 3000 para la generación, 2400 para lo publicado.

### El techo de sigma sube de 75 a 90

El suelo de 40 está justificado: por debajo de 30 el modelo ha tapiado el centro con
una pared lisa en vez de dar profundidad, y eso ya ocurrió. El techo no lo estaba. A
75, la imagen que **hoy está en producción** —sigma 71,9— queda a un 4% de ser
rechazada. Un techo que casi suspende a la referencia no mide calidad, mide suerte.
A 90 sigue cazando un centro caótico y deja margen real.

### Lo que la puerta NO puede medir, y por eso hay montajes

**No distingue un producto de otro.** Una pérgola de lamas preciosa cerrando la página
de carports pasa las cuatro medidas con nota. Por eso `integrar-cta.mjs` no escribe
nada sin `--aplicar` y genera un montaje por imagen en `auditoria-imagenes/cta/`: la
generada con el velo del 50% y el titular encima, y debajo sus tres referencias
reales, con la pregunta escrita al lado. En el ensayo con una imagen de atrezo el
montaje hizo exactamente su trabajo: arriba una piscina, abajo tres cocheras.

### El escenario sale del texto del fragmento, no del nombre del archivo

El plan era sacar la ciudad de los nombres de las fotos. Medido: de las ~180 fotos de
los 17 slugs **solo una** menciona una ciudad
(`intro-luxury-stone-driveway-palm-beach-project.avif`); el resto dice
`south-florida` a secas. La copia del CMS sí nombra las ciudades que cada ficha
sirve, y de ahí sale cada escenario. Dos se repiten entre los 17: el bloque compartido
de los servicios solo nombra siete y no dan para más.

### La tabla del encargo se corrigió en cinco slugs, mirando las fotos

Se generaron hojas de contactos con las nueve mejores de cada slug y se describió lo
que se VE:

- **deck-builders** — el encargo pedía «luz LED en las contrahuellas». No hay LED en
  ninguna de las siete fotos. Lo que sí distingue al servicio es la **barandilla de
  cable horizontal negra** sobre tarima composite gris a niveles.
- **sukkha** — no es una «estructura de lamas»: es un techo **retráctil con estera de
  bambú** (s'chach) a la vista y paredes acristaladas. Y sus referencias están hechas
  en clima templado, así que la línea que las acompaña le dice al modelo que tome de
  ellas **solo la estructura** y el entorno del prompt.
- **fence-solutions** — «valla de aluminio de lamas» se queda corto: son lamas
  **horizontales** planas con hueco regular, y hay que pedirlo o sale de barrotes.
- **carports** — la firma real es el **sofito de veta de madera** bajo un marco
  grafito, con celosía de listones a juego; no solo «un coche debajo».
- **concrete** — «losa acabada» es correcto, pero tres de las siete fotos son de obra.

**Cuatro referencias que la métrica puntuaba alto y no servían.** La nitidez y la
resolución no ven que una foto sea de obra a medio hacer: `pavers` y `driveways`
tenían de primera candidata una cama de arena y una subbase de grava sin adoquinar;
`concrete` colaba una pérgola sobre travertino al atardecer que no es una losa; y
`pergola-design-construction` tenía en su carpeta el producto de
`polycarbonate-pergolas` prestado. Van en `EXCLUIR` **nombradas y con el motivo
escrito**, no en un filtro por rol: se probó filtrar por `swatch-`/`gallery-` y habría
tirado fotos buenas —`swatch-*` no son muestras de color, son fotografías completas de
instalaciones— dejando pasar las de obra, que se llaman `feature-` como el resto.

### Un `alt` sin traducir es invisible para las puertas

`traducirHtml()` sí traduce `alt`, pero **nada avisa cuando falta**:
`traducibles.mjs` solo extrae nodos de texto, la pasada de atributos no apunta las
ausencias en `faltan`, y `comprobar-i18n.mjs` no lee atributos. La cobertura seguiría
en verde con los 17 `alt` en inglés.

Al medirlo salió que **ya pasaba**: el `alt` del CTA genérico no estaba en ningún
diccionario de fragmento y viajaba en inglés en las ~100 páginas de `/es/`. La versión
por clave de `shell.ts` solo cubre el `CtaFinal.astro` del blog y el FAQ. Se añadieron
los 17 a `productos.es.ts` / `servicios.es.ts` y el genérico a `comun.es.ts`.

### Se sustituye el `<img>` entero, no las rutas sueltas

El bloque lleva **cuatro rutas distintas** —los tres `-p-NNN` del srcset más el
master, que además sale dos veces porque es el candidato de 2000w y el `src`—. El
idiom de `replaceAll` sobre una ruta que usa el paso 4d habría dejado tres candidatos
apuntando a la foto vieja, y el navegador elige un `-p-NNN` en casi todos los
viewports: se habría seguido viendo la vieja casi siempre. Los 10 productos llevan el
bloque **dos veces** y son indistinguibles entre sí, así que van los dos.

De paso se arreglan dos cosas del markup de Webflow. `sizes` decía
`(max-width: 2000px) 100vw, 2000px` cuando la sección **siempre** ocupa el ancho
completo: pasa a `100vw`. Y el srcset gana el candidato de **1600** —que existía en
disco y no pedía nadie— y el de **2400**. Verificado en el navegador a dpr 2: con el
`sizes` nuevo elige el de 2400; con el viejo se quedaba en 2000.

**El juego tiene que estar completo.** El mapa exige los cinco ficheros, no solo el
master: con un juego a medias el srcset pide un `-p-NNN` que no existe y el fallo sale
en `check:imagenes` como «una URL de dist no existe», sin decir por qué. Si faltan
todos, esa página usa el genérico; si faltan algunos, revienta con el nombre de los
que faltan.

### La legibilidad se midió, no se miró

Las capturas siguen saliendo en blanco en este entorno —ya está documentado más
arriba—, así que el «¿se lee el titular?» se resolvió con números sobre la geometría
real, medida en el navegador: a 1440 la sección es 1440x371 (se ve el **66%** del alto
de la imagen) y a 390 es 390x414 (el **37%** del ancho). Contraste del texto blanco
sobre el fondo ya velado, midiendo el fondo ANTES de pintar el texto:

| | media | 5% más claro |
|---|---|---|
| a 1440 | 8,7:1 | **4,5:1** |
| a 390 | 9,0:1 | **4,7:1** |

O sea que el fondo que ya está publicado está **justo en la línea** de los 4,5:1 que
WCAG AA pide para texto normal, en sus zonas más claras. Por eso el techo de media 160
hace trabajo real: una imagen más clara que ésa hunde el párrafo. La medida quedó
dentro de la puerta y suspende por debajo de **3:1**, que es el mínimo para texto
grande —por ahí el titular deja de leerse—; el número del párrafo se imprime siempre
pero no suspende, porque una puerta que suspende a la referencia no mide calidad.

## §9 no se suma a la ficha: ocupa el turno del vídeo, y eso son dos cosas

`ProyectoDeFicha.astro` lo llevaba escrito desde el día que se creó: la sección
«One We Built» **sustituye** al bloque de vídeo, y añadirla «obliga a mover otro».
Se hizo la primera mitad —el vídeo se retira con `video: false` en el registro— y
no la segunda. Con la sección **delante** de las reseñas y **sin fondo**, las
cuatro fichas con proyecto etiquetado quedaron así:

```
#specs OSCURO > §9 clara > reseñas clara > #faq claro
```

Medido a 1440 sobre `dist`, muestreando el píxel real a media banda:

| | racha clara |
|---|---:|
| `solid-roof-pergolas` | **4.879 px** |
| `cabanas` | 2.767 px |
| `carports` | 2.587 px |
| `sukkha` | 2.492 px |

**Las 17 puertas estaban verdes**, en los dos modos, y así se publicó. Ninguna
miraba el orden de las bandas ni su color. El defecto no salió de una puerta:
salió de muestrear el píxel.

**Por qué no se ve leyendo el CSS.** `.pp-proyecto-ficha` y `.section-faq-page` no
declaran `background-color`: en el código parecen neutras y en pantalla heredan el
`--white` del cuerpo. `.resenas` sí declara, pero `--secundary` (#fffbf0) es crema.
Tres bandas que el CSS presenta como distintas y el ojo lee como una sola.

**El arreglo es el que dice el propio componente**: la sección va **detrás** de las
reseñas —el hueco exacto que dejó el vídeo— y con el fondo del vídeo,
`--primary`. Queda idéntico al piloto: `#specs OSCURO > reseñas claro > §9 OSCURO >
#faq claro`.

### La tarjeta hubo que rescatarla, y eso no se veía venir

`.projects-card-body-page` **ya es `--primary`** en el CSS del sitio —medido en
pantalla, `rgb(58,84,91)`—, porque en `/project-gallery/` va sobre fondo claro.
Sobre la sección oscura el cuerpo de la tarjeta se disolvía en el fondo y solo
quedaba la foto flotando con texto debajo. Se invierte a crema **dentro de §9 y
solo ahí**, con el mismo recurso de «panel crema sobre primary» que ya usa
`.pp-specs`. La alternativa de un solo `--terceary` para la sección se descartó:
baja el contraste del titular de 8,9:1 a 4,81:1 y mete un tercer tono de banda en
un sitio que tiene dos.

### Y el titular decía «One We Built» sobre nueve tarjetas

`solid-roof-pergolas` tenía **nueve** proyectos etiquetados: 3.024 px de sección
bajo un titular en singular, en los dos idiomas — y ésos son los que llevaban la
racha de 2.500 a 4.879. Se capa a **dos**, que es una fila entera de la rejilla de
dos columnas, así que no deja huecos. Las otras siete siguen en
`/project-gallery/`. El tope va en el componente y no en `proyectosDeFicha()`, que
es una consulta: es decisión de presentación.

### `screen-enclosures` no tiene arreglo de CSS, y hay que decirlo

Encadena **reseñas clara > #faq claro**, 1.813 px, y no lo reportó nadie. No es un
color mal puesto: **le falta una banda**. Entre `#specs` (oscuro) y `service-areas`
(foto oscura) solo tiene esas dos, y dos bandas entre dos oscuras no pueden
alternar — la primera tiene que ser clara, la segunda oscura, y la segunda choca
con la de detrás. No trae `video-section` en su fragmento y ningún proyecto de la
galería lleva su etiqueta. Se cierra sola el día que el cliente etiquete un
proyecto de cerramientos; hasta entonces va **perdonada y con el motivo escrito**
en `comprobar-ritmo.mjs`.

### La puerta

`check:ritmo` lee los hijos de `section.body-page` de las 20 fichas y resuelve el
tono de cada banda **contra el CSS construido**, resolviendo las `var()` de
`:root` — no contra una tabla escrita a mano, que se quedaría vieja el día que
alguien cambie un token. Estática y sin navegador, igual que
`comprobar-carruseles.mjs` y por el mismo motivo. Los 20 mapas se comprobaron
contra el píxel pintado con Playwright y coinciden.

Lleva **autocomprobación**, que es lo que separa una puerta verde de una puerta
muda: si `color()` dejara de entender el CSS, todo saldría `claro` y esto pasaría
en verde sin haber medido nada. Cada ficha tiene por construcción bandas oscuras y
una foto, y eso se exige antes de juzgar.

## Los cuatro fondos de CTA que «pasaban» no eran esos cuatro

El traspaso anterior dejó una tabla de medidas con un veredicto por foto. **No
reproduce.** Remedidas las seis fotos de cliente con la propia puerta del repo
—`medirCentro` + `legibilidad` de `comprobar-cta.mjs`—, deslizando la ventana de
2500×980 (2,55:1) en 17 posiciones sobre el máster de 2500×1406:

| Ficha | Tabla anterior | Medido |
|---|---|---|
| `solid-roof-pergolas` | ✅ cualquiera | ✅ los 17 offsets · mejor y=338, media 133,5 |
| `sukkha` | ✅ cualquiera | ✅ solo y=0..182 |
| `screen-enclosures` | ❌ suspende | ✅ y=78..390 |
| `open-air-pergolas` | ❌ suspende | ✅ solo y=0..52 |
| `motorized-screens` | ✅ cualquiera | ❌ ningún recorte (máx. 94,8 < 110) |
| `polycarbonate-pergolas` | ⚠️ solo abajo | ❌ ningún recorte (mín. 183,4 > 160) |

**El método está validado contra la única verdad que existe**: el recorte superior
de la foto del piloto da media 120,9 y el AVIF ya publicado da 121,0. Un decimal.
Cuatro de los seis veredictos anteriores estaban del revés.

### De las cuatro que pasan la medida entran tres

`sukkha` se descarta **mirando el montaje**, que es exactamente para lo que
existe. La página vende el **Sukkha 3000** —«sistema automatizado», lo dice su
propia entradilla— y la foto es un sukkah blanco de evento vestido con flores y
guirnaldas: producto distinto. La puerta mide recorte y legibilidad y **no sabe de
qué producto es la foto**; eso lo pone un humano. Vuelve el día que el cliente
confirme que esa estructura es un 3000.

### Los `alt` eran prompts de IA, y se notaba al mirar la foto

Los tres que entran se reescribieron **mirando el recorte publicado**:

| Decía | Es |
|---|---|
| «warm wood-grain soffit … waterfront … in Jupiter» | techo de panel liso, piscina en patio vallado, ciudad desconocida |
| «white aluminum … above a paver patio … in Parkland» | estructura bronce oscuro, lo que se ve es la fachada |
| «over a swimming pool and lake view … in Coral Springs» | contrapicado: ni piscina ni lago, solo la estructura contra el cielo |

Y **el par español va indexado por la cadena inglesa**: cambiar `cta-slots.mjs`
sin cambiar `productos.es.ts` deja el `alt` en inglés en `/es/` y no lo dice
ninguna puerta — `comprobar-i18n.mjs` cuenta nodos de texto y `comprobar-seo.mjs`
solo exige que el atributo exista.
