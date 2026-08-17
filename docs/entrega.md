# Entrega — Pergola Plus Florida

**17 de agosto de 2026.** El sitio está construido, verificado y subido a GitHub.
Falta desplegarlo, y para eso hacen falta **seis datos** que no están en el código.

Este documento es lo que hay que contestar. Todo lo demás está hecho.

---

## Lo que hay que contestar

Cinco de las seis las contesta Daniel. La sexta la contesta un abogado.

### 1 · ¿Cuál es el dominio definitivo?

Hoy el sitio asume `https://www.pergolaplusflorida.com`. De ese dato cuelgan las
canónicas, los `hreflang`, el sitemap, el JSON-LD y los identificadores del feed RSS.

**Por qué importa antes y no después:** los `<guid>` del RSS son permanentes para
quien se suscriba. Si el feed se difunde con un dominio y luego se cambia, los
suscriptores ven los artículos duplicados. **No difundir el RSS hasta confirmar esto.**

### 2 · ¿A dónde van los leads?

Hoy, en producción, un lead se escribe en el log de la función de Vercel **y en
ningún sitio más**. El log nadie lo mira.

Basta **una** de estas dos, no las dos:

- **Una URL de CRM.** Se define `LEAD_WEBHOOK_URL` en Vercel y el endpoint empieza a
  hacer POST del lead en JSON. No hay que tocar código ni hacen falta credenciales.
- **Un correo transaccional.** Esto sí es trabajo: el enganche está marcado con
  `TODO(correo)` en `src/lib/lead.ts`, pero el proveedor, las plantillas y el texto
  quedaron fuera de alcance por decisión del proyecto.

Mientras tanto, cada build imprime un aviso enmarcado y una de las comprobaciones
automáticas verifica que ese aviso siga ahí. Es el fallo que no da error: si alguien
borra el aviso «porque hace ruido», se pierde de vista.

### 3 · La clave secreta de Turnstile

El sitekey del cliente ya está (`0x4AAAAAAAQTptj2So4dx43e`). Falta el secreto, que va
**solo en el servidor**, como `TURNSTILE_SECRET_KEY` en Vercel.

- **Sin ella:** el endpoint acepta los leads y los marca `verificado:false`. Cada build
  avisa.
- **Con ella:** se verifica siempre contra Cloudflare y **falla cerrado** — un token
  ausente o inválido es un rechazo, nunca un «pasa».

Para montar el widget visible faltan además el `<script>` de Cloudflare y un
contenedor `.cf-turnstile` en cada formulario. El endpoint ya espera el token.

### 4 · Las cinco preguntas de la política de privacidad

**No hay política de privacidad.** No es un fallo de la migración: también está vacía
en producción. Y el export del CMS lo enrarece más — el ítem «Privacy Policy» tiene
19.400 caracteres, pero empiezan por `<h1>Terms & Conditions</h1>` y son el mismo
contrato de obra que el otro ítem.

Importa porque esa página está enlazada desde el pie de las 184 páginas y desde el
texto de consentimiento de los dos formularios, justo donde se recogen datos
personales.

**No se ha inventado una.** Una política de privacidad es un compromiso jurídico, y un
texto plausible pero falso es peor que una página en blanco. Mientras tanto, la página
lleva un aviso honesto con vía de contacto para ejercer derechos, en inglés y en
español.

Lo que sí hay es el borrador completo en `docs/politica-privacidad-borrador.md`,
redactado sobre lo que el sitio hace **de verdad** —verificado leyendo el código y el
HTML construido— con cinco huecos marcados `[PENDIENTE]`:

| # | Pregunta | Quién contesta |
|---|---|---|
| 1 | Fecha de entrada en vigor | Daniel |
| 2 | Qué CRM recibirá los leads (enlaza con el punto 2) | Daniel |
| 3 | Confirmar **por escrito** que no se venden ni ceden datos a terceros | Daniel |
| 4 | Cuánto tiempo se conservan los datos de un lead | Daniel |
| 5 | Qué leyes estatales de privacidad aplican al negocio | un abogado |

Con esas cinco respuestas, la política pasa de no existir a estar **a una revisión** de
publicarse. Hay que rellenarla **en los dos idiomas**: la versión española se sirve de
la misma pieza, traducida en `src/i18n/articulos.es.ts`.

### 5 · El texto de los tres proyectos nuevos

Llegaron 8 fotos de `Boca Beach Sukkah`, `Elan Polo Club` y `Jupiter Ocean Club`, y
**cero texto**. Ninguno coincide con los slugs de proyecto que ya existen.

No se han creado las páginas porque `/project-gallery` es una rejilla de tarjetas con
título y extracto que enlazan a su ficha, no un álbum donde soltar fotos sueltas. Con
un título y un párrafo por proyecto, las tres fichas salen en una tarde.

### 6 · ¿El contrato de obra se traduce al español?

