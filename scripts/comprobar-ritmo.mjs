#!/usr/bin/env node
/**
 * Puerta del RITMO de las fichas de producto. Sobre dist/, DESPUES de `npm run build`.
 *
 *     npm run check:ritmo
 *
 * QUE SE ROMPIO Y COMO SE VEIA
 *
 * La ficha alterna claro y oscuro sin un solo par repetido. `ProyectoDeFicha.astro`
 * dice por escrito que §9 SUSTITUYE al bloque de video —no se suma— y que ademas
 * «obliga a mover otro». Se hizo la primera mitad: el video se retiro con
 * `video: false`. La segunda no. Resultado, publicado:
 *
 *   solid-roof-pergolas   #specs OSCURO > §9 clara > reseñas clara > #faq claro
 *                         4.879 px sin una sola frontera
 *   carports  2.587 px  ·  cabanas  2.767 px  ·  sukkha  2.492 px
 *
 * LAS 17 PUERTAS ESTABAN VERDES. Ninguna miraba el orden de las bandas ni su color,
 * asi que el defecto viajo a produccion entero. Salio de muestrear el pixel real de
 * cada banda sobre dist, que es justo lo que ninguna puerta hacia.
 *
 * POR QUE ESTO NO SE PUEDE LEER DEL CSS A OJO: `.pp-proyecto-ficha` y
 * `.section-faq-page` no declaran `background-color`, asi que en el codigo parecen
 * neutras y en pantalla heredan el blanco del cuerpo. El tono hay que RESOLVERLO.
 *
 * QUE SE COMPRUEBA AQUI Y QUE NO
 *
 * Esto es estatico, sin navegador: se leen los hijos de `section.body-page` de cada
 * ficha construida y se resuelve el tono de cada uno contra el CSS CONSTRUIDO, no
 * contra una tabla escrita a mano que se quedaria vieja.
 *
 * Contrastado con el pixel pintado (Playwright, 1440, muestreando los dos canalones
 * a 25/50/75 % del alto de cada banda): coinciden banda a banda en claro/oscuro y en
 * los pares que salen. La UNICA diferencia es que la sonda de pixel lee
 * `why-choose-section` como foto —su contenido llega hasta los canalones y el
 * muestreo ve variacion— mientras que aqui sale claro, que es lo que declara su
 * fondo. No cambia ningun veredicto: va entre dos bandas oscuras en las diez fichas,
 * asi que ni una ni otra lectura produce par repetido. Esta puerta resuelve el FONDO
 * de la banda, que es lo que decide su turno; el contenido de encima no.
 *
 * ponytail: sin navegador, igual que comprobar-carruseles.mjs y por el mismo motivo.
 * Meter Playwright en una puerta son ~300 MB y un navegador mas que mantener, y el
 * tono de estas bandas lo decide su propio `background-*`. La medida con pixel real
 * sigue siendo el patron oro y se corre a mano al verificar.
 *
 * EL AMBITO SON LOS HIJOS DE `section.body-page`, y no es pereza: es la unica region
 * que cambia de una ficha a otra. El hero, el CTA del pie y el comparativo son
 * identicos en las 217 paginas y ahi no puede aparecer un defecto por ficha. Lo que
 * si se comprueba es la COSTURA con esa region (ver el punto 3).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { raizHtml } from './lib/dist.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
const DIST = await raizHtml();

/**
 * Fichas a las que se les perdona un par repetido, con el motivo escrito.
 * Una excepcion silenciosa es una excepcion que nadie revisa.
 */
