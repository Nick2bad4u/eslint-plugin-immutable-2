---
title: Getting Started
description: Enable eslint-plugin-immutable-2 quickly in Flat Config.
---

# Getting Started

Install the plugin:

```bash
npm install --save-dev eslint-plugin-immutable-2 typescript
```

Enable one preset in your Flat Config:

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    immutable.configs.recommended,
];
```

`recommended` is an alias of `immutable` and does not require type information.

## Alternative: manual scoped setup

If you prefer to apply plugin rules inside your own file-scoped config object, spread the preset rules manually.

```ts
import tsParser from "@typescript-eslint/parser";
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{ts,tsx,mts,cts}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                // Enable only when using a type-aware preset.
                // projectService: true,
                sourceType: "module",
            },
        },
        plugins: {
            immutable,
        },
        rules: {
            ...immutable.configs.recommended.rules,
        },
    },
];
```

Use this pattern when you only extend rules and want full control over parser setup per scope.

## Recommended rollout

1. Start with `recommended`.
2. Fix violations in small batches.
3. Move to `functional-lite` for structural functional constraints such as loop and conditional restrictions.
4. Move to `functional` once the team is ready for stricter statement, exception, and `this` bans.
5. Use `all` when you want every immutable rule enabled.

## Need a subset instead of a full preset?

- `immutable.configs.immutable`
- `immutable.configs["functional-lite"]`
- `immutable.configs.functional`

See the **Presets** section in this sidebar for details and examples.
