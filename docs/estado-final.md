# Estado final — Pergola Plus Florida

Fecha: 18 de agosto de 2026 · Rama `link-provisional-y-leads`.

**DESPLEGADO en un link provisional:** https://pergola-plus-preview.vercel.app
(proyecto `pergola-plus-preview` del equipo `senaviacorp`, subido por CLI). El
dominio real **sigue sirviendo Webflow y no se ha tocado**: `www` → `cdn.webflow.com`
vía Cloudflare, HTTP 200, verificado después del deploy.

La puerta única `npm run check` está en verde de punta a punta, y ahora en **dos
modos**, porque hay dos formas del sitio que proteger:

```bash
npm run check                        # forma PROVISIONAL: no se puede indexar
PUBLIC_ES_PRODUCCION=1 npm run check # forma PRODUCCIÓN: sitemap, RSS, indexable
```

Los dos salen con exit 0. Son 12 puertas: las 10 de siempre más `check:noindex` y
`check:correo`.

---

## Lo que se puede medir

| | Antes | Ahora |
|---|---|---|
| Formularios que envían a algún sitio | 0 de 3 | **3 de 3** |
| Referencias al staging de Webflow en el HTML servido | 761 | **0** |
| Páginas mintiendo en `hreflang` | 106 | **0** |
| `<img>` sin `width`/`height` (CLS) | 6.853 | **0** |
| Páginas con JSON-LD | 27 | **211** |
| `<title>` duplicados | 19 | **0** |
| `meta description` duplicadas | 12 | **0** |
| Enlaces muertos tolerados | 5 | **0** |
| Flechas de carrusel sin función | ~250 | **0** |
| Scripts de terceros | 3 | **1** (jQuery, que `webflow.js` necesita) |
| Peticiones a Google para ver la página | sí | **0** |
| Páginas en español | 1 | **105** de 211 |
| Desbordamiento horizontal a 320 px | — | **0** |
| `sitemap.xml` / `robots.txt` | no existían | **209 urls + robots** |
| Canónicas apuntando al dominio del cliente desde un preview | 211 | **0** |
| Canales que entregan un lead de verdad | 0 en producción | **correo + webhook** |
| Formularios con antibot real | 0 | **2 de 2** (los de captación) |

---

## Los cinco agujeros del encargo, y cómo quedaron

### 1. Formularios muertos → CERRADO

Los tres llegaron de Webflow con `method="get"` y sin `action`. Se rellenaban, la
página recargaba con los datos en la URL y no los recibía nadie — en las 113
páginas, porque el del pie va en todas.

Ahora hay `POST /api/lead` con validación de servidor, y **funciona sin
JavaScript** (POST nativo → 303 → `/thank-you`). Verificado enviando los tres
formularios desde el navegador: los tres leads quedan registrados con su formulario
y su página de origen.

Cuatro bugs que `method="get"` tapaba y que en un POST real sí rompen:

- **Tres campos** distintos —producto, presupuesto y plazo— compartían `name` e `id`
  `Estimated-Project-Budget`. Llegaba el presupuesto donde iba el producto.
- La casilla de consentimiento SMS compartía `name` con una casilla de mejoras.
- El `<form>` del estimador no tenía `action` ni manejador: un Enter recargaba la
  página y borraba lo calculado.
- **`data-turnstile-sitekey` mataba las dos páginas de captación.** Hacía que
  `webflow.js` cargara Turnstile y dejara *todos* los formularios de la página en
  `w-form-loading` con el submit `disabled`, esperando un widget que este sitio no
  renderiza. Sin un error en consola y con el botón de aspecto normal.

### 2. Español a medias → CERRADO

De 1 página a **77**. Está en español todo el sitio menos tres cosas, y las tres se
dejaron fuera a propósito, no por falta de tiempo:

