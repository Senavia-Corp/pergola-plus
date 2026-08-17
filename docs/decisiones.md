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
