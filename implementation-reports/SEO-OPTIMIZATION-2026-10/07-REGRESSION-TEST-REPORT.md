# 07 — Pruebas de regresión

Estados: PASS / FAIL / BLOCKED / NOT_RUN / NOT_APPLICABLE. Todo medido en local sobre `dist/client` (servidor estático propio con gzip). Nada medido sobre Vercel después de los cambios porque no se ha desplegado.

## 1. Puertas del repositorio (`npm run check:*`)

| Puerta | Baseline (preview) | Después (preview) | Después (producción simulada) |
|---|---|---|---|
| blog, enlaces, carruseles, marquee, animaciones, cta, estimador, paridad, formularios, i18n, seo, paginas, resenas, iconos, ritmo, correo | PASS ×16 | PASS ×16 | PASS ×16 |
| imagenes | PASS | PASS (tras versionar los 48 derivados, el poster, el vídeo móvil y jQuery) | PASS |
| noindex | PASS (modo provisional) | PASS (modo provisional, regla nueva: robots rastreable + 217 `noindex` + sin sitemap/RSS) | PASS (modo producción: 4 `noindex` a propósito, 213 en sitemap, ninguna de las 4 en él) |
| generadores | PASS | FAIL esperado mientras hay cambios sin comitear («la salida generada tiene cambios sin comitear: no se puede comparar») | ver §7 (se ejecuta tras el commit) |

Comandos exactos: `npm run build` (preview) · `PUBLIC_ES_PRODUCCION=1 PUBLIC_SITE_URL=https://www.pergolaplusflorida.com npm run build` (producción simulada) · `npm run -s check:<nombre>` con el mismo entorno. Logs en scratchpad `baseline/`, `after/`, `prod/`.

Fallos preexistentes: ninguno (las 19 pasaban en el baseline). Fallos nuevos: ninguno al cierre.

## 2. Sonda funcional (Playwright, Chromium 1.62) — 8 rutas × 3 anchos

Rutas: `/`, `/products/cabanas/`, `/services/pavers/`, `/pergolas-contractors/miami-pergola-experts/`, `/post/hoa-rules-pergolas-south-florida/`, `/es/`, `/contact-us/get-a-quote/`, `/resources/blog/`. Anchos: 375, 768, 1440. Por ruta y ancho: un único H1, sin desbordamiento horizontal, 5 dropdowns presentes, menú móvil (<992 px) abre con `w--open`, pone `inert` a los 10 hermanos del nav y cierra con Escape; dropdown de escritorio abre (`w--open`) y cierra con Escape; estado del vídeo; medidas de imágenes; consola.

| Comprobación | Baseline | Después |
|---|---|---|
| H1 único, sin overflow, dropdowns=5 | 24/24 PASS | 24/24 PASS |
| Menú móvil abre + inert + Escape (375/768) | 16/16 PASS | 16/16 PASS |
| Dropdown escritorio abre + Escape (1440) | 8/8 PASS | 8/8 PASS |
| Vídeo del hero (EN/ES, 3 anchos) | `poster` null, reproduce, `_mp4.mp4` siempre | `poster` AVIF, reproduce tras `load` desde el fotograma 0; `_movil.mp4` a 375, `_mp4.mp4` a 768/1440 |
| Scripts | jQuery CloudFront + webflow.js sin defer | `/js/jquery-3.5.1.min.js defer`, `webflow.js defer` |
| Fotos del cliente en la home | 2500 px en cajas de 343/360/643 | derivado 640 a 375 px, 960 a 1440 px (`srcset`) |
| Consola limpia | 7/8 rutas (la excepción es `/contact-us/get-a-quote/`: challenge de Turnstile en headless, 11–13 avisos ajenos al sitio) | idéntico |

Sonda FINAL sobre el build de producción simulada (tras la portada eager de las fichas, el índice del blog y el formulario): 24/24 rutas×anchos PASS en H1/overflow/dropdowns, 16/16 menú móvil, 8/8 dropdown escritorio, vídeo con `poster` y reproduciendo en EN/ES a los 3 anchos (`_movil.mp4` a 375), `srcset` eligiendo 640/960/1280 según ancho (`/products/cabanas/` a 1440: natural 1241 px, antes 1250 sin elección), consola limpia en 7/8 rutas (la 8.ª, el formulario, con los mismos avisos de Turnstile). Capturas en scratchpad `shots/final`.

