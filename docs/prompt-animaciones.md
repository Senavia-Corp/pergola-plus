# Auditoría y rediseño de las animaciones — Pergola Plus Florida

> **Cómo se usa.** Pega este documento entero como primer mensaje de una sesión nueva
> en `~/Sites/pergola-plus`. Está escrito para leerse en frío: no supone que conozcas
> el proyecto ni ninguna conversación anterior.

---

## El encargo

Las animaciones del sitio se ven **pesadas, poco naturales y con direcciones
incoherentes**. Actúa como diseñador de UX/UI y de movimiento: audita **cómo aparece
cada sección al hacer scroll**, en tiempo real y con tus propios ojos, y arréglalas
hasta que el sitio se lea como animado profesionalmente.

Tienes permiso para cambiar lo que haga falta, incluida la arquitectura de animación,
y para publicar al terminar. Lo que no tienes es permiso para dar por bueno lo que no
hayas medido.

---

## 0 · LEE ESTO ANTES DE MEDIR NADA

### La trampa que invalida la auditoría entera

**Con la pestaña sin foco, `requestAnimationFrame` se para y los tweens se congelan a
medias.** Una página sana se lee como rota, y una rota puede leerse como sana.

Ya casi produjo un falso positivo en la auditoría de la migración: la página de FAQ
parecía rota con los `.faq_item` congelados en `opacity: 0.238`. No estaba rota —
estaba medida sin foco. Está documentado en `docs/auditoria-animaciones.md`.

**Método obligatorio en toda medición:**

```js
// Si esto no es true, la medición NO VALE. Descártala y repite con un clic real.
document.hasFocus() === true
```

Una sola pestaña. Clic real en la página antes de medir. No alternes entre pestañas
para comparar: mide una, cierra, mide la otra.

Ojo: `document.hidden` puede mentir en el sentido contrario. La comprobación buena es
`hasFocus()`, y aun así conviene confirmar que rAF avanza:

```js
// Cuenta fotogramas durante 500 ms. Si sale 0, no estás midiendo animaciones:
// estás midiendo una foto fija.
await new Promise(r => { let n = 0, t = performance.now();
  (function f(){ n++; performance.now() - t < 500 ? requestAnimationFrame(f) : r(n); })(); });
```

### Segunda trampa: las capturas salen en blanco

Las secciones que aún no han entrado llevan `opacity: 0`. En una captura salen
**vacías**, y parece que la página está rota.

Puedes revelarlas a mano para juzgar composición:

```js
document.querySelectorAll('[style*="opacity:0"],[style*="opacity: 0"]')
  .forEach(e => { e.style.opacity = '1'; e.style.transform = 'none'; });
```

Pero eso **no prueba que la animación funcione**. Sirve para mirar el diseño, nunca
para afirmar que un reveal está bien.

---

## 1 · Cómo servir el sitio de forma fiel

| Vía | ¿Sirve? |
|---|---|
| `astro preview` | **No existe.** El adaptador de Vercel no trae servidor de preview: muere con «Preview server process exited before becoming ready» |
| `astro dev` | Arranca, pero **no aplica** la reescritura de enlaces al español ni genera sitemap/robots: son pasos de build. **No es fiel** |
| Servir `.vercel/output/static` | **Esta.** Es exactamente lo que despliega Vercel |
| `https://pergola-plus-preview.vercel.app` | El link publicado. Útil para contrastar, lento para iterar |

Servidor de revisión (aplica también las rutas de Vercel, incluido el 404 en español):

