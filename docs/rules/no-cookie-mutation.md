# no-cookie-mutation

Disallow in-place mutation of cookie state.

## Targeted pattern scope

This rule targets cookie mutation through `document.cookie` writes and through `CookieStore` mutator calls.

## What this rule reports

- Assignments/deletes/updates involving `document.cookie`
- `cookieStore.set(...)`
- `cookieStore.delete(...)`

## Why this rule exists

Cookies are shared mutable global state. Direct writes can introduce hidden side effects across modules, requests, and security boundaries.

This rule enforces immutable cookie handling patterns by disallowing direct cookie mutation primitives.

## ❌ Incorrect

```ts
document.cookie = "theme=dark";
```

## ✅ Correct

```ts
const rawCookie = document.cookie;
```

## Additional examples

```ts
// ❌ Mutates cookie storage via CookieStore API
await cookieStore.set({ name: "theme", value: "dark" });

// ✅ Read-only cookie access
await cookieStore.get("theme");
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-cookie-mutation": "error",
        },
    },
];
```

## When not to use it

If your platform intentionally centralizes imperative cookie writes in a dedicated adapter, this rule may be too strict outside that adapter layer.

> **Rule catalog ID:** R934

## Further reading

- [`Document.cookie` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie)
- [`CookieStore` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/CookieStore)
