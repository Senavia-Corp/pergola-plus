#!/usr/bin/env node
/**
 * Correccion de alt escritos en la noche del 21-oct (§7 y §7b del informe 06), revisados
 * foto a foto en el cierre en local:
 *   - descripcion: 4 alt de contenido que no casan con la foto (color de las lamas,
 *     cortinas a medio bajar, patio sin piscina);
 *   - terminologia: «pantalla(s)» -> «cortina(s)» y «cerramientos de» -> «con mosquitero»,
 *     como el texto visible del sitio («Cortinas motorizadas», «Cerramientos con mosquitero»).
 * Los alt en ingles de los posts son del cliente y no se tocan aqui.
 *
 *     npx sanity exec ../scripts/sanity/corregir-alts.mjs --with-user-token            # lo que cambiaria
 *     npx sanity exec ../scripts/sanity/corregir-alts.mjs --with-user-token -- --aplicar
 *     node scripts/sanity/corregir-alts.mjs --tablas   # aplica los pares a las tablas de migrar-alts-*.mjs
 *
 * Solo sustituye el texto exacto de PARES en `alt.en/es` de una imagen o en el `texto.en/es`
 * de un textoClave `*.alt`. Escribe con ifRevisionID y no toca un documento editado despues
 * de la ultima migracion (src/data/sanity-migracion.json): lo lista.
 */
import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '../..');

/** [viejo, nuevo] */
export const PARES = [
  // Descripcion (contenido, ingles y español)
  ['Dark Equinox louvered roof attached to a house over a patio, with a fenced pool behind',
    'Equinox louvered roof with a dark frame and light louvers attached to a house over a patio, with a fenced pool behind'],
  ['Techo de lamas Equinox oscuro adosado a una casa sobre un patio, con una piscina vallada detrás',
    'Techo de lamas Equinox de estructura oscura y lamas claras, adosado a una casa sobre un patio, con una piscina vallada detrás'],
  ['Dark Equinox louvered roof attached to a home, covering a patio beside a pool',
    'Equinox louvered roof with a dark frame and light louvers attached to a home, covering a patio beside a pool'],
  ['Techo de lamas Equinox oscuro adosado a una vivienda, sobre un patio junto a la piscina',
    'Techo de lamas Equinox de estructura oscura y lamas claras, adosado a una vivienda, sobre un patio junto a la piscina'],
  ['Covered lanai beside a pool with Fenetex screens rolled up', 'Covered lanai beside a pool with Fenetex screens partly lowered'],
  ['Porche cubierto junto a la piscina con las pantallas Fenetex recogidas', 'Porche cubierto junto a la piscina con las cortinas Fenetex a medio bajar'],
  ['Dark Renaissance pergola with privacy slats over a poolside patio', 'Dark Renaissance pergola with privacy slats over a paver patio with outdoor seating'],
  ['Pérgola Renaissance oscura con lamas de privacidad sobre un patio junto a la piscina',
    'Pérgola Renaissance oscura con lamas de privacidad sobre un patio de adoquines con asientos'],
  // Descripcion de las fotos de 6 posts (el ingles era del cliente y el español, su
  // traduccion): decian lo que la foto no enseña (piscina, comparacion, obra, lamas, motor, agua).
  ['Custom Renaissance pergola installed in Boca Raton, integrated with a luxury poolside patio design.',
    'Custom Renaissance pergola installed in Boca Raton, integrated with a luxury patio design.'],
  ['Pérgola Renaissance a medida instalada en Boca Raton, integrada en el diseño de un patio de lujo junto a la piscina.',
    'Pérgola Renaissance a medida instalada en Boca Raton, integrada en el diseño de un patio de lujo.'],
  ['Comparison of aluminum vs wood pergolas in high-humidity environments.',
    'Aluminum pergola with a wood-look insulated ceiling, a ceiling fan and privacy slats.'],
  ['Comparación de pérgolas de aluminio y de madera en entornos de alta humedad.',
    'Pérgola de aluminio con techo aislado de aspecto madera, ventilador y lamas de privacidad.'],
  ['Aluminum pergola installation process in South Florida',
    'Finished aluminum pergola with privacy slats and a ceiling fan beside a pool and the water in South Florida'],
  ['Proceso de instalación de una pérgola de aluminio en el sur de Florida',
    'Pérgola de aluminio terminada con lamas de privacidad y ventilador junto a una piscina y al agua en el sur de Florida'],
  ['Luxury aluminum louvered pergola in South Florida backyard',
    'Luxury aluminum pergola with a wood-look roof in a South Florida backyard'],
  ['Pérgola de lamas de aluminio de lujo en un jardín del sur de Florida',
    'Pérgola de aluminio de lujo con techo de aspecto madera en un jardín del sur de Florida'],
  ['Contemporary luxury backyard design with motorized pergola in South Florida.',
    'Contemporary luxury backyard design with an attached pergola and privacy slats in South Florida.'],
  ['Diseño contemporáneo de un jardín de lujo con pérgola motorizada en el sur de Florida.',
    'Diseño contemporáneo de un jardín de lujo con pérgola adosada y lamas de privacidad en el sur de Florida.'],
  ['Luxury aluminum pergola overlooking waterfront property in Florida.',
    'Luxury white aluminum patio cover with ceiling fans attached to a light-blue Florida home.'],
  ['Pérgola de aluminio de lujo con vistas al agua en una propiedad de Florida.',
    'Cubierta de patio de aluminio blanca de lujo, con ventiladores, adosada a una casa azul claro de Florida.'],
  // Terminologia (español)
  ['Patio cerrado con pantallas Fenetex en una casa blanca frente al césped', 'Patio cerrado con cortinas Fenetex en una casa blanca frente al césped'],
  ['Pantalla motorizada Fenetex a medio bajar sobre la abertura de un patio junto a la piscina',
    'Cortina motorizada Fenetex a medio bajar sobre la abertura de un patio junto a la piscina'],
  ['Pantallas motorizadas Fenetex bajadas en el porche cubierto de una casa con fachada de piedra',
    'Cortinas motorizadas Fenetex bajadas en el porche cubierto de una casa con fachada de piedra'],
  ['Terraza cubierta con vistas a la piscina y al agua, con las pantallas Fenetex recogidas',
    'Terraza cubierta con vistas a la piscina y al agua, con las cortinas Fenetex recogidas'],
  ['Patio cubierto con mesa de comedor y una pantalla Fenetex a medio bajar contra el sol',
    'Patio cubierto con mesa de comedor y una cortina Fenetex a medio bajar contra el sol'],
  ['Porche trasero cubierto de una casa de dos plantas junto a la piscina, con pantallas Fenetex',
    'Porche trasero cubierto de una casa de dos plantas junto a la piscina, con cortinas Fenetex'],
  ['Pantallas Fenetex bajadas en el patio cubierto de una casa de una planta', 'Cortinas Fenetex bajadas en el patio cubierto de una casa de una planta'],
  ['Fila de pantallas Fenetex oscuras bajadas a lo largo de una terraza cubierta junto a una piscina alargada',
    'Fila de cortinas Fenetex oscuras bajadas a lo largo de una terraza cubierta junto a una piscina alargada'],
  ['Pantallas Fenetex bajadas en los arcos de una casa de piedra junto a la piscina', 'Cortinas Fenetex bajadas en los arcos de una casa de piedra junto a la piscina'],
  ['Sistemas de pantallas motorizadas integrados con pérgolas y cubiertas de patio para más confort y privacidad en viviendas del sur de Florida.',
    'Sistemas de cortinas motorizadas integrados con pérgolas y cubiertas de patio para más confort y privacidad en viviendas del sur de Florida.'],
  ['Cerramientos de mosquitero instalados por profesionales, diseñados para el confort, la protección y la integración con el exterior en el sur de Florida.',
    'Cerramientos con mosquitero instalados por profesionales, diseñados para el confort, la protección y la integración con el exterior en el sur de Florida.'],
];
const NUEVO = new Map(PARES);