```js
// /tmp/servir-build.mjs  ·  node /tmp/servir-build.mjs  ->  http://localhost:4500
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const RAIZ = '/Users/senavia/Sites/pergola-plus/.vercel/output/static';
const CFG = JSON.parse(fs.readFileSync('/Users/senavia/Sites/pergola-plus/.vercel/output/config.json','utf8'));
const TIPO = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript',
  '.avif':'image/avif', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg',
  '.webp':'image/webp', '.xml':'application/xml', '.txt':'text/plain', '.woff2':'font/woff2', '.json':'application/json' };
const enviar = (res, f, st) => { res.writeHead(st, { 'content-type': TIPO[path.extname(f)] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(res); };
http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  for (const c of [url.slice(1), url.replace(/\/$/,'') + '/index.html', url.slice(1) + 'index.html']) {
    const f = path.join(RAIZ, c);
    if (c && fs.existsSync(f) && fs.statSync(f).isFile()) return enviar(res, f, 200);
  }
  for (const r of CFG.routes) {
    if (!r.src || r.continue || r.handle) continue;
    if (!new RegExp(r.src).test(url)) continue;
    if (r.dest?.startsWith('_')) { res.writeHead(200,{'content-type':'application/json'});
      return res.end('{"nota":"funcion serverless; no corre en este servidor"}'); }
    if (r.headers?.Location) { res.writeHead(r.status, { location: r.headers.Location }); return res.end(); }
    if (r.dest) return enviar(res, path.join(RAIZ, r.dest), r.status ?? 200);
  }
  res.writeHead(404); res.end('404');
}).listen(4500, () => console.log('revision en http://localhost:4500'));
```

Reconstruye con `npm run build` antes de servir, y **vuelve a lanzar el servidor**
después de cada build.

---

## 2 · Dónde viven las animaciones (esto no es CSS)

Las animaciones de scroll son **interacciones IX2 de Webflow**, definidas dentro de
`public/js/webflow.js` — 338 KB minificados que vienen del export. No hay un blob
aparte: el motor y los datos van en el mismo fichero.

Inventario medido sobre ese fichero:

| Qué | Cuánto |
|---|---|
| `eventTypeId: SCROLL_INTO_VIEW` | **110** |
| Preset `growIn` (escala + fundido) | **73** |
| `slideInLeft` | 22 |
| `slideInRight` | 7 |
| `slideInBottom` | 6 |
| `slideInTop` | 1 |
| `duration: 500` | **67 tweens** |
| `easing: easeInOut` | **56 tweens** |
| `PAGE_SCROLL_UP` / `PAGE_SCROLL_DOWN` | 24 / 24 (el nav) |
| `MOUSE_OVER` / `MOUSE_OUT` | 18 / 18 |
| `MOUSE_CLICK` | 3 (acordeón FAQ) |

Para reproducirlo:

```bash
python3 -c "
import re,pathlib,collections
w=pathlib.Path('public/js/webflow.js').read_text(errors='ignore')
for pat,n in [(r'actionListId:\"([\w-]+)\"','preset'),(r'eventTypeId:\"([A-Z_0-9]+)\"','evento'),
              (r'duration:(\d+)','duracion'),(r'easing:\"([\w-]*)\"','easing')]:
    print(n, dict(collections.Counter(re.findall(pat,w)).most_common(8)))"
```

---

## 3 · El diagnóstico, y por qué es ese

No hace falta que lo redescubras. Contrástalo, y amplíalo con lo que veas.

**«Se ven pesadas».** `easeInOut` en **56 tweens**. En una *entrada*, `easeInOut`
arranca lento **y** termina lento: el elemento parece arrastrar peso. Una entrada
quiere `ease-out` — entra rápido y asienta. Y **500 ms** es largo para un reveal;
entre 250 y 400 ms se lee ágil sin parecer un parpadeo.

**«Poco naturales».** El mismo `easeInOut`, más recorridos largos, más `growIn` como
gesto dominante (73 de 110). Una escala genérica en cada bloque lee a «pop» de
plantilla, no a movimiento intencionado.

**«Dirección incoherente».** **Cinco vocabularios sin regla**: `growIn`, `slideInLeft`,
`slideInRight`, `slideInBottom`, `slideInTop`, repartidos sin relación con el layout.
Un bloque a ancho completo que entra desde la izquierda no significa nada; lo que
significa algo es que la columna izquierda entre por la izquierda.

**Y una causa de fondo que se nota aunque no se nombre:** IX2 anima con JavaScript
sobre `requestAnimationFrame`. Compite con el scroll por el hilo principal, y por eso
se siente «espeso» en móvil y en páginas con muchas imágenes.

---

## 4 · La solución: el sistema que ya existe en este repo

