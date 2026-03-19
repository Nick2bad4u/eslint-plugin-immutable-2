# no-regexp-lastindex-mutation

Disallow mutation of `RegExp#lastIndex`.

## Targeted pattern scope

This rule targets writes to `.lastIndex` on known regular-expression instances (regex literals, `RegExp(...)`, `new RegExp(...)`, and aliases).

## What this rule reports

- Assignments to `regex.lastIndex`
- Update expressions on `regex.lastIndex` (for example `regex.lastIndex++`)
- Deletions of `regex.lastIndex`
- Computed-property equivalents like `regex["lastIndex"] = ...`

## Why this rule exists

`RegExp#lastIndex` is mutable hidden state that changes matching behavior across calls. Manual writes to it can introduce nondeterministic behavior and coupling between call sites.

This rule enforces immutable regex flow by disallowing explicit `lastIndex` mutation.

## ❌ Incorrect

```ts
const matcher = /foo/;
matcher.lastIndex = 0;
```

## ✅ Correct

```ts
const matcher = /foo/;
matcher.source;
```

## Additional examples

```ts
// ❌ Mutates regex cursor state
const matcher = new RegExp("foo", "g");
matcher.lastIndex++;

// ✅ Uses regex without explicit cursor mutation
const matcher = new RegExp("foo", "g");
matcher.test("foo");
```

## ESLint flat config example

```ts
import immutable from "eslint-plugin-immutable-2";

export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx}"],
        plugins: { immutable },
        rules: {
            "immutable/no-regexp-lastindex-mutation": "error",
        },
    },
];
```

## When not to use it

If your code intentionally manipulates `lastIndex` for specialized parsing pipelines, this rule may be too strict for that subsystem.

> **Rule catalog ID:** R931

## Further reading

- [`RegExp.prototype.lastIndex` on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex)
