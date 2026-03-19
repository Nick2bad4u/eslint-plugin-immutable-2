# no-storage-mutation

Disallow in-place mutation of `localStorage` and `sessionStorage`.

## Targeted pattern scope

This rule targets browser storage singletons (`localStorage` and `sessionStorage`) and aliases derived from them.

## What this rule reports

- `localStorage.setItem(...)`
- `localStorage.removeItem(...)`
- `localStorage.clear(...)`
- `sessionStorage.setItem(...)`, `removeItem(...)`, and `clear(...)`
- Property writes/deletes/updates on storage objects and tracked aliases

## Why this rule exists

Web storage is shared mutable global state. In-place writes from multiple modules create implicit coupling and make application state transitions difficult to reason about and test.

This rule promotes immutable architecture by preventing direct mutation of storage primitives and encouraging explicit state derivation flows.

## ❌ Incorrect

```ts
localStorage.setItem("theme", "dark");
```

## ✅ Correct

```ts
const theme = localStorage.getItem("theme") ?? "light";
```

## Additional examples

```ts
// ❌ Mutates shared storage through alias
const storage = sessionStorage;
storage.clear();

// ✅ Reads storage without mutating global state
const storage = sessionStorage;
storage.getItem("session-id");
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-storage-mutation": "error",
        },
    },
];
```

## When not to use it

If your application intentionally writes to browser storage in a tightly controlled adapter layer, this rule may be too strict outside that boundary.

> **Rule catalog ID:** R927

## Further reading

- [`Window.localStorage` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [`Window.sessionStorage` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
