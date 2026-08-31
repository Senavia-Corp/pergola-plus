#!/usr/bin/env node
/**
 * Fase 1 — genera las 83 paginas de detalle de las 8 colecciones.
 *
 * DECISION DE INGENIERIA (leer antes de tocar esto)
 *
 * El plan pedia plantillas [slug].astro con getStaticPaths leyendo los CSV y los
 * campos enlazados a mano. Se intento y se llego hasta aqui:
 *
 *   - El export trae las plantillas de detalle con los bindings VACIOS
 *     (w-dyn-bind-empty): esta el HTML, no el contenido. Habria que ADIVINAR que
 *     elemento corresponde a que campo.
 *   - scripts/derivar-plantilla.mjs resolvio buena parte automaticamente
 *     (22/29 campos de Products y las 4 listas anidadas), pero no todo: las
 *     plantillas llevan colecciones anidadas filtradas por el item
 *     (Feature Products, FAQs, Brochures) que NO estan en el CSV del item.
 *
 * Mientras tanto, el sitio en vivo renderiza esas mismas plantillas con el
 * contenido ya puesto — verificado: mismas secciones, mismos data-w-id.
 *
 * Asi que la Fase 1, cuyo objetivo es un frontend EXACTO, se genera desde el
 * HTML real de las 83 paginas. No hay riesgo de binding mal adivinado: la
 * salida ES la salida del sitio actual, y se puede comparar contra el en vivo.
 *
 * El enlazado a Sanity es la Fase 3, y para eso queda el mapa de campos que
 * produjo derivar-plantilla.mjs (docs/mapa-campos-cms.md).
 *
 * Lo que esto NO es: no son 83 paginas escritas a mano. Es un fragmento HTML por
 * item + 8 plantillas Astro que los renderizan, que es justo la estructura sobre
 * la que la Fase 3 sustituira el fragmento por datos de Sanity.
 *
 *   node scripts/generar-detalle.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { transformar, decodificar, reescribirImagenes, PLACEHOLDERS, SEO_FALTANTE } from './lib/transformar.mjs';
import { parseCSV } from './lib/csv.mjs';
import { PROYECTOS, ITEMS as ITEMS_PROPIOS, ficha } from './lib/proyectos-destacados.mjs';
import { bajarFaltantes } from './lib/assets-cdn.mjs';
import { rutaOg } from './generar-og.mjs';

// Mapa de imagenes del CMS + inventario de lo que hay en public/images/.
const MAPA = JSON.parse(await fs.readFile(path.resolve(import.meta.dirname, '../src/lib/img-map.json'), 'utf8'));
const LOCALES = new Set(await fs.readdir(path.resolve(import.meta.dirname, '../public/images')));
const sinResolverGlobal = new Set();

const RAIZ = path.resolve(import.meta.dirname, '..');

/**
 * Los derivados 1200x630 que existen en public/images/og/, por nombre de archivo.
 *
 * Se lee el disco en vez de mantener una lista: lo que no se ha generado no esta en
 * la carpeta, no entra en `ogImage` y esa pagina se queda como estaba. Mismo criterio
 * que CTA_POR_RUTA en scripts/lib/transformar.mjs, y por el mismo motivo — un mapa a
 * mano puede nombrar una imagen que no existe y dejar la pagina pidiendo un 404.
 *
 * Los genera `node scripts/generar-og.mjs`, y TIENEN que estar en git:
 * `check:imagenes` lo comprueba con `git ls-files` porque Vercel construye desde un
 * clon.
 */
const OG = new Set(await fs.readdir(path.join(RAIZ, 'public/images/og')).catch(() => []));
const VIVO = path.join(RAIZ, 'docs/vivo');
const FRAG = path.join(RAIZ, 'src/contenido-migrado');
const EXPORT_CMS = '/Users/senavia/Downloads/Webflow Pergola Plus Florida/CMS';

