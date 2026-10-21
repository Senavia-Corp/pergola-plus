/**
 * Plantilla inicial de un documento nuevo: la ESTRUCTURA de uno que ya existe (las
 * secciones con sus claves, las tarjetas de los listados, las especificaciones), con los
 * textos, las imagenes y los videos VACIOS. Las claves son las que busca la plantilla del
 * codigo (src/plantillas/<tipo>.html): con ellas la pagina nueva se pinta con el mismo
 * diseño, y como los textos y las imagenes son obligatorios, no se puede publicar a medias.
 *
 * Se conservan las referencias (enlaces a otras paginas, tarjetas de «Compare»): son
 * parte de la estructura, y se pueden cambiar.
 */
type Cliente = { fetch: (q: string, p: Record<string, unknown>) => Promise<any> };

function vaciar(x: any): any {
  if (Array.isArray(x)) return x.map(vaciar);
  if (!x || typeof x !== 'object') return x;
  // Texto en dos idiomas: sin valor (el ingles es obligatorio).
  if (x._type === 'textoI18n' || x._type === 'textoLargoI18n' || typeof x.en === 'string') return { _type: x._type ?? 'textoI18n' };
  // Imagen: sin fichero ni procedencia (los dos se eligen al subirla).
  if (x.asset) return { _type: x._type };
  if (x._type === 'reference') return x;
  if (x._type === 'valorClave') return { _type: x._type, _key: x._key, clave: x.clave };
  const out: any = {};
  for (const [k, v] of Object.entries(x)) {
    if (k === '_id' || k === '_rev' || k === '_createdAt' || k === '_updatedAt') continue;
    out[k] = vaciar(v);
  }
  return out;
}

/**
 * @param tipo    tipo del documento
 * @param campos  los campos que llevan estructura de plantilla
 */
export const plantillaInicial = (tipo: string, campos: string[]) =>
  async (_params: unknown, { getClient }: { getClient: (o: { apiVersion: string }) => Cliente }) => {
    const modelo = await getClient({ apiVersion: '2025-01-01' }).fetch(
      `*[_type == $tipo && !(_id in path("drafts.**")) && defined(secciones)] | order(_createdAt asc)[0]{${campos.join(', ')}}`,
      { tipo },
    );
    if (!modelo) return {};
    return Object.fromEntries(campos.filter((c) => modelo[c] != null).map((c) => [c, vaciar(modelo[c])]));
  };
