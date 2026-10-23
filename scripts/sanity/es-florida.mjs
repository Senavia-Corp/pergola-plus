/**
 * Español de Florida (docs/seo-loop/glosario-es-florida.json, C3): reglas de sustitución con
 * concordancia (el vallado → la cerca, la cochera → el carport, el adoquinado → los pavers…).
 * Las usan scripts/sanity/loop-borradores.mjs --glosario (Sanity) y loop-glosario-codigo.mjs (src/i18n).
 */
const L = '\\p{L}';
const conMayus = (orig, nuevo) => (orig[0] === orig[0].toUpperCase() && orig[0] !== orig[0].toLowerCase() ? nuevo[0].toUpperCase() + nuevo.slice(1) : nuevo);
const R = (patron, f) => ({ re: new RegExp(`(?<![${L}])${patron}(?![${L}])`, 'gu'), f });
// [sustantivo español] -> reglas de artículo + sustantivo
const ART = (lista, sustituto) => lista.map(([a, b]) => R(`${a}`, (m) => conMayus(m, b)));

// Frases que no se arreglan con una sustitución: se reescriben enteras (mismo sentido).
export const FRASES = {
  '¿Cuánto debería durar un adoquinado?': '¿Cuánto deberían durar los pavers?',
  'Lo cerca que puede estar de la valla': 'A qué distancia puede quedar de la cerca',
  'Con la comunidad aprobada (si hacía falta), el expediente entra en el ayuntamiento.': 'Con la aprobación de la HOA (si hacía falta), la solicitud se presenta en la ciudad.',
};
export const REGLAS = [
  R('Boca Ratón', () => 'Boca Raton'),
  R('[Ee]ntradas de (?:coches|vehículos|coche)', (m) => conMayus(m, 'entradas de autos')),
  R('[Ee]ntrada de (?:coches|vehículos|coche)', (m) => conMayus(m, 'entrada de autos')),
  R('[Cc]oches', (m) => conMayus(m, 'autos')),
  R('[Cc]oche', (m) => conMayus(m, 'auto')),
  R('[Cc]ontacte con nosotros', (m) => conMayus(m, 'contáctenos')),
  R('[Cc]ontacte con', (m) => conMayus(m, 'comuníquese con')),
  R('(el|su|al|del|un|tu|[Tt]eléfono) móvil', (m, a) => `${a} celular`),
  R('[Hh]ormigones', (m) => conMayus(m, 'concretos')),
  R('[Hh]ormigón', (m) => conMayus(m, 'concreto')),
  // vallado/valla -> cerca (femenino)
  ...ART([
    ['[Ee]l vallado', 'la cerca'], ['[Uu]n vallado', 'una cerca'], ['[Ll]os vallados', 'las cercas'], ['[Dd]el vallado', 'de la cerca'],
    ['[Aa]l vallado', 'a la cerca'], ['[Ee]ste vallado', 'esta cerca'], ['[Ss]u vallado', 'su cerca'], ['[Nn]uestro vallado', 'nuestra cerca'],
    ['[Dd]e vallado', 'de cercas'], ['[Ee]l vallados', 'las cercas'], ['[Uu]n buen vallado', 'una buena cerca'], ['[Bb]uen vallado', 'buena cerca'], ['[Nn]uestros vallados', 'nuestras cercas'], ['[Nn]uestro vallado', 'nuestra cerca'], ['[Ss]u vallado', 'su cerca'],
  ]),
  R('[Vv]allados', (m) => conMayus(m, 'cercas')),
  R('[Vv]allado', (m) => conMayus(m, 'cercas')),
  R('[Vv]allas', (m) => conMayus(m, 'cercas')),
  R('[Vv]alla', (m) => conMayus(m, 'cerca')),
  // cerramiento -> screen enclosure (masculino en Florida)
  R('[Cc]erramientos con mosquitero', (m) => conMayus(m, 'screen enclosures')),
  R('[Cc]erramiento con mosquitero', (m) => conMayus(m, 'screen enclosure')),
  R('[Cc]erramientos de privacidad', (m) => conMayus(m, 'cercas de privacidad')),
  R('[Cc]erramientos', (m) => conMayus(m, 'screen enclosures')),
  R('[Cc]erramiento', (m) => conMayus(m, 'screen enclosure')),
  // adoquinado/adoquín -> pavers (plural)
  ...ART([
    ['[Ee]l adoquinado', 'los pavers'], ['[Uu]n adoquinado', 'pavers'], ['[Dd]el adoquinado', 'de los pavers'], ['[Aa]l adoquinado', 'a los pavers'],
    ['[Ss]u adoquinado', 'sus pavers'], ['[Ee]ste adoquinado', 'estos pavers'], ['[Ll]os adoquinados', 'los pavers'], ['[Ee]l adoquín', 'el paver'],
  ]),
  R('[Aa]doquinados', (m) => conMayus(m, 'pavers')),
  R('[Aa]doquinado', (m) => conMayus(m, 'pavers')),
  R('[Aa]doquines', (m) => conMayus(m, 'pavers')),
  R('[Aa]doquín', (m) => conMayus(m, 'paver')),
  // cochera -> carport (masculino)
  ...ART([
    ['[Ll]a cochera', 'el carport'], ['[Uu]na cochera', 'un carport'], ['[Ll]as cocheras', 'los carports'], ['[Dd]e la cochera', 'del carport'],
    ['[Ee]sta cochera', 'este carport'], ['[Nn]uestras cocheras', 'nuestros carports'], ['[Nn]uestra cochera', 'nuestro carport'], ['[Uu]nas cocheras', 'unos carports'],
  ]),
  R('[Cc]ocheras', (m) => conMayus(m, 'carports')),
  R('[Cc]ochera', (m) => conMayus(m, 'carport')),
  // comunidad de propietarios -> HOA
  R('(?:[Ll]a|[Ss]u) comunidad de propietarios', (m) => conMayus(m, `${m.split(' ')[0].toLowerCase()} HOA`)),
  R('(?:[Ll]as|[Ss]us) comunidades de propietarios', (m) => conMayus(m, `${m.split(' ')[0].toLowerCase()} HOA`)),
  R('[Cc]omunidades de propietarios', (m) => conMayus(m, 'HOA')),
  R('[Cc]omunidad de propietarios', (m) => conMayus(m, 'HOA')),
  // ayuntamiento -> la ciudad
  ...ART([['[Ee]l ayuntamiento', 'la ciudad'], ['[Aa]l ayuntamiento', 'a la ciudad'], ['[Dd]el ayuntamiento', 'de la ciudad'], ['[Cc]ada ayuntamiento', 'cada ciudad'], ['[Ll]os ayuntamientos', 'las ciudades']]),
  R('[Aa]yuntamientos', (m) => conMayus(m, 'ciudades')),
  R('[Aa]yuntamiento', (m) => conMayus(m, 'ciudad')),
  R('[Ff]ontanería', (m) => conMayus(m, 'plomería')),
  R('[Aa]parcamientos', (m) => conMayus(m, 'estacionamientos')),
  R('[Aa]parcamiento', (m) => conMayus(m, 'estacionamiento')),
  // Fuera del glosario pero de España: en Florida se estaciona, y «coger» es malsonante.
  R('[Aa]parcar', (m) => conMayus(m, 'estacionar')),
  R('coge resistencia', () => 'gana resistencia'),
  R('[Tt]ejados', (m) => conMayus(m, 'techos')),
  R('[Tt]ejado', (m) => conMayus(m, 'techo')),
];