/**
 * Colecciones con ruta propia. Prefijos CONFIRMADOS contra el sitio en vivo.
 * `csv` y las columnas SEO se usan para el arreglo opcional de abajo.
 *
 * `faq: true` = la ficha cierra con un enlace a la biblioteca de preguntas ya
 * filtrada por su tema (?t=<slug>). Solo products y services: son los unicos cuyos
 * slugs existen como `Tema` en src/data/faqs.ts, y el componente revienta el build
 * si le llega otro.
 *
 * `paginaPropia: true` = se siguen escribiendo los fragmentos y el _items.json,
 * pero NO se sobrescribe src/pages/<ruta>/[slug].astro, porque esa plantilla es
 * codigo nuestro. Ojo: la plantilla de mas abajo es UNA SOLA cadena compartida por
 * las 8 colecciones, asi que meterle ahi lo especifico del blog (JSON-LD, enlace
 * de vuelta, anterior/siguiente) se lo aplicaria tambien a products, services,
 * project, brands, countries, pergolas-contractors y articles.
 */
const COLECCIONES = [
  { dir: 'products', ruta: 'products', faq: true, ficha: true, promovidas: true, csv: '- Products -', tSeo: 'Title SEO', dSeo: 'Metadescription SEO', ld: 'producto', miga: 'Our Products', migaRuta: '/products/' },
  { dir: 'services', ruta: 'services', faq: true, promovidas: true, resenas: true, csv: '- Services -', tSeo: 'Title SEO', dSeo: 'Metadescription SEO', ld: 'servicio', miga: 'Our Services', migaRuta: '/services/' },
  { dir: 'post', ruta: 'post', csv: 'Blog Posts', tSeo: 'Title SEO', dSeo: 'Metadescription SEO', paginaPropia: true },
  { dir: 'project', ruta: 'project', csv: 'Projects', tSeo: 'Title SEO', dSeo: 'Metadescription', ld: 'ninguno', miga: 'Project Gallery', migaRuta: '/project-gallery/' },
  { dir: 'brands', ruta: 'brands', csv: 'Brands', tSeo: 'Title SEO', dSeo: 'Metadescription SEO', ld: 'ninguno', miga: 'Our Brands', migaRuta: '/about-us/brands/' },
  { dir: 'countries', ruta: 'countries', resenas: true, csv: 'Countries', tSeo: 'Title SEO', dSeo: 'Metadescription SEO', ld: 'area', miga: 'Where We Work', migaRuta: '/about-us/where-we-work/' },
  { dir: 'pergolas-contractors', ruta: 'pergolas-contractors', resenas: true, csv: 'Pergolas Contractors', tSeo: 'Title SEO', dSeo: 'Metadescripcion SEO', ld: 'area', miga: 'Where We Work', migaRuta: '/about-us/where-we-work/' },
  { dir: 'articles', ruta: 'articles', csv: 'Articles', tSeo: null, dSeo: null, ld: 'ninguno', miga: null, migaRuta: null },
];

/**
 * SEO desde el CMS — ACTIVO (decision del cliente, 14-ago-2026).
 *
 * El sitio de Webflow sirve <title>Pergola Plus Florida</title> en las 83
 * paginas de detalle, sin meta description. Pero el CMS SI tiene los datos: 64
 * de 81 items llevan "Title SEO" y "Metadescription SEO" escritos. La plantilla
 * de Webflow simplemente nunca los enlazo al <head>.
 *
 * Afecta a lo que mas trafico organico deberia captar:
 *   25 paginas de contratista por ciudad ("Pergola Contractor in Aventura, FL")
 *   21 entradas de blog · 10 proyectos · 5 marcas · 3 condados
 *
 * ES LA UNICA DESVIACION DELIBERADA respecto al sitio actual, y esta acotada al
 * <head>: el cuerpo de las paginas sigue siendo identico. La auditoria de
 * paridad la trata como diferencia ESPERADA, no como fallo.
 *
 * Para volver al comportamiento del sitio actual:
 *   SEO_DESDE_CMS=0 node scripts/generar-detalle.mjs
 */
const SEO_DESDE_CMS = process.env.SEO_DESDE_CMS !== '0';

