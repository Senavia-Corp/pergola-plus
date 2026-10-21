# Prompt · Auditoría SEO final — Pergola Plus Florida

> Copia todo lo que hay debajo de la línea en un chat nuevo de Claude Code abierto en
> `~/Sites/pergola-plus` con la rama `main` al día (`git pull`). Está pensado para un
> equipo de agentes: un subagente por rol, en paralelo cuando no dependan entre sí.

---

## Encargo

Eres el **director de un equipo de SEO técnico y de contenidos**. Tu trabajo es la
**auditoría final** de **Pergola Plus Florida** antes de publicarlo en
`www.pergolaplusflorida.com`. Hoy ese dominio lo sirve un Webflow antiguo. El sitio nuevo
es Astro 7, con contenido en Sanity y alojado en Vercel.

El objetivo es que el sitio quede **optimizado para SEO en todos los aspectos**. Tienes
que responder tres cosas:

1. **¿Se puede lanzar?** `GO`, `GO CON CONDICIONES` o `NO-GO`, con evidencia medida.
2. **¿Qué falta para que el SEO sea excelente?** Un backlog completo y priorizado, con el
   fichero, el documento o el campo exacto de cada cambio, listo para ejecutar en otro chat.
3. **¿Qué hay que hacer el día del cambio de dominio y las 4 semanas siguientes?**

### Sin restricciones heredadas de Webflow

El sitio se migró desde Webflow, pero **ya no tiene que respetar ninguna limitación de
Webflow**. Audita y propone cambios sobre todo, aunque antes se dejara «tal cual»:

- **Textos SEO:** `<title>`, meta description, H1 y la jerarquía de encabezados. Propón
  versiones nuevas con su longitud y su keyword. Antes eran intocables porque eran texto
  del cliente; ahora son recomendaciones a aprobar.
- **Marcado heredado:**
  - clases `w-*`;
  - `data-w-id` (la home tiene 125);
  - `data-wf-page` y `data-wf-site`;
  - `<style>` en línea;
  - CSS de Webflow sin uso;
  - envoltorios `w-dyn-*`.
  Mide cuánto pesan y cuánto estorban al rendimiento y al rastreo. La home sirve 209 KB de
  HTML.
- **Estructura de URL:** los slugs de Webflow (`/countries/` para condados,
  `/pergolas-contractors/` para ciudades, `/project/`, `/post/`, `/articles/`). Si conviene
  cambiarlos, propón el mapa de 301 y valora el coste.
- **Contenido duplicado o fino** entre las 25 ciudades y los 3 condados (textos y fotos
  repetidos), canibalización y huecos de keywords.
- **Lo demás que se aceptó como deuda:** imágenes de galería sobredimensionadas, 180
  imágenes del CMS sin uso, LCP móvil de 2 a 3 s y todo lo que figure como «deuda previa».

Cada propuesta lleva su impacto esperado, su riesgo y quién la aprueba. Los cambios de
texto visible y de diseño los aprueba el cliente; los técnicos, Senavia.

## Estado de partida (21-oct-2026)

- **Código:** `main` está en `7509dc9`, con los PR #1 (rendimiento), #2 y #3 (Sanity y SEO
  técnico) fusionados.
- **Vercel:**
  - proyecto `pergola-plus-preview` (team `senaviacorp`, plan **Pro**);
  - producción sirve `main` en https://pergola-plus-preview.vercel.app, protegida con
    Vercel Authentication;
  - `PUBLIC_ES_PRODUCCION=0`: el sitio entero va con `noindex`, el `robots.txt` está
    bloqueado y no hay sitemap;
  - no tiene dominio propio.
- **Sanity:**
  - proyecto `n0ct9t3k`, dataset `production` (público);
  - Studio en https://pergola-plus.sanity.studio/;
  - el webhook «Vercel producción · main» lanza el deploy hook `sanity-production-main`;
  - el webhook viejo está desactivado.
- **Sitio:** 218 páginas (109 EN y 109 ES); 64 URL antiguas del Webflow en vivo con su 301.
- **Pendiente fuera del SEO**, que tienes que medir como riesgo:
  - **SMTP:** sin él, los formularios devuelven 500;
  - **Turnstile:** falta el secreto;
  - **DNS**;
  - **analítica:** el sitio en vivo tiene GTM, GA4, Google Ads y la verificación de Search
    Console, y el nuevo no tiene nada;
  - **política de privacidad:** solo hay un texto provisional;
  - **términos en español:** son una traducción de cortesía sin revisión legal.
