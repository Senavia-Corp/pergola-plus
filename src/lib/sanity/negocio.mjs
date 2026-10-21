/**
 * NEGOCIO (src/lib/jsonld.ts) desde `siteSettings`, con la misma forma. Pura.
 *
 * El telefono del JSON-LD es el del sitio en formato E.164 con guiones (+1-561-…), el
 * mismo que se publicaba a mano (src/lib/sanity/contacto-sitio.mjs).
 */
import { contactoSitio } from './contacto-sitio.mjs';
export function negocioDesde(s) {
  const c = contactoSitio(s);
  const d = s.direccion;
  return {
    nombre: s.nombreComercial,
    // El del sitio: el principal, o el de contacto si se activa en todo el sitio.
    telefono: c.tel.e164,
    email: c.correo,
    // La suite solo si se muestra en todo el sitio (hoy, solo en contacto).
    calle: d.suiteEnTodoElSitio && d.suite ? `${d.calle}, ${d.suite}` : d.calle,
    ciudad: d.ciudad,
    region: d.estado,
    postal: d.cp,
    pais: d.pais ?? 'US',
    horario: { dias: [...(s.horarioEstructurado?.dias ?? [])], abre: s.horarioEstructurado?.abre, cierra: s.horarioEstructurado?.cierra },
    redes: [...(s.redes ?? [])],
    condados: [...(s.condadosServidos ?? [])],
  };
}
