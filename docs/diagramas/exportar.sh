#!/usr/bin/env bash
# Exporta cada diagrama .mmd de esta carpeta a svg/ (para LaTeX o la web) y png/ (alta resolución, para Word o
# Google Docs). Usa el Chrome instalado (puppeteer.json), sin descargar otro navegador.
#   bash docs/diagramas/exportar.sh            todos
#   bash docs/diagramas/exportar.sh er         solo uno
set -euo pipefail
cd "$(dirname "$0")"
export PUPPETEER_SKIP_DOWNLOAD=1
CLI="npx -y @mermaid-js/mermaid-cli@11.4.2 -p puppeteer.json -b white -q"
mkdir -p svg png
for file in ${1:-*}.mmd; do
    name="${file%.mmd}"
    $CLI -i "$file" -o "svg/$name.svg"
    $CLI -i "$file" -o "png/$name.png" -s 3 -w 1600
    echo "listo: $name"
done
