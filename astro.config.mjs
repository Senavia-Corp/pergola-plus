// @ts-check
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';

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
