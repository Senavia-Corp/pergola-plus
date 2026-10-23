/**
 * Vista previa del resultado en Google, debajo de los campos SEO de cada documento (T16 del
 * informe 08). Corta como Google: el título hacia los 60 caracteres y la descripción hacia los
 * 160 (aproximación por caracteres, no por píxeles). En inglés y en español.
 */
import { Box, Card, Stack, Text } from '@sanity/ui';
import type { ObjectInputProps } from 'sanity';

type Seo = { titulo?: { en?: string; es?: string }; descripcion?: { en?: string; es?: string } };
const cortar = (t: string, n: number) => (t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t);

function Resultado({ idioma, titulo = '', descripcion = '' }: { idioma: string; titulo?: string; descripcion?: string }) {
  if (!titulo && !descripcion) return null;
  return (
    <Card padding={3} radius={2} tone="transparent" border>
      <Stack space={2}>
        <Text size={0} muted>{idioma} · título {titulo.length}/60 · descripción {descripcion.length}/160</Text>
        <Text size={2} style={{ color: '#1a0dab' }}>{cortar(titulo, 60) || '(sin título)'}</Text>
        <Text size={1} muted>{cortar(descripcion, 160) || '(sin descripción: Google tomará un trozo del texto)'}</Text>
      </Stack>
    </Card>
  );
}

export function VistaSerp(props: ObjectInputProps) {
  const v = (props.value ?? {}) as Seo;
  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Box>
        <Stack space={2}>
          <Text size={1} weight="semibold">Así puede verse en Google</Text>
          <Resultado idioma="EN" titulo={v.titulo?.en} descripcion={v.descripcion?.en} />
          <Resultado idioma="ES" titulo={v.titulo?.es} descripcion={v.descripcion?.es} />
        </Stack>
      </Box>
    </Stack>
  );
}
