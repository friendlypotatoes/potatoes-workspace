---
name: day-start
description: Start the work day. Load the session state, list what changed since yesterday (git, pull requests, CI, ClickUp), surface the CTO's open questions and red checks, then propose the day's 2-3 tasks and set the guardrail. Use when the user says "day start", "start the day", "morning", "what is today", or asks what to work on first.
---

# day-start

Run this ritual only. Do not start the tasks it names; the work sessions do that.

## 1. Load state

Read `~/.agent/STATE.md`. Answer three questions in one short block: current branch, last 3 decisions, top open task. Ask the user to correct anything wrong in one line.

## 2. What changed since yesterday

Run for each active repository (at least molca-id/ohara):

```sh
git log --oneline --since=yesterday
gh pr list
gh pr checks <open prs>
```

Read the delta only. Do not re-read whole documents. Documents are read when a task needs them.

## 3. Humans and fires

In this order:

1. New review comments on the open pull requests. The CTO (molca01) answers the yes/no questions of the PR "Notes". List his open questions first: an overnight answer unblocks work.
2. ClickUp cards in "to do" (the clickup-work skill, or the ClickUp tool). Offer to work them, do not start them here.
3. Red CI or failing checks that touch the user's work.

## 4. The day plan

Propose 2-3 tasks: the top of `docs/core/TODOS.md` "Next" (in molca-id/ohara), plus any "waiting for a person" item whose answer arrived in step 3. One line per task: goal, the check that proves it, blocker if any. Ask the user to approve or trim.

## 5. Guardrail and state

Ask for the day's guardrail line (or reuse the last one in the state file), for example: work freely on `integration/core`, ask for servers and `main`. When the plan is approved, write the top tasks into `~/.agent/STATE.md` "Open work", then hand the first task to a work session.
