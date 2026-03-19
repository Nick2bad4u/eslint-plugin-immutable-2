# no-headers-mutation

Disallow in-place mutation of `Headers` instances.

## Targeted pattern scope

This rule targets mutating calls on known `Headers` instances created via `new Headers(...)`, including direct constructor expressions and tracked variable aliases.

## What this rule reports

- `Headers` mutations via `.append(...)`
- `Headers` mutations via `.delete(...)`
- `Headers` mutations via `.set(...)`

## Why this rule exists

`Headers` objects are often passed through request middleware and fetch wrappers. In-place mutation can leak state between unrelated requests and make side effects hard to trace.

This rule encourages immutable request metadata handling by treating `Headers` instances as values rather than mutable containers.

## ❌ Incorrect

```ts
const headers = new Headers();
headers.set("x-request-id", "abc");
```

## ✅ Correct

```ts
const headers = new Headers();
headers.get("x-request-id");
```

## Additional examples

```ts
// ❌ Mutates a shared headers object
const baseHeaders = new Headers();
baseHeaders.append("x-tenant", "acme");

// ✅ Derive a new headers instance
const baseHeaders = new Headers();
const requestHeaders = new Headers(baseHeaders);
requestHeaders.get("x-tenant");
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-headers-mutation": "error",
        },
    },
];
```

## When not to use it

If your architecture intentionally relies on mutable shared `Headers` objects in low-level transport helpers, this rule may be too strict for those internals.

> **Rule catalog ID:** R919

## Further reading

- [`Headers` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Headers)
