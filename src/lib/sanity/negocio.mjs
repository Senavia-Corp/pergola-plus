/**
 * NEGOCIO (src/lib/jsonld.ts) desde `siteSettings`, con la misma forma. Pura.
 *
 * El telefono del JSON-LD es el principal en formato E.164 con guiones (+1-561-…), el
 * mismo que se publicaba a mano.
 */
export function negocioDesde(s) {
  const tel = s.telefonoPrincipal.match(/^\((\d{3})\) (\d{3})-(\d{4})$/);
  if (!tel) throw new Error(`[sanity] siteSettings.telefonoPrincipal con formato inesperado: ${s.telefonoPrincipal}`);
  const d = s.direccion;
  return {
    nombre: s.nombreComercial,
    telefono: `+1-${tel[1]}-${tel[2]}-${tel[3]}`,
    email: s.correoPublico,
    calle: d.calle,
    ciudad: d.ciudad,
    region: d.estado,
    postal: d.cp,
    pais: d.pais ?? 'US',
    horario: { dias: [...(s.horarioEstructurado?.dias ?? [])], abre: s.horarioEstructurado?.abre, cierra: s.horarioEstructurado?.cierra },
    redes: [...(s.redes ?? [])],
    condados: [...(s.condadosServidos ?? [])],
  };
}
