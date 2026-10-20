# 07 — Pendiente del usuario (lo que este trabajo NO hace)

Rama `perf/100-cwv`. Nada de lo de abajo se ha tocado: son decisiones de negocio,
credenciales o cambios que piden aprobación. Orden sugerido: 1 → 5 antes del primer
deploy público; el resto cuando convenga.

## 1. Canal de entrega de leads (P0 de la auditoría, L-R1)

En Vercel → Settings → Environment Variables → **Production**, una de las dos:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `LEAD_NOTIFY_TO`
  (buzón del dominio con SPF/DKIM; con Gmail + App Password vale para el provisional), o
- `LEAD_WEBHOOK_URL` con la URL del CRM.

Sin ninguna, `/api/lead` devuelve 500 a todo lead real (a propósito: antes decía
«gracias» y el lead se perdía). Prueba de cierre: un envío real por cada formulario
(presupuesto, contacto, pie, estimador) en EN y ES, recibido en el despacho.

## 2. `TURNSTILE_SECRET_KEY` (L-R2)

Secreto del sitekey `0x4AAAAAAAQTptj2So4dx43e`, solo en Production. Sin él los
formularios de presupuesto y contacto aceptan leads con `verificado:false`. Añade
el dominio real a los *hostnames* del widget en Cloudflare: en `localhost` el widget
falla con el error 600010, y por eso Best Practices da 96 en `/contact-us/get-a-quote/`
en local (único punto que no llega a 100 y que no se arregla en código).

## 3. Dominio y modo producción

- DNS: `www.pergolaplusflorida.com` al proyecto de Vercel y el apex
  `pergolaplusflorida.com` con redirección 308 al `www` (hoy el apex no resuelve).
- Solo en **Production**: `PUBLIC_ES_PRODUCCION=1` y
  `PUBLIC_SITE_URL=https://www.pergolaplusflorida.com`. En Preview NO: el build
  falla cerrado (noindex, sin sitemap ni RSS) y eso es lo correcto mientras el
  dominio sirva el Webflow antiguo.
- Deployment Protection de `Vercel Authentication` a `Standard` cuando el dominio
  apunte aquí. Mientras tanto déjala: el SEO 69 que Lighthouse da al preview es el
  `noindex` del modo preview y el login de Vercel, no el sitio.

## 4. Medir el preview de Vercel sin extensiones

Los Lighthouse del 19-oct con 7,4 MB de `chrome-extension://` y TBT 430 ms estaban
contaminados. Para contrastar con lo medido aquí:

```bash
npx lighthouse https://pergola-plus-preview.vercel.app/ --view --chrome-flags="--disable-extensions"
```

(logueado en Vercel en ese Chrome, o con un perfil de Chrome nuevo y sin extensiones).
Esperable: SEO 69 (noindex de preview), BP 96 en el formulario (Turnstile). No quites
ni el noindex ni la protección para subir esos dos números.

## 5. Licencia DBPR (OP-R5 / SD-R4)

`CGC1539940` sale en el pie de las 217 páginas y no se ha podido verificar en el DBPR.
Cuando el cliente confirme número y titular, se añade `hasCredential` al JSON-LD del
negocio. No se ha añadido nada mientras tanto.

## 6. Recorte del vídeo del hero a 20 s (VID-R1)

El vídeo móvil (`_movil.mp4`, 960×540, 33,5 s, 4,5 MB) ya no arranca al `load`: arranca
en lo primero de hueco de CPU tras `load` + 1,5 s, primer scroll o primera interacción
(F3). Recortarlo a 20 s bajaría otros ~1,7 MB por visita que lo reproduce, pero es
decisión de diseño sobre un activo del cliente: pide aprobación antes de recodificar.

## 7. Imágenes del CMS huérfanas (IMG-R2): 174 ficheros, 28,1 MB

No las pide ninguna página construida pero se despliegan (están en `public/cms-img`,
versionadas). **No se han borrado**: son activos del cliente y borrarlos es decisión
editorial. Opciones: borrarlas, o moverlas a `assets-migracion/` (fuera de git) hasta
la fase de Sanity. Lista completa:

