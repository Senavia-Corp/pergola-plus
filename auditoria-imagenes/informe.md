# Auditoria de nitidez de imagenes

Generado sobre `dist/client/` tras `npm run build`.

## Resumen

| | |
|---|---|
| Paginas recorridas | 184 |
| Imagenes rasterizadas servidas | **462** |
| **Fallan al menos un umbral** | **115** |
| Pasan | 347 |

## Umbrales

- **SUB-RESOLUCION**: `px_intrinsecos < 1.5 x px_display`. El display es el MAYOR
  visto entre 1440px y 390px, medido con el layout real.
  El px objetivo es 2x ese display (DPR 2).
- **BLANDA**: varianza del Laplaciano sobre luminancia, normalizada a 512px de ancho.
  Umbral = **40% de la mediana del corpus** (mediana 3002 -> umbral 1201).
- **SOBRECOMPRIMIDA**: bytes/px < 45% de la mediana
  (mediana 0.227 -> umbral **0.102 B/px**).

> **Por que fraccion de la mediana y no percentil.** La primera version usaba el percentil 15
> y estaba mal: un umbral en el percentil 15 marca **siempre** el 15% de las imagenes, tenga el
> corpus el problema o no. Se vio al arreglar un fallo que hundia la nitidez de 5 fotos: el
> numero de "blandas" seguia siendo exactamente 69, que es el 15% de 462. Un umbral que
> garantiza su propio recuento no mide nada.
>
> Sigue siendo relativo al corpus a proposito: la varianza del Laplaciano depende del contenido
> —un cielo liso puntua bajo aunque el archivo este perfecto— asi que una constante universal
> marcaria las fotos de cielo y dejaria pasar las de textura mal escalada.
- **BLOQUES JPEG**: relacion de discontinuidad en los limites de 8px > 1.15.

> **Cobertura real de la marca de bloques**: solo **4 de 462** imagenes servidas son JPEG.
> El resto es AVIF, que no usa bloques 8x8 —su transformada no funciona asi—, de modo que
> buscar bloqueo JPEG ahi no mide nada. Se aplica donde corresponde y se dice cuantas son.

## Ignoradas a proposito

SVG e iconos/logos vectoriales: no tienen resolucion intrinseca, escalan solos.

## Las 115 que fallan (por gravedad)

