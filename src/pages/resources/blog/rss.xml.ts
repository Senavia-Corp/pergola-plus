/**
 * Feed RSS del blog. A mano, sin @astrojs/rss.
 *
 * Ese paquete existe sobre todo para normalizar colecciones de Markdown y
 * sanear content:encoded. Aqui la fuente son 21 filas de un CSV con resumenes de
 * 48-65 caracteres en texto plano, asi que lo unico que hay que hacer bien es el
 * escapado XML —y son cinco caracteres—. El repo ya tomo esta misma decision con
 * scripts/lib/csv.mjs en vez de csv-parse.
 *
 * OJO CON LOS <guid>: se construyen sobre `site` y son PERMANENTES para quien se
 * suscriba. En un deploy provisional `site` es la URL *.vercel.app, asi que un feed
 * difundido desde ahi deja a sus suscriptores apuntando a una URL que va a morir.
 *
 * Por eso el feed NO se publica fuera de produccion: astro.config.mjs lo BORRA de la
 * salida, igual que el sitemap. Es la unica pieza del sitio que un visitante se lleva
 * a otro programa, y por tanto la unica donde el <meta noindex> no protege nada — un
 * lector de RSS no lee <meta>.
 */
import type { APIRoute } from 'astro';
import { posts } from '../../../lib/blog';

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESCAPES[c]!);

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('[rss] falta `site` en astro.config.mjs');

  const abs = (ruta: string) => new URL(ruta, site).href;
  const enlace = abs('/resources/blog');

  // Mas reciente primero. Aqui si manda la fecha: un lector RSS ordena por pubDate.
  const entradas = [...posts].sort((a, b) => b.publicado.getTime() - a.publicado.getTime());

  const items = entradas
    .map((p) => {
      const url = abs(`/post/${p.slug}`);
      return `    <item>
      <title>${esc(p.titulo)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <description>${esc(p.resumen)}</description>
      <category>${esc(p.categoria.nombre)}</category>
      <pubDate>${p.publicado.toUTCString()}</pubDate>
      <enclosure url="${esc(abs(p.principal.src))}" type="image/avif" length="0"/>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Pergola Plus Florida — Blog</title>
    <link>${esc(enlace)}</link>
    <atom:link href="${esc(abs('/resources/blog/rss.xml'))}" rel="self" type="application/rss+xml"/>
    <description>Expert insights on aluminum pergolas, motorized louvered roofs and outdoor shade systems engineered for South Florida homes.</description>
    <language>en-us</language>
    <lastBuildDate>${entradas[0]!.publicado.toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
