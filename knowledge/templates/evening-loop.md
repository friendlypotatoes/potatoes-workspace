---
type: Attested Computation
title: How do I end the day?
description: "The evening loop from the Findings Workflows Best Practice conversation: write the state file, tick only with proof, queue 1-3 mechanical tasks for overnight agents with a done-gate each, then stop (docs/FINDINGS.md, workflow 5)."
tags: [template, okf, evening-loop, workflow]
status: draft
parameters: []
context: [as_of]
question_patterns:
  - "how do i end the day"
  - "what is the evening loop"
  - "what do i queue for tonight"
  - "how do i hand off"
reads: [evening-loop]
classes_touched: []
answer:
  shape: table
  headline: { value: count, unit: tasks, label: "Overnight queue" }
  sub: "One paragraph per task, its own context, a one-line finish line, a done-gate. Nothing merges without a human reading the diff."
  columns:
    - { key: task, label: Task, kind: text }
    - { key: finish_line, label: Finish line, kind: text }
followups:
  - { template: morning-loop, params: {}, text: "How do I start the day after this?" }
  - { template: done-gate, params: {}, text: "What counts as done for each queued task?" }
verified: [{ by: "human:potatoes", at: 2026-11-12 }]
stale_after: 2027-02-12
generated: { at: 2026-11-17 }
---

# Evening loop

Four steps: write `STATE.md` (where we are, last 3 decisions, open work, do not do — 30 lines max);
tick off work only where a done-gate proves it; queue 1-3 mechanical, well-specified tasks for
overnight agents, each written like a contractor card (one paragraph, its own context, a one-line
finish line, a proof command, files in scope, a branch); then stop. Async generates; the human
verifies in the morning.

# Computation

```sh
# 1. the state file, rewritten every session
cat > STATE.md <<'EOF'
## Where we are
## Last 3 decisions
## Open work
## Do not do
EOF

# 2. queue 1-3 contractor cards, each with its own done-gate command,
#    then let the overnight agent work them on an integration branch

# 3. stop. the morning reviews the diffs.
```
