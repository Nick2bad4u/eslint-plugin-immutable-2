# no-map-set-mutation

Disallow in-place mutation of `Map`, `Set`, `WeakMap`, and `WeakSet` instances.

## Targeted pattern scope

This rule targets collection mutator calls on known collection instances created via `new Map(...)`, `new Set(...)`, `new WeakMap(...)`, and `new WeakSet(...)`.

## What this rule reports

- `Map` and `WeakMap` mutations via `.set(...)` and `.delete(...)`
- `Set` and `WeakSet` mutations via `.add(...)` and `.delete(...)`
- `Map` and `Set` mutations via `.clear(...)`

## Why this rule exists

Mutable collections are a common hidden state channel. Mutating an existing `Map`/`Set` makes data flow harder to reason about, especially when references are shared across modules or async paths.

## ❌ Incorrect

```ts
const indexById = new Map<string, number>();
indexById.set("u1", 1);

const activeTags = new Set<string>();
activeTags.add("new");
```

## ✅ Correct

```ts
const indexById = new Map<string, number>([["u1", 1]]);

const activeTags = new Set<string>(["new"]);
```

## Additional examples

```ts
// ❌ Mutates an existing shared cache
const cache = new WeakMap<object, number>();
cache.set(target, 1);

// ✅ Creates a new cache value from previous entries
const nextCache = new Map(existingCache);
nextCache.set(target, 1);
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-map-set-mutation": "error",
        },
    },
];
```

## When not to use it

If your codebase intentionally uses long-lived mutable caches and mutation-heavy data structures for performance-critical internals, this rule may be too strict. In that case, keep it enabled for application/business logic and override it in narrowly scoped infrastructure files.

> **Rule catalog ID:** R915

## Further reading

- [`Map` on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [`Set` on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
