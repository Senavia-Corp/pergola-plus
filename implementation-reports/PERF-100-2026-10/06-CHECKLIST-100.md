# 06 — Checklist «100» (§2 del encargo), medido sobre el build final

Fuente: `08-f8/lighthouse-medianas.csv` (Lighthouse 13.5 ×3 por combinación, mediana; entre paréntesis las 3 corridas, nunca la mejor). Build de producción simulada servido por `scripts/perf/servir.mjs` con las cabeceras de `config.json`; Chrome headless sin extensiones.

| Plantilla | Disp. | Perf (3) | objetivo | A11y (3) | BP | SEO | LCP ms (3) | CLS máx (3) | TBT máx | KB | Veredicto |
|---|---|---|---|---|---|---|---|---|---|---|---|
| blog-categoria | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 602 (704/573/602)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 569  | PASS |
| blog-categoria | mobile | 95 (95/95/95) PASS | ≥95 (100 deseado) | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2920 (2886/2921/2920) **FAIL** | 0.000 (0.000/0.000/0.000) PASS | 9 PASS | 528 PASS | **FAIL** |
| blog-indice | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 594 (573/594/604)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 588  | PASS |
| blog-indice | mobile | 95 (95/95/93) PASS | ≥95 (100 deseado) | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2920 (2888/2920/3088) **FAIL** | 0.000 (0.000/0.000/0.000) PASS | 9 PASS | 528 PASS | **FAIL** |
| ciudad | desktop | 99 (99/99/99) **FAIL** | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 923 (943/923/923)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 824  | **FAIL** |
| ciudad | mobile | 95 (95/94/95) PASS | ≥95 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2929 (2922/3039/2929) **FAIL** | 0.000 (0.000/0.000/0.000) PASS | 12 PASS | 698 PASS | **FAIL** |
| condado | desktop | 99 (100/99/99) **FAIL** | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 823 (803/823/843)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 685  | **FAIL** |
| condado | mobile | 92 (92/92/91) **FAIL** | ≥95 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 3378 (3378/3378/3453) **FAIL** | 0.000 (0.000/0.000/0.000) PASS | 23 PASS | 690 PASS | **FAIL** |
| contacto-quote | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 96 PASS | 100 PASS | 542 (542/542/532)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 1148  | PASS |
| contacto-quote | mobile | 98 (98/98/98) PASS | ≥95 | 100 (100/100/100) PASS | 96 PASS | 100 PASS | 2437 (2435/2437/2468) PASS | 0.000 (0.000/0.000/0.000) PASS | 7 PASS | 1148 **FAIL** | **FAIL** |
| estimador | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 573 (572/573/575)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 452  | PASS |
| estimador | mobile | 96 (96/96/96) PASS | ≥95 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2736 (2810/2736/2736) **FAIL** | 0.000 (0.000/0.000/0.000) PASS | 19 PASS | 452 PASS | **FAIL** |
| faq | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 408 (409/408/402)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 242  | PASS |
| faq | mobile | 99 (98/99/99) PASS | ≥95 (100 deseado) | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 1803 (2292/1803/1803) PASS | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 242 PASS | PASS |
| galeria | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 561 (553/652/561)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 834  | PASS |
| galeria | mobile | 96 (96/96/93) PASS | ≥95 (100 deseado) | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2735 (2735/2733/3115) **FAIL** | 0.000 (0.000/0.000/0.000) PASS | 22 PASS | 545 PASS | **FAIL** |
| home | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 609 (609/609/589)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 1290  | PASS |
| home | mobile | 95 (95/95/95) PASS | ≥95 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 3003 (3003/3003/3003) **FAIL** | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 638 PASS | **FAIL** |
| home-es | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 657 (680/657/656)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 1291  | PASS |
| home-es | mobile | 95 (95/95/95) PASS | ≥95 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 3004 (3004/2947/3004) **FAIL** | 0.000 (0.000/0.000/0.000) PASS | 10 PASS | 639 PASS | **FAIL** |
| post | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 565 (552/565/566)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 305  | PASS |
| post | mobile | 97 (97/96/97) PASS | ≥95 (100 deseado) | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2513 (2513/2596/2511) **FAIL** | 0.000 (0.000/0.000/0.000) PASS | 22 PASS | 271 PASS | **FAIL** |
| producto | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 643 (643/643/643)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 550  | PASS |
| producto | mobile | 96 (96/94/96) PASS | ≥95 (100 deseado) | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2743 (2743/2977/2740) **FAIL** | 0.000 (0.000/0.000/0.000) PASS | 28 PASS | 460 PASS | **FAIL** |
| productos-indice | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 563 (563/554/652)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 784  | PASS |
| productos-indice | mobile | 96 (96/94/96) PASS | ≥95 (100 deseado) | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2812 (2812/3030/2809) **FAIL** | 0.000 (0.000/0.000/0.000) PASS | 17 PASS | 494 PASS | **FAIL** |
| proyecto | desktop | 99 (99/99/99) **FAIL** | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 843 (823/843/843)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 688  | **FAIL** |
| proyecto | mobile | 95 (95/95/95) PASS | ≥95 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2886 (2886/2886/2885) **FAIL** | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 457 PASS | **FAIL** |
| servicio | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 573 (575/573/573)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 869  | PASS |
| servicio | mobile | 95 (95/95/95) PASS | ≥95 (100 deseado) | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2890 (2892/2889/2890) **FAIL** | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 762 PASS | **FAIL** |
| servicios-indice | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 631 (554/632/631)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 752  | PASS |
| servicios-indice | mobile | 96 (96/96/96) PASS | ≥95 (100 deseado) | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2809 (2735/2809/2811) **FAIL** | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 533 PASS | **FAIL** |

**14 de 32 combinaciones cumplen todos los criterios; 18 no.**

Criterios aplicados (§2): Perf móvil ≥ 95 (100 deseado en producto, servicio, post, FAQ e índices), escritorio 100; Accessibility 100 en las 3 corridas; BP 100 (contacto 96 aceptado por Turnstile en localhost); SEO 100; LCP móvil ≤ 2,5 s; CLS ≤ 0,01 en todas las corridas; TBT móvil ≤ 50 ms y escritorio 0; peso antes de `load` móvil: home ≤ 1,2 MB, estimador ≤ 0,8 MB, resto ≤ 1,0 MB (`total-byte-weight` de la traza).
