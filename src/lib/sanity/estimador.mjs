/**
 * El calculador desde el documento `estimador`, con la forma de src/data/estimador.ts
 * (tarifas, productos, condados, mejoras, medidas) e src/i18n/estimador.ts (textos).
 * Pura: scripts/sanity/paridad.mjs la compara con el repo.
 */
import { desaplanar } from '../plantilla-sanity.mjs';

const SUP = { losaOk: 'losa-ok', paversOk: 'pavers-ok', nuevaLosa: 'nueva-losa', nuevaPavers: 'nueva-pavers', deckMadera: 'deck-madera' };
const tarifa = (t) => (t == null ? null : {
  min: t.min, max: t.max, ...(t.techoAbierto ? { techoAbierto: true } : {}), fuente: t.fuente, ...(t.nota ? { nota: t.nota } : {}),
});

/** @param conv {{ rutaImagen(imagen): string, rutaDeRef(ref): string }} */
export function estimadorDesde(c, conv) {
  const e = c.doc('estimador');
  if (!e) throw new Error('[sanity] falta el documento estimador');
  return {
    PRODUCTOS: e.productos.map((p) => ({
      id: p.id,
      imagen: conv.rutaImagen(p.imagen),
      href: conv.rutaDeRef(p.producto),
      tarifa: p.soloCotizacion ? null : tarifa(p.tarifa),
      ...(p.siempreExenta ? { siempreExenta: true } : {}),
    })),
    MONTAJE: { adosada: e.montaje.adosada, exenta: e.montaje.exenta },
    SUPERFICIES: Object.fromEntries(Object.entries(SUP).map(([campo, id]) => [id, tarifa(e.superficies[campo])])),
    INGENIERIA: tarifa(e.ingenieria),
    CONDADOS: e.condados.map((x) => ({ id: x.id, desde: x.desde, hasta: x.hasta, min: x.min, max: x.max })),
    WATERFRONT: tarifa(e.waterfront),
    MEJORAS: e.mejoras.map((m) => ({ id: m.id, ...(m.grupo ? { grupo: m.grupo } : {}), tarifa: m.seConfirmaEnVisita ? null : tarifa(m.tarifa) })),
    MIN_FT: e.medidas.minFt,
    MAX_FT: e.medidas.maxFt,
    PRESETS: e.presets.map((p) => ({ id: p.id, ancho: p.ancho, largo: p.largo })),
    PRESET_POR_DEFECTO: e.medidas.presetPorDefecto,
    ANCHO_POR_DEFECTO: e.medidas.anchoPorDefecto,
    LARGO_POR_DEFECTO: e.medidas.largoPorDefecto,
    ESTIMADOR_EN: desaplanar(e.textos, 'en'),
    ESTIMADOR_ES: desaplanar(e.textos, 'es'),
  };
}