- **Ya resuelto**, aunque `07-ESTADO-PARA-ENTREGA.md` diga lo contrario: el trabajo ya está
  en `main` y el deploy hook ya apunta a `main`.

Lee antes de nada:
- `implementation-reports/ENTREGA-2026-10/06-NUBE-NOCHE-2026-10-21.md`, sobre todo «Cierre
  en local», C8 y C9, y `07-ESTADO-PARA-ENTREGA.md`;
- `docs/estado-final.md`, `docs/decisiones.md` y `docs/redirects.md`;
- `implementation-reports/SEO-OPTIMIZATION-2026-10/` e
  `implementation-reports/PERF-100-2026-10/`;
- `~/Sites/CLAUDE.md` y la memoria del proyecto.

## Reglas de la auditoría

- **Solo se audita; no se cambia nada.** Ni código, ni documentos de Sanity, ni
  configuración de Vercel o Sanity, ni DNS, ni cuentas de Google. Todo lo que haya que
  cambiar va al backlog.
- **Accesos:** generar un Shareable Link de Vercel o usar `web_fetch_vercel_url` crea un
  bypass temporal de la protección. **Pide el OK en el chat antes del primero.** Lectura
  con los conectores (Vercel, Sanity) y con `npx sanity` (sesión del CLI), sí.
- **Secretos:** no imprimas ni guardes tokens ni URL de deploy hooks (nada de `echo $…`,
  `env`, `set -x`). De las variables de entorno, solo nombres y destinos.
- **Medición:**
  - sobre el `dist` construido y sobre el deploy real, **nunca** sobre `npm run dev`;
  - build de producción:
    `PP_FUENTE=sanity PUBLIC_ES_PRODUCCION=1 PUBLIC_SITE_URL=https://www.pergolaplusflorida.com npm run build`;
  - build en modo cerrado: `PP_FUENTE=sanity npm run build`.
- **Una comprobación que no corre no cuenta como verde:** ponla como «NO CORRIÓ» y di por
  qué.
- **Lighthouse:** 3 corridas y la mediana. Mira `diagnostics.rtt`: si pasa de 0,1, la
  corrida tiene ruido y se repite. Y espera estados, no milisegundos.
- **No dispares builds en masa.** Cada escritura en Sanity lanza un deploy de producción
  (el 21-oct, unas escrituras en masa agotaron el cupo diario de Vercel). Esta auditoría
  no escribe, así que no debería pasar.
- **El español del sitio es el de Florida:** pies, mph, «con licencia».

## Superficies que hay que auditar (todas)

| Superficie | URL o acceso | Qué mirar |
|---|---|---|
| Build local | `dist/client` tras el build de producción | todo lo técnico, sin red |
| Producción en Vercel | https://pergola-plus-preview.vercel.app y el deploy de `main` (conector de Vercel: `list_deployments`, `get_deployment`) | cabeceras reales, redirecciones 301/308, caché, CSP, compresión, TTFB, que sirva el mismo HTML que el build |
| Configuración de Vercel | conector: proyecto, variables (solo nombres), dominios, protección, firewall, deploy hooks, rama de producción | qué cambia el día del lanzamiento; Speed Insights y Web Analytics (Pro) |
| Studio de Sanity | https://pergola-plus.sanity.studio/ (Chrome del usuario, que tiene sesión) | si un editor puede mantener el SEO: campos SEO por tipo, validaciones, plantilla inicial, previsualización, avisos de longitud |
| API y dataset de Sanity | `https://n0ct9t3k.api.sanity.io/v2025-01-01/data/query/production` (público) y `npx sanity documents query` | qué expone el dataset público; que cada documento con página tenga `seo.titulo`, `seo.descripcion` y `seo.imagenOg` con alt; `_updatedAt` frente a `lastmod` |
| CDN de Sanity | `cdn.sanity.io` | que el HTML no lo use (0 hoy) y qué pasa cuando un editor cambia una foto (descarga y AVIF en el build) |
| Gestión de Sanity | sanity.io/manage: webhooks, tokens (nombres y roles), CORS, miembros | riesgos y limpieza: `website_token_setting` (Access Manager, sin caducidad) y `migracion-nube-2026-10-21` |
| Sitio en vivo (línea base) | https://www.pergolaplusflorida.com (Webflow antiguo) | URL, títulos y H1 actuales, etiquetas (GTM-TKKRL526, G-HE8WG1NFV9, G-QT4LKRP0GZ, AW-11106946679, verificación de Search Console), schema, enlaces entrantes probables: lo que **no se puede perder** al cambiar |
| Google | Search Console, GA4, Business Profile, si hay acceso | cobertura, consultas, CWV de campo. Si no hay acceso: «NO CORRIÓ» y qué acceso falta |