| # | Ruta | Actual | Display 1440 | Display 390 | Objetivo | Motivo | Paginas |
|---|---|---|---|---|---|---|---|
| 1 | `/cms-img/locations/miami-dade-pergola-contractor/cover-miami-dade-hurricane-rated-pergola-outdoor-living-contractor.avif` | 1024x1024 | 1440x815 | 390x350 | 2880x1630 | SUB-RESOLUCION (0.71x, minimo 1.5x) | 6 (/about-us/where-we-work/, /contact-us/get-in-touch/, /countries/miami-dade-pergola-contractor/, …) |
| 2 | `/cms-img/locations/broward-county-pergola-contractor/cover-broward-county-pergola-outdoor-living-design-build-contractor.avif` | 1024x1024 | 1440x815 | 390x350 | 2880x1630 | SUB-RESOLUCION (0.71x, minimo 1.5x) | 6 (/about-us/where-we-work/, /contact-us/get-in-touch/, /countries/broward-county-pergola-contractor/, …) |
| 3 | `/cms-img/locations/palm-beach-county-pergola-contractor/cover-palm-beach-county-luxury-pergola-outdoor-living-contractor.avif` | 1024x1024 | 1440x815 | 390x350 | 2880x1630 | SUB-RESOLUCION (0.71x, minimo 1.5x) | 6 (/about-us/where-we-work/, /contact-us/get-in-touch/, /countries/palm-beach-county-pergola-contractor/, …) |
| 4 | `/images/cliente/motorized-louvered.avif` | 1250x703 | 1440x815 | 390x350 | 2880x1630 | SUB-RESOLUCION (0.87x, minimo 1.5x)<br>BLANDA (nitidez 241, 8% de la mediana 3002)<br>SOBRECOMPRIMIDA (0.037 B/px, 16% de la mediana 0.227) | 6 (/, /es/, /es/products/, …) |
| 5 | `/images/cliente/screen-enclosure.avif` | 1250x703 | 1440x815 | 390x350 | 2880x1630 | SUB-RESOLUCION (0.87x, minimo 1.5x)<br>BLANDA (nitidez 1149, 38% de la mediana 3002)<br>SOBRECOMPRIMIDA (0.052 B/px, 23% de la mediana 0.227) | 6 (/, /es/, /es/products/, …) |
| 6 | `/images/cliente/polycarbonate-pergola.avif` | 1250x703 | 1440x815 | 390x350 | 2880x1630 | SUB-RESOLUCION (0.87x, minimo 1.5x)<br>SOBRECOMPRIMIDA (0.073 B/px, 32% de la mediana 0.227) | 6 (/, /es/, /es/products/, …) |
| 7 | `/images/cliente/open-air-pergolas.avif` | 1250x703 | 1440x815 | 390x350 | 2880x1630 | SUB-RESOLUCION (0.87x, minimo 1.5x)<br>SOBRECOMPRIMIDA (0.077 B/px, 34% de la mediana 0.227) | 6 (/, /es/, /es/products/, …) |
| 8 | `/images/cliente/motorized-screens.avif` | 1250x703 | 1440x815 | 390x350 | 2880x1630 | SUB-RESOLUCION (0.87x, minimo 1.5x)<br>SOBRECOMPRIMIDA (0.081 B/px, 36% de la mediana 0.227) | 6 (/, /es/, /es/products/, …) |
| 9 | `/images/cliente/sukkah.avif` | 1250x703 | 1440x815 | 390x350 | 2880x1630 | SUB-RESOLUCION (0.87x, minimo 1.5x)<br>SOBRECOMPRIMIDA (0.084 B/px, 37% de la mediana 0.227) | 6 (/, /es/, /es/products/, …) |
| 10 | `/images/cliente/solid-roof-pergolas.avif` | 1250x703 | 1440x815 | 390x350 | 2880x1630 | SUB-RESOLUCION (0.87x, minimo 1.5x) | 6 (/, /es/, /es/products/, …) |
| 11 | `/cms-img/products/cabanas/hero-custom-poolside-cabana-south-florida.avif` | 1250x703 | 1440x815 | 390x350 | 2880x1630 | SUB-RESOLUCION (0.87x, minimo 1.5x) | 6 (/, /es/, /es/products/, …) |
| 12 | `/cms-img/products/carports/hero-aluminum-carport-south-florida.avif` | 1250x703 | 1440x815 | 390x350 | 2880x1630 | SUB-RESOLUCION (0.87x, minimo 1.5x) | 6 (/, /es/, /es/products/, …) |
| 13 | `/cms-img/products/solar-pergolas/hero-solar-roof-structure-south-florida.avif` | 1250x703 | 1440x815 | 390x350 | 2880x1630 | SUB-RESOLUCION (0.87x, minimo 1.5x) | 6 (/, /es/, /es/products/, …) |
| 14 | `/cms-img/brands/renaissance/brand-logo-rennaissance-logo.png` | 450x200 | 450x50 | 450x50 | 900x100 | SUB-RESOLUCION (1.00x, minimo 1.5x)<br>BLANDA (nitidez 440, 15% de la mediana 3002)<br>SOBRECOMPRIMIDA (0.074 B/px, 32% de la mediana 0.227) | 6 (/, /about-us/brands/, /about-us/industries-we-serve/, …) |
| 15 | `/cms-img/brands/fenetex/brand-logo-fenetex-logo.png` | 450x200 | 450x50 | 450x50 | 900x100 | SUB-RESOLUCION (1.00x, minimo 1.5x)<br>BLANDA (nitidez 946, 32% de la mediana 3002) | 6 (/, /about-us/brands/, /about-us/industries-we-serve/, …) |
| 16 | `/cms-img/brands/equinox/brand-logo-equinox-logo.png` | 450x200 | 450x50 | 450x50 | 900x100 | SUB-RESOLUCION (1.00x, minimo 1.5x)<br>SOBRECOMPRIMIDA (0.078 B/px, 35% de la mediana 0.227) | 6 (/, /about-us/brands/, /about-us/industries-we-serve/, …) |
| 17 | `/cms-img/brands/appolo/brand-logo-appolo-logo.png` | 450x200 | 450x50 | 450x50 | 900x100 | SUB-RESOLUCION (1.00x, minimo 1.5x)<br>SOBRECOMPRIMIDA (0.094 B/px, 41% de la mediana 0.227) | 6 (/, /about-us/brands/, /about-us/industries-we-serve/, …) |
| 18 | `/cms-img/locations/davie-installation/cover-engineered-outdoor-shade-structure.avif` | 1450x1450 | 1440x815 | 358x1450 | 2880x1630 | SUB-RESOLUCION (1.01x, minimo 1.5x)<br>SOBRECOMPRIMIDA (0.070 B/px, 31% de la mediana 0.227) | 8 (/es/pergolas-contractors/davie-installation/, /es/pergolas-contractors/hollywood-pergola-installation/, /es/pergolas-contractors/miramar-installation/, …) |
| 19 | `/cms-img/galleries/18/gallery-commercial-pergola-contractors-south-florida-06.avif` | 1250x833 | 1250x200 | 1250x150 | 2500x300 | SUB-RESOLUCION (1.00x, minimo 1.5x) | 2 (/about-us/industries-we-serve/, /es/about-us/industries-we-serve/) |
| 20 | `/cms-img/galleries/19/gallery-commercial-pergola-contractors-south-florida-07.avif` | 1250x682 | 1250x200 | 1250x150 | 2500x300 | SUB-RESOLUCION (1.00x, minimo 1.5x) | 2 (/about-us/industries-we-serve/, /es/about-us/industries-we-serve/) |
| 21 | `/cms-img/galleries/14/gallery-commercial-pergola-contractors-south-florida-02.avif` | 1250x682 | 1250x200 | 1250x150 | 2500x300 | SUB-RESOLUCION (1.00x, minimo 1.5x) | 2 (/about-us/industries-we-serve/, /es/about-us/industries-we-serve/) |
| 22 | `/cms-img/galleries/15/gallery-commercial-pergola-contractors-south-florida-03.avif` | 1250x833 | 1250x200 | 1250x150 | 2500x300 | SUB-RESOLUCION (1.00x, minimo 1.5x) | 2 (/about-us/industries-we-serve/, /es/about-us/industries-we-serve/) |
| 23 | `/cms-img/galleries/20/gallery-commercial-pergola-contractors-south-florida-08.avif` | 1250x682 | 1250x200 | 1250x150 | 2500x300 | SUB-RESOLUCION (1.00x, minimo 1.5x) | 2 (/about-us/industries-we-serve/, /es/about-us/industries-we-serve/) |
| 24 | `/cms-img/galleries/21/gallery-commercial-pergola-contractors-south-florida-09.avif` | 1250x703 | 1250x200 | 1250x150 | 2500x300 | SUB-RESOLUCION (1.00x, minimo 1.5x) | 2 (/about-us/industries-we-serve/, /es/about-us/industries-we-serve/) |
| 25 | `/cms-img/galleries/22/gallery-commercial-pergola-contractors-south-florida-10.avif` | 1250x833 | 1250x200 | 1250x150 | 2500x300 | SUB-RESOLUCION (1.00x, minimo 1.5x) | 2 (/about-us/industries-we-serve/, /es/about-us/industries-we-serve/) |
| 26 | `/cms-img/galleries/13/gallery-commercial-pergola-contractors-south-florida-01.avif` | 1250x682 | 1250x200 | 1250x150 | 2500x300 | SUB-RESOLUCION (1.00x, minimo 1.5x) | 2 (/about-us/industries-we-serve/, /es/about-us/industries-we-serve/) |
| 27 | `/cms-img/galleries/16/gallery-commercial-pergola-contractors-south-florida-04.avif` | 1250x703 | 1250x200 | 1250x150 | 2500x300 | SUB-RESOLUCION (1.00x, minimo 1.5x) | 2 (/about-us/industries-we-serve/, /es/about-us/industries-we-serve/) |
| 28 | `/cms-img/galleries/17/gallery-commercial-pergola-contractors-south-florida-05.avif` | 1250x682 | 1250x200 | 1250x150 | 2500x300 | SUB-RESOLUCION (1.00x, minimo 1.5x) | 2 (/about-us/industries-we-serve/, /es/about-us/industries-we-serve/) |
| 29 | `/cms-img/locations/aventura-pergola-builders/cover-custom-aluminum-pergola-contractor-florida.avif` | 1450x967 | 1440x815 | 358x967 | 2880x1630 | SUB-RESOLUCION (1.01x, minimo 1.5x) | 24 (/es/pergolas-contractors/aventura-pergola-builders/, /es/pergolas-contractors/boca-raton-pergola-contractor/, /es/pergolas-contractors/cooper-city-pergola-installation/, …) |
| 30 | `/cms-img/locations/boca-raton-pergola-contractor/cover-motorized-louvered-roof-system-installation.avif` | 1450x1450 | 1440x815 | 358x1450 | 2880x1630 | SUB-RESOLUCION (1.01x, minimo 1.5x) | 24 (/es/pergolas-contractors/aventura-pergola-builders/, /es/pergolas-contractors/boca-raton-pergola-contractor/, /es/pergolas-contractors/boynton-beach-contractors/, …) |
| 31 | `/cms-img/locations/boynton-beach-contractors/cover-modern-design-build-pergola-installation.avif` | 1450x1450 | 1440x815 | 358x1450 | 2880x1630 | SUB-RESOLUCION (1.01x, minimo 1.5x) | 16 (/es/pergolas-contractors/boynton-beach-contractors/, /es/pergolas-contractors/coral-gables/, /es/pergolas-contractors/hollywood-pergola-installation/, …) |
| 32 | `/cms-img/locations/jupiter-contractors/cover-coastal-grade-aluminum-pergola-system.avif` | 1450x1450 | 1440x815 | 358x1450 | 2880x1630 | SUB-RESOLUCION (1.01x, minimo 1.5x) | 8 (/es/pergolas-contractors/davie-installation/, /es/pergolas-contractors/delray-beach-contractors/, /es/pergolas-contractors/jupiter-contractors/, …) |
| 33 | `/cms-img/locations/delray-beach-contractors/cover-luxury-backyard-aluminum-pergola-design.avif` | 1450x1450 | 1440x815 | 358x1450 | 2880x1630 | SUB-RESOLUCION (1.01x, minimo 1.5x) | 16 (/es/pergolas-contractors/delray-beach-contractors/, /es/pergolas-contractors/doral-pergola-builders/, /es/pergolas-contractors/fort-lauderdale-installation/, …) |
| 34 | `/cms-img/blog/add-shade-backyard-south-florida/hero-backyard-shade-south-florida-louvered-pergola.avif` | 1250x682 | 1186x667 | 358x201 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 1 (/post/add-shade-backyard-south-florida/) |
| 35 | `/cms-img/blog/aluminum-pergola-cost-boca-raton-vs-fort-lauderdale/hero-aluminum-pergola-cost-boca-vs-fort-lauderdale.avif` | 1250x833 | 1186x667 | 358x201 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 1 (/post/aluminum-pergola-cost-boca-raton-vs-fort-lauderdale/) |
| 36 | `/cms-img/blog/aluminum-vs-wood-pergolas-humid-climate/hero-aluminum-vs-wood-pergola-humid-climate.avif` | 1250x833 | 1186x667 | 358x201 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 1 (/post/aluminum-vs-wood-pergolas-humid-climate/) |
| 37 | `/cms-img/blog/best-outdoor-structures-rain-sun-florida/hero-best-outdoor-structures-florida-rain-sun.avif` | 1250x833 | 1186x667 | 358x201 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 1 (/post/best-outdoor-structures-rain-sun-florida/) |
| 38 | `/cms-img/blog/best-pergola-materials-coastal-florida/hero-coastal-florida-aluminum-pergola.avif` | 1250x682 | 1186x667 | 358x201 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 1 (/post/best-pergola-materials-coastal-florida/) |
| 39 | `/cms-img/blog/building-custom-pergola-south-florida/hero-building-custom-pergola-south-florida.avif` | 1250x703 | 1186x667 | 358x201 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 1 (/post/building-custom-pergola-south-florida/) |
| 40 | `/cms-img/blog/can-you-use-your-patio-year-round-in-south-florida/hero-year-round-patio-south-florida-pergola.avif` | 1250x682 | 1186x667 | 358x201 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 1 (/post/can-you-use-your-patio-year-round-in-south-florida/) |
| 41 | `/cms-img/blog/design-build-pergola-process-south-florida/hero-design-build-pergola-south-florida.avif` | 1250x833 | 1186x667 | 358x201 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 1 (/post/design-build-pergola-process-south-florida/) |
| 42 | `/cms-img/blog/hoa-rules-pergolas-south-florida/hero-pergola-hoa-approval-rendering-florida.avif` | 1250x833 | 1186x667 | 358x201 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 1 (/post/hoa-rules-pergolas-south-florida/) |
| 43 | `/cms-img/blog/how-long-pergola-installation-florida/hero-pergola-installation-timeline-florida.avif` | 1250x682 | 1186x667 | 358x201 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 1 (/post/how-long-pergola-installation-florida/) |
| 44 | `/cms-img/blog/hurricane-resistant-pergolas-south-florida/hero-hurricane-resistant-pergola-south-florida.avif` | 1250x833 | 1186x667 | 358x201 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 1 (/post/hurricane-resistant-pergolas-south-florida/) |
| 45 | `/cms-img/blog/is-a-louvered-roof-pergola-worth-it-in-florida/hero-louvered-roof-pergola-worth-it-florida.avif` | 1250x833 | 1186x667 | 358x201 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 1 (/post/is-a-louvered-roof-pergola-worth-it-in-florida/) |
| 46 | `/cms-img/blog/luxury-pergola-ideas-for-south-florida-backyards/hero-luxury-pergola-ideas-south-florida-backyard.avif` | 1250x682 | 1186x667 | 358x201 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 1 (/post/luxury-pergola-ideas-for-south-florida-backyards/) |
| 47 | `/cms-img/blog/modern-outdoor-living-trends-in-south-florida/hero-modern-outdoor-living-south-florida-2026.avif` | 1250x682 | 1186x667 | 358x201 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 1 (/post/modern-outdoor-living-trends-in-south-florida/) |
| 48 | `/cms-img/blog/pergola-building-codes-broward-palm-beach/hero-pergola-building-codes-south-florida.avif` | 1250x682 | 1186x667 | 358x201 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 1 (/post/pergola-building-codes-broward-palm-beach/) |
| 49 | `/cms-img/blog/pergola-cost-south-florida/hero-pergola-cost-south-florida-luxury-backyard.avif` | 1250x833 | 1186x667 | 358x250 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 2 (/post/pergola-cost-south-florida/, /resources/blog/) |
| 50 | `/cms-img/blog/pergola-design-ideas-waterfront-properties/hero-waterfront-custom-pergola-design-florida.avif` | 1250x833 | 1186x667 | 358x201 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 1 (/post/pergola-design-ideas-waterfront-properties/) |
| 51 | `/cms-img/blog/pergola-permit-south-florida/hero-pergola-permit-south-florida.avif` | 1250x682 | 1186x667 | 358x201 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 1 (/post/pergola-permit-south-florida/) |
| 52 | `/cms-img/blog/plan-pergola-south-florida-backyard/hero-planning-pergola-south-florida-backyard.avif` | 1250x833 | 1186x667 | 358x201 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 1 (/post/plan-pergola-south-florida-backyard/) |
| 53 | `/cms-img/blog/poolside-pergola-ideas-for-florida-homes/hero-poolside-pergola-ideas-florida.avif` | 1250x682 | 1186x667 | 358x201 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 1 (/post/poolside-pergola-ideas-for-florida-homes/) |
| 54 | `/cms-img/blog/resort-style-backyard-boca-raton/hero-resort-style-backyard-boca-raton.avif` | 1250x833 | 1186x667 | 358x201 | 2372x1334 | SUB-RESOLUCION (1.05x, minimo 1.5x) | 1 (/post/resort-style-backyard-boca-raton/) |
| 55 | `/images/Generated-Image-February-11--2026---7_23PM-p-500.avif` | 500x323 | — | 390x252 | 780x504 | SUB-RESOLUCION (1.28x, minimo 1.5x) | 58 (/, /countries/broward-county-pergola-contractor/, /countries/miami-dade-pergola-contractor/, …) |
| 56 | `/images/luxury-outdoor-living-south-florida-pool-pergola-outdoor-kitchen-modern-backyard-p-500.avif` | 500x195 | — | 390x447 | 780x894 | SUB-RESOLUCION (1.28x, minimo 1.5x) | 176 (/, /about-us/about-us/, /about-us/brands/, …) |
| 57 | `/images/custom-aluminum-patio-cover-pergola-quote-south-florida-p-500.avif` | 500x625 | — | 390x1193 | 780x2386 | SUB-RESOLUCION (1.28x, minimo 1.5x) | 2 (/contact-us/get-a-quote/, /es/contact-us/get-a-quote/) |
| 58 | `/images/appoiment--p-500.avif` | 500x667 | — | 390x844 | 780x1688 | SUB-RESOLUCION (1.28x, minimo 1.5x) | 2 (/contact-us/schedule-a-visit/, /es/contact-us/schedule-a-visit/) |
| 59 | `/cms-img/blog/design-build-pergola-process-south-florida/thumbnail-pergola-design-build-installation-detail.avif` | 525x350 | 406x271 | 358x239 | 812x542 | SUB-RESOLUCION (1.29x, minimo 1.5x)<br>BLANDA (nitidez 1078, 36% de la mediana 3002) | 88 (/, /es/, /es/pergolas-contractors/aventura-pergola-builders/, …) |
| 60 | `/cms-img/blog/building-custom-pergola-south-florida/thumbnail-custom-pergola-installation-detail-florida.avif` | 525x350 | 406x271 | 358x239 | 812x542 | SUB-RESOLUCION (1.29x, minimo 1.5x)<br>BLANDA (nitidez 432, 14% de la mediana 3002) | 85 (/, /es/, /es/pergolas-contractors/aventura-pergola-builders/, …) |
| 61 | `/cms-img/blog/hurricane-resistant-pergolas-south-florida/thumbnail-hurricane-rated-pergola-engineering-detail.avif` | 525x350 | 406x271 | 358x239 | 812x542 | SUB-RESOLUCION (1.29x, minimo 1.5x)<br>BLANDA (nitidez 562, 19% de la mediana 3002) | 4 (/post/aluminum-vs-wood-pergolas-humid-climate/, /post/is-a-louvered-roof-pergola-worth-it-in-florida/, /resources/blog/, …) |
| 62 | `/cms-img/blog/aluminum-vs-wood-pergolas-humid-climate/thumbnail-pergola-material-comparison-humidity.avif` | 525x350 | 406x271 | 358x239 | 812x542 | SUB-RESOLUCION (1.29x, minimo 1.5x)<br>BLANDA (nitidez 1098, 37% de la mediana 3002) | 4 (/post/hurricane-resistant-pergolas-south-florida/, /post/is-a-louvered-roof-pergola-worth-it-in-florida/, /resources/blog/, …) |
| 63 | `/cms-img/blog/best-pergola-materials-coastal-florida/thumbnail-marine-grade-aluminum-pergola-detail.avif` | 525x350 | 406x271 | 358x239 | 812x542 | SUB-RESOLUCION (1.29x, minimo 1.5x)<br>BLANDA (nitidez 313, 10% de la mediana 3002) | 2 (/resources/blog/, /resources/blog/maintenance-care/) |
| 64 | `/cms-img/blog/hoa-rules-pergolas-south-florida/thumbnail-hoa-approved-pergola-south-florida.avif` | 525x350 | 406x271 | 358x239 | 812x542 | SUB-RESOLUCION (1.29x, minimo 1.5x) | 83 (/, /es/, /es/pergolas-contractors/aventura-pergola-builders/, …) |
| 65 | `/cms-img/blog/poolside-pergola-ideas-for-florida-homes/thumbnail-florida-poolside-louvered-pergola-detail.avif` | 525x350 | 406x271 | 358x239 | 812x542 | SUB-RESOLUCION (1.29x, minimo 1.5x) | 79 (/, /es/, /es/pergolas-contractors/aventura-pergola-builders/, …) |
| 66 | `/cms-img/blog/best-outdoor-structures-rain-sun-florida/thumbnail-insulated-patio-cover-florida.avif` | 525x350 | 406x271 | 358x239 | 812x542 | SUB-RESOLUCION (1.29x, minimo 1.5x) | 3 (/post/pergola-design-ideas-waterfront-properties/, /resources/blog/, /resources/blog/pergolas-shade-systems/) |
| 67 | `/cms-img/blog/how-long-pergola-installation-florida/thumbnail-how-long-pergola-installation-florida.avif` | 525x350 | 406x271 | 358x239 | 812x542 | SUB-RESOLUCION (1.29x, minimo 1.5x) | 2 (/resources/blog/, /resources/blog/buying-guides-cost/) |
| 68 | `/cms-img/blog/add-shade-backyard-south-florida/thumbnail-motorized-pergola-shade-florida-heat.avif` | 525x350 | 406x271 | 358x239 | 812x542 | SUB-RESOLUCION (1.29x, minimo 1.5x) | 2 (/resources/blog/, /resources/blog/outdoor-living-design/) |
| 69 | `/cms-img/blog/resort-style-backyard-boca-raton/thumbnail-boca-raton-luxury-pergola-lounge.avif` | 525x350 | 406x271 | 358x239 | 812x542 | SUB-RESOLUCION (1.29x, minimo 1.5x) | 2 (/resources/blog/, /resources/blog/outdoor-living-design/) |
| 70 | `/images/cliente/forte-plus-hillsboro-estate.avif` | 1250x703 | 950x450 | 358x300 | 1900x900 | SUB-RESOLUCION (1.32x, minimo 1.5x) | 78 (/, /about-us/industries-we-serve/, /countries/broward-county-pergola-contractor/, …) |
| 71 | `/cms-img/projects/attached-forte-plus-pergola-on-the-intracoastal-in-boca-raton/hero-attached-forte-plus-pergola-boca-raton-intracoastal.avif` | 1250x703 | 950x450 | 358x300 | 1900x900 | SUB-RESOLUCION (1.32x, minimo 1.5x) | 78 (/, /about-us/industries-we-serve/, /countries/broward-county-pergola-contractor/, …) |
| 72 | `/cms-img/projects/forte-pergola-with-privacy-wall-tv-mount-in-delray-beach/hero-forte-pergola-privacy-wall-tv-mount-delray-beach.avif` | 1250x833 | 950x450 | 358x300 | 1900x900 | SUB-RESOLUCION (1.32x, minimo 1.5x) | 78 (/, /about-us/industries-we-serve/, /countries/broward-county-pergola-contractor/, …) |
| 73 | `/cms-img/projects/eclipse-cabanas-forte-pergola-hospitality-project-in-riviera-beach/hero-eclipse-cabanas-forte-pergola-riviera-beach-hospitality.avif` | 1250x938 | 950x450 | 358x300 | 1900x900 | SUB-RESOLUCION (1.32x, minimo 1.5x) | 78 (/, /about-us/industries-we-serve/, /countries/broward-county-pergola-contractor/, …) |
| 74 | `/cms-img/projects/attached-forte-pergola-in-west-palm-beach/hero-forte-pergola-west-palm-beach-project.avif` | 1250x703 | 950x450 | 358x300 | 1900x900 | SUB-RESOLUCION (1.32x, minimo 1.5x) | 78 (/, /about-us/industries-we-serve/, /countries/broward-county-pergola-contractor/, …) |
| 75 | `/cms-img/projects/forte-pergolas-in-greenacres-pool-patio/hero-forte-pergolas-greenacres-pool-patio-south-florida.avif` | 1250x938 | 950x450 | 358x300 | 1900x900 | SUB-RESOLUCION (1.32x, minimo 1.5x) | 78 (/, /about-us/industries-we-serve/, /countries/broward-county-pergola-contractor/, …) |
| 76 | `/cms-img/projects/forte-plus-pergola-with-outdoor-kitchen-in-delray-beach/hero-forte-plus-pergola-outdoor-kitchen-delray-beach.avif` | 1250x938 | 950x450 | 358x300 | 1900x900 | SUB-RESOLUCION (1.32x, minimo 1.5x) | 78 (/, /about-us/industries-we-serve/, /countries/broward-county-pergola-contractor/, …) |
| 77 | `/cms-img/projects/forte-pergola-with-partial-privacy-wall-in-palm-beach-gardens/hero-forte-pergola-partial-privacy-wall-palm-beach-gardens.avif` | 1250x938 | 950x450 | 358x300 | 1900x900 | SUB-RESOLUCION (1.32x, minimo 1.5x) | 78 (/, /about-us/industries-we-serve/, /countries/broward-county-pergola-contractor/, …) |
| 78 | `/cms-img/projects/forte-pergola-with-privacy-wall-motorized-screen-in-delray-beach/hero-forte-pergola-motorized-screen-delray-beach-south-florida.avif` | 1250x833 | 950x450 | 358x300 | 1900x900 | SUB-RESOLUCION (1.32x, minimo 1.5x) | 78 (/, /about-us/industries-we-serve/, /countries/broward-county-pergola-contractor/, …) |
| 79 | `/cms-img/projects/forte-plus-aluminum-carport-installation-in-pompano-beach/hero-forte-plus-aluminum-carport-pompano-beach-south-florida.avif` | 1250x937 | 950x450 | 358x300 | 1900x900 | SUB-RESOLUCION (1.32x, minimo 1.5x) | 78 (/, /about-us/industries-we-serve/, /countries/broward-county-pergola-contractor/, …) |
| 80 | `/images/luxury-outdoor-living-south-florida-pool-pergola-outdoor-kitchen-modern-backyard.avif` | 2000x779 | 1440x392 | — | 2880x784 | SUB-RESOLUCION (1.39x, minimo 1.5x)<br>SOBRECOMPRIMIDA (0.088 B/px, 39% de la mediana 0.227) | 176 (/, /about-us/about-us/, /about-us/brands/, …) |
| 81 | `/images/picture-8-p-500.jpg` | 500x500 | — | 358x300 | 716x600 | SUB-RESOLUCION (1.40x, minimo 1.5x)<br>BLOQUES JPEG (1.19x en los limites de 8px) | 2 (/es/products/carports/, /products/carports/) |
| 82 | `/images/motorized-screen-installers-in-south-florida-p-500.jpg` | 500x500 | — | 358x1536 | 716x3072 | SUB-RESOLUCION (1.40x, minimo 1.5x) | 2 (/es/products/motorized-screens/, /products/motorized-screens/) |
| 83 | `/images/premium-paver-installation-south-florida.avif` | 650x650 | 292x257 | 326x281 | 652x562 | BLANDA (nitidez 408, 14% de la mediana 3002)<br>SOBRECOMPRIMIDA (0.061 B/px, 27% de la mediana 0.227) | 22 (/, /es/, /es/products/cabanas/, …) |
| 84 | `/images/architectural-concrete-patio-south-florida.avif` | 650x650 | 292x236 | 326x263 | 652x526 | BLANDA (nitidez 932, 31% de la mediana 3002)<br>SOBRECOMPRIMIDA (0.062 B/px, 27% de la mediana 0.227) | 22 (/, /es/, /es/products/cabanas/, …) |
| 85 | `/cms-img/brands/equinox/gallery-equinox-louvered-roof-pergolas-south-florida-03.avif` | 1875x1250 | 388x350 | 358x300 | 776x700 | BLANDA (nitidez 692, 23% de la mediana 3002)<br>SOBRECOMPRIMIDA (0.026 B/px, 11% de la mediana 0.227) | 2 (/brands/equinox/, /es/brands/equinox/) |
| 86 | `/cms-img/brands/equinox/gallery-equinox-louvered-roof-pergolas-south-florida-07.avif` | 1875x1250 | 388x350 | 358x300 | 776x700 | BLANDA (nitidez 277, 9% de la mediana 3002)<br>SOBRECOMPRIMIDA (0.033 B/px, 15% de la mediana 0.227) | 2 (/brands/equinox/, /es/brands/equinox/) |
| 87 | `/cms-img/brands/equinox/gallery-equinox-louvered-roof-pergolas-south-florida-06.avif` | 1667x1250 | 388x350 | 358x300 | 776x700 | BLANDA (nitidez 981, 33% de la mediana 3002)<br>SOBRECOMPRIMIDA (0.080 B/px, 35% de la mediana 0.227) | 2 (/brands/equinox/, /es/brands/equinox/) |
| 88 | `/cms-img/brands/fenetex/gallery-fenetex-motorized-screens-south-florida-10.avif` | 1667x1250 | 388x350 | 358x300 | 776x700 | BLANDA (nitidez 733, 24% de la mediana 3002)<br>SOBRECOMPRIMIDA (0.066 B/px, 29% de la mediana 0.227) | 2 (/brands/fenetex/, /es/brands/fenetex/) |
| 89 | `/cms-img/products/motorized-louvered-pergolas/gallery-louvered-roof-pergola-contractors-south-florida-10.avif` | 1250x833 | 617x411 | 171x114 | 1234x822 | BLANDA (nitidez 777, 26% de la mediana 3002)<br>SOBRECOMPRIMIDA (0.069 B/px, 30% de la mediana 0.227) | 2 (/es/products/motorized-louvered-pergolas/, /products/motorized-louvered-pergolas/) |
| 90 | `/images/cliente/custom-pergolas-and-patio-covers.avif` | 1250x703 | 593x450 | 390x300 | 1186x900 | BLANDA (nitidez 1033, 34% de la mediana 3002)<br>SOBRECOMPRIMIDA (0.063 B/px, 28% de la mediana 0.227) | 6 (/es/products/polycarbonate-pergolas/, /es/services/, /es/services/pergola-design-construction/, …) |
| 91 | `/cms-img/projects/forte-pergola-with-partial-privacy-wall-in-palm-beach-gardens/gallery-luxury-pergola-palm-beach-gardens-home.avif` | 1250x938 | 388x350 | 358x300 | 776x700 | BLANDA (nitidez 1079, 36% de la mediana 3002)<br>SOBRECOMPRIMIDA (0.070 B/px, 31% de la mediana 0.227) | 2 (/es/project/forte-pergola-with-partial-privacy-wall-in-palm-beach-gardens/, /project/forte-pergola-with-partial-privacy-wall-in-palm-beach-gardens/) |
| 92 | `/cms-img/projects/forte-plus-pergolas-in-hillsboro-beach-estate/gallery-oceanfront-aluminum-pergola-south-florida.avif` | 1250x833 | 388x350 | 358x300 | 776x700 | BLANDA (nitidez 914, 30% de la mediana 3002)<br>SOBRECOMPRIMIDA (0.086 B/px, 38% de la mediana 0.227) | 2 (/es/project/forte-plus-pergolas-in-hillsboro-beach-estate/, /project/forte-plus-pergolas-in-hillsboro-beach-estate/) |
| 93 | `/cms-img/blog/best-pergola-materials-coastal-florida/inline-white-marine-grade-aluminum-pergola-detail.avif` | 1250x833 | 772x515 | 358x239 | 1544x1030 | BLANDA (nitidez 234, 8% de la mediana 3002)<br>SOBRECOMPRIMIDA (0.045 B/px, 20% de la mediana 0.227) | 1 (/post/best-pergola-materials-coastal-florida/) |
| 94 | `/cms-img/blog/best-pergola-materials-coastal-florida/inline-coastal-florida-pergola-sunset.avif` | 1250x682 | 772x421 | 358x195 | 1544x842 | BLANDA (nitidez 407, 14% de la mediana 3002)<br>SOBRECOMPRIMIDA (0.055 B/px, 24% de la mediana 0.227) | 1 (/post/best-pergola-materials-coastal-florida/) |
| 95 | `/cms-img/blog/building-custom-pergola-south-florida/inline-building-pergola-south-florida.avif` | 1250x833 | 772x515 | 358x239 | 1544x1030 | BLANDA (nitidez 971, 32% de la mediana 3002)<br>SOBRECOMPRIMIDA (0.097 B/px, 43% de la mediana 0.227) | 1 (/post/building-custom-pergola-south-florida/) |
| 96 | `/cms-img/blog/is-a-louvered-roof-pergola-worth-it-in-florida/inline-custom-louvered-roof-pergola-worth-it-florida.avif` | 1250x833 | 772x515 | 358x239 | 1544x1030 | BLANDA (nitidez 908, 30% de la mediana 3002)<br>SOBRECOMPRIMIDA (0.087 B/px, 38% de la mediana 0.227) | 1 (/post/is-a-louvered-roof-pergola-worth-it-in-florida/) |
| 97 | `/cms-img/blog/pergola-cost-south-florida/inline-custom-pergola-cost-south-florida-luxury-backyard.avif` | 1250x833 | 772x515 | 358x239 | 1544x1030 | BLANDA (nitidez 1052, 35% de la mediana 3002)<br>SOBRECOMPRIMIDA (0.081 B/px, 36% de la mediana 0.227) | 1 (/post/pergola-cost-south-florida/) |
| 98 | `/images/Generated-Image-February-11--2026---7_23PM.avif` | 2000x1293 | 720x692 | — | 1440x1384 | SOBRECOMPRIMIDA (0.025 B/px, 11% de la mediana 0.227) | 58 (/, /countries/broward-county-pergola-contractor/, /countries/miami-dade-pergola-contractor/, …) |
| 99 | `/images/custom-deck-builders-south-florida.avif` | 650x650 | 292x236 | 326x263 | 652x526 | SOBRECOMPRIMIDA (0.091 B/px, 40% de la mediana 0.227) | 22 (/, /es/, /es/products/cabanas/, …) |
| 100 | `/images/Commercial-pergola-contractors-south-florida.avif` | 1250x1250 | 395x1250 | — | 790x2500 | SOBRECOMPRIMIDA (0.061 B/px, 27% de la mediana 0.227) | 2 (/about-us/industries-we-serve/, /es/about-us/industries-we-serve/) |
| 101 | `/cms-img/brands/fenetex/gallery-fenetex-motorized-screens-south-florida-08.avif` | 1393x1250 | 388x350 | 358x300 | 776x700 | SOBRECOMPRIMIDA (0.093 B/px, 41% de la mediana 0.227) | 2 (/brands/fenetex/, /es/brands/fenetex/) |
| 102 | `/cms-img/brands/renaissance/gallery-renaissance-patio-covers-pergolas-florida-04.avif` | 2794x1250 | 388x350 | 358x300 | 776x700 | SOBRECOMPRIMIDA (0.093 B/px, 41% de la mediana 0.227) | 2 (/brands/renaissance/, /es/brands/renaissance/) |
| 103 | `/cms-img/products/cabanas/gallery-aluminum-cabana-contractors-south-florida-10.avif` | 1250x1250 | 617x411 | 171x114 | 1234x822 | SOBRECOMPRIMIDA (0.092 B/px, 40% de la mediana 0.227) | 2 (/es/products/cabanas/, /products/cabanas/) |
| 104 | `/cms-img/products/cabanas/gallery-aluminum-cabana-contractors-south-florida-07.avif` | 1250x1250 | 617x411 | 171x114 | 1234x822 | BLANDA (nitidez 1112, 37% de la mediana 3002) | 2 (/es/products/cabanas/, /products/cabanas/) |
| 105 | `/cms-img/products/cabanas/gallery-aluminum-cabana-contractors-south-florida-06.avif` | 1250x1250 | 617x411 | 171x114 | 1234x822 | SOBRECOMPRIMIDA (0.084 B/px, 37% de la mediana 0.227) | 2 (/es/products/cabanas/, /products/cabanas/) |
| 106 | `/cms-img/products/carports/gallery-aluminum-carport-builders-south-florida-03.avif` | 1250x833 | 617x411 | 171x114 | 1234x822 | BLANDA (nitidez 819, 27% de la mediana 3002) | 2 (/es/products/carports/, /products/carports/) |
| 107 | `/images/picture-8-p-1600.jpg` | 1600x1600 | 609x450 | — | 1218x900 | BLOQUES JPEG (1.25x en los limites de 8px) | 2 (/es/products/carports/, /products/carports/) |
| 108 | `/cms-img/products/motorized-louvered-pergolas/gallery-louvered-roof-pergola-contractors-south-florida-06.avif` | 1250x938 | 617x411 | 171x114 | 1234x822 | BLANDA (nitidez 967, 32% de la mediana 3002) | 2 (/es/products/motorized-louvered-pergolas/, /products/motorized-louvered-pergolas/) |
| 109 | `/images/motorized-screen-installers-in-south-florida-p-1080.jpg` | 1080x1080 | 609x1536 | — | 1218x3072 | BLOQUES JPEG (1.21x en los limites de 8px) | 2 (/es/products/motorized-screens/, /products/motorized-screens/) |
| 110 | `/cms-img/products/solar-pergolas/gallery-solar-roof-structure-contractors-south-florida-08.avif` | 1250x703 | 617x411 | 171x114 | 1234x822 | BLANDA (nitidez 1184, 39% de la mediana 3002) | 2 (/es/products/solar-pergolas/, /products/solar-pergolas/) |
| 111 | `/cms-img/products/solar-pergolas/swatch-solar-pergola-south-florida.avif` | 1450x1450 | 609x450 | 358x300 | 1218x900 | BLANDA (nitidez 920, 31% de la mediana 3002) | 2 (/es/products/solar-pergolas/, /products/solar-pergolas/) |
| 112 | `/cms-img/products/sukkha/intro-sukkha-3000-outdoor-structure-builders-south-florida.avif` | 1250x1250 | 609x1250 | 358x1250 | 1218x2500 | SOBRECOMPRIMIDA (0.096 B/px, 42% de la mediana 0.227) | 2 (/es/products/sukkha/, /products/sukkha/) |
| 113 | `/cms-img/projects/forte-pergola-with-partial-privacy-wall-in-palm-beach-gardens/gallery-forte-pergola-residential-installation-palm-beach-gardens.avif` | 1250x937 | 388x350 | 358x300 | 776x700 | SOBRECOMPRIMIDA (0.101 B/px, 44% de la mediana 0.227) | 2 (/es/project/forte-pergola-with-partial-privacy-wall-in-palm-beach-gardens/, /project/forte-pergola-with-partial-privacy-wall-in-palm-beach-gardens/) |
| 114 | `/cms-img/blog/aluminum-pergola-cost-boca-raton-vs-fort-lauderdale/inline-custom-aluminum-pergola-cost-boca-vs-fort-lauderdale.avif` | 1250x714 | 772x441 | 358x204 | 1544x882 | SOBRECOMPRIMIDA (0.075 B/px, 33% de la mediana 0.227) | 1 (/post/aluminum-pergola-cost-boca-raton-vs-fort-lauderdale/) |
| 115 | `/cms-img/blog/how-long-pergola-installation-florida/inline-pergola-footing-installation-florida.avif` | 1250x833 | 772x515 | 358x239 | 1544x1030 | BLANDA (nitidez 898, 30% de la mediana 3002) | 1 (/post/how-long-pergola-installation-florida/) |

