#!/usr/bin/env node
/**
 * Bloque S: el `alt` español de las imagenes (`imagen`) que solo lo tenian en ingles:
 * la miniatura y la principal de los 21 posts y el logo de siteSettings. Hasta ahora
 * /es/ pintaba el alt INGLES en esas fotos.
 *
 * TRADUCCION NUEVA, A REVISAR: cada texto es la traduccion del alt ingles que ya esta
 * en el documento, sin añadir nada. Lista completa en
 * implementation-reports/ENTREGA-2026-10/06-NUBE-NOCHE-2026-10-21.md.
 *
 *     node scripts/sanity/migrar-alts-es.mjs            # lo que cambiaria
 *     node scripts/sanity/migrar-alts-es.mjs --aplicar  # lo escribe (SANITY_AUTH_TOKEN)
 *
 * Solo toca un campo si su alt.en es EXACTAMENTE la clave y no tiene alt.es; un
 * documento editado despues de la ultima migracion (src/data/sanity-migracion.json) no
 * se toca y se lista.
 */
import fs from 'node:fs';
import path from 'node:path';

export const ALTS_ES_NUEVOS = {
  'Motorized screen systems integrated with pergolas and patio covers for enhanced comfort and privacy in South Florida homes.':
    'Sistemas de cortinas motorizadas integrados con pérgolas y cubiertas de patio para más confort y privacidad en viviendas del sur de Florida.',
  'Custom Renaissance pergola installed in Boca Raton, integrated with a luxury patio design.':
    'Pérgola Renaissance a medida instalada en Boca Raton, integrada en el diseño de un patio de lujo.',
  'Aluminum pergola with a wood-look insulated ceiling, a ceiling fan and privacy slats.':
    'Pérgola de aluminio con techo aislado de aspecto madera, ventilador y lamas de privacidad.',
  'Engineered insulated roof pergolas designed for heat reduction and long-term performance in South Florida outdoor living spaces.':
    'Pérgolas de techo aislado con cálculo estructural, diseñadas para reducir el calor y durar en los espacios exteriores del sur de Florida.',
  'Aluminum pergola installed in coastal Florida waterfront home':
    'Pérgola de aluminio instalada en una vivienda frente al agua en la costa de Florida',
  'Structural patio renovation with reinforced base at South Florida luxury home.':
    'Renovación estructural de un patio con base reforzada en una vivienda de lujo del sur de Florida.',
  'Professionally installed screen enclosures designed for comfort, protection, and seamless outdoor integration in South Florida.':
    'Cerramientos con mosquitero instalados por profesionales, diseñados para el confort, la protección y la integración con el exterior en el sur de Florida.',
  'Custom engineered aluminum pergola installed on luxury South Florida residence with structural reinforced columns.':
    'Pérgola de aluminio a medida con cálculo estructural, instalada en una residencia de lujo del sur de Florida con columnas reforzadas.',
  'Custom Equinox louvered pergola professionally installed in Boca Raton, engineered for luxury outdoor living in South Florida.':
    'Pérgola de lamas Equinox a medida instalada por profesionales en Boca Raton, con cálculo estructural para la vida exterior de lujo en el sur de Florida.',
  'Finished aluminum pergola with privacy slats and a ceiling fan beside a pool and the water in South Florida':
    'Pérgola de aluminio terminada con lamas de privacidad y ventilador junto a una piscina y al agua en el sur de Florida',
  'Hurricane-rated aluminum pergola in South Florida backyard':
    'Pérgola de aluminio con certificación para huracanes en un jardín del sur de Florida',
  'Custom louvered roof pergola systems professionally installed in South Florida, delivering adjustable shade and engineered durability for luxury properties.':
    'Sistemas de pérgola con techo de lamas a medida instalados por profesionales en el sur de Florida, con sombra regulable y durabilidad calculada para propiedades de lujo.',
  'Luxury aluminum pergola with a wood-look roof in a South Florida backyard':
    'Pérgola de aluminio de lujo con techo de aspecto madera en un jardín del sur de Florida',
  'Contemporary luxury backyard design with an attached pergola and privacy slats in South Florida.':
    'Diseño contemporáneo de un jardín de lujo con pérgola adosada y lamas de privacidad en el sur de Florida.',
  'Custom Equinox roof pergola installation in South Florida, designed and built for upscale residential properties.':
    'Instalación de una pérgola de techo Equinox a medida en el sur de Florida, diseñada y construida para viviendas de alto nivel.',
  'Luxury pergola integrated with outdoor kitchen and deck in South Florida residence.':
    'Pérgola de lujo integrada con cocina exterior y deck en una residencia del sur de Florida.',
  'Luxury white aluminum patio cover with ceiling fans attached to a light-blue Florida home.':
    'Cubierta de patio de aluminio blanca de lujo, con ventiladores, adosada a una casa azul claro de Florida.',
  'Modern aluminum louvered pergola installed in a tropical South Florida backyard with pool.':
    'Pérgola moderna de lamas de aluminio instalada en un jardín tropical con piscina del sur de Florida.',
  'Fully permitted patio remodeling project in South Florida luxury home.':
    'Proyecto de remodelación de patio con todos los permisos en una vivienda de lujo del sur de Florida.',
  'High-end poolside pergola design for modern Florida homes.':
    'Diseño de pérgola de alta gama junto a la piscina para viviendas modernas de Florida.',
  'Luxury outdoor living in South Florida featuring a custom pool, modern pergola with outdoor kitchen, tropical landscaping, and elegant patio design for high-end residential properties.':
    'Vida exterior de lujo en el sur de Florida con piscina a medida, pérgola moderna con cocina exterior, paisajismo tropical y un patio elegante para viviendas de alto nivel.',
  'Pergola Plus Florida logo': 'Logotipo de Pergola Plus Florida',
};

