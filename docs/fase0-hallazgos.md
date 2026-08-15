# Fase 0 — Pre-vuelo: hallazgos

Fecha: 2026-08-14
Sitio de referencia: https://pergola-plus-florida.webflow.io/
Export: `/Users/senavia/Downloads/Webflow Pergola Plus Florida/`

---

## 1. El sitemap.xml no existe

`https://pergola-plus-florida.webflow.io/sitemap.xml` → **404** (devuelve la página "Not Found"
de Webflow, no un XML). `robots.txt` está **vacío**.

Webflow solo genera el sitemap para el dominio propio publicado, o la opción está desactivada.

**Método alternativo usado, y es mejor evidencia:** se crawlearon **20 páginas del sitio en
vivo** y se extrajeron todos los `href` internos. Los prefijos de ruta salen del sitio real,
no de una inferencia.

---

## 2. Prefijos de ruta — LOS 6 CONFIRMADOS ✅

El plan marcaba 6 colecciones con prefijo sin confirmar (66 URLs en riesgo). **Las 6 coinciden
exactamente con la inferencia del nombre del archivo.** Cero sorpresas.

| Colección | Prefijo confirmado | Items | Evidencia |
|---|---|---|---|
| Products | `/products/{slug}` | 10 | href absoluto en el export + vivo |
| Services | `/services/{slug}` | 7 | href absoluto en el export + vivo |
| Blog Posts | `/post/{slug}` | 21 | **crawl del vivo** (32 hrefs) |
| Projects | `/project/{slug}` | 10 | **crawl del vivo** (20 hrefs) |
| Brands | `/brands/{slug}` | 5 | **crawl del vivo** (5 hrefs) |
| Countries | `/countries/{slug}` | 3 | **crawl del vivo** (3 hrefs) |
| Pergolas Contractors | `/pergolas-contractors/{slug}` | 25 | **crawl del vivo** (25 hrefs) |
| Articles | `/articles/{slug}` | 2 | **crawl del vivo** (10 hrefs) |

Ojo al singular: es `/post/` y `/project/`, **no** `/posts/` ni `/projects/`. Y `/countries/`
en plural aunque el contenido sean condados de Florida.

**El bloqueante de SEO del plan queda cerrado.** Se puede crear la estructura de carpetas.

---

## 3. Inventario de URLs verificado

102 URLs esperadas (18 estáticas + 83 de CMS + 1 suelta), las 102 comprobadas una a una
contra el sitio en vivo:

- **99 → HTTP 200**
- **3 → HTTP 404** (ver abajo)

**Chequeo inverso: cero URLs en el vivo que falten en el inventario.** Se compararon las 99
URLs internas únicas halladas en el crawl contra la lista construida desde los CSV: coinciden.
El inventario está completo.

Entregables:
- `docs/urls-actuales.txt` — las 99 URLs vivas, una por línea. Es la lista contra la que se
  verifica la paridad y se construyen los redirects.
- `docs/urls-actuales-estado.txt` — las 102 con su código HTTP.

Reparto: pergolas-contractors 25 · post 21 · project 10 · products 10 · services 7 ·
brands 5 · about-us 5 · raíz/1-nivel 5 · resources 3 · countries 3 · contact-us 3 · articles 2.

---

## 4. Los tres 404 — qué son y qué hacer

### `/deck-builders` → 404 · **enlace roto ya existente**
Aparece 2 veces en el export y 1 en el sitio en vivo. El destino correcto es
`/services/deck-builders`, que existe y responde 200 (enlazado correctamente 25 veces en el
export, 5 en el vivo).

Es un bug que **ya está en producción**, no algo que introduzca la migración.
→ **Acción:** corregir el `href` en el markup migrado **y** añadir un redirect 301
`/deck-builders → /services/deck-builders` por si alguien tiene el enlace guardado.

### `/resources/product-info` → 404 · **página sin publicar**
Resuelve la duda que dejó abierta el plan. El archivo del export tiene solo 30 líneas (el
shell, sin contenido) y en el vivo da 404. **No hay contenido oculto que el export no
capturara: la página simplemente no está publicada.**
Nadie la enlaza, ni en el export ni en el vivo.
→ **Acción:** no migrarla. Confirmar con el cliente que no la quiere; si la quiere, es
contenido nuevo, no migración.

### `/contact-us/get-services` → 404 · **página huérfana con contenido real** ⚠️
El caso raro y el único que necesita decisión del cliente.

El export **sí** trae `contact-us/get-services.html` con **589 líneas de contenido real**:
H1 "Request Service", un proceso de 5 pasos (Submit Your Request → Schedule Your Visit →
On-Site Diagnosis → Repair or Maintenance Service → Quality Check & Follow-Up) y un
formulario "Submit a Service Request".

Pero: da 404 en el vivo, y **nadie la enlaza** — ni el nav, ni el footer, ni ninguna página,
ni en el export ni en el vivo. Es una página terminada pero despublicada en Webflow.

→ **Acción: preguntar al cliente.** Es una página de captación de servicio técnico completa.
Que esté despublicada puede ser deliberado o un descuido. Las tres opciones:
  a) migrarla y publicarla (hay que enlazarla desde el nav o el footer, si no nace huérfana),
  b) migrarla despublicada como borrador,
  c) descartarla.
Hasta que responda, **no se migra**: publicarla sin querer cambiaría el sitio.

---

## 5. Estado del repositorio

```
~/Sites/pergola-plus/
├── astro.config.mjs        Astro 5.15.11 + @astrojs/vercel
├── public/css/             normalize.css · webflow.css · pergola-plus-florida.webflow.css
├── public/js/              webflow.js
├── src/layouts/            BaseLayout.astro (mínimo)
└── docs/                   este archivo + los inventarios de URLs
```

Los 4 archivos de CSS/JS se copiaron **verbatim, verificados con SHA-256** contra el origen:

| Archivo | Bytes | SHA-256 |
|---|---|---|
| `css/normalize.css` | 7 772 | ✅ idéntico |
| `css/webflow.css` | 39 354 | ✅ idéntico |
| `css/pergola-plus-florida.webflow.css` | 126 924 | ✅ idéntico |
| `js/webflow.js` | 338 365 | ✅ idéntico |

`images/` **no** se copió: pasa por la Fase 0.5, que separa diseño (→ `public/images/`) de
contenido (→ Sanity).

---

## 6. Pendientes que requieren acción tuya

1. **Google Search Console** — exportar el listado de URLs indexadas. No tengo acceso.
   Sirve para dos cosas: cazar URLs indexadas que ya no existan (no las hay según el crawl,
   pero GSC puede conocer URLs viejas de antes de un rediseño) y medir el impacto tras el
   cutover.
2. **Decidir sobre `/contact-us/get-services`** (ver punto 4).
3. **Confirmar el dominio de producción.** Todo esto se verificó contra el staging
   `.webflow.io`. Si el dominio real tiene contenido o rutas distintas, hay que repetir el
   crawl contra él.
