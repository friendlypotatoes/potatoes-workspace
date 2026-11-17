#!/usr/bin/env bash
# Structural check for the skill library: every skills/<name>/ must have a SKILL.md
# with a name and a description in its frontmatter, and the name must match the folder.
set -euo pipefail
cd "$(dirname "$0")/.."
fail=0
for d in skills/*/; do
  name=$(basename "$d")
  f="$d/SKILL.md"
  if [ ! -f "$f" ]; then echo "FAIL $name: no SKILL.md"; fail=1; continue; fi
  head -5 "$f" | grep -q '^name: ' || { echo "FAIL $name: SKILL.md has no name in frontmatter"; fail=1; }
  head -8 "$f" | grep -q '^description: ' || { echo "FAIL $name: SKILL.md has no description in frontmatter"; fail=1; }
  declared=$(head -5 "$f" | sed -n 's/^name:[[:space:]]*"\{0,1\}\([^"]*\)"\{0,1\}[[:space:]]*$/\1/p' | head -1)
  [ "$declared" = "$name" ] || { echo "FAIL $name: name does not match the folder (declared: $declared)"; fail=1; }
done
[ "$fail" = 0 ] && echo "OK: $(ls -d skills/*/ | wc -l) skill(s) pass."
exit $fail
