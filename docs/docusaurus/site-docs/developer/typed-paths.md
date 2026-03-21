---
title: Typed service path inventory
description: Inventory of typed parser-service and checker callpaths relevant to eslint-plugin-immutable-2.
---

# Typed service path inventory

This page inventories typed callpaths that can reach parser services or the TypeScript checker.

> Source document: [`docs/internal/typed-paths.md`](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/blob/main/docs/internal/typed-paths.md)

## Guard model

The plugin follows a syntax-first design.

- Shared typed access flows through `getTypeOfNode(node, context)` in
  `src/util/rule.ts`.
- That helper calls `ESLintUtils.getParserServices(context, true)` and returns
  `null` when parser services or a `program` are unavailable.
- Rules consuming the helper treat `null` as a normal fallback path rather than
  crashing.

## Core typed helper

| Path                             | Typed dependency                                      | Current callers                    | Fallback behavior                                  | Max expected expensive calls/file                                                                |
| -------------------------------- | ----------------------------------------------------- | ---------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `src/util/rule.ts#getTypeOfNode` | `parserServices.program`, checker, ESTree→TS node map | `immutable-data`, `readonly-array` | Catches parser-service failures and returns `null` | Up to 4 lookups in one `immutable-data` mutator path; per implicit candidate in `readonly-array` |

## Rule callpath inventory

### `immutable-data`

- Uses type lookups to distinguish mutating array/object operations from
  freshly-created values.
- Consults checker-backed type information for chained array constructors and
  `Object.assign(...)` targets.
- Falls back to its conservative `assumeTypes` behavior when type services are
  unavailable.

### `readonly-array`

- Uses type lookups only for implicit mutable-array inference when a declaration
  or parameter lacks an explicit annotation.
- Still reports explicit `T[]`, `Array<T>`, and tuple syntax without any parser
  services.
- Skips the implicit inference branch when `getTypeOfNode(...)` returns `null`.

## Operational guidance

- Enable `projectService: true` when you want the highest semantic precision.
- Treat `null` from `getTypeOfNode(...)` as an expected soft-failure path.
- Keep typed lookups narrow and local to already-filtered AST nodes.
