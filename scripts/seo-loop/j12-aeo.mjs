#!/usr/bin/env node
/**
 * J12 · check:aeo (AEO). En EN y ES:
 *   - cada ficha (/products/x/), servicio (/services/x/), ciudad y condado indexable tiene en <main>
 *     al menos un H2 o H3 que es una pregunta (acaba en «?») y cuyo primer parrafo de respuesta
 *     (el primer <p>, o el bloque `faq_answer`, antes del siguiente encabezado) tiene de 1 a 60 palabras;
 *   - FAQPage solo con preguntas visibles: cada Question.name esta en el texto visible de la pagina;
 *   - 0 preguntas de FAQPage repetidas entre dos paginas del mismo idioma.
 */
import { puerta, paginas, datos, indexables, textoVisible, limpio, norm, contenidoBuild, esEs } from './lib/comun.mjs';
import { rutaDe } from '../../src/lib/rutas-sanity.mjs';

const TIPOS = ['product', 'service', 'city', 'county'];

function respuestaDirecta(html) {
  const main = html.match(/<main\b[\s\S]*<\/main>/)?.[0] ?? '';
  const partes = [...main.matchAll(/<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/g)];
  for (const m of partes) {
    const pregunta = limpio(m[2]);
    if (!pregunta.endsWith('?')) continue;
    const resto = main.slice(m.index + m[0].length);
    const tramo = resto.slice(0, resto.search(/<h[1-6]\b/) === -1 ? undefined : resto.search(/<h[1-6]\b/));
    const p = tramo.match(/<p\b[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? tramo.match(/<div[^>]*class="[^"]*faq_answer[^"]*"[^>]*>([\s\S]*?)<\/div>/)?.[1];
    const palabras = p ? limpio(p).split(' ').filter(Boolean).length : 0;
    if (palabras >= 1 && palabras <= 60) return { pregunta, palabras };
  }
  return null;
}

await puerta('J12', 'check:aeo', () => {
  const fallos = [];
  const idx = new Set(indexables());
  const rutas = contenidoBuild().docs.filter((d) => TIPOS.includes(d._type)).flatMap((d) => { const r = rutaDe(d).replace(/\/?$/, '/'); return [r, `/es${r}`]; }).filter((r) => idx.has(r));
  if (!rutas.length) throw new Error('ninguna ficha, servicio, ciudad o condado indexable');
  let conRespuesta = 0;
  for (const r of rutas) {
    if (respuestaDirecta(paginas().get(r))) conRespuesta++;
    else fallos.push(`${r}: sin pregunta H2/H3 con respuesta directa de <= 60 palabras`);
  }
  const vistas = { en: new Map(), es: new Map() };
  for (const r of idx) {
    const html = paginas().get(r);
    const faq = datos(html).jsonld.filter((n) => [n['@type']].flat().includes('FAQPage'));
    if (!faq.length) continue;
    const visible = norm(textoVisible(html).join(' '));
    for (const q of faq.flatMap((f) => f.mainEntity ?? [])) {
      const n = norm(q.name);
      if (!visible.includes(n)) fallos.push(`${r}: FAQPage con una pregunta que no se ve: «${q.name}»`);
      const mapa = vistas[esEs(r) ? 'es' : 'en'];
      if (mapa.has(n) && mapa.get(n) !== r) fallos.push(`FAQ repetida en ${mapa.get(n)} y ${r}: «${q.name}»`);
      else mapa.set(n, r);
    }
  }
  return { fallos, extra: { paginas: rutas.length, conRespuesta } };
});
