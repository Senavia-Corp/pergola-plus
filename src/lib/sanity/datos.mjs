/**
 * Datos de ficha que no van en el fragmento —especificaciones y preguntas promovidas—,
 * con los MISMOS nombres y formas que sus modulos del repo, para que rutas y
 * componentes solo cambien el `import`. Con PP_FUENTE=sanity salen de los documentos
 * `product` y `service`; si no, del repo como siempre.
 */
import { ESPECIFICACIONES as E_REPO } from '../../data/especificaciones';
import { SPECS_COPY as C_REPO } from '../../i18n/especificaciones.es';
import { PROMOVIDAS as P_REPO, faqsSanity } from '../../data/faqs';
import { FUENTE, sanity, rutaDeRef } from './fuente.mjs';
import { desdeDocumento } from './especificaciones.mjs';

function deSanity() {
  const E = {}, C = { en: {}, es: {} };
  for (const d of [...sanity().deTipo('product'), ...sanity().deTipo('service')]) {
    const slug = d.slug.current;
    if (d.especificaciones) {
      const r = desdeDocumento(d.especificaciones, rutaDeRef);
      E[slug] = r.ficha; C.en[slug] = r.copy.en; C.es[slug] = r.copy.es;
    }
  }
  // Las promovidas, por el id estable de cada pregunta (src/lib/sanity/faqs.mjs).
  return { E, C, P: faqsSanity.PROMOVIDAS };
}

const D = FUENTE === 'sanity' ? deSanity() : { E: E_REPO, C: C_REPO, P: P_REPO };
export const ESPECIFICACIONES = D.E;
export const SPECS_COPY = D.C;
export const PROMOVIDAS = D.P;

/** Igual que filasDe de src/i18n/especificaciones.es.ts, sobre la fuente activa. */
export function filasDe(idioma, slug, ids) {
  const copy = D.C[idioma][slug];
  if (!copy) throw new Error(`[especificaciones] "${slug}" no tiene copy en ${idioma}`);
  return ids.map((id) => {
    const f = copy.filas[id];
    if (!f) throw new Error(`[especificaciones] ${slug}: la fila "${id}" no tiene copy en ${idioma}`);
    return f;
  });
}
