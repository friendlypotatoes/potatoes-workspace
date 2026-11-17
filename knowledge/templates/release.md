---
type: Attested Computation
title: How do I cut a release?
description: "The release loop for anything versioned — an app, a package, or a repo version — checks first, then tags, then lets the Release workflow publish. Grounded in the done-gate rule: no release without the proof commands passing (docs/FINDINGS.md, workflow 2)."
tags: [template, okf, release, workflow]
status: draft
parameters:
  - { name: version, type: string, required: true, resolve: none, description: "The version to release, as the asker wrote it (e.g. 1.2.0)." }
  - { name: target, type: string, required: false, resolve: none, description: "What is released: an app, a package, or the version itself. Copy the asker's words." }
context: [as_of]
question_patterns:
  - "how do i cut a release"
  - "release {version}"
  - "deploy {target}"
  - "publish {target} {version}"
  - "how do i release"
reads: [release]
classes_touched: []
answer:
  shape: table
  headline: { value: count, unit: steps, label: "Release {version}" }
  sub: "Checks first, then the tag. The Release workflow does the publishing; the release is done when its run is green."
  columns:
    - { key: step, label: Step, kind: text }
    - { key: proof, label: Proof, kind: mono }
followups:
  - { template: done-gate, params: {}, text: "What counts as done for the checks?" }
  - { template: morning-loop, params: {}, text: "How do I start the day after the release?" }
verified: [{ by: "human:potatoes", at: 2026-11-12 }]
stale_after: 2027-02-12
generated: { at: 2026-11-17 }
---

# Release

A release is a versioned, published artifact: an app, a package, or the repo's own version.
The checks run before the tag. The Release workflow (`.github/workflows/release.yml`) runs the same
checks again and publishes only when they pass.

The full process lives in `docs/workflows/release.md`.

# Computation

```sh
# 1. the done gate, local
npm ci
npm run check

# 2. the version tag
git tag v:version
git push origin v:version

# 3. the Release workflow publishes; verify its run is green
gh run list --workflow=release.yml --limit 1
```
