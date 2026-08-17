// @ts-check
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';

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
  // TODO Fase 2: cambiar al dominio de produccion real cuando se confirme.
  // Todo el pre-vuelo se verifico contra este staging (ver docs/fase0-hallazgos.md).
  //
  // `site` alimenta las canonicas del BaseLayout, el sitemap, el JSON-LD del blog
  // y los <link>/<guid> de /resources/blog/rss.xml. Cambiar esta linea los arregla
  // todos de golpe: nada deriva el dominio por su cuenta.
  //
  // OJO con el RSS: los <guid> son permanentes para quien se suscriba. NO difundas
  // el feed en ningun sitio hasta que esta linea apunte a produccion.
  site: 'https://pergola-plus-florida.webflow.io',

  adapter: vercel(),

  // NO anadir View Transitions / ClientRouter: las 749 interacciones IX2 de
  // webflow.js se inicializan una sola vez por documento y moririan a partir de
  // la segunda pagina. Ver el plan, seccion "Animaciones".
});
