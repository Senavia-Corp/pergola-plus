/**
 * Telefono, correo y direccion que publica el sitio, desde `siteSettings`:
 *
 *   tel          el del sitio entero: el principal, o el de contacto si
 *                `telefonoContactoEnTodoElSitio` esta activado
 *   telContacto  el de la pagina de contacto (si falta, el principal)
 *   correo       correoPublico
 *   direccion    con la suite solo si `suiteEnTodoElSitio`; `direccionContacto`
 *                siempre con ella (la pagina de contacto la muestra)
 *
 * Con el build leyendo del repo, `siteSettings` es null y valen los datos migrados.
 *
 * El contenido migrado (fragmentos, cuerpos) lleva el telefono y el correo escritos tal
 * cual: `aplicarContacto` los cambia por los de siteSettings al pintar. Con los valores
 * de hoy no cambia ni un byte.
 */
// Los que trae el contenido migrado de Webflow (y los de siteSettings al migrar).
const MIGRADO = { telefonoPrincipal: '(561) 710-8363', telefonoContacto: '(561) 292-5054', correoPublico: 'info@pergolaplusflorida.com' };

const telefono = (visible) => {
  const m = visible.match(/^\((\d{3})\) (\d{3})-(\d{4})$/);
  if (!m) throw new Error(`[contacto] telefono con formato inesperado: ${visible}`);
  const d = `1${m[1]}${m[2]}${m[3]}`;
  return { visible, href: `tel:+${d}`, wa: `https://wa.me/${d}`, e164: `+1-${m[1]}-${m[2]}-${m[3]}` };
};

export function contactoSitio(s) {
  const principal = telefono(s?.telefonoPrincipal ?? MIGRADO.telefonoPrincipal);
  const contacto = telefono(s ? (s.telefonoContacto || s.telefonoPrincipal) : MIGRADO.telefonoContacto);
  const d = s?.direccion;
  const conSuite = d ? `${d.calle}, ${d.suite ? `${d.suite}, ` : ''}${d.ciudad}, ${d.estado} ${d.cp}` : '980 N Federal Hwy, Suite 110, Boca Raton, FL 33432';
  const sinSuite = d ? `${d.calle}, ${d.ciudad}, ${d.estado} ${d.cp}` : '980 N Federal Hwy, Boca Raton, FL 33432';
  return {
    tel: s?.telefonoContactoEnTodoElSitio ? contacto : principal,
    telContacto: contacto,
    correo: s?.correoPublico ?? MIGRADO.correoPublico,
    direccion: s?.direccion?.suiteEnTodoElSitio ? conSuite : sinSuite,
    direccionContacto: conSuite,
  };
}

/** Cambia en un HTML migrado el telefono y el correo migrados por los del sitio. */
export function aplicarContacto(html, c) {
  const viejo = telefono(MIGRADO.telefonoPrincipal), viejoC = telefono(MIGRADO.telefonoContacto);
  let h = html;
  const cambiar = (de, a) => { if (de !== a) h = h.split(de).join(a); };
  for (const [v, n] of [[viejo, c.tel], [viejoC, c.telContacto]]) {
    if (v.visible === n.visible) continue;
    cambiar(v.href, n.href); cambiar(v.wa, n.wa); cambiar(v.visible, n.visible);
  }
  cambiar(MIGRADO.correoPublico, c.correo);
  return h;
}
