---
title: Overview
description: README-style overview for eslint-plugin-immutable-2.
---

# eslint-plugin-immutable-2

ESLint plugin for teams that want consistent immutable and functional TypeScript conventions.

The plugin ships focused presets for modern Flat Config usage.

## Installation

```bash
npm install --save-dev eslint-plugin-immutable-2 typescript
```

> `@typescript-eslint/parser` is loaded automatically by plugin presets.

## Quick start (Flat Config)

```ts
import immutable from "eslint-plugin-immutable-2";

export default [immutable.configs.recommended];
```

`recommended` maps to the `immutable` baseline preset.

## Presets

| Preset                                    | Preset page                                     |
| ----------------------------------------- | ----------------------------------------------- |
| 🟢 `immutable.configs["functional-lite"]` | [Functional Lite](./presets/functional-lite.md) |
| 🟡 `immutable.configs.functional`         | [Functional](./presets/functional.md)           |
| 🟠 `immutable.configs.immutable`          | [Immutable](./presets/immutable.md)             |
| 🔵 `immutable.configs.recommended`        | [Recommended](./presets/recommended.md)         |
| 🟣 `immutable.configs.all`                | [All](./presets/all.md)                         |

## Next steps

- Open **Getting Started** in this sidebar.
- Browse [**Presets**](./presets/index.md) for preset-by-preset guidance.
- Use **Rules** to review every rule with examples.