## El equipo

Cada rol entrega una tabla: `hallazgo · evidencia (comando, URL o fichero:línea) ·
severidad (P0 bloquea el lanzamiento, P1 antes de 30 días, P2 mejora) · impacto
esperado · dueño (Senavia / cliente / abogado / Google) · cambio exacto (fichero,
documento de Sanity y campo, o ajuste de Vercel)`.

### 1. Rastreo, indexación y arquitectura
- `npm run check` (26 puertas) y `node scripts/perf/crawl.mjs <carpeta>`:
  - canonical;
  - hreflang y `x-default`;
  - H1 y orden de encabezados;
  - enlaces rotos;
  - profundidad de clic y enlaces entrantes por página;
  - huérfanas;
  - paginación.
- `robots.txt` (producción y cerrado), `sitemap.xml` (214 URL; `lastmod` fiable), RSS,
  `llms.txt` y la política de rastreadores IA.
- **Arquitectura de URL y enlazado interno:** silos producto → proyecto → ciudad, migas,
  menú y pie. Valora si los slugs de Webflow convienen o hay que migrarlos, con el mapa de
  301.
- Cabeceras reales del deploy (`curl -sI` con el enlace temporal): `X-Robots-Tag`, caché,
  CSP, HSTS, redirecciones de barra final y de dominio.

### 2. Migración desde el Webflow en vivo
- Rastrea el sitio en vivo y guarda una foto de cada URL: título, descripción, H1,
  canonical, schema y etiquetas. Compárala con el sitio nuevo URL a URL (las 64 de su
  sitemap y las que aparezcan enlazadas).
- `npm run check:urls-antiguas`, y en producción las 64 con `curl -sI`, sin y con barra:
  un solo salto a una 200 con canonical autorreferente.
- **Qué se pierde si se cambia el DNS hoy:** medición, conversiones de Ads, verificación de
  Search Console y datos estructurados que hoy existan. Plan para conservarlos.

### 3. On-page y contenido (sin límites de Webflow)
- **Títulos:** las 218 páginas, de `crawl.csv`. Hoy 76 `<title>` pasan de 60 caracteres y
  38 de 70. **Propón el título nuevo** de cada uno con su keyword principal.
- **Descripciones y H1:** las mismas 218, con su propuesta de mejora.
- **Mapa de keywords:**
  - una intención por página;
  - canibalización entre productos y servicios;
  - entre las 25 ciudades y los 3 condados;
  - entre los 21 posts.
- **Contenido fino o duplicado:** páginas de ciudad con el mismo texto o la misma foto de
  portada y de og.
- **E-E-A-T:** licencias, años de experiencia, reseñas, autoría de los posts, fechas,
  fuentes.
- **Imágenes:**
  - alt (contenido, posts y og);
  - nombres de fichero;
  - el marquee de logos (las copias, con `alt=""`).
- **Español:**
  - calidad;
  - cifras de los 21 posts sin validar;
  - términos legales en traducción de cortesía.

### 4. Datos estructurados
- `npm run check:jsonld` y validación externa de una muestra de cada tipo (Rich Results
  Test y validator.schema.org):
  - HomeAndConstructionBusiness y Service;
  - Product y Brand;
  - BlogPosting;
  - FAQPage;
  - BreadcrumbList;
  - WebSite;
  - AdministrativeArea y City.
- **Qué falta:** Review y AggregateRating (solo con reseñas reales), `areaServed` por
  ciudad, `sameAs`, `logo`, `image` en JPEG.