**No inventes uno nuevo.** `src/styles/blog.css` ya tiene el correcto, funcionando en
el blog, protegido por `check:blog`:

```css
@media (prefers-reduced-motion: no-preference) {
  [data-pp-reveal] {
    animation-duration: 0.5s;
    animation-timing-function: ease-out;
    animation-fill-mode: both;
    animation-timeline: view();
    animation-range: entry 0% cover 20%;
  }
  [data-pp-reveal] { animation-name: pp-entrada; }
}

@keyframes pp-entrada {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: none; }
}
```

Es **scroll-driven nativo**: corre en el compositor, sin JavaScript, sin competir con
el scroll. Extiéndelo al resto del sitio.

### La gramática de movimiento que debes imponer

Una sola, con regla. Ajústala si tu criterio de diseño dice otra cosa, pero **escribe
el porqué** en el CSS.

- **Por defecto: `translateY` corto hacia arriba.** El contenido sube al entrar,
  acompañando al scroll en vez de pelearse con él. 12–24 px, no más.
- **Lateral solo cuando el layout lo justifica.** Columna izquierda desde la izquierda,
  su gemela derecha desde la derecha. **Nunca lateral en contenido a ancho completo.**
- **Escala casi nunca.** Resérvala para un elemento que de verdad sea el foco de la
  sección. Como entrada genérica es lo que hace que 73 bloques se sientan iguales.
- **Escalonado en rejillas.** `animation-delay` progresivo (40–60 ms entre tarjetas).
  Es lo que más separa «animado» de «animado con criterio». No encadenes más de 5 o 6:
  el último llega tarde y se nota.
- **Una sola duración base.** Elige una y deriva las demás de ella con una variable
  CSS, para que el sitio tenga un tempo y no doce.
- **Nada de animar el hero.** Lo primero que se ve tiene que estar ahí. Animar por
  encima del pliegue retrasa el LCP y se percibe como lentitud, no como diseño.

### Degradación: los keyframes DEBEN terminar en el estado de reposo

`animation-timeline: view()` no está en todos los navegadores. Donde no exista, la
animación **corre una vez al cargar**. Si el último fotograma es el estado bueno
(`opacity: 1`, `transform: none`), el resultado es correcto y solo se pierde el efecto.

Si lo inviertes, el elemento se queda **fijado en el estado equivocado**. Ese error ya
ocurrió aquí con una barra de progreso que necesitaba `@supports` porque su fotograma
final era el incorrecto; está explicado en `src/styles/blog.css`. Prefiere keyframes
que aterricen bien y no necesiten guarda.

---

## 5 · EL PELIGRO: 42 páginas pueden quedar EN BLANCO

**Léelo dos veces.** Es el fallo que no da ningún error.

42 páginas llevan un bloque heredado de Webflow, con esta forma:

```css
@media (min-width:992px) {
  html.w-mod-js:not(.w-mod-ix) [data-w-id="9e6cd8cc-1a46-44d5-b687-f5405cbfa2df"] { opacity:0; }
}
/* …y la misma regla repetida en 4 media queries */
```

Traducción: **«mantén este elemento invisible hasta que IX2 haya arrancado»**. IX2
pone la clase `w-mod-ix` en `<html>` al iniciarse, y entonces el elemento se revela.

Si desactivas el reveal de IX2 de un `data-w-id` **sin retirar también su regla
anti-FOUC**, ese elemento no se revela **nunca**. La página carga, no hay error en
consola, y la sección simplemente no está.

**Regla:** retirar el anti-FOUC de un `data-w-id` y su reveal IX2 es **una sola
operación indivisible**. Después de cada cambio, verifica la opacidad final:

```js
[...document.querySelectorAll('[data-w-id]')]
  .filter(e => getComputedStyle(e).opacity === '0' && e.getBoundingClientRect().height > 0)
  .map(e => e.getAttribute('data-w-id'))   // tiene que salir []
```

Localiza las 42:

```bash
grep -rl 'w-mod-js:not(.w-mod-ix)' dist/client --include=index.html | wc -l
```

---

## 6 · Reglas del repo que no puedes saltarte

