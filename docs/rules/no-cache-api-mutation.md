# no-cache-api-mutation

Disallow in-place mutation of Service Worker Cache API state.

## Targeted pattern scope

This rule targets mutating methods on `CacheStorage` (`caches`) and `Cache` instances derived from `caches.open(...)`.

## What this rule reports

- `caches.delete(...)`
- `cache.add(...)`
- `cache.addAll(...)`
- `cache.put(...)`
- `cache.delete(...)`

## Why this rule exists

Cache API writes mutate shared offline/network state that may be observed across requests, tabs, and worker lifecycles. In-place mutations can make behavior nondeterministic and hard to reason about.

This rule encourages immutable cache derivation flows instead of direct mutable writes.

## ❌ Incorrect

```ts
caches.delete("v1");
```

## ✅ Correct

```ts
caches.keys();
```

## Additional examples

```ts
// ❌ Mutates cache entries in place
async function hydrate(req: Request, res: Response): Promise<void> {
    const cache = await caches.open("v1");
    await cache.put(req, res);
}

// ✅ Read-only cache access
async function read(req: Request): Promise<Response | undefined> {
    const cache = await caches.open("v1");
    return await cache.match(req) ?? undefined;
}
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-cache-api-mutation": "error",
        },
    },
];
```

## When not to use it

If your service worker intentionally performs imperative cache writes in a dedicated caching subsystem, this rule may be too strict for those modules.

> **Rule catalog ID:** R933

## Further reading

- [`Cache` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [`CacheStorage` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage)
