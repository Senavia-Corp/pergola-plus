#!/usr/bin/env node
/**
 * El texto alternativo de las imagenes de contenido que se pintaban con alt="": las
 * galerias de marcas, ciudades/condados, proyectos e industries-we-serve, los logos de
 * marca y la foto central de industries-we-serve.
 *
 * Cada alt describe lo que se ve en la foto (revisada una a una) y, como mucho, la marca
 * o el producto de la pagina o del nombre del fichero. No lleva lugares ni datos que la
 * foto no muestre. El español es TRADUCCION NUEVA, A REVISAR.
 *
 *     node scripts/sanity/migrar-alts-contenido.mjs            # lo que cambiaria
 *     node scripts/sanity/migrar-alts-contenido.mjs --aplicar  # lo escribe (SANITY_AUTH_TOKEN)
 *
 * Añade el texto `<clave de la imagen>.alt` (textoClave) junto a la imagen, en su mismo
 * bloque, solo si falta o esta vacio. Lee los documentos de la API (no de la instantanea)
 * y escribe con ifRevisionID; no toca un documento editado despues de la ultima
 * migracion (src/data/sanity-migracion.json).
 */
import fs from 'node:fs';
import path from 'node:path';

const LOGO = (marca) => [`${marca} logo`, `Logotipo de ${marca}`];

