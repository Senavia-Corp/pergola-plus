# Estado final — Pergola Plus Florida

Fecha: 17 de agosto de 2026 · Rama `main`, 9 commits, **sin desplegar**.

La puerta única `npm run check` está en verde de punta a punta: build + blog +
enlaces + carruseles + imágenes + paridad + generadores + formularios + i18n + seo +
páginas.

```bash
npm run check
```

---

## Lo que se puede medir

| | Antes | Ahora |
|---|---|---|
| Formularios que envían a algún sitio | 0 de 3 | **3 de 3** |
| Referencias al staging de Webflow en el HTML servido | 761 | **0** |
| Páginas mintiendo en `hreflang` | 106 | **0** |
| `<img>` sin `width`/`height` (CLS) | 6.853 | **0** |
| Páginas con JSON-LD | 27 | **111** |
| `<title>` duplicados | 19 | **0** |
| `meta description` duplicadas | 12 | **0** |
| Enlaces muertos tolerados | 5 | **0** |
| Flechas de carrusel sin función | ~250 | **0** |
| Scripts de terceros | 3 | **1** (jQuery, que `webflow.js` necesita) |
| Peticiones a Google para ver la página | sí | **0** |
| Páginas en español | 1 | **14** |
| Desbordamiento horizontal a 320 px | — | **0 en las 113** |
| `sitemap.xml` / `robots.txt` | no existían | **111 urls + robots** |

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

### 2. Español a medias → PARCIAL Y HONESTO

De 1 página a 14: home, productos, servicios, las tres de contacto y **las 7 páginas
de servicio completas**, con sus 5 preguntas frecuentes cada una. Es decir, el camino
entero desde que un visitante llega hasta que deja sus datos, y toda la sección de
servicios sin un hueco en inglés.

**Lo que no está traducido no existe en `/es/`, no lleva `hreflang` y no entra en el
sitemap.** Media traducción publicada es peor que ninguna: el visitante llega en su
idioma y se topa con inglés al segundo clic. El aviso al pie de `/es/` dice
exactamente qué está y qué no.

Queda por traducir, en orden de valor: las 29 páginas de ubicación (24.088 palabras),
las 10 fichas de producto (11.471), el blog y sus 21
entradas (19.401), y el resto de estáticas. Total medido con
`npm run extraer -- --resumen`: **8.841 cadenas, 79.169 palabras.**

**Cada página traducida abarata la siguiente.** Una página de servicio tiene 90
cadenas y solo ~28 son suyas: las otras 62 ya están en `comun.es.ts` (el bloque de
proceso, las 10 tarjetas de proyecto, las zonas de servicio, las reseñas y el CTA
final). Añadir una es una entrada en su registro + su ruta en `TRADUCIDAS`.

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

### DECIDIDO Y A LA ESPERA — Los leads solo quedan en el log

`entregarLead()` tiene tres canales: log, archivo local y webhook. En producción, sin
correo ni `LEAD_WEBHOOK_URL` configurados, **el único canal vivo es el log de
Vercel**. Nadie mira los logs.

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

### Turnstile sin secreto

El sitekey del cliente (`0x4AAAAAAAQTptj2So4dx43e`) está en `.env.example`. Sin
`TURNSTILE_SECRET_KEY`, `/api/lead` acepta los leads marcándolos `verificado:false` y
**cada build avisa por consola**. Con el secreto puesto se verifica siempre y se falla
cerrado.

Para montar el widget de verdad faltan tres cosas: el `<script>` de Cloudflare, un
contenedor `.cf-turnstile` en cada formulario y la variable en Vercel. El endpoint ya
espera el token en `cf-turnstile-response`.

### Dominio sin confirmar

`PUBLIC_SITE_URL` cae en `https://www.pergolaplusflorida.com`. **No difundir el RSS**
hasta confirmarlo: los `<guid>` son permanentes para quien se suscriba.

### Copy de los 3 proyectos nuevos

`Boca Beach Sukkah`, `Elan Polo Club` y `Jupiter Ocean Club`: llegaron 8 fotos y cero
texto, y ninguno coincide con los 10 slugs de `/project/`. No se han creado las
páginas porque `/project-gallery` es una rejilla de tarjetas con título y extracto,
no un lightbox donde soltar fotos.

### `/contact-us/get-services`

589 líneas de contenido real en el export, despublicada y huérfana en producción. **No
se ha publicado.** Decisión del cliente.

### Fuera de alcance por decisión del proyecto

Dominio, DNS y SSL · deploy y variables en Vercel · GA4, GTM, Search Console, Google
Ads y Google Business Profile · migración a Sanity · chat con IA · widget de Google
Reviews.

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
| `check:formularios` | Que un formulario deje de enviar, o que el endpoint acepte basura |
| `check:i18n` | Que se publique español a medias o un `hreflang` que miente |
| `check:seo` | Que vuelva un título duplicado, una canónica cruzada o un campo vacío del CMS |
| `check:paginas` | Que salga un `undefined` en pantalla o un enlace interno a un 404 |

Dos avisos que **no** tumban la puerta, a propósito:

- 46 títulos y 2 descripciones del CMS fuera del rango recomendado. Es copy que
  escribió el cliente y la decisión es suya.
- 76 imágenes del CMS que no pide ninguna página (11,3 MB).

---

## Antes de subir

1. Definir `TURNSTILE_SECRET_KEY` en Vercel. Sin ella el antibot acepta todo.
2. Definir `LEAD_WEBHOOK_URL` **o** cablear el correo. Si no, los leads solo quedan en
   el log.
3. Confirmar el dominio y definir `PUBLIC_SITE_URL`.
4. Rellenar la política de privacidad en el CMS y quitar la regla provisional de
   `scripts/lib/transformar.mjs` (lanza sola si el cliente ya la ha rellenado).
5. Recorrer las animaciones en un navegador visible.
6. Enviar el sitemap a Search Console cuando el dominio esté en pie.
