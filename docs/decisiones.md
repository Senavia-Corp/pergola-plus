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
