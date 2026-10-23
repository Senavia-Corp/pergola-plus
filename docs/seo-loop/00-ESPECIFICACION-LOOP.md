# Loop de optimización SEO · GEO · AEO · AIO (sitio + Sanity)

**Rama:** `seo/loop-optimizacion` (worktree `/Users/senavia/Sites/pp-loop`), desde `main` `6b69618`.
**Punto de partida:**
- `implementation-reports/ENTREGA-2026-10/08-AUDITORIA-SEO-FINAL.md`: backlog T1–T20, C1–C12 y L1–L7;
- `08-anexo-titulos.md`: los 218 títulos, descripciones y H1;
- `docs/blog-seo-2026-10/` (06: GEO, AEO y AIO del blog);
- `01-REGISTRO-PETICIONES-CLIENTE.md`: lo que el cliente pidió.

Antes de nada se lee `~/Sites/CLAUDE.md` y su tabla de enrutado (skills `seo`, `frontend-design` y `make-interfaces-feel-better` cuando toque lo visible).

## 0. Decisiones tomadas en el chat (23-oct-2026)

| Tema | Decisión |
|---|---|
| Escrituras en Sanity | **Una Content Release** sin publicar: «SEO loop 2026-10». Si el plan Free no admite Releases, borradores `drafts.*`. Publica Senavia o el cliente, nunca el loop |
| Datos del negocio | **Solo fuentes públicas y verificables, citadas.** Lo que dependa del cliente se marca pendiente y no se inventa |
| Estructura | Se permiten páginas nuevas o fusionadas con 301, **siempre en la Release**. Los slugs que existen no se tocan (`/countries/` incluido) |
| Keywords | **Ahrefs**, con volumen y dificultad EN/ES de Florida. Hay que autorizarlo con `/mcp` antes de lanzar |
| Código | Rama + commits. **Se fusiona en `main` si el juez independiente pasa** (y el deploy de producción, que sigue cerrado, sale en READY) |
| Diseño visible | Se permite, con capturas antes/después en el PR, **excepto en lo que el cliente pidió** (registro 01 §1). Ahí se deja su versión y se documenta el coste SEO |
| Español | De Florida, con los anglicismos de uso: concreto, cerca, auto, Contáctenos, celular, Boca Raton; y se quedan en inglés pavers, screen enclosure, carport, driveway y HOA |
| Rastreadores de IA | **Se permiten también los de entrenamiento** (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, meta-externalagent). `/api/` sigue bloqueado. Bytespider queda bloqueado: no tiene documentación oficial |

## 1. Fuera del loop (no se tocan, ni para «dejarlo preparado»)

1. Formularios y canal de entrega (`SMTP_*`, `LEAD_WEBHOOK_URL`, `src/lib/lead.ts`).
2. Analítica, GTM, GA4, Google Ads y Consent Mode, y su CSP.
3. Configuración de Vercel del día del lanzamiento: dominio, `PUBLIC_SITE_URL`, `PUBLIC_ES_PRODUCCION`, Deployment Protection.
4. La política de privacidad (`legalPage-privacy-policy`, `docs/politica-privacidad-borrador.md`).
5. Los términos y condiciones en EN y ES (`legalPage-terms-of-service`, `src/i18n/articulos.es.ts`).
6. `TURNSTILE_SECRET_KEY`. La carga diferida del widget (T13) sí entra: es código y no toca el secreto.

Además, el loop **nunca**:
- publica una Release ni un documento de Sanity;
- crea, cambia ni borra webhooks, tokens, miembros o CORS;
- cambia variables de entorno de Vercel;
- hace push forzado ni reescribe la historia.

## 2. Papeles (tres, separados)

| Papel | Quién | Hace | No puede |
|---|---|---|---|
| **Auditor** (plan) | El agente principal del loop | Mide con scripts y escribe `03-BACKLOG.md`: una fila por fallo, con su medida y la puerta que lo comprueba | Cambiar las puertas una vez fijadas en la fase 0 |
| **Implementador** (build) | Subagente o el principal, en su turno | Corrige las filas del backlog: código en la rama y contenido en la Release | Editar puertas, umbrales, ficheros fijados (§3), el registro del cliente o la lista de vacíos permitidos |
| **Juez** (judge) | **Subagente nuevo en cada iteración**, sin el contexto del implementador | Ejecuta `node scripts/seo-loop/juez.mjs` y nada más. Devuelve el JSON del script tal cual | Editar ficheros. Opinar «se ve bien». El código de salida manda |

## 3. Ficheros fijados por SHA-256 (los firma un humano en la fase 0)

Están en `docs/seo-loop/HASHES.txt`. El juez falla si alguno cambia sin una línea nueva firmada por Sebastian.

