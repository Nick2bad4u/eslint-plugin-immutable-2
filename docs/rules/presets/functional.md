---
title: Functional preset
---

# 🟡 Functional

Use this preset when you want strict functional-style constraints as your default.

## Config key

```ts
immutable.configs.functional
```

## Flat Config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [immutable.configs.functional];
```

`functional` enables stronger statement and control-flow restrictions than `functional-lite`.