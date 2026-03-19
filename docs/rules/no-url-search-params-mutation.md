# no-url-search-params-mutation

Disallow in-place mutation of `URLSearchParams` instances.

## Targeted pattern scope

This rule targets mutating calls on values created from `new URLSearchParams(...)`, including direct constructor expressions and tracked variable aliases.

## What this rule reports

- `URLSearchParams` mutations via `.append(...)`
- `URLSearchParams` mutations via `.delete(...)`
- `URLSearchParams` mutations via `.set(...)`
- `URLSearchParams` mutations via `.sort(...)`

## Why this rule exists

`URLSearchParams` values are frequently passed between routers, HTTP clients, and link builders. In-place updates silently mutate shared references and can leak unintended query changes.

This rule encourages immutable query composition by preventing mutation after construction.

## ❌ Incorrect

```ts
const params = new URLSearchParams("page=1");
params.set("page", "2");
```

## ✅ Correct

```ts
const params = new URLSearchParams("page=1");
params.get("page");
```

## Additional examples

```ts
// ❌ Mutates shared query instance
const base = new URLSearchParams("debug=false");
base.append("user", "42");

// ✅ Creates a derived query object
const base = new URLSearchParams("debug=false");
const next = new URLSearchParams(base.toString());
next.get("debug");
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-url-search-params-mutation": "error",
        },
    },
];
```

## When not to use it

If your code intentionally uses mutable query-builder objects and mutability is a deliberate design choice, this rule may be too strict.

> **Rule catalog ID:** R918

## Further reading

- [`URLSearchParams` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
