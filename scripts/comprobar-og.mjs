#!/usr/bin/env node
/**
 * Open Graph y Twitter en las 217 paginas de dist/client.
 *
 *     node scripts/comprobar-og.mjs      # despues de `npm run build`
 *
 * Cada pagina: og:title/og:description/twitter:title/twitter:description iguales al
 * <title> y a la meta description; og:type (article solo en los posts, con
 * article:published_time y article:modified_time iguales a las fechas del BlogPosting);
 * og:url igual al canonical; og:site_name; og:locale segun <html lang> y
 * og:locale:alternate solo si hay hreflang; twitter:card summary_large_image;
 * og:image = twitter:image, absoluta en el dominio del canonical, con su fichero en dist
 * y og:image:width/height iguales a sus medidas reales.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DIST = path.resolve(import.meta.dirname, '../dist/client');
const htmls = fs.readdirSync(DIST, { recursive: true }).filter((f) => f.endsWith('.html'));
const dec = (s) => s?.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const medidas = new Map();
const fallos = [];
let posts = 0;
for (const f of htmls) {
  const h = fs.readFileSync(path.join(DIST, f), 'utf8');
  const head = h.slice(0, h.indexOf('</head>'));
  const meta = (k) => {
    const m = head.match(new RegExp(`<meta (?:content="([^"]*)" (?:property|name)="${k}"|(?:property|name)="${k}" content="([^"]*)")`));
    return m ? dec(m[1] ?? m[2]) : undefined;
  };
  const mal = (que) => fallos.push(`${f}: ${que}`);
  const titulo = dec(head.match(/<title>([^<]*)<\/title>/)?.[1]);
  const desc = meta('description');
  const canonical = head.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const lang = h.match(/<html lang="([^"]+)"/)?.[1];
  for (const [k, v] of [['og:title', titulo], ['twitter:title', titulo], ['og:description', desc], ['twitter:description', desc]]) if (!v || meta(k) !== v) mal(`${k} distinto (${meta(k)?.slice(0, 50)})`);
  if (meta('og:url') !== canonical) mal(`og:url ${meta('og:url')} y canonical ${canonical}`);
  if (!meta('og:site_name')) mal('sin og:site_name');
  if (meta('og:locale') !== (lang === 'es' ? 'es_US' : 'en_US')) mal(`og:locale ${meta('og:locale')} con lang ${lang}`);
  const conHreflang = /<link rel="alternate" hreflang="e[ns]"/.test(head);
  if (conHreflang !== Boolean(meta('og:locale:alternate'))) mal('og:locale:alternate sin hreflang o al reves');
  if (meta('twitter:card') !== 'summary_large_image') mal('twitter:card');
  const esPost = /^(es\/)?post\//.test(f);
  if (meta('og:type') !== (esPost ? 'article' : 'website')) mal(`og:type ${meta('og:type')}`);
  if (esPost) {
    posts++;
    const pub = h.match(/"datePublished":"([^"]+)"/)?.[1], mod = h.match(/"dateModified":"([^"]+)"/)?.[1];
    if (!pub || meta('article:published_time') !== pub || meta('article:modified_time') !== mod) mal('article:* distinto de las fechas del BlogPosting');
  } else if (meta('article:published_time')) mal('article:* fuera de un post');
  const img = meta('og:image');
  if (!img || meta('twitter:image') !== img) { mal('og:image/twitter:image'); continue; }
  const u = new URL(img);
  if (canonical && u.origin !== new URL(canonical).origin) mal(`og:image en otro dominio: ${img}`);
  const fichero = path.join(DIST, decodeURIComponent(u.pathname));
  if (!fs.existsSync(fichero)) { mal(`og:image sin fichero: ${u.pathname}`); continue; }
  if (!medidas.has(fichero)) medidas.set(fichero, await sharp(fichero).metadata());
  const m = medidas.get(fichero);
  if (meta('og:image:width') !== String(m.width) || meta('og:image:height') !== String(m.height)) mal(`og:image:width/height ${meta('og:image:width')}x${meta('og:image:height')} y el fichero ${m.width}x${m.height}`);
}
console.log(`${htmls.length} paginas, ${posts} posts, ${medidas.size} imagenes og distintas`);
for (const x of fallos.slice(0, 40)) console.log(`  FALLO  ${x}`);
console.log(fallos.length ? `\n${fallos.length} fallo(s).` : '\nTodo correcto.');
process.exit(fallos.length ? 1 : 0);
