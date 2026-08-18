// @ts-check
import fs from 'node:fs/promises';
import path from 'node:path';
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';
import { dimensionarImagenes } from './scripts/lib/transformar.mjs';
import { haciaEspanol } from './src/i18n/rutas.mjs';

/**
 * Si este build se puede indexar. FALLA CERRADO: hay que declararlo, y quien no lo
 * declara sale invisible.
 *
 * Es al reves de lo natural a proposito. El dominio real sigue sirviendo el Webflow
 * en vivo, asi que un deploy provisional indexable no es un detalle de SEO: es una
 * copia del sitio entero compitiendo en buscadores contra el sitio del cliente, con
 * su sitemap apuntando al dominio bueno. El olvido tiene que producir el deploy
 * mudo, nunca el ruidoso.
 *
 * Cuando es false, cinco cosas a la vez y ninguna sobra:
 *   robots.txt   Disallow: / y SIN linea Sitemap (ver sitemapYRobots)
 *   sitemap.xml  se borra de la salida
 *   rss.xml      se borra de la salida, y el <link> que lo anuncia desaparece
 *   <meta>       noindex,nofollow en las 211 paginas (ver BaseLayout)
 *   SITIO        cae en localhost, no en el dominio del cliente (ver abajo)
 *
 * NO se usa una cabecera X-Robots-Tag por vercel.json. Seria la unica capa que
 * alcanza a lo que no es HTML, pero vercel.json es un fichero ESTATICO: no puede
 * leer esta variable, asi que o lo lleva tambien produccion —y entonces el sitio
 * bueno nace invisible— o hay que acordarse de quitarlo a mano en el deploy que mas
 * caro sale olvidar. Borrar el RSS y el sitemap cierra el mismo hueco sin dejar esa
 * trampa puesta.
 */
const ES_PRODUCCION = process.env.PUBLIC_ES_PRODUCCION === '1';

/**
 * El dominio que alimenta canonicas, hreflang, sitemap, JSON-LD y los <guid> del RSS.
 *
 * EL FALLBACK TAMBIEN FALLA CERRADO, y es la mitad que faltaba. Antes caia en el
 * dominio real, asi que un preview que olvidara PUBLIC_SITE_URL construia las 211
 * canonicas apuntando al sitio del cliente — o sea, la copia provisional pidiendole
 * a Google que consolidara su autoridad contra el Webflow en vivo. Medido: 211 de
 * 211. Ahora un build no declarado como produccion que ademas no diga su dominio
 * cae en localhost, que no le hace dano a nadie.
 */
const SITIO = process.env.PUBLIC_SITE_URL
  ?? (ES_PRODUCCION ? 'https://www.pergolaplusflorida.com' : 'http://localhost:4321');

/**
 * width/height en TODAS las imagenes del HTML construido.
 *
 * Se hace aqui, sobre dist/, y no en el transformador, por cobertura: por el
 * transformador solo pasa el HTML migrado, y las imagenes estan tambien en el Nav y
 * el Footer —o sea en las 107 paginas— y en el blog, que son codigo propio. Medido:
 * aplicandolo solo en el transformador quedaban 4201 <img> de 7147 sin dimensiones.
 *
 * Las medidas salen de src/lib/img-dim.json (scripts/medir-imagenes.mjs), que mide
 * los archivos de public/ con sharp. No se inventa ninguna.
 */
/**
 * Reescribe los enlaces internos de una pagina ESPANOLA a su version espanola,
 * cuando existe.
 *
 * Sin esto, el sitio en espanol saca al visitante de su idioma al primer clic:
 * medido en /es/ y en /es/products, 12 enlaces por pagina apuntaban a la version
 * inglesa de paginas que SI estan traducidas — «Pedir presupuesto» llevaba al
 * formulario en ingles.
 *
 * Se hace aqui, sobre dist/, y no en `traducirHtml`, por dos razones:
 *   - traducirHtml solo toca nodos de texto, NUNCA atributos, y esa regla es lo que
 *     garantiza que no puede romper un href ni un data-w-id. No es sitio para esto.
 *   - los enlaces no estan solo en el fragmento migrado: estan tambien en el Nav y
 *     en el Footer, que son componentes con hrefs ingleses escritos a mano.
 *
 * Solo se reescribe lo que TIENE traduccion publicada. Un enlace a una ficha de
 * producto sigue llevando a la inglesa, que es la verdad: esa pagina no existe en
 * espanol, y el aviso de /es/ lo dice.
 */
