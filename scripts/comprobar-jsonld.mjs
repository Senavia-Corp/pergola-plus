#!/usr/bin/env node
/**
 * JSON-LD de las 217 paginas de dist/client contra el contenido (siteSettings de la
 * instantanea) y contra lo que la pagina pinta.
 *
 *     node scripts/comprobar-jsonld.mjs      # despues de `npm run build`
 *
 *   - Todo bloque ld+json parsea.
 *   - BreadcrumbList en todas salvo la home y el 404 (EN y ES); su ultimo tramo es el
 *     canonical de la pagina.
 *   - El negocio (home EN/ES): @id /#negocio, nombre, telefono, direccion, horario,
 *     areaServed y sameAs iguales a siteSettings; el telefono es el que pinta el pie.
 *     Todo Organization lleva ese mismo @id.
 *   - Ningun AggregateRating ni Review; Product sin offers, price ni aggregateRating.
 *   - BlogPosting con author, datePublished y dateModified.
 *   - FAQPage solo con preguntas que la pagina pinta, una a una.
 */
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '..');
const DIST = path.join(RAIZ, 'dist/client');
const c = JSON.parse(fs.readFileSync(path.join(RAIZ, '.cache/sanity/contenido.json'), 'utf8'));
const s = c.docs.find((d) => d._id === 'siteSettings');
const htmls = fs.readdirSync(DIST, { recursive: true }).filter((f) => f.endsWith('.html'));
const texto = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
const norm = (t) => String(t).replace(/\s+/g, ' ').trim();
const fallos = [];
const tipos = {};
const andar = (x, f) => {
  if (Array.isArray(x)) return x.forEach((y) => andar(y, f));
  if (!x || typeof x !== 'object') return;
  f(x);
  for (const v of Object.values(x)) andar(v, f);
};
const telDigitos = s.telefonoPrincipal.replace(/\D/g, '');
for (const f of htmls) {
  const h = fs.readFileSync(path.join(DIST, f), 'utf8');
  const mal = (q) => fallos.push(`${f}: ${q}`);
  const canonical = h.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const origen = canonical && new URL(canonical).origin;
  const nodos = [];
  for (const m of h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { andar(JSON.parse(m[1]), (x) => x['@type'] && nodos.push(x)); } catch (e) { mal(`ld+json no parsea: ${e.message}`); }
  }
  for (const n of nodos) for (const t of [].concat(n['@type'])) tipos[t] = (tipos[t] ?? 0) + 1;
  const de = (t) => nodos.filter((n) => [].concat(n['@type']).includes(t));
  const sinMigas = ['index.html', 'es/index.html', '404.html', 'es/404/index.html'].includes(f);
  const migas = de('BreadcrumbList');
  if (!sinMigas && migas.length !== 1) mal(`${migas.length} BreadcrumbList`);
  if (sinMigas && migas.length) mal('BreadcrumbList donde no va');
  for (const b of migas) {
    const ultimo = b.itemListElement.at(-1)?.item;
    if (ultimo !== canonical) mal(`la ultima miga ${ultimo} no es el canonical ${canonical}`);
    if (b.itemListElement.some((it, i) => it.position !== i + 1 || !it.name || !String(it.item).startsWith(origen))) mal('miga mal formada');
  }
  for (const t of ['AggregateRating', 'Review']) if (de(t).length) mal(`lleva ${t}`);
  for (const p of de('Product')) for (const k of ['offers', 'price', 'aggregateRating', 'review']) if (k in p) mal(`Product con ${k}`);
  for (const o of de('Organization')) if (o['@id'] !== `${origen}/#negocio`) mal(`Organization sin el @id del negocio (${o['@id']})`);
  for (const b of de('BlogPosting').filter((x) => x.mainEntityOfPage)) if (!b.author || !b.datePublished || !b.dateModified) mal('BlogPosting sin author o fechas');
  const visible = norm(texto(h));
  for (const q of de('FAQPage').flatMap((x) => x.mainEntity)) if (!visible.includes(norm(q.name))) mal(`pregunta del FAQPage que no se pinta: ${q.name.slice(0, 60)}`);
  for (const n of de('HomeAndConstructionBusiness')) {
    const d = s.direccion;
    const esperado = {
      '@id': `${origen}/#negocio`, name: s.nombreComercial, email: s.correoPublico,
      streetAddress: d.calle, addressLocality: d.ciudad, addressRegion: d.estado, postalCode: d.cp,
      opens: s.horarioEstructurado.abre, closes: s.horarioEstructurado.cierra,
      dias: s.horarioEstructurado.dias.join(), areas: s.condadosServidos.join(), sameAs: s.redes.join(),
    };
    const real = {
      '@id': n['@id'], name: n.name, email: n.email, ...n.address,
      opens: n.openingHoursSpecification?.[0]?.opens, closes: n.openingHoursSpecification?.[0]?.closes,
      dias: n.openingHoursSpecification?.[0]?.dayOfWeek?.join(), areas: n.areaServed?.map((a) => a.name).join(), sameAs: n.sameAs?.join(),
    };
    for (const [k, v] of Object.entries(esperado)) if (real[k] !== v) mal(`negocio.${k}: ${real[k]} y siteSettings ${v}`);
    if (n.telephone?.replace(/\D/g, '').slice(-10) !== telDigitos) mal(`negocio.telephone ${n.telephone}`);
    if (!h.includes(`href="tel:+1${telDigitos}"`) && !h.includes(`href="tel:${telDigitos}"`)) mal('el telefono del negocio no esta en un enlace tel: de la pagina');
    if (!n.logo) mal('negocio sin logo');
  }
  if (['index.html', 'es/index.html'].includes(f) && !de('HomeAndConstructionBusiness').length) mal('la home sin el negocio');
}
console.log(`${htmls.length} paginas · ${Object.entries(tipos).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t} ${n}`).join(', ')}`);
for (const x of fallos.slice(0, 40)) console.log(`  FALLO  ${x}`);
console.log(fallos.length ? `\n${fallos.length} fallo(s).` : '\nTodo correcto.');
process.exit(fallos.length ? 1 : 0);
