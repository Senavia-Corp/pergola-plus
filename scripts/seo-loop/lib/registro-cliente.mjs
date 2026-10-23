/**
 * Lo que el registro del cliente (01-REGISTRO-PETICIONES-CLIENTE.md §1) no deja cambiar, leido de
 * un dist/client: H1 de la home (R1) y de los proyectos (R8), menu (R3, R7), pie (R3: «Licensed &
 * Insured», «© 2026»), modulo de productos de la home (R4), NAP (R9) y las rutas (R13: slugs).
 * En ES solo cuentan los destinos del menu y del pie: sus textos son traduccion de Senavia y el
 * glosario (J10) los puede cambiar.
 *
 *     node scripts/seo-loop/lib/registro-cliente.mjs <dist/client> > linea-base/registro-cliente.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse, walkSync, ELEMENT_NODE, TEXT_NODE } from 'ultrahtml';
import { decodificar, limpio } from './comun.mjs';

const leer = (dist, r) => fs.readFileSync(path.join(dist, r, 'index.html'), 'utf8');

/** Anclas [texto, href] dentro del primer elemento que cumple `es(nodo)`. */
function anclas(html, es) {
  const arbol = parse(html);
  let raiz = null;
  walkSync(arbol, (n) => { if (!raiz && n.type === ELEMENT_NODE && es(n)) raiz = n; });
  if (!raiz) return null;
  const out = [];
  walkSync(raiz, (n) => {
    if (n.type !== ELEMENT_NODE || n.name !== 'a') return;
    let t = ''; walkSync(n, (x) => { if (x.type === TEXT_NODE) t += ' ' + decodificar(x.value); });
    out.push([t.replace(/\s+/g, ' ').trim(), decodificar(n.attributes.href ?? '')]);
  });
  return out;
}
const clase = (c) => (n) => (n.attributes?.class ?? '').split(/\s+/).includes(c);

export function extraer(dist) {
  const rutas = fs.readdirSync(dist, { recursive: true }).filter((f) => f.endsWith('index.html')).map((f) => '/' + f.replace(/index\.html$/, '')).sort();
  const home = leer(dist, ''), homeEs = leer(dist, 'es');
  const h1 = (html) => limpio(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '');
  const proyectos = Object.fromEntries(rutas.filter((r) => /^\/project\/[^/]+\/$/.test(r)).map((r) => [r, h1(leer(dist, r))]));
  const menu = (html) => anclas(html, (n) => n.name === 'nav' && clase('menu')(n));
  const pie = (html) => anclas(html, (n) => n.name === 'footer');
  const textoPie = limpio(home.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] ?? '');
  const main = home.match(/<main\b[\s\S]*<\/main>/)?.[0] ?? '';
  const modulo = [...main.matchAll(/<a\s[^>]*href="(\/products\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => [limpio(m[2]), m[1]]);
  let negocio = null;
  for (const m of home.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) for (const j of [JSON.parse(m[1])].flat()) for (const n of j['@graph'] ?? [j]) if (String(n['@id'] ?? '').endsWith('/#negocio') && n.address) negocio = { name: n.name, address: n.address, telephone: n.telephone, email: n.email };
  const contacto = limpio(leer(dist, 'contact-us/get-in-touch'));
  return {
    h1Home: { en: h1(home), es: h1(homeEs) },
    h1Proyectos: proyectos,
    menuEn: menu(home), menuEsDestinos: menu(homeEs)?.map(([, h]) => h),
    pieEn: pie(home), pieEsDestinos: pie(homeEs)?.map(([, h]) => h),
    frasesPie: { licensedInsured: textoPie.includes('Licensed & Insured'), copyright2026: textoPie.includes('© 2026') },
    moduloProductosHome: modulo,
    nap: { negocio, telefonosContacto: [...new Set(contacto.match(/\(\d{3}\) \d{3}-\d{4}/g) ?? [])].sort() },
    rutas,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) console.log(JSON.stringify(extraer(path.resolve(process.argv[2])), null, 2));