function enlazarEnEspanol(html) {
  let cambiados = 0;

  // EL SELECTOR DE IDIOMA SE APARTA ANTES DE TOCAR NADA.
  //
  // Esta reescritura es un regex CIEGO: ve `href="/algo"` y no sabe en que elemento
  // esta ni para que sirve. Para 7.094 enlaces eso es justo lo que se quiere — que
  // el sitio en español no saque al visitante de su idioma al primer clic.
  //
  // Para UNO es exactamente al reves. El selector de idioma es el unico control del
  // sitio cuyo proposito es SALIR del idioma actual, asi que apuntarlo al español
  // es romperlo: en las 105 paginas de /es/, la opcion «English» quedaba apuntando
  // a la pagina española. Se entraba al español y no se salia. Medido en
  // dist/client/es/products/index.html:
  //
  //     <a href="/es/products/" lang="en" hreflang="en" class="idioma-opcion">
  //
  // El `hreflang` del <head> se salvo por casualidad —sus href son absolutos y este
  // patron solo captura los que empiezan por «/»—, y por eso el sintoma era solo
  // visual y ninguna puerta lo vio.
  //
  // Se aparta el bloque entero con un centinela, como ya hace traducirHtml() con
  // <style> y <script>, en vez de intentar reconocerlo dentro del replace: el
  // regex no tiene contexto de elemento, y darselo seria escribir un parser.
  const apartados = [];
  const conCentinela = html.replace(
    /<ul class="idioma-lista"[\s\S]*?<\/ul>/g,
    (bloque) => {
      apartados.push(bloque);
      return `\u0000IDIOMA${apartados.length - 1}\u0000`;
    },
  );

  const salida = conCentinela.replace(/href="(\/[^"#?]*)"/g, (todo, ruta) => {
    const es = haciaEspanol(ruta);
    if (!es || es === ruta) return todo;
    cambiados++;
    return `href="${es}"`;
  });

  const restaurado = salida.replace(
    /\u0000IDIOMA(\d+)\u0000/g,
    (_m, i) => apartados[Number(i)],
  );

  return { html: restaurado, cambiados, selectoresApartados: apartados.length };
}

