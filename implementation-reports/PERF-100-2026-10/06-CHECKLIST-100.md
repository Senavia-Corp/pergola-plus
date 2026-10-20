# 06 — Checklist «100» (§2 del encargo), medido sobre el build final

Fuente: `09-f7/lighthouse-medianas.csv` (Lighthouse 13.5 ×3 por combinación, mediana; entre paréntesis las 3 corridas, nunca la mejor). Build de producción simulada servido por `scripts/perf/servir.mjs` con las cabeceras de `config.json`; Chrome headless sin extensiones.

| Plantilla | Disp. | Perf (3) | objetivo | A11y (3) | BP | SEO | LCP ms (3) | CLS máx (3) | TBT máx | KB | Veredicto |
|---|---|---|---|---|---|---|---|---|---|---|---|
| blog-categoria | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 503 (503/504/502)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 473  | PASS |
| blog-categoria | mobile | 98 (98/98/98) PASS | ≥95 (100 deseado) | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2403 (2403/2403/2402) PASS | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 431 PASS | PASS |
| blog-indice | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 483 (484/483/463)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 492  | PASS |
| blog-indice | mobile | 99 (99/99/99) PASS | ≥95 (100 deseado) | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2253 (2179/2261/2253) PASS | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 432 PASS | PASS |
| ciudad | desktop | 99 (99/99/99) **FAIL** | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 864 (866/864/863)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 731  | **FAIL** |
| ciudad | mobile | 97 (97/96/97) PASS | ≥95 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2629 (2629/2702/2629) **FAIL** | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 605 PASS | **FAIL** |
| condado | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 743 (743/744/743)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 592  | PASS |
| condado | mobile | 93 (93/94/93) **FAIL** | ≥95 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 3154 (3155/3079/3154) **FAIL** | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 596 PASS | **FAIL** |
| contacto-quote | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 96 PASS | 100 PASS | 425 (403/602/425)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 1057  | PASS |
| contacto-quote | mobile | 99 (95/99/99) PASS | ≥95 | 100 (100/100/100) PASS | 96 PASS | 100 PASS | 1802 (2852/1802/1802) PASS | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 1072 **FAIL** | **FAIL** |
| estimador | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 484 (483/499/484)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 356  | PASS |
| estimador | mobile | 99 (98/99/99) PASS | ≥95 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2178 (2491/2178/2178) PASS | 0.013 (0.013/0.000/0.000) **FAIL** | 6 PASS | 356 PASS | **FAIL** |
| faq | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 402 (402/402/402)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 146  | PASS |
| faq | mobile | 100 (100/100/100) PASS | ≥95 (100 deseado) | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 1652 (1652/1652/1576) PASS | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 146 PASS | PASS |
| galeria | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 581 (424/581/583)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 738  | PASS |
| galeria | mobile | 99 (99/99/96) PASS | ≥95 (100 deseado) | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2028 (1954/2028/2705) PASS | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 449 PASS | PASS |
| home | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 602 (603/587/602)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 798  | PASS |
| home | mobile | 94 (95/94/94) **FAIL** | ≥95 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 3003 (3005/3003/3003) **FAIL** | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 542 PASS | **FAIL** |
| home-es | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 603 (604/603/603)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 799  | PASS |
| home-es | mobile | 95 (95/95/95) PASS | ≥95 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2928 (2928/2928/2928) **FAIL** | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 543 PASS | **FAIL** |
| post | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 483 (483/484/462)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 209  | PASS |
| post | mobile | 99 (99/99/99) PASS | ≥95 (100 deseado) | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 1878 (1879/1878/1878) PASS | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 174 PASS | PASS |
| producto | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 643 (643/644/642)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 456  | PASS |
| producto | mobile | 98 (99/98/98) PASS | ≥95 (100 deseado) | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2253 (2180/2254/2253) PASS | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 366 PASS | PASS |
| productos-indice | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 423 (423/423/423)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 687  | PASS |
| productos-indice | mobile | 99 (99/99/99) PASS | ≥95 (100 deseado) | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2027 (2027/1959/2028) PASS | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 398 PASS | PASS |
| proyecto | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 764 (764/763/771)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 594  | PASS |
| proyecto | mobile | 97 (97/97/97) PASS | ≥95 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2629 (2630/2629/2553) **FAIL** | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 363 PASS | **FAIL** |
| servicio | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 484 (484/484/483)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 775  | PASS |
| servicio | mobile | 98 (98/98/98) PASS | ≥95 (100 deseado) | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2403 (2329/2403/2403) PASS | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 668 PASS | PASS |
| servicios-indice | desktop | 100 (100/100/100) PASS | ≥100 | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 522 (425/523/522)  | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 656  | PASS |
| servicios-indice | mobile | 99 (99/99/99) PASS | ≥95 (100 deseado) | 100 (100/100/100) PASS | 100 PASS | 100 PASS | 2027 (2027/2027/2177) PASS | 0.000 (0.000/0.000/0.000) PASS | 0 PASS | 437 PASS | PASS |

**24 de 32 combinaciones cumplen todos los criterios; 8 no.**

Criterios aplicados (§2): Perf móvil ≥ 95 (100 deseado en producto, servicio, post, FAQ e índices), escritorio 100; Accessibility 100 en las 3 corridas; BP 100 (contacto 96 aceptado por Turnstile en localhost); SEO 100; LCP móvil ≤ 2,5 s; CLS ≤ 0,01 en todas las corridas; TBT móvil ≤ 50 ms y escritorio 0; peso antes de `load` móvil: home ≤ 1,2 MB, estimador ≤ 0,8 MB, resto ≤ 1,0 MB (`total-byte-weight` de la traza).
