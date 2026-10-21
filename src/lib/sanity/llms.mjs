/**
 * /llms.txt (formato de llmstxt.org) desde la instantanea del dataset: el negocio de
 * `siteSettings` y las paginas indexables con su titulo y su descripcion SEO tal como
 * estan en Sanity. Ingles, con una seccion en español al final. Nada que no este ya
 * publicado en el sitio. Solo en produccion (astro.config.mjs, sitemapYRobots).
 *
 *   llmsDesde(docs, { sitio, enSitemap, rutaDe, canonica }) -> texto
 *
 * `enSitemap`: las rutas (con barra final) que van al sitemap; lo que no esta ahi (404,
 * thank-you, noindex) no entra.
 */
const QUITAR_MARCA = / [|–-] Pergola Plus Florida$/;
const limpio = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const fecha = (d) => String(d.fechaPublicacion ?? d._createdAt ?? '');

const SECCIONES = [
  { tipo: 'product', en: 'Products', es: 'Productos' },
  { tipo: 'service', en: 'Services', es: 'Servicios' },
  { tipo: 'brand', en: 'Brands', es: 'Marcas' },
  { tipo: 'county', en: 'Service areas: counties', es: 'Zonas de servicio: condados' },
  { tipo: 'city', en: 'Service areas: cities', es: 'Zonas de servicio: ciudades' },
  { tipo: 'project', en: 'Projects', es: 'Proyectos' },
  { tipo: 'post', en: 'Blog', es: 'Blog', orden: (a, b) => fecha(b).localeCompare(fecha(a)) },
  { tipo: 'page', en: 'Company and resources', es: 'Empresa y recursos' },
  { tipo: 'legalPage', en: 'Legal', es: 'Legal' },
];

export function llmsDesde(docs, { sitio, enSitemap, rutaDe, canonica }) {
  const s = docs.find((d) => d._id === 'siteSettings');
  const home = docs.find((d) => d._id === 'page-index');
  if (!s || !home) throw new Error('[llms] faltan siteSettings o page-index');
  const url = (ruta) => new URL(canonica(ruta), sitio).href;
  const nombre = (d, idioma) => {
    const n = d._type === 'post' ? d.titulo : d.nombre;
    return limpio((idioma === 'es' ? n?.es : n?.en) ?? (idioma === 'es' ? d.seo?.titulo?.es : d.seo?.titulo?.en)).replace(QUITAR_MARCA, '');
  };
  const linea = (d, idioma) => {
    const ruta = (idioma === 'es' ? '/es' : '') + rutaDe(d);
    if (!enSitemap.has(canonica(ruta))) return null;
    const desc = limpio(idioma === 'es' ? d.seo?.descripcion?.es : d.seo?.descripcion?.en);
    return `- [${nombre(d, idioma)}](${url(ruta)})${desc ? `: ${desc}` : ''}`;
  };
  const bloque = (idioma) => SECCIONES.flatMap((sec) => {
    const lista = docs
      .filter((d) => d._type === sec.tipo && d._id !== 'page-index' && (d._type !== 'blogCategory'))
      .sort(sec.orden ?? ((a, b) => nombre(a, 'en').localeCompare(nombre(b, 'en'))))
      .map((d) => linea(d, idioma))
      .filter(Boolean);
    return lista.length ? ['', `## ${sec[idioma]}`, '', ...lista] : [];
  });

  const dir = s.direccion;
  const direccion = `${dir.calle}, ${dir.ciudad}, ${dir.estado} ${dir.cp}`;
  const condados = (s.condadosServidos ?? []).join(', ');
  return [
    `# ${limpio(s.nombreComercial)}`,
    '',
    `> ${limpio(home.seo.descripcion.en)}`,
    '',
    `- Address: ${direccion}`,
    `- Phone: ${s.telefonoPrincipal}`,
    `- Email: ${s.correoPublico}`,
    `- Hours: ${limpio(s.horario?.en)}`,
    `- Service area: ${condados}`,
    `- Home: ${url('/')}`,
    ...bloque('en'),
    '',
    '## Español',
    '',
    `> ${limpio(home.seo.descripcion.es)}`,
    '',
    `- Dirección: ${direccion}`,
    `- Teléfono: ${s.telefonoPrincipal}`,
    `- Horario: ${limpio(s.horario?.es)}`,
    `- Inicio: ${url('/es/')}`,
    ...bloque('es').map((l) => (l.startsWith('## ') ? `#${l}` : l)),
    '',
  ].join('\n');
}
