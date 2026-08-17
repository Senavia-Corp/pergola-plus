// @ts-check
import fs from 'node:fs/promises';
import path from 'node:path';
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';
import { dimensionarImagenes } from './scripts/lib/transformar.mjs';

const SITIO = process.env.PUBLIC_SITE_URL ?? 'https://www.pergolaplusflorida.com';

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
function dimensionarHtml() {
  return {
    name: 'pergola-dimensionar-imagenes',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const raiz = new URL(dir).pathname;
        let tocadas = 0;
        let pendientes = 0;

        const recorrer = async (d) => {
          for (const e of await fs.readdir(d, { withFileTypes: true })) {
            const p = path.join(d, e.name);
            if (e.isDirectory()) { await recorrer(p); continue; }
            if (!e.name.endsWith('.html')) continue;
            const antes = await fs.readFile(p, 'utf8');
            const despues = dimensionarImagenes(antes);
            if (despues !== antes) { await fs.writeFile(p, despues, 'utf8'); tocadas++; }
            pendientes += [...despues.matchAll(/<img\s[^>]*>/g)]
              .filter((m) => !/\bwidth=/.test(m[0]) || !/\bheight=/.test(m[0])).length;
          }
        };
        await recorrer(raiz);

        logger.info(`width/height inyectados en ${tocadas} paginas`);
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
  },

  // NO anadir View Transitions / ClientRouter: las 749 interacciones IX2 de
  // webflow.js se inicializan una sola vez por documento y moririan a partir de
  // la segunda pagina. Ver el plan, seccion "Animaciones".
});