```
/cms-img/site/site-aluminum-carports-south-florida.avif	100 KB
/cms-img/site/site-architectural-concrete-patio-south-florida.avif	26 KB
/cms-img/site/site-commercial-pergola-contractors-south-florida.avif	94 KB
/cms-img/site/site-concrete-patio-slab-installation-south-florida.avif	129 KB
/cms-img/site/site-custom-aluminum-louvered-pergola-south-florida-led-lighting.avif	63 KB
/cms-img/site/site-custom-aluminum-patio-cover-pergola-quote-south-florida.avif	497 KB
/cms-img/site/site-custom-cabanas-south-florida.avif	197 KB
/cms-img/site/site-custom-deck-builders-south-florida.avif	38 KB
/cms-img/site/site-custom-driveway-construction-south-florida.avif	79 KB
/cms-img/site/site-custom-outdoor-deck-builder-south-florida.avif	156 KB
/cms-img/site/site-custom-pergola-design-construction-south-florida.avif	68 KB
/cms-img/site/site-driveway-installation-south-florida.avif	122 KB
/cms-img/site/site-insulated-roof-pergolas-south-florida.avif	156 KB
/cms-img/site/site-louvered-roof-pergolas-south-florida.avif	96 KB
/cms-img/site/site-motorized-screens-south-florida.avif	146 KB
/cms-img/site/site-open-air-pergolas-south-florida.avif	168 KB
/cms-img/site/site-outdoor-living-services.avif	103 KB
/cms-img/site/site-patio-remodeling-contractor-south-florida.avif	46 KB
/cms-img/site/site-paver-patio-installation-south-florida.avif	76 KB
/cms-img/site/site-pergola-contractors-south-florida.avif	197 KB
/cms-img/site/site-pergola-design-construction-custom-aluminum-south-florida.avif	87 KB
/cms-img/site/site-pergola-design-consultation-florida.avif	320 KB
/cms-img/site/site-pergola-repair-maintenance-technicians-on-site-florida.avif	125 KB
/cms-img/site/site-polycarbonate-pergolas-south-florida.avif	99 KB
/cms-img/site/site-premium-paver-installation-south-florida.avif	25 KB
/cms-img/site/site-residential-fence-installation-south-florida-1.avif	58 KB
/cms-img/site/site-residential-fence-installation-south-florida.avif	141 KB
/cms-img/site/site-screen-enclosures-south-florida.avif	105 KB
/cms-img/site/site-solar-roof-structures-south-florida.avif	162 KB
/cms-img/site/site-sukkha-3000-louvered-pergola-system.avif	86 KB
/cms-img/blog/add-shade-backyard-south-florida/hero-backyard-shade-south-florida-louvered-pergola.avif	267 KB
/cms-img/blog/add-shade-backyard-south-florida/inline-backyard-outdoor-living-south-florida-louvered-pergola.avif	243 KB
/cms-img/blog/add-shade-backyard-south-florida/inline-florida-pergola-motorized-screens.avif	167 KB
/cms-img/blog/add-shade-backyard-south-florida/inline-sunset-shaded-backyard-south-florida.avif	134 KB
/cms-img/blog/add-shade-backyard-south-florida/thumbnail-motorized-pergola-shade-florida-heat.avif	48 KB
/cms-img/blog/aluminum-pergola-cost-boca-raton-vs-fort-lauderdale/hero-aluminum-pergola-cost-boca-vs-fort-lauderdale.avif	249 KB
/cms-img/blog/aluminum-pergola-cost-boca-raton-vs-fort-lauderdale/inline-custom-aluminum-pergola-cost-boca-vs-fort-lauderdale.avif	65 KB
/cms-img/blog/aluminum-pergola-cost-boca-raton-vs-fort-lauderdale/inline-fort-lauderdale-waterfront-pergola.avif	262 KB
/cms-img/blog/aluminum-pergola-cost-boca-raton-vs-fort-lauderdale/thumbnail-fort-lauderdale-aluminum-pergola-cost.avif	93 KB
/cms-img/blog/aluminum-vs-wood-pergolas-humid-climate/hero-aluminum-vs-wood-pergola-humid-climate.avif	264 KB
/cms-img/blog/aluminum-vs-wood-pergolas-humid-climate/inline-aluminum-pergola-humid-florida.avif	190 KB
/cms-img/blog/aluminum-vs-wood-pergolas-humid-climate/inline-aluminum-wood-pergola-humid-climate.avif	215 KB
/cms-img/blog/aluminum-vs-wood-pergolas-humid-climate/inline-custom-pergola-material-comparison-humidity.avif	238 KB
/cms-img/blog/aluminum-vs-wood-pergolas-humid-climate/thumbnail-pergola-material-comparison-humidity.avif	56 KB
/cms-img/blog/best-outdoor-structures-rain-sun-florida/hero-best-outdoor-structures-florida-rain-sun.avif	240 KB
/cms-img/blog/best-outdoor-structures-rain-sun-florida/inline-aluminum-cabana-florida-poolside.avif	197 KB
/cms-img/blog/best-outdoor-structures-rain-sun-florida/inline-best-outdoor-structures-south-florida-rain-sun.avif	282 KB
/cms-img/blog/best-outdoor-structures-rain-sun-florida/inline-florida-all-weather-outdoor-structure.avif	189 KB
/cms-img/blog/best-outdoor-structures-rain-sun-florida/thumbnail-insulated-patio-cover-florida.avif	66 KB
/cms-img/blog/best-pergola-materials-coastal-florida/hero-coastal-florida-aluminum-pergola.avif	223 KB
/cms-img/blog/best-pergola-materials-coastal-florida/inline-coastal-florida-pergola-sunset.avif	46 KB
/cms-img/blog/best-pergola-materials-coastal-florida/inline-south-florida-aluminum-pergola.avif	203 KB
/cms-img/blog/best-pergola-materials-coastal-florida/inline-white-marine-grade-aluminum-pergola-detail.avif	46 KB
/cms-img/blog/best-pergola-materials-coastal-florida/thumbnail-marine-grade-aluminum-pergola-detail.avif	21 KB
/cms-img/blog/building-custom-pergola-south-florida/hero-building-custom-pergola-south-florida.avif	242 KB
/cms-img/blog/building-custom-pergola-south-florida/inline-building-pergola-south-florida.avif	99 KB
/cms-img/blog/building-custom-pergola-south-florida/inline-completed-custom-pergola-south-florida.avif	130 KB
/cms-img/blog/building-custom-pergola-south-florida/inline-custom-pergola-builders-detail-florida.avif	256 KB
/cms-img/blog/building-custom-pergola-south-florida/thumbnail-custom-pergola-installation-detail-florida.avif	29 KB
/cms-img/blog/can-you-use-your-patio-year-round-in-south-florida/hero-year-round-patio-south-florida-pergola.avif	247 KB
/cms-img/blog/can-you-use-your-patio-year-round-in-south-florida/inline-patio-south-florida-pergola.avif	127 KB
/cms-img/blog/can-you-use-your-patio-year-round-in-south-florida/inline-south-florida-patio-motorized-screens.avif	213 KB
/cms-img/blog/can-you-use-your-patio-year-round-in-south-florida/inline-year-round-patio-south-florida-sunset.avif	112 KB
/cms-img/blog/can-you-use-your-patio-year-round-in-south-florida/thumbnail-south-florida-year-round-patio-cover.avif	54 KB
/cms-img/blog/design-build-pergola-process-south-florida/hero-design-build-pergola-south-florida.avif	300 KB
/cms-img/blog/design-build-pergola-process-south-florida/inline-completed-design-build-pergola-florida.avif	196 KB
/cms-img/blog/design-build-pergola-process-south-florida/inline-design-build-custom-pergola-south-florida.avif	276 KB
/cms-img/blog/design-build-pergola-process-south-florida/inline-pergola-design-build-installation-detail-plan.avif	107 KB
/cms-img/blog/design-build-pergola-process-south-florida/thumbnail-pergola-design-build-installation-detail.avif	40 KB
/cms-img/blog/hoa-rules-pergolas-south-florida/hero-pergola-hoa-approval-rendering-florida.avif	282 KB
/cms-img/blog/hoa-rules-pergolas-south-florida/inline-custom-hoa-approved-pergola-south-florida.avif	253 KB
/cms-img/blog/hoa-rules-pergolas-south-florida/inline-hoa-compliant-pergola-south-florida.avif	289 KB
/cms-img/blog/hoa-rules-pergolas-south-florida/inline-luxury-pergola-hoa-approval-rendering-florida.avif	191 KB
/cms-img/blog/hoa-rules-pergolas-south-florida/thumbnail-hoa-approved-pergola-south-florida.avif	67 KB
/cms-img/blog/how-long-pergola-installation-florida/hero-pergola-installation-timeline-florida.avif	247 KB
/cms-img/blog/how-long-pergola-installation-florida/inline-completed-pergola-installation-florida.avif	147 KB
/cms-img/blog/how-long-pergola-installation-florida/inline-pergola-footing-installation-florida.avif	120 KB
/cms-img/blog/how-long-pergola-installation-florida/thumbnail-how-long-pergola-installation-florida.avif	44 KB
/cms-img/blog/hurricane-resistant-pergolas-south-florida/hero-hurricane-resistant-pergola-south-florida.avif	135 KB
/cms-img/blog/hurricane-resistant-pergolas-south-florida/inline-column-rated-pergola-engineering-detail.avif	149 KB
/cms-img/blog/hurricane-resistant-pergolas-south-florida/inline-custom-hurricane-resistant-pergola-south-florida.avif	126 KB
/cms-img/blog/hurricane-resistant-pergolas-south-florida/inline-hurricane-proof-pergola-south-florida.avif	293 KB
/cms-img/blog/hurricane-resistant-pergolas-south-florida/thumbnail-hurricane-rated-pergola-engineering-detail.avif	22 KB
/cms-img/blog/is-a-louvered-roof-pergola-worth-it-in-florida/hero-louvered-roof-pergola-worth-it-florida.avif	216 KB
/cms-img/blog/is-a-louvered-roof-pergola-worth-it-in-florida/inline-custom-louvered-roof-pergola-worth-it-florida.avif	88 KB
/cms-img/blog/is-a-louvered-roof-pergola-worth-it-in-florida/inline-florida-louvered-pergola-sunset.avif	167 KB
/cms-img/blog/is-a-louvered-roof-pergola-worth-it-in-florida/inline-louvered-roof-rain-protection-florida.avif	172 KB
/cms-img/blog/is-a-louvered-roof-pergola-worth-it-in-florida/thumbnail-motorized-louvered-roof-florida-closeup.avif	53 KB
/cms-img/blog/luxury-pergola-ideas-for-south-florida-backyards/hero-luxury-pergola-ideas-south-florida-backyard.avif	219 KB
/cms-img/blog/luxury-pergola-ideas-for-south-florida-backyards/inline-illuminated-luxury-pergola-south-florida.avif	200 KB
/cms-img/blog/luxury-pergola-ideas-for-south-florida-backyards/inline-outdoor-kitchen-under-aluminum-pergola-florida.avif	216 KB
/cms-img/blog/luxury-pergola-ideas-for-south-florida-backyards/inline-pergola-ideas-south-florida-backyard.avif	206 KB
/cms-img/blog/luxury-pergola-ideas-for-south-florida-backyards/thumbnail-motorized-louvered-roof-south-florida-design.avif	72 KB
/cms-img/blog/modern-outdoor-living-trends-in-south-florida/hero-modern-outdoor-living-south-florida-2026.avif	186 KB
/cms-img/blog/modern-outdoor-living-trends-in-south-florida/inline-modern-outdoor-kitchen-under-pergola-florida.avif	246 KB
/cms-img/blog/modern-outdoor-living-trends-in-south-florida/inline-pergola-outdoor-living-south-florida-2026.avif	277 KB
/cms-img/blog/modern-outdoor-living-trends-in-south-florida/inline-sunset-modern-pergola-south-florida.avif	171 KB
/cms-img/blog/modern-outdoor-living-trends-in-south-florida/thumbnail-modern-louvered-roof-trend-florida.avif	76 KB
/cms-img/blog/pergola-building-codes-broward-palm-beach/hero-pergola-building-codes-south-florida.avif	307 KB
/cms-img/blog/pergola-building-codes-broward-palm-beach/inline-code-compliant-pergola-south-florida.avif	198 KB
/cms-img/blog/pergola-building-codes-broward-palm-beach/inline-custom-pergola-building-codes-south-florida.avif	320 KB
/cms-img/blog/pergola-building-codes-broward-palm-beach/inline-plan-pergola-wind-load-engineering-florida.avif	121 KB
/cms-img/blog/pergola-building-codes-broward-palm-beach/thumbnail-pergola-wind-load-engineering-florida.avif	60 KB
/cms-img/blog/pergola-cost-south-florida/hero-pergola-cost-south-florida-luxury-backyard.avif	247 KB
/cms-img/blog/pergola-cost-south-florida/inline-custom-pergola-cost-south-florida-luxury-backyard.avif	82 KB
/cms-img/blog/pergola-cost-south-florida/inline-south-florida-louvered-roof-cost-example.avif	259 KB
/cms-img/blog/pergola-cost-south-florida/inline-sunset-pergola-south-florida-cost.avif	204 KB
/cms-img/blog/pergola-cost-south-florida/thumbnail-motorized-pergola-cost-florida.avif	57 KB
/cms-img/blog/pergola-design-ideas-waterfront-properties/hero-waterfront-custom-pergola-design-florida.avif	229 KB
/cms-img/blog/pergola-design-ideas-waterfront-properties/inline-waterfront-outdoor-kitchen-pergola.avif	210 KB
/cms-img/blog/pergola-design-ideas-waterfront-properties/inline-waterfront-pergola-design-florida.avif	224 KB
/cms-img/blog/pergola-design-ideas-waterfront-properties/inline-waterfront-pergola-sunset-florida.avif	122 KB
/cms-img/blog/pergola-design-ideas-waterfront-properties/thumbnail-coastal-waterfront-pergola-design.avif	62 KB
/cms-img/blog/pergola-permit-south-florida/hero-pergola-permit-south-florida.avif	248 KB
/cms-img/blog/pergola-permit-south-florida/inline-custom-pergola-engineering-plans-florida.avif	248 KB
/cms-img/blog/pergola-permit-south-florida/inline-custom-pergola-permit-south-florida.avif	189 KB
/cms-img/blog/pergola-permit-south-florida/inline-permitted-pergola-south-florida.avif	162 KB
/cms-img/blog/pergola-permit-south-florida/thumbnail-pergola-engineering-plans-florida.avif	115 KB
/cms-img/blog/plan-pergola-south-florida-backyard/hero-planning-pergola-south-florida-backyard.avif	306 KB
/cms-img/blog/plan-pergola-south-florida-backyard/inline-boca-vs-fort-lauderdale-pergola-sunset.avif	181 KB
/cms-img/blog/plan-pergola-south-florida-backyard/inline-completed-pergola-south-florida-backyard.avif	323 KB
/cms-img/blog/plan-pergola-south-florida-backyard/inline-custom-planning-pergola-south-florida-backyard.avif	298 KB
/cms-img/blog/plan-pergola-south-florida-backyard/thumbnail-south-florida-pergola-design-rendering.avif	78 KB
/cms-img/blog/poolside-pergola-ideas-for-florida-homes/hero-poolside-pergola-ideas-florida.avif	257 KB
/cms-img/blog/poolside-pergola-ideas-for-florida-homes/inline-florida-poolside-outdoor-kitchen-pergola.avif	172 KB
/cms-img/blog/poolside-pergola-ideas-for-florida-homes/inline-poolside-pergola-ideas-florida-2026.avif	286 KB
/cms-img/blog/poolside-pergola-ideas-for-florida-homes/inline-sunset-poolside-pergola-florida.avif	128 KB
/cms-img/blog/poolside-pergola-ideas-for-florida-homes/thumbnail-florida-poolside-louvered-pergola-detail.avif	67 KB
/cms-img/blog/resort-style-backyard-boca-raton/hero-resort-style-backyard-boca-raton.avif	211 KB
/cms-img/blog/resort-style-backyard-boca-raton/inline-boca-raton-outdoor-kitchen-pergola.avif	261 KB
/cms-img/blog/resort-style-backyard-boca-raton/inline-pergola-resort-style-backyard-boca-raton.avif	233 KB
/cms-img/blog/resort-style-backyard-boca-raton/inline-sunset-resort-style-backyard-boca-raton.avif	230 KB
/cms-img/blog/resort-style-backyard-boca-raton/thumbnail-boca-raton-luxury-pergola-lounge.avif	61 KB
/cms-img/brochures/alfresco-brochure-2019/cover-brochure-cover.jpg	118 KB
/cms-img/brochures/alumawood-brochure/cover-brochure-cover.jpg	115 KB
/cms-img/brochures/alumawood-trifold-patio-carport/cover-brochure-cover.jpg	68 KB
/cms-img/brochures/artisan-brochure/cover-brochure-cover.jpg	58 KB
/cms-img/brochures/challenger-kitchen-kitchen/cover-brochure-cover.jpg	118 KB
/cms-img/brochures/classic-modern-catalog/cover-brochure-cover.jpg	109 KB
/cms-img/brochures/coping-milestone/cover-brochure-cover.jpg	119 KB
/cms-img/brochures/equinox-brochure/cover-brochure-cover.jpg	136 KB
/cms-img/brochures/glass-pool-tile/cover-brochure-cover.jpg	80 KB
/cms-img/brochures/hurok-hardscapes-catalog/cover-brochure-cover.jpg	36 KB
/cms-img/brochures/milestone-travetine/cover-brochure-cover.jpg	56 KB
/cms-img/brochures/npthardscapesbrochure/cover-brochure-cover.jpg	129 KB
/cms-img/brochures/nptoutdoorelementsbrochure/cover-brochure-cover.jpg	131 KB
/cms-img/brochures/paver-brochure-milestone/cover-brochure-cover.jpg	83 KB
/cms-img/brochures/pjaccentscollection-2/cover-brochure-cover.jpg	123 KB
/cms-img/brochures/rainbow-delta-2025-collection/cover-brochure-cover.jpg	45 KB
/cms-img/brochures/rainbow-outdoor-2025/cover-brochure-cover.jpg	124 KB
/cms-img/brochures/renaissance-brochure/cover-brochure-cover.jpg	97 KB
/cms-img/brochures/screenroom/cover-brochure-cover.jpg	82 KB
/cms-img/brochures/tremron-north-hardscape-brochure/cover-brochure-cover.jpg	111 KB
/cms-img/brochures/tremron-south-catalog/cover-brochure-cover.jpg	138 KB
/cms-img/brochures/xdigitalfabrics/cover-brochure-cover.jpg	107 KB
/cms-img/brochures/xpelican-media-kit-2025/cover-brochure-cover.jpg	114 KB
/cms-img/products/cabanas/gallery-aluminum-cabana-contractors-south-florida-04.avif	181 KB
/cms-img/products/cabanas/gallery-aluminum-cabana-contractors-south-florida-09.avif	298 KB
/cms-img/products/carports/gallery-aluminum-carport-builders-south-florida-05.avif	495 KB
/cms-img/products/carports/gallery-aluminum-carport-builders-south-florida-07.avif	143 KB
/cms-img/products/motorized-louvered-pergolas/gallery-louvered-roof-pergola-contractors-south-florida-05.avif	319 KB
/cms-img/products/motorized-screens/gallery-motorized-screen-installers-south-florida-06.avif	318 KB
/cms-img/products/motorized-screens/gallery-motorized-screen-installers-south-florida-07.avif	364 KB
/cms-img/products/open-air-pergolas/gallery-open-air-pergola-builders-south-florida-08.avif	265 KB
/cms-img/products/open-air-pergolas/hero-open-air-aluminum-pergola-south-florida.avif	157 KB
/cms-img/products/polycarbonate-pergolas/gallery-polycarbonate-pergola-contractors-south-florida-03.avif	220 KB
/cms-img/products/polycarbonate-pergolas/hero-polycarbonate-pergola-south-florida.avif	180 KB
/cms-img/products/screen-enclosures/gallery-screen-enclosure-contractors-south-florida-07.avif	157 KB
/cms-img/products/screen-enclosures/gallery-screen-enclosure-contractors-south-florida-09.avif	168 KB
/cms-img/products/solar-pergolas/gallery-solar-roof-structure-contractors-south-florida-02.avif	376 KB
/cms-img/products/solar-pergolas/gallery-solar-roof-structure-contractors-south-florida-08.avif	120 KB
/cms-img/products/solid-roof-pergolas/gallery-insulated-roof-pergola-builders-south-florida-10.avif	158 KB
/cms-img/products/sukkha/gallery-sukkha-3000-outdoor-structure-builders-south-florida-6.avif	272 KB
/cms-img/products/sukkha/hero-lakewood-sukkah-pergola-succos-1920.avif	385 KB```

