/**
 * Puente entre las plantillas de coleccion (src/lib/plantilla.mjs) y los documentos de
 * Sanity: los huecos se agrupan en `bloque`s por la seccion en la que salen, y se leen
 * de vuelta para rellenar la plantilla.
 *
 *   aBloques(huecos, valores, alcance, conv) -> secciones[] de un documento
 *   opcionalesA(huecos, valores, conv)       -> { <bloque opcional>: bloque } de la pagina
 *   lectorSanity(huecos, doc, docPlantilla, idioma, conv, heredados) -> lector para `rellenar`
 *
 * El alcance decide en que documento va cada hueco: `pagina` en el de la pagina,
 * `compartido` en el documento `plantilla-<tipo>` de la coleccion.
 *
 * Lo que NO se guarda: los derivados (srcset, sizes, JSON del lightbox, medidas del video),
 * las etiquetas que salen del src, el marcado heredado de Webflow y la presencia de los
 * bloques que dependen de el. Lo calcula el codigo.
 */
const PARTES = /^((?:[LO]\d+\.)?s-?\d+\.[^.]+)/;
/** Seccion de una clave: `s0.section-hero-product.h1-x.t` -> `s0.section-hero-product`. */
export const claveBloque = (clave) => clave.match(PARTES)?.[1] ?? clave.split('.')[0];
const claveArray = (clave) => clave.replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 120);

/**
 * Bloques opcionales de cada coleccion y el campo del documento que los guarda. La
 * presencia del campo es la presencia del bloque; con `cabecera`, ademas, el tipo de
 * cabecera del proyecto tiene que ser ese.
 */
export const CAMPOS_OPCIONALES = {
  'video-section': { campo: 'video' },
  'hero_media-img': { campo: 'cabeceraImagen', cabecera: 'imagen' },
  'w-video': { campo: 'cabeceraVideo', cabecera: 'video' },
};

/** Junta varios bloques en uno (un elemento de lista, un bloque opcional). */
export const plano = (bloques, extra) => {
  const r = { ...extra };
  for (const b of bloques) for (const k of ['textos', 'imagenes', 'enlaces', 'valores', 'referencias']) if (b[k]) r[k] = [...(r[k] ?? []), ...b[k]];
  return r;
};

/**
 * @param conv {{ imagen(src): object|null, enlace(href): object, referencia(coleccion, slug): object }}
 * @param prefijo  delante de cada clave guardada (los comunes de un bloque opcional: `O0.`)
 */
export function aBloques(huecos, valores, alcance, conv, prefijo = '') {
  const bloques = new Map();
  const extra = [];
  const de = (clave) => {
    const k = claveBloque(clave);
    if (!bloques.has(k)) bloques.set(k, { _type: 'bloque', _key: claveArray(k), clave: k, textos: [], imagenes: [], enlaces: [], valores: [], referencias: [] });
    return bloques.get(k);
  };
  for (const [c, h] of Object.entries(huecos)) {
    if (c.startsWith('__')) continue;
    const clave = prefijo + c;
    if (h.tipo === 'lista') {
      if (alcance === 'compartido') { extra.push(...aBloques(h.huecos, valores, 'compartido', conv, prefijo)); continue; }
      const items = valores[c] ?? [];
      bloques.set(clave, {
        _type: 'bloque', _key: claveArray(clave), clave,
        elementos: items.map((iv, n) => plano(aBloques(h.huecos, iv, 'pagina', conv), { _type: 'elementoLista', _key: `e${n}` })),
      });
      continue;
    }
    if (h.tipo === 'opcional') {
      // Los de la pagina van en su campo (opcionalesA); aqui solo los comunes.
      if (alcance === 'compartido') {
        const pre = h.huecos.__prefijoCompartidos;
        const vista = Object.fromEntries(Object.entries(valores).filter(([k]) => k.startsWith(pre)).map(([k, v]) => [k.slice(pre.length), v]));
        extra.push(...aBloques(h.huecos, vista, 'compartido', conv, pre));
      }
      continue;
    }
    if (h.alcance !== alcance) continue;
    const v = valores[c];
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
    } else if (h.tipo === 'referencia') {
      de(clave).referencias.push({ _type: 'referenciaClave', _key: claveArray(clave), clave, destino: conv.referencia(h.coleccion, v.ref) });
    }
  }
  const limpio = (b) => Object.fromEntries(Object.entries(b).filter(([, x]) => !Array.isArray(x) || x.length));
  return [...[...bloques.values()].map(limpio), ...extra];
}

