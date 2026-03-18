---
title: All preset
---

# 🟣 All

Use when you explicitly want every plugin rule, including experimental coverage.

## Config key

```ts
immutable.configs.all
```

## Flat Config example

```ts
import immutable from "eslint-plugin-immutable-2";

title: All preset
```

# 🟣 All

Use this preset when you want full immutable-plugin coverage.

## Config key

```ts
immutable.configs.all
```

## Flat Config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [immutable.configs.all];
```

## Included rules

- `immutable-data`
- `no-class`
- `no-conditional-statement`
- `no-expression-statement`
- `no-let`
- `no-loop-statement`
- `no-method-signature`
- `no-mixed-interface`
- `no-reject`
- `no-this`
- `no-throw`
- `no-try`
- `readonly-array`
- `readonly-keyword`
  \| [`prefer-immutable-object-entries`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-object-entries) | 🔧 |