`/articles/terms-of-service` son 4.554 palabras de un contrato vinculante que empieza
diciendo *these terms and conditions are not negotiable*.

**No se ha traducido, y no debe traducirlo nadie que no sea un abogado.** Publicar una
versión en español sería publicar un segundo texto legal sin aprobar; ante cualquier
discrepancia entre las dos versiones, habría que defenderla en un juzgado de Florida.

Decisión: se encarga a un abogado, o se deja en inglés. Las dos son válidas. Lo que no
vale es traducirlo por encima.

### Y una que no bloquea nada: los 21 artículos del blog

El blog es lo único que queda en inglés además del contrato. Son **19.401 palabras**
que afirman precios en dólares, requisitos de permiso por municipio y cargas de
viento. Traducir eso sin revisión no es cambiar de idioma: es publicar afirmaciones
nuevas sobre normativa y dinero en nombre de Pergola Plus.

La mecánica está montada y es barata —cada artículo son unas 135 frases propias, el
resto ya está traducido y compartido—. Lo que falta no es trabajo técnico: es que
alguien del negocio valide las cifras en español.

---

## Lo que ya está hecho

| | Antes | Ahora |
|---|---|---|
| Formularios que envían a algún sitio | 0 de 3 | **3 de 3** |
| Referencias al staging de Webflow | 761 | **0** |
| Páginas mintiendo en `hreflang` | 106 | **0** |
| `<img>` sin `width`/`height` (CLS) | 6.853 | **0** |
| Páginas con JSON-LD | 27 | **184** |
| `<title>` duplicados | 19 | **0** |
| Enlaces muertos tolerados | 5 | **0** |
| Flechas de carrusel sin función | ~250 | **0** |
| Scripts de terceros | 3 | **1** (jQuery, que `webflow.js` necesita) |
| Páginas en español | 1 | **78** de 184 |
| `sitemap.xml` / `robots.txt` | no existían | **182 urls + robots** |

**Once comprobaciones automáticas**, todas colgadas de un solo comando. Hoy: 156
verificaciones en verde, 0 fallos.

```bash
npm run check
```

Ninguna depende de que alguien se acuerde de ejecutarla, y cada una existe porque tapó
un fallo real que no daba error: un formulario que no enviaba, un `hreflang` que
mentía, un carrusel cuyas flechas no hacían nada, un `data-w-id` perdido que mataba
una animación en silencio.

### Verificación previa al despliegue

Hecha hoy sobre el paquete que se subiría:

- **184 páginas** en la salida estática, **78** de ellas en español.
- **Cero** recursos referenciados que no existan: se revisaron los 184 HTML buscando
  cada `css`, `js`, `woff2`, imagen y vídeo que piden.
- `sitemap.xml`, `robots.txt` y el feed RSS, presentes.
- El endpoint sale empaquetado como **función de servidor**, no como página estática
  —si se prerenderizara, los formularios dejarían de enviar y ninguna otra
  comprobación lo notaría—.
- Los dos redirects 301 (`/about-us` y `/deck-builders`), en la configuración.
- Sin desbordamiento horizontal a 320 px ni textos recortados en las páginas
  españolas, que es donde se parten: el español ocupa un 20 % más que el inglés.

### Lo único que no se pudo comprobar aquí

La reproducción visual de las animaciones. El navegador de esta sesión corre con la
pestaña oculta, y con la pestaña oculta el navegador congela las animaciones por
scroll: se leen exactamente igual que un fallo real.

Lo que sí está verificado y es determinista: el motor de animaciones conoce **los 32
de 32** identificadores de la página de producto, con 200 eventos cargados y el
disparador bien configurado, y la auditoría contra el sitio en vivo da **0
identificadores perdidos** en las 99 páginas comparadas.

Queda recorrer en un navegador normal la home, un producto, un servicio y un artículo
comprobando que las animaciones se ven.

---

## Orden para poner esto en pie

1. Confirmar el dominio → definir `PUBLIC_SITE_URL` en Vercel.
2. Definir `TURNSTILE_SECRET_KEY`. **Sin ella el antibot acepta todo.**
3. Definir `LEAD_WEBHOOK_URL` **o** cablear el correo. Si no, los leads solo quedan en
   el log.
4. Desplegar y recorrer las animaciones en un navegador normal.
5. Enviar el sitemap a Search Console.
6. Cuando lleguen las cinco respuestas: rellenar la política de privacidad en el CMS,
   en los dos idiomas, y quitar la regla provisional de `scripts/lib/transformar.mjs`
   —que salta sola en cuanto el cliente rellene el campo, para que nadie publique el
   aviso provisional creyendo que es la política—.

Los pasos 1 a 3 son variables en el panel de Vercel: ni código, ni despliegue nuevo.

**Fuera de alcance por decisión del proyecto:** dominio, DNS y SSL · despliegue y
variables en Vercel · GA4, GTM, Search Console, Google Ads y Google Business Profile ·
migración a Sanity · chat con IA · widget de reseñas de Google.
