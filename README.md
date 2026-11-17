# potatoes-workspace

My agent workspace: the skills I use, the workflow they follow, and the knowledge bundle that keeps
them honest. The solid ground is [docs/FINDINGS.md](docs/FINDINGS.md) — the methods, theories and
facts from the "Findings Workflows Best Practice" conversation (12 Nov 2026). Everything here traces
back to it.

## What is here

| Path | What it is |
|---|---|
| `skills/` | The skills I created ([index](skills/README.md)). Copy a folder into your agent's skills dir to use one. |
| `docs/FINDINGS.md` | The solid ground: how the work happens, the verdict, 2026 practice as researched, the adopted workflows. |
| `docs/workflows/` | The daily loops: [release](docs/workflows/release.md), [morning](docs/workflows/morning-loop.md), [evening](docs/workflows/evening-loop.md). |
| `knowledge/` | OKF v0.2 bundle: the workflows as attested templates, compiled by `scripts/okf.mjs`. |
| `scripts/` | `okf.mjs` (the OKF template compiler) and `check-skills.sh` (the skill library check). |
| `.agents/` | Shared agent material: the append-only decision log (`adr/`) and the conventions any harness reads. |
| `CLAUDE.md` | The rules for agents ([AGENTS.md](AGENTS.md) symlinks it — one source). |
| `.github/` | Issue templates (bug, config, idea) and the Release workflow — the workflows start with the release. |

## The OKF templates

`knowledge/templates/*.md` are [OKF v0.2](knowledge/README.md) templates: frontmatter plus a
`# Computation` block, human-verified with a `stale_after` date. The compiler generates
`knowledge/generated/answer-templates.json`, one way:

```sh
npm ci
node scripts/okf.mjs          # generate
node scripts/okf.mjs --check  # fail if the generated file is stale
```

A template without a human `verified` entry, or past its `stale_after` date, compiles with
`resolvable = false`. An agent never verifies.

## Checks

```sh
npm run check   # OKF templates + skill library
```

These are the done gate (docs/FINDINGS.md, workflow 2). They run in the Release workflow before
anything publishes.

## Releasing

The Release workflow comes first: everything versioned goes out through it — an app, a package, or
the repo's own version. See [docs/workflows/release.md](docs/workflows/release.md).

```sh
git tag v<version> && git push origin v<version>
```

## Issues

Issues follow the templates: **bug** (a skill did the wrong thing in a real session), **idea** (a
change to an existing skill, grounded in a failure you saw), and **config** (what goes where instead
of an issue). One problem per issue, repro first.