function dimensionarHtml() {
  return {
    name: 'pergola-dimensionar-imagenes',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const raiz = new URL(dir).pathname;
        let tocadas = 0;
        let pendientes = 0;
        let enlaces = 0;
        let paginasEs = 0;
        const sinProteger = [];

        const recorrer = async (d) => {
          for (const e of await fs.readdir(d, { withFileTypes: true })) {
            const p = path.join(d, e.name);
            if (e.isDirectory()) { await recorrer(p); continue; }
            if (!e.name.endsWith('.html')) continue;
            const antes = await fs.readFile(p, 'utf8');
            let despues = dimensionarImagenes(antes);

            // Solo las paginas espanolas: el resto del sitio enlaza en ingles, que es
            // lo correcto.
            const rel = path.relative(raiz, p);
            if (rel === 'es/index.html' || rel.startsWith('es/')) {
              const r = enlazarEnEspanol(despues);
              despues = r.html;
              enlaces += r.cambiados;
              paginasEs++;
              // Cada pagina lleva UN selector de idioma, asi que apartar cero
              // significa que el markup cambio y la proteccion ya no engancha. Sin
              // este conteo, ese dia la reescritura volveria a apuntar la opcion
              // «English» al español y el sintoma seria otra vez invisible: el menu
              // abre, se ve bien, y no lleva a ninguna parte.
              if (r.selectoresApartados !== 1) sinProteger.push(`${rel} (${r.selectoresApartados})`);
            }

            if (despues !== antes) { await fs.writeFile(p, despues, 'utf8'); tocadas++; }
            pendientes += [...despues.matchAll(/<img\s[^>]*>/g)]
              .filter((m) => !/\bwidth=/.test(m[0]) || !/\bheight=/.test(m[0])).length;
          }
        };
        await recorrer(raiz);

        logger.info(`width/height inyectados en ${tocadas} paginas`);
        logger.info(
          `${enlaces} enlaces internos apuntados al espanol en ${paginasEs} paginas`
          + ` (selector de idioma respetado en ${paginasEs - sinProteger.length})`,
        );
        if (sinProteger.length) {
          logger.warn(
            `[idioma] ${sinProteger.length} pagina(s) sin selector que apartar: `
            + `${sinProteger.slice(0, 5).join(', ')}. La opcion «English» puede haber `
            + 'quedado apuntando al espanol. Revisa el markup de .idioma-lista en Nav.astro.',
          );
        }
        // Se avisa en vez de callar: una imagen sin medida es una imagen que sigue
        // provocando salto de layout, y quien lea el log tiene que saberlo.
        if (pendientes) {
          logger.warn(
            `${pendientes} <img> siguen sin width/height`
            + ' (ejecuta `node scripts/medir-imagenes.mjs` si has anadido imagenes)',
          );
        }
      },
    },
  };
}

/**
 * sitemap.xml + robots.txt, generados al terminar el build.
 *
 * Se hacen aqui, desde `astro:build:done`, y no con una lista escrita a mano ni con
 * @astrojs/sitemap:
 *
 *   - La lista la da Astro: son las paginas que REALMENTE se han construido. Una
 *     lista a mano se desincroniza en el primer cambio de rutas y nadie se entera
 *     hasta que Google deja de indexar algo.
 *   - Sin dependencia nueva: son cuarenta lineas y hacen falta dos cosas que la
 *     integracion oficial no da de serie tal y como las necesitamos — los
 *     `xhtml:link` alternates sacados del MISMO mapa que el hreflang, y el
 *     `lastmod` solo donde hay una fecha de verdad.
 *
 * ponytail: sin prioridad ni changefreq. Google los ignora desde 2023 y son dos
 * campos mas que mantener mintiendo.
 */