- **NAP idéntico** en el JSON-LD, el pie, la página de contacto y Google Business Profile.

### 5. Internacional (EN/ES)
- `check:i18n`:
  - las 109 parejas recíprocas;
  - `lang`, `og:locale` y `og:locale:alternate`;
  - los enlaces de `/es/` que saquen al inglés;
  - el selector de idioma.
- ¿Merecen las páginas en español keywords propias (búsquedas en español del sur de Florida) y no solo la traducción?

### 6. Rendimiento y Core Web Vitals
- `scripts/perf/lighthouse.sh` + `resumen.mjs` en las 16 plantillas, móvil y escritorio ×3,
  sobre producción (con el enlace temporal) y en local.
- CLS (`scripts/perf/cls-estimador.mjs`), LCP móvil, «imágenes a mejorar», 180 imágenes
  del CMS sin uso (28 MB), CSS y JS sin uso, peso del HTML con el marcado de Webflow, y
  Turnstile (unos 750 KB externos) en las páginas de captación.
- **Speed Insights de Vercel (Pro):** si conviene activarlo para tener CWV de campo antes
  de Search Console.

### 7. Sanity como CMS de SEO
- `npm run check:sanity-esquema`, `check:sanity-cobertura` y `check:sanity-fidelidad`.
- **Por tipo de documento:** qué campos de SEO tiene, si el build los lee de verdad
  (title, description, og:image, `noindex`, canonical) y si el editor ve avisos útiles
  (longitud, alt obligatorio).
- **Faltan, y conviene valorarlos:**
  - canonical personalizado;
  - `noindex` por documento;
  - datos de Review;
  - previsualización SERP;
  - redirecciones gestionadas desde el CMS.
- **Flujo del editor:**
  - crear una página nueva (sitemap, hreflang, og, JSON-LD, `enlazarCiudades`);
  - cambiar una foto;
  - publicar, con el webhook a producción.
- **Riesgos:** dataset público (qué datos expone), tokens, miembros, copias de seguridad
  (plan Free).

### 8. Vercel e infraestructura
- **Configuración de producción:** variables (solo nombres), dominios, protección,
  firewall, rama de producción y deploy hooks.
- **Lanzamiento:** la lista exacta de cambios del día:
  - dominio y certificado;
  - `PUBLIC_SITE_URL` y `PUBLIC_ES_PRODUCCION=1`;
  - quitar la protección;
  - SMTP y Turnstile;
  - redeploy.
- **Formularios:** el riesgo de conversión (500 sin SMTP) y de spam (sin Turnstile), y
  cómo afecta a las señales del sitio.

### 9. SEO local
- **Google Business Profile:**
  - categoría y servicios;
  - NAP;
  - enlace al sitio;
  - reseñas (el snapshot es manual y faltan las credenciales de la API).
- **Páginas de ciudad:** frente a la zona de servicio real; contenido local propio por
  ciudad; citas y directorios (Houzz, BBB, Yelp) con NAP coherente.

## Entregable

Un único fichero, `implementation-reports/ENTREGA-2026-10/08-AUDITORIA-SEO-FINAL.md`:

1. **Veredicto** en una línea, y por qué.
2. **Bloqueantes (P0)**, cada uno con evidencia, dueño y cambio exacto.
3. **Backlog de optimización (P1 y P2)**, ordenado por impacto. Cada entrada se tiene que
   poder ejecutar sin volver a investigar: fichero:línea, o documento y campo de Sanity, o
   ajuste de Vercel. Separa:
   - lo técnico, que aprueba Senavia;
   - el texto y el diseño visible, que aprueba el cliente: títulos, descripciones, H1,
     slugs y contenido;
   - lo legal y de cuentas.
4. **Tabla de títulos, descripciones y H1 propuestos** para las 218 páginas, con su
   longitud. Puede ir en un anexo `08-anexo-titulos.md`.
5. **Tabla de puertas y comprobaciones:** verde, rojo con su causa, o NO CORRIÓ con su
   causa.
6. **Plan del día del lanzamiento y de las 4 semanas siguientes:** pasos en orden, cada uno
   con su comprobación.
7. **Lo que no se pudo medir** y qué acceso hace falta.

Si una comprobación necesita un acceso que no tienes, dilo y sigue con lo demás.
