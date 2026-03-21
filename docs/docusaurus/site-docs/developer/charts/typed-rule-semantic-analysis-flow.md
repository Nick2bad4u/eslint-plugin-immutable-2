---
title: Typed Rule Semantic Analysis Flow
description: Detailed flow for parser-services acquisition, guarded type operations, and conservative fallback behavior in typed branches.
sidebar_position: 6
---

# Typed rule semantic analysis flow

This chart focuses on the semantic path used by the plugin's current typed branches, especially `immutable-data` and `readonly-array`.

```mermaid
flowchart TD
    classDef entry fill:#1e293b,stroke:#93c5fd,color:#f8fafc,stroke-width:1px
    classDef guard fill:#0f766e,stroke:#5eead4,color:#ecfeff,stroke-width:1px
    classDef fail fill:#7f1d1d,stroke:#fca5a5,color:#fef2f2,stroke-width:1px
    classDef path fill:#312e81,stroke:#a5b4fc,color:#eef2ff,stroke-width:1px

    A[Rule visitor enters node] --> B{Need semantic type?}
    B -->|No| C[Run syntax-only checks]
    B -->|Yes| D[getTypeOfNode(node, context)]

    D --> E{parserServices.program available?}
    E -->|No| F[Return null]
    E -->|Yes| G[Resolve checker + ts.Node]

    G --> H[checker.getTypeAtLocation(...)]
    H --> I[Return semantic type]

    F --> J{Rule-specific fallback available?}
    J -->|Yes| K[Use assumeTypes or skip implicit inference]
    J -->|No| L[Continue traversal without semantic branch]

    I --> M[Run rule-specific semantic predicates]
    C --> N[Report syntax-only findings]
    K --> O[Report conservative finding or continue]
    M --> P{Fix or suggest safe?}
    P -->|Fix safe| Q[context.report with fix]
    P -->|Only suggest safe| R[context.report with suggestion]
    P -->|Unsafe rewrite| S[context.report message only]

    class A,B,D,E,J,P entry
    class C,G,H,I,K,M,N,O,Q,R,S path
    class F,L guard
```

## Maintainer interpretation

- Treat semantic calls as a guarded path, not a default path.
- `getTypeOfNode(...)` is the main reliability bridge between ideal type information and resilient fallback behavior.
- Missing services currently lead to conservative degradation rather than a hard failure.

## Operational checkpoints

1. If users report missing typed precision, verify parser service availability first.
2. If semantic branches become expensive, add syntax-level short-circuits before type operations.
3. Keep fix/suggestion decisions conservative and local to the rule.
