/**
 * Precios y reglas del estimador (`/project-estimator`). Decision de la coordinacion del
 * 20-oct-2026: van en Sanity («100 % CMS»), con los valores IDENTICOS a
 * src/data/estimador.ts y validacion de minimo/maximo. Cambiar un precio aqui cambia las
 * cotizaciones que ve el visitante: la guia de uso lo advierte.
 *
 * Los textos del estimador (src/i18n/estimador.ts) van en `textos`; los `id` no se
 * editan porque los usan el codigo y el CRM.
 */
import { defineArrayMember, defineField, defineType } from 'sanity';

/** Tope por campo: muy por encima de cualquier cifra real, por debajo de un error de dedo. */
const TOPE_PIE = 1000; // USD por pie cuadrado
const TOPE_PARTIDA = 200000; // USD por partida

const FUENTES = [
  { title: 'Publicada (guía de costes de Pergola Plus)', value: 'publicada' },
  { title: 'Mercado (pendiente de confirmar por Pergola Plus)', value: 'mercado' },
  { title: 'Sin confirmar', value: 'sin-confirmar' },
];

/** Banda de precio. `unidad` solo cambia el tope de la validacion. */
function tarifa(name: string, title: string, unidad: 'pie' | 'partida', opcional = false) {
  const tope = unidad === 'pie' ? TOPE_PIE : TOPE_PARTIDA;
  return defineField({
    name,
    title,
    type: 'object',
    options: { columns: 2 },
    fields: [
      defineField({ name: 'min', title: unidad === 'pie' ? 'Mínimo (USD/ft²)' : 'Mínimo (USD)', type: 'number', validation: (r) => r.required().min(0).max(tope) }),
      defineField({ name: 'max', title: unidad === 'pie' ? 'Máximo (USD/ft²)' : 'Máximo (USD)', type: 'number', validation: (r) => r.required().min(0).max(tope) }),
      defineField({ name: 'techoAbierto', title: 'El máximo es orientativo («+»)', type: 'boolean', initialValue: false }),
      defineField({ name: 'fuente', title: 'Fuente de la cifra', type: 'string', options: { list: FUENTES }, validation: (r) => r.required() }),
      defineField({ name: 'nota', title: 'De dónde sale', type: 'string' }),
    ],
    validation: (r) =>
      r.custom((t: { min?: number; max?: number; fuente?: string; nota?: string } | undefined) => {
        if (!t) return opcional ? true : 'Falta la banda de precio';
        if (t.min != null && t.max != null && t.min > t.max) return 'El mínimo no puede ser mayor que el máximo';
        if (t.fuente && t.fuente !== 'publicada' && !t.nota?.trim()) return 'Indica de dónde sale una cifra que no es publicada';
        return true;
      }),
  });
}

const idFijo = defineField({ name: 'id', title: 'Identificador', type: 'string', readOnly: true, validation: (r) => r.required() });

