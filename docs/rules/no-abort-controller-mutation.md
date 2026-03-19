# no-abort-controller-mutation

Disallow in-place mutation of `AbortController` state.

## Targeted pattern scope

This rule targets calls to mutating `AbortController` instance APIs on known controller objects and aliases.

## What this rule reports

- `controller.abort()` on known `AbortController` values

## Why this rule exists

`AbortController` exposes mutable cancellation state shared through `AbortSignal`. Triggering `abort()` mutates global request-flow state and can introduce implicit side effects when controllers are reused.

This rule helps maintain immutable cancellation modeling by disallowing direct controller-state mutation.

## ❌ Incorrect

```ts
const controller = new AbortController();
controller.abort();
```

## ✅ Correct

```ts
const controller = new AbortController();
controller.signal;
```

## Additional examples

```ts
// ❌ Mutates cancellation state through alias
const source = new AbortController();
const alias = source;
alias.abort("timeout");

// ✅ Reads immutable signal reference
const source = new AbortController();
const signal = source.signal;
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-abort-controller-mutation": "error",
        },
    },
];
```

## When not to use it

If your architecture intentionally performs imperative cancellation by calling `abort()` in a dedicated orchestration layer, this rule may be too strict for that layer.

> **Rule catalog ID:** R932

## Further reading

- [`AbortController` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
