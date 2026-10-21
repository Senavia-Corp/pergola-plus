# Recomendaciones opcionales, fuera del alcance del diseño aprobado; aplicarlas requiere aprobación escrita del cliente

Bloque S, noche del 21-oct-2026 (rama `entrega/cms-sanity-nube`). Nada de lo que sigue está aplicado, salvo el punto 1, que se hizo después a petición (ver §7b del informe). Cada punto dice qué cambiaría, dónde y cómo se comprueba.

## 1. Texto alternativo de 104 imágenes de contenido (HECHO después, a revisar)

Se hizo a petición, después de este documento: ver §7b del informe.

- Quedan vacíos a propósito: el sello BBB (su enlace lleva `aria-label`), las 9 fotos decorativas del estimador y las copias del marquee de logos.
- **Lo que queda por hacer:** revisar los textos, en inglés y en español, en `scripts/sanity/migrar-alts-contenido.mjs` o en el Studio.

## 2. Títulos y descripciones largos (textos del cliente, sin tocar)

- **Títulos:** `check:sanity-esquema` avisa de 58 títulos de más de 60 caracteres (42 solo en inglés, 15 en inglés y español, 1 solo en español). Google puede cortarlos en el resultado. El cliente eligió los títulos, así que no se cambian.
- **Descripciones:** 6 meta descriptions pasan de 155 caracteres; están marcadas con ⚠ en `06-anexo-S1-descripciones.md`. Ninguna está vacía ni duplicada.

## 3. Fechas de los posts

En los 21 posts, `dateModified` (campo `fechaActualizacion`, que viene del export de Webflow) es anterior a `datePublished`, por minutos (ejemplo: 22:51 frente a 23:00 del 23-feb-2026). Las dos fechas son reales y se publican tal cual en el JSON-LD y en `article:*`.

- **Propuesta:** si el cliente lo confirma, que `fechaActualizacion` sea igual o posterior a la publicación.

## 4. Nombres de rastreadores en robots.txt

Solo se pudieron comprobar en la documentación oficial los de Anthropic: ClaudeBot, Claude-User y Claude-SearchBot (support.claude.com, artículo 8896518). Las demás páginas oficiales no eran alcanzables desde el entorno (DNS). En `robots.txt` esos nombres llevan `# a verificar`:

- OpenAI: OAI-SearchBot, ChatGPT-User, GPTBot
- Perplexity: PerplexityBot, Perplexity-User
- Google: Googlebot, Google-Extended
- Bing: Bingbot
- Apple: Applebot, Applebot-Extended
- Common Crawl: CCBot
- ByteDance: Bytespider
- Meta: meta-externalagent

**Propuesta:** verificarlos y quitar la marca.

## 5. robots.txt fuera de producción

El encargo pide «robots bloqueante» en el build sin `PUBLIC_ES_PRODUCCION=1`. El código mantiene la decisión documentada GH-002 (`astro.config.mjs`, `scripts/comprobar-noindex.mjs`):

- `Allow: /` con `noindex,nofollow` en las 217 páginas.
- Sin sitemap, sin RSS y sin `llms.txt`.

Un `Disallow: /` impediría a Google leer el `noindex`. Cambiarlo es una decisión de la coordinación.

## 6. Open Graph

- `og:image:alt` y `twitter:image:alt` no se publican: las 11 imágenes og no tienen un texto alternativo propio.
- `twitter:site` no se publica: no hay una cuenta de X publicada en el sitio. `siteSettings.redes` solo trae Facebook, Instagram, YouTube y TikTok.

## 7. JSON-LD

Siguen fuera, porque no hay dato publicado:

- `geo` (no se ha medido).
- `priceRange`, y `offers` en Product (no hay precio publicado).
- `AggregateRating` y `Review` sobre el propio negocio (política de Google).

`Suite 110` no se declara: hoy el sitio no la muestra en el pie (`siteSettings.direccion.suiteEnTodoElSitio = false`).