export const estimador = defineType({
  name: 'estimador',
  title: 'Estimador de proyectos',
  type: 'document',
  description: 'Cambiar un precio cambia las cotizaciones que ven los visitantes.',
  fields: [
    defineField({
      name: 'productos',
      title: 'Productos (paso 1), por ft² instalado',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'productoEstimador',
          type: 'object',
          fields: [
            idFijo,
            defineField({ name: 'producto', title: 'Ficha', type: 'reference', to: [{ type: 'product' }, { type: 'service' }] }),
            defineField({ name: 'imagen', title: 'Foto de la tarjeta', type: 'imagen' }),
            defineField({ name: 'soloCotizacion', title: 'Solo cotización (no entra en el cálculo)', type: 'boolean', initialValue: false }),
            { ...tarifa('tarifa', 'Precio', 'pie', true), hidden: ({ parent }: { parent?: { soloCotizacion?: boolean } }) => parent?.soloCotizacion === true },
            defineField({ name: 'siempreExenta', title: 'Siempre exenta (sin pregunta de montaje)', type: 'boolean', initialValue: false }),
          ],
          preview: { select: { title: 'id' } },
        }),
      ],
    }),
    defineField({
      name: 'montaje',
      title: 'Montaje (multiplicador)',
      type: 'object',
      options: { columns: 2 },
      fields: [
        defineField({ name: 'adosada', title: 'Adosada', type: 'number', validation: (r) => r.required().min(0.5).max(1.5) }),
        defineField({ name: 'exenta', title: 'Exenta', type: 'number', validation: (r) => r.required().min(0.5).max(1.5) }),
      ],
    }),
    defineField({
      name: 'superficies',
      title: 'Superficie (paso 2), por ft²',
      type: 'object',
      fields: [
        tarifa('losaOk', 'Losa existente en buen estado', 'pie'),
        tarifa('paversOk', 'Pavers existentes en buen estado', 'pie'),
        tarifa('nuevaLosa', 'Losa nueva', 'pie'),
        tarifa('nuevaPavers', 'Pavers nuevos', 'pie'),
        tarifa('deckMadera', 'Deck de madera', 'pie'),
      ],
    }),
    tarifa('ingenieria', 'Ingeniería y permisos (banda publicada)', 'partida'),
    defineField({
      name: 'condados',
      title: 'Ingeniería por condado (código postal)',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'condadoEstimador',
          type: 'object',
          fields: [
            idFijo,
            defineField({ name: 'desde', title: 'Código postal desde', type: 'number', validation: (r) => r.required().min(32000).max(34999).integer() }),
            defineField({ name: 'hasta', title: 'Código postal hasta', type: 'number', validation: (r) => r.required().min(32000).max(34999).integer() }),
            defineField({ name: 'min', title: 'Mínimo (USD)', type: 'number', validation: (r) => r.required().min(0).max(TOPE_PARTIDA) }),
            defineField({ name: 'max', title: 'Máximo (USD)', type: 'number', validation: (r) => r.required().min(0).max(TOPE_PARTIDA) }),
          ],
          validation: (r) =>
            r.custom((c: { desde?: number; hasta?: number; min?: number; max?: number } | undefined) => {
              if (c?.desde != null && c?.hasta != null && c.desde > c.hasta) return 'El código postal inicial no puede ser mayor que el final';
              if (c?.min != null && c?.max != null && c.min > c.max) return 'El mínimo no puede ser mayor que el máximo';
              return true;
            }),
          preview: { select: { title: 'id', subtitle: 'desde' } },
        }),
      ],
    }),
    tarifa('waterfront', 'Frente al agua', 'partida'),
    defineField({
      name: 'mejoras',
      title: 'Mejoras (paso 4)',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'mejoraEstimador',
          type: 'object',
          fields: [
            idFijo,
            defineField({ name: 'grupo', title: 'Grupo (las del mismo grupo suman su banda una sola vez)', type: 'string' }),
            defineField({ name: 'seConfirmaEnVisita', title: 'Sin precio: se confirma en la visita', type: 'boolean', initialValue: false }),
            { ...tarifa('tarifa', 'Precio', 'partida', true), hidden: ({ parent }: { parent?: { seConfirmaEnVisita?: boolean } }) => parent?.seConfirmaEnVisita === true },
          ],
          preview: { select: { title: 'id', subtitle: 'grupo' } },
        }),
      ],
    }),
    defineField({
      name: 'medidas',
      title: 'Medidas (paso 3), en pies',
      type: 'object',
      options: { columns: 2 },
      fields: [
        defineField({ name: 'minFt', title: 'Mínimo', type: 'number', validation: (r) => r.required().min(1).max(200).integer() }),
        defineField({ name: 'maxFt', title: 'Máximo', type: 'number', validation: (r) => r.required().min(1).max(200).integer() }),
        defineField({ name: 'anchoPorDefecto', title: 'Ancho por defecto', type: 'number', validation: (r) => r.required().min(1).max(200).integer() }),
        defineField({ name: 'largoPorDefecto', title: 'Largo por defecto', type: 'number', validation: (r) => r.required().min(1).max(200).integer() }),
        defineField({ name: 'presetPorDefecto', title: 'Tamaño preseleccionado', type: 'string', validation: (r) => r.required() }),
      ],
      validation: (r) =>
        r.custom((m: { minFt?: number; maxFt?: number; anchoPorDefecto?: number; largoPorDefecto?: number } | undefined) => {
          if (!m || m.minFt == null || m.maxFt == null) return true;
          if (m.minFt >= m.maxFt) return 'El mínimo tiene que ser menor que el máximo';
          const fuera = [m.anchoPorDefecto, m.largoPorDefecto].some((x) => x != null && (x < m.minFt! || x > m.maxFt!));
          return fuera ? 'Las medidas por defecto tienen que estar entre el mínimo y el máximo' : true;
        }),
    }),
    defineField({
      name: 'presets',
      title: 'Tamaños rápidos',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'presetEstimador',
          type: 'object',
          fields: [
            idFijo,
            defineField({ name: 'ancho', title: 'Ancho (ft)', type: 'number', validation: (r) => r.required().min(1).max(200).integer() }),
            defineField({ name: 'largo', title: 'Largo (ft)', type: 'number', validation: (r) => r.required().min(1).max(200).integer() }),
          ],
          preview: { select: { title: 'id', subtitle: 'ancho' } },
        }),
      ],
    }),
    defineField({ name: 'textos', title: 'Textos del estimador', type: 'array', of: [{ type: 'elemento' }] }),
  ],
  preview: { prepare: () => ({ title: 'Estimador de proyectos' }) },
});