const PERDONADAS = {
  'screen-enclosures':
    'NO TIENE ARREGLO DE CSS, le falta una banda. Entre #specs (oscuro) y '
    + 'service-areas (foto oscura) solo tiene DOS bandas —reseñas y #faq— y dos bandas '
    + 'entre dos oscuras no pueden alternar: la primera tiene que ser clara, la segunda '
    + 'oscura, y la segunda choca con la de detras. Le falta la banda de prueba de obra '
    + 'propia: no trae video-section en su fragmento y ningun proyecto de la galeria '
    + 'lleva su etiqueta. Se cierra sola el dia que el cliente etiquete un proyecto '
    + 'suyo —entonces §9 renderiza y ESTA EXCEPCION HAY QUE RETIRARLA—, no antes. '
    + 'DESDE EL 31-08-2026 ADEMAS SE VE: la banda de resenas era crema (--secundary) y '
    + 'eso dibujaba la costura entre las dos claras aunque el par existiera. Al pasar '
    + 'la banda a blanca —para que haya UNA sola seccion de resenas en el sitio— las '
    + 'dos quedan del mismo blanco y se leen como una banda larga. El par no es nuevo '
    + 'y el motivo de perdonarlo no ha cambiado; lo que ha cambiado es que ya no hay '
    + 'nada que lo disimule, asi que esta excepcion cuesta mas de lo que costaba.',
};

let fallos = 0;
const decir = (ok, msg, detalle = []) => {
  console.log(`  ${ok ? 'ok   ' : 'FALLO'} ${msg}`);
  if (!ok) {
    fallos++;
    for (const d of detalle) console.log(`         ${d}`);
  }
};

// --- 1. El CSS construido, en una sola cadena --------------------------------

const css = [];
for (const dir of ['_astro', 'css']) {
  const d = path.join(DIST, dir);
  for (const f of await fs.readdir(d).catch(() => [])) {
    if (f.endsWith('.css')) css.push(await fs.readFile(path.join(d, f), 'utf8'));
  }
}
if (!css.length) {
  console.log('  FALLO  no hay ni un .css en dist/: la resolucion de tonos no valdria nada');
  process.exit(1);
}

/** Variables de :root, para poder resolver `var(--primary)`. */
const VARS = {};
for (const m of css.join('\n').matchAll(/--([a-z0-9-]+)\s*:\s*([^;}]+)/gi)) {
  VARS[`--${m[1]}`] = m[2].trim();
}

/** Reglas del CSS construido, mas las <style> en linea de la propia pagina. */
const reglas = (extra) => [...(css.join('\n') + '\n' + extra).matchAll(/([^{}@]+)\{([^{}]*)\}/g)]
  .map((m) => ({ sel: m[1].trim(), cuerpo: m[2] }));

const color = (v) => {
  let s = v.trim();
  for (let i = 0; i < 3 && s.includes('var('); i++) {
    s = s.replace(/var\(\s*(--[a-z0-9-]+)\s*(?:,\s*([^()]*))?\)/i, (_, n, alt) => VARS[n] ?? alt ?? '');
  }
  let m = s.match(/#([0-9a-f]{6})\b/i);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
  m = s.match(/#([0-9a-f]{3})\b/i);
  if (m) return [...m[1]].map((c) => parseInt(c + c, 16));
  m = s.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+))?/i);
  if (m) return Number(m[4] ?? 1) === 0 ? null : [+m[1], +m[2], +m[3]];
  if (/^transparent$/i.test(s)) return null;
  if (/^white$/i.test(s)) return [255, 255, 255];
  if (/^black$/i.test(s)) return [0, 0, 0];
  return null;
};

/**
 * foto | oscuro | claro. Sin declaracion propia hereda el cuerpo, que es claro.
 *
 * `soloDeclarado` devuelve `null` en vez de 'claro' cuando la banda NO declara fondo
 * ninguno. Lo usa la costura (punto 3) y no es un matiz: `call-to-action-footer` y
 * `hero-product` sacan su foto de un `<img>` a sangre, no de un `background-image`,
 * asi que este resolvedor —que lee el CSS— los ve claros cuando en pantalla son
 * fotos. Es la misma discrepancia que la cabecera ya documenta para
 * `why-choose-section`. Dentro de body-page da igual, porque ahi todas las bandas
 * declaran su fondo; en la costura NO, y tratar una foto como banda clara inventa un
 * par repetido que no existe.
 */