if (process.argv.includes('--tablas')) {
  for (const f of ['scripts/sanity/migrar-alts-contenido.mjs', 'scripts/sanity/migrar-alts-es.mjs']) {
    const p = path.join(RAIZ, f);
    let s = fs.readFileSync(p, 'utf8'), n = 0;
    for (const [v, x] of PARES) if (s.includes(`'${v}'`)) { s = s.replace(`'${v}'`, `'${x}'`); n++; }
    fs.writeFileSync(p, s);
    console.log(`${f}: ${n}`);
  }
  process.exit(0);
}

// `sanity` esta en studio/node_modules, no en la raiz.
const { createRequire } = await import('node:module');
const { getCliClient } = await import(createRequire(path.join(RAIZ, 'studio/package.json')).resolve('sanity/cli'));
const c = getCliClient({ apiVersion: '2025-01-01' });
const { ultimaMigracion } = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/sanity-migracion.json'), 'utf8'));
const docs = await c.fetch('*[!(_id in path("drafts.**")) && !(_type match "sanity.*")]');
const parches = [], saltados = [], usados = new Set();
let campos = 0;
for (const d of docs) {
  const set = {};
  const andar = (x, ruta) => {
    if (Array.isArray(x)) return x.forEach((y, i) => andar(y, `${ruta}[_key=="${y?._key}"]`.replace('[_key=="undefined"]', `[${i}]`)));
    if (!x || typeof x !== 'object') return;
    const textos = x._type === 'imagen' ? [[x.alt, `${ruta}.alt`]] : x._type === 'textoClave' && x.clave?.endsWith('.alt') ? [[x.texto, `${ruta}.texto`]] : [];
    for (const [t, r] of textos) for (const l of ['en', 'es']) if (NUEVO.has(t?.[l])) { set[`${r}.${l}`] = NUEVO.get(t[l]); usados.add(t[l]); campos++; }
    for (const [k, y] of Object.entries(x)) if (!k.startsWith('_')) andar(y, ruta ? `${ruta}.${k}` : k);
  };
  andar(d, '');
  if (!Object.keys(set).length) continue;
  if (d._updatedAt > ultimaMigracion) { saltados.push(`${d._id} (${d._updatedAt})`); continue; }
  parches.push({ id: d._id, rev: d._rev, set });
}
const sinUsar = PARES.filter(([v]) => !usados.has(v)).length;
console.log(`${parches.length} documentos, ${campos} campos; pares sin aparicion: ${sinUsar}; editados en el Studio, sin tocar: ${saltados.join(', ') || 'ninguno'}`);
for (const p of parches) console.log(`  ${p.id}: ${Object.keys(p.set).length}`);
if (process.argv.includes('--aplicar') && parches.length) {
  const tx = parches.reduce((t, p) => t.patch(p.id, (q) => q.ifRevisionId(p.rev).set(p.set)), c.transaction());
  console.log(`aplicado: ${(await tx.commit()).results.length} documentos`);
}