// Concordancia que las reglas de artículo no cubren: adjetivos justo detrás del sustantivo nuevo.
const ADJ = [

  ['carport', /(carports?) (calculad|diseñad|instalad|adosad|abiert|cerrad|cubiert|independient|exent)(a|as)(?![\p{L}])/gu, (m, n, raiz, fin) => `${n} ${raiz}${fin === 'a' ? 'o' : 'os'}`],
  ['cerca', /(cercas?) (perimetral(?:es)?|de aluminio)/gu, null],
];

const PREVIAS = [
  [/(?<![\p{L}])(de|en) adoquín(?![\p{L}])/gu, (m, prep) => `${prep} pavers`],
  [/(?<![\p{L}])[Uu]n buen adoquinado(?![\p{L}])/gu, (m) => conMayus(m, 'un buen trabajo de pavers')],
  [/(?<![\p{L}])[Nn]uestro adoquinado(?![\p{L}])/gu, (m) => conMayus(m, 'nuestros pavers')],
  [/(?<![\p{L}])[Cc]ada adoquinado(?![\p{L}])/gu, (m) => conMayus(m, 'cada proyecto de pavers')],
  [/(?<![\p{L}])[Ee]l adoquinado profesional(?![\p{L}])/gu, (m) => conMayus(m, 'los pavers profesionales')],
  [/(?<![\p{L}])hardscape adoquinado(?![\p{L}])/gu, () => 'hardscape de pavers'],
  [/(?<![\p{L}])([Pp]atios?|[Tt]errazas?|[Cc]aminos?|[Zz]onas?|[Bb]ordes?|[Ss]uelos?|[Ee]ntradas?(?: de autos)?) adoquinad(?:o|os|a|as)( y reforzad[oa]s?)?(?![\p{L}])/gu, (m, n, refuerzo) => `${n} de pavers${refuerzo ? ' bien reforzad' + (/as?$/.test(refuerzo) ? refuerzo.slice(-1) === 's' ? 'as' : 'a' : refuerzo.slice(-1) === 's' ? 'os' : 'o') : ''}`],
  [/(?<![\p{L}])[Uu]n adoquinado(?![\p{L}])/gu, (m) => conMayus(m, 'un pavimento de pavers')],
];

