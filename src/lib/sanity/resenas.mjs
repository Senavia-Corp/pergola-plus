/**
 * Las reseñas desde Sanity (`review` + `siteSettings.resumenResenas`) con la forma del
 * snapshot src/data/reviews-google.json, que es lo que lee src/lib/reviews.ts.
 * Pura: recibe la instantanea (scripts/sanity/paridad.mjs la compara con el JSON).
 */
export function resenasDesde(c) {
  const s = c.doc('siteSettings');
  const r = s.resumenResenas ?? {};
  return {
    actualizado: r.actualizado ?? null,
    parcial: r.parcial === true,
    perfil: { nombre: s.nombreComercial, url: r.fichaGoogle ?? null },
    resumenPublico: r.media != null ? { media: r.media, total: r.total, leidoEl: r.leidoEl, fuente: r.fuente } : null,
    resenas: c.deTipo('review')
      .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
      .map((d) => ({
        id: d.idOrigen ?? d._id,
        autor: d.autor,
        rating: d.estrellas,
        fechaISO: d.fecha,
        texto: d.texto,
        idioma: d.idioma,
        'respuestaDueño': d.respuestaDueno ?? null,
        urlOrigen: d.enlace,
      })),
  };
}
