---
title: Minimal preset
---

# 🟢 Minimal

Use when you want the smallest baseline footprint.

## Config key

```ts
immutable.configs.minimal
```

## Flat Config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [immutable.configs.minimal];
```

## Rules in this preset

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only

| Rule | Fix |
| --- | :-: |
| [`prefer-immutable-is-defined-filter`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-is-defined-filter) | 🔧 |
| [`prefer-immutable-is-present-filter`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-is-present-filter) | 🔧 |
| [`prefer-immutable-arrayable`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-arrayable) | 🔧 |
| [`prefer-immutable-except`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-except) | 🔧 |
| [`prefer-immutable-json-array`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-json-array) | 🔧 |
| [`prefer-immutable-json-object`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-json-object) | 🔧 |
| [`prefer-immutable-json-primitive`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-json-primitive) | 🔧 |
| [`prefer-immutable-json-value`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-json-value) | 💡 |
| [`prefer-immutable-primitive`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-primitive) | 🔧 |
| [`prefer-immutable-promisable`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-promisable) | 🔧 |
| [`prefer-immutable-unknown-record`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-unknown-record) | 🔧 |
