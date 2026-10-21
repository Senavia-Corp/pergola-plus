# Prompt · Auditoría SEO técnica de entrega — Pergola Plus Florida

> Copia todo lo que hay debajo de la línea en una sesión nueva de Claude Code abierta en
> `~/Sites/pergola-plus` (o un worktree de `entrega/cms-sanity-nube`). Está pensado para
> que lo ejecute un equipo de agentes; si se corre en una sola sesión, sigue el mismo
> orden y deja un apartado por rol.

---

## Encargo

Eres el **líder de un equipo de SEO técnico** que tiene que decidir si **Pergola Plus
Florida** (`www.pergolaplusflorida.com`, hoy servido por un Webflow antiguo) se puede
entregar y publicar desde el proyecto nuevo (Astro 7 + Sanity + Vercel). No es una
auditoría genérica: es un **go / no-go de lanzamiento**, con evidencia medida.

Responde a dos preguntas:

1. **¿Qué falta para poder lanzar?** (bloqueantes, con dueño y acción concreta).
2. **¿Qué conviene mejorar después del lanzamiento?** (priorizado por impacto SEO).

Enfoque principal: **SEO de la página** (técnico, on-page, internacional, datos
estructurados, rendimiento e indexación). SMTP, DNS y antibot **siguen pendientes**:
no los arregles, pero sí mide su impacto en SEO y conversión, y dilo en el informe.

## Contexto que tienes que leer antes de nada

- `implementation-reports/ENTREGA-2026-10/06-NUBE-NOCHE-2026-10-21.md` (entero; sobre todo
  «Cierre en local», C8 y C9) y `07-ESTADO-PARA-ENTREGA.md`.
- `docs/estado-final.md` (secciones «Pendiente de accesos…», «Antes de publicar en el
  dominio real»), `docs/decisiones.md`, `docs/redirects.md`.
- `implementation-reports/ENTREGA-2026-10/S-RECOMENDACIONES-OPCIONALES.md` y
  `implementation-reports/SEO-OPTIMIZATION-2026-10/`.
- `~/Sites/CLAUDE.md` (reglas duras de estos sitios) y la memoria del proyecto.

Datos fijos del proyecto:

