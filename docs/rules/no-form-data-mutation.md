# no-form-data-mutation

Disallow in-place mutation of `FormData` instances.

## Targeted pattern scope

This rule targets mutating calls on known `FormData` instances created via `new FormData(...)`, including direct constructor expressions and tracked variable aliases.

## What this rule reports

- `FormData` mutations via `.append(...)`
- `FormData` mutations via `.delete(...)`
- `FormData` mutations via `.set(...)`

## Why this rule exists

`FormData` values are frequently shared across upload flows, API abstractions, and retry logic. Mutating a shared `FormData` object in place can cause duplicate fields, missing values, and request drift.

This rule keeps payload assembly predictable by encouraging new `FormData` values rather than mutating existing instances.

## ❌ Incorrect

```ts
const payload = new FormData();
payload.append("file", avatarBlob);
```

## ✅ Correct

```ts
const payload = new FormData();
payload.get("file");
```

## Additional examples

```ts
// ❌ Mutates shared payload state
const payload = new FormData();
payload.set("userId", "42");

// ✅ Construct a derived payload instead
const payload = new FormData();
const nextPayload = new FormData();
nextPayload.get("userId");
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-form-data-mutation": "error",
        },
    },
];
```

## When not to use it

If your codebase intentionally mutates `FormData` objects as imperative builders and that behavior is tightly controlled, this rule may be too strict.

> **Rule catalog ID:** R920

## Further reading

- [`FormData` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