**`src/pages/` y `src/contenido-migrado/` son SALIDA GENERADA.** Editarlos a mano lo
revierte el siguiente `node scripts/generar-paginas.mjs`, en silencio. Los cambios de
markup van a `scripts/lib/transformar.mjs`. Lo caza `check:generadores`.

**`npm run build` NO comprueba tipos.** Las puertas de verdad son los
`scripts/comprobar-*.mjs`, encadenados en `npm run check`.

**Verifica en LOS DOS MODOS**, siempre, antes de publicar:

```bash
npm run check                                                        # forma provisional
PUBLIC_ES_PRODUCCION=1 PUBLIC_SITE_URL=https://www.pergolaplusflorida.com npm run check
```

Las 12 puertas tienen que salir en verde en ambos. Si una se pone roja, es de tu
cambio.

**`check:paridad` compara los `data-w-id` contra las capturas de `docs/vivo/`.**
Migrar reveals **la va a mover**. No la desactives: actualízala conscientemente y
escribe en el propio script por qué el conjunto esperado cambió, o pierdes la única
red que impide que muera una animación en silencio.

**Nunca el atajo `animation:`.** El minificador lo fusiona con `animation-timeline` y
tira la declaración entera. Propiedades largas, siempre, y `animation-name` en su
propia declaración. Lo vigilan `check:blog` y `check:marquee`.

**Todo dentro de `prefers-reduced-motion: no-preference`.** `src/styles/accesibilidad.css`
ya trae el bloque `reduce` global; respétalo y amplíalo si añades selectores.

**`git add` por ruta explícita, nunca `-A` ni `-a`.** Puede haber otra sesión
trabajando en el mismo directorio. Mira `git status` antes de cada commit.

**No toques el dominio real.** `www.pergolaplusflorida.com` sirve el Webflow del
cliente vía Cloudflare y no se toca. El link provisional es
`pergola-plus-preview.vercel.app`, y su `noindex` depende de que
`PUBLIC_ES_PRODUCCION` **no** esté definida en Vercel. No la definas.

---

## 7 · Cobertura exigida

### En vivo, con scroll real, sección a sección

Un arquetipo de cada tipo. Los `data-w-id` de cada uno están medidos, para que sepas
cuánto tienes que ver moverse:

| Arquetipo | Ruta | `data-w-id` | anti-FOUC |
|---|---|---|---|
| home | `/` | 40 | sí |
| producto | `/products/cabanas` | 40 | sí |
| servicio | `/services/concrete` | 40 | sí |
| estáticas | `/about-us/about-us` | 43 | sí |
| ubicación | `/pergolas-contractors/aventura-pergola-builders` | 34 | no |
| condado | `/countries/broward-county-pergola-contractor` | 34 | no |
| marca | `/brands/appolo` | 25 | no |
| proyecto | `/project/attached-forte-pergola-in-west-palm-beach` | 25 | no |
| blog | `/resources/blog` | 24 | no |
| artículo | `/post/add-shade-backyard-south-florida` | 23 | no |
| contacto | `/contact-us/get-a-quote` | 23 | no |

**Y sus gemelas en `/es/`.** El sitio es bilingüe (105 páginas en español) y el
español ocupa ~20 % más que el inglés: un reveal que encaja en inglés puede partir un
titular en español. Comprobadas y existentes: `/es/products/cabanas`,
`/es/services/concrete`, `/es/brands/appolo`, `/es/resources/blog`,
`/es/contact-us/get-a-quote`.

**Anchos:** 1440, 1280, 768 y 375 px. En móvil las animaciones pesan el doble.

### Barrido automático de las 211

Después de mirar los arquetipos, un script que recorra **las 211 páginas construidas**
y liste toda página que se salga del patrón: elementos que se quedan invisibles,
`data-w-id` con anti-FOUC pero sin reveal (o al revés), reveals que sobreviven en IX2
donde deberían haberse migrado.

Sin ese barrido, «revisé las animaciones» son 11 páginas de 211.

---

## 8 · La puerta que tienes que dejar

