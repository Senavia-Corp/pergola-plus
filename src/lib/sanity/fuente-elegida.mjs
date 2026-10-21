/**
 * De donde lee el build. Por defecto, Sanity (la instantanea del dataset que deja
 * scripts/sanity/instantanea.mjs); `PP_FUENTE=repo` vuelve a los literales migrados del
 * repo (src/contenido-migrado, src/data, src/i18n), que se quedan como referencia de
 * check:sanity-fidelidad.
 *
 * Sin dependencias, para que lo lean igual Vite, astro.config.mjs y los scripts de Node.
 */
export const FUENTE = process.env.PP_FUENTE === 'repo' ? 'repo' : 'sanity';