function tono(clases, rs, { soloDeclarado = false } = {}) {
  const casa = (sel) => sel.split(',').some((s) => {
    const t = s.trim();
    // Solo selectores de una sola clase (con o sin sufijo de ambito de Astro): esta
    // puerta resuelve el fondo PROPIO de la banda, no cascadas de tres niveles.
    const m = t.match(/^\.([a-z0-9_-]+)(\[data-astro-cid-[a-z0-9]+\])?$/i);
    return m ? clases.includes(m[1]) : false;
  });
  let fondo = null, foto = false;
  for (const r of rs) {
    if (!casa(r.sel)) continue;
    if (/background-image\s*:(?![^;]*\bnone\b)/i.test(r.cuerpo)) foto = true;
    const m = [...r.cuerpo.matchAll(/background(?:-color)?\s*:\s*([^;]+)/gi)].pop();
    if (m && !/\bnone\b/i.test(m[1])) {
      if (/url\(|gradient\(/i.test(m[1])) foto = true;
      else { const c = color(m[1]); if (c) fondo = c; }
    }
  }
  if (foto) return 'foto';
  if (!fondo) return soloDeclarado ? null : 'claro';            // hereda el cuerpo
  return 0.2126 * fondo[0] + 0.7152 * fondo[1] + 0.0722 * fondo[2] > 140 ? 'claro' : 'oscuro';
}

// --- 2. Las bandas de cada ficha ---------------------------------------------

const fichas = [];
for (const base of ['products', 'es/products', 'services', 'es/services']) {
  for (const d of await fs.readdir(path.join(DIST, base)).catch(() => [])) {
    const f = path.join(DIST, base, d, 'index.html');
    if (await fs.stat(f).then((s) => s.isFile()).catch(() => false)) fichas.push({ slug: d, ruta: `${base}/${d}`, f });
  }
}
// 20 productos + 14 servicios. El recuento es parte de la puerta: si un dia se
// construyen menos, esto lo dice en vez de medir menos paginas en silencio.
const PRODUCTOS = fichas.filter((f) => f.ruta.includes('products/')).length;
const SERVICIOS = fichas.filter((f) => f.ruta.includes('services/')).length;
decir(PRODUCTOS === 20, `${PRODUCTOS} fichas de producto construidas (esperaba 20)`);
decir(SERVICIOS === 14, `${SERVICIOS} paginas de servicio construidas (esperaba 14)`);

for (const ficha of fichas) {
  const html = await fs.readFile(ficha.f, 'utf8');
  const rs = reglas([...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n'));

  const i = html.indexOf('<section class="body-page"');
  if (i < 0) { decir(false, `${ficha.ruta}: no encuentro section.body-page`); continue; }
  const cuerpo = html.slice(i);

  // Hijos DIRECTOS de body-page, por profundidad de etiquetas.
  const bandas = [];
  let prof = 0;
  let finCuerpo = cuerpo.length;                 // donde cierra body-page, para la costura
  for (const m of cuerpo.matchAll(/<(\/?)(section|div|header|footer|main)\b([^>]*)>/g)) {
    const cierra = m[1] === '/';
    const auto = /\/>$/.test(m[0]);
    if (!cierra && prof === 1) {
      const cl = (m[3].match(/class="([^"]*)"/) ?? [, ''])[1].split(/\s+/).filter(Boolean);
      bandas.push({ cl, nombre: (cl[0] ?? m[2]) + ((m[3].match(/id="([^"]*)"/) ?? [])[1] ? '#' + m[3].match(/id="([^"]*)"/)[1] : '') });
    }
    if (!auto) prof += cierra ? -1 : 1;
    if (prof === 0) { finCuerpo = m.index + m[0].length; break; } // se cerro body-page
  }
  if (bandas.length < 8) { decir(false, `${ficha.ruta}: solo ${bandas.length} bandas, el markup ha cambiado`); continue; }

  const tonos = bandas.map((b) => ({ ...b, t: tono(b.cl, rs) }));

  // Que el resolvedor NO se haya quedado mudo. Si `color()` dejara de entender el
  // CSS, todo saldria 'claro' y la puerta pasaria en verde sin haber medido nada —
  // que es exactamente el fallo que documenta lib/dist.mjs. Cada ficha tiene, por
  // construccion, bandas oscuras (`--primary`) y una foto (`service-areas`).
  if (!tonos.some((t) => t.t === 'oscuro') || !tonos.some((t) => t.t === 'foto')) {
    decir(false, `${ficha.ruta}: el resolvedor de tonos no ve ni un oscuro o ni una foto`,
      ['todo sale claro: o el CSS construido no se ha leido, o `color()` ya no entiende su sintaxis',
        'una puerta que no mide nada sale en verde, asi que esto es FALLO y no aviso']);
    continue;
  }

  // 3. La costura con lo de fuera. Antes esto ASUMIA que body-page va entre dos
  //    fotos —el hero y el CTA del pie— y se limitaba a comprobar que su primera y su
  //    ultima banda no fueran fotos ellas mismas. En producto la asuncion vale; EN
  //    SERVICIO NO: `hero-service` no es una foto, declara `--secundary`, o sea que
  //    es una banda CLARA. Con la asuncion vieja, un primer hijo claro pegado a ese
  //    hero habria pasado en verde sin que nadie lo viera.
  //
  //    Asi que la costura se MIDE — pero solo donde hay algo que medir. Los vecinos
  //    que no declaran fondo (`call-to-action-footer`, `hero-product`: su foto es un
  //    `<img>` a sangre) devuelven `null` y se saltan, porque leerlos como «claros»
  //    inventaria un par repetido que en pantalla no existe. Para esos sigue valiendo
  //    la asercion de siempre: la banda del borde no puede ser ella misma una foto.
  const vecinoPrevio = [...html.slice(0, i).matchAll(/<section\b([^>]*)>/g)].pop();
  const vecinoPost = cuerpo.slice(finCuerpo).match(/<section\b([^>]*)>/);
  const clasesDe = (m) => (m ? ((m[1].match(/class="([^"]*)"/) ?? [, ''])[1]).split(/\s+/).filter(Boolean) : []);
  const costura = [];
  for (const [cl, lado, banda] of [
    [clasesDe(vecinoPrevio), 'antes de body-page', tonos[0]],
    [clasesDe(vecinoPost), 'despues de body-page', tonos.at(-1)],
  ]) {
    if (!cl.length) continue;
    const t = tono(cl, rs, { soloDeclarado: true });
    if (t && t !== 'foto' && t === banda.t) {
      costura.push(`costura ${lado}: ${cl[0]} (${t}) pegado a ${banda.nombre} (${banda.t})`);
    }
  }
  const borde = [tonos[0], tonos.at(-1)].filter((b) => b.t === 'foto');
  if (borde.length) {
    decir(false, `${ficha.ruta}: la costura con el hero/CTA ya no es fiable`,
      [`banda del borde ${borde.map((b) => b.nombre).join(' y ')} = foto`,
        'el ambito de esta puerta (solo body-page) asume que las dos son planas']);
  }

  const pares = [];
  for (let k = 1; k < tonos.length; k++) {
    if (tonos[k].t !== 'foto' && tonos[k].t === tonos[k - 1].t) {
      pares.push(`${tonos[k - 1].nombre} + ${tonos[k].nombre} = dos bandas ${tonos[k].t} seguidas`);
    }
  }
  pares.push(...costura);
  const mapa = tonos.map((t) => (t.t === 'foto' ? 'F' : t.t === 'claro' ? 'c' : 'O')).join('');
  const perdon = PERDONADAS[ficha.slug];

  if (pares.length && perdon) {
    console.log(`  ---  ${ficha.ruta.padEnd(28)} ${mapa}  ${pares.length} par(es), PERDONADO`);
    for (const p of pares) console.log(`         ${p}`);
    console.log(`         ${perdon.replace(/(.{86}) /g, '$1\n         ')}`);
  } else {
    decir(!pares.length, `${ficha.ruta.padEnd(28)} ${mapa}`, pares);
  }
}

// --- 4. Una excepcion que ya no hace falta es una excepcion que sobra ---------

for (const slug of Object.keys(PERDONADAS)) {
  const usada = fichas.some((f) => f.slug === slug);
  decir(usada, `la excepcion de ${slug} apunta a una ficha que existe`,
    [`${slug} ya no se construye: quita su entrada de PERDONADAS`]);
}

console.log(fallos
  ? `\n  ${fallos} fallos de ritmo. Una ficha no puede encadenar dos bandas planas del mismo tono.\n`
  : '\n  ok    ninguna ficha encadena dos bandas planas del mismo tono\n');
process.exit(fallos ? 1 : 0);
