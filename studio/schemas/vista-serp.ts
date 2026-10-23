/**
 * Vista previa del resultado en Google, debajo de los campos SEO de cada documento (T16 del
 * informe 08). Corta como Google: el título hacia los 60 caracteres y la descripción hacia los
 * 160 (aproximación por caracteres, no por píxeles). En inglés y en español.
 *
 * Sin JSX a propósito: este fichero lo importa el esquema, y `sanity exec` (que usan las puertas
 * del loop para leer el esquema) no transforma JSX.
 */
import { createElement as h } from 'react';
import { Box, Card, Stack, Text } from '@sanity/ui';
import type { ObjectInputProps } from 'sanity';

type Seo = { titulo?: { en?: string; es?: string }; descripcion?: { en?: string; es?: string } };
const cortar = (t: string, n: number) => (t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t);

function resultado(idioma: string, titulo = '', descripcion = '') {
  if (!titulo && !descripcion) return null;
  return h(Card, { padding: 3, radius: 2, tone: 'transparent', border: true },
    h(Stack, { space: 2 },
      h(Text, { size: 0, muted: true }, `${idioma} · título ${titulo.length}/60 · descripción ${descripcion.length}/160`),
      h(Text, { size: 2, style: { color: '#1a0dab' } }, cortar(titulo, 60) || '(sin título)'),
      h(Text, { size: 1, muted: true }, cortar(descripcion, 160) || '(sin descripción: Google tomará un trozo del texto)')));
}

export function VistaSerp(props: ObjectInputProps) {
  const v = (props.value ?? {}) as Seo;
  return h(Stack, { space: 3 },
    props.renderDefault(props),
    h(Box, null, h(Stack, { space: 2 },
      h(Text, { size: 1, weight: 'semibold' }, 'Así puede verse en Google'),
      resultado('EN', v.titulo?.en, v.descripcion?.en),
      resultado('ES', v.titulo?.es, v.descripcion?.es))));
}
