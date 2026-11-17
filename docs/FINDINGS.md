# Findings: workflows best practice

**Source:** the "Findings Workflows Best Practice" conversation, 12 November 2026. That conversation
read ~225 agent sessions from October–November 2026 and researched 2025–2026 practice on the web.
This file is the solid ground for everything in this repo: the skills, the workflow docs, the OKF
templates and the Release workflow. Keep every hedge and its strength: the conversation's own caveat
is that its frequency claims are directional (the corpus was sampled by extraction, not read line by
line), and the research facts below are as that conversation recorded them.

## Facts: how the work actually happens

1. The human is the coordinator, not the typist. Median prompt: 35 characters. Goals, point-by-point
   answers to question lists, and a one-line approval ritual. The agent plans; the human steers.
2. Sessions chain through hand-off state files and written "memory rules". Multi-day threads,
   compactions, and re-launches with "read this and continue".
3. Multi-agent fleets run in parallel: terminal tabs with per-role models (cheap workers, a strong
   auditor), one-shot workers each with a plan file, and subagent audits after the work.
4. Corrections become rules and skills. Human-curated rule files, approval matrices, and skills
   written from the failure that motivated them.
5. Discipline is strong where it counts: stacked pull requests, docs-first, boundary scripts, human
   merge of agent pull requests, browser verification.
6. Top pains: agent amnesia (re-explaining decisions), permission churn (approving obvious steps),
   long output that loses the thread, out-of-scope edits, and unverified "done".

## The verdict

Structurally this setup is ahead of most published 2026 practice: hand-off files, human-curated
rules, maker/checker auditing, enforced guardrails, corrections turned into skills. The three gaps
that hurt most:

- **Amnesia is a design flaw, not an agent flaw.** State living in `/tmp` or in one head dies on
  reboot and nothing forces a fresh session to prove it read it. The research line: *a shared rule
  counts only when a fresh-session probe shows the agent loaded it.*
- **Verification is mostly manual.** "Tests pass" as prose is not evidence. The completion gate —
  "this is not done until this named command passes" — must be mechanical.
- **Fan-out hygiene is luck** unless file sets, merge order and the auditor are declared up front.

## Theories and facts from 2026 practice (as recorded in the conversation)

- **The big reversal (Anthropic, Oct 2026):** a single agent with skills beats router/planner/
  subagent architectures on quality and cost. Keep subagents for research, isolation and review.
- **Plan-then-execute with approval** (Jules-style): a rejected plan is the cheapest failure. Tests
  are the gate *outside* the session. No agent merges its own work.
- **Fan-out scaling:** worktree-per-agent with disjoint file sets, 3–5 agents per merge wave, one
  read-only reviewer per 3–4 builders (Osmani). Cohere's scaling study: agent teams cost 3–7×;
  where you delegate matters more than how many.
- **Memory split convention:** rules in the config file (human-curated, stable), state in a work file
  (rewritten every session): `STATE.md` + `AGENTS.md`/`CLAUDE.md`.
- **ETH research on rules:** human-written rules help; LLM-written rules hurt. Keep rule files
  human-curated.
- **Enforced rails beat prose:** hooks and CI for what must hold (import boundaries, guarded files,
  migration order), append-only decision logs, pull request templates with evidence blocks.
- **The Ralph loop** (Geoffrey Huntley, July 2025): the same prompt to a fresh headless agent in a
  loop; *progress accumulates in files and git history, not in the agent's context window*. One small
  step per iteration, one task per loop, a task file says what "done" is. "Deterministically bad in
  an undeterministic world" — each run is dumb, but the loop converges.
- **Async overnight teams:** queue 1–3 mechanical, well-specified contractor tasks at end of day;
  the morning is a review of their done-gate evidence, not a start. The firm rule: **nothing merges
  without the human reading the diff — async generates, human verifies.**
- **Named anti-patterns:** too many specialized agents, unbounded parallelism on shared files,
  prompt-only rules, and self-verification by the agent that wrote the work.

## The adopted workflows

| # | Workflow | One line | Detail |
|---|---|---|---|
| 1 | Repo-owned state + forced read | `STATE.md` (30 lines max) read before the first edit; the agent answers three probes: branch, last 3 decisions, top open task | `docs/workflows/` + `handoff` skill |
| 2 | Done gate | A task is done only when a named command that fails on broken work has passed, with its result line recorded; an auditor re-runs it | `knowledge/templates/done-gate.md` |
| 3 | Fan-out contract | Every batch plan opens with disjoint file sets, merge order, and the auditor; waves of 3–5 | this file, below |
| 4 | Morning loop | Load the delta, triage the humans first, pick 2–3 bets, set the guardrails in one line | `docs/workflows/morning-loop.md`, `day-start` skill |
| 5 | Evening loop | Rewrite `STATE.md`, tick only with proof, queue 1–3 overnight contractor tasks, stop | `docs/workflows/evening-loop.md`, `overnight-queue` skill |
| 6 | Scope-based permissions | Pre-approve by scope (integration branches, scratch dirs), not by step; always ask for main, servers, money, secrets, deletions and public artifacts | rule files |

### The fan-out contract (workflow 3)

Every batch plan file starts with three lines:

```
## Contract
Files: worker 1 → docs/a*, worker 2 → docs/b* ... (NO overlap)
Merge order: 1 → 3 → 2 (the worker touching the shared file goes last)
Auditor: <who> re-runs each done-gate after the wave.
```

Two agents editing one file corrupt it silently. If two workers must touch one file, they go in
separate waves, serialized.

## Deferred deliberately

- Ralph loop automation — only after the overnight queue has run cleanly for a while; automating an
  unproven ritual multiplies its failures.
- More skills — the value is in the daily loop, not in more tooling.

## What to stop doing

- Re-sending messages and pasting huge terminal dumps — point at the file instead.
- 200-message threads when a compact + handoff would do; decisions get lost in the compactions.
- Letting agents write rule files unsupervised — keep those human-curated.
