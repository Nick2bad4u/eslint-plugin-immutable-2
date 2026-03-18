---
title: immutable types preset
---

# 💠 immutable

Use when you want only the immutable-focused subset.

## Config key

```ts
immutable.configs["immutable/types"]
```

## Flat Config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [immutable.configs["immutable/types"]];
```

## Rules in this preset

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only

| Rule | Fix |
| --- | :-: |
| [`prefer-immutable-abstract-constructor`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-abstract-constructor) | 🔧 |
| [`prefer-immutable-arrayable`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-arrayable) | 🔧 |
| [`prefer-immutable-async-return-type`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-async-return-type) | 🔧 |
| [`prefer-immutable-conditional-pick`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-conditional-pick) | 🔧 |
| [`prefer-immutable-constructor`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-constructor) | 🔧 |
| [`prefer-immutable-except`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-except) | 🔧 |
| [`prefer-immutable-if`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-if) | 🔧 |
| [`prefer-immutable-iterable-element`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-iterable-element) | 🔧 |
| [`prefer-immutable-json-array`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-json-array) | 🔧 |
| [`prefer-immutable-json-object`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-json-object) | 🔧 |
| [`prefer-immutable-json-primitive`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-json-primitive) | 🔧 |
| [`prefer-immutable-json-value`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-json-value) | 💡 |
| [`prefer-immutable-keys-of-union`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-keys-of-union) | 🔧 |
| [`prefer-immutable-literal-union`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-literal-union) | 🔧 |
| [`prefer-immutable-merge-exclusive`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-merge-exclusive) | 🔧 |
| [`prefer-immutable-non-empty-tuple`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-non-empty-tuple) | 🔧 |
| [`prefer-immutable-omit-index-signature`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-omit-index-signature) | 🔧 |
| [`prefer-immutable-partial-deep`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-partial-deep) | 🔧 |
| [`prefer-immutable-primitive`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-primitive) | 🔧 |
| [`prefer-immutable-promisable`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-promisable) | 🔧 |
| [`prefer-immutable-readonly-deep`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-readonly-deep) | 🔧 |
| [`prefer-immutable-require-all-or-none`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-require-all-or-none) | 🔧 |
| [`prefer-immutable-require-at-least-one`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-require-at-least-one) | 🔧 |
| [`prefer-immutable-require-exactly-one`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-require-exactly-one) | 🔧 |
| [`prefer-immutable-require-one-or-none`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-require-one-or-none) | 🔧 |
| [`prefer-immutable-required-deep`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-required-deep) | 🔧 |
| [`prefer-immutable-schema`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-schema) | 🔧 |
| [`prefer-immutable-set-non-nullable`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-set-non-nullable) | 🔧 |
| [`prefer-immutable-set-optional`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-set-optional) | 🔧 |
| [`prefer-immutable-set-readonly`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-set-readonly) | 🔧 |
| [`prefer-immutable-set-required`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-set-required) | 🔧 |
| [`prefer-immutable-simplify`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-simplify) | 🔧 |
| [`prefer-immutable-tagged-brands`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-tagged-brands) | 🔧 |
| [`prefer-immutable-tuple-of`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-tuple-of) | 🔧 |
| [`prefer-immutable-unknown-array`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-unknown-array) | 🔧 |
| [`prefer-immutable-unknown-map`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-unknown-map) | 🔧 |
| [`prefer-immutable-unknown-record`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-unknown-record) | 🔧 |
| [`prefer-immutable-unknown-set`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-unknown-set) | 🔧 |
| [`prefer-immutable-unwrap-tagged`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-unwrap-tagged) | 🔧 |
| [`prefer-immutable-value-of`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-value-of) | 🔧 |
| [`prefer-immutable-writable`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-writable) | 🔧 |
| [`prefer-immutable-writable-deep`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/prefer-immutable-writable-deep) | 🔧 |
