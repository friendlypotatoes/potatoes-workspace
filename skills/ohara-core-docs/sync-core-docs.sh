#!/usr/bin/env bash
# sync-core-docs.sh — copy Core-relevant docs from ohara to ohara-core.
# Usage: sync-core-docs.sh [source-dir] [target-dir]
# Defaults: source=~/molca/ohara  target=~/molca/ohara-core

set -euo pipefail

SRC="${1:-$HOME/molca/ohara}"
DST="${2:-$HOME/molca/ohara-core}"

if [ ! -d "$SRC/docs/platform" ]; then
  echo "error: ohara repo not found at $SRC (docs/platform missing)" >&2
  exit 1
fi

echo "Syncing Core docs: $SRC → $DST"

# --- Core specs ---
mkdir -p "$DST/docs/platform"
cp "$SRC/docs/platform/00_OHARA_PRD.md" \
   "$SRC/docs/platform/02_Product_Hierarchy.md" \
   "$SRC/docs/platform/03_Actors_and_Tenancy.md" \
   "$SRC/docs/platform/04_OHARA_Core_Design.md" \
   "$SRC/docs/platform/05_OHARA_Architecture.md" \
   "$SRC/docs/platform/07_OHARA_Design_System.md" \
   "$DST/docs/platform/"

# --- Commercial ---
mkdir -p "$DST/docs/commercial"
cp "$SRC/docs/commercial/01_Annex_A_Service_Data_Clause.md" \
   "$DST/docs/commercial/"

# --- Decision register ---
mkdir -p "$DST/docs/workspace/knowledge/decisions"
cp "$SRC/docs/workspace/01_Workspace_PRD.md" \
   "$DST/docs/workspace/"

# --- Catalog source (compiled into core.module) ---
mkdir -p "$DST/docs/workspace/knowledge/catalog"
cp "$SRC"/docs/workspace/knowledge/catalog/*.md \
   "$DST/docs/workspace/knowledge/catalog/"

# --- Canon (plain-English guide) ---
mkdir -p "$DST/docs/canon"
cp "$SRC"/docs/canon/*.md \
   "$DST/docs/canon/"

# --- Build state ---
cp "$SRC/docs/BUILD_STATE.md" \
   "$DST/docs/"

# --- Core scaffold README + schema ---
mkdir -p "$DST/internal/core/schema"
cp "$SRC/internal/core/README.md" \
   "$DST/internal/core/"
cp "$SRC/internal/core/schema/core-schema.sql" \
   "$DST/internal/core/schema/" 2>/dev/null || true

echo "Done. Files synced:"
find "$DST/docs" "$DST/internal/core" -type f | wc -l
echo "files in $DST"
