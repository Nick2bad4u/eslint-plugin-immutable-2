# no-process-env-mutation

Disallow in-place mutation of `process.env`.

## Targeted pattern scope

This rule targets direct writes to `process.env` and writes through aliases derived from `process.env`.

## What this rule reports

- Property assignments such as `process.env.NODE_ENV = "production"`
- Computed property assignments such as `process.env["API_KEY"] = "..."`
- Deletions such as `delete process.env.DEBUG`
- Update operators such as `process.env.RETRY_COUNT++`
- Reassigning the env object such as `process.env = { ...process.env, MODE: "test" }`

## Why this rule exists

`process.env` acts as shared process-global configuration. Mutating it at runtime introduces hidden global state changes that can produce nondeterministic behavior across modules and tests.

This rule enforces immutable environment handling by disallowing runtime `process.env` mutation patterns.

## ❌ Incorrect

```ts
process.env.NODE_ENV = "production";
```

## ✅ Correct

```ts
const mode = process.env.NODE_ENV ?? "development";
```

## Additional examples

```ts
// ❌ Deletes shared global process state
const shouldReset = true;
if (shouldReset) {
    delete process.env.DEBUG;
}

// ✅ Derives immutable config from environment
const config = {
    debug: process.env.DEBUG === "1",
};
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-process-env-mutation": "error",
        },
    },
];
```

## When not to use it

If your runtime intentionally rewrites `process.env` as part of a controlled bootstrap strategy, this rule may be too strict for that narrow initialization layer.

> **Rule catalog ID:** R926

## Further reading

- [`process.env` in Node.js docs](https://nodejs.org/api/process.html#processenv)
