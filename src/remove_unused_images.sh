#!/usr/bin/env bash
set -euo pipefail

DRY_RUN="${DRY_RUN:-true}"
REFS="/tmp/image_refs_resolved.txt"
IMAGES_DIR="src/content/images"

cd "$(git rev-parse --show-toplevel)"

if [[ ! -f "$REFS" ]]; then
  echo "❌ Refs file not found: $REFS"
  echo "   Run: bash src/build_refs.sh"
  exit 1
fi

total=$(find "$IMAGES_DIR" -type f | wc -l)
i=0
removed=0

echo "🖼️  Scanning images under $IMAGES_DIR"
echo "------------------------------------"

find "$IMAGES_DIR" -type f -print0 |
while IFS= read -r -d '' img; do
  i=$((i+1))
  rel="${img#./}"

  printf "[%4d/%4d] " "$i" "$total"

  if grep -qxF "$rel" "$REFS"; then
    echo "[KEEP]   $rel"
  else
    echo "[REMOVE] $rel"
    if [[ "$DRY_RUN" == "false" ]]; then
      git rm -- "$rel"
    fi
    removed=$((removed+1))
  fi
done

echo
echo "📊 Summary"
echo "Images scanned : $total"
echo "Images removed : $removed"

if [[ "$DRY_RUN" != "false" ]]; then
  echo
  echo "⚠️  DRY RUN MODE — nothing was deleted"
  echo "    To apply: DRY_RUN=false ./src/remove_unused_images.sh"
fi
