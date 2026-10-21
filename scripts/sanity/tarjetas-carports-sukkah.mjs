#!/usr/bin/env node
/**
 * Tarjeta del producto (la que pinta «Compare») para carports y sukkah, las dos fichas que no
 * la tenian: la estructura de la de cabanas con los datos de su propia ficha (el hero y su alt,
 * el H1, la descripcion SEO y el nombre). Hoy ningun Compare las referencia.
 *
 *     npm run build && (cd studio && npx sanity exec ../scripts/sanity/tarjetas-carports-sukkah.mjs --with-user-token [-- aplicar])
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const RAIZ = path.resolve(import.meta.dirname, '../..');
const { getCliClient } = await import(createRequire(path.join(RAIZ, 'studio/package.json')).resolve('sanity/cli'));
const c = getCliClient({ apiVersion: '2025-01-01' });
const modelo = (await c.getDocument('product-cabanas')).tarjeta;
const out = [];
for (const slug of ['carports', 'sukkah']) {
  const d = await c.getDocument(`product-${slug}`);
  if (d.tarjeta) continue;
  const html = (f) => fs.readFileSync(path.join(RAIZ, `dist/client${f}/products/${slug}/index.html`), 'utf8');
  const h1 = (h) => h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const heroImg = (h) => h.match(/<img[^>]*fetchpriority="high"[^>]*>/)?.[0];
  const en = html(''), es = html('/es');
  const src = heroImg(en).match(/\ssrc="([^"]+)"/)[1];
  const alt = { en: heroImg(en).match(/\salt="([^"]*)"/)[1], es: heroImg(es).match(/\salt="([^"]*)"/)[1] };
  // El asset del hero, el mismo objeto imagenPlantilla que ya usa la ficha.
  let img; const andar = (x) => { if (img || !x || typeof x !== 'object') return; if (x.origen === src && x.asset) img = x; else Object.values(x).forEach(andar); };
  andar(d.secciones);
  if (!img) throw new Error(`${slug}: no encuentro el asset de ${src}`);
  const t = structuredClone(modelo);
  t.imagenes[0].imagen = { ...structuredClone(img), retocadaConIA: img.retocadaConIA ?? false };
  t.enlaces[0].destino = { _type: 'reference', _ref: d._id };
  const texto = { 'img-product-card-image.alt': alt, 'h3-product-card-h3.t': { en: h1(en), es: h1(es) },
    'div-product-card-text.t': { en: d.seo.descripcion.en, es: d.seo.descripcion.es ?? d.seo.descripcion.en },
    'a-product-card-link-page.div.t': { en: d.nombre.en, es: d.nombre.es ?? d.nombre.en } };
  for (const x of t.textos) {
    const k = Object.keys(texto).find((s) => x.clave.endsWith(s));
    if (k) x.texto = { _type: 'textoLargoI18n', ...texto[k] };
  }
  out.push({ id: d._id, rev: d._rev, tarjeta: t, resumen: { src, alt, h3: texto['h3-product-card-h3.t'], textos: t.textos.map((x) => [x.clave.split('.').slice(-2).join('.'), x.texto.en.slice(0, 70)]) } });
}
for (const o of out) console.log(o.id, JSON.stringify(o.resumen, null, 1));
if (process.argv.at(-1) === 'aplicar' && out.length) {
  const tx = out.reduce((tr, o) => tr.patch(o.id, (q) => q.ifRevisionId(o.rev).set({ tarjeta: o.tarjeta })), c.transaction());
  console.log('aplicado', (await tx.commit()).results.length);
}
