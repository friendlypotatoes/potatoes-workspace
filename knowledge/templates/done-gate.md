---
type: Attested Computation
title: When is a task done?
description: "The done-gate rule from the Findings Workflows Best Practice conversation: a task is done only when a named command that fails on broken work has passed, with its result line recorded. Prose claims are not evidence (docs/FINDINGS.md, workflow 2)."
tags: [template, okf, done-gate, workflow]
status: draft
parameters:
  - { name: task, type: string, required: false, resolve: none, description: "The task being closed, as the asker named it." }
question_patterns:
  - "when is {task} done"
  - "is this done"
  - "what is the done gate"
  - "how do i verify this"
reads: [done-gate]
classes_touched: []
answer:
  shape: table
  headline: { value: count, unit: lines, label: "Done gate for {task}" }
  sub: "The first line must fail when the feature is broken. An auditor re-runs the commands; an agent never verifies its own work."
  columns:
    - { key: line, label: Line, kind: text }
    - { key: content, label: Content, kind: text }
followups:
  - { template: release, params: {}, text: "How do I cut a release after this?" }
verified: [{ by: "human:potatoes", at: 2026-11-12 }]
stale_after: 2027-02-12
generated: { at: 2026-11-17 }
---

# Done gate

Every task and every pull request carries the same three lines. The first line names one command
that must fail when the work is broken. The second line names the no-regression commands. The third
line says what was not run and why. The maker/checker rule: the auditor re-runs the commands;
verification is independent of the model that wrote the code.

# Computation

```sh
# line 1 — the proof, must fail when the feature is broken
node scripts/okf.mjs --check

# line 2 — no regression
bash scripts/check-skills.sh

# line 3 — written in the PR body, not a command
# not run: <what and why>
```