const RAIZ = path.resolve(import.meta.dirname, '../..');
if (import.meta.url === `file://${process.argv[1]}`) {
  const c = JSON.parse(fs.readFileSync(path.join(RAIZ, '.cache/sanity/contenido.json'), 'utf8'));
  const { ultimaMigracion } = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/sanity-migracion.json'), 'utf8'));
  const parches = [], saltados = [];
  for (const d of c.docs) {
    const set = {};
    for (const [campo, img] of Object.entries(d)) {
      if (img?._type !== 'imagen' || img.decorativa || img.alt?.es || !ALTS_ES_NUEVOS[img.alt?.en]) continue;
      set[`${campo}.alt.es`] = ALTS_ES_NUEVOS[img.alt.en];
    }
    if (!Object.keys(set).length) continue;
    if (d._updatedAt > ultimaMigracion) { saltados.push(`${d._id} (${d._updatedAt})`); continue; }
    parches.push({ patch: { id: d._id, ifRevisionID: d._rev, set } });
  }
  console.log(`${parches.length} documentos, ${parches.reduce((n, p) => n + Object.keys(p.patch.set).length, 0)} campos; editados en el Studio, sin tocar: ${saltados.length ? saltados.join(', ') : 'ninguno'}`);
  if (process.argv.includes('--aplicar')) {
    const P = process.env.SANITY_PROJECT_ID ?? 'n0ct9t3k', D = process.env.SANITY_DATASET ?? 'production', V = process.env.SANITY_API_VERSION ?? '2025-01-01';
    if (!process.env.SANITY_AUTH_TOKEN) { console.error('falta SANITY_AUTH_TOKEN'); process.exit(2); }
    const r = await fetch(`https://${P}.api.sanity.io/v${V}/data/mutate/${D}?returnIds=true`, {
      method: 'POST', headers: { Authorization: `Bearer ${process.env.SANITY_AUTH_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ mutations: parches }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status} ${await r.text()}`);
    console.log(`aplicado: ${(await r.json()).results.length} documentos`);
  }
}