// Concordancia en la ventana que sigue al sustantivo nuevo (hasta la siguiente puntuación).
const RAICES = 'instalad|calculad|certificad|adosad|oscur|blanc|esbelt|exent|diseñad|abiert|cerrad|cubiert|montad|anclad|pensad|construid|hech|elegid|colocad|terminad|lacad|pintad|nuev|modern|durader|decorativ|reforzad|ubicad|integrad|preparad|fabricad|homologad';
// La ventana se corta en la puntuación y en « con », « para », « que », « sobre »: ahí empieza otro sustantivo.
const ventana = (t, nucleo, aGenero) => t.replace(new RegExp(`(?<![\\p{L}])(?<!de )(${nucleo})((?:(?! con | para | que | sobre | junto )[^.,;:!?()]){0,70})`, 'gu'), (m, n, resto) => {
  const plural = /s$/.test(n);
  return n + resto.replace(new RegExp(`(?<![\\p{L}])(${RAICES})(o|os|a|as)(?![\\p{L}])`, 'gu'), (w, raiz) => raiz + (aGenero === 'm' ? (plural ? 'os' : 'o') : (plural ? 'as' : 'a')));
});
const FRASES_CERCA = [[/(cercas[^.;]{0,60}), hechos/g, '$1, hechas'], [/(cercas duraderas y de poco mantenimiento, que) acompañe(?![\p{L}])/gu, '$1 acompañen'], [/([Cc]ercas) residencial(?![\p{L}])/g, '$1 residenciales']];
const FRASES_PAVERS = [[/(pavers) gris(?! claro| oscuro)(?![\p{L}])/g, '$1 grises'],[/(pavers premium) mejora(?![\p{L}])/g, '$1 mejoran'], [/([Ll]os pavers) tiene más flexibilidad y resiste/g, '$1 tienen más flexibilidad y resisten']];
const FRASES_PARCIALES = [
  [/Están calculadas para proteger los autos/g, 'Están calculados para proteger los autos'],
  [/(carports de aluminio) ya instaladas/g, '$1 ya instalados'],
];

export function aFlorida(texto) {
  let t = FRASES[texto.trim()] ?? texto;
  for (const [re, f] of PREVIAS) t = t.replace(re, f);
  for (const { re, f } of REGLAS) t = t.replace(re, (...a) => f(...a));
  for (const [, re, f] of ADJ) if (f) t = t.replace(re, f);
  if (t !== texto) {
    if (/cochera/i.test(texto)) { t = ventana(t, '[Cc]arports?', 'm'); for (const [re, x] of FRASES_PARCIALES) t = t.replace(re, x); }
    if (/vallad|valla/i.test(texto)) { t = ventana(t, '[Cc]ercas?', 'f'); for (const [re, x] of FRASES_CERCA) t = t.replace(re, x); }
    if (/adoqu/i.test(texto)) for (const [re, x] of FRASES_PAVERS) t = t.replace(re, x);
    if (/adoqu/i.test(texto)) t = t.replace(/(pavers)( [^.,;:!?()]{0,20}?)profesional(?![\p{L}])/gu, '$1$2profesionales');
  }
  return t;
}

// Frases a revisar a mano: concordancias que las reglas no ven.
export const sospechosa = (antes, despues) => antes !== despues && /(cercas|carports?|pavers|HOA|screen enclosures?)\s+\p{L}+(a|as|o|os)\b/u.test(despues);
