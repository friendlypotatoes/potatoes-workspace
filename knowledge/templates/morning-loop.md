---
type: Attested Computation
title: How do I start the day?
description: "The 20-minute morning loop from the Findings Workflows Best Practice conversation: load the delta, not the corpus; triage the humans first; pick 2-3 bets; set the guardrails in one line (docs/FINDINGS.md, workflow 4)."
tags: [template, okf, morning-loop, workflow]
status: draft
parameters: []
context: [as_of]
question_patterns:
  - "how do i start the day"
  - "what is the morning loop"
  - "what should i work on first"
  - "what is left behind"
reads: [morning-loop]
classes_touched: []
answer:
  shape: table
  headline: { value: count, unit: steps, label: "Morning loop" }
  sub: "Load state, not history. A rejected plan is the cheapest failure: the agent proposes the day in 5 lines, the human trims."
  columns:
    - { key: step, label: Step, kind: text }
    - { key: minutes, label: Minutes, kind: int }
followups:
  - { template: evening-loop, params: {}, text: "How do I end the day?" }
verified: [{ by: "human:potatoes", at: 2026-11-12 }]
stale_after: 2027-02-12
generated: { at: 2026-11-17 }
---

# Morning loop

Four steps: the agent loads the state file and answers the three probes (branch, last 3 decisions,
top open task); the human triages what other humans left (review answers first, then cards, then
anything red); the human and the agent pick the day's 2-3 bets; the human states the guardrails in
one line. The delta since yesterday replaces re-reading documents. If overnight agents queued work,
this step is a review of their done-gate evidence, not a start.

# Computation

```sh
# the delta, not the corpus
git log --oneline --since=yesterday
gh pr list
gh pr checks

# the state probe: branch, last 3 decisions, top open task
cat STATE.md
```
