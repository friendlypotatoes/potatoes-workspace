---
name: overnight-queue
description: End the work day. Save the session state, then queue 1 to 3 small mechanical tasks as cards for background agents to work overnight, each with a proof command and a branch. Use when the user says "overnight", "night queue", "queue for tonight", "end the day", or wants work done while away.
---

# overnight-queue

## 1. Save state first

Rewrite `~/.agent/STATE.md` (max 30 lines: where we are, last 3 decisions, open work top 3, do not do). Never write state to /tmp. The `handoff` skill does this.

## 2. Choose the queue (1 to 3 tasks)

Take task names from the user, or propose mechanical items from the top of `docs/core/TODOS.md`. Each task must pass the sleeping test: the user can verify the result in under 2 minutes in the morning. Shrink or drop any task that fails it.

Never queue: design decisions, money or licensing logic, work blocked on a person, anything that touches `main`, servers or secrets, anything that deletes data.

## 3. Write one card per task

Each card carries:

- Context in one paragraph, written for a contractor who cannot ask questions.
- The finish line in one sentence.
- The proof command: it must fail when the work is wrong. Name the test file.
- The files in scope. No two cards may share a file.
- The branch: `integration/*`, or one branch per card off it.
- "Do not touch" lines.

Put the cards in one file under `~/.agent/night-queue/`, and list them in `~/.agent/STATE.md` "Open work" so the morning review knows what to expect.

## 4. Launch

Start one background agent per card (background agent tasks, herdr tabs, or headless runs). Settings for every night agent: the cheap model, a cap of 40 tool calls per task, and this guardrail line in its prompt: "Work only the card. Do not push to `main`, do not touch servers, do not merge. Stop and report when the proof command passes, or after 3 failed attempts."

## 5. Report

List what launched, what was dropped and why, and which proof commands the morning must check. The morning reviews diffs and evidence before anything merges. Nothing merges without the user reading the diff.