## 8. Cambios visuales que requieren aprobación

Se rellena al final de cada fase. Regla del encargo: cero cambios de diseño; si una
optimización exige uno mínimo se documenta aquí con captura antes/después.

Hechos en F4, todos por contraste WCAG 1.4.3 y todos de tamaño mínimo. Si alguno no
convence, cada uno es una línea de CSS y se revierte solo:

| Dónde | Antes | Después | Por qué | Fichero |
|---|---|---|---|---|
| Banda «Service Areas» (home, productos, servicios, EN/ES) | velo negro 50 % sobre la foto | **56 %** | peor píxel bajo el párrafo de 14 px a 1440: 4,21:1 → ≥ 4,5:1 (medido con `scripts/perf/medir-velo.mjs`). Capturas: `03-f3/capturas/home-1440.png` (antes) y `04-f4/capturas/home-1440.png` (después) | `src/styles/bandas.css` |
| Pestañas de producto de la home (los 10 rótulos inactivos) | `opacity: .65` → crema sobre --primary 4,40:1 | `opacity: .7` → 4,81:1 | texto de 18 px normal; el activo sigue a 1 y la diferencia se mantiene | `scripts/lib/transformar.mjs` (6c0, sobre el `<style>` embebido de Webflow) |
| Contador de los chips del blog y la FAQ («21», «249») | `opacity: .75` sobre --primary (3,92:1 compuesto) | `#52686f` sólido (5,2:1) | texto de 11 px | `src/styles/blog.css` |
| Fecha y lectura del artículo destacado del blog (escritorio) | `#cfd8da` sobre blanco (1,44:1: casi invisible) | `#52686f` (5,9:1) | la regla daba por hecho un fondo oscuro que no existe | `src/styles/blog.css` |

Lo que NO se ha tocado y queda a decisión de diseño: subir los objetivos táctiles del
pie (`a.link-footer`, 17 px de alto con 26 px entre centros) por encima de 24 px.

## 9. Títulos y descripciones largos del CMS (SEO-R2)

46 `<title>` de 66–78 caracteres y 3 `description` de 165–172. Son copy del cliente
(`check:seo` los lista como aviso): recortar es decisión editorial suya, y se hace en
el CSV del CMS y regenerando.

## 10. Portada de Coral Springs

`/pergolas-contractors/coral-springs-installation/` (EN/ES) sigue con
`wf-placeholder.svg` como portada: no hay foto en el CMS. Falta una foto real del
cliente.