/**
 * Pisa tambien las plantillas marcadas `paginaPropia`. DESTRUCTIVO: se lleva por
 * delante src/pages/post/[slug].astro, que es codigo de autoria propia.
 *
 *   node scripts/generar-detalle.mjs --regenerar-manuales
 */
const FORZAR_PAGINAS = process.argv.includes('--regenerar-manuales');

/**
 * Cuerpo de la pagina. El menu anida TRES niveles de <nav>, asi que buscar el
 * primer </nav> se comeria medio menu: hay que contar profundidad.
 */
function cuerpo(html) {
  const i = html.indexOf('<nav');
  if (i < 0) throw new Error('sin nav');
  let prof = 0, fin = -1;
  for (const m of html.slice(i).matchAll(/<nav\b|<\/nav>/g)) {
    prof += m[0] === '</nav>' ? -1 : 1;
    if (prof === 0) { fin = i + m.index + m[0].length; break; }
  }
  const b = html.lastIndexOf('<footer');
  if (fin < 0 || b < 0) throw new Error('sin cierre de nav o footer');
  return html.slice(fin, b);
}

function meta(html) {
  const t = (re) => html.match(re)?.[1]?.trim() ?? null;
  // El bloque anti-FOUC de Webflow ya NO se cosecha. Decia «manten este elemento
  // invisible hasta que arranque IX2», y existia solo para las entradas por scroll.
  // Los 110 eventos SCROLL_INTO_VIEW estan apagados (scripts/parchear-webflow.mjs) y
  // la entrada la hace ahora src/styles/animaciones.css, cuyo estado en reposo es
  // VISIBLE. Mantener el bloque dejaria esos 11 ids invisibles para siempre.
  return {
    title: decodificar(t(/<title>([\s\S]*?)<\/title>/)),
    description: decodificar(t(/<meta content="([^"]*)"\s+name="description"/)),
    ogImage: t(/<meta content="([^"]*)"\s+property="og:image"/),
    wfPage: t(/<html[^>]*\sdata-wf-page="([^"]*)"/),
    wfSite: t(/<html[^>]*\sdata-wf-site="([^"]*)"/),
  };
}

// Solo los ficheros de las 8 colecciones. La carpeta vivo/ tambien tiene las
// paginas estaticas y el 404, y el 404 no lleva <nav>: si se cuela aqui, revienta.
const ficheros = (await fs.readdir(VIVO))
  .filter((f) => COLECCIONES.some((c) => f.startsWith(`${c.dir}__`)));
const resumen = [];

// Pre-pasada: bajar del CDN lo que no tenemos (ver lib/assets-cdn.mjs).
{
  const htmls = [];
  for (const f of ficheros) htmls.push(await fs.readFile(path.join(VIVO, f), 'utf8'));
  const res = await bajarFaltantes({
    htmls, cuerpo, mapa: MAPA, locales: LOCALES,
    destino: path.join(RAIZ, 'public/images'),
  });
  if (res.bajadas) console.log(`  bajados ${res.bajadas} assets que el CDN sirve y no teniamos`);
  for (const f of res.fallos) console.error(`  !! ${f.error}  ${f.url}`);
}

