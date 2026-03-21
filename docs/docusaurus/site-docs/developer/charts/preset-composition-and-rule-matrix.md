---
title: Preset Composition and Rule Matrix
description: How the recommended → immutable → functional-lite → functional → all ladder is assembled and synchronized into docs.
sidebar_position: 8
---

# Preset composition and rule matrix

This diagram explains how rule source, preset layering, and sync scripts combine into user-facing preset guidance and rule enablement matrices.

```mermaid
flowchart LR
    classDef source fill:#1e293b,stroke:#93c5fd,color:#f8fafc,stroke-width:1px
    classDef meta fill:#312e81,stroke:#a5b4fc,color:#eef2ff,stroke-width:1px
    classDef preset fill:#14532d,stroke:#86efac,color:#f0fdf4,stroke-width:1px
    classDef docs fill:#7c2d12,stroke:#fdba74,color:#fff7ed,stroke-width:1px

    A[src/rules/*.ts\nmeta.docs]
    B[src/configs/rule-sets.ts]
    C[src/configs/*.ts + config-registry.ts]
    D[src/plugin.ts\nimmutable.configs]

    E[immutable.configs.recommended]
    F[immutable.configs.immutable]
    G[immutable.configs["functional-lite"]]
    H[immutable.configs.functional]
    I[immutable.configs.all]

    J[scripts/sync-presets-rules-matrix.mjs]
    K[scripts/sync-readme-rules-table.mjs]
    L[docs/rules/presets/*.md]
    M[README.md rules table]
    N[Docusaurus preset pages]

    A --> D
    B --> C --> D
    D --> E
    D --> F
    D --> G
    D --> H
    D --> I

    D --> J
    D --> K
    J --> L --> N
    K --> M

    class A,B,C,D source
    class E,F,G,H,I preset
    class J,K,L,M,N docs
```

## Practical use

- Use this chart when adding or reclassifying a rule across presets.
- Verify `meta.docs.recommended` aligns with actual `recommended` preset membership.
- Re-run the sync scripts whenever preset composition changes.

## Common failure modes

1. Rule added to `src/configs/rule-sets.ts` but omitted from synced docs tables.
2. `meta.docs.recommended` says `true` while the rule is absent from the real `recommended` preset.
3. Narrative docs still describe an old preset ladder after the canonical rule sets change.
