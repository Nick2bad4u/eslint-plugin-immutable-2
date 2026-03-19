# no-stateful-regexp

Disallow stateful `RegExp` flags (`g` and `y`) that mutate `lastIndex`.

## Targeted pattern scope

This rule targets regular expressions that include global (`g`) or sticky (`y`) flags, because those flags introduce mutable `lastIndex` state.

## What this rule reports

- Regex literals like `/pattern/g` and `/pattern/y`
- `RegExp("pattern", "g")`, `RegExp("pattern", "y")`
- `new RegExp("pattern", "g")`, `new RegExp("pattern", "y")`
- Static template-literal flags such as ``new RegExp("pattern", `gy`)``

## Why this rule exists

Regexes with `g` or `y` mutate `lastIndex` as they are used. This hidden mutable state can leak across calls and cause nondeterministic behavior when regex instances are reused.

This rule favors immutable matching patterns by preventing stateful regex configuration at declaration sites.

## ❌ Incorrect

```ts
const matcher = /foo/g;
```

## ✅ Correct

```ts
const matcher = /foo/;
```

## Additional examples

```ts
// ❌ Stateful regex instance
const matcher = new RegExp("token", "my");

// ✅ Non-stateful regex instance
const matcher = new RegExp("token", "m");
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-stateful-regexp": "error",
        },
    },
];
```

## When not to use it

If your code intentionally depends on `lastIndex`-driven iteration behavior with reusable regex objects, this rule may be too strict for those specialized routines.

> **Rule catalog ID:** R928

## Further reading

- [`RegExp.prototype.lastIndex` on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex)
