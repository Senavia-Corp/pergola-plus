#!/usr/bin/env node
/**
 * Barrido de TODAS las paginas construidas. Sobre dist/, tras `npm run build`.
 *
 *     npm run check:paginas
 *
 * Busca lo que se escapa de las otras puertas: contenido roto que sale a la vista.
 * No mide SEO, ni enlaces, ni animaciones — eso ya lo hacen check:seo,
 * check:enlaces y check:paridad. Aqui se mira lo que leeria una persona.
 *
 * Los cinco fallos que persigue tienen algo en comun: el build pasa, no hay error en
 * consola, y la pagina se sirve con un `undefined` en medio de una frase.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { raizHtml } from './lib/dist.mjs';

const DIST = await raizHtml();
const RAIZ = path.resolve(import.meta.dirname, '..');

let fallos = 0;
const decir = (ok, msg, detalle = []) => {
  console.log(`  ${ok ? 'ok   ' : 'FALLO'} ${msg}`);
  if (!ok) {
    fallos++;
    for (const d of detalle.slice(0, 12)) console.log(`         ${d}`);
    if (detalle.length > 12) console.log(`         ... y ${detalle.length - 12} mas`);
  }
};

const htmls = (await fs.readdir(DIST, { recursive: true })).filter((p) => p.endsWith('.html'));
const ruta = (rel) => '/' + rel.replace(/index\.html$/, '').replace(/\.html$/, '');

/**
 * Restos de plantilla que NUNCA deben llegar al HTML servido.
 *
 * `undefined` y `NaN` salen de un campo del CMS que no existe; `[object Object]` de
 * concatenar un objeto; `{{` de una interpolacion que no se resolvio. Los cuatro se
 * ven en pantalla y ninguno rompe el build.
 */
const BASURA = [
  { patron: /undefined/, nombre: 'undefined' },
  { patron: /\bNaN\b/, nombre: 'NaN' },
  { patron: /\[object Object\]/, nombre: '[object Object]' },
  { patron: /\{\{/, nombre: '{{ sin resolver' },
  // El placeholder que Webflow deja cuando una coleccion sale vacia. En una pagina
  // servida significa una lista que el visitante ve como un hueco.
  { patron: /No items found/, nombre: '"No items found." (coleccion vacia)' },
];

/**
 * Clases y atributos que OCULTAN un bloque, con su contenido.
 *
 * Sin esto la sonda lee texto que nadie ve y reporta fallos que no lo son: la
 * primera version canto «No items found.» en 27 paginas, y ese bloque va dentro de
 * `.w-dyn-hide`, que el CSS de Webflow marca `display:none !important`. Es el
 * placeholder de coleccion vacia que Webflow deja SIEMPRE en el markup y oculta
 * cuando la coleccion trae items.
 *
 * Distinto es `w-dyn-bind-empty`, que SI se ve: ese es un campo vacio de verdad y lo
 * caza check:seo.
 */
/**
 * Bloques que el CSS oculta, con su texto dentro.
 *
 * Son PATRONES CONCRETOS y no una regla general a proposito. La primera version
 * intentaba eliminar cualquier elemento con una clase oculta usando una expresion
 * con anidamiento, y salio peor: dejaba fragmentos sueltos y llego a DUPLICAR el
 * texto que queria quitar. Estos placeholders tienen una forma fija y conocida, asi
 * que se caza esa forma.
 *
 * ponytail: sin parser de HTML. Meter uno para tres patrones son 300 KB de
 * dependencia; si algun dia hacen falta reglas de visibilidad de verdad, aqui es
 * donde iria.
 */
const PLANTILLAS_OCULTAS = [
  // Webflow: placeholder de coleccion vacia. `.w-dyn-hide` es display:none
  // !important en webflow.css, asi que este texto NO lo ve nadie.
  /<div[^>]*\bw-dyn-hide\b[^>]*>\s*<div[^>]*>[^<]*<\/div>\s*<\/div>/gi,
  // Propios: la trampa para bots y la etiqueta oculta del pie.
  /<div[^>]*\bpp-trampa\b[^>]*>[\s\S]*?<\/div>/gi,
  /<label[^>]*\bpp-trampa\b[^>]*>[^<]*<\/label>/gi,
];

/** Texto que una persona ve de verdad: sin scripts, sin estilos, sin bloques ocultos. */
function visible(html) {
  let cuerpo = html.slice(html.indexOf('<body'), html.lastIndexOf('</body>'));
  cuerpo = cuerpo
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');
  for (const re of PLANTILLAS_OCULTAS) cuerpo = cuerpo.replace(re, ' ');
  return cuerpo
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const conBasura = [];
const vacias = [];
const sinTitulo = [];
const srcVacio = [];
const anclasRotas = [];

// Indice de rutas servidas, para comprobar los enlaces internos sin red.
const servidas = new Set(htmls.map(ruta));

for (const rel of htmls) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  const r = ruta(rel);
  const texto = visible(html);

  // 1. Restos de plantilla. Se busca en el TEXTO VISIBLE, no en el HTML: `undefined`
  //    dentro de un bloque JSON-LD o de un script empaquetado es normal.
  for (const { patron, nombre } of BASURA) {
    if (patron.test(texto)) {
      const i = texto.search(patron);
      conBasura.push(`${r}: ${nombre} — "…${texto.slice(Math.max(0, i - 40), i + 40)}…"`);
    }
  }

  // 2. Paginas sin contenido. El umbral es bajo a proposito: solo caza una pagina
  //    realmente vacia, no una corta. El 404 y las de utilidad quedan fuera.
  if (texto.split(' ').length < 60 && !/404/.test(r)) vacias.push(`${r} (${texto.split(' ').length} palabras)`);

  // 3. <title> presente y no vacio.
  const t = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
  if (!t) sinTitulo.push(r);

  // 4. src o href vacios: son peticiones a la PROPIA pagina, que la descargan dos
  //    veces. Un <img src=""> es un fallo silencioso clasico del CMS.
  for (const [, attr] of html.matchAll(/\s(src|href)=""/g)) srcVacio.push(`${r}: ${attr}=""`);

  // 5. Anclas internas que no existen en la pagina. Un boton "Ver galeria" que salta
  //    a ninguna parte se siente roto sin dar error.
  for (const [, ancla] of html.matchAll(/href="#([A-Za-z][^"]*)"/g)) {
    if (!html.includes(`id="${ancla}"`)) anclasRotas.push(`${r}: #${ancla}`);
  }
}

console.log(`  ${htmls.length} paginas\n`);
decir(conBasura.length === 0, 'ninguna pagina muestra restos de plantilla', conBasura);
decir(vacias.length === 0, 'ninguna pagina llega vacia', vacias);
decir(sinTitulo.length === 0, 'toda pagina tiene <title>', sinTitulo);
decir(srcVacio.length === 0, 'ningun src ni href vacio', srcVacio);
decir(anclasRotas.length === 0, 'toda ancla interna apunta a un id que existe', anclasRotas);

// --- enlaces internos que no llevan a ninguna pagina construida --------------
// check:enlaces mira los href="#"; esto mira los que SI tienen ruta pero apuntan a
// una pagina que no existe. Es lo que deja un 404 en el sitio propio.
const aNingunSitio = new Map();
for (const rel of htmls) {
  const html = await fs.readFile(path.join(DIST, rel), 'utf8');
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    // Solo se miran ENLACES a paginas. Un .css o un .woff2 no es una pagina, y
    // /_astro/ son los assets que empaqueta Astro.
    if (/\.(xml|txt|json|css|js|mjs|jpg|jpeg|png|svg|avif|webp|gif|pdf|ico|woff2?|mp4|webm)$/i.test(href)) continue;
    if (href.startsWith('/_astro/')) continue;
    const normal = href.endsWith('/') ? href : href + '/';
    if (servidas.has(href) || servidas.has(normal) || servidas.has(href.replace(/\/$/, ''))) continue;
    if (!aNingunSitio.has(href)) aNingunSitio.set(href, ruta(rel));
  }
}
decir(
  aNingunSitio.size === 0,
  'todo enlace interno lleva a una pagina que existe',
  [...aNingunSitio].map(([h, desde]) => `${h}  (p.ej. desde ${desde})`),
);


