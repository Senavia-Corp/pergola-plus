#!/usr/bin/env bash
# Lighthouse 13.5 x3 corridas x 2 dispositivos x 16 plantillas, sobre scripts/perf/servir.mjs.
#
#     scripts/perf/lighthouse.sh <carpeta-salida> [corridas=3] [plantillas=todas] [dispositivos="mobile desktop"]
#
# Cada corrida deja su JSON en <carpeta>/<plantilla>-<dispositivo>-<n>.json; el
# resumen lo saca scripts/perf/resumen.mjs. Chrome sin extensiones y headless: los
# Lighthouse del 19-oct con 7,4 MB de chrome-extension:// no valen como medida.
set -u
SALIDA="${1:?carpeta de salida}"; CORRIDAS="${2:-3}"; SOLO="${3:-}"; DISPOSITIVOS="${4:-mobile desktop}"
BASE="${BASE:-http://localhost:4173}"
mkdir -p "$SALIDA"
cd "$(dirname "$0")/../.."

node -e "import('./scripts/perf/plantillas.mjs').then(m=>console.log(m.PLANTILLAS.map(p=>p.join(' ')).join('\n')))" |
while read -r nombre ruta; do
  if [ -n "$SOLO" ] && ! echo " $SOLO " | grep -q " $nombre "; then continue; fi
  for dev in $DISPOSITIVOS; do
    for n in $(seq 1 "$CORRIDAS"); do
      out="$SALIDA/$nombre-$dev-$n.json"
      [ -s "$out" ] && continue
      extra=""; [ "$dev" = desktop ] && extra="--preset=desktop"
      npx --no-install lighthouse "$BASE$ruta" --output=json --output-path="$out" --quiet \
        --chrome-flags="--headless=new --disable-extensions --no-first-run" \
        --only-categories=performance,accessibility,best-practices,seo $extra >/dev/null 2>&1 \
        || echo "  !! fallo $nombre $dev $n"
      node -e "const j=require(require('path').resolve('$out'));const c=j.categories;const a=j.audits;console.log('  $nombre $dev $n  P'+Math.round(c.performance.score*100)+' A'+Math.round(c.accessibility.score*100)+' BP'+Math.round(c['best-practices'].score*100)+' SEO'+Math.round(c.seo.score*100)+'  LCP '+Math.round(a['largest-contentful-paint'].numericValue)+'ms CLS '+a['cumulative-layout-shift'].numericValue.toFixed(3)+' TBT '+Math.round(a['total-blocking-time'].numericValue))" 2>/dev/null
    done
  done
done
echo "[lighthouse] hecho -> $SALIDA"
