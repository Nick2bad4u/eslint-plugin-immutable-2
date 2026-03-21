# eslint-plugin-immutable-2

[![npm license.](https://flat.badgen.net/npm/license/eslint-plugin-immutable-2?color=purple)](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/blob/main/LICENSE) [![npm total downloads.](https://flat.badgen.net/npm/dt/eslint-plugin-immutable-2?color=pink)](https://www.npmjs.com/package/eslint-plugin-immutable-2) [![latest GitHub release.](https://flat.badgen.net/github/release/Nick2bad4u/eslint-plugin-immutable-2?color=cyan)](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/releases) [![GitHub stars.](https://flat.badgen.net/github/stars/Nick2bad4u/eslint-plugin-immutable-2?color=yellow)](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/stargazers) [![GitHub forks.](https://flat.badgen.net/github/forks/Nick2bad4u/eslint-plugin-immutable-2?color=green)](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/forks) [![GitHub open issues.](https://flat.badgen.net/github/open-issues/Nick2bad4u/eslint-plugin-immutable-2?color=red)](https://github.com/Nick2bad4u/eslint-plugin-immutable-2/issues) [![codecov.](https://codecov.io/gh/Nick2bad4u/eslint-plugin-immutable-2/branch/main/graph/badge.svg)](https://codecov.io/gh/Nick2bad4u/eslint-plugin-immutable-2) [![Mutation testing badge.](https://img.shields.io/endpoint?style=flat-square\&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2FNick2bad4u%2Feslint-plugin-immutable-2%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/Nick2bad4u/eslint-plugin-immutable-2/main)

ESLint plugin for teams that want TypeScript-first immutability and
functional-style conventions in modern flat config projects.

The plugin ships focused flat-config presets with parser setup already wired in.

## Table of contents

1. [Installation](#installation)
2. [Quick start (flat config)](#quick-start-flat-config)
3. [Presets](#presets)
4. [Configuration examples by preset](#configuration-examples-by-preset)
5. [Global settings](#global-settings)
6. [Rules](#rules)
7. [Contributors ✨](#contributors-)

## Installation

```sh
npm install --save-dev eslint-plugin-immutable-2 typescript
```

> `@typescript-eslint/parser` is loaded automatically by plugin presets.

### Compatibility

- **Supported ESLint versions:** `9.x` and `10.x`
- **Config system:** Flat Config only (`eslint.config.*`)
- **Node.js runtime:** `>=22.0.0`

## Quick start (flat config)

```js
import immutable from "eslint-plugin-immutable-2";

export default [immutable.configs.recommended];
```

That is enough for the default JS/TS preset file globs
(`**/*.{js,cjs,mjs,jsx,ts,tsx,mts,cts}`).

## Presets

This plugin intentionally exports five presets:

| Preset                                                                                                          | Config key                                                                                                                          | Use when                                                                                   |
| --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [🟢 Functional Lite](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) | [`immutable.configs["functional-lite"]`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) | You want a moderate step up from `immutable` with lightweight structural functional rules. |
| [🟡 Functional](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional)           | [`immutable.configs.functional`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional)              | You want the strict functional tier without turning on every rule in the plugin.           |
| [🟠 Immutable](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable)             | [`immutable.configs.immutable`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable)                | You want the low-friction immutable baseline without broader functional bans.              |
| [🔵 Recommended](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended)         | [`immutable.configs.recommended`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended)            | You want the familiar default entrypoint; it is currently an alias of `immutable`.         |
| [🟣 All](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all)                         | [`immutable.configs.all`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all)                            | You want every rule in this plugin enabled.                                                |

## Configuration examples by preset

```js
import immutable from "eslint-plugin-immutable-2";

export default [
  // Smallest migration step into this plugin.
  immutable.configs.recommended,

  // Same rules as recommended, but with the explicit immutable preset key.
  // immutable.configs.immutable,

  // Moderate structural functional step-up from the immutable baseline.
  // immutable.configs["functional-lite"],

  // Strict functional-style coverage without enabling every rule.
  // immutable.configs.functional,

  // Every rule in the plugin.
  // immutable.configs.all,
];
```

### Parser setup behavior

Each preset already includes:

- `files: ["**/*.{js,cjs,mjs,jsx,ts,tsx,mts,cts}"]`
- `languageOptions.parser` (`@typescript-eslint/parser`)
- `languageOptions.parserOptions`:
  - `ecmaVersion: "latest"`
  - `sourceType: "module"`

End users usually do **not** need to wire parser config manually.

If you need custom parser options (for example `project`, `projectService`, or
`tsconfigRootDir`), extend a preset:

```js
import immutable from "eslint-plugin-immutable-2";

const recommended = immutable.configs.recommended;

export default [
  {
    ...recommended,
    languageOptions: {
      ...recommended.languageOptions,
      parserOptions: {
        ...recommended.languageOptions?.parserOptions,
        projectService: true,
      },
    },
  },
];
```

## Global settings

You can globally disable autofixes that add missing imports while still keeping
rule reports and non-import autofixes enabled.

```js
import immutable from "eslint-plugin-immutable-2";

export default [
  {
    ...immutable.configs.recommended,
    settings: {
      immutable: {
        // Disable all autofixes while keeping suggestions enabled.
        // disableAllAutofixes: true,

        // Disable only autofixes that add missing imports.
        disableImportInsertionFixes: true,
      },
    },
  },
];
```

When `settings.immutable.disableImportInsertionFixes` is `true`, rules that
would normally add a missing helper import will report
without applying that import-adding autofix. Autofixes that do not require
inserting a new import (for example, when the replacement symbol is already in
scope) still apply.

When `settings.immutable.disableAllAutofixes` is `true`, all rule autofixes are
suppressed, but reports and suggestions remain available.

If both settings are enabled, `disableAllAutofixes` takes precedence for
autofix behavior.

## Rules

- `Fix` legend:
  - `🔧` = autofixable
  - `💡` = suggestions available
  - `—` = report only
- `Preset key` legend:
  - [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) — [`immutable.configs["functional-lite"]`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite)
  - [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) — [`immutable.configs.functional`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional)
  - [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) — [`immutable.configs.immutable`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable)
  - [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) — [`immutable.configs.recommended`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended)
  - [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) — [`immutable.configs.all`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all)

| Rule                                                                                                                               | Fix | Preset key                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------- | :-: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`immutable-data`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/immutable-data)                               |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-abort-controller-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-abort-controller-mutation)   |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-atomics-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-atomics-mutation)                     |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-buffer-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-buffer-mutation)                       |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-cache-api-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-cache-api-mutation)                 |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-class`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-class)                                           |  —  | [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all)                                                                                                                                                                                                                                                                                       |
| [`no-conditional-statement`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-conditional-statement)           |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all)                                                                                                                                                                                       |
| [`no-cookie-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-cookie-mutation)                       |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-data-view-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-data-view-mutation)                 |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-date-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-date-mutation)                           |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-dom-token-list-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-dom-token-list-mutation)       |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-expression-statement`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-expression-statement)             |  —  | [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all)                                                                                                                                                                                                                                                                                       |
| [`no-form-data-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-form-data-mutation)                 |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-headers-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-headers-mutation)                     |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-history-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-history-mutation)                     |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-let`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-let)                                               |  💡 | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-location-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-location-mutation)                   |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-loop-statement`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-loop-statement)                         |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all)                                                                                                                                                                                       |
| [`no-map-set-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-map-set-mutation)                     |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-method-signature`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-method-signature)                     |  💡 | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-mixed-interface`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-mixed-interface)                       |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all)                                                                                                                                                                                       |
| [`no-process-env-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-process-env-mutation)             |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-reflect-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-reflect-mutation)                     |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-regexp-lastindex-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-regexp-lastindex-mutation)   |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-reject`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-reject)                                         |  —  | [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all)                                                                                                                                                                                                                                                                                                                                                                                  |
| [`no-stateful-regexp`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-stateful-regexp)                       |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-storage-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-storage-mutation)                     |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-this`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-this)                                             |  —  | [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all)                                                                                                                                                                                                                                                                                       |
| [`no-throw`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-throw)                                           |  —  | [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all)                                                                                                                                                                                                                                                                                       |
| [`no-try`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-try)                                               |  —  | [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all)                                                                                                                                                                                                                                                                                       |
| [`no-typed-array-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-typed-array-mutation)             |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-url-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-url-mutation)                             |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`no-url-search-params-mutation`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/no-url-search-params-mutation) |  —  | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`readonly-array`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/readonly-array)                               |  🔧 | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |
| [`readonly-keyword`](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/readonly-keyword)                           |  🔧 | [🟢](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional-lite) [🟡](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/functional) [🟠](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/immutable) [🔵](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/recommended) [🟣](https://nick2bad4u.github.io/eslint-plugin-immutable-2/docs/rules/presets/all) |

## Contributors ✨

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors.](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- prettier-ignore-start -->

<!-- markdownlint-disable -->

<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="25%"><a href="https://github.com/Nick2bad4u"><img src="https://avatars.githubusercontent.com/u/20943337?v=4?s=80" width="80px;" alt="Nick2bad4u"/><br /><sub><b>Nick2bad4u</b></sub></a><br /><a href="https://github.com/Nick2bad4u/eslint-plugin-immutable-2/issues?q=author%3ANick2bad4u" title="Bug reports">🐛</a> <a href="https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commits?author=Nick2bad4u" title="Code">💻</a> <a href="https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commits?author=Nick2bad4u" title="Documentation">📖</a> <a href="#ideas-Nick2bad4u" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-Nick2bad4u" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-Nick2bad4u" title="Maintenance">🚧</a> <a href="https://github.com/Nick2bad4u/eslint-plugin-immutable-2/pulls?q=is%3Apr+reviewed-by%3ANick2bad4u" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commits?author=Nick2bad4u" title="Tests">⚠️</a> <a href="#tool-Nick2bad4u" title="Tools">🔧</a></td>
      <td align="center" valign="top" width="25%"><a href="https://snyk.io/"><img src="https://avatars.githubusercontent.com/u/19733683?v=4?s=80" width="80px;" alt="Snyk bot"/><br /><sub><b>Snyk bot</b></sub></a><br /><a href="#security-snyk-bot" title="Security">🛡️</a> <a href="#infra-snyk-bot" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-snyk-bot" title="Maintenance">🚧</a> <a href="https://github.com/Nick2bad4u/eslint-plugin-immutable-2/pulls?q=is%3Apr+reviewed-by%3Asnyk-bot" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="25%"><a href="https://www.stepsecurity.io/"><img src="https://avatars.githubusercontent.com/u/89328645?v=4?s=80" width="80px;" alt="StepSecurity Bot"/><br /><sub><b>StepSecurity Bot</b></sub></a><br /><a href="#security-step-security-bot" title="Security">🛡️</a> <a href="#infra-step-security-bot" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-step-security-bot" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="25%"><a href="https://github.com/apps/dependabot"><img src="https://avatars.githubusercontent.com/in/29110?v=4?s=80" width="80px;" alt="dependabot[bot]"/><br /><sub><b>dependabot[bot]</b></sub></a><br /><a href="#infra-dependabot[bot]" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#security-dependabot[bot]" title="Security">🛡️</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="25%"><a href="https://github.com/apps/github-actions"><img src="https://avatars.githubusercontent.com/in/15368?v=4?s=80" width="80px;" alt="github-actions[bot]"/><br /><sub><b>github-actions[bot]</b></sub></a><br /><a href="https://github.com/Nick2bad4u/eslint-plugin-immutable-2/commits?author=github-actions[bot]" title="Code">💻</a> <a href="#infra-github-actions[bot]" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->

<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
