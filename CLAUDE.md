# Rules for agents in this repo

These come from [docs/FINDINGS.md](docs/FINDINGS.md). They are human-curated; do not rewrite them on
your own.

1. **State probe before the first edit.** Read `STATE.md` if it exists and answer three questions
   out loud: what branch am I on, what were the last 3 decisions, what is the top open task. If
   there is no `STATE.md`, say so and proceed.
2. **Done gate.** A task is done only when a named command that fails on broken work has passed,
   with its result line recorded. Report commands actually run separately from existing coverage.
   An agent never verifies its own work — name the commands so a human or auditor can re-run them.
   The done-gate template is `knowledge/templates/done-gate.md`.
3. **Stop rule.** After 40 tool calls without an edit, stop and report what you know and what blocks
   you.
4. **Fan-out contract.** When 2 or more agents work in this repo, declare disjoint file sets, merge
   order and the auditor up front; waves of 3–5; after each wave the auditor re-runs the done-gate
   commands (docs/FINDINGS.md, workflow 3).
5. **Scope permissions.** Reads, tests, builds and commits on integration branches are fine without
   asking. Ask first for: push to `main`, releases, anything touching servers or money, secrets,
   deletions, and anything public.
6. **No personal identity in public artifacts.** Never write a name, email or personal identifier
   into an issue, release, commit message or doc that ships to GitHub.
7. **Keep the hedges.** Do not add a cause, a frequency or a certainty that the source did not
   state. docs/FINDINGS.md's claims are directional where it says so.
8. **Stay in scope.** Change only what the task needs. List other problems you see; do not fix them.