## 3. Diferencia visual (capturas 375/768/1440, antes vs después, umbral 24/255 por canal)

| Ruta | 375 | 768 | 1440 | Lectura |
|---|---:|---:|---:|---|
| `/` | 0,34 % | 8,68 % | 0,73 % | fotograma del vídeo distinto en cada captura + marquee en movimiento; layout idéntico (revisado a ojo) |
| `/es/` | 0,95 % | 8,54 % | 13,79 % | ídem |
| `/services/pavers/` | 0,19 % | 0,46 % | 1,01 % | remuestreo de las fotos del cliente al derivado del `srcset` |
| producto, ciudad, post, presupuesto, blog | 0,00 % | 0,00 % | 0,00 % | sin cambio |

Capturas en scratchpad `shots/baseline` y `shots/after` (no versionadas por peso).

## 4. Formularios y leads (mocks, sin envíos reales)

Prueba `scratchpad/leads/prueba-lead.mjs` sobre `src/lib/lead.ts` con un servidor HTTP local como webhook y sin SMTP, en un cwd sin permiso de escritura (como Vercel):

| Caso | Resultado |
|---|---|
| Con webhook → `ok:true`, `webhook:true` | PASS |
| El webhook recibe el lead completo (es la entrega) | PASS |
| stdout/stderr sin ninguno de los 4 marcadores de PII (nombre, email, teléfono, mensaje) | PASS |
| La línea `LEAD` lleva `id` UUID de correlación y los NOMBRES de campo | PASS |
| Sin ningún canal → `ok:false` (el endpoint responderá 500) | PASS |
| `ERROR_ENTREGA` sin datos del visitante | PASS |
| `check:correo` («entregarLead no miente», plantillas EN/ES, entrada hostil) | PASS |
| Entrega real por SMTP/webhook de producción | **BLOCKED** (sin credenciales; nunca se envían leads de prueba a destinatarios reales) |
| Turnstile con clave real | **BLOCKED** (sin `TURNSTILE_SECRET_KEY`; el markup de `quote` y `contact` ya lleva el widget y el endpoint falla cerrado con la clave puesta) |
| POST sin JS (303 a `/thank-you` o `/es/thank-you`) y con JS (JSON) | NOT_RUN en esta fase (lógica sin cambios; cubierto por `check:formularios` y `check:estimador`) |

## 5. Accesibilidad

Lighthouse Accessibility: 100 escritorio en todas las corridas; **97 móvil** en las corridas locales por `color-contrast` sobre `.product-card-h3`/`.product-card-text` (fondo medido `#3d565d`). Causa: la entrada por scroll (`src/styles/animaciones.css`, `animation-timeline: view()`, rango `entry 0% → entry 60%`) deja a las tarjetas que cruzan el borde del viewport con opacidad intermedia en el instante en que axe mide, y el texto se funde con la banda oscura de detrás. No es un color del diseño (la tarjeta es crema sobre texto `--primary`, 7,8:1 en reposo); en la auditoría sobre Vercel dio 100 por milímetros de layout. Opciones si se quiere 100 estable: acortar el rango a `entry 0% entry 30%` (menos ventana) o quitar el fundido a las tarjetas con texto y dejar solo la subida. No se ha tocado: es una decisión de diseño de movimiento, no un defecto de accesibilidad real.

## 6. Lighthouse

Ver `03-BEFORE-AFTER-LIGHTHOUSE.csv` (todas las corridas) y `04-CORE-WEB-VITALS-REPORT.md`.

## 7. `check:generadores` tras el commit

Commit local `e467755` y después `npm run check:generadores`: **PASS** — «regenerar no cambia nada (0 ficheros divergen)», los generadores leen solo del repo y `docs/vivo` tiene las 100 capturas. Con esto las **19/19 puertas** están en verde sobre el estado comiteado.
