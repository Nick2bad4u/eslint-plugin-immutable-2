---
title: Typed Services Guard and Fallback Paths
description: Visual map of typed-rule guard entry points, fallback branches, and safe-degradation outcomes.
sidebar_position: 15
---

# Typed services guard and fallback paths

This diagram summarizes how checker-backed paths are entered, guarded, and degraded safely when full services are unavailable.

```mermaid
flowchart TB
    classDef entry fill:#1e293b,stroke:#93c5fd,color:#f8fafc,stroke-width:1px
    classDef typed fill:#312e81,stroke:#a5b4fc,color:#eef2ff,stroke-width:1px
    classDef safe fill:#14532d,stroke:#86efac,color:#f0fdf4,stroke-width:1px
    classDef fail fill:#7f1d1d,stroke:#fca5a5,color:#fef2f2,stroke-width:1px

    A[Rule entry] --> B{Need checker-backed decision?}
    B -->|No| C[Run syntax-first branch]
    B -->|Yes| D[getTypeOfNode(node, context)]

    D --> E{parser services + program available?}
    E -->|No| F[Return null]
    E -->|Yes| G[Resolve checker + TS node]

    G --> H[checker.getTypeAtLocation(...)]
    H --> I[Return ts.Type]

    F --> J{Rule has conservative fallback?}
    J -->|Yes| K[Use syntax/assumeTypes fallback]
    J -->|No| L[Skip semantic-only branch safely]

    I --> M[Run rule-specific typed predicates]
    C --> N[Report syntax findings only]
    K --> O[Report conservative finding or continue]
    L --> P[Continue traversal without crash]
    M --> Q[Report message/fix/suggestion]

    class A,B,D,E,J entry
    class G,H,I,M typed
    class C,K,L,N,O,P,Q safe
    class F fail
```

## Notes

- The current helper returns `null` instead of throwing when services are missing.
- `immutable-data` and `readonly-array` are the main rules that benefit from this path today.
- This model should remain aligned with `developer/typed-paths` inventory updates.

## Related docs

- [Typed service path inventory](../typed-paths.md)
- [Typed rule semantic analysis flow](./typed-rule-semantic-analysis-flow.md)
- [Type-aware linting readiness guide](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/guides/type-aware-linting-readiness)
