# 11 — Contenido y accesos pendientes de verificación

Nada de esta lista se ha publicado ni redactado: son los datos que harían falta y la fuente que los tiene que confirmar. Marcados **CONTENT BLOCKED: VERIFICATION REQUIRED**.

## A. SEO local (GH-008, LOCAL-001)

Para cada una de las 25 ciudades (y 3 condados), rellenar antes de escribir una línea:

| Campo | Quién lo confirma | Para qué |
|---|---|---|
| Proyectos ejecutados en el municipio (slug del proyecto existente o fotos nuevas con dirección aproximada) | Pergola Plus (Daniel) | Sustituir el carrusel genérico de 13 proyectos por los del municipio/condado |
| Permiso municipal / HOA típicos de la ciudad (enlace oficial del municipio o condado) | Pergola Plus + fuente oficial | Un párrafo útil por ciudad, con cita |
| Plazo medio y particularidades (zona costera, viento, HVHZ en Miami-Dade/Broward) | Pergola Plus | Diferenciar costa de interior sin inventar normativa |
| Preguntas reales que llegan de esa zona | Pergola Plus (formularios, llamadas) | FAQ local genuina, no plantilla |

Hoy: 25 páginas con ~75 % de texto compartido y los mismos 13 proyectos. Sin estos datos, la recomendación es **no crear más páginas de ciudad** y valorar consolidar en el condado las que no tengan un solo proyecto verificable.

## B. Entidad y confianza

| Dato | Estado | Fuente |
|---|---|---|
| Número de licencia de contratista (el copy dice «Licensed» 200+ veces) | NO VERIFICADO | DBPR Florida; publicarlo en pie y contacto y en JSON-LD solo si se confirma |
| Google Business Profile (ficha, categoría, reseñas) | NO VERIFICADO | Cuenta dueña del perfil; `scripts/traer-resenas.mjs` ya está preparado |
| Horario L–V 08:00–17:00 y dirección 980 N Federal Hwy, Boca Raton | Publicado en el sitio; sin contraste externo | GBP |
| Marcas distribuidas (Apollo, Equinox, Fenetex, Renaissance) | Publicadas; sin acuerdo que las acredite en el repo | Pergola Plus |

## C. Página sin traducir

`/articles/terms-of-service/` es la única ruta inglesa sin gemela `/es/`. La traducción legal la tiene que validar el cliente (texto contractual); el aviso de la home ES ya lo dice tal cual.

## D. Blog e imágenes

- `docs/prompt-blog-imagenes-seo.md` y `public/photos/` (1,6 GB, sin seguimiento en git) son el material del cliente para sustituir imágenes del blog por fotos reales: fuera del alcance de esta fase, no se han tocado.
- Aviso de `check:imagenes`: 174 imágenes del CMS (28,1 MB) ya no las pide ninguna página. Borrarlas es decisión editorial (son el histórico de Webflow).
- `public/cms-img/products/cabanas/hero-custom-poolside-cabana-south-florida.avif` (317 KB a 1250 px) está poco comprimido y Lighthouse estima 260 KB de ahorro; no se recodificó porque su hash lo fija el manifest de la migración (`check:imagenes`). Candidato a regenerar desde el original del cliente.

## D bis. Portada que falta

`/pergolas-contractors/coral-springs-installation/` (y su gemela `/es/`) tiene como imagen de hero el marcador `/images/wf-placeholder.svg`: el CMS de Webflow no traía portada para esa ciudad. Hace falta una foto real de proyecto (Coral Springs o Broward) del cliente; hasta entonces el hero de esa página es un cuadro gris.

## E. Accesos que faltaron para cerrar comprobaciones

| Acceso | Qué habría cerrado |
|---|---|
| Google Search Console del dominio definitivo | Cobertura, estado de indexación real, CWV de campo (CWV-001: **NO DATA**) |
| CrUX | p75 LCP/INP/CLS reales (hoy el dominio sirve Webflow, no este sitio) |
| GA4/GTM | CRO-001: no hay ningún tag de analítica en el repo; no hay eventos de conversión que auditar. Si se añade, un solo evento por envío confirmado (respuesta 200/303 del endpoint), no por visita |
| Credenciales SMTP/webhook de producción | Entrega real de leads: **NO VERIFICADA**; probada con mock (07) |
| Clave secreta de Turnstile | Verificación anti-bot real: sin ella el endpoint acepta y marca `verificado:false` (fallo abierto documentado en `.env.example`) |