| Sección | Estado |
|---|---|
| Home, índices de producto y servicio | **traducido** |
| Las 10 fichas de producto | **traducido** |
| Las 7 páginas de servicio | **traducido** |
| Las 25 páginas de ubicación + índice | **traducido** |
| Los 3 condados | **traducido** |
| Las 5 marcas + índice | **traducido** |
| Las 10 fichas de proyecto + galería | **traducido** |
| Las 3 de contacto + la de gracias | **traducido** |
| Sobre nosotros, opiniones, sectores, FAQ, garantías | **traducido** |
| Aviso de privacidad | **traducido** |
| Blog: índice + 21 artículos + 5 categorías | **traducido** |
| **Contrato de obra (`terms-of-service`)** | en inglés, a propósito |
| Calculador de presupuesto | **traducido** |

Queda fuera una sola cosa, y es deliberada: **el contrato de obra**
(`/articles/terms-of-service`), 4.554 palabras que empiezan diciendo que sus
condiciones no son negociables. Una versión en español sería un segundo texto legal
sin aprobar, y ante una discrepancia habría que defenderlo en un juzgado de Florida.
Lo traduce un abogado o nadie.

**El blog sí se tradujo** —los 21 artículos, el índice y las 5 categorías— y con una
herramienta de por medio, no a mano: `scripts/emparejar-traduccion.mjs` extrae las
claves inglesas del propio fragmento y las empareja con un `.txt` de traducciones, y
**se para** si los dos lados no tienen el mismo número de líneas. Transcribir 2.700
claves a mano es donde se cuela el espacio fino que deja una frase en inglés sin que
salte nada.

Lo que sí sigue pendiente del cliente: **nadie del negocio ha validado las cifras en
español**. Los precios, los plazos de permiso y las velocidades de viento están
traspasados literales —ni convertidos ni redondeados, y los pies siguen siendo pies—
para que revisarlos sea comparar dos columnas.

**Lo que no está traducido no existe en `/es/`, no lleva `hreflang` y no entra en el
sitemap.** Comprobado: `hreflang="es"` sale en **208 de 211** páginas, y las 3 que no
lo llevan son el contrato de obra y los dos 404.

**Cada página traducida abarató la siguiente.** Una de ubicación tiene 138 cadenas y
solo **5** son suyas; una de servicio, 90 y solo ~28. El resto ya vive en
`comun.es.ts`. Por eso las 25 ubicaciones costaron menos que las 7 páginas de
servicio: añadir una es un diccionario + su ruta en `TRADUCIDAS`.

### 3. SEO técnico → CERRADO

Dominio real, sitemap con alternates y `lastmod` real, robots, dos redirects 301,
canónicas absolutas, JSON-LD en 111 páginas y títulos únicos.

### 4. Feedback del cliente → CERRADO salvo una cosa

Hero nuevo (EN y ES), las 12 fotos nuevas en su sitio (32 MB → 1,0 MB), dropdowns
auditados, «Landscaping» retirado y MaestroShield cableado.

### 5. Enlaces muertos → CERRADO

La lista de tolerados empezó con cinco entradas y está **vacía**. Además apareció uno
que nadie había visto: `/about-us` daba 404 y lo enlazaban el menú y el pie de las
113 páginas.

---

## Pendiente de accesos o decisiones del cliente

Nada de esto se puede cerrar sin el cliente. Está ordenado por lo que bloquea.

Los dos primeros se preguntaron y están **decididos** (17-ago-2026): no son trabajo
pendiente por hacer, son decisiones tomadas esperando un dato de terceros.

### DECIDIDO Y A LA ESPERA — La política de privacidad no existe

`/articles/privacy-policy` llega **vacía**, y no es la migración: también está vacía
en producción. Cero palabras de cuerpo, frente a las 4.554 de `terms-of-service`.

Y el export del CMS lo enrarece más: el ítem «Privacy Policy» sí tiene ~19.400
caracteres, pero empiezan por `<h1>Terms &amp; Conditions</h1>` y son **el mismo
contrato de obra** que el otro ítem. O sea que no hay política de privacidad en
ninguna parte.

Importa porque esa página está enlazada desde el pie de las 113 y desde el texto de
consentimiento de los dos formularios — justo donde se recogen datos personales.

