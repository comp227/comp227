#!/usr/bin/env bash
set -euo pipefail

DRY_RUN="${DRY_RUN:-true}"
REFS="/tmp/image_refs_resolved.txt"

cd "$(git rev-parse --show-toplevel)"

if [[ ! -f "$REFS" ]]; then
  echo "❌ Refs file not found: $REFS"
  echo "   Run: bash src/build_refs.sh"
  exit 1
fi

echo "🧹 Checking STAGED (A) image files only"
echo "---------------------------------------"

checked=0
removed=0

git diff --cached --name-status |
grep '^A[[:space:]]' |
cut -f2 |
while IFS= read -r path; do
  [[ "$path" == src/content/images/* ]] || continue

  checked=$((checked + 1))

  if grep -qxF "$path" "$REFS"; then
    echo "[KEEP]   $path"
  else
    echo "[REMOVE] $path"
    removed=$((removed + 1))
    if [[ "$DRY_RUN" == "false" ]]; then
      git rm --cached -- "$path"
      rm -f -- "$path"
    fi
  fi
done

echo
echo "📊 Summary (staged additions only)"
echo "Checked : $checked"
echo "Removed : $removed"

if [[ "$DRY_RUN" != "false" ]]; then
  echo
  echo "⚠️  DRY RUN MODE — nothing changed"
  echo "    To apply: DRY_RUN=false bash src/remove_unused_new_images.sh"
fi