for (const col of COLECCIONES) {
  const propios = ficheros.filter((f) => f.startsWith(`${col.dir}__`));
  const items = [];

  // Datos SEO del CMS, indexados por slug. Se guardan SIEMPRE en _items.json
  // (asi quedan a mano para la Fase 3 y para el arreglo), pero solo se aplican
  // al <head> si SEO_DESDE_CMS esta activo.
  const seo = {};
  if (col.csv) {
    const nombreCsv = (await fs.readdir(path.join(EXPORT_CMS))).find((f) => f.includes(col.csv));
    if (nombreCsv) {
      for (const r of parseCSV(await fs.readFile(path.join(EXPORT_CMS, nombreCsv), 'utf8'))) {
        seo[r.Slug] = {
          tituloSeo: (col.tSeo && r[col.tSeo]?.trim()) || null,
          descripcionSeo: (col.dSeo && r[col.dSeo]?.trim()) || null,
        };
      }
    }
  }

  for (const f of propios) {
    const slug = f.slice(col.dir.length + 2, -5);
    const html = await fs.readFile(path.join(VIVO, f), 'utf8');
    const r = reescribirImagenes(cuerpo(html), MAPA, LOCALES);
    for (const u of r.sinResolver) if (!PLACEHOLDERS[u]) sinResolverGlobal.add(u);
    // La ruta importa: el transformador tiene reglas por pagina (el bloque vacio del
    // CMS en /articles/privacy-policy, el widget de resenas en /about-us/testimonials).
    // Antes se llamaba sin ella y esas reglas no se aplicaban nunca a las paginas de
    // detalle, en silencio.
    const frag = transformar(r.html, `/${col.ruta}/${slug}`);

    const dir = path.join(FRAG, col.dir);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, `${slug}.html`), frag);
    const m = meta(html);
    const s = seo[slug] ?? {};
    // Orden de preferencia para el <head>:
    //   1. el CMS, si el item trae Title SEO;
    //   2. SEO_FALTANTE, para las 19 que el CMS dejo vacias y que por eso salian
    //      todas con el mismo <title>Pergola Plus Florida</title>;
    //   3. lo que traia la pagina en vivo.
    const propio = SEO_FALTANTE[`${col.dir}/${slug}`] ?? {};
    // `og:image` no existia en NINGUNA de las 217 paginas construidas —medido— y
    // `ogImage` llegaba `null` en los diez productos, asi que `producto()` tampoco
    // podia emitir `image` en el JSON-LD. El derivado sale del MISMO hero que ve el
    // visitante, asi que la tarjeta que se comparte no puede enseñar otra cosa.
    const og = col.ficha && OG.has(path.basename(rutaOg(slug))) ? rutaOg(slug) : null;
    items.push({
      slug, ...m, ...s,
      title: (SEO_DESDE_CMS && s.tituloSeo) || propio.title || m.title,
      description: (SEO_DESDE_CMS && s.descripcionSeo) || propio.description || m.description,
      ogImage: og ?? m.ogImage,
    });
  }

  // Los tres proyectos que mando el cliente y que NO estan en el CMS de Webflow.
  // Se escriben aqui, dentro del generador, y no a mano, porque este script
  // reconstruye _items.json entero en cada pasada: un item anadido a mano
  // desapareceria en la siguiente regeneracion y check:generadores lo cazaria como
  // diff. Ver la cabecera de scripts/lib/proyectos-destacados.mjs.
  //
  // La ficha se DERIVA de una de las diez del CMS que se acaban de escribir, para
  // heredar sus contratos de carrusel y lightbox en vez de reescribirlos.
  if (col.dir === 'project') {
    const dir = path.join(FRAG, col.dir);
    const plantilla = await fs.readFile(
      path.join(dir, 'forte-pergolas-in-greenacres-pool-patio.html'), 'utf8');
    for (const proyecto of PROYECTOS) {
      await fs.writeFile(path.join(dir, `${proyecto.slug}.html`), ficha(proyecto, plantilla));
    }
    items.push(...ITEMS_PROPIOS);
  }

  items.sort((a, b) => a.slug.localeCompare(b.slug));
  await fs.writeFile(path.join(FRAG, col.dir, '_items.json'), JSON.stringify(items, null, 2));

  // DOS BANDERAS, Y LA DISTINCION IMPORTA.
  //
  //   `col.ficha`      la ficha de producto recompuesta: tres componentes en el hueco
  //                    del primer CTA (especificaciones, reseñas, proyecto).
  //   `col.promovidas` solo las preguntas nuestras dentro del bloque de FAQ y su
  //                    `FAQPage` en el grafo.
  //
  // Antes esto era UNA sola bandera y services se quedaba fuera de las dos, con este
  // motivo escrito: «services tambien pinta cinco preguntas, pero las suyas siguen
  // numeradas en el markup migrado («1. »)». MEDIDO EL 29-08-2026: no lo estan. Cero
  // preguntas numeradas en los siete servicios y en los diez productos, y `limpiar()`
  // (src/lib/faq-ficha.ts) quita el prefijo de todas formas — su propio comentario lo
  // anticipa: «cuando el fragmento deje de estar numerado, este replace simplemente no
  // encuentra nada». El bloqueo ya no existe.
  //
  // Lo que SI sigue en pie es el porque de la regla: un `FAQPage` cuyo `name` no
  // coincida LETRA POR LETRA con lo que la pagina enseña es markup desincronizado, y a
  // ojos de Google eso es spam. Por eso al grafo sube EXACTAMENTE lo que pinta
  // `FaqPromovidas`, que lee la misma lista: `PROMOVIDAS`.
  //
  // Y a services le llega solo la mitad de FAQ porque la otra no tiene dato de origen:
  // un servicio no tiene material, acabado ni dimensiones que poner en §8, y «One We
  // Built» duplicaria la banda `projects` que las siete YA traen (ver la cabecera de
  // scripts/lib/servicios.mjs).
  const promovidas = col.ficha || col.promovidas;
  // Un solo sitio decide que se importa de faq-ficha: con dos ternarios encadenados,
  // una coleccion que fuera `ficha` Y `resenas` a la vez importaria `partirEnMarca`
  // dos veces y el .astro no compilaria.
  const impFaqFicha = col.faq ? ['partirTrasFaq'] : [];
  if (col.ficha || col.resenas) impFaqFicha.push('partirEnMarca');
  if (col.ficha) impFaqFicha.push('MARCA_SECCIONES');
  if (col.resenas) impFaqFicha.push('MARCA_RESENAS');
  if (promovidas) impFaqFicha.push('paresFaq');
  const impFicha = [
    ...(col.ficha ? [
      "import EspecificacionesFicha from '../../components/EspecificacionesFicha.astro';",
      "import ProyectoDeFicha from '../../components/ProyectoDeFicha.astro';",
      "import ReseñasGoogle from '../../components/ReseñasGoogle.astro';",
      "import { ESPECIFICACIONES } from '../../data/especificaciones';",
      "import { filasDe } from '../../i18n/especificaciones.es';",
    ] : []),
    ...(col.resenas && !col.ficha ? [
      "import ReseñasGoogle from '../../components/ReseñasGoogle.astro';",
    ] : []),
    ...(promovidas ? [
      "import FaqPromovidas from '../../components/FaqPromovidas.astro';",
      "import { PROMOVIDAS } from '../../data/faqs';",
      "import { porId } from '../../i18n/faqs.es';",
    ] : []),
    '',
  ].join('\n');

  const bloqueFicha = col.ficha ? [
    '',
    '// LA ASERCION NO ES ADORNO. La marca la escribe scripts/lib/transformar.mjs y la',
    '// lista de fichas con especificaciones vive en src/data/especificaciones.ts: son',
    '// dos ficheros que no pueden importarse entre si —uno es .mjs de un script, el',
    '// otro .ts del build—, asi que la unica forma de que la duplicacion no se rompa en',
    '// silencio es comprobarla aqui. Sin esto, un cambio en el transformador publicaria',
    '// la ficha sin especificaciones, sin proyecto y sin reseñas, sin un solo error.',
    'const ficha = ESPECIFICACIONES[item.slug] ?? null;',
    'if (Boolean(ficha) !== html.includes(MARCA_SECCIONES)) {',
    "  throw new Error('[ficha] ' + item.slug + ': ' + (ficha",
    "    ? 'tiene especificaciones pero el fragmento no trae la marca de secciones'",
    "    : 'el fragmento trae la marca de secciones y la ficha no tiene especificaciones'));",
    '}',
    "const secciones = ficha ? partirEnMarca(html, item.slug) : { antes: '', despues: html };",
  ].join('\n') : '';

  // El hueco de las reseñas dentro de la banda `reviews`. Va DENTRO y no como banda
  // propia: ver MARCA_RESENAS en src/lib/faq-ficha.ts.
  //
  // SE CORTA LO QUE QUEDA DESPUES DEL FAQ, o el html entero si la coleccion no tiene
  // FAQ. En services la banda `reviews` viene DESPUES del FAQ
  // (…faq · projects · process · service-areas · reviews), asi que cortar `html`
  // dejaria el FAQ en `resenas.antes` y `partirTrasFaq` ya no encontraria su ancla.
  // En countries y pergolas-contractors no hay FAQ y `faq` ni siquiera se declara.
  const fuenteResenas = col.faq ? 'faq.despues' : 'html';
  const bloqueResenas = col.resenas ? [
    '',
    '// La marca la escribe el paso 6b de scripts/lib/transformar.mjs, que es un .mjs y',
    '// no puede importar este .ts: `partirEnMarca` LANZA si no esta, y esa es toda la',
    '// comprobacion que mantiene los dos ficheros de acuerdo.',
    `const resenas = partirEnMarca(${fuenteResenas}, item.slug, MARCA_RESENAS);`,
  ].join('\n') : '';

  // Lo que se PINTA del hueco de las reseñas. Es una sola cadena y no dos copias
  // porque la usan las dos ramas de la emision —con FAQ (services) y sin el
  // (countries, pergolas-contractors)— y dos copias es como se desincronizan.
  const emisionResenas =
    '  <Fragment set:html={resenas.antes} />\n'
    + '  {/* DENTRO de la banda `reviews`, entre su titular y el enlace a\n'
    + '      testimonios. Como banda propia serian dos secciones de Reviews seguidas:\n'
    + '      la blanca de Webflow vacia y una crema debajo con las tarjetas. Eso es\n'
    + '      exactamente lo que se reporto en la home y en contacto el 31-08-2026.\n'
    + '\n'
    + '      Y en services hay una segunda razon, independiente: una banda clara mas\n'
    + '      entre `reviews` (clara) y el CTA del pie dejaria dos claras seguidas, y\n'
    + '      check:ritmo lo cazaria — con razon.\n'
    + '\n'
    + '      `embebido` porque la banda YA trae titular: sin el salian dos\n'
    + '      titulares seguidos y un panel crema dentro de una banda blanca. */}\n'
    + '  <ReseñasGoogle embebido />\n'
    + '  <Fragment set:html={resenas.despues} />\n';

  const cuerpoFaq = col.ficha ? 'secciones.despues' : 'html';

  // La guarda `ficha ?` solo tiene sentido donde HAY registro de especificaciones. En
  // services no lo hay, asi que ahi la condicion es constante.
  const si = col.ficha ? 'ficha ? ' : '';
  const noSi = col.ficha ? ' : []' : '';
  const grafoFicha = promovidas ? [
    '',
    '// Los pares P/R que suben al FAQPage: SOLO los que hemos redactado y verificado',
    '// nosotros, que sube FaqPromovidas desde la biblioteca. Las CINCO del fragmento',
    '// migrado son copy de marketing del cliente y ya NO suben: promoverlas a dato',
    '// estructurado seria afirmarle a Google en nombre del negocio algo que nadie ha',
    '// verificado. Lo detecto F4a. El criterio es el ORIGEN, nunca el vocabulario.',
    ...(col.ficha ? [
      '// Y en esta coleccion hay un motivo mas concreto: la seccion de especificaciones',
      '// de esta misma pagina dice por escrito que no publica garantias ni cifras de',
      '// viento, asi que subir esas cinco seria afirmar justo lo que la pagina se niega',
      '// a afirmar veinte lineas mas arriba.',
    ] : []),
    '// El texto sigue VISIBLE en la pagina: es del cliente y no se toca sin su permiso.',
    `const promovidas = ${si}(PROMOVIDAS[item.slug] ?? [])${noSi};`,
    '// `paresFaq` se sigue llamando por su ASERCION —lanza si el markup migrado cambia—,',
    '// no por su valor. Perder esa comprobacion seria cambiar un defecto por otro.',
    `const migradas = ${si}paresFaq(${col.ficha ? 'secciones.despues' : 'html'}, item.slug)${noSi};`,
    `const pares = ${si}porId('en', promovidas)${noSi};`,
    `if (${col.ficha ? 'ficha && ' : ''}(migradas.length !== 5 || pares.length !== promovidas.length)) {`,
    "  throw new Error('[faq] ' + item.slug + ': ' + migradas.length + ' migradas y '",
    "    + pares.length + ' promovidas; esperaba 5 y ' + promovidas.length);",
    '}',
    ...(col.ficha ? ["const filas = ficha ? filasDe('en', item.slug, ficha.enGrafo) : [];"] : []),
  ].join('\n') : '';

  const nodoProducto = col.ficha
    ? "producto(site, { nombre, descripcion: item.description ?? '', ruta, imagen: item.ogImage ?? null,\n"
      + "  material: ficha?.material ? filasDe('en', item.slug, [ficha.material])[0]!.valor : null,\n"
      + '  propiedades: filas.map((f) => ({ nombre: f.etiqueta, valor: f.valor })) })'
    : "producto(site, { nombre, descripcion: item.description ?? '', ruta, imagen: item.ogImage ?? null })";

  // La plantilla Astro: una por coleccion, con getStaticPaths sobre los items.
  const astro = `---
import BaseLayout from '../../layouts/BaseLayout.astro';
import items from '../../contenido-migrado/${col.dir}/_items.json';
import { grafo, breadcrumbs, producto, servicio, areaDeServicio${promovidas ? ', faqPage' : ''} } from '../../lib/jsonld';
${col.faq ? `import FaqFichaEnlace from '../../components/FaqFichaEnlace.astro';\n` : ''}${col.faq || col.resenas ? `import { ${impFaqFicha.join(', ')} } from '../../lib/faq-ficha';\n` : ''}${impFicha}
// Generado por scripts/generar-detalle.mjs — NO editar a mano.
//
// El fragmento HTML de cada item se importa en crudo. En la Fase 3 esta linea
// es lo unico que cambia: en vez de leer el fragmento, se consulta Sanity y se
// renderiza la plantilla con sus datos. La estructura de la pagina y el <head>
// ya quedan aqui.
const fragmentos = import.meta.glob('../../contenido-migrado/${col.dir}/*.html', {
  query: '?raw', import: 'default', eager: true,
});

export function getStaticPaths() {
  return items.map((item) => ({ params: { slug: item.slug }, props: { item } }));
}

const { item } = Astro.props;
const html = fragmentos['../../contenido-migrado/${col.dir}/' + item.slug + '.html'];
if (!html) throw new Error('sin fragmento para ${col.dir}/' + item.slug);${bloqueFicha}
${col.faq ? `// El enlace a la biblioteca va DENTRO de la lista de preguntas, asi que el\n// fragmento se parte ahi. Ver src/lib/faq-ficha.ts.\nconst faq = partirTrasFaq(${cuerpoFaq}, '${col.dir}/' + item.slug);\n` : ''}${bloqueResenas ? bloqueResenas + '\n' : ''}
// JSON-LD. Antes de la Fase 4 estas 83 paginas no declaraban NADA: para Google eran
// paginas sin negocio detras, sin telefono y sin area de servicio. Los datos salen de
// src/lib/jsonld.ts y todos estan publicados en el propio sitio.
//
// El nombre sale del <h1> de la pagina, no de un campo aparte: asi no puede
// contradecir lo que el visitante lee.
const site = Astro.site!.href;
// La barra final NO es cosmetica: es la forma que sirve Astro y la que declara la
// canonica. Sin ella, \`Product.url\` y las migas apuntaban a una URL que redirige.
const ruta = '/${col.ruta}/' + item.slug + '/';
// Las barras van dobladas porque esto se escribe DENTRO de una plantilla de cadena:
// con una sola, \\s llega al fichero como "s" y la expresion deja de coincidir — que
// es lo que paso en el primer intento y dejo el nombre cayendo al title.
const nombre = (html.match(/<h1[^>]*>([\\s\\S]*?)<\\/h1>/)?.[1] ?? item.title)
  .replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim();
