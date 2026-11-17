# Only self-created skills are published

Date: 2026-11-17. Status: accepted.

## Context

The repo is public. The skill library mixes skills I wrote with skills from shared plugins
(colleague-authored) and from vendors (Anthropic examples, third-party npm packages). Republishing
someone else's skill under my repo is not mine to do, and some shared skills carry internal work
detail.

## Decision

`skills/` holds only skills I created — provenance checked before publishing: a locally created
skill (a real directory in my agent's skills folder) is mine; a skill whose sync manifest says
`source: plugin` or `source: anthropic*` is not republished here. Vendored skills stay where their
authors publish them; the README names where they come from instead of copying them.

## Consequence

The library is small and every folder is mine to change. A skill I did not create enters this repo
only with its author's say-so and its license kept intact.
