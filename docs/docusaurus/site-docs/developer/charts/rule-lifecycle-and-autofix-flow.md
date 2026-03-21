---
title: Rule Lifecycle and Autofix Flow
description: End-to-end flow for AST matching, typed checks, diagnostics, and safe autofix/suggestions.
sidebar_position: 2
---

# Rule lifecycle and autofix flow

This sequence diagram models what happens from lint invocation through optional typed lookup, reporting, and fix/suggestion output.

```mermaid
sequenceDiagram
    autonumber
    box Lavender Lint engine
    participant ESLint as ESLint Engine
    end
    box LightYellow Rule implementation
    participant Rule as Rule Module
    participant Create as createRule
    end
    box LightCyan Type system bridge
    participant Helper as getTypeOfNode
    participant Parser as parserServices
    participant TS as TypeChecker
    end
    box LightGreen Reporting and rewriting
    participant Report as context.report
    participant Fix as Fix/Suggestion Builder
    end

    ESLint->>Rule: load rule + meta
    Rule->>Create: create(context)

    loop For matched AST nodes
        Rule->>Rule: cheap syntax guards
        opt semantic lookup needed
            Rule->>Helper: getTypeOfNode(node, context)
            Helper->>Parser: getParserServices(context, true)
            Parser-->>Helper: parserServices + program or throw
            Helper->>TS: program.getTypeChecker()
            TS-->>Helper: type information
            Helper-->>Rule: type or null
        end
        Rule->>Fix: compute safe rewrite options
        alt autofix is safe
            Fix-->>Report: autofix function
            Report-->>ESLint: report(messageId, fix)
        else only suggest is safe
            Fix-->>Report: suggestion function
            Report-->>ESLint: report(messageId, suggest)
        else no rewrite safe
            Report-->>ESLint: report(messageId)
        end
    end

    ESLint-->>ESLint: aggregate diagnostics
    ESLint-->>ESLint: apply --fix if enabled
```

## Safety checkpoints

- Syntax-first guards prevent expensive checker access when unnecessary.
- Type operations are wrapped in `getTypeOfNode(...)`, which returns `null` instead of crashing when services are missing.
- Autofix only applies when parse-safe and semantic-safe constraints are met.

## Maintainer reading guide

- Focus on the `loop` body to reason about performance.
- Treat checker calls as optional/guarded operations, not defaults.
- Prefer local, mechanical rewrites over broad structural edits.