/** Los bloques opcionales que tiene la pagina, cada uno en un solo `bloque`, por su nombre. */
export function opcionalesA(huecos, valores, conv) {
  const r = {};
  for (const [c, h] of Object.entries(huecos)) {
    if (h.tipo !== 'opcional' || h.siLegado || !valores[c]) continue;
    if (Object.values(h.huecos).some((x) => x?.tipo === 'lista' || x?.tipo === 'opcional')) throw new Error(`[sanity] ${c}: lista u opcional dentro de un bloque opcional`);
    const b = plano(aBloques(h.huecos, valores[c], 'pagina', conv), { _type: 'bloque', clave: h.bloque });
    if (!['textos', 'imagenes', 'enlaces', 'valores'].some((k) => b[k]?.length)) throw new Error(`[sanity] ${c}: bloque opcional sin contenido propio, su presencia no se veria`);
    r[h.bloque] = b;
  }
  return r;
}

function indice(bloques) {
  const m = { texto: {}, imagen: {}, enlace: {}, valor: {}, referencia: {}, lista: {} };
  for (const b of bloques ?? []) {
    if (b.elementos) m.lista[b.clave] = b.elementos;
    for (const t of b.textos ?? []) m.texto[t.clave] = t.texto;
    for (const t of b.imagenes ?? []) m.imagen[t.clave] = t.imagen;
    for (const t of b.enlaces ?? []) m.enlace[t.clave] = t;
    for (const t of b.valores ?? []) m.valor[t.clave] = t.valor;
    for (const t of b.referencias ?? []) m.referencia[t.clave] = t.destino;
  }
  return m;
}

/**
 * @param doc  el documento (con `secciones`), un elemento de lista o un bloque opcional
 * @param conv {{ rutaImagen(imagen): string, hrefDe(enlace): string, tarjeta(destino, idioma): string, cuerpo(doc, idioma): string }}
 * @param heredados  marcado heredado de la pagina (y `@legado` dentro de una lista)
 */
export function lectorSanity(huecos, doc, docPlantilla, idioma, conv, heredados = {}, pre = '', comIdx = null) {
  const pag = indice(doc?.secciones ?? [doc]);
  const com = comIdx ?? indice(docPlantilla?.secciones);
  const raiz = doc;
  return (clave) => {
    if (clave === '@legado') return heredados['@legado'];
    const h = huecos[clave];
    if (h.tipo === 'heredado') return heredados[clave];
    if (h.tipo === 'cuerpo') return conv.cuerpo(raiz, idioma);
    if (h.tipo === 'listado') return conv.listado(h.id, idioma);
    if (h.tipo === 'lista') {
      const legado = Boolean(heredados[clave.replace('lista:', 'heredado:')]);
      return (pag.lista[clave] ?? []).map((el) => lectorSanity(h.huecos, el, null, idioma, conv, { '@legado': legado }, pre, com));
    }
    if (h.tipo === 'opcional') {
      const subPre = pre + h.huecos.__prefijoCompartidos;
      const her = new Proxy({}, { get: (_t, k) => heredados[h.huecos.__prefijoCompartidos + String(k)] });
      if (h.siLegado) return heredados[h.siLegado] ? lectorSanity(h.huecos, { secciones: [] }, null, idioma, conv, her, subPre, com) : null;
      const def = CAMPOS_OPCIONALES[h.bloque];
      if (!def) throw new Error(`[sanity] bloque opcional sin campo: ${h.bloque}`);
      const b = raiz?.[def.campo];
      if (!b || (def.cabecera && raiz.cabecera !== def.cabecera)) return null;
      return lectorSanity(h.huecos, { secciones: [b] }, null, idioma, conv, her, subPre, com);
    }
    const m = h.alcance === 'compartido' ? com : pag;
    const k = h.alcance === 'compartido' ? pre + clave : clave;
    if (h.tipo === 'texto' || h.tipo === 'atributo') {
      const t = m.texto[k];
      if (!t) return h.tipo === 'atributo' ? '' : undefined;
      return idioma === 'es' ? (t.es ?? t.en) : t.en;
    }
    if (h.tipo === 'imagen') { const img = m.imagen[k]; return img ? conv.rutaImagen(img) : h.respaldo; }
    if (h.tipo === 'enlace') { const e = m.enlace[k]; return e ? conv.hrefDe(e) : undefined; }
    if (h.tipo === 'valor') return m.valor[k];
    if (h.tipo === 'referencia') { const d = m.referencia[k]; return d ? conv.tarjeta(d, idioma) : undefined; }
    return undefined;
  };
}

/**
 * La copia de una pagina propia (contacto, blog, gracias…) desde sus `textos` con clave
 * `a.b.0.c`: el objeto anidado que hoy vive en src/i18n, en un idioma. Las claves
 * numericas son posiciones de una lista.
 */
export function desaplanar(textos, idioma) {
  const raiz = {};
  for (const t of textos ?? []) {
    const partes = t.clave.split('.');
    let o = raiz;
    partes.forEach((k, i) => {
      if (i === partes.length - 1) { o[k] = idioma === 'es' ? (t.texto.es ?? t.texto.en) : t.texto.en; return; }
      o[k] ??= /^\d+$/.test(partes[i + 1]) ? [] : {};
      o = o[k];
    });
  }
  return raiz;
}
