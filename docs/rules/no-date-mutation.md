# no-date-mutation

Disallow in-place mutation of `Date` objects.

## Targeted pattern scope

This rule targets mutating Date setter methods on known `Date` instances (for example variables initialized from `new Date(...)`).

## What this rule reports

- `Date` mutator methods such as:
  - `setFullYear`, `setMonth`, `setDate`
  - `setHours`, `setMinutes`, `setSeconds`, `setMilliseconds`
  - UTC variants such as `setUTCMonth` and `setUTCDate`
  - `setTime` and `setYear`

## Why this rule exists

`Date` is mutable by default. In-place updates silently alter shared references and can create hard-to-reproduce bugs in scheduling, caching, and state management code.

## ❌ Incorrect

```ts
const deadline = new Date();
deadline.setMonth(11);
```

## ✅ Correct

```ts
const deadline = new Date();
const nextDeadline = new Date(deadline.getTime());
nextDeadline.setMonth(11);
```

## Additional examples

```ts
// ❌ Mutates shared instance through alias
const now = new Date();
const alias = now;
alias.setTime(0);

// ✅ Computes a derived timestamp, then builds a new Date
const now = new Date();
const next = new Date(now.getTime() + 60_000);
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-date-mutation": "error",
        },
    },
];
```

## When not to use it

If your project intentionally mutates `Date` values in low-level temporal math helpers and guarantees no shared references, this rule can be noisy. Consider limiting enforcement to application layers where immutable time values improve predictability.

> **Rule catalog ID:** R916

## Further reading

- [`Date` on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