// --- resenas: que no aparezca ni una inventada -------------------------------
//
// La pagina de testimonios muestra hoy la nota agregada (5,0 de 27) leida de la
// ficha publica y transcrita a mano, con su fuente y su fecha en pantalla, mas el
// enlace al perfil. Lo que NO tiene es el TEXTO de las resenas, porque en este repo
// no existe: el widget de Elfsight nunca metio texto en el HTML.
//
// Esta puerta vigila el limite. Un testimonio inventado en el sitio de un
// contratista no es un detalle de maquetacion —es fraude publicitario y en EE. UU.
// expone al cliente ante la FTC— y es justo el atajo que tienta cuando la seccion
// se ve vacia.
{
  const snapshot = JSON.parse(
    await fs.readFile(path.join(RAIZ, 'src/data/reviews-google.json'), 'utf8'),
  );
  const nResenas = snapshot.resenas.length;

  // El carrusel solo puede existir si hay resenas de verdad en el snapshot.
  const conCarrusel = [];
  for (const rel of htmls) {
    const html = await fs.readFile(path.join(DIST, rel), 'utf8');
    // El ELEMENTO, no la cadena: `.fs-slider-resenas_slide{...}` aparece en el CSS
    // que Astro inlinea en el <head> de cada pagina, asi que buscar el nombre a
    // secas daba 20 falsos positivos.
    if (/<div[^>]*fs-slider-element="slide"[^>]*fs-slider-resenas_slide/.test(html)) {
      conCarrusel.push(rel);
    }
  }
  decir(
    nResenas > 0 || conCarrusel.length === 0,
    `sin resenas en el snapshot no se pinta ningun carrusel de resenas (${conCarrusel.length} paginas lo pintan)`,
    conCarrusel,
  );

  // Y si algun dia hay resenas, cada una tiene que traer su origen: una cita sin
  // enlace a la resena real es indistinguible de una escrita por la casa.
  const sinOrigen = (snapshot.resenas ?? []).filter((r) => !r.urlOrigen || !r.autor);
  decir(sinOrigen.length === 0, 'toda resena del snapshot trae autor y enlace de origen');

  // La nota transcrita tiene que decir de cuando es: envejece.
  const rp = snapshot.resumenPublico;
  decir(
    !rp || /^\d{4}-\d{2}-\d{2}$/.test(rp.leidoEl ?? ''),
    'la nota transcrita de la ficha lleva su fecha de lectura',
    [JSON.stringify(rp ?? null)],
  );
}

if (fallos) {
  console.log(`\n${fallos} fallo(s).`);
  process.exit(1);
}
console.log('\n  Todo en verde.');
