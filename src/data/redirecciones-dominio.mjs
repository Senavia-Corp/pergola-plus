/**
 * Las URLs que HOY publica www.pergolaplusflorida.com y que el sitio nuevo no tiene.
 *
 * El dominio no lo sirve el Webflow que se migro (el staging pergola-plus-florida.webflow.io,
 * sitio 6903b7…), sino OTRO sitio de Webflow mas viejo (63f3b8…), con otra estructura de
 * URLs. Sacado de su sitemap el 30-sep-2026: 64 URLs, las 64 en 200. 27 ya existen igual
 * en el sitio nuevo (home, /thank-you y las 25 /pergolas-contractors/); estas son las 37
 * restantes. Sin ellas, el dia que el dominio pase a Vercel darian 404 y se perderia lo
 * que Google tiene indexado.
 *
 * Tres grados de confianza, anotados por grupo:
 *   - MISMO CONTENIDO: la misma pagina con otra URL (marcas, proyectos, legales).
 *   - EQUIVALENTE: la pagina nueva que cubre el mismo servicio.
 *   - POR TEMA: el articulo viejo ya no existe; va al nuevo mas cercano. Revisable.
 *
 * Solo la forma sin barra final, que es la que publica Webflow. La tabla, en
 * docs/redirects.md. Que cada destino exista lo comprueba scripts/rutas-vercel.mjs.
 */
export const REDIRECCIONES_DOMINIO = {
  // --- Mismo contenido: indices y legales ---
  '/blog': '/resources/blog',
  '/contact-us': '/contact-us/get-in-touch',
  '/customer-reviews': '/about-us/testimonials',
  '/our-work': '/project-gallery',
  '/projects': '/project-gallery',
  '/terms-conditions': '/articles/terms-of-service',

  // --- Mismo contenido: marcas ---
  '/our-brands': '/about-us/brands',
  '/our-brands/apollo': '/brands/apollo',
  '/our-brands/equinox': '/brands/equinox',
  '/our-brands/fenetex': '/brands/fenetex',
  '/our-brands/forte': '/brands/pergola-plus-forte',
  '/our-brands/renaissance': '/brands/renaissance',

  // --- Mismo contenido: los 10 proyectos, con el mismo titulo y otro slug ---
  '/project/boca-raton-pergola-project': '/project/attached-forte-plus-pergola-on-the-intracoastal-in-boca-raton',
  '/project/commercial-patio-cover-project': '/project/eclipse-cabanas-forte-pergola-hospitality-project-in-riviera-beach',
  '/project/delray-beach-pergola-project': '/project/forte-pergola-with-privacy-wall-tv-mount-in-delray-beach',
  '/project/forte-patio-cover-project': '/project/forte-pergolas-in-greenacres-pool-patio',
  '/project/forte-patio-cover-project-2': '/project/forte-plus-pergola-with-outdoor-kitchen-in-delray-beach',
  '/project/forte-patio-cover-project-3': '/project/forte-pergola-with-partial-privacy-wall-in-palm-beach-gardens',
  '/project/forte-patio-cover-project-4': '/project/forte-pergola-with-privacy-wall-motorized-screen-in-delray-beach',
  '/project/forte-patio-cover-project-5': '/project/forte-plus-aluminum-carport-installation-in-pompano-beach',
  '/project/hillsboro-beach-pergola-project': '/project/forte-plus-pergolas-in-hillsboro-beach-estate',
  '/project/pergola-project-in-west-palm-beach': '/project/attached-forte-pergola-in-west-palm-beach',

  // --- Equivalente: servicios con otro slug (varios son hoy productos) ---
  '/services/carports-installation-contractors': '/products/carports',
  '/services/driveway-pavers': '/services/driveways',
  '/services/fencing-solutions': '/services/fence-solutions',
  '/services/louvered-roof-systems': '/products/motorized-louvered-pergolas',
  '/services/pergolas-patio-covers': '/services/pergola-design-construction',
  '/services/pool-and-patio-enclosures': '/products/screen-enclosures',
  '/services/solar-patio-covers': '/products/solar-pergolas',

  // --- Por tema: articulos que no pasaron al blog nuevo. Revisables ---
  '/post/aluminum-vs-wood-pergolas-which-one-is-right-for-you': '/post/aluminum-vs-wood-pergolas-humid-climate',
  '/post/why-choose-a-metal-pergola-over-wood': '/post/aluminum-vs-wood-pergolas-humid-climate',
  '/post/why-aluminum-pergolas-are-the-best-choice-for-your-outdoor-living-space': '/post/best-pergola-materials-coastal-florida',
  '/post/how-long-can-you-expect-a-pergola-to-last': '/post/best-pergola-materials-coastal-florida',
  '/post/louvered-pergola-vs-traditional-pergola-whats-the-difference': '/post/is-a-louvered-roof-pergola-worth-it-in-florida',
  '/post/do-motorized-pergolas-increase-home-value': '/post/is-a-louvered-roof-pergola-worth-it-in-florida',
  '/post/does-a-pergola-increase-property-value': '/post/pergola-cost-south-florida',
  '/post/how-an-aluminum-pergola-adds-an-extra-room-to-your-home': '/post/can-you-use-your-patio-year-round-in-south-florida',
};
