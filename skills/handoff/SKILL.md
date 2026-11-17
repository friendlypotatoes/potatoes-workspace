---
name: handoff
description: Write the session state to ~/.agent/STATE.md before the session ends, so the next session (in pi or Claude) can continue without asking again. Use when the user says "handoff", "save state", or when long work is ending and a later session must pick it up.
---

# Handoff

Rewrite `~/.agent/STATE.md`. Max 30 lines. Replace the old content: the file is current state, not history.

Sections:

1. `## Where we are` — per project: branch, open PRs, last merge.
2. `## Last 3 decisions` — one line each: date, decision, source.
3. `## Open work (top 3)` — the next action per project. In molca-id/ohara the source is `docs/core/TODOS.md`, "Next", the top item.
4. `## Do not do / already tried` — things tried and rejected, known-broken things.

Rules: short plain lines. No secrets, tokens, passwords or credentials in this file. Never write it to /tmp.