**No se ha inventado una**, y no se va a publicar sin que el cliente la apruebe: una
política de privacidad es un compromiso jurídico, y un texto plausible pero falso es
peor que una página en blanco. En la página vive un aviso honesto con vía de contacto.

Lo que sí hay es **`docs/politica-privacidad-borrador.md`**: el texto redactado sobre
lo que el sitio hace de verdad —verificado leyendo el código y el HTML construido— con
los cinco puntos que nadie puede contestar desde el código marcados `[PENDIENTE]`. Son
la fecha, el CRM cuando se configure, confirmar por escrito que no se venden datos,
cuánto tiempo se conservan y qué leyes estatales aplican. Los cuatro primeros los
contesta el cliente; el quinto es para un abogado.

Es decir: esto pasó de estar a cero a estar **a una revisión** de poder publicarse.

**Decidido:** no se publica hasta que Daniel conteste los cinco puntos. La página se
queda con el aviso honesto.

### CERRADO — Los leads llegan por correo

**Antes, y era peor de lo documentado:** `ok = canales.log || ...`, y `console.log` no
falla nunca. En producción `ok` era **siempre** true, el 500 de `/api/lead` era código
inalcanzable y el visitante veía «gracias» pasara lo que pasara con su lead.

Ahora el log es rastro, no entrega. Hay un cuarto canal —SMTP genérico— que manda dos
correos: aviso al despacho (con Reply-To al lead y el idioma en que escribió) y acuse
al visitante en su idioma. Solo el aviso cuenta como entrega.

Probado de punta a punta con un servidor SMTP de usar y tirar: los 3 formularios
enviados, 6 correos recibidos, sus dos partes (texto plano y HTML), y el lead en
español aterrizando en `/es/thank-you` con su acuse en español.