- `docs/seo-loop/01-REGISTRO-PETICIONES-CLIENTE.md`
- `docs/seo-loop/02-VACIOS-PERMITIDOS.json`: los campos de Sanity que pueden quedar vacíos, con su motivo (la tabla C9 del informe 06)
- `docs/seo-loop/04-MAPA-KEYWORDS.json`: una keyword principal por URL, con volumen y dificultad de Ahrefs, en EN y ES
- `docs/seo-loop/glosario-es-florida.json`
- `scripts/seo-loop/juez.mjs` y las puertas nuevas de `scripts/seo-loop/`
- Las 26 puertas de `package.json` y sus scripts: **no se pueden debilitar** (umbrales, listas de excepciones ni `continue` nuevos)

## 4. Objetivo decidible (el juez pasa = 0 en todas las filas)

### 4.1 Lo que ya existe (no puede empeorar)

| # | Comprobación | Condición |
|---|---|---|
| J1 | `npm run check` (producción, `PUERTO_FORMULARIOS` libre) | 26/26, exit 0 |
| J2 | `PP_FUENTE=sanity npm run build` + `check:noindex` (modo cerrado) | Verde |
| J3 | `node scripts/perf/crawl.mjs` | 0 en las 15 métricas de fallo |
| J4 | Las 64 URL antiguas (`check:urls-antiguas`) | 64/64, un salto |

### 4.2 Puertas nuevas (las escribe el auditor en la fase 0 y las fija un humano)

| # | Puerta | Condición de verde | Origen |
|---|---|---|---|
| J5 | `check:seo-estricto` | Todo `<title>` indexable de 30–60 caracteres; descripción de 110–160; un H1; **la keyword de `04-MAPA-KEYWORDS.json` en el title y en la descripción**, y en el H1 salvo las URL con excepción en el registro (R1, R8); «South Florida», FL, una ciudad o un condado en el title o la descripción (R6); `og:image:alt` en el idioma de la página; 0 títulos duplicados | C1, C2, C8, T10, R6 |
| J6 | `check:sanity-completo` | Todo campo del esquema rellenado en publicado **+ Release**, salvo `02-VACIOS-PERMITIDOS.json`; `alt.es` ≠ `alt.en`; `seo.indexable` coherente con el `noindex` del build | C8, C9, T2 |
| J7 | `check:jsonld-google` | validator.schema.org (API `POST /validate`) con 0 errores y 0 avisos en una URL de cada plantilla; 0 `Product` sin `offers`, `review` o `aggregateRating`; `dateModified` ≥ `datePublished`; 0 `aggregateRating` o `review` propios; NAP del JSON-LD = `siteSettings` | T4, T11, T12 |
| J8 | `check:silo` | Cada condado enlaza a todas sus ciudades; cada ciudad, a su condado; migas Home › Where We Work › Condado › Ciudad; ninguna página indexable con menos de 3 enlaces entrantes; profundidad ≤ 3 | T3 |
| J9 | `check:lastmod` | El `lastmod` del sitemap ≤ el `_updatedAt` de contenido del documento; el de los posts, igual a `dateModified` | T5 |
| J10 | `check:es-florida` | 0 apariciones de los términos prohibidos del glosario en el texto visible de `/es/`; «Boca Raton» sin tilde | C3 |
| J11 | `check:geo` | `llms.txt` con todas las URL indexables y el NAP de `siteSettings`; `robots.txt` según §0; `sameAs` ≥ 4; la entidad igual en EN y ES; cada post con autor, fecha y al menos una fuente oficial enlazada (`.gov` o el condado) en los de normativa | GEO, C7 |
| J12 | `check:aeo` | Cada ficha, servicio, ciudad y condado tiene al menos una pregunta H2 o H3 con respuesta de ≤ 60 palabras en el primer párrafo; FAQPage solo con preguntas visibles; 0 FAQ duplicadas entre páginas | AEO |
| J13 | `check:contenido-local` | Cada ciudad indexable con ≥ 150 palabras propias (shingles que no están en ninguna otra ciudad) **con al menos una cita a fuente pública** o un proyecto propio enlazado; Jaccard medio entre ciudades < 0,70; 0 heroes `wf-placeholder` | C5, C6 |
| J14 | `check:canibalizacion` | Ninguna keyword principal de `04-MAPA-KEYWORDS.json` es la de 2 URL indexables | C4 |
| J15 | Lighthouse ×3 (16 plantillas × móvil y escritorio, local, `servir.mjs`) | Mediana: A11y, BP y SEO = 100 (contacto: BP 96 por Turnstile en localhost); Perf **no baja** frente a la línea base de la fase 0 (−1 como máximo en móvil por ruido); CLS = 0. Las corridas con `rtt` > 0,1 se repiten; si siguen así, se marcan y no cuentan | T13, T14 |
| J16 | Registro del cliente | 0 diferencias en los elementos de §1 del registro frente a la línea base (H1 de la home, menú, nombres, slugs y NAP) | R1–R13 |
| J17 | Fuera del loop | `git diff main --stat` sin tocar `src/lib/lead.ts`, `api/lead.ts`, los legales ni la CSP de analítica. 0 cambios en las variables de Vercel. 0 Releases publicadas | §1 |

