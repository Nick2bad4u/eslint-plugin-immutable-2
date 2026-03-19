# no-location-mutation

Disallow in-place mutation of browser `location` state.

## Targeted pattern scope

This rule targets global `location` objects (`location`, `window.location`, `self.location`, `globalThis.location`) and aliases when mutation APIs are used or location properties are assigned/deleted/updated.

## What this rule reports

- `location.assign(...)`
- `location.reload(...)`
- `location.replace(...)`
- Property assignments/deletes/updates on `location` and tracked aliases (for example `location.href = ...`)

## Why this rule exists

`location` represents process-wide browser navigation state. Mutating it in place triggers implicit global effects and makes control flow harder to reason about in immutable architectures.

This rule enforces immutable navigation intent by preventing direct location mutations.

## ❌ Incorrect

```ts
location.href = "https://example.com";
```

## ✅ Correct

```ts
const currentPath = location.pathname;
```

## Additional examples

```ts
// ❌ Mutates global navigation state
const navLocation = location;
navLocation.replace("/account");

// ✅ Read-only location usage
const navLocation = location;
navLocation.pathname;
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-location-mutation": "error",
        },
    },
];
```

## When not to use it

If your runtime intentionally performs direct browser redirects in a narrow infrastructure layer, this rule may be too strict for those files.

> **Rule catalog ID:** R930

## Further reading

- [`Location` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Location)
