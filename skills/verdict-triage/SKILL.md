---
name: verdict-triage
description: Turn the verdict of an evaluation (an architecture-evaluation-atam or concept-stress-test report, a review, an audit, a risk table) into OHARA's own records. It sorts every item of the verdict into findings, answered questions, new open decisions, new possibilities (proposals), work items, tests to run, already-tracked items, conflicts with settled rules and uncovered scopes, names where each one belongs in the docs (docs/core/ today, or another part's folder), and suggests the next actions and the next evaluations. It reports first and changes files only after the user says go. Use this whenever an evaluation, stress test, ATAM, pre-mortem, review or audit has just ended with a verdict or a risk table, or when the user says "use this verdict", "file the findings", "what do we do with this report", "turn this into decisions", "record the evaluation", "what is new in this verdict", or asks what to do or evaluate next after a verdict — even if they do not name this skill.
---

# verdict-triage: from a verdict to the records

An evaluation ends with a long report. Most of it is already known, some of it is new, and a few lines change a
decision. This skill sorts the report line by line, so that each new fact, answer, question and idea lands in the
document that owns that kind of item, and nothing is recorded twice or with more certainty than it had.

The verdict is input, not truth. A line in it is a claim. It becomes a finding only with its proof, and it becomes
an answer only when the person who gave it may give it.

## Step 1. Get the verdict and the part

- The verdict is the latest evaluation report in this conversation, unless the user names a file. Take the whole
  report and the user's answers during the evaluation: in an interactive evaluation, the answers carry most of the
  new information.
- The part: read `.claude/skills/docs-prd-code-sync/parts.json` and take the part that the verdict is about. If the
  verdict names none, use `core`. The entry gives the docs folder, the answers files, the open questions file, the
  TODOS file and the checks.

## Step 2. Read what the repository already holds

Before you sort a line, look for it. A verdict often repeats what a TODOS item, an open question or an issue already
says (an evaluation of 10 Nov 2026 found "the backup copy off the node" as new, but the TODOS and issue 848 held it).

Read, for the part:
- the answers files and the owner decisions (for `core`: `docs/core/00-03` to `00-10`, `00-06`);
- the open questions file (`docs/core/00-07_Open_Questions.md`), with the highest number used;
- the proposals (`docs/core/06-*`) and the dated findings (`docs/FINDING_*.md`);
- the TODOS file of the part (`internal/core/TODOS.md`);
- the open issues of the user: `gh issue list --author @me --state open`.

## Step 3. Sort every line

Put each item of the verdict into exactly one group. The groups and their homes:

| Group | Rule | Home (for `core`) |
|---|---|---|
| Finding | A fact the evaluation checked, with its proof: a file and line, a command and its output, or a test result. Dated, because it is a snapshot | A new `docs/FINDING_<date>_<topic>.md` |
| Answered | The user's answer settles a question that the docs hold open, or a new question the user asked and answered | The next answer number in a new or the latest answers file; mark the old question answered and link it |
| New open decision | A question that someone must decide and nobody has. It needs one owner (a role, never a name) | The next row of the open questions file |
| New possibility | An option that someone may choose (for example "a short start license"). It decides nothing | A section of the matching proposal, or a new `06-NN` proposal; status Proposed, with who decides |
| Work item | A change with a clear scope that no person blocks | A TODOS item with a "Done when" line and its "Waits for" |
| Test to run | A decisive test from the risk table, with its kill or pivot criterion | A TODOS item, or a checklist in the finding, with the criterion word for word |
| Already tracked | The repository already holds it | No new record. Cite where it is. Add the evaluation's new detail to that record only if the detail is new |
| Conflict | The verdict or an answer contradicts a settled or ratified rule | A disagreement in the finding, and a new open decision for the rule's owner. Never edit the ratified text |
| Uncovered scope | A lens the evaluation did not apply, or an unknown it recorded | The "next evaluations" list of the report, and the finding's "not covered" section |
| Speculation | Reasoning with no check behind it | Stays in the finding, marked "not verified". Never a finding of its own |

Rules for the sort:
- **Authority.** An answer counts as Settled only when its owner, or someone the docs name, gave it. The user's
  answer in an evaluation is a Direction of the user's role. If it changes a rule that another person ratified (for
  example a rule the CTO ratified), record it as the user's direction with "needs <role>", and add a new open
  decision. Never write that an approval happened.
- **Strength.** Keep every hedge at its strength. "Believed (the user)" stays believed; "not verified" stays not
  verified. A rating (High, Medium) keeps its reason.
- **One home.** An item goes to one group. If it fits two, take the one with more authority behind it: answered over
  open, finding over speculation, already tracked over new.
- **Owners.** Name the owner by role (the CTO, the COO, Product, the Savior team, Commercial). If the docs name no
  owner, propose one and mark it Proposed, as `00-07` does.

## Step 4. Suggest the next actions and the next evaluations

From the sorted items, build two short lists.

**Next actions**, in order:
1. *Do now*: work items and tests that no person blocks. The verdict's conditions ("before the first customer") come
   first.
2. *Waits for a person*: each open decision, its owner and where the owner can read it (an issue, a PR, a doc). If it
   is not written anywhere the owner reads, offer to write it there.
3. *Waits for a merge*: an item that builds on an open pull request; name it.

**Next evaluations**: for each uncovered scope and each High risk with an unknown, one line: what to evaluate, why it
could change the verdict, and how (for example "an interactive `architecture-evaluation-atam` on key custody", a
tabletop with Delivery, `prd-audit` on the changed requirements, a data pull from Commercial). Put first the one whose
answer would change the verdict the most.

## Step 5. Report and stop

Write the report in chat, in plain words. Name each item by what it does, not by an id. Use this form:

**From the verdict of <date>, <subject>**: <n> items. <n> new, <n> already tracked.

Then one short table per group that has items: the item in one line, its proof or source, and its home (the file).
Groups with no item are left out. Then the two lists of Step 4.

End with: "Say go to write these records, or tell me what to change." Then stop. Change no file before the user says
go: the sort itself is a judgement the user must see.

## Step 6. After go: write the records

1. Save the verdict and the user's answers word for word as a record (`docs/core/records/<date>_<author>_<title>.md`
   for `core`), so the records cite a fixed source and not a chat.
2. Write the finding file, the answers, the open question rows, the proposal sections and the TODOS items, each
   citing the record. Follow the format of the file you add to: its table columns, its status words, its numbering.
   A new docs file needs its row in the part's `MANIFEST.md`.
3. Add one entry to the part's log (`docs/core/log.md`).
4. Run the part's checks from `parts.json` (`prd_check` and the `doc_checks` that apply). Report what you ran and the
   result.
5. Do not commit, push or open a pull request unless the user asks for that in the current message. Do not edit the
   workspace `CHANGELOG.md` or regenerate the readers. Say that `prd-sync` should run next when the part's docs
   changed.

## Writing

- Files: STE-flavored English (`.claude/skills/asd-ste100/`). Chat: plain words, short, no requirement ids, register
  numbers or section codes.
- Never write a person's name in a doc, an issue or a comment. Use the role.
- A planned date stays planned. A test that was described is not a test that passed.
