---
title: System Architecture Overview
description: High-level architecture of eslint-plugin-immutable-2 runtime, rules, docs, and integration layers.
sidebar_position: 1
---

# System architecture overview

This diagram shows how source modules, preset wiring, docs sync scripts, and consumer integrations fit together.

```mermaid
flowchart TB
    classDef source fill:#312e81,stroke:#a5b4fc,color:#eef2ff,stroke-width:1px
    classDef runtime fill:#0f766e,stroke:#5eead4,color:#ecfeff,stroke-width:1px
    classDef docs fill:#7c2d12,stroke:#fdba74,color:#fff7ed,stroke-width:1px
    classDef ext fill:#334155,stroke:#94a3b8,color:#f8fafc,stroke-width:1px

    subgraph S[Source Layer]
      R[src/rules/*.ts]
      U[src/util/*.ts]
      CM[src/common/*.ts]
      CFG[src/configs/*.ts]
      P[src/plugin.ts]
    end

    subgraph RT[Runtime Layer]
      ER[ESLint Rule Modules]
      PC[Flat Config Presets]
      META[Rule metadata in built plugin]
    end

    subgraph D[Documentation Layer]
      RD[docs/rules/*.md]
      DD[docs/docusaurus/site-docs/developer/*]
      SYNC[scripts/sync-*.mjs]
      SB[docs/docusaurus/sidebars*.ts]
      RM[README.md]
    end

    subgraph V[Validation Layer]
      TESTS[test/docs-*.ts + test/configs*.ts]
      TASKS[npm lint/test/typecheck/docs:build]
    end

    subgraph E[External Integrations]
      CONS[Consumer Projects]
      CI[CI + GitHub Actions]
      SITE[Docusaurus Site]
      IDE[IDE + ESLint Language Server]
      INSP[ESLint Config Inspector]
    end

    R --> ER
    U --> ER
    CM --> ER
    P --> PC
    CFG --> PC
    ER --> PC
    ER --> META

    RD --> SYNC
    META --> SYNC
    SYNC --> RD
    SYNC --> RM
    RD --> SB
    DD --> SB
    SB --> SITE
    RM --> SITE

    PC --> CONS
    ER --> IDE
    SITE --> CONS
    PC --> INSP
    RD --> TESTS
    RM --> TESTS
    PC --> TESTS
    TASKS --> TESTS
    CI --> SITE
    CI --> INSP
    CI --> CONS

    class R,U,CM,CFG,P source
    class ER,PC,META runtime
    class RD,DD,SYNC,SB,RM docs
    class TESTS,TASKS docs
    class CONS,CI,SITE,IDE,INSP ext
```

## Notes

- `src/util/rule.ts` is the shared rule-authoring entry point for docs URL
  normalization and optional typed lookup.
- `src/configs/rule-sets.ts` is the canonical preset-membership source.
- Sync scripts regenerate README and preset matrix sections from the built
  plugin rather than from hand-maintained duplicate tables.

## How to read this diagram

- **Source layer** is where maintainers edit behavior and contracts.
- **Runtime layer** is what ESLint and consumers execute directly.
- **Documentation layer** controls generated/static docs discoverability.
- **External integrations** represent CI, IDE, and published artifact entry points.
