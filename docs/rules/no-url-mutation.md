# no-url-mutation

Disallow in-place mutation of `URL` instances and `url.searchParams` mutator calls.

## Targeted pattern scope

This rule targets known `URL` instances (for example values created with `new URL(...)`) and flags mutating writes to URL state properties and mutating calls through `url.searchParams`.

## What this rule reports

- Assignments/deletes/updates on mutable URL properties such as `hash`, `host`, `hostname`, `href`, `pathname`, `port`, `protocol`, `search`, `username`, and `password`
- `url.searchParams.append(...)`
- `url.searchParams.delete(...)`
- `url.searchParams.set(...)`
- `url.searchParams.sort(...)`

## Why this rule exists

`URL` is often passed across module boundaries as a parsed, shareable resource locator. Mutating it in place makes dataflow harder to reason about and can leak accidental state changes into unrelated code paths.

This rule helps enforce immutable URL handling by requiring construction of new URL values instead of mutating existing ones.

## ❌ Incorrect

```ts
const url = new URL("https://example.com");
url.pathname = "/v2";
```

## ✅ Correct

```ts
const url = new URL("https://example.com");
const nextUrl = new URL(url.toString());
nextUrl.pathname = "/v2";
```

## Additional examples

```ts
// ❌ Mutates query params on an existing URL instance
const url = new URL("https://example.com?q=1");
url.searchParams.set("q", "2");

// ✅ Reads URL state without mutation
const url = new URL("https://example.com?q=1");
url.searchParams.get("q");
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-url-mutation": "error",
        },
    },
];
```

## When not to use it

If your architecture intentionally mutates `URL` objects in a tightly controlled builder-style layer, this rule may be too strict for those internals.

> **Rule catalog ID:** R925

## Further reading

- [`URL` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/URL)
- [`URLSearchParams` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
