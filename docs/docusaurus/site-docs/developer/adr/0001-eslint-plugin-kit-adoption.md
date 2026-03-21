---
title: ADR 0001 - @eslint/plugin-kit Adoption
description: Decision record for whether eslint-plugin-immutable-2 should adopt @eslint/plugin-kit for rule/runtime internals.
sidebar_position: 1
---

# ADR 0001: Do not adopt `@eslint/plugin-kit` for rule/runtime internals

- Status: Accepted
- Date: 2026-02-22

## Context

The repository currently uses small, focused local utilities to build and
maintain rule behavior:

- `src/util/rule.ts` for shared rule creation, canonical docs URLs, and typed
  node lookup.
- `src/util/typeguard.ts` and `src/util/tree.ts` for reusable AST and traversal
  helpers.
- `src/configs/*.ts` plus `src/plugin.ts` for preset assembly and runtime
  export wiring.

`@eslint/plugin-kit` (per package README) provides utilities focused on:

- `ConfigCommentParser`
- `Directive`
- `VisitNodeStep` / `CallMethodStep`
- `TextSourceCodeBase`

These are primarily for implementing custom language/source-code plumbing
(directive parsing, traversal, `SourceCode`-like behavior), not for the current
rule/preset architecture in this repository.

## Decision

Do **not** adopt `@eslint/plugin-kit` in this plugin at this time.

## Rationale

1. **No direct capability overlap** with this repository's highest-value local
   utilities (`createRule(...)`, docs URL normalization, and narrow AST helper
   modules).
2. **Would not reduce maintenance burden** in currently hand-rolled areas.
3. **Would add dependency and migration surface** without meaningful DX/perf/correctness gains.

## Consequences

- Keep existing local abstractions in `src/util/*`, `src/configs/*`, and
  `src/plugin.ts`.
- Continue targeted hardening/tests around rule logic and preset layering.

## Revisit Triggers

Re-evaluate adoption if we add custom language support requiring:

- custom `SourceCode#traverse()` step modeling,
- custom disable directive parsing/representation,
- or other infrastructure directly using `Directive` and traversal step abstractions.
