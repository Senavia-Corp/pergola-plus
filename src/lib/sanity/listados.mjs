/**
 * Los listados de las paginas estaticas que salen de una coleccion: la rejilla de
 * /products y /services, la galeria, la home (menu y tarjetas de producto, proyectos y
 * articulos), las marcas, los proyectos de /about-us/industries-we-serve y las ciudades
 * de cada condado en /about-us/where-we-work.
 *
 * DISEÑO EN EL CODIGO, CONTENIDO EN EL DOCUMENTO. La tarjeta de cada listado es una
 * plantilla (src/plantillas/listado-<id>.html/.json) derivada de las tarjetas que se
 * publican hoy (scripts/sanity/listados.mjs). Cada hueco de la tarjeta dice de donde sale
 * (`fuente` en el .json):
 *
 *   ruta      el enlace a la pagina del documento
 *   doc       un campo del documento que ya trae ese dato en todas las tarjetas de hoy
 *             (`ruta`: nombre, la imagen de su cabecera, un texto de sus secciones…)
 *   campo     un campo con significado propio: `sector` y `producto` del proyecto
 *   tarjeta   la copia propia de la tarjeta, en `tarjetas[<id>]` del documento
 *   (sin fuente, alcance compartido)  igual en todas: en el bloque `listado:<id>` de la
 *             pagina (p. ej. «Explore More →»)
 *
 * QUIEN ENTRA Y EN QUE ORDEN. Si la tarjeta tiene huecos `tarjeta`, entra el documento
 * que tiene su `tarjetas[<id>]`; si no (todo sale del documento), entran todos los de la
 * coleccion que pasan el filtro. El orden es el `orden` de la tarjeta; lo que no lo
 * tiene va detras, por fecha de creacion. Un documento nuevo aparece en su listado sin
 * tocar codigo.
 */
import { MARCA } from '../plantilla.mjs';

export const LISTADOS = [
  { id: 'productos', pagina: '/products', coleccion: 'product', abre: '<div role="list" class="product-grid-list w-dyn-items">' },
  { id: 'servicios', pagina: '/services', coleccion: 'service', abre: '<div role="list" class="product-grid-list w-dyn-items">' },
  { id: 'galeria', pagina: '/project-gallery', coleccion: 'project', abre: '<div role="list" class="projects-grid-list w-dyn-items">' },
  { id: 'home-menu', pagina: '/', coleccion: 'product', abre: '<div role="list" class="products-menu-list w-dyn-items">' },
  { id: 'home-productos', pagina: '/', coleccion: 'product', abre: '<div role="list" class="products-display-list w-dyn-items">' },
  { id: 'home-proyectos', pagina: '/', coleccion: 'project', abre: '<div fs-slider-element="list" role="list" class="fs-slider-projects_list w-dyn-items">' },
  { id: 'home-blog', pagina: '/', coleccion: 'post', abre: '<div fs-slider-element="list" role="list" class="fs-slider_list w-dyn-items">' },
  { id: 'marcas', pagina: '/about-us/brands', coleccion: 'brand', abre: '<div role="list" class="brands-grid-list w-dyn-items">' },
  { id: 'sectores-proyectos', pagina: '/about-us/industries-we-serve', coleccion: 'project', abre: '<div fs-slider-element="list" role="list" class="fs-slider-projects_list w-dyn-items">' },
  { id: 'zonas-miami-dade', pagina: '/about-us/where-we-work', coleccion: 'city', abre: '<div role="list" class="collection-list-2 w-dyn-items">', ocurrencia: 0, condado: 'county-miami-dade-pergola-contractor' },
  { id: 'zonas-broward', pagina: '/about-us/where-we-work', coleccion: 'city', abre: '<div role="list" class="collection-list-2 w-dyn-items">', ocurrencia: 1, condado: 'county-broward-county-pergola-contractor' },
  { id: 'zonas-palm-beach', pagina: '/about-us/where-we-work', coleccion: 'city', abre: '<div role="list" class="collection-list-2 w-dyn-items">', ocurrencia: 2, condado: 'county-palm-beach-county-pergola-contractor' },
];

/**
 * Los huecos de la galeria que son etiquetas con significado: el sector del proyecto
 * (`project.sector`, rotulo en la pagina) y su producto (`etiquetaGaleria` del primer
 * producto de `project.productos`). Las claves son las de la plantilla derivada.
 */
export const CAMPOS = {
  galeria: { 's0.div-box-detail-projects.div.t': 'sector', 's0.div-box-detail-projects.div.t-2': 'producto' },
};
/** Los rotulos de sector, por su valor (claves de texto del bloque listado:galeria). */
export const SECTORES = ['Residential', 'Commercial'];
export const claveSector = (valor) => `sector.${valor}`;

