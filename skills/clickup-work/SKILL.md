---
name: clickup-work
description: Work through the user's ClickUp cards (bugs, requests, tasks, stories) for a project, from plan to fix to QA hand-off. By default it takes every card assigned to the user in "to do" (all card types, never "backlog"), plans the fix for each, and re-checks every card in "in qa" to confirm it is really solved. Use when the user says "check the clickup", "do the cards", "check the bugs", "what's on clickup", names card ids like PROJECT-30401, or asks whether the cards in QA are done.
---

# clickup-work

Turn the user's ClickUp cards into verified fixes. Plan first, wait for "go", then fix, then report each card with
evidence.

## Step 1. Find the cards

If the user names card ids, use only those. Otherwise use the defaults:

| Filter | Default |
|---|---|
| Project | The folder the user names. If none, ask once, then use the "Known projects" row |
| Card types | All lists in the folder (Bug, Request, Task, Story). Not only bugs |
| Status | `to do` → work on it. `in qa` → verify it (Step 3). Never touch `backlog`. Mention `progress` cards in one line, do not work on them |
| Assignee | The user (`me`). Other people's cards only if the user asks for "all" |

Use `clickup_filter_tasks` with `folder_ids`, `statuses: ["to do", "in qa"]`, `assignees: ["me"]`. Page until
`has_more` is false. For each card, `clickup_get_task` with `include: ["description", "attachments", "subtasks"]` and
read `clickup_get_task_comments`. The newest comment can change what the card asks: follow the latest instruction.

Download every attachment that defines the result (an Excel template, a screenshot, a design) and read it fully
before planning. A template is the spec: match its layout, sheet names and wording exactly.

## Step 2. Plan (to do cards)

Show one table and stop:

| Card | Type | What it asks (plain words) | Cause (if a bug) | Fix | Repos | Size |
|---|---|---|---|---|---|---|

- Find the cause in the code and the data before you write the plan. Cite `file:line`. Say "not found yet" if so.
- A request card split into FE / BE / Integration cards is one piece of work: plan it once, list all its card ids.
- If a card is unclear, write the exact question in the table. Do not guess the behaviour.

Wait for "go". The user may pick a subset.

## Step 3. Verify (in qa cards)

For each card in "in qa", decide if it is really solved. Do not trust the status.

1. Find the change: `git log --all --oneline -i --grep=<card id>` in each repo of the project, then read the diff.
2. Check the change is on the deploy branch (`git branch -r --contains <sha>`).
3. Check the behaviour against the card's "Expected Result", with real data where you can: call the API, query the
   database, export the file and count. For UI cards, take a screenshot in a headless browser if one is installed.
4. Give one verdict per card:

| Verdict | Meaning |
|---|---|
| Solved | Evidence shows the expected result. Name the evidence |
| Not solved | Evidence shows a gap. Say what still differs. It goes back into Step 2's plan |
| Not deployed | Fixed in code, but not on the deploy branch or the server yet |
| Can't verify | Say exactly what is missing (access, data, a browser) |

Never move a card. Report the verdicts with the plan.

## Step 4. Fix

After "go": fix in each repo, on the project's working branch. Run that repo's lint/build/tests for what you
changed. Put the card id in each commit message. Commit and push only when the user's current message asks for it.

## Step 5. Report and hand off

```
| Card | Verdict / result | Evidence | Commit |
```

Then offer, and do only after the user says yes:
- Move fixed cards to `in qa`.
- Post a comment on each card: cause, fix, how to check. Write it in the card's language (Indonesian cards get an
  Indonesian comment). Plain words, no code jargon.

## Known projects

| Project | ClickUp folder | Repos (`~/molca/sic/…`) | Branch |
|---|---|---|---|
| Inafood SIC | `Inafood - Sic` (id 90160515366): lists Bug, Request, Story | `api`, `backoffice` (web), `hmi`, `tv`, `cron`, `manufacture-mirrored` | `develop-server` |

Statuses in Inafood SIC: backlog → to do → progress → in qa → ready to deploy → Closed.
