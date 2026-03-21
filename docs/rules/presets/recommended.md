---
title: Recommended preset
---

# 🔵 Recommended

Use this preset as the default low-friction entrypoint focused on high-signal mutation hazards.

## Config key

```ts
immutable.configs.recommended
```

## Flat Config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [immutable.configs.recommended];
```

Move to `immutable` when you also want `no-let`, readonly typing, and warning-level method-signature guidance in your baseline. For stronger functional constraints after that, move to `functional-lite`, then `functional`, or use `all` for full coverage.

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
| [`no-cookie-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-cookie-mutation)                       |  —  |
| [`no-data-view-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-data-view-mutation)                 |  —  |
| [`no-date-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-date-mutation)                           |  —  |
| [`no-dom-token-list-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-dom-token-list-mutation)       |  —  |
| [`no-form-data-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-form-data-mutation)                 |  —  |
| [`no-headers-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-headers-mutation)                     |  —  |
| [`no-history-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-history-mutation)                     |  —  |
| [`no-location-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-location-mutation)                   |  —  |
| [`no-map-set-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-map-set-mutation)                     |  —  |
| [`no-process-env-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-process-env-mutation)             |  —  |
| [`no-reflect-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-reflect-mutation)                     |  —  |
| [`no-regexp-lastindex-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-regexp-lastindex-mutation)   |  —  |
| [`no-stateful-regexp`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-stateful-regexp)                       |  —  |
| [`no-storage-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-storage-mutation)                     |  —  |
| [`no-typed-array-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-typed-array-mutation)             |  —  |
| [`no-url-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-url-mutation)                             |  —  |
| [`no-url-search-params-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-url-search-params-mutation) |  —  |
