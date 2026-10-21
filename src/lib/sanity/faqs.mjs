/**
 * La biblioteca de preguntas desde Sanity (`faq`, `faqTopic`, `faqTheme` y las
 * promovidas de `product`/`service`), con la forma de src/data/faqs.ts y
 * src/i18n/faqs.es.ts. Pura: scripts/sanity/paridad.mjs la compara con el repo.
 *
 * @param c       la instantanea
 * @param rutaDe  referencia -> ruta del sitio (src/lib/sanity/fuente.mjs: rutaDeRef)
 */
export function faqsDesde(c, rutaDe) {
  const por = (t) => c.deTipo(t).sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
  const clave = (ref) => {
    const d = c.doc(ref._ref);
    if (!d?.clave) throw new Error(`[faqs] referencia a un chip o tema que no existe: ${ref._ref}`);
    return d.clave;
  };
  const chips = por('faqTopic'), temas = por('faqTheme'), docs = por('faq');
  const copia = (lista) => ({
    en: Object.fromEntries(lista.map((d) => [d.clave, d.nombre.en])),
    es: Object.fromEntries(lista.filter((d) => d.nombre.es).map((d) => [d.clave, d.nombre.es])),
  });
  const idDe = new Map(docs.map((d) => [d._id, d.idEstable]));
  const FAQS = docs.map((d) => ({
    id: d.idEstable,
    chip: clave(d.chip),
    tema: clave(d.tema),
    origen: d.origen,
    ...(d.enlace ? { enlace: rutaDe(d.enlace) } : {}),
    ...(d.destacada ? { destacada: true } : {}),
    ...(d.claves?.length ? { claves: [...d.claves] } : {}),
  }));
  const FAQS_COPY = { en: {}, es: {} };
  for (const d of docs) {
    for (const idioma of ['en', 'es']) {
      if (!d.pregunta[idioma] || !d.respuesta[idioma]) continue;
      FAQS_COPY[idioma][d.idEstable] = { pregunta: d.pregunta[idioma], respuesta: d.respuesta[idioma], ...(d.sinonimos?.[idioma] ? { claves: d.sinonimos[idioma] } : {}) };
    }
  }
  // Las fichas: el tema que coincide con el slug de un producto o servicio.
  const fichas = new Set([...c.deTipo('product'), ...c.deTipo('service')].map((d) => d.slug.current));
  const PROMOVIDAS = {};
  for (const d of [...c.deTipo('product'), ...c.deTipo('service')]) {
    if (d.faqsPromovidas?.length) PROMOVIDAS[d.slug.current] = d.faqsPromovidas.map((r) => {
      const id = idDe.get(r._ref);
      if (!id) throw new Error(`[faqs] ${d._id}: pregunta promovida que no existe (${r._ref})`);
      return id;
    });
  }
  return {
    CHIPS: chips.map((d) => d.clave),
    TEMAS_FICHA: new Set(temas.map((d) => d.clave).filter((t) => fichas.has(t))),
    PROMOVIDAS,
    FAQS,
    CHIPS_COPY: copia(chips),
    TEMAS_COPY: copia(temas),
    FAQS_COPY,
  };
}
