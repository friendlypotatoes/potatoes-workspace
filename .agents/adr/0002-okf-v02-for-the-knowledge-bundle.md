# OKF v0.2 for the knowledge bundle

Date: 2026-11-17. Status: accepted.

## Context

The workflows needed one machine-readable form: attested, human-verified, and stale-dated, so an
agent cannot treat an old claim as live. The OKF (Operational Knowledge Format) v0.2 template
format already does this in the workspace knowledge compiler.

## Decision

`knowledge/templates/*.md` are OKF v0.2 templates: frontmatter plus a `# Computation` block,
with a human `verified` entry and a `stale_after` date. `scripts/okf.mjs` is a standalone port of
the compile semantics: a template without a human `verified` entry, or past `stale_after`, compiles
with `resolvable = false`; `:name` in a computation must be a declared parameter, context or
constant; the generated file records `concept_sha256` and is written one way.

Two deviations from the original compiler, both noted in `scripts/okf.mjs`:

1. It generates `knowledge/generated/answer-templates.json` instead of loading a database.
2. Its `# Computation` section scan is fence-aware, so shell `#` comments in a code block are not
   read as a new section (the original was written for SQL only).

## Consequence

The templates compile in CI with no database. A computation must keep stray colons out of its code
block (a command like `npm run x:y` reads as the bind `:y`). An agent never verifies: the
`human:` entry is the only thing that makes a template resolvable.
