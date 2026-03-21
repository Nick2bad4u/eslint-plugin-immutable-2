---
title: Functional Lite preset
---

# 🟢 Functional Lite

Use this preset when you want a moderate functional step up from `immutable`.

## Config key

```ts
immutable.configs["functional-lite"]
```

## Flat Config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [immutable.configs["functional-lite"]];
```

This preset layers a small set of structural functional rules onto the immutable baseline while still allowing returning branches in conditional expressions.

## Rules in this preset

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only

| Rule                                                                                                                               | Fix |
| ---------------------------------------------------------------------------------------------------------------------------------- | :-: |
| [`immutable-data`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/immutable-data)                               |  —  |
| [`no-abort-controller-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-abort-controller-mutation)   |  —  |
| [`no-atomics-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-atomics-mutation)                     |  —  |
| [`no-buffer-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-buffer-mutation)                       |  —  |
| [`no-cache-api-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-cache-api-mutation)                 |  —  |
| [`no-conditional-statement`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-conditional-statement)           |  —  |
| [`no-cookie-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-cookie-mutation)                       |  —  |
| [`no-data-view-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-data-view-mutation)                 |  —  |
| [`no-date-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-date-mutation)                           |  —  |
| [`no-dom-token-list-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-dom-token-list-mutation)       |  —  |
| [`no-form-data-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-form-data-mutation)                 |  —  |
| [`no-headers-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-headers-mutation)                     |  —  |
| [`no-history-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-history-mutation)                     |  —  |
| [`no-let`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-let)                                               |  💡 |
| [`no-location-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-location-mutation)                   |  —  |
| [`no-loop-statement`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-loop-statement)                         |  —  |
| [`no-map-set-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-map-set-mutation)                     |  —  |
| [`no-method-signature`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-method-signature)                     |  💡 |
| [`no-mixed-interface`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-mixed-interface)                       |  —  |
| [`no-process-env-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-process-env-mutation)             |  —  |
| [`no-reflect-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-reflect-mutation)                     |  —  |
| [`no-regexp-lastindex-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-regexp-lastindex-mutation)   |  —  |
| [`no-stateful-regexp`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-stateful-regexp)                       |  —  |
| [`no-storage-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-storage-mutation)                     |  —  |
| [`no-typed-array-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-typed-array-mutation)             |  —  |
| [`no-url-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-url-mutation)                             |  —  |
| [`no-url-search-params-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-url-search-params-mutation) |  —  |
| [`readonly-array`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/readonly-array)                               |  🔧 |
| [`readonly-keyword`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/readonly-keyword)                           |  🔧 |
