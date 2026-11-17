# Evening loop

The end-of-day loop (docs/FINDINGS.md, workflow 5). The OKF template is
`knowledge/templates/evening-loop.md`; the `overnight-queue` skill runs it mechanically.

1. **Write `STATE.md`** — where we are, last 3 decisions, open work, do not do. 30 lines max. If it
   does not fit in 30 lines, it belongs in the docs, not the state file. The `handoff` skill writes it.
2. **Tick only with proof.** A line moves to done only with its done-gate result line
   (`knowledge/templates/done-gate.md`). Prose claims are not evidence.
3. **Queue 1–3 contractor tasks for overnight agents.** Each task is written for a contractor who
   cannot ask questions: one paragraph, its own context, a one-line finish line, a proof command,
   files in scope, and a branch. Mechanical, well-specified work only — doc syncs, test re-runs,
   pull request follow-ups. Each card gets its own done gate. Work goes on integration branches,
   as draft pull requests.
4. **Stop.** Async generates; the human verifies. Nothing merges without reading the diff — that is
   the first morning task (`docs/workflows/morning-loop.md`).
