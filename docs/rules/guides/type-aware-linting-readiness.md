---
title: Type-aware linting readiness
description: Checklist and rollout playbook for enabling type-aware eslint-plugin-immutable-2 rules safely.
---

# Type-aware linting readiness

Use this guide when you want the full checker-backed behavior of the plugin's
typed branches.

## When this guide applies

Use this checklist when adopting:

- `immutable.configs.recommended` with `projectService` enabled for
  `immutable-data`
- `immutable.configs.immutable` or any stricter preset when you want the
  implicit-array inference branch of `readonly-array`
- a custom flat-config block that enables `immutable-data` or `readonly-array`
  and relies on parser services

## Readiness checklist

### 1) Parser-service availability

Confirm the lint runtime can provide full type services:

- ESLint uses `@typescript-eslint/parser`
- your lint config resolves the intended `tsconfig`(s)
- the targeted files are included in those `tsconfig`(s)

### 2) Know which rules gain precision

Today the most relevant checker-backed paths are:

- `immutable-data` when it distinguishes mutable array/object operations from
  freshly-created values
- `readonly-array` when it infers implicit mutable array types from initializers

Without parser services, these rules fall back conservatively instead of
crashing, but they may report less precisely.

### 3) Project graph stability

Before enabling stricter checks:

- `npm run typecheck` is green
- baseline linting is green (or has a controlled known backlog)
- generated types/artifacts are not stale

### 4) Performance baseline

Capture a baseline to detect regressions:

```bash
npx eslint "src/**/*.{ts,tsx}" --stats
```

Track:

- total runtime
- expensive files
- hot rules that call type-checker operations frequently

### 5) CI gate ordering

Prefer this order:

1. typecheck
2. lint (typed parser services enabled where needed)
3. tests

This keeps typed-service failures easy to classify.

## Recommended rollout sequence

1. Start with one package/folder.
2. Enable type-aware rules as `warn` first.
3. Fix baseline findings in small batches.
4. Promote to `error` once the scope stays green.
5. Expand scope incrementally.

## Fast validation commands

```bash
npm run typecheck
npm run lint
npm run test
```

For focused typed checks during migration:

```bash
npx eslint "src/**/*.{ts,tsx}" --stats
```

## Common failure modes

### Typed behavior is missing or less precise than expected

Likely causes:

- file not included in the active `tsconfig`
- parser-service wiring mismatch for the current workspace
- incorrect project root assumptions in local/CI lint execution
- `projectService` not enabled in the config block that spreads the preset

Typical symptoms:

- `immutable-data` falling back to its conservative `assumeTypes` behavior
- `readonly-array` still reporting explicit `T[]` syntax but skipping implicit
  array inference for unannotated declarations

### Large runtime regressions

Likely causes:

- expensive semantic checks on broad selectors
- repeated checker calls without syntax prefilters
- too-large rollout scope for first pass

## Related docs

- [Rollout and fix safety](./rollout-and-fix-safety.md)
- [Rule adoption checklist](./adoption-checklist.md)
- [Preset selection strategy](./preset-selection-strategy.md)
- [Typed service path inventory](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/developer/typed-paths)
