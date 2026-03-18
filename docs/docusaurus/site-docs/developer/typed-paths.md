---
title: Typed service path inventory
description: Inventory of typed parser-service and checker callpaths relevant to eslint-plugin-immutable-2.
---

# Typed service path inventory

This page inventories typed callpaths that can reach parser services or the TypeScript checker.

> Source document: [`docs/internal/typed-paths.md`](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/blob/main/docs/internal/typed-paths.md)

## Guard model

All type-aware rule execution enters through explicit gates:

- `createTypedRule(...)` short-circuits typed rules (`meta.docs.requiresTypeChecking: true`) when full type services are unavailable.
- Optional typed flows in non-type-checked rules call `hasTypeServices(context)` before calling `getTypedRuleServices(context)`.
- Type-dependent helpers no longer discover typed services internally.

## Core typed helpers

| Path                                                                                              | Typed dependency                   | Guard entry                                                                  | Fallback behavior                                              | Max expected expensive calls/file               |
| ------------------------------------------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| `src/_internal/typed-rule.ts#getTypedRuleServices`                                                | `parserServices.program`, checker  | `hasTypeServices(context)` or typed-rule create short-circuit                | Throws if called without `program`                             | 1 (rule create path)                            |
| `src/_internal/constrained-type-at-location.ts#getConstrainedTypeAtLocationWithFallback`          | `parserServices`, checker          | Caller must pass prevalidated checker/parser services                        | Attempts constrained API first, then checker/node-map fallback | O(number of callsites invoking type resolution) |
| `src/_internal/array-like-expression.ts#createIsArrayLikeExpressionChecker`                       | checker + parser-services node map | Caller must pass typed services object                                       | Returns `false` on safe operation failure                      | O(array-like candidate expressions)             |
| `src/_internal/typescript-eslint-node-autofix.ts#createTypeScriptEslintNodeExpressionSkipChecker` | optional typed services            | Caller passes `typedServices` explicitly (or omits for definition-only mode) | Definition-only path when no typed services are supplied       | O(guard candidate expressions)                  |
| `src/_internal/type-checker-compat.ts` helpers                                                    | checker compatibility methods      | Only called from typed helper/rule paths                                     | Returns `undefined` when host checker API is unavailable       | O(type graph traversal within caller)           |

## Rule callpath inventory

Current rule set is intentionally syntax-first and works for both JavaScript and
TypeScript by default.

- No currently shipped rule requires TypeScript checker services to execute.
- Typed helper infrastructure remains available in `src/_internal` for
  compatibility and future type-aware rules.
- Any future type-aware rule should continue to use explicit guard gates before
  calling typed services.

## Telemetry counters

Typed hot-path counters are recorded in `src/_internal/typed-path-telemetry.ts`:

- `prefilterChecks`
- `prefilterHits`
- `expensiveTypeCalls`
- `fallbackInvocations`

Snapshot API:

- `getTypedPathTelemetrySnapshot()`
- `resetTypedPathTelemetry()`

Derived rates included in snapshot totals:

- `prefilterHitRate = prefilterHits / prefilterChecks`
- `fallbackInvocationRate = fallbackInvocations / expensiveTypeCalls`
- `averageExpensiveCallsPerFile = expensiveTypeCalls / fileCount`