/** Posicion [desde, hasta) del interior del contenedor `abre` (n-esima aparicion), equilibrando <div>. */
export function interiorDe(html, abre, ocurrencia = 0) {
  let i = -1;
  for (let k = 0; k <= ocurrencia; k++) { i = html.indexOf(abre, i + 1); if (i < 0) throw new Error(`[listados] sin ${abre} (${ocurrencia})`); }
  const desde = i + abre.length;
  let prof = 1;
  const re = /<div\b|<\/div>/g;
  re.lastIndex = desde;
  for (let m; (m = re.exec(html));) {
    prof += m[0] === '</div>' ? -1 : 1;
    if (prof === 0) return { desde, hasta: m.index };
  }
  throw new Error(`[listados] ${abre} sin cerrar`);
}

/** Los elementos (hijos <div> de primer nivel) de un interior. */
export function elementosDe(interior) {
  const out = [];
  let i = 0;
  while (i < interior.length) {
    const abre = interior.slice(i).match(/^<div\b[^>]*>/)?.[0];
    if (!abre) throw new Error(`[listados] contenido suelto en la lista: ${interior.slice(i, i + 60)}`);
    const r = interiorDe(interior.slice(i), abre);
    const fin = i + r.hasta + '</div>'.length;
    out.push(interior.slice(i, fin));
    i = fin;
  }
  return out;
}

/** Marca de un listado dentro de la plantilla de su pagina. */
export const huecoListado = (id) => `listado:${id}`;

/** Vacia los contenedores de los listados de una pagina (EN o ES): su plantilla se deriva sin las tarjetas. */
export function vaciarListados(html, ruta) {
  let h = html;
  // De atras adelante por ocurrencia, para que las posiciones de las primeras no cambien.
  const deLaPagina = LISTADOS.filter((l) => l.pagina === ruta).sort((a, b) => (b.ocurrencia ?? 0) - (a.ocurrencia ?? 0));
  for (const l of deLaPagina) {
    const { desde, hasta } = interiorDe(h, l.abre, l.ocurrencia ?? 0);
    h = h.slice(0, desde) + h.slice(hasta);
  }
  return h;
}

/** Valor de una ruta `a[clave].b` dentro de un documento (las claves de arrays son `clave` o `_key`). */
export function valorEn(doc, ruta) {
  let x = doc;
  for (const seg of ruta.split(/\.(?![^[]*\])/)) {
    const m = seg.match(/^([^[]+)(?:\[(.+)\])?$/);
    x = x?.[m[1]];
    if (m[2] != null) x = Array.isArray(x) ? x.find((e) => e?.clave === m[2] || e?._key === m[2]) : undefined;
    if (x == null) return undefined;
  }
  return x;
}

/** El bloque `tarjetas[<id>]` de un documento. */
export const tarjetaDe = (doc, id) => doc.tarjetas?.find((b) => b.clave === id);
const ordenDe = (b) => b?.valores?.find((v) => v.clave === 'orden')?.valor;

/** Los documentos de un listado, en orden. */
export function miembros(l, huecos, docs) {
  const conTarjeta = Object.values(huecos).some((h) => h.fuente === 'tarjeta');
  return docs
    .filter((d) => d._type === l.coleccion && (!l.condado || d.condado?._ref === l.condado))
    .filter((d) => !conTarjeta || tarjetaDe(d, l.id))
    .sort((a, b) => {
      const oa = Number(ordenDe(tarjetaDe(a, l.id)) ?? Infinity), ob = Number(ordenDe(tarjetaDe(b, l.id)) ?? Infinity);
      return oa - ob || String(a._createdAt).localeCompare(String(b._createdAt)) || a._id.localeCompare(b._id);
    });
}

/** Inserta la marca de cada listado en la plantilla de su pagina (derivada con los contenedores vacios). */
export function conMarcas(plantilla, huecos, ruta) {
  let pl = plantilla;
  const nuevos = { ...huecos };
  const deLaPagina = LISTADOS.filter((l) => l.pagina === ruta);
  // Por orden de aparicion: el primer contenedor que sigue vacio es el siguiente (los ya
  // marcados dejan de estarlo), asi que las ocurrencias de un mismo contenedor casan.
  for (const l of deLaPagina.sort((a, b) => (a.ocurrencia ?? 0) - (b.ocurrencia ?? 0))) {
    const vacio = `${l.abre}</div>`;
    const i = pl.indexOf(vacio);
    if (i < 0) throw new Error(`[listados] ${ruta}: sin el contenedor vacio de ${l.id}`);
    pl = pl.slice(0, i + l.abre.length) + `${MARCA}${huecoListado(l.id)}${MARCA}` + pl.slice(i + l.abre.length);
    nuevos[huecoListado(l.id)] = { tipo: 'listado', id: l.id };
  }
  return { plantilla: pl, huecos: nuevos };
}

