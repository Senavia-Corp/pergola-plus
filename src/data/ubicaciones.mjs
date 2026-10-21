/**
 * Las 25 ciudades con pagina propia: municipio y condado. UNA fuente para los dos
 * lados que la necesitan, igual que src/i18n/rutas.mjs:
 *   - el sitio (src/lib/jsonld.ts): `areaServed` de cada pagina de ciudad con el
 *     municipio real y `containedInPlace` del condado, en vez del titulo comercial
 *     («Miami Pergola Builders») que llevaba (SD-R2 de la auditoria);
 *   - el barrido de dist/ (scripts/lib/transformar.mjs, enlazarCiudades): la linea
 *     «Also serving nearby in <condado>» que enlaza entre si a las ciudades de un
 *     mismo condado, y los enlaces desde las fichas de proyecto situadas en una ciudad.
 *
 * El condado sale de la pagina /about-us/where-we-work (los tres <h2> del CMS y las
 * ciudades que cuelgan de cada uno); el municipio es el toponimo con el que el CMS
 * titula la pagina y con el que la traduce src/i18n/ubicaciones.es.ts. Nada inventado.
 */
import { ubicacionesSanity } from '../lib/sanity/traducidas.mjs';

const CONDADOS_REPO = {
  'miami-dade-pergola-contractor': 'Miami-Dade County',
  'broward-county-pergola-contractor': 'Broward County',
  'palm-beach-county-pergola-contractor': 'Palm Beach County',
};

const CIUDADES_REPO = {
  'aventura-pergola-builders': { municipio: 'Aventura', condado: 'Miami-Dade County' },
  'coral-gables': { municipio: 'Coral Gables', condado: 'Miami-Dade County' },
  'doral-pergola-builders': { municipio: 'Doral', condado: 'Miami-Dade County' },
  'key-biscayne-pergola-builders': { municipio: 'Key Biscayne', condado: 'Miami-Dade County' },
  'miami-beach-pergola-design': { municipio: 'Miami Beach', condado: 'Miami-Dade County' },
  'miami-pergola-experts': { municipio: 'Miami', condado: 'Miami-Dade County' },
  'sunny-isles-beach-pergola-builders': { municipio: 'Sunny Isles Beach', condado: 'Miami-Dade County' },
  'cooper-city-pergola-installation': { municipio: 'Cooper City', condado: 'Broward County' },
  'coral-springs-installation': { municipio: 'Coral Springs', condado: 'Broward County' },
  'davie-installation': { municipio: 'Davie', condado: 'Broward County' },
  'fort-lauderdale-installation': { municipio: 'Fort Lauderdale', condado: 'Broward County' },
  'hollywood-pergola-installation': { municipio: 'Hollywood', condado: 'Broward County' },
  'miramar-installation': { municipio: 'Miramar', condado: 'Broward County' },
  'parkland-installation': { municipio: 'Parkland', condado: 'Broward County' },
  'pembroke-pines-pergola-installation': { municipio: 'Pembroke Pines', condado: 'Broward County' },
  'weston-pergola-solutions': { municipio: 'Weston', condado: 'Broward County' },
  'boca-raton-pergola-contractor': { municipio: 'Boca Raton', condado: 'Palm Beach County' },
  'boynton-beach-contractors': { municipio: 'Boynton Beach', condado: 'Palm Beach County' },
  'delray-beach-contractors': { municipio: 'Delray Beach', condado: 'Palm Beach County' },
  'jupiter-contractors': { municipio: 'Jupiter', condado: 'Palm Beach County' },
  'palm-beach-contractors': { municipio: 'Palm Beach', condado: 'Palm Beach County' },
  'palm-beach-gardens': { municipio: 'Palm Beach Gardens', condado: 'Palm Beach County' },
  'royal-palm-beach-contractors': { municipio: 'Royal Palm Beach', condado: 'Palm Beach County' },
  'wellington-contractors': { municipio: 'Wellington', condado: 'Palm Beach County' },
  'west-palm-beach-contractors': { municipio: 'West Palm Beach', condado: 'Palm Beach County' },
};

// Con PP_FUENTE=sanity, de los documentos county y city (src/lib/sanity/traducidas.mjs):
// una ciudad creada en el Studio entra en enlazarCiudades() y en el JSON-LD.
const S = ubicacionesSanity({ CONDADOS: CONDADOS_REPO, CIUDADES: CIUDADES_REPO });
export const CONDADOS = S?.CONDADOS ?? CONDADOS_REPO;
export const CIUDADES = S?.CIUDADES ?? CIUDADES_REPO;

/** Slug de la pagina de condado a partir de su nombre. */
export const SLUG_CONDADO = Object.fromEntries(Object.entries(CONDADOS).map(([s, n]) => [n, s]));
