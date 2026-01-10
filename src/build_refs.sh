#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

refs="/tmp/image_refs_resolved.txt"
rm -f "$refs"

find src/content -type f \( -iname '*.md' -o -iname '*.mdx' \) -print0 |
while IFS= read -r -d '' md; do
  ( grep -oE '!\[[^]]*\]\([^)]+\)' "$md" 2>/dev/null || true ) |
    tr -d '\r' |
    while IFS= read -r tok; do
      echo "TOK=<$tok>" >&2
      # Extract LINK from ![...](LINK)
      link="${tok#*](}"
      link="${link%)}"

      # Strip ?query or #hash
      link="${link%%\#*}"
      link="${link%%\?*}"

      [[ -z "$link" ]] && continue
      [[ "$link" =~ ^https?:// ]] && continue
      [[ "$link" =~ ^mailto: ]] && continue

      # Convert ../../images/... -> src/content/images/...
      link="${link#./}"
      while [[ "$link" == ../* ]]; do
        link="${link#../}"
      done

      if [[ "$link" == images/* ]]; then
        echo "src/content/$link"
      fi
    done
done | sort -u > "$refs"

echo "Wrote resolved refs to: $refs"
wc -l "$refs"
