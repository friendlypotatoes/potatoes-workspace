# skills/ — the skill library

Skills I created and use every day. Each folder is one skill: `SKILL.md` plus whatever references,
scripts or templates it needs. Copy a folder into your agent's skills directory to use it
(`~/.claude/skills/` for Claude Code, `~/.pi/agent/skills/` for pi).

## Daily loop (docs/FINDINGS.md, workflows 4–5)

| Skill | What it does |
|---|---|
| [day-start](day-start/SKILL.md) | The morning loop: state probe, triage the humans, pick 2–3 bets, set the guardrails. |
| [overnight-queue](overnight-queue/SKILL.md) | The evening loop: 1–3 contractor cards for overnight agents, each with a done gate. |
| [handoff](handoff/SKILL.md) | Writes `STATE.md` so the next session continues without asking. |

## Work

| Skill | What it does |
|---|---|
| [clickup-work](clickup-work/SKILL.md) | Card batches for morning triage: bugs, requests, tasks to done, QA re-checks. |
| [verdict-triage](verdict-triage/SKILL.md) | Turn an evaluation's verdict into findings, decisions, tests and next actions. |
| [ohara-core-docs](ohara-core-docs/SKILL.md) | Sync Core-relevant design docs to the ohara-core workspace. |

Only skills I created live here. Skills from shared plugins or other authors are not republished in
this repo.

`bash scripts/check-skills.sh` checks the library's structure: every skill has a `SKILL.md` with a
name and description, and the name matches the folder.
