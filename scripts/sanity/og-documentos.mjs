#!/usr/bin/env node
/**
 * `seo.imagenOg` de cada documento con pagina, y `siteSettings.imagenOgPorDefecto`.
 *
 *     node scripts/sanity/og-documentos.mjs --generar     # tras `npm run build`: JPEG 1200x630 en public/images/og
 *     (cd studio && npx sanity exec ../scripts/sanity/og-documentos.mjs --with-user-token -- --subir [--aplicar])
 *
 * Es lo que hace scripts/generar-og.mjs con las 10 fichas, para el resto: un JPEG de
 * 1200x630 (AVIF no vale para Open Graph ni para el `image` del JSON-LD) derivado del
 * MISMO hero que ve el visitante, leido del HTML construido (el <img fetchpriority=high>
 * o, si el hero es un fondo, la primera foto con srcset de <main>). Las fichas de
 * producto conservan el suyo. Las paginas sin foto propia (POR_DEFECTO) llevan la de la
 * marca, que es la que ya tenian.
 *
 * En Sanity, cada JPEG es un asset cuyo `origen` es su fichero de public/images/og: el
 * build pinta esa ruta mientras el editor no cambie la imagen (scripts/sanity/instantanea.mjs).
 * El alt y la procedencia son los de la foto de la que sale. Escribe con ifRevisionID y no
 * toca un documento editado despues de la ultima migracion (src/data/sanity-migracion.json).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const RAIZ = path.resolve(import.meta.dirname, '../..');
const DIST = path.join(RAIZ, 'dist/client');
const PLAN = path.join(RAIZ, '.cache/sanity/og-plan.json');
const DEFECTO = '/images/og-pergola-plus-florida.jpg';
/** Sin foto propia, o con una que no es de la pagina: la imagen de la marca. */
const POR_DEFECTO = new Set(['/', '/404', '/thank-you', '/articles/privacy-policy', '/articles/terms-of-service', '/resources/faq',
  '/resources/warranties', '/about-us/testimonials', '/contact-us/get-in-touch', '/pergolas-contractors/coral-springs-installation']);
const { rutaDe } = await import(path.join(RAIZ, 'src/lib/rutas-sanity.mjs'));

const docsConPagina = () => {
  const { docs } = JSON.parse(fs.readFileSync(path.join(RAIZ, '.cache/sanity/contenido.json'), 'utf8'));
  return docs.flatMap((d) => {
    if (!d.seo) return [];
    let ruta;
    try { ruta = rutaDe(d); } catch { return []; }
    const f = [path.join(DIST, ruta, 'index.html'), path.join(DIST, `${ruta}.html`)].find((x) => fs.existsSync(x));
    return f ? [{ d, ruta, f }] : [];
  });
};

/** El hero de un HTML: { src, alt } o null. */
function hero(html) {
  const main = html.slice(Math.max(0, html.indexOf('<main')));
  const img = html.match(/<img[^>]*fetchpriority="high"[^>]*>/)?.[0]
    ?? main.match(/<img(?=[^>]*srcset=)(?=[^>]*\ssrc="[^"]+\.(?:avif|jpe?g|png|webp)")[^>]*>/)?.[0];
  const src = img?.match(/\ssrc="([^"]+)"/)?.[1];
  return src && !src.endsWith('.svg') ? { src, alt: img.match(/\salt="([^"]*)"/)?.[1] ?? '' } : null;
}

if (process.argv.includes('--generar')) {
  const sharp = (await import('sharp')).default;
  const { OG_ANCHO, OG_ALTO, rutaOg } = await import(path.join(RAIZ, 'scripts/generar-og.mjs'));
  const plan = [];
  for (const { d, ruta, f } of docsConPagina()) {
    let og = DEFECTO, src = null, alt = { en: '', es: '' };
    if (d._type === 'product') og = rutaOg(d.slug.current);
    else if (!POR_DEFECTO.has(ruta)) {
      const h = hero(fs.readFileSync(f, 'utf8'));
      if (h) {
        // El original, no un derivado de ancho (-800.avif) si existe.
        src = fs.existsSync(path.join(RAIZ, 'public', h.src.replace(/-\d+\.avif$/, '.avif'))) ? h.src.replace(/-\d+\.avif$/, '.avif') : h.src;
        og = `/images/og/${path.basename(src).replace(/\.\w+$/, '')}-${OG_ANCHO}x${OG_ALTO}.jpg`;
        const destino = path.join(RAIZ, 'public', og);
        if (!fs.existsSync(destino)) {
          // Como generar-og.mjs: cover centrado (revisable, no depende de la libreria) y 4:2:0.
          await sharp(path.join(RAIZ, 'public', src)).resize(OG_ANCHO, OG_ALTO, { fit: 'cover', position: 'centre' })
            .jpeg({ quality: 80, mozjpeg: true }).toFile(destino);
        }
        const fEs = [path.join(DIST, 'es', ruta, 'index.html')].find((x) => fs.existsSync(x));
        alt = { en: h.alt, es: fEs ? (hero(fs.readFileSync(fEs, 'utf8'))?.alt ?? '') : '' };
      }
    }
    plan.push({ id: d._id, ruta, og, src, alt });
  }
  fs.writeFileSync(PLAN, JSON.stringify(plan, null, 1));
  const unicos = new Set(plan.map((p) => p.og));
  console.log(`${plan.length} documentos con pagina, ${unicos.size} imagenes og (${plan.filter((p) => p.og === DEFECTO).length} con la de la marca); plan en ${path.relative(RAIZ, PLAN)}`);
  console.log('RECUERDA: `git add public/images/og` (check:imagenes usa git ls-files).');
  process.exit(0);
}

