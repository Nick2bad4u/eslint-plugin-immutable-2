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

`recommended` is the low-friction default preset. It works out of the box with
the bundled parser wiring, and it gains additional semantic precision when you
enable typed parser services for rules such as `immutable-data`. Move to
`immutable` when you want `no-let`, readonly typing, and the warning-level
`no-method-signature` rule in your baseline.

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
                // Enable when you want checker-backed precision.
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
2. Move to `immutable` when the team is ready for broader declaration and readonly typing discipline.
3. Fix violations in small batches.
4. Move to `functional-lite` for structural functional constraints such as loop and conditional restrictions.
5. Move to `functional` once the team is ready for stricter statement, exception, and `this` bans.
6. Use `all` when you want every immutable rule enabled.

## Need a subset instead of a full preset?

- `immutable.configs.immutable`
- `immutable.configs["functional-lite"]`
- `immutable.configs.functional`

See the **Presets** section in this sidebar for details and examples.