const migas = breadcrumbs(site, [
${col.miga ? `  ${JSON.stringify([col.miga, col.migaRuta])},\n` : ''}  [nombre, ruta],
] as [string, string][]);${grafoFicha}
const jsonLd = grafo(${{
    producto: nodoProducto,
    servicio: "servicio(site, { nombre, descripcion: item.description ?? '', ruta })",
    area: "areaDeServicio(site, { nombre, descripcion: item.description ?? '', ruta, area: nombre })",
    ninguno: 'null',
  }[col.ld ?? 'ninguno']},${promovidas ? '\n  pares.length ? faqPage(pares) : null,' : ''} migas);
---

<BaseLayout
  title={item.title}
  description={item.description ?? undefined}
  ogImage={item.ogImage ?? undefined}
  wfPage={item.wfPage ?? undefined}
  wfSite={item.wfSite ?? undefined}
  jsonLd={jsonLd}
>
${col.ficha
    ? '  <Fragment set:html={secciones.antes} />\n'
      + '  {ficha && <EspecificacionesFicha slug={item.slug} />}\n'
      + '  {ficha && <ReseñasGoogle />}\n'
      + '  {/* Condicional: solo pinta donde hay proyecto etiquetado (hoy 4 de 10).\n'
      + '      VA DETRAS DE LAS RESEÑAS Y NO DELANTE: ocupa el turno OSCURO que deja\n'
      + '      el video retirado, que es lo que mantiene la alternancia claro/oscuro.\n'
      + '      Ver ProyectoDeFicha.astro y src/lib/proyectos-ficha.ts. */}\n'
      + '  {ficha && <ProyectoDeFicha slug={item.slug} titulo="One We Built"\n'
      + '    entradilla="A project of ours with this roof, from our own gallery." />}\n'
    : ''}${col.faq
    ? '  <Fragment set:html={faq.antes} />\n'
      + (promovidas ? '  <FaqPromovidas tema={item.slug} />\n' : '')
      + '  <FaqFichaEnlace tema={item.slug} />\n'
      + (col.resenas ? emisionResenas : '  <Fragment set:html={faq.despues} />\n')
    : col.resenas
      ? emisionResenas
      : '  <Fragment set:html={html} />\n'}</BaseLayout>
