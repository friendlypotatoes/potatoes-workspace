# .agents/ — shared agent material

What usually lives in `.agents/`: the material that is **not tied to one harness** — unlike
`CLAUDE.md` (Claude Code) or `.pi/` (pi), this folder is read the same way by any agent. Two
conventions meet here:

1. **Shared guidance and decision records** (the mattpocock/skills layout): single-source
   convention docs that skills and docs point at instead of repeating, and `adr/` — an
   append-only decision log. A decision gets one file, is never rewritten, and is superseded by
   a later file (docs/FINDINGS.md calls this an enforced rail: append-only decision logs).
2. **Installer-managed skills** (the `skills` CLI / skills.sh convention): tools like
   `npx skills add` copy skills into `.agents/skills/` with a `.skill-lock.json` lock file, so
   any harness can use them. This repo keeps the skills I authored in `skills/` at the root; if
   an installer adds `.agents/skills/`, its lock file belongs next to it.

## Layout

```
.agents/
  README.md      this file
  adr/           decision records, one file per decision, append-only
```

## Decision records

Numbered `NNNN-<slug>.md`. Write the decision, its date, and the reason in a few lines. Do not
edit an old record; add a new one that supersedes it.

| Record | Decision |
|---|---|
| [0001](adr/0001-release-workflow-comes-first.md) | The Release workflow comes first; the done gate runs before any publish. |
| [0002](adr/0002-okf-v02-for-the-knowledge-bundle.md) | OKF v0.2 is the knowledge format, compiled one way by `scripts/okf.mjs`. |
| [0003](adr/0003-only-self-created-skills-are-published.md) | Only skills I created are published here; plugin and third-party skills are not republished. |
