/** `image-<sha1>-<ancho>x<alto>-<ext>` (el id de un asset de imagen de Sanity) -> partes. */
export const partesAsset = (ref) => {
  const m = ref.match(/^image-([0-9a-f]{40})-(\d+)x(\d+)-([a-z0-9]+)$/);
  if (!m) throw new Error(`[sanity] referencia de imagen desconocida: ${ref}`);
  return { sha1: m[1], ancho: Number(m[2]), alto: Number(m[3]), ext: m[4] };
};
