#!/usr/bin/env node
/**
 * Paridad del texto enriquecido: portableAHtml(htmlAPortable(x)) === x, para el cuerpo
 * de los 21 posts y los 2 textos legales, en ingles y en español, tal como los pinta
 * HOY el sitio (mismos fragmentos, mismos diccionarios, misma extraccion).
 *
 *     node scripts/sanity/ida-y-vuelta.mjs                    # HTML -> PT -> HTML
 *     node scripts/sanity/ida-y-vuelta.mjs --ndjson <fichero>  # lo que se va a importar -> HTML
 *
 * Comparacion sobre HTML NORMALIZADO: entidades decodificadas (&#x27; y ' son lo mismo),
 * `/>` igual a `>` y el espacio entre atributos de una etiqueta colapsado. Cualquier otra diferencia -una etiqueta, un atributo, un espacio-
 * cuenta y se lista.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { cargarTs, cerrarTs } from './cargar-ts.mjs';
import { htmlAPortable, portableAHtml, decodificar } from '../../src/lib/portable.mjs';
import { rutaDeId } from '../../src/lib/rutas-sanity.mjs';
import { canonica } from '../../src/lib/canonica.mjs';

process.chdir(path.resolve(import.meta.dirname, '../..'));
const { extraerDiv } = await cargarTs('src/lib/articulo.ts');
const { traducirHtml } = await cargarTs('src/i18n/index.ts');
const { COMUN_ES } = await cargarTs('src/i18n/comun.es.ts');
const { CUERPOS_ES } = await cargarTs('src/i18n/blog.es.ts');
const { ARTICULOS_ES } = await cargarTs('src/i18n/articulos.es.ts');
const { ALTS_ES } = await import('../lib/posts.mjs');

export async function textosEnriquecidos() {
  const casos = [];
  const cuerpoPost = (h) => extraerDiv(h, '<div class="rich-text-block w-richtext"') ?? extraerDiv(h, '<div class="blog_rich-body-blog"');
  for (const f of (await fs.readdir('src/contenido-migrado/post')).filter((f) => f.endsWith('.html')).sort()) {
    const slug = f.replace(/\.html$/, '');
    const bruto = await fs.readFile(`src/contenido-migrado/post/${f}`, 'utf8');
    casos.push({ tipo: 'post', slug, idioma: 'en', html: cuerpoPost(bruto) });
    if (CUERPOS_ES[slug]) casos.push({ tipo: 'post', slug, idioma: 'es', html: cuerpoPost(traducirHtml(bruto, { ...COMUN_ES, ...ALTS_ES, ...CUERPOS_ES[slug] }).html) });
  }
  for (const slug of ['privacy-policy', 'terms-of-service']) {
    const bruto = await fs.readFile(`src/contenido-migrado/articles/${slug}.html`, 'utf8');
    casos.push({ tipo: 'legalPage', slug, idioma: 'en', html: extraerDiv(bruto, '<div class="w-richtext"') });
    if (ARTICULOS_ES[slug]) casos.push({ tipo: 'legalPage', slug, idioma: 'es', html: extraerDiv(traducirHtml(bruto, { ...COMUN_ES, ...ARTICULOS_ES[slug].dic }).html, '<div class="w-richtext"') });
  }
  for (const c of casos) if (!c.html) throw new Error(`sin cuerpo: ${c.tipo}/${c.slug} ${c.idioma}`);
  return casos;
}

// Dentro de una etiqueta, el espacio entre atributos no significa nada (`alt="x"  loading` = `alt="x" loading`).
const normalizar = (h) => decodificar(h.replace(/<[^>]+>/g, (t) => t.replace(/\s+/g, ' ').replace(/\s*\/?>$/, '>')));

// Con --ndjson, la comparacion es contra lo que se va a IMPORTAR: los `href` internos
// salen de la referencia (rutaDeId), asi que se comparan en forma canonica, que es la que
// deja el build (canonizarEnlaces) en los dos casos.
const hrefsCanonicos = (h) => h.replace(/href="(\/(?!\/)[^"]*)"/g, (_t, r) => `href="${canonica(decodificar(r))}"`);

if (import.meta.url === `file://${process.argv[1]}` && process.argv.includes('--ndjson')) {
  const casos = await textosEnriquecidos();
  await cerrarTs();
  const fichero = process.argv[process.argv.indexOf('--ndjson') + 1];
  const docs = (await fs.readFile(fichero, 'utf8')).trim().split('\n').map((l) => JSON.parse(l)).filter((d) => d._type === 'post' || d._type === 'legalPage');
  const publica = (b) => '/' + path.relative(path.resolve('public'), b._sanityAsset.replace(/^image@file:\/\//, ''));
  const opc = {
    hrefDe: (d) => (d.destino ? rutaDeId(d.destino._ref) : '') + (d.ancla ? `#${d.ancla}` : ''),
    imagen: (b) => ({ src: publica(b), alt: b.alt }),
  };
  const fallos = [];
  let n = 0;
  for (const c of casos) {
    const d = docs.find((x) => x._type === c.tipo && x.slug.current === c.slug);
    if (!d) { fallos.push(`${c.tipo}/${c.slug}: no esta en el NDJSON`); continue; }
    n++;
    const bloques = d.cuerpo?.[c.idioma];
    if (!bloques) { fallos.push(`${c.tipo}/${c.slug} ${c.idioma}: sin cuerpo`); continue; }
    const a = normalizar(hrefsCanonicos(c.html)), b = normalizar(hrefsCanonicos(portableAHtml(bloques, opc)));
    if (a !== b) {
      let i = 0; while (i < a.length && a[i] === b[i]) i++;
      fallos.push(`${c.tipo}/${c.slug} ${c.idioma}: difiere en ${i}\n      hoy:     …${a.slice(Math.max(0, i - 60), i + 80)}\n      sanity:  …${b.slice(Math.max(0, i - 60), i + 80)}`);
    }
  }
  const sobran = docs.filter((d) => !casos.some((c) => c.tipo === d._type && c.slug === d.slug.current)).map((d) => d._id);
  console.log(JSON.stringify({ casos: casos.length, comparados: n, identicos: n - fallos.length, fallos: fallos.length, documentosSinCaso: sobran }, null, 1));
  for (const f of fallos) console.log('  FALLO', f);
  process.exit(fallos.length || sobran.length ? 1 : 0);
} else if (import.meta.url === `file://${process.argv[1]}`) {
  const casos = await textosEnriquecidos();
  await cerrarTs();
  const opc = {
    enlaceInterno: (ruta) => ({ ruta }),
    imagen: (src, alt) => ({ _type: 'imagenCuerpo', src, alt }),
  };
  const fallos = [];
  const tipos = {};
  for (const c of casos) {
    let ida;
    try { ida = htmlAPortable(c.html, opc); } catch (e) { fallos.push(`${c.tipo}/${c.slug} ${c.idioma}: ${e.message}`); continue; }
    for (const b of ida) tipos[b._type + (b.style ? `:${b.style}` : '') + (b.listItem ? `:${b.listItem}` : '')] = (tipos[b._type + (b.style ? `:${b.style}` : '') + (b.listItem ? `:${b.listItem}` : '')] ?? 0) + 1;
    const vuelta = portableAHtml(ida, { hrefDe: (d) => d.ruta, imagen: (b) => ({ src: b.src, alt: b.alt }) });
    const a = normalizar(c.html), b = normalizar(vuelta);
    if (a !== b) {
      let i = 0; while (i < a.length && a[i] === b[i]) i++;
      fallos.push(`${c.tipo}/${c.slug} ${c.idioma}: difiere en ${i}\n      original: …${a.slice(Math.max(0, i - 60), i + 80)}\n      vuelta:   …${b.slice(Math.max(0, i - 60), i + 80)}`);
    }
  }
  console.log(JSON.stringify({ casos: casos.length, identicos: casos.length - fallos.length, fallos: fallos.length, bloques: tipos }, null, 1));
  for (const f of fallos) console.log('  FALLO', f);
  process.exit(fallos.length ? 1 : 0);
}