**Done** = J1–J17 en verde en dos corridas seguidas del juez, el PR fusionado y la Release preparada, con `06-INFORME-FINAL.md` escrito.

## 5. Fases (en este orden; cada una cierra con el juez)

| Fase | Contenido | Escribe en |
|---|---|---|
| **F0 · Línea base y puertas** | `npm ci`; build de producción y cerrado; Lighthouse ×3 de línea base; foto del dataset (`npx sanity dataset export`); comprobar si hay Releases (`client.releases.create` de prueba, archivarla después); **escribir J5–J17**, `02-VACIOS-PERMITIDOS.json`, el glosario y el mapa de keywords con Ahrefs. **Se para aquí** hasta que Sebastian firme `HASHES.txt` | Rama |
| **F1 · Técnico** | T1 (puertas en el build de Vercel), T2, T3, T4, T5, T10, T11, T12, T16 (vista previa SERP y tipo `redirect`), T17, T18 y T13/T14 (si no rompen J15); robots de IA según §0; `PP_PERSPECTIVA=<releaseId>` en `scripts/sanity/instantanea.mjs` (por defecto, publicado) para construir y juzgar con el contenido de la Release | Rama |
| **F2 · Textos SEO** | C1, C2 (salvo R1 y R8) y C8 con el mapa de keywords: `seo.titulo`, `seo.descripcion`, H1 y alt del og (C9) | Release |
| **F3 · Español de Florida** | C3 con el glosario, en Sanity (`texto.es`, `faq`, `post.cuerpo.es`) y en `src/i18n/*.es.ts` | Release + rama |
| **F4 · Entidad y E-E-A-T** | Solo lo firme del registro §2: `sameAs` (ficha de Google y BBB), `image` y `logo`. `hasCredential`, autor de los posts y NAP quedan pendientes del cliente (en conflictos) | Rama + Release |
| **F5 · Contenido local y estructura** | C5 con fuentes públicas citadas: permisos del municipio, HVHZ de Miami-Dade y Broward (Florida Building Code), proyectos propios de la ciudad o el condado. C6: el hero de Coral Springs con una foto real del cliente (de `public/photos/` o del Drive; si no hay, pendiente). C4: fusionar posts con 301. C10: Pompano Beach y Riviera Beach (hay proyecto) y una página de patio covers. Coral Gables (el cliente dice que no la trabaja): **propuesta**, no cambio | Release + rama (301) |
| **F6 · GEO / AEO / AIO** | `llms.txt` ampliado (y `llms-full.txt` si hace falta), bloques de respuesta directa (J12), FAQ sin duplicados, entidades y citas en los posts (siguiendo `docs/blog-seo-2026-10/06`), datos estructurados coherentes | Release + rama |
| **F7 · Cierre** | Dos corridas limpias del juez; PR y fusión; `05-CONFLICTOS-SEO-CLIENTE.md` y `06-INFORME-FINAL.md`; **borrador** (sin enviar) del correo a Daniel con los conflictos y las preguntas pendientes | Rama |

## 6. Protocolo de escritura en Sanity

1. Antes de cada tanda: `npx sanity dataset export production /Users/senavia/Sites/pp-exports/loop-AAAA-MM-DD-NN.tar.gz --no-assets`, y su SHA-256 en la iteración.
2. Escribir **solo** versiones de la Release (`versions.<releaseId>.<id>`) o, si no hay Releases, `drafts.<id>`. Nunca el documento publicado.
3. Después de la tanda: `npx sanity hook logs "Vercel producción · main"` → 0 entregas nuevas. Si hay alguna, se para el loop: algo publicó.
4. Los assets nuevos (fotos) se suben con `origen` y `procedencia` reales. Nunca imágenes de IA (R5).
5. Ningún documento editado por una persona después de la última escritura del loop se sobrescribe: se compara `_updatedAt` y se anota.

## 7. Amortiguación

- **Máximo 3 iteraciones sin progreso por fase:** el progreso es que baje el número de fallos del juez. A la tercera, se para y escribe en `07-BLOQUEOS.md` qué hace falta.
- **Máximo 12 iteraciones en total**, o 2 días de reloj.
- Un fallo que exige un dato del cliente no se itera: va directo a conflictos o bloqueos.
- **Una sola tarea pesada a la vez:** nada de Lighthouse con un build o con Playwright en paralelo. El puerto de formularios es 4351 (el 4341 lo puede tener ocupado otra sesión: comprobar con `lsof`).
- **Secretos:** no imprimir ni guardar tokens ni URL de hooks.

## 8. Lo que decide un humano

- Firmar `HASHES.txt` en la fase 0: puertas, mapa de keywords, glosario y vacíos permitidos.
- Publicar la Release, después de revisarla en el Studio.
- Responder a `05-CONFLICTOS-SEO-CLIENTE.md` y enviar el correo a Daniel.
- Todo lo de §1.