`;

  // Los fragmentos y el _items.json de arriba SI se han escrito; lo que se salta
  // es la plantilla de la pagina. Ver `paginaPropia` en COLECCIONES.
  if (col.paginaPropia && !FORZAR_PAGINAS) {
    resumen.push({ col: col.dir, n: items.length, sinTitle: 0, manual: true });
    continue;
  }

  const dest = path.join(RAIZ, 'src/pages', col.ruta, '[slug].astro');
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, astro);

  resumen.push({ col: col.dir, n: items.length, sinTitle: items.filter((i) => !i.title).length });
}

console.log('Fase 1 — paginas de detalle\n');
let total = 0;
for (const r of resumen) {
  console.log(
    `  /${r.col.padEnd(24)} ${String(r.n).padStart(3)} items` +
      `${r.sinTitle ? `   !! ${r.sinTitle} sin <title>` : ''}` +
      `${r.manual ? '   [manual: [slug].astro NO sobrescrito]' : ''}`,
  );
  total += r.n;
}
console.log(`\n  ${total} paginas de detalle`);

if (sinResolverGlobal.size) {
  console.error(`\n  !! ${sinResolverGlobal.size} URLs del CDN de Webflow SIN RESOLVER:`);
  for (const u of [...sinResolverGlobal].slice(0, 15)) console.error(`     ${u}`);
  process.exit(1);
}
console.log('  cero URLs apuntando al CDN de Webflow');

const conSeo = [];
for (const col of COLECCIONES) {
  const d = JSON.parse(await fs.readFile(path.join(FRAG, col.dir, '_items.json'), 'utf8'));
  const n = d.filter((i) => i.tituloSeo).length;
  if (n) conSeo.push(`${col.dir} ${n}/${d.length}`);
}
console.log(`\n  SEO desde el CMS: ${SEO_DESDE_CMS ? 'APLICADO' : 'disponible pero NO aplicado (migracion exacta)'}`);
console.log(`     items con Title SEO en el CMS: ${conSeo.join(' · ')}`);
if (!SEO_DESDE_CMS) console.log('     para aplicarlo: SEO_DESDE_CMS=1 node scripts/generar-detalle.mjs');
