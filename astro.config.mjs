// @ts-check
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // TODO Fase 2: cambiar al dominio de produccion real cuando se confirme.
  // Todo el pre-vuelo se verifico contra este staging (ver docs/fase0-hallazgos.md).
  // `site` alimenta las canonicas del BaseLayout y el sitemap.
  site: 'https://pergola-plus-florida.webflow.io',

  adapter: vercel(),

  // NO anadir View Transitions / ClientRouter: las 749 interacciones IX2 de
  // webflow.js se inicializan una sola vez por documento y moririan a partir de
  // la segunda pagina. Ver el plan, seccion "Animaciones".
});
