---
title: immutable type-guards preset
---

# ✴️ type-guards

Use when you want only guard/assertion-focused immutable rules.

## Config key

```ts
immutable.configs["immutable/type-guards"]
```

## Flat Config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [immutable.configs["immutable/type-guards"]];
```

## Rules in this preset

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only

| Rule | Fix |
| --- | :-: |
| [`prefer-immutable-array-includes`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-array-includes) | 🔧 💡 |
| [`prefer-immutable-assert-defined`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-assert-defined) | 🔧 💡 |
| [`prefer-immutable-assert-error`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-assert-error) | 💡 |
| [`prefer-immutable-assert-present`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-assert-present) | 🔧 💡 |
| [`prefer-immutable-is-defined`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-is-defined) | 🔧 |
| [`prefer-immutable-is-defined-filter`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-is-defined-filter) | 🔧 |
| [`prefer-immutable-is-empty`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-is-empty) | 🔧 |
| [`prefer-immutable-is-finite`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-is-finite) | 🔧 |
| [`prefer-immutable-is-infinite`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-is-infinite) | 🔧 |
| [`prefer-immutable-is-integer`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-is-integer) | 🔧 |
| [`prefer-immutable-is-present`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-is-present) | 🔧 |
| [`prefer-immutable-is-present-filter`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-is-present-filter) | 🔧 |
| [`prefer-immutable-is-safe-integer`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-is-safe-integer) | 🔧 |
| [`prefer-immutable-key-in`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-key-in) | 🔧 |
| [`prefer-immutable-not`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-not) | 🔧 |
| [`prefer-immutable-object-has-in`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-object-has-in) | 🔧 💡 |
| [`prefer-immutable-object-has-own`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-object-has-own) | 🔧 💡 |
| [`prefer-immutable-safe-cast-to`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-safe-cast-to) | 🔧 |
| [`prefer-immutable-set-has`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-set-has) | 🔧 💡 |