## Las que pasan

<details><summary>347 imagenes sin marca</summary>

| Ruta | Actual | Display mayor | Factor | Nitidez | B/px |
|---|---|---|---|---|---|
| `/cms-img/blog/add-shade-backyard-south-florida/inline-backyard-outdoor-living-south-florida-louvered-pergola.avif` | 1250x703 | 772x434 | 1.62x | 3782.2 | 0.284 |
| `/cms-img/blog/add-shade-backyard-south-florida/inline-florida-pergola-motorized-screens.avif` | 1250x682 | 772x421 | 1.62x | 3732.2 | 0.200 |
| `/cms-img/blog/add-shade-backyard-south-florida/inline-sunset-shaded-backyard-south-florida.avif` | 1250x703 | 772x434 | 1.62x | 1694.3 | 0.157 |
| `/cms-img/blog/aluminum-pergola-cost-boca-raton-vs-fort-lauderdale/inline-fort-lauderdale-waterfront-pergola.avif` | 1250x682 | 772x421 | 1.62x | 2979.1 | 0.314 |
| `/cms-img/blog/aluminum-pergola-cost-boca-raton-vs-fort-lauderdale/thumbnail-fort-lauderdale-aluminum-pergola-cost.avif` | 642x350 | 406x271 | 1.58x | 3121.1 | 0.422 |
| `/cms-img/blog/aluminum-vs-wood-pergolas-humid-climate/inline-aluminum-pergola-humid-florida.avif` | 1250x833 | 772x515 | 1.62x | 2557.2 | 0.187 |
| `/cms-img/blog/aluminum-vs-wood-pergolas-humid-climate/inline-aluminum-wood-pergola-humid-climate.avif` | 1250x833 | 772x515 | 1.62x | 1756.9 | 0.212 |
| `/cms-img/blog/aluminum-vs-wood-pergolas-humid-climate/inline-custom-pergola-material-comparison-humidity.avif` | 1250x682 | 772x421 | 1.62x | 2481.6 | 0.286 |
| `/cms-img/blog/best-outdoor-structures-rain-sun-florida/inline-aluminum-cabana-florida-poolside.avif` | 1250x682 | 772x421 | 1.62x | 3510.5 | 0.237 |
| `/cms-img/blog/best-outdoor-structures-rain-sun-florida/inline-best-outdoor-structures-south-florida-rain-sun.avif` | 1250x682 | 772x421 | 1.62x | 3393.8 | 0.339 |
| `/cms-img/blog/best-outdoor-structures-rain-sun-florida/inline-florida-all-weather-outdoor-structure.avif` | 1250x682 | 772x421 | 1.62x | 2719.6 | 0.227 |
| `/cms-img/blog/best-pergola-materials-coastal-florida/inline-south-florida-aluminum-pergola.avif` | 1250x833 | 772x515 | 1.62x | 2415.0 | 0.199 |
| `/cms-img/blog/building-custom-pergola-south-florida/inline-completed-custom-pergola-south-florida.avif` | 1250x703 | 772x434 | 1.62x | 1615.0 | 0.152 |
| `/cms-img/blog/building-custom-pergola-south-florida/inline-custom-pergola-builders-detail-florida.avif` | 1250x703 | 772x434 | 1.62x | 3278.6 | 0.299 |
| `/cms-img/blog/can-you-use-your-patio-year-round-in-south-florida/inline-patio-south-florida-pergola.avif` | 1250x682 | 772x421 | 1.62x | 1487.1 | 0.152 |
| `/cms-img/blog/can-you-use-your-patio-year-round-in-south-florida/inline-south-florida-patio-motorized-screens.avif` | 1250x703 | 772x434 | 1.62x | 2454.6 | 0.248 |
| `/cms-img/blog/can-you-use-your-patio-year-round-in-south-florida/inline-year-round-patio-south-florida-sunset.avif` | 1250x682 | 772x421 | 1.62x | 1441.3 | 0.134 |
| `/cms-img/blog/can-you-use-your-patio-year-round-in-south-florida/thumbnail-south-florida-year-round-patio-cover.avif` | 622x350 | 406x271 | 1.53x | 3249.0 | 0.255 |
| `/cms-img/blog/design-build-pergola-process-south-florida/inline-completed-design-build-pergola-florida.avif` | 1250x703 | 772x434 | 1.62x | 3147.7 | 0.229 |
| `/cms-img/blog/design-build-pergola-process-south-florida/inline-design-build-custom-pergola-south-florida.avif` | 1250x703 | 772x434 | 1.62x | 4799.0 | 0.322 |
| `/cms-img/blog/design-build-pergola-process-south-florida/inline-pergola-design-build-installation-detail-plan.avif` | 1250x703 | 772x434 | 1.62x | 1514.3 | 0.125 |
| `/cms-img/blog/hoa-rules-pergolas-south-florida/inline-custom-hoa-approved-pergola-south-florida.avif` | 1250x833 | 772x515 | 1.62x | 2842.2 | 0.248 |
| `/cms-img/blog/hoa-rules-pergolas-south-florida/inline-hoa-compliant-pergola-south-florida.avif` | 1250x682 | 772x421 | 1.62x | 3231.8 | 0.347 |
| `/cms-img/blog/hoa-rules-pergolas-south-florida/inline-luxury-pergola-hoa-approval-rendering-florida.avif` | 1250x714 | 772x441 | 1.62x | 2484.9 | 0.220 |
| `/cms-img/blog/how-long-pergola-installation-florida/inline-completed-pergola-installation-florida.avif` | 1250x682 | 772x421 | 1.62x | 1698.2 | 0.176 |
| `/cms-img/blog/hurricane-resistant-pergolas-south-florida/inline-column-rated-pergola-engineering-detail.avif` | 1250x833 | 772x515 | 1.62x | 1620.9 | 0.146 |
| `/cms-img/blog/hurricane-resistant-pergolas-south-florida/inline-custom-hurricane-resistant-pergola-south-florida.avif` | 1250x682 | 772x421 | 1.62x | 1846.6 | 0.152 |
| `/cms-img/blog/hurricane-resistant-pergolas-south-florida/inline-hurricane-proof-pergola-south-florida.avif` | 1250x833 | 772x515 | 1.62x | 2981.2 | 0.289 |
| `/cms-img/blog/is-a-louvered-roof-pergola-worth-it-in-florida/inline-florida-louvered-pergola-sunset.avif` | 1250x682 | 772x421 | 1.62x | 1991.0 | 0.200 |
| `/cms-img/blog/is-a-louvered-roof-pergola-worth-it-in-florida/inline-louvered-roof-rain-protection-florida.avif` | 1250x682 | 772x421 | 1.62x | 2824.3 | 0.207 |
| `/cms-img/blog/is-a-louvered-roof-pergola-worth-it-in-florida/thumbnail-motorized-louvered-roof-florida-closeup.avif` | 642x350 | 406x271 | 1.58x | 3693.3 | 0.242 |
| `/cms-img/blog/luxury-pergola-ideas-for-south-florida-backyards/inline-illuminated-luxury-pergola-south-florida.avif` | 1250x682 | 772x421 | 1.62x | 1860.8 | 0.240 |
| `/cms-img/blog/luxury-pergola-ideas-for-south-florida-backyards/inline-outdoor-kitchen-under-aluminum-pergola-florida.avif` | 1250x682 | 772x421 | 1.62x | 2105.3 | 0.260 |
| `/cms-img/blog/luxury-pergola-ideas-for-south-florida-backyards/inline-pergola-ideas-south-florida-backyard.avif` | 1250x682 | 772x421 | 1.62x | 3730.6 | 0.247 |
| `/cms-img/blog/luxury-pergola-ideas-for-south-florida-backyards/thumbnail-motorized-louvered-roof-south-florida-design.avif` | 642x350 | 406x271 | 1.58x | 1863.3 | 0.326 |
| `/cms-img/blog/modern-outdoor-living-trends-in-south-florida/inline-modern-outdoor-kitchen-under-pergola-florida.avif` | 1250x682 | 772x421 | 1.62x | 2287.0 | 0.295 |
| `/cms-img/blog/modern-outdoor-living-trends-in-south-florida/inline-pergola-outdoor-living-south-florida-2026.avif` | 1250x682 | 772x421 | 1.62x | 3757.4 | 0.333 |
| `/cms-img/blog/modern-outdoor-living-trends-in-south-florida/inline-sunset-modern-pergola-south-florida.avif` | 1250x682 | 772x421 | 1.62x | 1757.3 | 0.206 |
| `/cms-img/blog/modern-outdoor-living-trends-in-south-florida/thumbnail-modern-louvered-roof-trend-florida.avif` | 642x350 | 406x271 | 1.58x | 4583.5 | 0.346 |
| `/cms-img/blog/pergola-building-codes-broward-palm-beach/inline-code-compliant-pergola-south-florida.avif` | 1250x833 | 772x515 | 1.62x | 1725.8 | 0.194 |
| `/cms-img/blog/pergola-building-codes-broward-palm-beach/inline-custom-pergola-building-codes-south-florida.avif` | 1250x833 | 772x515 | 1.62x | 3721.1 | 0.315 |
| `/cms-img/blog/pergola-building-codes-broward-palm-beach/inline-plan-pergola-wind-load-engineering-florida.avif` | 1250x833 | 772x515 | 1.62x | 4320.4 | 0.119 |
| `/cms-img/blog/pergola-building-codes-broward-palm-beach/thumbnail-pergola-wind-load-engineering-florida.avif` | 613x350 | 406x271 | 1.51x | 1755.1 | 0.287 |
| `/cms-img/blog/pergola-cost-south-florida/inline-south-florida-louvered-roof-cost-example.avif` | 1250x703 | 772x434 | 1.62x | 3731.9 | 0.301 |
| `/cms-img/blog/pergola-cost-south-florida/inline-sunset-pergola-south-florida-cost.avif` | 1250x682 | 772x421 | 1.62x | 3773.9 | 0.245 |
| `/cms-img/blog/pergola-cost-south-florida/thumbnail-motorized-pergola-cost-florida.avif` | 622x350 | 406x271 | 1.53x | 1519.7 | 0.270 |
| `/cms-img/blog/pergola-design-ideas-waterfront-properties/inline-waterfront-outdoor-kitchen-pergola.avif` | 1250x833 | 772x515 | 1.62x | 2108.9 | 0.206 |
| `/cms-img/blog/pergola-design-ideas-waterfront-properties/inline-waterfront-pergola-design-florida.avif` | 1250x833 | 772x515 | 1.62x | 2533.8 | 0.220 |
| `/cms-img/blog/pergola-design-ideas-waterfront-properties/inline-waterfront-pergola-sunset-florida.avif` | 1250x682 | 772x421 | 1.62x | 1409.7 | 0.146 |
| `/cms-img/blog/pergola-design-ideas-waterfront-properties/thumbnail-coastal-waterfront-pergola-design.avif` | 622x350 | 406x271 | 1.53x | 1576.7 | 0.290 |
| `/cms-img/blog/pergola-permit-south-florida/inline-custom-pergola-engineering-plans-florida.avif` | 1250x682 | 772x421 | 1.62x | 2874.5 | 0.298 |
| `/cms-img/blog/pergola-permit-south-florida/inline-custom-pergola-permit-south-florida.avif` | 1250x714 | 772x441 | 1.62x | 1642.7 | 0.216 |
| `/cms-img/blog/pergola-permit-south-florida/inline-permitted-pergola-south-florida.avif` | 1250x833 | 772x515 | 1.62x | 1320.1 | 0.159 |
| `/cms-img/blog/pergola-permit-south-florida/thumbnail-pergola-engineering-plans-florida.avif` | 975x650 | 406x271 | 2.40x | 2860.2 | 0.185 |
| `/cms-img/blog/plan-pergola-south-florida-backyard/inline-boca-vs-fort-lauderdale-pergola-sunset.avif` | 1250x833 | 772x515 | 1.62x | 2383.3 | 0.178 |
| `/cms-img/blog/plan-pergola-south-florida-backyard/inline-completed-pergola-south-florida-backyard.avif` | 1250x833 | 772x515 | 1.62x | 2955.6 | 0.317 |
| `/cms-img/blog/plan-pergola-south-florida-backyard/inline-custom-planning-pergola-south-florida-backyard.avif` | 1250x833 | 772x515 | 1.62x | 3629.5 | 0.293 |
| `/cms-img/blog/plan-pergola-south-florida-backyard/thumbnail-south-florida-pergola-design-rendering.avif` | 642x350 | 406x271 | 1.58x | 2058.0 | 0.355 |
| `/cms-img/blog/poolside-pergola-ideas-for-florida-homes/inline-florida-poolside-outdoor-kitchen-pergola.avif` | 1250x703 | 772x434 | 1.62x | 2287.0 | 0.201 |
| `/cms-img/blog/poolside-pergola-ideas-for-florida-homes/inline-poolside-pergola-ideas-florida-2026.avif` | 1250x682 | 772x421 | 1.62x | 2740.3 | 0.344 |
| `/cms-img/blog/poolside-pergola-ideas-for-florida-homes/inline-sunset-poolside-pergola-florida.avif` | 1250x703 | 772x434 | 1.62x | 1656.4 | 0.149 |
| `/cms-img/blog/resort-style-backyard-boca-raton/inline-boca-raton-outdoor-kitchen-pergola.avif` | 1250x833 | 772x515 | 1.62x | 2240.1 | 0.257 |
| `/cms-img/blog/resort-style-backyard-boca-raton/inline-pergola-resort-style-backyard-boca-raton.avif` | 1250x682 | 772x421 | 1.62x | 2576.3 | 0.279 |
| `/cms-img/blog/resort-style-backyard-boca-raton/inline-sunset-resort-style-backyard-boca-raton.avif` | 1250x682 | 772x421 | 1.62x | 2409.7 | 0.276 |
| `/cms-img/brands/appolo/cover-apollo-louvered-roof-systems-south-florida.avif` | 1250x698 | 609x300 | 2.05x | 3877.7 | 0.268 |
| `/cms-img/brands/appolo/gallery-apollo-louvered-roof-systems-south-florida-01.avif` | 2000x1250 | 388x350 | 5.15x | 3462.7 | 0.156 |
| `/cms-img/brands/appolo/gallery-apollo-louvered-roof-systems-south-florida-02.avif` | 1667x1250 | 388x350 | 4.30x | 2822.5 | 0.164 |
| `/cms-img/brands/appolo/gallery-apollo-louvered-roof-systems-south-florida-03.avif` | 2000x1250 | 388x350 | 5.15x | 4390.5 | 0.158 |
| `/cms-img/brands/appolo/gallery-apollo-louvered-roof-systems-south-florida-04.avif` | 1250x1250 | 388x350 | 3.22x | 9414.5 | 0.275 |
| `/cms-img/brands/appolo/gallery-apollo-louvered-roof-systems-south-florida-05.avif` | 2000x1250 | 388x350 | 5.15x | 3201.9 | 0.181 |
| `/cms-img/brands/appolo/gallery-apollo-louvered-roof-systems-south-florida-06.avif` | 2000x1250 | 388x350 | 5.15x | 3726.8 | 0.219 |
| `/cms-img/brands/appolo/gallery-apollo-louvered-roof-systems-south-florida-07.avif` | 2000x1250 | 388x350 | 5.15x | 3799.6 | 0.194 |
| `/cms-img/brands/appolo/gallery-apollo-louvered-roof-systems-south-florida-08.avif` | 1667x1250 | 388x350 | 4.30x | 5019.4 | 0.213 |
| `/cms-img/brands/appolo/gallery-apollo-louvered-roof-systems-south-florida-09.avif` | 1667x1250 | 388x350 | 4.30x | 2579.2 | 0.244 |
| `/cms-img/brands/appolo/gallery-apollo-louvered-roof-systems-south-florida-10.avif` | 1667x1250 | 388x350 | 4.30x | 6374.0 | 0.223 |
| `/cms-img/brands/equinox/cover-equinox-louvered-roof-pergolas-south-florida.avif` | 1250x698 | 609x300 | 2.05x | 3569.7 | 0.230 |
| `/cms-img/brands/equinox/gallery-equinox-louvered-roof-pergolas-south-florida-01.avif` | 1875x1250 | 388x350 | 4.83x | 3021.1 | 0.208 |
| `/cms-img/brands/equinox/gallery-equinox-louvered-roof-pergolas-south-florida-02.avif` | 1673x1250 | 388x350 | 4.31x | 6813.9 | 0.236 |
| `/cms-img/brands/equinox/gallery-equinox-louvered-roof-pergolas-south-florida-04.avif` | 1667x1250 | 388x350 | 4.30x | 6803.0 | 0.280 |
| `/cms-img/brands/equinox/gallery-equinox-louvered-roof-pergolas-south-florida-05.avif` | 2222x1250 | 388x350 | 5.73x | 8417.9 | 0.324 |
| `/cms-img/brands/equinox/gallery-equinox-louvered-roof-pergolas-south-florida-08.avif` | 1667x1250 | 388x350 | 4.30x | 5496.0 | 0.289 |
| `/cms-img/brands/equinox/gallery-equinox-louvered-roof-pergolas-south-florida-09.avif` | 2222x1250 | 388x350 | 5.73x | 3851.1 | 0.235 |
| `/cms-img/brands/equinox/gallery-equinox-louvered-roof-pergolas-south-florida-10.avif` | 2222x1250 | 388x350 | 5.73x | 3463.8 | 0.128 |
| `/cms-img/brands/fenetex/cover-fenetex-motorized-screens-south-florida.avif` | 1250x698 | 609x300 | 2.05x | 2390.7 | 0.174 |
| `/cms-img/brands/fenetex/gallery-fenetex-motorized-screens-south-florida-01.avif` | 1667x1250 | 388x350 | 4.30x | 2587.8 | 0.256 |
| `/cms-img/brands/fenetex/gallery-fenetex-motorized-screens-south-florida-02.avif` | 1667x1250 | 388x350 | 4.30x | 1630.3 | 0.163 |
| `/cms-img/brands/fenetex/gallery-fenetex-motorized-screens-south-florida-03.avif` | 1667x1250 | 388x350 | 4.30x | 2020.6 | 0.165 |
| `/cms-img/brands/fenetex/gallery-fenetex-motorized-screens-south-florida-04.avif` | 1667x1250 | 388x350 | 4.30x | 2973.8 | 0.207 |
| `/cms-img/brands/fenetex/gallery-fenetex-motorized-screens-south-florida-05.avif` | 1667x1250 | 388x350 | 4.30x | 4125.8 | 0.262 |
| `/cms-img/brands/fenetex/gallery-fenetex-motorized-screens-south-florida-06.avif` | 1876x1250 | 388x350 | 4.84x | 2267.6 | 0.162 |
| `/cms-img/brands/fenetex/gallery-fenetex-motorized-screens-south-florida-07.avif` | 1667x1250 | 388x350 | 4.30x | 2845.8 | 0.225 |
| `/cms-img/brands/fenetex/gallery-fenetex-motorized-screens-south-florida-09.avif` | 1875x1250 | 388x350 | 4.83x | 2697.9 | 0.137 |
| `/cms-img/brands/pergola-plus-forte/cover-pergola-plus-florida-custom-systems.avif` | 1250x698 | 609x300 | 2.05x | 4644.8 | 0.231 |
| `/cms-img/brands/pergola-plus-forte/gallery-pergola-plus-florida-custom-systems-1.avif` | 1875x1250 | 388x350 | 4.83x | 6489.5 | 0.294 |
| `/cms-img/brands/pergola-plus-forte/gallery-pergola-plus-florida-custom-systems-2.avif` | 1667x1250 | 388x350 | 4.30x | 2188.1 | 0.166 |
| `/cms-img/brands/pergola-plus-forte/gallery-pergola-plus-florida-custom-systems-3.avif` | 1667x1250 | 388x350 | 4.30x | 1897.7 | 0.224 |
| `/cms-img/brands/pergola-plus-forte/gallery-pergola-plus-florida-custom-systems-4.avif` | 1667x1250 | 388x350 | 4.30x | 3713.5 | 0.309 |
| `/cms-img/brands/pergola-plus-forte/gallery-pergola-plus-florida-custom-systems-5.avif` | 1250x1250 | 388x350 | 3.22x | 5042.3 | 0.255 |
| `/cms-img/brands/pergola-plus-forte/gallery-pergola-plus-florida-custom-systems-6.avif` | 1250x1250 | 388x350 | 3.22x | 4268.2 | 0.161 |
| `/cms-img/brands/pergola-plus-forte/gallery-pergola-plus-florida-custom-systems-7.avif` | 1250x1250 | 388x350 | 3.22x | 3766.0 | 0.323 |
| `/cms-img/brands/pergola-plus-forte/gallery-pergola-plus-florida-custom-systems-8.avif` | 1250x1250 | 388x350 | 3.22x | 4355.7 | 0.230 |
| `/cms-img/brands/renaissance/cover-renaissance-patio-covers-pergolas-florida.avif` | 1250x698 | 609x300 | 2.05x | 3399.4 | 0.256 |
| `/cms-img/brands/renaissance/gallery-renaissance-patio-covers-pergolas-florida-01.avif` | 1875x1250 | 388x350 | 4.83x | 2388.8 | 0.116 |
| `/cms-img/brands/renaissance/gallery-renaissance-patio-covers-pergolas-florida-02.avif` | 1875x1250 | 388x350 | 4.83x | 2449.6 | 0.271 |
| `/cms-img/brands/renaissance/gallery-renaissance-patio-covers-pergolas-florida-03.avif` | 1875x1250 | 388x350 | 4.83x | 3171.8 | 0.112 |
| `/cms-img/brands/renaissance/gallery-renaissance-patio-covers-pergolas-florida-05.avif` | 1667x1250 | 388x350 | 4.30x | 2099.5 | 0.150 |
| `/cms-img/brands/renaissance/gallery-renaissance-patio-covers-pergolas-florida-06.avif` | 1876x1250 | 388x350 | 4.84x | 2762.5 | 0.202 |
| `/cms-img/brands/renaissance/gallery-renaissance-patio-covers-pergolas-florida-07.avif` | 2174x1250 | 388x350 | 5.60x | 4273.4 | 0.271 |
| `/cms-img/brands/renaissance/gallery-renaissance-patio-covers-pergolas-florida-08.avif` | 1875x1250 | 388x350 | 4.83x | 3312.0 | 0.190 |
| `/cms-img/brands/renaissance/gallery-renaissance-patio-covers-pergolas-florida-09.avif` | 1876x1250 | 388x350 | 4.84x | 1404.1 | 0.128 |
| `/cms-img/brands/renaissance/gallery-renaissance-patio-covers-pergolas-florida-10.avif` | 1875x1250 | 388x350 | 4.83x | 2965.8 | 0.191 |
| `/cms-img/galleries/10/gallery-renaissance-aluminum-pergola-broward-county.avif` | 1250x833 | 358x239 | 3.49x | 2701.2 | 0.216 |
| `/cms-img/galleries/11/gallery-renaissance-patio-cover-miami-fl.avif` | 1250x938 | 358x239 | 3.49x | 3106.4 | 0.192 |
| `/cms-img/galleries/12/gallery-renaissance-pergola-boca-raton-poolside.avif` | 1250x833 | 358x239 | 3.49x | 3313.9 | 0.271 |
| `/cms-img/galleries/4/gallery-equinox-louvered-pergola-project-boca-raton.avif` | 1250x833 | 313x208 | 3.99x | 3617.4 | 0.218 |
| `/cms-img/galleries/5/gallery-equinox-luxury-pergola-palm-beach-county.avif` | 1250x833 | 313x208 | 3.99x | 1470.0 | 0.110 |
| `/cms-img/galleries/6/gallery-equinox-roof-pergola-south-florida-installation.avif` | 1250x937 | 313x208 | 3.99x | 3463.1 | 0.244 |
| `/cms-img/galleries/7/gallery-luxury-insulated-patio-cover-south-florida.avif` | 1250x833 | 313x208 | 3.99x | 4107.3 | 0.232 |
| `/cms-img/galleries/8/gallery-modern-insulated-patio-cover-boca-raton-project.avif` | 1250x833 | 358x239 | 3.49x | 4822.7 | 0.360 |
| `/cms-img/galleries/9/gallery-modern-patio-cover-insulated-roof-palm-beach.avif` | 1250x833 | 358x239 | 3.49x | 4912.8 | 0.301 |
| `/cms-img/industries/corporate-office-campuses/cover-corporate-campus-outdoor-pergola-installation.avif` | 825x450 | 385x200 | 2.14x | 2877.6 | 0.137 |
| `/cms-img/industries/educational-institutions/cover-university-campus-commercial-pergola.avif` | 825x450 | 385x200 | 2.14x | 3914.5 | 0.186 |
| `/cms-img/industries/government-civic-buildings/cover-civic-building-commercial-pergola-installation.avif` | 825x450 | 385x200 | 2.14x | 3496.5 | 0.214 |
| `/cms-img/industries/healthcare-wellness-facilities/cover-healthcare-facility-outdoor-pergola-installation.avif` | 825x450 | 385x200 | 2.14x | 2085.0 | 0.185 |
| `/cms-img/industries/hospitality-restaurants-hotels-rooftop-venues/cover-commercial-pergola-hospitality-rooftop-restaurant.avif` | 825x450 | 385x200 | 2.14x | 3230.6 | 0.180 |
| `/cms-img/industries/multifamily-residential-communities/cover-apartment-amenity-pool-pergola-system.avif` | 825x450 | 385x200 | 2.14x | 2179.3 | 0.215 |
| `/cms-img/industries/parks-public-spaces/cover-public-park-commercial-aluminum-pergola.avif` | 825x450 | 385x200 | 2.14x | 5682.2 | 0.198 |
| `/cms-img/industries/real-estate-property-management/cover-multifamily-community-commercial-pergola-installation.avif` | 825x450 | 385x200 | 2.14x | 3147.0 | 0.239 |
| `/cms-img/industries/retail-shopping-centers/cover-retail-shopping-center-commercial-pergola-system.avif` | 825x450 | 385x200 | 2.14x | 2745.6 | 0.171 |
| `/cms-img/industries/sports-recreation-facilities/cover-sports-complex-commercial-pergola-system.avif` | 825x450 | 385x200 | 2.14x | 3090.7 | 0.173 |
| `/cms-img/locations/broward-county-pergola-contractor/intro-broward-county-aluminum-pergola-contractor.avif` | 1250x1250 | 609x1250 | 2.05x | 3309.0 | 0.165 |
| `/cms-img/locations/miami-dade-pergola-contractor/intro-miami-dade-custom-aluminum-pergola.avif` | 1250x1250 | 609x1250 | 2.05x | 4354.2 | 0.230 |
| `/cms-img/locations/palm-beach-county-pergola-contractor/intro-palm-beach-county-luxury-pergola.avif` | 1250x1250 | 609x1250 | 2.05x | 5138.0 | 0.279 |
| `/cms-img/products/cabanas/gallery-aluminum-cabana-contractors-south-florida-01.avif` | 1250x1250 | 617x411 | 2.03x | 2625.0 | 0.167 |
| `/cms-img/products/cabanas/gallery-aluminum-cabana-contractors-south-florida-02.avif` | 1250x1250 | 617x411 | 2.03x | 3409.4 | 0.198 |
| `/cms-img/products/cabanas/gallery-aluminum-cabana-contractors-south-florida-03.avif` | 1250x682 | 617x411 | 2.03x | 3227.7 | 0.267 |
| `/cms-img/products/cabanas/gallery-aluminum-cabana-contractors-south-florida-04.avif` | 1250x1250 | 617x411 | 2.03x | 1724.0 | 0.119 |
| `/cms-img/products/cabanas/gallery-aluminum-cabana-contractors-south-florida-05.avif` | 1250x1250 | 617x411 | 2.03x | 3601.2 | 0.230 |
| `/cms-img/products/cabanas/gallery-aluminum-cabana-contractors-south-florida-08.avif` | 1250x1250 | 617x411 | 2.03x | 1776.7 | 0.141 |
| `/cms-img/products/cabanas/gallery-aluminum-cabana-contractors-south-florida-09.avif` | 1250x1250 | 617x411 | 2.03x | 3455.6 | 0.195 |
| `/cms-img/products/cabanas/intro-aluminum-cabana-contractors-south-florida.avif` | 1250x1250 | 609x1250 | 2.05x | 2942.1 | 0.192 |
| `/cms-img/products/cabanas/swatch-custom-pergola-cabana-south-florida.avif` | 1450x1450 | 609x450 | 2.38x | 5324.4 | 0.348 |
| `/cms-img/products/carports/gallery-aluminum-carport-builders-south-florida-01.avif` | 1250x833 | 617x411 | 2.03x | 4197.1 | 0.256 |
| `/cms-img/products/carports/gallery-aluminum-carport-builders-south-florida-02.avif` | 1250x937 | 617x411 | 2.03x | 2378.2 | 0.218 |
| `/cms-img/products/carports/gallery-aluminum-carport-builders-south-florida-04.avif` | 1250x833 | 617x411 | 2.03x | 3720.9 | 0.332 |
| `/cms-img/products/carports/gallery-aluminum-carport-builders-south-florida-05.avif` | 1250x1250 | 617x411 | 2.03x | 3070.9 | 0.324 |
| `/cms-img/products/carports/gallery-aluminum-carport-builders-south-florida-06.avif` | 1250x937 | 617x411 | 2.03x | 3763.9 | 0.260 |
| `/cms-img/products/carports/gallery-aluminum-carport-builders-south-florida-07.avif` | 1250x938 | 617x411 | 2.03x | 2115.1 | 0.125 |
| `/cms-img/products/carports/gallery-aluminum-carport-builders-south-florida-08.avif` | 1250x938 | 617x411 | 2.03x | 2552.7 | 0.160 |
| `/cms-img/products/carports/gallery-aluminum-carport-builders-south-florida-09.avif` | 1250x938 | 617x411 | 2.03x | 3235.3 | 0.244 |
| `/cms-img/products/carports/gallery-aluminum-carport-builders-south-florida-10.avif` | 1250x938 | 617x411 | 2.03x | 3787.8 | 0.294 |
| `/cms-img/products/carports/intro-aluminum-carport-builders-south-florida.avif` | 1250x1250 | 609x1250 | 2.05x | 3070.9 | 0.325 |
| `/cms-img/products/motorized-louvered-pergolas/gallery-louvered-roof-pergola-contractors-south-florida-01.avif` | 1250x833 | 617x411 | 2.03x | 3053.8 | 0.200 |
| `/cms-img/products/motorized-louvered-pergolas/gallery-louvered-roof-pergola-contractors-south-florida-02.avif` | 1250x937 | 617x411 | 2.03x | 4474.7 | 0.290 |
| `/cms-img/products/motorized-louvered-pergolas/gallery-louvered-roof-pergola-contractors-south-florida-03.avif` | 1250x768 | 617x411 | 2.03x | 5767.5 | 0.271 |
| `/cms-img/products/motorized-louvered-pergolas/gallery-louvered-roof-pergola-contractors-south-florida-04.avif` | 1250x938 | 617x411 | 2.03x | 6555.4 | 0.271 |
| `/cms-img/products/motorized-louvered-pergolas/gallery-louvered-roof-pergola-contractors-south-florida-05.avif` | 1250x938 | 617x411 | 2.03x | 6484.9 | 0.278 |
| `/cms-img/products/motorized-louvered-pergolas/gallery-louvered-roof-pergola-contractors-south-florida-07.avif` | 1250x938 | 617x411 | 2.03x | 5236.4 | 0.262 |
| `/cms-img/products/motorized-louvered-pergolas/gallery-louvered-roof-pergola-contractors-south-florida-08.avif` | 1250x833 | 617x411 | 2.03x | 3678.2 | 0.232 |
| `/cms-img/products/motorized-louvered-pergolas/gallery-louvered-roof-pergola-contractors-south-florida-09.avif` | 1250x703 | 617x411 | 2.03x | 3559.4 | 0.178 |
| `/cms-img/products/motorized-louvered-pergolas/intro-louvered-roof-pergola-contractors-south-florida.avif` | 1250x1250 | 609x1250 | 2.05x | 8121.9 | 0.312 |
| `/cms-img/products/motorized-louvered-pergolas/swatch-louvered-roof-pergola-builders-south-florida.avif` | 1450x1450 | 609x450 | 2.38x | 6472.9 | 0.239 |
| `/cms-img/products/motorized-screens/gallery-motorized-screen-installers-south-florida-01.avif` | 1250x938 | 617x411 | 2.03x | 2903.0 | 0.297 |
| `/cms-img/products/motorized-screens/gallery-motorized-screen-installers-south-florida-02.avif` | 1250x835 | 617x411 | 2.03x | 4079.2 | 0.320 |
| `/cms-img/products/motorized-screens/gallery-motorized-screen-installers-south-florida-03.avif` | 1250x938 | 617x411 | 2.03x | 1606.1 | 0.184 |
| `/cms-img/products/motorized-screens/gallery-motorized-screen-installers-south-florida-04.avif` | 1250x833 | 617x411 | 2.03x | 3382.7 | 0.276 |
| `/cms-img/products/motorized-screens/gallery-motorized-screen-installers-south-florida-05.avif` | 1250x938 | 617x411 | 2.03x | 1989.8 | 0.194 |
| `/cms-img/products/motorized-screens/gallery-motorized-screen-installers-south-florida-06.avif` | 1250x938 | 617x411 | 2.03x | 3247.5 | 0.277 |
| `/cms-img/products/motorized-screens/gallery-motorized-screen-installers-south-florida-07.avif` | 1250x938 | 617x411 | 2.03x | 4854.5 | 0.318 |
| `/cms-img/products/motorized-screens/gallery-motorized-screen-installers-south-florida-08.avif` | 1250x938 | 617x411 | 2.03x | 1631.5 | 0.216 |
| `/cms-img/products/motorized-screens/gallery-motorized-screen-installers-south-florida-09.avif` | 1250x833 | 617x411 | 2.03x | 2533.1 | 0.292 |
| `/cms-img/products/motorized-screens/gallery-motorized-screen-installers-south-florida-10.avif` | 1250x1250 | 617x411 | 2.03x | 3765.9 | 0.323 |
| `/cms-img/products/motorized-screens/swatch-motorized-screen-and-retractable-patio.avif` | 1450x1450 | 609x450 | 2.38x | 5628.2 | 0.191 |
| `/cms-img/products/open-air-pergolas/gallery-open-air-pergola-builders-south-florida-01.avif` | 1250x833 | 617x411 | 2.03x | 2705.3 | 0.272 |
| `/cms-img/products/open-air-pergolas/gallery-open-air-pergola-builders-south-florida-02.avif` | 1250x703 | 617x411 | 2.03x | 2518.5 | 0.183 |
| `/cms-img/products/open-air-pergolas/gallery-open-air-pergola-builders-south-florida-03.avif` | 1250x937 | 617x411 | 2.03x | 2742.5 | 0.219 |
| `/cms-img/products/open-air-pergolas/gallery-open-air-pergola-builders-south-florida-04.avif` | 1250x938 | 617x411 | 2.03x | 5199.2 | 0.364 |
| `/cms-img/products/open-air-pergolas/gallery-open-air-pergola-builders-south-florida-05.avif` | 1250x937 | 617x411 | 2.03x | 5587.3 | 0.322 |
| `/cms-img/products/open-air-pergolas/gallery-open-air-pergola-builders-south-florida-06.avif` | 1250x833 | 617x411 | 2.03x | 4594.1 | 0.243 |
| `/cms-img/products/open-air-pergolas/gallery-open-air-pergola-builders-south-florida-07.avif` | 1250x938 | 617x411 | 2.03x | 2068.6 | 0.190 |
| `/cms-img/products/open-air-pergolas/gallery-open-air-pergola-builders-south-florida-08.avif` | 1250x1250 | 617x411 | 2.03x | 3128.8 | 0.174 |
| `/cms-img/products/open-air-pergolas/gallery-open-air-pergola-builders-south-florida-09.avif` | 1250x833 | 617x411 | 2.03x | 2911.1 | 0.234 |
| `/cms-img/products/open-air-pergolas/gallery-open-air-pergola-builders-south-florida-10.avif` | 1250x938 | 617x411 | 2.03x | 3166.8 | 0.204 |
| `/cms-img/products/open-air-pergolas/intro-open-air-pergola-builders-south-florida.avif` | 1250x1250 | 609x1250 | 2.05x | 3128.8 | 0.174 |
| `/cms-img/products/open-air-pergolas/swatch-luxury-pergola-builders-south-florida.avif` | 1450x1450 | 609x450 | 2.38x | 3560.3 | 0.302 |
| `/cms-img/products/polycarbonate-pergolas/gallery-polycarbonate-pergola-contractors-south-florida-02.avif` | 1250x833 | 617x411 | 2.03x | 2949.8 | 0.188 |
| `/cms-img/products/polycarbonate-pergolas/gallery-polycarbonate-pergola-contractors-south-florida-03.avif` | 1250x938 | 617x411 | 2.03x | 3106.4 | 0.192 |
| `/cms-img/products/polycarbonate-pergolas/gallery-polycarbonate-pergola-contractors-south-florida-04.avif` | 1250x893 | 617x411 | 2.03x | 4881.6 | 0.297 |
| `/cms-img/products/polycarbonate-pergolas/gallery-polycarbonate-pergola-contractors-south-florida-05.avif` | 1250x833 | 617x411 | 2.03x | 2961.8 | 0.228 |
| `/cms-img/products/polycarbonate-pergolas/gallery-polycarbonate-pergola-contractors-south-florida-07.avif` | 1250x833 | 617x411 | 2.03x | 3170.3 | 0.160 |
| `/cms-img/products/polycarbonate-pergolas/gallery-polycarbonate-pergola-contractors-south-florida-08.avif` | 1250x834 | 617x411 | 2.03x | 2535.7 | 0.206 |
| `/cms-img/products/polycarbonate-pergolas/gallery-polycarbonate-pergola-contractors-south-florida-09.avif` | 1250x833 | 617x411 | 2.03x | 2129.5 | 0.114 |
| `/cms-img/products/polycarbonate-pergolas/gallery-polycarbonate-pergola-contractors-south-florida-10.avif` | 1250x768 | 617x411 | 2.03x | 3371.3 | 0.290 |
| `/cms-img/products/polycarbonate-pergolas/intro-polycarbonate-pergola-contractors-south-florida-01.avif` | 1250x833 | 609x833 | 2.05x | 4758.6 | 0.270 |
| `/cms-img/products/polycarbonate-pergolas/swatch-polycarbonate-pergola-contractors-south-florida.avif` | 1450x1088 | 609x450 | 2.38x | 3141.2 | 0.248 |
| `/cms-img/products/screen-enclosures/gallery-screen-enclosure-contractors-south-florida-01.avif` | 1250x938 | 617x411 | 2.03x | 3162.5 | 0.295 |
| `/cms-img/products/screen-enclosures/gallery-screen-enclosure-contractors-south-florida-02.avif` | 1250x703 | 617x411 | 2.03x | 6291.9 | 0.355 |
| `/cms-img/products/screen-enclosures/gallery-screen-enclosure-contractors-south-florida-03.avif` | 1250x703 | 617x411 | 2.03x | 2675.0 | 0.227 |
| `/cms-img/products/screen-enclosures/gallery-screen-enclosure-contractors-south-florida-04.avif` | 1250x698 | 617x411 | 2.03x | 2840.9 | 0.267 |
| `/cms-img/products/screen-enclosures/gallery-screen-enclosure-contractors-south-florida-05.avif` | 1250x698 | 617x411 | 2.03x | 1827.9 | 0.190 |
| `/cms-img/products/screen-enclosures/gallery-screen-enclosure-contractors-south-florida-06.avif` | 1250x698 | 617x411 | 2.03x | 1421.4 | 0.133 |
| `/cms-img/products/screen-enclosures/gallery-screen-enclosure-contractors-south-florida-07.avif` | 1250x698 | 617x411 | 2.03x | 2036.0 | 0.185 |
| `/cms-img/products/screen-enclosures/gallery-screen-enclosure-contractors-south-florida-08.avif` | 1250x698 | 617x411 | 2.03x | 3015.4 | 0.233 |
| `/cms-img/products/screen-enclosures/gallery-screen-enclosure-contractors-south-florida-09.avif` | 1250x698 | 617x411 | 2.03x | 3048.4 | 0.197 |
| `/cms-img/products/screen-enclosures/gallery-screen-enclosure-contractors-south-florida-10.avif` | 1250x698 | 617x411 | 2.03x | 2707.1 | 0.205 |
| `/cms-img/products/screen-enclosures/intro-screen-enclosure-contractors-south-florida.avif` | 1250x1250 | 609x1250 | 2.05x | 1911.4 | 0.112 |
| `/cms-img/products/screen-enclosures/swatch-pool-screen-enclosure-contractors-south-florida.avif` | 1450x1450 | 609x450 | 2.38x | 3912.7 | 0.179 |
| `/cms-img/products/solar-pergolas/gallery-solar-roof-structure-contractors-south-florida-01.avif` | 1250x704 | 617x411 | 2.03x | 1509.9 | 0.187 |
| `/cms-img/products/solar-pergolas/gallery-solar-roof-structure-contractors-south-florida-02.avif` | 1250x831 | 617x411 | 2.03x | 3094.2 | 0.370 |
| `/cms-img/products/solar-pergolas/gallery-solar-roof-structure-contractors-south-florida-03.avif` | 1250x748 | 617x411 | 2.03x | 2189.3 | 0.314 |
| `/cms-img/products/solar-pergolas/gallery-solar-roof-structure-contractors-south-florida-04.avif` | 1250x703 | 617x411 | 2.03x | 2658.5 | 0.353 |
| `/cms-img/products/solar-pergolas/gallery-solar-roof-structure-contractors-south-florida-05.avif` | 1250x703 | 617x411 | 2.03x | 2569.5 | 0.310 |
| `/cms-img/products/solar-pergolas/gallery-solar-roof-structure-contractors-south-florida-06.avif` | 1250x703 | 617x411 | 2.03x | 1916.6 | 0.237 |
| `/cms-img/products/solar-pergolas/gallery-solar-roof-structure-contractors-south-florida-07.avif` | 1250x703 | 617x411 | 2.03x | 1864.7 | 0.230 |
| `/cms-img/products/solar-pergolas/gallery-solar-roof-structure-contractors-south-florida-09.avif` | 1250x703 | 617x411 | 2.03x | 2514.7 | 0.228 |
| `/cms-img/products/solar-pergolas/gallery-solar-roof-structure-contractors-south-florida-10.avif` | 1250x703 | 617x411 | 2.03x | 1477.9 | 0.173 |
| `/cms-img/products/solar-pergolas/intro-solar-roof-structure-contractors-south-florida.avif` | 1250x1250 | 609x1250 | 2.05x | 1486.1 | 0.113 |
| `/cms-img/products/solid-roof-pergolas/gallery-insulated-roof-pergola-builders-south-florida-01.avif` | 1250x833 | 617x411 | 2.03x | 1714.0 | 0.179 |
| `/cms-img/products/solid-roof-pergolas/gallery-insulated-roof-pergola-builders-south-florida-02.avif` | 1250x833 | 617x411 | 2.03x | 6273.7 | 0.327 |
| `/cms-img/products/solid-roof-pergolas/gallery-insulated-roof-pergola-builders-south-florida-03.avif` | 1250x938 | 617x411 | 2.03x | 2039.2 | 0.141 |
| `/cms-img/products/solid-roof-pergolas/gallery-insulated-roof-pergola-builders-south-florida-04.avif` | 1250x938 | 617x411 | 2.03x | 2141.7 | 0.192 |
| `/cms-img/products/solid-roof-pergolas/gallery-insulated-roof-pergola-builders-south-florida-05.avif` | 1250x938 | 617x411 | 2.03x | 3647.0 | 0.336 |
| `/cms-img/products/solid-roof-pergolas/gallery-insulated-roof-pergola-builders-south-florida-06.avif` | 1250x833 | 617x411 | 2.03x | 5226.1 | 0.285 |
| `/cms-img/products/solid-roof-pergolas/gallery-insulated-roof-pergola-builders-south-florida-08.avif` | 1250x938 | 617x411 | 2.03x | 4114.6 | 0.365 |
| `/cms-img/products/solid-roof-pergolas/gallery-insulated-roof-pergola-builders-south-florida-09.avif` | 1250x833 | 617x411 | 2.03x | 5544.7 | 0.228 |
| `/cms-img/products/solid-roof-pergolas/gallery-insulated-roof-pergola-builders-south-florida-10.avif` | 1250x703 | 617x411 | 2.03x | 2720.3 | 0.184 |
| `/cms-img/products/solid-roof-pergolas/intro-insulated-roof-pergola-builders-south-florida.avif` | 1250x1250 | 609x1250 | 2.05x | 4291.1 | 0.194 |
| `/cms-img/products/solid-roof-pergolas/swatch-insulated-roof-pergola-contractors-south-florida.avif` | 1450x1450 | 609x450 | 2.38x | 2626.1 | 0.295 |
| `/cms-img/products/sukkha/gallery-sukkha-3000-outdoor-structure-builders-south-florida-1.avif` | 1250x833 | 617x411 | 2.03x | 1799.4 | 0.164 |
| `/cms-img/products/sukkha/gallery-sukkha-3000-outdoor-structure-builders-south-florida-2.avif` | 1250x937 | 617x411 | 2.03x | 1811.7 | 0.138 |
| `/cms-img/products/sukkha/gallery-sukkha-3000-outdoor-structure-builders-south-florida-3.avif` | 1250x937 | 617x411 | 2.03x | 1279.1 | 0.103 |
| `/cms-img/products/sukkha/gallery-sukkha-3000-outdoor-structure-builders-south-florida-4.avif` | 1250x938 | 617x411 | 2.03x | 5941.0 | 0.193 |
| `/cms-img/products/sukkha/gallery-sukkha-3000-outdoor-structure-builders-south-florida-5.avif` | 1250x833 | 617x411 | 2.03x | 4716.0 | 0.400 |
| `/cms-img/products/sukkha/gallery-sukkha-3000-outdoor-structure-builders-south-florida-6.avif` | 1250x833 | 617x411 | 2.03x | 3004.5 | 0.267 |
| `/cms-img/products/sukkha/gallery-sukkha-3000-outdoor-structure-builders-south-florida-7.avif` | 1250x937 | 617x411 | 2.03x | 2988.8 | 0.272 |
| `/cms-img/products/sukkha/gallery-sukkha-3000-outdoor-structure-builders-south-florida-8.avif` | 1250x833 | 617x411 | 2.03x | 5363.7 | 0.375 |
| `/cms-img/products/sukkha/swatch-sukkha-outdoor-structure-builders-south-florida.avif` | 1450x1450 | 609x450 | 2.38x | 2284.2 | 0.115 |
| `/cms-img/projects/attached-forte-pergola-in-west-palm-beach/gallery-aluminum-attached-pergola-west-palm-beach.avif` | 1250x703 | 388x350 | 3.22x | 2385.3 | 0.127 |
| `/cms-img/projects/attached-forte-pergola-in-west-palm-beach/gallery-attached-forte-pergola-west-palm-beach-south-florida.avif` | 1250x703 | 388x350 | 3.22x | 2981.2 | 0.256 |
| `/cms-img/projects/attached-forte-pergola-in-west-palm-beach/gallery-engineered-pergola-installation-west-palm-beach.avif` | 1250x703 | 388x350 | 3.22x | 3107.8 | 0.404 |
| `/cms-img/projects/attached-forte-pergola-in-west-palm-beach/gallery-forte-attached-pergola-palm-beach-county.avif` | 1250x703 | 388x350 | 3.22x | 2084.2 | 0.175 |
| `/cms-img/projects/attached-forte-pergola-in-west-palm-beach/gallery-residential-attached-pergola-south-florida.avif` | 1250x703 | 388x350 | 3.22x | 1851.9 | 0.206 |
| `/cms-img/projects/attached-forte-plus-pergola-on-the-intracoastal-in-boca-raton/gallery-coastal-attached-pergola-palm-beach-county.avif` | 1250x833 | 388x350 | 3.22x | 2917.8 | 0.316 |
| `/cms-img/projects/attached-forte-plus-pergola-on-the-intracoastal-in-boca-raton/gallery-engineered-pergola-intracoastal-boca-raton.avif` | 1250x703 | 388x350 | 3.22x | 2524.1 | 0.227 |
| `/cms-img/projects/attached-forte-plus-pergola-on-the-intracoastal-in-boca-raton/gallery-forte-plus-aluminum-pergola-boca-raton-project.avif` | 1250x703 | 388x350 | 3.22x | 2259.3 | 0.189 |
| `/cms-img/projects/attached-forte-plus-pergola-on-the-intracoastal-in-boca-raton/gallery-forte-plus-pergola-boca-raton-waterfront.avif` | 1250x703 | 388x350 | 3.22x | 3382.1 | 0.296 |
| `/cms-img/projects/attached-forte-plus-pergola-on-the-intracoastal-in-boca-raton/gallery-luxury-waterfront-pergola-south-florida.avif` | 1250x703 | 388x350 | 3.22x | 3024.0 | 0.254 |
| `/cms-img/projects/eclipse-cabanas-forte-pergola-hospitality-project-in-riviera-beach/gallery-commercial-pergola-riviera-beach-palm-beach-county.avif` | 1250x703 | 388x350 | 3.22x | 2922.6 | 0.299 |
| `/cms-img/projects/eclipse-cabanas-forte-pergola-hospitality-project-in-riviera-beach/gallery-eclipse-cabanas-hospitality-south-florida.avif` | 1250x703 | 388x350 | 3.22x | 3894.6 | 0.396 |
| `/cms-img/projects/eclipse-cabanas-forte-pergola-hospitality-project-in-riviera-beach/gallery-engineered-hospitality-shade-structure-south-florida.avif` | 1250x703 | 388x350 | 3.22x | 4079.4 | 0.275 |
| `/cms-img/projects/eclipse-cabanas-forte-pergola-hospitality-project-in-riviera-beach/gallery-forte-pergola-commercial-installation-riviera-beach.avif` | 1250x703 | 388x350 | 3.22x | 5147.1 | 0.286 |
| `/cms-img/projects/eclipse-cabanas-forte-pergola-hospitality-project-in-riviera-beach/gallery-riviera-beach-commercial-outdoor-structure-project.avif` | 1250x703 | 388x350 | 3.22x | 3001.8 | 0.259 |
| `/cms-img/projects/forte-pergola-with-partial-privacy-wall-in-palm-beach-gardens/gallery-aluminum-pergola-privacy-wall-south-florida.avif` | 1250x938 | 388x350 | 3.22x | 3410.4 | 0.314 |
| `/cms-img/projects/forte-pergola-with-partial-privacy-wall-in-palm-beach-gardens/gallery-custom-forte-pergola-palm-beach-county.avif` | 1250x938 | 388x350 | 3.22x | 3647.0 | 0.336 |
| `/cms-img/projects/forte-pergola-with-partial-privacy-wall-in-palm-beach-gardens/gallery-engineered-pergola-project-south-florida-coastal.avif` | 1250x938 | 388x350 | 3.22x | 3406.3 | 0.277 |
| `/cms-img/projects/forte-pergola-with-privacy-wall-motorized-screen-in-delray-beach/gallery-custom-aluminum-pergola-delray-beach-installation.avif` | 1250x938 | 388x350 | 3.22x | 4113.1 | 0.366 |
| `/cms-img/projects/forte-pergola-with-privacy-wall-motorized-screen-in-delray-beach/gallery-forte-pergola-insulated-wood-design-south-florida.avif` | 1250x938 | 388x350 | 3.22x | 2815.8 | 0.137 |
| `/cms-img/projects/forte-pergola-with-privacy-wall-motorized-screen-in-delray-beach/gallery-forte-pergola-privacy-wall-delray-beach.avif` | 1250x833 | 388x350 | 3.22x | 4247.2 | 0.154 |
| `/cms-img/projects/forte-pergola-with-privacy-wall-motorized-screen-in-delray-beach/gallery-luxury-pergola-project-delray-beach-residential.avif` | 1250x938 | 388x350 | 3.22x | 5168.1 | 0.329 |
| `/cms-img/projects/forte-pergola-with-privacy-wall-motorized-screen-in-delray-beach/gallery-motorized-shade-screen-pergola-palm-beach-county.avif` | 1250x703 | 388x350 | 3.22x | 4261.1 | 0.297 |
| `/cms-img/projects/forte-pergola-with-privacy-wall-tv-mount-in-delray-beach/gallery-custom-pergola-tv-mount-palm-beach-county.avif` | 1250x833 | 388x350 | 3.22x | 5288.9 | 0.355 |
| `/cms-img/projects/forte-pergola-with-privacy-wall-tv-mount-in-delray-beach/gallery-engineered-aluminum-pergola-delray-beach.avif` | 1250x833 | 388x350 | 3.22x | 3649.2 | 0.318 |
| `/cms-img/projects/forte-pergola-with-privacy-wall-tv-mount-in-delray-beach/gallery-forte-pergola-privacy-wall-delray-beach-project.avif` | 1250x833 | 388x350 | 3.22x | 3576.1 | 0.238 |
| `/cms-img/projects/forte-pergola-with-privacy-wall-tv-mount-in-delray-beach/gallery-luxury-pergola-installation-palm-beach-county.avif` | 1250x833 | 388x350 | 3.22x | 4399.1 | 0.338 |
| `/cms-img/projects/forte-pergola-with-privacy-wall-tv-mount-in-delray-beach/gallery-outdoor-entertainment-pergola-south-florida.avif` | 1250x833 | 388x350 | 3.22x | 3898.5 | 0.250 |
| `/cms-img/projects/forte-pergolas-in-greenacres-pool-patio/gallery-aluminum-pergola-pool-patio-greenacres.avif` | 1250x833 | 388x350 | 3.22x | 6273.7 | 0.327 |
| `/cms-img/projects/forte-pergolas-in-greenacres-pool-patio/gallery-custom-forte-pergola-greenacres-palm-beach-county.avif` | 1250x938 | 388x350 | 3.22x | 5806.1 | 0.312 |
| `/cms-img/projects/forte-pergolas-in-greenacres-pool-patio/gallery-engineered-pergola-project-greenacres-fl.avif` | 1250x938 | 388x350 | 3.22x | 4908.6 | 0.159 |
| `/cms-img/projects/forte-pergolas-in-greenacres-pool-patio/gallery-forte-aluminum-pergola-palm-beach-county.avif` | 1250x833 | 388x350 | 3.22x | 2678.6 | 0.127 |
| `/cms-img/projects/forte-pergolas-in-greenacres-pool-patio/gallery-luxury-poolside-pergola-south-florida.avif` | 1250x938 | 388x350 | 3.22x | 5077.4 | 0.313 |
| `/cms-img/projects/forte-plus-aluminum-carport-installation-in-pompano-beach/gallery-custom-carport-project-south-florida.avif` | 1250x833 | 388x350 | 3.22x | 3894.0 | 0.233 |
| `/cms-img/projects/forte-plus-aluminum-carport-installation-in-pompano-beach/gallery-forte-plus-carport-broward-county-installation.avif` | 1250x937 | 388x350 | 3.22x | 2966.9 | 0.218 |
| `/cms-img/projects/forte-plus-aluminum-carport-installation-in-pompano-beach/gallery-forte-plus-carport-structural-engineering-detail.avif` | 1250x833 | 388x350 | 3.22x | 4197.4 | 0.255 |
| `/cms-img/projects/forte-plus-aluminum-carport-installation-in-pompano-beach/gallery-forte-plus-coastal-carport-broward.avif` | 1250x833 | 388x350 | 3.22x | 2964.9 | 0.338 |
| `/cms-img/projects/forte-plus-aluminum-carport-installation-in-pompano-beach/gallery-residential-aluminum-carport-pompano-beach.avif` | 1250x938 | 388x350 | 3.22x | 2100.4 | 0.122 |
| `/cms-img/projects/forte-plus-pergola-with-outdoor-kitchen-in-delray-beach/gallery-custom-pergola-outdoor-kitchen-palm-beach-county.avif` | 1250x938 | 388x350 | 3.22x | 2141.4 | 0.191 |
| `/cms-img/projects/forte-plus-pergola-with-outdoor-kitchen-in-delray-beach/gallery-engineered-pergola-outdoor-kitchen-south-florida.avif` | 1250x938 | 388x350 | 3.22x | 1869.8 | 0.233 |
| `/cms-img/projects/forte-plus-pergola-with-outdoor-kitchen-in-delray-beach/gallery-forte-plus-aluminum-pergola-delray-beach-installation.avif` | 1250x938 | 388x350 | 3.22x | 2156.2 | 0.176 |
| `/cms-img/projects/forte-plus-pergola-with-outdoor-kitchen-in-delray-beach/gallery-luxury-outdoor-living-pergola-delray-beach.avif` | 1250x938 | 388x350 | 3.22x | 1391.4 | 0.150 |
| `/cms-img/projects/forte-plus-pergola-with-outdoor-kitchen-in-delray-beach/gallery-residential-pergola-kitchen-project-delray.avif` | 1250x938 | 388x350 | 3.22x | 3131.3 | 0.335 |
| `/cms-img/projects/forte-plus-pergolas-in-hillsboro-beach-estate/gallery-engineered-pergola-hillsboro-beach-estate.avif` | 1250x833 | 388x350 | 3.22x | 1521.8 | 0.149 |
| `/cms-img/projects/forte-plus-pergolas-in-hillsboro-beach-estate/gallery-forte-plus-pergola-broward-county-coastal.avif` | 1250x781 | 388x350 | 3.22x | 3658.9 | 0.231 |
| `/cms-img/projects/forte-plus-pergolas-in-hillsboro-beach-estate/gallery-luxury-beachfront-pergola-hillsboro-beach.avif` | 1250x833 | 388x350 | 3.22x | 4232.4 | 0.320 |
| `/cms-img/projects/forte-plus-pergolas-in-hillsboro-beach-estate/gallery-luxury-estate-pergola-installation-broward.avif` | 1250x833 | 388x350 | 3.22x | 1862.9 | 0.199 |
| `/cms-img/services/concrete/cover-structural-concrete-patio-foundation-florida-project.avif` | 1250x1250 | 593x450 | 2.11x | 5085.5 | 0.139 |
| `/cms-img/services/concrete/feature-structural-concrete-services-for-patios-in-south-florida-1.avif` | 1250x682 | 570x250 | 2.19x | 5215.9 | 0.251 |
| `/cms-img/services/concrete/feature-structural-concrete-services-for-patios-in-south-florida-2.avif` | 1250x682 | 570x250 | 2.19x | 1982.5 | 0.220 |
| `/cms-img/services/concrete/feature-structural-concrete-services-for-patios-in-south-florida-3.avif` | 1250x682 | 570x250 | 2.19x | 3452.8 | 0.253 |
| `/cms-img/services/concrete/feature-structural-concrete-services-for-patios-in-south-florida-4.avif` | 1250x682 | 570x250 | 2.19x | 3966.2 | 0.286 |
| `/cms-img/services/concrete/feature-structural-concrete-services-for-patios-in-south-florida-5.avif` | 1250x682 | 570x250 | 2.19x | 3811.7 | 0.310 |
| `/cms-img/services/concrete/intro-custom-concrete-driveway-south-florida-project.avif` | 1250x1250 | 609x1250 | 2.05x | 2494.8 | 0.125 |
| `/cms-img/services/deck-builders/cover-composite-deck-installation-south-florida-project.avif` | 1250x1250 | 593x450 | 2.11x | 2773.8 | 0.154 |
| `/cms-img/services/deck-builders/feature-deck-builders-contractors-in-south-florida-1.avif` | 1250x682 | 570x250 | 2.19x | 5045.1 | 0.374 |
| `/cms-img/services/deck-builders/feature-deck-builders-contractors-in-south-florida-2.avif` | 1250x682 | 570x250 | 2.19x | 2302.5 | 0.267 |
| `/cms-img/services/deck-builders/feature-deck-builders-contractors-in-south-florida-3.avif` | 1250x682 | 570x250 | 2.19x | 4092.8 | 0.214 |
| `/cms-img/services/deck-builders/feature-deck-builders-contractors-in-south-florida-4.avif` | 1250x682 | 570x250 | 2.19x | 4185.9 | 0.333 |
| `/cms-img/services/deck-builders/feature-deck-builders-contractors-in-south-florida-5.avif` | 1250x682 | 570x250 | 2.19x | 4532.0 | 0.251 |
| `/cms-img/services/deck-builders/intro-multi-level-deck-florida-project.avif` | 1250x1250 | 609x1250 | 2.05x | 5422.0 | 0.234 |
| `/cms-img/services/driveways/feature-luxury-driveway-installation-in-south-florida-1.avif` | 1250x682 | 570x250 | 2.19x | 5413.5 | 0.283 |
| `/cms-img/services/driveways/feature-luxury-driveway-installation-in-south-florida-2.avif` | 1250x682 | 570x250 | 2.19x | 4136.9 | 0.242 |
| `/cms-img/services/driveways/feature-luxury-driveway-installation-in-south-florida-3.avif` | 1250x682 | 570x250 | 2.19x | 3462.0 | 0.310 |
| `/cms-img/services/driveways/feature-luxury-driveway-installation-in-south-florida-4.avif` | 1250x682 | 570x250 | 2.19x | 3853.2 | 0.234 |
| `/cms-img/services/driveways/feature-luxury-driveway-installation-in-south-florida-5.avif` | 1250x682 | 570x250 | 2.19x | 3483.4 | 0.359 |
| `/cms-img/services/driveways/intro-luxury-stone-driveway-palm-beach-project.avif` | 1250x1250 | 609x1250 | 2.05x | 2423.1 | 0.109 |
| `/cms-img/services/fence-solutions/cover-aluminum-fence-installation-south-florida-project.avif` | 1250x1250 | 593x450 | 2.11x | 3672.2 | 0.186 |
| `/cms-img/services/fence-solutions/feature-fence-installation-contractors-south-florida-1.avif` | 1250x682 | 570x250 | 2.19x | 3997.3 | 0.336 |
| `/cms-img/services/fence-solutions/feature-fence-installation-contractors-south-florida-2.avif` | 1250x682 | 570x250 | 2.19x | 5246.5 | 0.248 |
| `/cms-img/services/fence-solutions/feature-fence-installation-contractors-south-florida-3.avif` | 1250x682 | 570x250 | 2.19x | 3684.9 | 0.315 |
| `/cms-img/services/fence-solutions/feature-fence-installation-contractors-south-florida-4.avif` | 1250x682 | 570x250 | 2.19x | 3184.1 | 0.299 |
| `/cms-img/services/fence-solutions/feature-fence-installation-contractors-south-florida-5.avif` | 1250x682 | 570x250 | 2.19x | 4334.8 | 0.337 |
| `/cms-img/services/fence-solutions/intro-privacy-fence-south-florida-project.avif` | 1250x1250 | 609x1250 | 2.05x | 5053.0 | 0.202 |
| `/cms-img/services/patio-remodeling/feature-patio-remodeling-design-contractors-south-florida-1.avif` | 1250x682 | 570x250 | 2.19x | 1983.4 | 0.171 |
| `/cms-img/services/patio-remodeling/feature-patio-remodeling-design-contractors-south-florida-2.avif` | 1250x682 | 570x250 | 2.19x | 3151.2 | 0.296 |
| `/cms-img/services/patio-remodeling/feature-patio-remodeling-design-contractors-south-florida-3.avif` | 1250x682 | 570x250 | 2.19x | 4179.9 | 0.338 |
| `/cms-img/services/patio-remodeling/feature-patio-remodeling-design-contractors-south-florida-4.avif` | 1250x682 | 570x250 | 2.19x | 3964.8 | 0.313 |
| `/cms-img/services/patio-remodeling/gallery-patio-remodeling-design-contractors-south-florida-5.avif` | 1250x682 | 358x239 | 3.49x | 3191.6 | 0.312 |
| `/cms-img/services/patio-remodeling/intro-outdoor-living-patio-remodel-florida-project.avif` | 1250x1250 | 609x1250 | 2.05x | 1693.6 | 0.106 |
| `/cms-img/services/pavers/feature-custom-paver-design-installation-florida-1.avif` | 1250x682 | 570x250 | 2.19x | 6354.0 | 0.268 |
| `/cms-img/services/pavers/feature-custom-paver-design-installation-florida-2.avif` | 1250x682 | 570x250 | 2.19x | 4316.8 | 0.255 |
| `/cms-img/services/pavers/feature-custom-paver-design-installation-florida-3.avif` | 1250x682 | 570x250 | 2.19x | 3844.4 | 0.302 |
| `/cms-img/services/pavers/feature-custom-paver-design-installation-florida-4.avif` | 1250x682 | 570x250 | 2.19x | 3756.7 | 0.180 |
| `/cms-img/services/pavers/feature-custom-paver-design-installation-florida-5.avif` | 1250x682 | 570x250 | 2.19x | 3717.4 | 0.316 |
| `/cms-img/services/pavers/intro-custom-paver-driveway-south-florida-project.avif` | 1250x1250 | 609x1250 | 2.05x | 4118.2 | 0.208 |
| `/cms-img/services/pergola-design-construction/feature-pergola-engineered-permitted-south-florida-1.avif` | 1250x682 | 570x250 | 2.19x | 4927.5 | 0.217 |
| `/cms-img/services/pergola-design-construction/feature-pergola-engineered-permitted-south-florida-2.avif` | 1250x682 | 570x250 | 2.19x | 4347.9 | 0.311 |
| `/cms-img/services/pergola-design-construction/feature-pergola-engineered-permitted-south-florida-3.avif` | 1250x682 | 570x250 | 2.19x | 1982.7 | 0.170 |
| `/cms-img/services/pergola-design-construction/feature-pergola-engineered-permitted-south-florida-4.avif` | 1250x682 | 570x250 | 2.19x | 3309.4 | 0.288 |
| `/cms-img/services/pergola-design-construction/feature-pergola-engineered-permitted-south-florida-5.avif` | 1250x682 | 570x250 | 2.19x | 3149.3 | 0.296 |
| `/cms-img/services/pergola-design-construction/intro-insulated-roof-pergola-builders-south-florida-07.avif` | 1250x833 | 609x833 | 2.05x | 4247.6 | 0.154 |
| `/images/appoiment-.avif` | 1250x1667 | 576x960 | 2.17x | 3533.8 | 0.157 |
| `/images/broward-county-pergola-outdoor-living-design-build-contractor-p-500.avif` | 500x500 | 326x1024 | 1.53x | 3062.9 | 0.319 |
| `/images/broward-county-pergola-outdoor-living-design-build-contractor.avif` | 1024x1024 | 609x1024 | 1.68x | 4394.6 | 0.179 |
| `/images/cliente/full-outdoor-remodel.avif` | 1250x703 | 593x450 | 2.11x | 2447.7 | 0.194 |
| `/images/cliente/meith-driveway-2.avif` | 1250x703 | 593x450 | 2.11x | 1972.3 | 0.113 |
| `/images/cliente/pavers.avif` | 1250x703 | 593x450 | 2.11x | 1757.8 | 0.143 |
| `/images/custom-aluminum-patio-cover-pergola-quote-south-florida.avif` | 1600x2000 | 576x1180 | 2.78x | 3781.6 | 0.159 |
| `/images/custom-driveway-construction-south-florida-p-500.avif` | 500x500 | 326x265 | 1.53x | 2737.7 | 0.278 |
| `/images/custom-driveway-construction-south-florida.avif` | 650x650 | 292x257 | 2.23x | 4027.3 | 0.191 |
| `/images/custom-pergola-design-construction-south-florida-p-500.avif` | 500x500 | 326x309 | 1.53x | 2143.4 | 0.251 |
| `/images/custom-pergola-design-construction-south-florida.avif` | 650x650 | 292x764 | 2.23x | 2958.3 | 0.164 |
| `/images/miami-dade-hurricane-rated-pergola-outdoor-living-contractor-p-500.avif` | 500x500 | 326x1024 | 1.53x | 2497.9 | 0.271 |
| `/images/miami-dade-hurricane-rated-pergola-outdoor-living-contractor.avif` | 1024x1024 | 609x1024 | 1.68x | 3558.0 | 0.148 |
| `/images/palm-beach-county-luxury-pergola-outdoor-living-contractor-p-500.avif` | 500x500 | 326x1024 | 1.53x | 3461.7 | 0.380 |
| `/images/palm-beach-county-luxury-pergola-outdoor-living-contractor.avif` | 1024x1024 | 609x1024 | 1.68x | 5117.1 | 0.232 |
| `/images/patio-remodeling-contractor-south-florida.avif` | 650x650 | 326x263 | 1.99x | 1591.3 | 0.111 |
| `/images/residential-fence-installation-south-florida-p-500.avif` | 500x500 | 326x265 | 1.53x | 1843.0 | 0.235 |
| `/images/residential-fence-installation-south-florida.avif` | 650x650 | 292x238 | 2.23x | 6334.3 | 0.343 |

</details>
