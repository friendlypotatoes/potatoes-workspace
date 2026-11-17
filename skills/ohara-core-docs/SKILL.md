---
name: ohara-core-docs
description: "Sync Core-relevant design docs from the ohara repo to the ohara-core workspace. Use when starting or refreshing OHARA Core implementation work in the ohara-core workspace, or when a Core-relevant spec changes in the main repo."
---

# OHARA Core Docs Sync

Copy the design documents that OHARA Core implementation needs from the main `ohara` repo to the `ohara-core` workspace.

## When to use

- Starting a new Core implementation session in the ohara-core workspace
- After a Core-relevant spec changes (04, PRD, Annex A, decision register, catalog)
- Before running the catalog compiler or Core migrations

## How to run

```bash
bash ~/.pi/agent/skills/ohara-core-docs/sync-core-docs.sh [source-dir] [target-dir]
```

Defaults: source `~/molca/ohara`, target `~/molca/ohara-core`. Pass paths if they differ.

## What it copies

| Source | Why Core needs it |
|---|---|
| `docs/platform/00_OHARA_PRD.md` | Product requirements Core fulfills |
| `docs/platform/02_Product_Hierarchy.md` | Module hierarchy (Core sells modules) |
| `docs/platform/03_Actors_and_Tenancy.md` | Tenancy model (Core's entity schema) |
| `docs/platform/04_OHARA_Core_Design.md` | **The Core spec** — DDL, API, licensing, RBAC |
| `docs/platform/05_OHARA_Architecture.md` | System boundaries |
| `docs/platform/07_OHARA_Design_System.md` | Design language (D66) |
| `docs/commercial/01_Annex_A_Service_Data_Clause.md` | Annex A — evidence boundary |
| `docs/workspace/01_Workspace_PRD.md` | Decision register (D01–D191) |
| `docs/workspace/knowledge/catalog/*.md` | Catalog source (compiled into `core.module`) |
| `docs/canon/*.md` | Plain-English guide |
| `docs/BUILD_STATE.md` | Current implementation state |
| `internal/core/README.md` | Core scaffold layout |
| `internal/core/schema/core-schema.sql` | Complete 22-table DDL |

## What it does NOT copy

- Workspace-specific specs (Today, Ask, Delivery, Browse)
- Tenant-side packages (`packages/`, `analytics/`, `knowledge/`)
- Generated readers or diagrams
- Reference/history documents
