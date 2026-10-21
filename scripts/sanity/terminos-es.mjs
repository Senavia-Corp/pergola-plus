#!/usr/bin/env node
/**
 * Version española de los terminos (legalPage-terms-of-service), pedida por el usuario en el
 * chat el 21-oct-2026: una TRADUCCION DE CORTESIA. Abre, tras el titulo, con el aviso de que
 * prevalece la version inglesa y un enlace a ella (con ?lang=en para que enlazarEnEspanol no
 * lo reescriba a la propia pagina española). Antes de produccion deberia aprobarla el
 * cliente o su abogado: ver src/i18n/articulos.es.ts.
 *
 * La traduccion (terminos-es.json) conserva bloque a bloque la estructura del ingles
 * (_key, estilo, listas, marcas, enlaces); solo cambia el texto de cada span.
 *
 *     (cd studio && npx sanity exec ../scripts/sanity/terminos-es.mjs --with-user-token [-- --aplicar])
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const RAIZ = path.resolve(import.meta.dirname, '../..');
const { getCliClient } = await import(createRequire(path.join(RAIZ, 'studio/package.json')).resolve('sanity/cli'));
const c = getCliClient({ apiVersion: '2025-01-01' });
const ES = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'terminos-es.json'), 'utf8'));
const ID = 'legalPage-terms-of-service';

const d = await c.getDocument(ID);
if (d.cuerpo?.es?.length) { console.log('ya tiene cuerpo.es: no se toca'); process.exit(0); }
// La traduccion tiene que casar con el ingles que hay hoy en el dataset, bloque a bloque.
const en = d.cuerpo.en;
if (en.length !== ES.cuerpo_es.length || en.some((b, i) => b._key !== ES.cuerpo_es[i]._key || b.children.length !== ES.cuerpo_es[i].children.length)) {
  throw new Error('la traduccion no casa con cuerpo.en del dataset: no se escribe');
}
const aviso = {
  _key: 'b0aviso', _type: 'block', style: 'normal',
  markDefs: [{ _key: 'b0avisom0', _type: 'enlace', href: '/articles/terms-of-service/?lang=en' }],
  children: [
    { _key: 'b0avisos0', _type: 'span', marks: ['strong'], text: 'Traducción de cortesía.' },
    { _key: 'b0avisos1', _type: 'span', marks: [], text: ' Este texto se ofrece en español como ayuda. El documento que rige es la ' },
    { _key: 'b0avisos2', _type: 'span', marks: ['b0avisom0'], text: 'versión en inglés de los Terms & Conditions' },
    { _key: 'b0avisos3', _type: 'span', marks: [], text: ', que prevalece en caso de discrepancia.' },
  ],
};
const cuerpo = [ES.cuerpo_es[0], aviso, ...ES.cuerpo_es.slice(1)];
const set = {
  'cuerpo.es': cuerpo,
  'titulo.es': ES.titulo_es,
  'seo.titulo.es': ES.seo_titulo_es,
  'seo.descripcion.es': ES.seo_descripcion_es,
};
console.log(`${cuerpo.length} bloques; titulo «${ES.titulo_es}»; descripcion ${ES.seo_descripcion_es.length} caracteres`);
if (process.argv.includes('--aplicar')) console.log('aplicado', (await c.patch(ID).ifRevisionId(d._rev).set(set).commit())._updatedAt);