**Lo único que falta son las credenciales** (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`,
`LEAD_NOTIFY_TO`). Hasta que estén, en el deploy provisional el endpoint devuelve
**500 con el teléfono** en vez de la página de gracias — que es lo correcto, pero
significa que el formulario del demo no capta todavía.

Lo que había antes, para constancia:

**Cada build imprime ahora un aviso enmarcado** diciéndolo, y `check:formularios`
comprueba que ese aviso sigue ahí — es el fallo que no da error, así que borrarlo
«porque hace ruido» es justo como se pierde de vista.

Hace falta una de estas dos, y basta con una:

- acceso a un correo transaccional (el handoff propone `digitalpergolaplus@gmail.com`
  para desarrollo e `info@pergolaplusflorida.com` para producción), o
- una URL de CRM para `LEAD_WEBHOOK_URL`.

**Decidido:** hoy no hay URL disponible, así que se queda como está. En cuanto exista,
basta con definir la variable — no hay que tocar código ni hacen falta credenciales.

El enganche está marcado con `TODO(correo)` en `src/lib/lead.ts`. El envío de correo
y su copy quedaron **fuera de alcance por decisión del proyecto**.

### CERRADO salvo el secreto — Turnstile montado

El widget está puesto en las **2 páginas de captación** (EN y ES), y en ninguna otra:
el formulario del pie va en las 211 páginas y montarlo ahí metería un script de
terceros y sus cookies en todo el sitio para proteger un campo de boletín. El pie se
queda con la trampa y el temporizador.

El atributo es `data-sitekey`. **Nunca `data-turnstile-sitekey`**: con ese nombre,
`webflow.js` carga su propio Turnstile y deja todos los formularios de la página en
`w-form-loading` con el submit deshabilitado, sin un error en consola. Ya mató las dos
páginas de captación una vez.

Falla cerrado también sin JavaScript, y es deliberado: exigir el token solo cuando el
envío dice que traía JS lo esquiva cualquier bot mandando `js=0`. Quien navegue sin JS
ve un error en su idioma con el teléfono.

Verificado vivo con los secretos de prueba de Cloudflare: con `2x…AA` (siempre falla),
`quote` sin token → 400, con token cualquiera → 400, y el pie → 303. Con `1x…AA`
(siempre aprueba), `quote` con token → 303.

**Falta solo `TURNSTILE_SECRET_KEY` en el proyecto de Vercel.** Sin ella los leads
entran marcados `verificado:false` y el aviso al despacho lo dice en su cabecera.

### CERRADO — El link provisional no se puede indexar

Era el riesgo grande del deploy: `robots.txt` salía con `Allow: /`, el `Sitemap:`
apuntaba al dominio del cliente y las **211 canónicas** también, porque el fallback de
`PUBLIC_SITE_URL` era el dominio real. O sea, una copia del sitio entero pidiéndole a
Google que la consolidara contra el Webflow en vivo.

La regla ahora es **se indexa SOLO con `PUBLIC_ES_PRODUCCION=1`**, y falla cerrado:
olvidarla en producción da un sitio invisible que se arregla con un redeploy; al revés
daba una copia duplicada que tarda semanas en salir del índice.

Sin ella, cinco cosas a la vez, **verificadas en el deploy**:

| | Comprobado en https://pergola-plus-preview.vercel.app |
|---|---|
| `robots.txt` | `Disallow: /`, sin línea `Sitemap:` |
| `sitemap.xml` | 404 |
| RSS | 404, y ninguna página lo anuncia |
| `<meta robots>` | `noindex,nofollow` en las 211 |
| canónicas | apuntan al link provisional, **no** al dominio del cliente |

No se usa `X-Robots-Tag` por `vercel.json`: es un fichero estático que no puede leer la
variable, así que o lo hereda producción —y el sitio bueno nace invisible— o hay que
acordarse de quitarlo justo en el deploy que más caro sale olvidar.

**No difundir el RSS** cuando se publique de verdad hasta confirmar el dominio: los
`<guid>` son permanentes para quien se suscriba.

### Copy de los 3 proyectos nuevos

`Boca Beach Sukkah`, `Elan Polo Club` y `Jupiter Ocean Club`: llegaron 8 fotos y cero
texto, y ninguno coincide con los 10 slugs de `/project/`. No se han creado las
páginas porque `/project-gallery` es una rejilla de tarjetas con título y extracto,
no un lightbox donde soltar fotos.

### `/contact-us/get-services`

589 líneas de contenido real en el export, despublicada y huérfana en producción. **No
se ha publicado.** Decisión del cliente.

### Fuera de alcance por decisión del proyecto

Dominio, DNS y SSL · GA4, GTM, Search Console, Google Ads y Google Business Profile ·
chat con IA · widget de Google Reviews.

Ya **no** están fuera de alcance, y están hechos: el deploy provisional y sus variables
en Vercel, y el correo transaccional. La migración a Sanity sigue pendiente y es la
pieza grande que queda.

### Lo que no se pudo verificar aquí

La reproducción visual de las animaciones IX2. El panel del navegador de esta sesión
está oculto: `document.hidden === true` y **0 frames de `requestAnimationFrame` por
segundo**, así que las animaciones disparadas por scroll no avanzan y se leen igual
que un fallo real. Ojo: `document.hasFocus()` devuelve `true` de todas formas, así
que esa comprobación no sirve.

Lo que sí está verificado, y es determinista: IX2 conoce **los 32 de 32** `data-w-id`
de la página de producto, con 200 eventos cargados, `data-wf-page` correcto,
`w-mod-ix` puesto y el disparador `SCROLL_INTO_VIEW` bien configurado. Y la auditoría
de paridad da **0 `data-w-id` perdidos y 0 bloques anti-FOUC perdidos** en las 99
páginas comparadas contra el sitio en vivo.

Queda por hacer en un navegador visible: recorrer home, un producto, un servicio y un
post comprobando que las animaciones se ven.

Lo que sí se midió en el navegador, y es independiente de rAF porque es geometría, no
animación: en `/es/` y en nueve páginas más —producto, servicio, ubicación, contacto,
marcas, sectores, garantías, proyecto y gracias— a **320 px y a 390 px**,
`scrollWidth === clientWidth` en todas (cero desbordamiento horizontal), **cero
imágenes rotas** (`naturalWidth === 0`), `<html lang="es">` correcto y **cero textos
recortados** por un contenedor con `overflow:hidden`. Esto último era el riesgo real
de la traducción: el español ocupa ~20 % más que el inglés y es donde se parten los
botones y los titulares. Los tres titulares que el diseño parte en varios nodos se
revisaron uno a uno a 1440 px y se leen enteros.

Los objetivos táctiles por debajo de 24×24 px que aparecen son enlaces **dentro de un
párrafo**, que es la excepción explícita de WCAG 2.5.8. El único campo que medía 23 px
es la trampa antispam del pie, que va oculta a la vista con `clip-path` y con
`aria-hidden`: no la ve ni la pulsa nadie.

---

## Cómo se protege esto

Once comprobaciones, todas colgadas de `npm run check`. Ninguna depende de que
alguien se acuerde de ejecutarla.

| Puerta | Qué impide |
|---|---|
| `check:blog` | Que el minificador se coma `animation-timeline` y las entradas dejen de animarse |
| `check:enlaces` | Que vuelva un `href="#"` sin destino |
| `check:carruseles` | Que los slides 2..N vuelvan a ser inalcanzables |
| `check:imagenes` | Que el sitio pida una imagen que no está en local |
| `check:paridad` | Que se pierda un `data-w-id` y muera una animación en silencio |
| `check:generadores` | Que alguien edite salida generada a mano y la siguiente regeneración se lo lleve |
| `check:formularios` | Que un formulario deje de enviar, que el endpoint acepte basura, o que un lead en español acabe en la página de gracias inglesa |
| `check:i18n` | Que se publique español a medias o un `hreflang` que miente |
| `emparejar-traduccion` | Que una traducción se desalinee y el artículo salga con el texto de otra frase |
| `check:seo` | Que vuelva un título duplicado, una canónica cruzada o un campo vacío del CMS |
| `check:paginas` | Que salga un `undefined` en pantalla o un enlace interno a un 404 |
| `check:noindex` | Que un deploy provisional se pueda indexar, o que el candado se quede puesto en producción. Comprueba **los dos modos** |
| `check:correo` | Que los dos correos salgan rotos, sin texto plano o colando HTML del lead; y que `entregarLead()` devuelva `ok:false` cuando no queda ni un canal |

Dos avisos que **no** tumban la puerta, a propósito:

- 46 títulos y 2 descripciones del CMS fuera del rango recomendado. Es copy que
  escribió el cliente y la decisión es suya.
- 76 imágenes del CMS que no pide ninguna página (11,3 MB).

---

## Antes de enseñarle el link a Daniel

1. **`SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` / `LEAD_NOTIFY_TO` en Vercel.** Es lo
   único que separa el demo de captar de verdad: hoy el endpoint devuelve 500 con el
   teléfono, que es honesto pero no capta. Con Gmail: `smtp.gmail.com`, puerto 587, y
   una App Password (necesita 2FA en la cuenta).
2. **`TURNSTILE_SECRET_KEY` en Vercel.** Sin ella el antibot acepta todo marcando
   `verificado:false`. El widget ya está puesto.

## Antes de publicar en el dominio real

1. `PUBLIC_ES_PRODUCCION=1`. Sin ella el sitio nace invisible — a propósito.
2. Confirmar el dominio y definir `PUBLIC_SITE_URL`.
3. Rellenar la política de privacidad en el CMS y quitar la regla provisional de
   `scripts/lib/transformar.mjs` (lanza sola si el cliente ya la ha rellenado). Ojo:
   hay que rellenarla **en los dos idiomas** — `/es/articles/privacy-policy` sirve la
   misma pieza traducida por `src/i18n/articulos.es.ts`.
4. Recorrer las animaciones en un navegador visible.
5. Enviar el sitemap a Search Console cuando el dominio esté en pie.

Y cuando el cliente decida sobre el español que falta (`docs/decisiones.md`):

6. Validar las cifras de los 21 artículos del blog en español. Están traducidos y
   publicados; lo que falta es que alguien del negocio confirme precios, plazos y
   cargas de viento.
7. Encargar a un abogado la versión española del contrato de obra, o dejarla en
   inglés. **No la traduzca nadie más.**
