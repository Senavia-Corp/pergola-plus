/**
 * `product.especificaciones` (Sanity) -> las dos piezas que pintan la seccion de hoy:
 * el registro (`ESPECIFICACIONES[slug]`, src/data/especificaciones.ts) y la copia por
 * idioma (`SPECS_COPY[idioma][slug]`, src/i18n/especificaciones.es.ts). La migracion
 * comprueba con esta misma funcion que el documento las reproduce exactas.
 *
 * @param x  el objeto `especificaciones`
 * @param rutaDeRef  referencia -> ruta del sitio (sin barra final)
 */
export function desdeDocumento(x, rutaDeRef) {
  const t = (v, idioma) => (idioma === 'es' ? v?.es ?? v?.en : v?.en);
  const ficha = {
    filas: x.filas.map((f) => f.id),
    enGrafo: x.filas.filter((f) => f.enDatosEstructurados).map((f) => f.id),
    ...(x.material ? { material: x.material } : {}),
    huecos: (x.huecos ?? []).map((h) => h.id),
    enlaces: (x.enlaces ?? []).map((e) => ({ id: e.id, ruta: rutaDeRef(e.destino), junto: e.junto })),
  };
  const copia = (idioma) => ({
    titulo: t(x.titulo, idioma),
    entradilla: t(x.entradilla, idioma),
    huecosTitulo: t(x.huecosTitulo, idioma),
    huecosEntradilla: t(x.huecosEntradilla, idioma),
    ctaTexto: t(x.ctaTexto, idioma),
    filas: Object.fromEntries(x.filas.map((f) => [f.id, { etiqueta: t(f.etiqueta, idioma), valor: t(f.valor, idioma) }])),
    huecos: Object.fromEntries((x.huecos ?? []).map((h) => [h.id, t(h.texto, idioma)])),
    enlaces: Object.fromEntries((x.enlaces ?? []).map((e) => [e.id, t(e.texto, idioma)])),
  });
  return { ficha, copy: { en: copia('en'), es: copia('es') } };
}
