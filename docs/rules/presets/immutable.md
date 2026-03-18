---
title: Immutable preset
---

# 🟠 Immutable

Use this preset as the baseline immutable-data policy.

## Config key

```ts
immutable.configs.immutable
```

## Flat Config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [immutable.configs.immutable];
```

This preset focuses on immutable data declarations and readonly typing rules.