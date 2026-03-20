---
title: Presets
description: Preset reference and selection guide for eslint-plugin-immutable-2.
---

# Presets

Use one of these presets based on how strongly you want to enforce immutable and functional patterns.

| Preset | Config key | Use when |
| --- | --- | --- |
| Functional Lite | `immutable.configs["functional-lite"]` | You want functional constraints with lower migration cost. |
| Functional | `immutable.configs.functional` | You want strong functional-style constraints across most code. |
| Immutable | `immutable.configs.immutable` | You want immutable defaults without the full functional surface. |
| Recommended | `immutable.configs.recommended` | Alias of `immutable` for a familiar default key. |
| All | `immutable.configs.all` | You want every rule in this plugin enabled. |

See detailed pages:

- [Functional Lite](./functional-lite.md)
- [Functional](./functional.md)
- [Immutable](./immutable.md)
- [Recommended](./recommended.md)
- [All](./all.md)

## Rule matrix

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only

- `Presets` lists every preset config that enables the rule.

| Rule | Fix | Presets |
| --- | :-: | --- |
| [`immutable-data`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/immutable-data) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-abort-controller-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-abort-controller-mutation) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-atomics-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-atomics-mutation) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-buffer-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-buffer-mutation) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-cache-api-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-cache-api-mutation) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-class`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-class) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.all`](./all.md) |
| [`no-conditional-statement`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-conditional-statement) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.all`](./all.md) |
| [`no-cookie-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-cookie-mutation) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-data-view-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-data-view-mutation) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-date-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-date-mutation) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-dom-token-list-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-dom-token-list-mutation) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-expression-statement`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-expression-statement) | — | [`immutable.configs.functional`](./functional.md), [`immutable.configs.all`](./all.md) |
| [`no-form-data-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-form-data-mutation) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-headers-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-headers-mutation) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-history-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-history-mutation) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-let`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-let) | 💡 | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-location-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-location-mutation) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-loop-statement`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-loop-statement) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.all`](./all.md) |
| [`no-map-set-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-map-set-mutation) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-method-signature`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-method-signature) | 💡 | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-mixed-interface`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-mixed-interface) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.all`](./all.md) |
| [`no-process-env-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-process-env-mutation) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-reflect-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-reflect-mutation) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-regexp-lastindex-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-regexp-lastindex-mutation) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-reject`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-reject) | — | [`immutable.configs.all`](./all.md) |
| [`no-stateful-regexp`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-stateful-regexp) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-storage-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-storage-mutation) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-this`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-this) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.all`](./all.md) |
| [`no-throw`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-throw) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.all`](./all.md) |
| [`no-try`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-try) | — | [`immutable.configs.functional`](./functional.md), [`immutable.configs.all`](./all.md) |
| [`no-typed-array-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-typed-array-mutation) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-url-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-url-mutation) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`no-url-search-params-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-url-search-params-mutation) | — | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`readonly-array`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/readonly-array) | 🔧 | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
| [`readonly-keyword`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/readonly-keyword) | 🔧 | [`immutable.configs["functional-lite"]`](./functional-lite.md), [`immutable.configs.functional`](./functional.md), [`immutable.configs.immutable`](./immutable.md), [`immutable.configs.recommended`](./recommended.md), [`immutable.configs.all`](./all.md) |
