#!/usr/bin/env node
/**
 * Deriva la tarjeta de cada listado (src/lib/sanity/listados.mjs) a partir de las tarjetas
 * que se publican hoy, y decide de donde sale cada hueco.
 *
 *     node scripts/sanity/listados.mjs [--escribir]    # contra la instantanea del dataset
 *
 * Con --escribir guarda src/plantillas/listado-<id>.html y .json. La migracion
 * (scripts/migrar-a-sanity.mjs) usa derivarListados() con sus propios documentos y exige
 * que la plantilla del codigo sea la misma.
 *
 * COMO SE DERIVA
 *   1. Las tarjetas del contenedor (EN y su ES), cada una como una «pagina» de una
 *      coleccion: derivarColeccion de plantillas.mjs da la plantilla de la tarjeta, sus
 *      huecos y los valores de cada una. El `data-product` (gancho del script de las
 *      fichas) sale del codigo, como en la tarjeta de «Compare».
 *   2. Cada tarjeta es la de un documento: el del enlace de la tarjeta.
 *   3. Fuente de cada hueco por tarjeta: `ruta` si es el enlace a su pagina; `doc` si un
 *      mismo campo del documento trae ese valor (EN y ES) en TODAS las tarjetas; `campo`
 *      para el sector y el producto de la galeria; si no, `tarjeta` (copia propia).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { derivarColeccion, paridad } from './plantillas.mjs';
import { MARCA } from '../../src/lib/plantilla.mjs';
import { decodificar } from '../../src/lib/portable.mjs';
import { LISTADOS, CAMPOS, interiorDe, elementosDe } from '../../src/lib/sanity/listados.mjs';
export { conMarcas } from '../../src/lib/sanity/listados.mjs';

const RAIZ = path.resolve(import.meta.dirname, '../..');
const DP = 'data-pp-dp="DP"';
const sinBarra = (r) => r.replace(/[?#].*$/, '').replace(/\/+$/, '') || '/';

/** Rutas de los textos i18n y de las imagenes de un documento (las de arrays, por su clave). */
function candidatos(doc) {
  const textos = [], imagenes = [];
  const andar = (x, ruta) => {
    if (Array.isArray(x)) return x.forEach((y, i) => andar(y, `${ruta}[${y?.clave ?? y?._key ?? i}]`));
    if (!x || typeof x !== 'object') return;
    if (typeof x.en === 'string') textos.push({ ruta, v: x });
    if (x.origen && (x.asset || x._sanityAsset)) imagenes.push({ ruta, v: x.origen });
    for (const [k, y] of Object.entries(x)) if (!k.startsWith('_') && k !== 'tarjetas') andar(y, ruta ? `${ruta}.${k}` : k);
  };
  andar(doc, '');
  return { textos, imagenes };
}

/**
 * @param paginas  estaticasDe() con el fragmento COMPLETO (enCompleto/esCompleto)
 * @param docs     los documentos (de la migracion o de la instantanea)
 * @param rutaDe   documento -> ruta del sitio
 */