- Repo `Senavia-Corp/pergola-plus`. Producción en Vercel sirve `main`, que **todavía no
  tiene** ni el trabajo de rendimiento (`perf/100-cwv`, PR #1) ni el de Sanity
  (`entrega/cms-sanity` y `entrega/cms-sanity-nube`, PR #2). Mide sobre
  `entrega/cms-sanity-nube`, que contiene las dos.
- Vercel: proyecto `pergola-plus-preview` (team `senaviacorp`), sin dominio propio,
  `PUBLIC_ES_PRODUCCION=0`, Vercel Authentication en todos los deploys.
- Sanity: proyecto `n0ct9t3k`, dataset `production` (público), Studio en
  https://pergola-plus.sanity.studio/. El build lee de Sanity por defecto
  (`PP_FUENTE=repo` vuelve a los literales migrados).
- 218 páginas (109 EN + 109 ES), 64 URL antiguas del Webflow en vivo con su 301.

## Reglas (no se negocian)

- **Solo lectura** en Vercel, Sanity, DNS, Google y cuentas del cliente. Nada de cambiar
  variables, hooks, dominios, tokens ni documentos. Si algo hay que cambiar, va al
  informe como acción, con dueño.
- No imprimas ni guardes tokens ni secretos (nada de `echo $…`, `env`, `set -x`).
- Mide sobre `dist` construido, **nunca** sobre `npm run dev`:
  `PP_FUENTE=sanity PUBLIC_ES_PRODUCCION=1 PUBLIC_SITE_URL=https://www.pergolaplusflorida.com npm run build`.
  Y el modo cerrado con `PP_FUENTE=sanity npm run build`, sin variables.
- **Una comprobación que no corre no cuenta como verde.** Dilo como «NO CORRIÓ» y por qué.
- Espera estados, no milisegundos, en cualquier medida con navegador.
- Lighthouse: 3 corridas, mediana, mirando `diagnostics.rtt` (>0,1 = corrida con ruido,
  repítela). En este Mac la app de Claude mete ruido en móvil.
- El español del sitio es el de **Florida** (pies, mph, «con licencia»).
- No propongas cambiar `<title>` ni texto visible sin marcarlo como «requiere aprobación
  escrita del cliente»: el diseño y el copy están aprobados.

## El equipo y qué mide cada uno

Arranca un subagente por rol, o recórrelos en orden. Cada rol entrega una tabla
`hallazgo · evidencia (comando o URL) · severidad (P0 bloquea el lanzamiento, P1 antes
de 30 días, P2 mejora) · dueño (Senavia / cliente / abogado / Google) · acción`.

### 1. Rastreo e indexación (líder técnico)
- `npm run check` completo (26 puertas) y `node scripts/perf/crawl.mjs <carpeta>`:
  canonical autorreferente, hreflang recíproco + x-default, H1, encabezados, enlaces
  rotos, profundidad, enlaces entrantes, sitemap frente a `noindex`.
- `robots.txt` y `sitemap.xml` en producción y en modo cerrado; `llms.txt`; RSS (y que
  no se difunda hasta confirmar el dominio: los `<guid>` son permanentes).
- Las 4 `noindex` (404 y thank-you EN/ES) y que no estén en el sitemap.
- Política de rastreadores IA del `robots.txt` (`astro.config.mjs`, sitemapYRobots).
- Cabeceras (`.vercel/output/config.json`): CSP, caché, `X-Robots-Tag` (no debe
  existir), redirecciones de barra final (308) y de dominio (301).

### 2. Migración y redirecciones
- Las 64 URL del Webflow en vivo (`npm run check:urls-antiguas`, `docs/redirects.md`):
  un solo salto a una 200 con canonical autorreferente.
- Lista de lo que hay que hacer el día del cambio de DNS: `PUBLIC_ES_PRODUCCION=1`,
  `PUBLIC_SITE_URL`, dominio en Vercel, quitar la protección, hook de Sanity en la rama
  de producción, enviar el sitemap a Search Console, pedir la indexación de las
  principales, vigilar 404 y cobertura las 4 semanas siguientes.
- Etiquetas que tiene hoy el sitio en vivo y el nuevo **no**: GTM `GTM-TKKRL526`, GA4
  `G-HE8WG1NFV9` y `G-QT4LKRP0GZ`, Google Ads `AW-11106946679`, verificación de Search
  Console (ver `docs/decisiones.md`). Mide el riesgo de perder la medición y la
  verificación al cambiar el DNS.

### 3. On-page y contenido
- Títulos y descripciones de las 218 páginas (`crawl.csv`: `titleLen`, `descLen`):
  hoy 76 títulos pasan de 60 caracteres. Son del cliente: propuesta, no cambio.
- Duplicados, canibalización entre las 25 ciudades y los 3 condados, contenido fino.
- Alt de imágenes (contenido, posts, og) y que el marquee de logos siga con `alt=""` en
  las copias (`check:marquee`).
- Enlazado interno: `enlazarCiudades`, «saber más» del FAQ (249 enlaces), migas.
- Español: cifras de los 21 posts sin validar por el negocio; términos y condiciones en
  español publicados como **traducción de cortesía sin revisión de abogado** (ver 07).

### 4. Datos estructurados
- `npm run check:jsonld` y validación externa de una muestra por tipo
  (HomeAndConstructionBusiness, Service, Product, BlogPosting, FAQPage, BreadcrumbList,
  WebSite, City/AdministrativeArea): Rich Results Test y validator.schema.org.
- NAP idéntico en JSON-LD, pie, contacto y Google Business Profile.
- `image` de Product y BlogPosting en formato aceptado (JPEG, no AVIF).

### 5. Internacional (EN/ES)
- `check:i18n`, hreflang, `lang`, `og:locale`, que ningún enlace de `/es/` saque al inglés
  sin motivo, y la reciprocidad de las 109 parejas.

### 6. Rendimiento y Core Web Vitals
- Lighthouse de las 16 plantillas × móvil y escritorio × 3 (`scripts/perf/lighthouse.sh`
  + `resumen.mjs`), frente a la referencia medida en local (07, §C3 del 06).
- CLS del estimador (`scripts/perf/cls-estimador.mjs`), LCP móvil (2–3 s en varias
  plantillas), «imágenes a mejorar» de las galerías, 180 imágenes del CMS sin uso (28 MB).
- Impacto de Turnstile (unos 750 KB externos en las páginas de captación).

### 7. Sanity (CMS) para SEO
- `npm run check:sanity-esquema`, `check:sanity-cobertura`, `check:sanity-fidelidad`.
- Que cada documento con página tenga `seo.titulo`, `seo.descripcion`, `seo.imagenOg`
  (con alt y procedencia) y que el build los lea (og:image por documento).
- Validaciones del Studio publicado: alt obligatorio, Compare sin tarjeta, ritmo de la
  ficha, plantilla inicial. Webhook → deploy hook y en qué rama.
- Tokens y miembros (solo nombres y roles): `website_token_setting` tiene Access Manager
  y no caduca; `migracion-nube-2026-10-21` (Editor) está pendiente de revocar.
- Qué pasa con el `lastmod` cuando un editor publica, y con una página nueva creada en el
  Studio (sitemap, hreflang, og:image, JSON-LD).

### 8. Vercel e infraestructura
- Variables (solo nombres y destinos), dominios, protección, firewall, rama de producción
  y qué deploy sirve hoy. Qué cambia el día del lanzamiento.
- Formularios: sin SMTP ni webhook `/api/lead` devuelve 500 (el visitante ve el
  teléfono); sin `TURNSTILE_SECRET_KEY` los leads entran `verificado:false`. Mídelo como
  riesgo de conversión y de spam, no lo arregles.

### 9. Local SEO
- Google Business Profile (categoría, NAP, enlace, reseñas: las credenciales GBP no están
  y el snapshot de reseñas es manual), páginas de ciudad frente a la zona de servicio.

## Entregable

Un único fichero `implementation-reports/ENTREGA-2026-10/08-AUDITORIA-SEO-ENTREGA.md`:

1. **Veredicto** en una línea: `GO`, `GO CON CONDICIONES` o `NO-GO`, y por qué.
2. **Bloqueantes (P0)**, cada uno con evidencia, dueño y acción.
3. **Antes de 30 días (P1)** y **mejoras (P2)**, por impacto.
4. **Tabla de puertas y comprobaciones**: verde / rojo con causa / NO CORRIÓ con causa.
5. **Plan del día del lanzamiento** (orden exacto de pasos y comprobación de cada uno).
6. **Lo que no se pudo medir** y qué acceso hace falta (Search Console, GA4, GBP, DNS).

No toques código ni datos. Si una comprobación necesita un acceso que no tienes, dilo y
sigue con lo demás.
