# Morning loop

The 20-minute start of day (docs/FINDINGS.md, workflow 4). The OKF template is
`knowledge/templates/morning-loop.md`; the `day-start` skill runs it mechanically.

1. **Load state, not history (3 min, agent).** The agent reads `STATE.md` and answers the three
   probes: branch, last 3 decisions, top open task. The human corrects in one line if wrong. The
   only "what's left behind" check: `git log --oneline --since=yesterday`, `gh pr list`,
   `gh pr checks`. The delta, not the corpus.
2. **Triage the humans (5 min, human).** Review answers first (an overnight answer unblocks work),
   then cards, then anything red (failed CI, staging notes).
3. **Pick the day's 2–3 bets (5 min).** A rejected plan is the cheapest failure: the agent proposes
   the day in 5 lines, the human trims. The top 3 go into `STATE.md → Open work`.
4. **Set the guardrails (2 min).** One line at the top: what is free today, what needs asking, which
   model for which work. Glance at `STATE.md → Do not do` so settled mistakes are not relived.

Then work in loops: one task per session where possible, `handoff` at natural breaks. If overnight
agents queued work, step 1 is a review of their done-gate evidence — the morning is a review, not a
start.

What not to do: do not re-read documents to "get back in"; do not approve a pull request before
checking its done gate; do not start new work before triage.