`scripts/comprobar-animaciones.mjs`, enganchado a `npm run check`. Sigue el estilo de
`scripts/comprobar-marquee.mjs`: comentario que explique **qué fallo concreto impide**,
con la medición que lo justifica.

Tiene que afirmar lo que no da error al romperse:

1. **Ningún elemento se queda invisible.** Cero `data-w-id` con `opacity: 0` y altura
   > 0 tras su reveal. Es el fallo de las 42 páginas.
2. **Anti-FOUC y reveal van juntos.** Ningún `data-w-id` con regla anti-FOUC sin su
   reveal, ni reveal sin su regla.
3. **Ninguna regla de entrada usa el atajo `animation:`.**
4. **Toda animación de entrada vive dentro de `prefers-reduced-motion: no-preference`.**
5. **Los keyframes de entrada terminan en el estado de reposo** (`opacity: 1`,
   `transform: none`), que es lo que salva a los navegadores sin scroll-timeline.

Y **pruébala rompiendo el código a propósito**: si no la ves ponerse roja con el fallo
que dice vigilar, no sabes si vigila algo.

---

## 9 · Cómo entregar

**Antes de tocar nada**, un informe: por sección, qué está mal, **la medición que lo
demuestra**, la causa y el arreglo propuesto. Sin cifras es una opinión.

**Al terminar:**

```bash
npm run check                                                        # exit 0
PUBLIC_ES_PRODUCCION=1 PUBLIC_SITE_URL=https://www.pergolaplusflorida.com npm run check   # exit 0
git add <rutas explícitas> && git commit && git push origin main
```

El push a `main` despliega solo: el proyecto `pergola-plus-preview` del equipo
`senaviacorp` está conectado a `Senavia-Corp/pergola-plus` con rama de producción
`main`. Comprueba el resultado **en el link publicado**, no en el mensaje del CLI:

```bash
curl -s https://pergola-plus-preview.vercel.app/robots.txt | head -2   # Disallow: /
```

Si `robots.txt` deja de decir `Disallow: /`, para: has definido
`PUBLIC_ES_PRODUCCION` sin querer y el link provisional se ha vuelto indexable
compitiendo con el sitio del cliente.

---

## 10 · Criterio de aceptación

No es «se ven mejor». Es esto:

- [ ] Un solo vocabulario de entrada, con regla escrita en el CSS.
- [ ] Una sola duración base, derivada con variable CSS.
- [ ] Los reveals de scroll no corren sobre `requestAnimationFrame`.
- [ ] Cero elementos invisibles en las 211 páginas.
- [ ] Nada animado por encima del pliegue.
- [ ] Escalonado en rejillas, con tope.
- [ ] `prefers-reduced-motion` respetado.
- [ ] Los 11 arquetipos revisados en vivo, EN y ES, a 4 anchos, con `hasFocus()` true.
- [ ] Barrido de las 211 sin desviaciones.
- [ ] Puerta nueva en `npm run check`, probada rompiéndola.
- [ ] Las 12 puertas en verde en los dos modos.
- [ ] Publicado y comprobado en el link.

---

## Ficheros de referencia

| Fichero | Qué contiene |
|---|---|
| `docs/auditoria-animaciones.md` | La auditoría de la migración. **La trampa del foco está aquí** |
| `src/styles/blog.css` | El sistema modelo: `[data-pp-reveal]` + `animation-timeline: view()` |
| `src/styles/marquee.css` | Marquees de logos y fotos, ya migrados a CSS nativo |
| `src/styles/accesibilidad.css` | El bloque `prefers-reduced-motion: reduce` global |
| `src/styles/carrusel.css` | Carruseles por scroll nativo, sin JS de animación |
| `public/js/webflow.js` | IX2: motor y datos de las 110 interacciones |
| `scripts/lib/transformar.mjs` | El generador. Todo cambio de markup migrado va aquí |
| `scripts/comprobar-marquee.mjs` | Ejemplo de puerta de animación bien escrita |
| `scripts/auditar-paridad.mjs` | Compara `data-w-id` contra `docs/vivo/` |
| `docs/estado-final.md` | Estado del proyecto y decisiones abiertas |