/** Por nombre de fichero: [en, es]. */
export const ALTS = {
  'gallery-apollo-louvered-roof-systems-south-florida-01.avif': ['Apollo louvered roof pergola with ceiling fans over an outdoor kitchen and dining patio', 'Pérgola de techo de lamas Apollo con ventiladores sobre una cocina exterior y un comedor de patio'],
  'gallery-apollo-louvered-roof-systems-south-florida-10.avif': ['Underside of an Apollo louvered roof with open blades, recessed lights and a ceiling fan', 'Vista inferior de un techo de lamas Apollo con las lamas abiertas, luces empotradas y un ventilador'],
  'gallery-apollo-louvered-roof-systems-south-florida-09.avif': ['White Apollo louvered roof pergola attached to a gray house over a patio with lounge chairs and a bar', 'Pérgola de lamas Apollo blanca adosada a una casa gris, sobre un patio con sillones y una barra'],
  'gallery-apollo-louvered-roof-systems-south-florida-08.avif': ['Dark gray Apollo louvered roof pergola over a paver patio with garden steps', 'Pérgola de lamas Apollo gris oscuro sobre un patio de adoquines con escalones de jardín'],
  'gallery-apollo-louvered-roof-systems-south-florida-03.avif': ['White Apollo louvered patio cover on a raised terrace with outdoor sofas', 'Cubierta de patio de lamas Apollo blanca sobre una terraza elevada con sofás de exterior'],
  'gallery-apollo-louvered-roof-systems-south-florida-07.avif': ['Black Apollo louvered roof pergola over a patio with an outdoor fireplace, TV and dining set', 'Pérgola de lamas Apollo negra sobre un patio con chimenea exterior, televisor y comedor'],
  'gallery-apollo-louvered-roof-systems-south-florida-02.avif': ['Apollo pergola with wood-look posts and a dark louvered roof over a patio with teak furniture', 'Pérgola Apollo con postes de aspecto madera y techo de lamas oscuro sobre un patio con muebles de teca'],
  'gallery-apollo-louvered-roof-systems-south-florida-06.avif': ['Apollo louvered roof with open blades over an outdoor dining table and kitchen', 'Techo de lamas Apollo con las lamas abiertas sobre una mesa de comedor exterior y una cocina'],
  'gallery-apollo-louvered-roof-systems-south-florida-05.avif': ['Black Apollo louvered roof pergola beside a swimming pool with outdoor sofas', 'Pérgola de lamas Apollo negra junto a una piscina, con sofás de exterior'],
  'gallery-apollo-louvered-roof-systems-south-florida-04.avif': ['Apollo pergola with a wood-look frame over a paver patio with dining and lounge furniture', 'Pérgola Apollo con estructura de aspecto madera sobre un patio de adoquines con comedor y zona de estar'],
  'gallery-equinox-louvered-roof-pergolas-south-florida-02.avif': ['Dark Equinox louvered roof attached to a home, covering a patio beside a pool', 'Techo de lamas Equinox oscuro adosado a una vivienda, sobre un patio junto a la piscina'],
  'gallery-equinox-louvered-roof-pergolas-south-florida-10.avif': ['White Equinox louvered roof pergola with open blades over a side patio with seating', 'Pérgola de lamas Equinox blanca con las lamas abiertas sobre un patio lateral con asientos'],
  'gallery-equinox-louvered-roof-pergolas-south-florida-05.avif': ['Freestanding Equinox louvered pergola beside a pool with lounge furniture and a hedge', 'Pérgola de lamas Equinox exenta junto a una piscina, con muebles de exterior y un seto'],
  'gallery-equinox-louvered-roof-pergolas-south-florida-09.avif': ['White Equinox louvered pergola over a poolside patio with outdoor furniture', 'Pérgola de lamas Equinox blanca sobre un patio junto a la piscina con muebles de exterior'],
  'gallery-equinox-louvered-roof-pergolas-south-florida-08.avif': ['Freestanding Equinox louvered pergola over a poolside seating area', 'Pérgola de lamas Equinox exenta sobre una zona de estar junto a la piscina'],
  'gallery-equinox-louvered-roof-pergolas-south-florida-04.avif': ['Equinox louvered pergola with open blades shading an outdoor sofa and armchairs', 'Pérgola de lamas Equinox con las lamas abiertas que da sombra a un sofá y sillones de exterior'],
  'gallery-equinox-louvered-roof-pergolas-south-florida-03.avif': ['Close-up of white Equinox roof louvers and the motor that rotates them', 'Detalle de las lamas blancas del techo Equinox y del motor que las gira'],
  'gallery-equinox-louvered-roof-pergolas-south-florida-07.avif': ['Corner detail of a dark Equinox pergola frame and roof against the sky', 'Detalle de una esquina de la estructura y el techo de una pérgola Equinox oscura'],
  'gallery-equinox-louvered-roof-pergolas-south-florida-01.avif': ['Dark Equinox louvered roof attached to a house over a patio, with a fenced pool behind', 'Techo de lamas Equinox oscuro adosado a una casa sobre un patio, con una piscina vallada detrás'],
  'gallery-equinox-louvered-roof-pergolas-south-florida-06.avif': ['Close-up of white Equinox louvers and their pivot mechanism', 'Detalle de las lamas blancas Equinox y de su mecanismo de giro'],
  'gallery-fenetex-motorized-screens-south-florida-01.avif': ['Patio enclosed with Fenetex screens on a white house facing a lawn', 'Patio cerrado con pantallas Fenetex en una casa blanca frente al césped'],
  'gallery-fenetex-motorized-screens-south-florida-10.avif': ['Fenetex motorized screen partly lowered over a patio opening beside a pool', 'Pantalla motorizada Fenetex a medio bajar sobre la abertura de un patio junto a la piscina'],
  'gallery-fenetex-motorized-screens-south-florida-09.avif': ['Fenetex motorized screens lowered on the covered porch of a house with a stone facade', 'Pantallas motorizadas Fenetex bajadas en el porche cubierto de una casa con fachada de piedra'],
  'gallery-fenetex-motorized-screens-south-florida-07.avif': ['Covered terrace overlooking a pool and the water, with Fenetex screens rolled up', 'Terraza cubierta con vistas a la piscina y al agua, con las pantallas Fenetex recogidas'],
  'gallery-fenetex-motorized-screens-south-florida-08.avif': ['Covered patio with a dining table and a Fenetex screen partly lowered against the sun', 'Patio cubierto con mesa de comedor y una pantalla Fenetex a medio bajar contra el sol'],
  'gallery-fenetex-motorized-screens-south-florida-04.avif': ['Rear covered porch of a two-story house beside a pool, fitted with Fenetex screens', 'Porche trasero cubierto de una casa de dos plantas junto a la piscina, con pantallas Fenetex'],
  'gallery-fenetex-motorized-screens-south-florida-05.avif': ['Fenetex screens lowered on the covered patio of a single-story house', 'Pantallas Fenetex bajadas en el patio cubierto de una casa de una planta'],
  'gallery-fenetex-motorized-screens-south-florida-03.avif': ['Covered lanai beside a pool with Fenetex screens rolled up', 'Porche cubierto junto a la piscina con las pantallas Fenetex recogidas'],
  'gallery-fenetex-motorized-screens-south-florida-02.avif': ['Row of dark Fenetex screens lowered along a covered terrace beside a long pool', 'Fila de pantallas Fenetex oscuras bajadas a lo largo de una terraza cubierta junto a una piscina alargada'],
  'gallery-fenetex-motorized-screens-south-florida-06.avif': ['Fenetex screens lowered in the arches of a stone house beside a pool', 'Pantallas Fenetex bajadas en los arcos de una casa de piedra junto a la piscina'],
  'gallery-pergola-plus-florida-custom-systems-6.avif': ['Covered outdoor dining area with horizontal privacy slats, a wood-look ceiling and a ceiling fan', 'Comedor exterior cubierto con lamas de privacidad horizontales, techo de aspecto madera y ventilador'],
  'gallery-pergola-plus-florida-custom-systems-3.avif': ['Covered outdoor kitchen and lounge with a wood-look ceiling overlooking a canal', 'Cocina y zona de estar exteriores cubiertas, con techo de aspecto madera y vistas a un canal'],
  'gallery-pergola-plus-florida-custom-systems-4.avif': ['Dark freestanding pergola with a privacy wall and lounge seating on a lawn', 'Pérgola oscura exenta con pared de privacidad y zona de estar sobre el césped'],
  'gallery-pergola-plus-florida-custom-systems-2.avif': ['Dark pergola with a wood-look ceiling over an outdoor kitchen and lounge by the water', 'Pérgola oscura con techo de aspecto madera sobre una cocina exterior y una zona de estar junto al agua'],
  'gallery-pergola-plus-florida-custom-systems-8.avif': ['Dark pergola with horizontal privacy slats over an outdoor dining set beside a house', 'Pérgola oscura con lamas de privacidad horizontales sobre un comedor exterior junto a la casa'],
  'gallery-pergola-plus-florida-custom-systems-7.avif': ['Dark pergola with a slatted privacy side over a patio dining and lounge area', 'Pérgola oscura con un lateral de lamas de privacidad sobre un patio con comedor y zona de estar'],
  'gallery-pergola-plus-florida-custom-systems-5.avif': ['Dark freestanding pergola with a decorative privacy wall in a tropical garden', 'Pérgola oscura exenta con pared de privacidad decorativa en un jardín tropical'],
  'gallery-pergola-plus-florida-custom-systems-1.avif': ['Dark freestanding pergola over a lounge area beside a pool, surrounded by palms', 'Pérgola oscura exenta sobre una zona de estar junto a la piscina, rodeada de palmeras'],
  'gallery-renaissance-patio-covers-pergolas-florida-01.avif': ['Renaissance patio cover with dark beams and ceiling fans over a patio dining area', 'Cubierta de patio Renaissance con vigas oscuras y ventiladores sobre un comedor de patio'],
  'gallery-renaissance-patio-covers-pergolas-florida-10.avif': ['White Renaissance pergola with privacy slats standing in a pool', 'Pérgola Renaissance blanca con lamas de privacidad dentro de una piscina'],
  'gallery-renaissance-patio-covers-pergolas-florida-07.avif': ['Renaissance patio cover with string lights over an outdoor lounge and a stone fireplace', 'Cubierta de patio Renaissance con guirnalda de luces sobre una zona de estar y una chimenea de piedra'],
  'gallery-renaissance-patio-covers-pergolas-florida-08.avif': ['Renaissance patio cover over an outdoor kitchen beside a swimming pool', 'Cubierta de patio Renaissance sobre una cocina exterior junto a la piscina'],
  'gallery-renaissance-patio-covers-pergolas-florida-09.avif': ['Renaissance patio cover with screened sides attached to a house', 'Cubierta de patio Renaissance con laterales de mosquitero adosada a una casa'],
  'gallery-renaissance-patio-covers-pergolas-florida-05.avif': ['Dark Renaissance pergola over a backyard deck with lounge furniture', 'Pérgola Renaissance oscura sobre una terraza de jardín con muebles de exterior'],
  'gallery-renaissance-patio-covers-pergolas-florida-02.avif': ['Dark Renaissance pergola with a privacy screen over a pool deck facing a lake', 'Pérgola Renaissance oscura con pantalla de privacidad sobre una terraza de piscina frente a un lago'],
  'gallery-renaissance-patio-covers-pergolas-florida-06.avif': ['Dark Renaissance pergola with a slatted side over a paver patio with outdoor seating', 'Pérgola Renaissance oscura con lateral de lamas sobre un patio de adoquines con asientos'],
  'gallery-renaissance-patio-covers-pergolas-florida-03.avif': ['Dark Renaissance patio cover over a patio with armchairs and a wall-mounted TV', 'Cubierta de patio Renaissance oscura sobre un patio con sillones y un televisor de pared'],
  'gallery-renaissance-patio-covers-pergolas-florida-04.avif': ['White Renaissance pergola over a patio with an outdoor sectional sofa', 'Pérgola Renaissance blanca sobre un patio con un sofá modular de exterior'],
  'gallery-commercial-pergola-contractors-south-florida-06.avif': ['Louvered pergola with lighting over a resort pool lounge at dusk', 'Pérgola de lamas iluminada sobre la zona de estar de la piscina de un resort al atardecer'],
  'gallery-commercial-pergola-contractors-south-florida-07.avif': ['Light gray louvered pergola over outdoor tables at an office building', 'Pérgola de lamas gris claro sobre mesas exteriores de un edificio de oficinas'],
  'gallery-commercial-pergola-contractors-south-florida-02.avif': ['Large louvered pergola shading picnic tables in a public park', 'Gran pérgola de lamas que da sombra a mesas de picnic en un parque público'],
  'gallery-commercial-pergola-contractors-south-florida-03.avif': ['Louvered pergola over picnic tables on a lawn in a park', 'Pérgola de lamas sobre mesas de picnic en el césped de un parque'],
  'gallery-commercial-pergola-contractors-south-florida-08.avif': ['Louvered pergola with lighting over waterfront restaurant tables at sunset', 'Pérgola de lamas iluminada sobre mesas de restaurante frente al agua al atardecer'],
  'gallery-commercial-pergola-contractors-south-florida-09.avif': ['Covered restaurant terrace with louvers and ceiling fans overlooking a city skyline', 'Terraza de restaurante cubierta con lamas y ventiladores, con vistas a la ciudad'],
  'gallery-commercial-pergola-contractors-south-florida-10.avif': ['White louvered pergola with heaters over beachfront restaurant seating', 'Pérgola de lamas blanca con calefactores sobre las mesas de un restaurante frente a la playa'],
  'gallery-commercial-pergola-contractors-south-florida-01.avif': ['Lit louvered pergola over a walkway between shops', 'Pérgola de lamas iluminada sobre un paseo entre tiendas'],
  'gallery-commercial-pergola-contractors-south-florida-04.avif': ['Wood-tone pergola with lighting over an evening dining patio', 'Pérgola en tono madera iluminada sobre un patio de comedor por la noche'],
  'gallery-commercial-pergola-contractors-south-florida-05.avif': ['Dark louvered pergola over a lounge courtyard at an apartment building', 'Pérgola de lamas oscura sobre un patio con zona de estar en un edificio de apartamentos'],
  'Commercial-pergola-contractors-south-florida.avif': ['Dark aluminum pergola over the outdoor patio of a restaurant', 'Pérgola de aluminio oscura sobre el patio exterior de un restaurante'],
  'gallery-renaissance-pergola-boca-raton-poolside.avif': ['Dark Renaissance pergola with privacy slats over a poolside patio', 'Pérgola Renaissance oscura con lamas de privacidad sobre un patio junto a la piscina'],
  'gallery-renaissance-patio-cover-miami-fl.avif': ['Renaissance patio cover with translucent roof panels attached to a home', 'Cubierta de patio Renaissance con paneles de techo translúcidos adosada a una vivienda'],
  'gallery-renaissance-aluminum-pergola-broward-county.avif': ['Renaissance aluminum patio cover with screened sides on a two-story home', 'Cubierta de patio Renaissance de aluminio con laterales de mosquitero en una casa de dos plantas'],
  'gallery-modern-patio-cover-insulated-roof-palm-beach.avif': ['Freestanding pergola with an insulated roof beside a pool in a tropical garden', 'Pérgola exenta con techo aislado junto a una piscina en un jardín tropical'],
  'gallery-modern-insulated-patio-cover-boca-raton-project.avif': ['White insulated patio cover with privacy slats over an outdoor bar', 'Cubierta de patio aislada blanca con lamas de privacidad sobre una barra exterior'],
  'gallery-luxury-insulated-patio-cover-south-florida.avif': ['Dark insulated patio cover with privacy slats over a dining patio', 'Cubierta de patio aislada oscura con lamas de privacidad sobre un comedor de patio'],
  'gallery-equinox-roof-pergola-south-florida-installation.avif': ['Two freestanding Equinox louvered pergolas beside a pool deck', 'Dos pérgolas de lamas Equinox exentas junto a una terraza de piscina'],
  'gallery-equinox-luxury-pergola-palm-beach-county.avif': ['Close-up of open white Equinox roof louvers attached to a yellow house', 'Detalle de las lamas blancas abiertas de un techo Equinox adosado a una casa amarilla'],
  'gallery-equinox-louvered-pergola-project-boca-raton.avif': ['White Equinox louvered pergola over a side patio with dining chairs', 'Pérgola de lamas Equinox blanca sobre un patio lateral con sillas de comedor'],
  'gallery-equinox-aluminum-pergola-fort-lauderdale.avif': ['Freestanding Equinox louvered pergola beside a pool with lounge furniture', 'Pérgola de lamas Equinox exenta junto a una piscina con muebles de exterior'],
  'gallery-custom-insulated-patio-cover-miami-dade.avif': ['Insulated patio cover with ceiling fans over an outdoor dining area', 'Cubierta de patio aislada con ventiladores sobre un comedor exterior'],
  'gallery-aluminum-insulated-patio-cover-fort-lauderdale.avif': ['Dark aluminum insulated patio cover over an outdoor kitchen and bar by the water', 'Cubierta de patio aislada de aluminio oscura sobre una cocina exterior y una barra junto al agua'],
  'gallery-forte-pergola-residential-installation-palm-beach-gardens.avif': ['Corner of a FORTE pergola frame with its white insulated roof against the sky', 'Esquina de la estructura de una pérgola FORTE con su techo aislado blanco'],
  'gallery-luxury-pergola-palm-beach-gardens-home.avif': ['Underside of a FORTE pergola white insulated roof with a ceiling fan', 'Vista inferior del techo aislado blanco de una pérgola FORTE con ventilador'],
  'gallery-custom-forte-pergola-palm-beach-county.avif': ['FORTE pergola with a partial privacy wall over a lounge area on a lawn', 'Pérgola FORTE con pared de privacidad parcial sobre una zona de estar en el césped'],
  'hero-forte-pergola-partial-privacy-wall-palm-beach-gardens.avif': ['FORTE pergola with a partial privacy wall in a garden beside a white house', 'Pérgola FORTE con pared de privacidad parcial en un jardín junto a una casa blanca'],
  'gallery-aluminum-pergola-privacy-wall-south-florida.avif': ['FORTE pergola with dark posts and a privacy wall seen from the garden', 'Pérgola FORTE con postes oscuros y pared de privacidad vista desde el jardín'],
  'gallery-engineered-pergola-project-south-florida-coastal.avif': ['Front view of a FORTE pergola with a ceiling fan and a decorated privacy wall', 'Vista frontal de una pérgola FORTE con ventilador y una pared de privacidad decorada'],
  'gallery-forte-pergola-privacy-wall-delray-beach.avif': ['Covered dining area with horizontal privacy slats and a wood-look ceiling', 'Comedor cubierto con lamas de privacidad horizontales y techo de aspecto madera'],
  'gallery-luxury-estate-pergola-installation-broward.avif': ['White two-story home with a long pool and a pergola, with the ocean behind', 'Casa blanca de dos plantas con una piscina alargada y una pérgola, con el mar al fondo'],
  // Logos de marca (el nombre de la marca, como en su documento `brand`). Los `-h100` del
  // marquee de logos NO: alli solo el primer juego lleva alt (las copias van aria-hidden con
  // alt="") y en industries-we-serve son decorativos (check:marquee).
  'brand-logo-apollo-logo.png': LOGO('Apollo'),
  'brand-logo-equinox-logo.png': LOGO('Equinox'),
  'brand-logo-fenetex-logo.png': LOGO('Fenetex'),
  'brand-logo-renaissance-logo.png': LOGO('Renaissance'),
  'brand-logo-logo-black.svg': LOGO('Pergola Plus Forte'),
};

