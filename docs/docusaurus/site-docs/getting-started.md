---
sidebar_position: 2
---

# Getting Started

Install the plugin:

```bash
npm install --save-dev eslint-plugin-immutable-2
```

Then enable it in your Flat Config:

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        plugins: {
            immutable,
        },
        rules: {
            "immutable/prefer-immutable-is-defined": "error",
        },
    },
];
```

## Recommended approach

- Start with one ruleset (`immutable.configs.recommended` or `immutable.configs.strict`).
- Fix violations in small batches.
- Promote warnings to errors after stabilization.

## Rule navigation

Use the sidebar **Rules** section for the full list of rule docs synced from the repository.