if (process.argv.includes('--subir')) {
  const { createRequire } = await import('node:module');
  const { getCliClient } = await import(createRequire(path.join(RAIZ, 'studio/package.json')).resolve('sanity/cli'));
  const c = getCliClient({ apiVersion: '2025-01-01' });
  const { ultimaMigracion } = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/sanity-migracion.json'), 'utf8'));
  const plan = JSON.parse(fs.readFileSync(PLAN, 'utf8'));
  const docs = await c.fetch('*[!(_id in path("drafts.**")) && !(_type match "sanity.*")]');
  const porId = new Map(docs.map((d) => [d._id, d]));
  // Procedencia y alt de cada foto del dataset, por su `origen`.
  const fotos = new Map();
  const andar = (x) => {
    if (Array.isArray(x)) return x.forEach(andar);
    if (!x || typeof x !== 'object') return;
    if (x.origen && x.asset) fotos.set(x.origen, x);
    Object.values(x).forEach(andar);
  };
  docs.forEach(andar);
  const APLICAR = process.argv.includes('--aplicar');
  const assets = new Map();
  const asset = async (og) => {
    if (assets.has(og)) return assets.get(og);
    const buf = fs.readFileSync(path.join(RAIZ, 'public', og));
    const sha1 = crypto.createHash('sha1').update(buf).digest('hex');
    const ya = await c.fetch('*[_type == "sanity.imageAsset" && sha1hash == $sha1][0]._id', { sha1 });
    const id = ya ?? (APLICAR ? (await c.assets.upload('image', buf, { filename: path.basename(og) }))._id : `image-${sha1}-(por subir)`);
    assets.set(og, id);
    return id;
  };
  const imagen = async (og, src, alt) => {
    // Fotograma del video del hero del cliente (src/layouts/BaseLayout.astro, GH-007).
    if (og === DEFECTO) {
      return {
        _type: 'imagen', asset: { _type: 'reference', _ref: await asset(og) }, origen: og, procedencia: 'real-cliente',
        procedenciaNota: 'Fotograma del vídeo del hero del cliente (1200x630).', decorativa: false,
        alt: { _type: 'textoI18n', en: 'White freestanding pergola with privacy louvers on the lawn of a white two-story home, with lounge chairs and palm trees',
          es: 'Pérgola blanca exenta con lamas de privacidad sobre el césped de una casa blanca de dos plantas, con tumbonas y palmeras' },
      };
    }
    const f = src && fotos.get(src);
    const altEn = alt.en || f?.alt?.en || '', altEs = alt.es || f?.alt?.es || '';
    return {
      _type: 'imagen', asset: { _type: 'reference', _ref: await asset(og) }, origen: og,
      procedencia: f?.procedencia ?? 'sin-clasificar', ...(f?.procedenciaNota ? { procedenciaNota: f.procedenciaNota } : {}),
      // La de la marca y las fotos sin alt: decorativa (og:image no lleva alt en el <head>).
      ...(altEn ? { decorativa: false, alt: { _type: 'textoI18n', en: altEn, ...(altEs ? { es: altEs } : {}) } } : { decorativa: true }),
    };
  };
  const parches = [], saltados = [];
  for (const p of plan) {
    const d = porId.get(p.id);
    if (!d || d.seo?.imagenOg?.asset) continue;
    if (d._updatedAt > ultimaMigracion) { saltados.push(`${d._id} (${d._updatedAt})`); continue; }
    parches.push({ id: d._id, rev: d._rev, set: { 'seo.imagenOg': await imagen(p.og, p.src, p.alt) } });
  }
  const ss = porId.get('siteSettings');
  if (!ss.imagenOgPorDefecto?.asset) {
    if (ss._updatedAt > ultimaMigracion) saltados.push(`siteSettings (${ss._updatedAt})`);
    else parches.push({ id: 'siteSettings', rev: ss._rev, set: { imagenOgPorDefecto: await imagen(DEFECTO, null, { en: '', es: '' }) } });
  }
  console.log(`${parches.length} documentos; ${assets.size} imagenes (${[...assets.values()].filter((v) => v.includes('por subir')).length} por subir); editados en el Studio, sin tocar: ${saltados.join(', ') || 'ninguno'}`);
  if (APLICAR && parches.length) {
    for (let i = 0; i < parches.length; i += 50) {
      const tx = parches.slice(i, i + 50).reduce((t, p) => t.patch(p.id, (q) => q.ifRevisionId(p.rev).set(p.set)), c.transaction());
      console.log(`aplicado: ${(await tx.commit()).results.length} documentos`);
    }
  }
}