const RAIZ = path.resolve(import.meta.dirname, '../..');
const P = process.env.SANITY_PROJECT_ID ?? 'n0ct9t3k', D = process.env.SANITY_DATASET ?? 'production', V = process.env.SANITY_API_VERSION ?? '2025-01-01';
const api = async (ruta, cuerpo, consulta = '') => {
  const r = await fetch(`https://${P}.api.sanity.io/v${V}/data/${ruta}/${D}${cuerpo ? '?returnIds=true' : consulta}`, {
    method: cuerpo ? 'POST' : 'GET', headers: { Authorization: `Bearer ${process.env.SANITY_AUTH_TOKEN}`, 'Content-Type': 'application/json' }, body: cuerpo && JSON.stringify(cuerpo),
  });
  if (!r.ok) throw new Error(`${ruta}: HTTP ${r.status} ${await r.text()}`);
  return r.json();
};

if (import.meta.url === `file://${process.argv[1]}`) {
  if (!process.env.SANITY_AUTH_TOKEN) { console.error('falta SANITY_AUTH_TOKEN'); process.exit(2); }
  const { ultimaMigracion } = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/data/sanity-migracion.json'), 'utf8'));
  // --local: sobre la instantanea (.cache/sanity/contenido.json), para construir y comprobar antes de escribir.
  const LOCAL = process.argv.includes('--local');
  const fInst = path.join(RAIZ, '.cache/sanity/contenido.json');
  const inst = LOCAL ? JSON.parse(fs.readFileSync(fInst, 'utf8')) : null;
  const q = encodeURIComponent('*[!(_id in path("drafts.**")) && (defined(secciones) || defined(tarjetas))]');
  const docs = LOCAL ? inst.docs.filter((d) => d.secciones || d.tarjetas) : (await api(`query`, null, `?query=${q}`)).result;
  const parches = [], saltados = [], usados = new Set();
  let campos = 0;
  for (const d of docs) {
    const tocados = new Set();
    const andar = (x, top) => {
      if (Array.isArray(x)) return x.forEach((y) => andar(y, top));
      if (!x || typeof x !== 'object') return;
      if (Array.isArray(x.imagenes)) {
        for (const im of x.imagenes) {
          const fichero = path.basename(im.imagen?.origen ?? '');
          const alt = ALTS[fichero];
          if (!alt || im.imagen?.decorativa) continue;
          x.textos ??= [];
          const clave = `${im.clave}.alt`;
          const t = x.textos.find((e) => e.clave === clave);
          if (t?.texto?.en?.trim()) continue;
          const nuevo = { _key: clave.replace(/\./g, '-'), _type: 'textoClave', clave, texto: { _type: 'textoLargoI18n', en: alt[0], es: alt[1] } };
          if (t) Object.assign(t, nuevo); else x.textos.push(nuevo);
          tocados.add(top); usados.add(fichero); campos++;
        }
      }
      for (const [k, y] of Object.entries(x)) if (!k.startsWith('_')) andar(y, top);
    };
    for (const [k, v] of Object.entries(d)) if (!k.startsWith('_')) andar(v, k);
    // El logo de la tarjeta de /about-us/brands: su alt va en la tarjeta de cada marca
    // (src/plantillas/listado-marcas.json); la de FORTE no trae imagen (respaldo SVG).
    const tm = d._type === 'brand' && d.tarjetas?.find((b) => b.clave === 'marcas');
    const claveLogo = 's0.div-div-block.div-block-logo-brand.img-img-logo-brand';
    if (tm) {
      const img = tm.imagenes?.find((i) => i.clave === claveLogo);
      const alt = ALTS[path.basename(img?.imagen?.origen ?? '/cms-img/brands/pergola-plus-forte/brand-logo-logo-black.svg')];
      tm.textos ??= [];
      if (alt && !tm.textos.some((t) => t.clave === `${claveLogo}.alt` && t.texto?.en?.trim())) {
        tm.textos.push({ _key: `${claveLogo}.alt`.replace(/\./g, '-'), _type: 'textoClave', clave: `${claveLogo}.alt`, texto: { _type: 'textoLargoI18n', en: alt[0], es: alt[1] } });
        tocados.add('tarjetas'); usados.add(path.basename(img?.imagen?.origen ?? 'brand-logo-logo-black.svg')); campos++;
      }
    }
    if (!tocados.size) continue;
    if (d._updatedAt > ultimaMigracion) { saltados.push(`${d._id} (${d._updatedAt})`); continue; }
    parches.push({ patch: { id: d._id, ifRevisionID: d._rev, set: Object.fromEntries([...tocados].map((k) => [k, d[k]])) } });
  }
  const sinUsar = Object.keys(ALTS).filter((f) => !usados.has(f));
  console.log(`${parches.length} documentos, ${campos} textos alt; ficheros de la tabla sin imagen que los pida: ${sinUsar.length ? sinUsar.join(', ') : 'ninguno'}; editados en el Studio, sin tocar: ${saltados.length ? saltados.join(', ') : 'ninguno'}`);
  // --retirar-marquee: quita los alt «<marca> logo» que este script puso en los logos -h100
  // del marquee (version anterior de la tabla). Solo esos: misma clave, misma _key y ese texto.
  if (process.argv.includes('--retirar-marquee')) {
    const quitar = [];
    for (const d of docs) {
      let n = 0;
      const andarQ = (x) => {
        if (Array.isArray(x)) return x.forEach(andarQ);
        if (!x || typeof x !== 'object') return;
        if (Array.isArray(x.imagenes) && Array.isArray(x.textos)) {
          const claves = new Set(x.imagenes.filter((im) => /-h100\.avif$/.test(im.imagen?.origen ?? '')).map((im) => `${im.clave}.alt`));
          const antes = x.textos.length;
          x.textos = x.textos.filter((t) => !(claves.has(t.clave) && t._key === t.clave.replace(/\./g, '-') && /^(Apollo|Equinox|Fenetex|Renaissance|Pergola Plus Forte) logo$/.test(t.texto?.en ?? '')));
          n += antes - x.textos.length;
        }
        for (const [k, y] of Object.entries(x)) if (!k.startsWith('_')) andarQ(y);
      };
      andarQ(d.secciones);
      if (n) quitar.push({ id: d._id, n, patch: { patch: { id: d._id, ifRevisionID: d._rev, set: { secciones: d.secciones } } } });
    }
    console.log(`retirar: ${quitar.map((q) => `${q.id} ${q.n}`).join(', ') || 'nada'}`);
    if (process.argv.includes('--aplicar') && quitar.length) console.log(`aplicado: ${(await api('mutate', { mutations: quitar.map((q) => q.patch) })).results.length} documentos`);
    process.exit(0);
  }
  if (LOCAL) {
    fs.writeFileSync(fInst, JSON.stringify(inst));
    console.log('instantanea local modificada (no se ha escrito en Sanity)');
  }
  if (!LOCAL && process.argv.includes('--aplicar') && parches.length) {
    const r = await api('mutate', { mutations: parches });
    console.log(`aplicado: ${r.results.length} documentos`);
  }
}
