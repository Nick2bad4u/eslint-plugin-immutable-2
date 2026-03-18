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

export default [immutable.configs.recommended];
```

For JavaScript-only projects, this works out of the box.

For TypeScript projects, you can enable type-aware linting in ESLint when you
want deeper semantic analysis.

## Recommended approach

- Start with one ruleset (`immutable.configs.recommended` or `immutable.configs["functional-lite"]`).
- Fix violations in small batches.
- Promote warnings to errors after stabilization.

## Rule navigation

Use the sidebar **Rules** section for the full list of rule docs synced from the repository.
