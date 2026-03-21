---
title: Autofix Safety Decision Tree
description: Decision tree for when eslint-plugin-immutable-2 should emit a fix, a suggestion, or a diagnostic-only report.
sidebar_position: 7
---

# Autofix safety decision tree

This chart explains how rule authors should decide whether a report gets a fix, a suggestion, or no rewrite at all.

```mermaid
flowchart TD
    classDef check fill:#1e293b,stroke:#93c5fd,color:#f8fafc,stroke-width:1px
    classDef safe fill:#14532d,stroke:#86efac,color:#f0fdf4,stroke-width:1px
    classDef caution fill:#78350f,stroke:#fcd34d,color:#fffbeb,stroke-width:1px
    classDef stop fill:#7f1d1d,stroke:#fca5a5,color:#fef2f2,stroke-width:1px

    A[Candidate diagnostic identified] --> B{Is there a deterministic rewrite?}
    B -->|No| X[Report message only]
    B -->|Yes| C{Is the rewrite local to the reported file and node range?}

    C -->|No| Y[Prefer suggestion or message only]
    C -->|Yes| D{Will the output remain parse-stable?}

    D -->|No| Y
    D -->|Yes| E{Can we preserve runtime semantics confidently?}

    E -->|No| Z[Emit suggestion only]
    E -->|Yes| F[Emit autofix via context.report]

    class A,B,C,D,E check
    class F safe
    class Y,Z caution
    class X stop
```

## Why this chart matters

- Most fixes in this plugin should stay local and mechanical.
- Cross-file edits or import insertion are intentionally out of scope for the
  current codebase.
- Suggestion fallback is a correctness tool, not a failure mode.

## Review checklist

- Verify the rewrite only changes the code the rule can reason about.
- Verify the output stays syntactically valid after formatting.
- Verify a suggestion is used whenever runtime intent cannot be proven.