export function derivarListados(paginas, docs, rutaDe) {
  const out = [];
  for (const l of LISTADOS) {
    const p = paginas.find((x) => x.ruta === l.pagina);
    if (!p) throw new Error(`[listados] ${l.id}: pagina ${l.pagina} sin fragmento`);
    const trozos = (h) => { const r = interiorDe(h, l.abre, l.ocurrencia ?? 0); return elementosDe(h.slice(r.desde, r.hasta)); };
    const en = trozos(p.enCompleto), es = trozos(p.esCompleto);
    if (en.length !== es.length) throw new Error(`[listados] ${l.id}: ${en.length} tarjetas en ingles y ${es.length} en español`);
    const conDp = en.some((h) => /data-product="/.test(h));
    const prep = (h) => h.replace(/data-product="[^"]*"/, DP);
    const tarjetas = en.map((h, i) => {
      const href = h.match(/href="([^"]+)"/)?.[1];
      if (!href) throw new Error(`[listados] ${l.id}: tarjeta ${i} sin enlace`);
      const doc = docs.find((d) => d._type === l.coleccion && rutaDe(d) === sinBarra(href));
      if (!doc) throw new Error(`[listados] ${l.id}: la tarjeta ${href} no es de ningun ${l.coleccion}`);
      return { slug: doc._id, doc, en: prep(h), es: prep(es[i]) };
    });
    const d = derivarColeccion(tarjetas);
    if (d.heredados?.some((x) => Object.keys(x).length)) throw new Error(`[listados] ${l.id}: tarjetas con marcado heredado de Webflow`);
    const fallos = paridad(d, tarjetas);
    if (fallos.length) throw new Error(`[listados] ${l.id}: paridad de la tarjeta\n${fallos.join('\n')}`);

    const huecos = {};
    for (const [k, h] of Object.entries(d.huecos)) {
      huecos[k] = { ...h };
      if (h.alcance !== 'pagina' || !['texto', 'atributo', 'imagen', 'enlace'].includes(h.tipo)) continue;
      const campo = CAMPOS[l.id]?.[k];
      if (campo) { huecos[k].fuente = 'campo'; huecos[k].campo = campo; continue; }
      const vs = tarjetas.map((_t, i) => d.valores[i][k]);
      if (h.tipo === 'enlace' && tarjetas.every((t, i) => vs[i] && sinBarra(vs[i].href) === rutaDe(t.doc))) { huecos[k].fuente = 'ruta'; continue; }
      // La ruta de campo comun a todas las tarjetas, si la hay.
      let comun = null;
      tarjetas.forEach((t, i) => {
        const v = vs[i];
        const { textos, imagenes } = candidatos(t.doc);
        let rs = [];
        if (v == null) rs = [];
        else if (h.tipo === 'imagen') rs = v.vacia ? [] : imagenes.filter((x) => x.v === v.src).map((x) => x.ruta);
        else if (h.tipo !== 'enlace') {
          const ve = decodificar(v.en), ves = v.es != null ? decodificar(v.es) : ve;
          rs = textos.filter((x) => x.v.en === ve && (x.v.es ?? x.v.en) === ves).map((x) => x.ruta);
        }
        comun = comun == null ? rs : comun.filter((r) => rs.includes(r));
      });
      // Determinista: la mas corta y, a igualdad, la primera por orden alfabetico (el orden
      // de las claves del documento no es el mismo en la migracion que en la API).
      comun?.sort((a, b) => a.length - b.length || a.localeCompare(b));
      if (comun?.length) { huecos[k].fuente = 'doc'; huecos[k].ruta = comun[0]; } else huecos[k].fuente = 'tarjeta';
    }
    let plantilla = d.plantilla;
    if (conDp) {
      if (plantilla.split(DP).length !== 2) throw new Error(`[listados] ${l.id}: data-product inesperado`);
      plantilla = plantilla.replace(DP, `data-product="${MARCA}tarjeta.dataProduct${MARCA}"`);
      huecos['tarjeta.dataProduct'] = { tipo: 'valor', alcance: 'codigo', de: 'DATA_PRODUCT[slug] en scripts/lib/fichas.mjs' };
    }
    // Lo que va en cada documento: los huecos `tarjeta` y su posicion. Y los campos.
    const porDoc = tarjetas.map((t, i) => ({
      id: t.doc._id,
      orden: i,
      valores: Object.fromEntries(Object.entries(huecos).filter(([, h]) => h.fuente === 'tarjeta').map(([k]) => [k, d.valores[i][k]]).filter(([, v]) => v != null)),
      campos: Object.fromEntries(Object.entries(huecos).filter(([, h]) => h.fuente === 'campo').map(([k, h]) => [h.campo, d.valores[i][k]])),
    }));
    out.push({ l, plantilla, huecos, porDoc, compartidos: d.compartidos });
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.chdir(RAIZ);
  const { estaticasDe } = await import('./plantillas.mjs');
  const { cerrarTs } = await import('./cargar-ts.mjs');
  const { rutaDe } = await import('../../src/lib/rutas-sanity.mjs');
  const paginas = await estaticasDe();
  await cerrarTs();
  const c = JSON.parse(await fs.readFile(path.join(RAIZ, '.cache/sanity/contenido.json'), 'utf8'));
  const r = derivarListados(paginas, c.docs, rutaDe);
  for (const x of r) {
    const fuentes = {};
    for (const h of Object.values(x.huecos)) if (h.fuente) fuentes[h.fuente] = (fuentes[h.fuente] ?? 0) + 1;
    console.log(`${x.l.id.padEnd(20)} ${String(x.porDoc.length).padStart(2)} tarjetas · ${JSON.stringify(fuentes)} · compartidos ${Object.keys(x.compartidos).length}`);
    if (process.argv.includes('--escribir')) {
      await fs.writeFile(path.join(RAIZ, `src/plantillas/listado-${x.l.id}.html`), x.plantilla);
      await fs.writeFile(path.join(RAIZ, `src/plantillas/listado-${x.l.id}.json`), JSON.stringify(x.huecos, null, 1) + '\n');
    }
  }
}
