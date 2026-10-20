/**
 * Puente entre las plantillas de coleccion (src/lib/plantilla.mjs) y los documentos de
 * Sanity: los huecos se agrupan en `bloque`s por la seccion en la que salen, y se leen
 * de vuelta para rellenar la plantilla.
 *
 *   aBloques(huecos, valores, alcance, conv) -> secciones[] de un documento
 *   lectorSanity(huecos, doc, docPlantilla, idioma, conv, heredados) -> lector para `rellenar`
 *
 * El alcance decide en que documento va cada hueco: `pagina` en el de la pagina,
 * `compartido` en el documento `plantilla-<tipo>` de la coleccion.
 */
const PARTES = /^((?:[LO]\d+\.)?s-?\d+\.[^.]+)/;
/** Seccion de una clave: `s0.section-hero-product.h1-x.t` -> `s0.section-hero-product`. */
export const claveBloque = (clave) => clave.match(PARTES)?.[1] ?? clave.split('.')[0];
const claveArray = (clave) => clave.replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 120);

/**
 * @param conv {{ imagen(src): object|null, enlace(href): object }}
 */
export function aBloques(huecos, valores, alcance, conv) {
  const bloques = new Map();
  const de = (clave) => {
    const k = claveBloque(clave);
    if (!bloques.has(k)) bloques.set(k, { _type: 'bloque', _key: claveArray(k), clave: k, textos: [], imagenes: [], enlaces: [], valores: [] });
    return bloques.get(k);
  };
  for (const [clave, h] of Object.entries(huecos)) {
    if (h.alcance !== alcance) continue;
    const v = valores[clave];
    if (v == null) continue;
    if (h.tipo === 'texto' || h.tipo === 'atributo') {
      // Un atributo vacio (alt="") no se guarda: el lector lo devuelve vacio.
      if (!v.en) continue;
      de(clave).textos.push({ _type: 'textoClave', _key: claveArray(clave), clave, texto: { _type: 'textoLargoI18n', en: v.en, ...(v.es != null && v.es !== '' ? { es: v.es } : {}) } });
    } else if (h.tipo === 'imagen') {
      if (v.vacia) continue;
      const img = conv.imagen(v.src);
      de(clave).imagenes.push({ _type: 'imagenClave', _key: claveArray(clave), clave, imagen: img });
    } else if (h.tipo === 'enlace') {
      de(clave).enlaces.push({ _type: 'enlaceClave', _key: claveArray(clave), clave, ...conv.enlace(v.href) });
    } else if (h.tipo === 'valor') {
      de(clave).valores.push({ _type: 'valorClave', _key: claveArray(clave), clave, valor: v.valor });
    }
  }
  return [...bloques.values()].map((b) => Object.fromEntries(Object.entries(b).filter(([, x]) => !Array.isArray(x) || x.length)));
}

function indice(doc) {
  const m = { texto: {}, imagen: {}, enlace: {}, valor: {} };
  for (const b of doc?.secciones ?? []) {
    for (const t of b.textos ?? []) m.texto[t.clave] = t.texto;
    for (const t of b.imagenes ?? []) m.imagen[t.clave] = t.imagen;
    for (const t of b.enlaces ?? []) m.enlace[t.clave] = t;
    for (const t of b.valores ?? []) m.valor[t.clave] = t.valor;
  }
  return m;
}

/**
 * @param conv {{ rutaImagen(imagen): string, hrefDe(enlace): string }}
 */
export function lectorSanity(huecos, doc, docPlantilla, idioma, conv, heredados = {}) {
  const pag = indice(doc), com = indice(docPlantilla);
  return (clave) => {
    const h = huecos[clave];
    const m = h.alcance === 'compartido' ? com : pag;
    if (h.tipo === 'heredado') return heredados[clave];
    if (h.tipo === 'texto' || h.tipo === 'atributo') {
      const t = m.texto[clave];
      if (!t) return h.tipo === 'atributo' ? '' : undefined;
      return idioma === 'es' ? (t.es ?? t.en) : t.en;
    }
    if (h.tipo === 'imagen') { const img = m.imagen[clave]; return img ? conv.rutaImagen(img) : h.respaldo; }
    if (h.tipo === 'enlace') { const e = m.enlace[clave]; return e ? conv.hrefDe(e) : undefined; }
    if (h.tipo === 'valor') return m.valor[clave];
    return undefined;
  };
}