function sitemapYRobots() {
  // Fuera del sitemap. No es "paginas que no queremos": es paginas que no deben
  // aparecer en un buscador.
  const EXCLUIR = [
    '404',            // no es contenido
    'thank-you',      // solo tiene sentido tras enviar un formulario
    'api/',           // el endpoint
  ];

  return {
    name: 'pergola-sitemap-robots',
    hooks: {
      'astro:build:done': async ({ dir, pages, logger }) => {
        const raiz = new URL(dir);

        // Build no declarado como produccion: se cierra la puerta y se sale. Nada de
        // sitemap — decir "no me indexes" y a la vez entregar el mapa de las 209
        // paginas es pedirle al buscador que elija, y elige mal.
        if (!ES_PRODUCCION) {
          await fs.writeFile(
            path.join(raiz.pathname, 'robots.txt'),
            [
              'User-agent: *',
              'Disallow: /',
              '',
              '# Build sin PUBLIC_ES_PRODUCCION=1: copia provisional, no es el sitio.',
              '# El sitio en vivo es https://www.pergolaplusflorida.com',
              '',
            ].join('\n'),
            'utf8',
          );
          // Se BORRAN, no se dejan de escribir: un build anterior pudo dejarlos ahi y
          // el fichero viejo sobrevive al cambio de modo y se seguiria sirviendo.
          //
          // El RSS va en la misma lista y por una razon distinta al sitemap: sus <guid>
          // son permanentes para quien se suscriba, asi que un feed servido desde la URL
          // provisional deja a sus lectores apuntando a una URL que va a morir. Es
          // ademas lo unico que el visitante se lleva a otro programa, donde el <meta
          // noindex> no le protege — un lector de RSS no lee <meta>.
          for (const muerto of ['sitemap.xml', 'resources/blog/rss.xml']) {
            await fs.rm(path.join(raiz.pathname, muerto), { force: true });
          }
          logger.info(
            'sin PUBLIC_ES_PRODUCCION=1: robots.txt con Disallow: /, sin sitemap y sin RSS',
          );
          return;
        }

        const entradas = [];

        for (const { pathname } of pages) {
          if (EXCLUIR.some((e) => pathname === e || pathname.startsWith(e))) continue;

          const ruta = '/' + pathname;
          const archivo = path.join(raiz.pathname, pathname, 'index.html');
          const html = await fs.readFile(archivo, 'utf8').catch(() => '');
          if (!html) continue;

          // Una pagina con noindex no va al sitemap: decir las dos cosas a la vez es
          // pedirle a Google que elija.
          if (/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) continue;

          // `lastmod` SOLO si hay una fecha real. Los 21 posts la traen en su
          // JSON-LD (`dateModified`), que ya verifica check:blog. Para el resto no
          // tenemos fecha de modificacion fiable —el mtime del fuente se reinicia en
          // cada clon— y un lastmod inventado es peor que ninguno: Google deja de
          // hacerle caso al feed entero.
          const lastmod = html.match(/"dateModified"\s*:\s*"([^"]+)"/)?.[1] ?? null;

          // Los alternates salen del MISMO hreflang que ya lleva la pagina, asi que
          // no pueden contradecirlo.
          const alternates = [...html.matchAll(
            /<link rel="alternate" hreflang="(e[ns])" href="([^"]+)"/g,
          )].map((m) => ({ hreflang: m[1], href: m[2] }));

          entradas.push({ ruta, lastmod, alternates });
        }

        entradas.sort((a, b) => a.ruta.localeCompare(b.ruta));

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'
          + ' xmlns:xhtml="http://www.w3.org/1999/xhtml">',
          ...entradas.map((e) => [
            '  <url>',
            `    <loc>${new URL(e.ruta, SITIO).href}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            // Los alternates solo tienen sentido si hay mas de uno.
            ...(e.alternates.length > 1
              ? e.alternates.map((a) =>
                `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`)
              : []),
            '  </url>',
          ].filter(Boolean).join('\n')),
          '</urlset>',
          '',
        ].join('\n');

        await fs.writeFile(path.join(raiz.pathname, 'sitemap.xml'), xml, 'utf8');

        const robots = [
          'User-agent: *',
          'Allow: /',
          '',
          '# El endpoint de formularios no es contenido y solo acepta POST.',
          'Disallow: /api/',
          '',
          `Sitemap: ${new URL('/sitemap.xml', SITIO).href}`,
          '',
        ].join('\n');

        await fs.writeFile(path.join(raiz.pathname, 'robots.txt'), robots, 'utf8');

        const conFecha = entradas.filter((e) => e.lastmod).length;
        logger.info(
          `sitemap.xml con ${entradas.length} urls (${conFecha} con lastmod real) + robots.txt`,
        );
      },
    },
  };
}

// Aviso en CADA build, no una nota en un README que nadie abre: sin
// TURNSTILE_SECRET_KEY el endpoint acepta los leads marcandolos verificado:false.
// Es lo correcto en local —si no, no se podria probar el circuito— y es un agujero
// en produccion. Que salga en el log del deploy es lo que hace que se note.
//
// Lo que NO puede pasar, y por eso esta escrito asi en src/pages/api/lead.ts: que
// con el secreto PUESTO un token ausente signifique "pasa". Ese fallo abierto ya se
// colo en otro sitio de la casa.
if (!process.env.TURNSTILE_SECRET_KEY) {
  console.warn(
    '\n  [turnstile] TURNSTILE_SECRET_KEY sin definir: /api/lead acepta los leads\n'
    + '              marcandolos verificado:false. En produccion hay que definirla.\n',
  );
}

// El aviso que de verdad importa antes de un despliegue.
//
// entregarLead() tiene tres canales: log, archivo local y webhook. En Vercel el disco
// es de solo lectura, asi que el archivo NO existe; y sin webhook ni correo el UNICO
// canal vivo es el log de la funcion. Un lead que solo queda en un log es un lead
// perdido: nadie mira los logs.
//
// Se avisa en CADA build, con nombre y apellidos de lo que hay que hacer, porque este
// es el fallo que no da error: los formularios responden 303, el visitante ve
// "gracias", y el negocio no se entera de que no le llega nada.
const HAY_CORREO = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
if (!HAY_CORREO && !process.env.LEAD_WEBHOOK_URL) {
  console.warn(
    '\n  ============================================================\n'
    + '  [leads] SIN CANAL DE ENTREGA.\n'
    + '\n'
    + '  En produccion el disco es de solo lectura, asi que sin correo\n'
    + '  ni webhook no queda ni un canal: /api/lead devolvera 500 y el\n'
    + '  visitante vera el telefono en vez de la pagina de gracias.\n'
    + '\n'
    + '  Eso es lo correcto —antes respondia "gracias" y el lead se\n'
    + '  perdia— pero significa que el formulario NO capta.\n'
    + '\n'
    + '  Hace falta UNA de estas dos, y basta con una:\n'
    + '    - SMTP_HOST + SMTP_USER + SMTP_PASS + LEAD_NOTIFY_TO, o\n'
    + '    - LEAD_WEBHOOK_URL con la URL del CRM.\n'
    + '\n'
    + '  Detalle en .env.example y en src/lib/lead.ts.\n'
    + '  ============================================================\n',
  );
}

// https://astro.build/config
export default defineConfig({
  // `site` alimenta las canonicas del BaseLayout, el sitemap, el robots, el JSON-LD
  // y los <link>/<guid> de /resources/blog/rss.xml. Nada deriva el dominio por su
  // cuenta, asi que esta linea los arregla todos de golpe — y los envenenaba todos
  // de golpe: apuntando al staging de Webflow habia 761 referencias a webflow.io en
  // las 107 paginas construidas.
  //
  // El dominio se puede sobreescribir sin tocar codigo, que es lo que hara Vercel.
  // El fallback es el dominio que el cliente ya usa.
  //
  // OJO con el RSS: los <guid> son permanentes para quien se suscriba. NO difundas
  // el feed hasta que el dominio este confirmado por escrito (ver
  // docs/estado-final.md).
  site: SITIO,

  adapter: vercel(),

  // El orden importa: primero se dimensionan las imagenes y luego se genera el
  // sitemap, que lee el HTML ya final para sacar los hreflang y el lastmod.
  integrations: [dimensionarHtml(), sitemapYRobots()],

  // Redirects 301. Van en la config y no en JavaScript de cliente: un redirect que
  // necesita que el navegador ejecute algo no lo sigue ningun buscador, y pierde el
  // enlace entrante que veniamos a salvar.
  //
  // El mapa completo, con el porque de cada uno, esta en docs/redirects.md.
  redirects: {
    // Enlace roto que YA estaba en produccion: aparecia 2 veces en el export y 1 en
    // el vivo, y daba 404. El markup se corrige en el transformador
    // (ENLACES_ROTOS), pero quien lo tenga guardado o enlazado desde fuera sigue
    // llegando aqui.
    '/deck-builders': { status: 301, destination: '/services/deck-builders' },
    // /about-us tampoco existe: la pagina es /about-us/about-us. Lo enlazaban el
    // menu y el pie de las 113 paginas, asi que cualquiera que lo tenga guardado o
    // enlazado desde fuera esta llegando a un 404. Los enlaces ya estan corregidos;
    // esto salva a quien tenga el enlace viejo.
    '/about-us': { status: 301, destination: '/about-us/about-us' },
  },

  // NO anadir View Transitions / ClientRouter: las 749 interacciones IX2 de
  // webflow.js se inicializan una sola vez por documento y moririan a partir de
  // la segunda pagina. Ver el plan, seccion "Animaciones".
});
