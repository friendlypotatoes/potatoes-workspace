# Release workflow comes first

Date: 2026-11-17. Status: accepted.

## Context

The repo's automation had to start somewhere. The Findings Workflows Best Practice conversation
(docs/FINDINGS.md) puts the completion gate — "this is not done until this named command passes" —
at the center of every workflow, and names unverified "done" as one of the two failure modes that
hurt most.

## Decision

`.github/workflows/release.yml` is the first workflow. Everything versioned leaves the repo through
it — an app, a package, or the repo's own version. Its `verify` job runs the done gate
(`node scripts/okf.mjs --check`, `bash scripts/check-skills.sh`) before the `release` job publishes.
App-deploy and package-publish jobs extend the same gate (`needs: verify`), they do not replace it.

## Consequence

A release is evidence, not a claim: the workflow run is the proof line. A change that breaks a
template or a skill cannot be released.
